import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ImageUpload';
import { ParameterForm, type ParameterFormValues } from '@/components/ParameterForm';
import { RecommendationResult } from '@/components/RecommendationResult';
import { sendChatStream, type ChatMessage } from '@/utils/ai-chat';
import { generateKnowledgeBaseFromDB } from '@/data/ac-products';
import { getAllProducts, getAllCases } from '@/db/api';
import type { ACProduct, HistoricalCase } from '@/types/types';
import { toast } from 'sonner';
import { AirVent, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const APP_ID = import.meta.env.VITE_APP_ID;
const AI_ENDPOINT = 'https://api-integrations.appmiaoda.com/app-7ua9s9vs9fr5/api-2jBYdN3A9Jyz/v2/chat/completions';

export default function Home() {
  const navigate = useNavigate();
  const [imageBase64, setImageBase64] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [products, setProducts] = useState<ACProduct[]>([]);
  const [cases, setCases] = useState<HistoricalCase[]>([]);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [productsData, casesData] = await Promise.all([
      getAllProducts(),
      getAllCases()
    ]);
    setProducts(productsData);
    setCases(casesData);
    setLoading(false);
  };

  const handleImageSelect = (base64: string) => {
    setImageBase64(base64);
    setRecommendation('');
  };

  const handleSubmit = async (values: ParameterFormValues) => {
    if (!imageBase64) {
      toast.error('请先上传户型图');
      return;
    }

    setIsAnalyzing(true);
    setRecommendation('');

    abortControllerRef.current = new AbortController();

    // 从数据库数据生成知识库
    const knowledgeBase = await generateKnowledgeBaseFromDB(products, cases);

    let prompt = `请作为一名专业的空调方案顾问，分析这张户型图，并根据以下产品知识库和历史案例提供详细的空调配置方案。

${knowledgeBase}

---

## 用户信息`;

    if (values.roomCount) {
      prompt += `\n- 房间数量：${values.roomCount}`;
    }

    if (values.orientation) {
      const orientationMap: Record<string, string> = {
        south: '南向',
        north: '北向',
        east: '东向',
        west: '西向',
        southeast: '东南向',
        southwest: '西南向',
        northeast: '东北向',
        northwest: '西北向',
      };
      prompt += `\n- 主要朝向：${orientationMap[values.orientation] || values.orientation}`;
    }

    if (values.requirements) {
      prompt += `\n- 使用需求：${values.requirements}`;
    }

    prompt += `

---

## 请按照以下结构提供推荐方案

### 1. 户型分析
- 分析户型的基本结构、总面积估算
- 分析各房间的功能、面积和特点
- 分析朝向对空调需求的影响

### 2. 相似案例参考
**重要：请先从历史案例中找出与当前户型最相似的案例（1-2个）**
- 列出相似案例的编号和标题
- 说明相似之处（面积、户型、朝向等）
- 总结该案例的解决方案和客户反馈
- 说明该案例的经验对当前户型的参考价值

### 3. 整体方案建议
- **优先参考相似案例的方案类型**（中央空调/风管机+分体式/全分体式）
- 如果采用相似案例的方案，说明理由
- 如果需要调整，说明调整的原因

### 4. 具体产品推荐
**重要：优先使用历史案例中已验证成功的产品配置**

为每个房间推荐具体产品，格式如下：

#### 房间名称（如：主卧）
- **推荐产品**：品牌 型号（产品ID: xxx）
- **匹数**：X匹
- **适用面积**：X-X㎡
- **价格**：¥X,XXX
- **推荐理由**：
  - 如果是参考历史案例：说明在哪个案例中使用过，客户反馈如何
  - 如果是新推荐：说明为什么选择这款产品，与案例产品的对比
- **安装位置**：具体的安装位置建议（参考相似案例的安装经验）

### 5. 预算估算
- 设备采购总预算：¥X,XXX（列出各产品价格）
- 安装费用预算：¥X,XXX
- 总预算范围：¥X,XXX
- **与参考案例的预算对比**：说明预算差异及原因

### 6. 注意事项
- 参考相似案例的经验总结
- 安装注意事项
- 使用建议
- 维护保养建议

**核心要求**：
1. **必须优先参考历史案例**：找出最相似的案例，优先采用其产品配置方案
2. **产品选择原则**：
   - 第一优先：历史案例中已验证成功的产品
   - 第二优先：与案例产品同品牌同系列的产品
   - 第三优先：知识库中有库存的其他产品
3. **方案类型原则**：优先采用相似案例的方案类型，除非有充分理由调整
4. **必须使用真实产品**：所有推荐的产品必须从知识库中选择，包含正确的产品ID
5. **面积匹配**：确保推荐的产品适用面积与房间面积匹配
6. **库存优先**：优先推荐有库存的产品
7. **经验传承**：充分利用历史案例的经验总结和客户反馈`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: '你是一名经验丰富的空调方案顾问，擅长根据户型图分析并提供个性化的空调配置方案。你的核心工作方法是：\n\n1. **以历史案例为基础**：优先从历史成功案例中寻找与当前户型相似的案例，参考其解决方案和产品配置\n2. **产品选择原则**：优先推荐历史案例中已验证成功的产品，这些产品有真实的客户反馈和使用经验\n3. **经验传承**：充分利用历史案例的经验总结、客户反馈和注意事项\n4. **真实可靠**：所有推荐的产品必须从知识库中选择，包含正确的产品ID，确保方案可立即实施\n5. **专业详细**：提供专业、详细、实用的建议，考虑用户的实际需求和预算\n\n你的推荐应该让客户感受到这是基于大量成功案例总结出来的成熟方案，而不是临时拼凑的方案。'
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt
          },
          {
            type: 'image_url',
            image_url: {
              url: imageBase64
            }
          }
        ]
      }
    ];

    try {
      await sendChatStream({
        endpoint: AI_ENDPOINT,
        apiId: APP_ID,
        messages,
        onUpdate: (content: string) => {
          setRecommendation(content);
        },
        onComplete: () => {
          setIsAnalyzing(false);
          toast.success('方案生成完成');
        },
        onError: (error: Error) => {
          setIsAnalyzing(false);
          const errorMessage = error.message || '分析失败，请重试';
          toast.error(`分析失败: ${errorMessage}`);
          console.error('AI analysis error:', error);
        },
        signal: abortControllerRef.current.signal
      });
    } catch (error) {
      setIsAnalyzing(false);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      toast.error(`分析失败: ${errorMessage}`);
      console.error('Analysis error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <AirVent className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              智能空调方案推荐
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            上传您的户型图，AI将为您分析并推荐最适合的空调配置方案
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    1
                  </span>
                  上传户型图
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  disabled={isAnalyzing}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    2
                  </span>
                  补充信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ParameterForm
                  onSubmit={handleSubmit}
                  disabled={isAnalyzing || !imageBase64}
                />
              </CardContent>
            </Card>
          </div>

          <div className="xl:sticky xl:top-8 h-fit">
            <RecommendationResult
              content={recommendation}
              isLoading={isAnalyzing}
            />
          </div>
        </div>

        {/* 产品知识库入口 */}
        <div className="mt-8 md:mt-12">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-primary/20 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/products')}>
            <CardContent className="pt-4 md:pt-6 pb-4 md:pb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start md:items-center gap-3 md:gap-4 flex-1">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">产品知识库</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      浏览 <span className="font-semibold text-primary">{products.length}</span> 款空调产品，了解详细参数和特点
                    </p>
                    <div className="grid grid-cols-2 md:flex md:gap-4 gap-2 mt-2 md:mt-3 text-xs md:text-sm text-muted-foreground">
                      <span>🏢 中央空调 {products.filter(p => p.type === 'central').length}款</span>
                      <span>🌬️ 风管机 {products.filter(p => p.type === 'duct').length}款</span>
                      <span>❄️ 分体式 {products.filter(p => p.type === 'split').length}款</span>
                      <span>📦 移动空调 {products.filter(p => p.type === 'portable').length}款</span>
                    </div>
                  </div>
                </div>
                <Button size="default" className="gap-2 w-full md:w-auto">
                  查看全部产品
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
