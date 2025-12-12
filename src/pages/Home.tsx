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

// 方案版本接口
interface RecommendationVersion {
  id: string;
  title: string;
  content: string;
  userFeedback?: string;
  timestamp: number;
}

export default function Home() {
  const navigate = useNavigate();
  const [imageBase64, setImageBase64] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [products, setProducts] = useState<ACProduct[]>([]);
  const [cases, setCases] = useState<HistoricalCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [initialPrompt, setInitialPrompt] = useState('');
  const [recommendationVersions, setRecommendationVersions] = useState<RecommendationVersion[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<string>('');
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
    setChatHistory([]);
    setInitialPrompt('');
    setRecommendationVersions([]);
    setCurrentVersionId('');
  };

  const handleSubmit = async (values: ParameterFormValues) => {
    if (!imageBase64) {
      toast.error('请先上传户型图');
      return;
    }

    setIsAnalyzing(true);
    // 清空之前的版本
    setRecommendationVersions([]);
    setCurrentVersionId('');

    abortControllerRef.current = new AbortController();

    // 从数据库数据生成知识库
    const knowledgeBase = await generateKnowledgeBaseFromDB(products, cases);

    let prompt = `请作为一名专业的空调方案顾问，分析这张户型图，并根据以下产品知识库和历史案例提供详细的空调配置方案。

${knowledgeBase}

---

## 用户信息`;

    if (values.totalArea) {
      prompt += `\n- **总面积：${values.totalArea}**（用户提供，请以此为准）`;
    }

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

### 1. 户型分析（简要）

**面积分析要求**：
${values.totalArea 
  ? `- 用户已提供总面积：${values.totalArea}，请以此为准进行分析
- 根据总面积合理分配各房间面积` 
  : `- 仔细查看户型图上的面积标注（通常在房间内或图纸角落）
- 如果图上有标注，请使用标注的准确数值
- 如果没有标注，请根据以下方法估算：
  1. 查看户型图上的比例尺或尺寸标注
  2. 根据房间数量和布局，参考常见户型面积
  3. 客厅通常20-40㎡，主卧15-25㎡，次卧10-18㎡，厨房4-8㎡，卫生间3-6㎡
  4. 说明估算依据，让用户了解面积来源`}

**输出格式**：
- 总面积${values.totalArea ? `：${values.totalArea}` : '估算：约XX㎡'}${!values.totalArea ? '（说明：基于XXX估算）' : ''}
- 房间布局：X室X厅
- 关键特点：（1-2句话概括）

### 2. 相似案例参考
**从历史案例中找出最相似的案例（1个）**
- 案例编号和标题
- 相似之处（面积、户型）
- 该案例的方案类型和客户反馈

### 3. 推荐方案（表格形式）

**方案类型**：中央空调 / 风管机+分体式 / 全分体式（选择一个）

**产品配置表**：

| 房间名称 | 房间面积 | 空调型号 | 数量 | 制冷量(W) | 匹数 | 设备尺寸 | 单价 | 小计 |
|---------|---------|---------|------|----------|------|---------|------|------|
| 客厅 | 30㎡ | 格力 KFR-72LW | 1台 | 7200W | 3匹 | 1850×700×320mm | ¥5,999 | ¥5,999 |
| 主卧 | 18㎡ | 格力 KFR-35GW | 1台 | 3500W | 1.5匹 | 950×320×215mm | ¥2,899 | ¥2,899 |
| 次卧 | 15㎡ | 格力 KFR-26GW | 1台 | 2600W | 1匹 | 848×289×204mm | ¥2,399 | ¥2,399 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

**表格格式要求（严格执行）**：

**核心原则**：表格单元格必须严格按照表头要求填写具体数据，不得使用任何描述性、解释性文字。

**每列的填写规范**：
1. **房间名称**：只写房间名称（如"客厅"、"主卧"、"次卧1"），不得写"适配XX"、"根据XX"等
2. **房间面积**：只写具体数值+单位（如"30㎡"、"18㎡"），不得写"约XX"、"适配XX面积"等
3. **空调型号**：只写完整型号（如"格力 KFR-72LW"），必须是知识库中的真实产品
4. **数量**：只写数字+单位（如"1台"、"2台"），不得写"根据需求"等
5. **制冷量**：只写数值+单位（如"7200W"），必须与产品实际参数一致
6. **匹数**：只写数值+单位（如"3匹"、"1.5匹"），必须与产品实际参数一致
7. **设备尺寸**：只写具体尺寸（如"1850×700×320mm"），必须与产品实际参数一致
8. **单价**：只写价格（如"¥5,999"），使用产品的当前价格
9. **小计**：只写价格（如"¥5,999"），计算公式：单价×数量

**严格禁止的内容**：
- ❌ 禁止："适配主卧面积"、"根据客厅大小"、"约30㎡"
- ❌ 禁止：括号说明、备注、解释性文字
- ❌ 禁止："可选"、"建议"、"推荐"等词汇
- ❌ 禁止：任何非数据的描述性内容

**正确示例**：
| 主卧 | 18㎡ | 格力 KFR-35GW | 1台 | 3500W | 1.5匹 | 950×320×215mm | ¥2,899 | ¥2,899 |

**错误示例**：
| 主卧 | 适配主卧面积 | 格力 KFR-35GW | 1台 | 3500W | 1.5匹 | 950×320×215mm | ¥2,899 | ¥2,899 |
| 主卧 | 约18㎡ | 格力 KFR-35GW（推荐） | 1台 | 3500W | 1.5匹 | 950×320×215mm | ¥2,899 | ¥2,899 |

**方案说明**（表格外单独说明）：
- 如有特殊配置考虑，在此处说明
- 如有灵活性或可选方案，在此处说明
- 如有补充建议，在此处说明

### 4. 费用汇总

| 项目 | 金额 |
|------|------|
| 设备采购费用 | ¥XX,XXX |
| 安装费用（估算） | ¥X,XXX |
| **总计** | **¥XX,XXX** |

### 5. 安装建议（简要）
- 主要安装位置建议（1-2句话）
- 关键注意事项（2-3条）

**核心要求**：
1. **表格必须完整**：包含所有房间的配置信息
2. **数据必须真实**：所有产品信息必须来自知识库
3. **格式必须规范**：严格按照表格格式输出
4. **优先参考案例**：产品选择优先使用历史案例中的成功配置
5. **面积匹配**：确保产品适用面积与房间面积匹配
6. **库存优先**：优先推荐有库存的产品
7. **经验传承**：充分利用历史案例的经验总结和客户反馈`;

    // 保存初始prompt用于后续对话
    setInitialPrompt(prompt);

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: '你是一名经验丰富的空调方案顾问，擅长根据户型图分析并提供个性化的空调配置方案。你的核心工作方法是：\n\n1. **以历史案例为基础**：优先从历史成功案例中寻找与当前户型相似的案例，参考其解决方案和产品配置\n2. **产品选择原则**：优先推荐历史案例中已验证成功的产品，这些产品有真实的客户反馈和使用经验\n3. **经验传承**：充分利用历史案例的经验总结、客户反馈和注意事项\n4. **真实可靠**：所有推荐的产品必须从知识库中选择，包含正确的产品ID，确保方案可立即实施\n5. **专业详细**：提供专业、详细、实用的建议，考虑用户的实际需求和预算\n6. **多轮对话能力**：能够根据客户的反馈和要求，调整和优化推荐方案\n7. **表格格式规范（严格执行）**：\n   - 表格单元格必须严格按照表头要求填写具体数据\n   - 严禁使用任何描述性、解释性文字（如"适配主卧面积"、"根据客厅大小"、"约30㎡"）\n   - 房间面积必须写具体数值（如"18㎡"），不得写"适配XX面积"\n   - 空调型号必须写完整型号（如"格力 KFR-35GW"），不得添加括号说明\n   - 所有详细说明、备注必须放在表格外面单独说明\n8. **精准的面积识别**：\n   - 如果用户提供了总面积，必须严格使用用户提供的数值\n   - 如果没有提供，仔细查看户型图上的面积标注（通常在房间内标注或图纸角落）\n   - 优先使用图纸上的标注数据，而不是估算\n   - 如果必须估算，要说明估算依据，并给出合理的面积范围\n   - 各房间面积之和应该接近总面积（考虑公摊和墙体）\n\n你的推荐应该让客户感受到这是基于大量成功案例总结出来的成熟方案，而不是临时拼凑的方案。'
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
      let fullResponse = '';
      const initialVersionId = `v-${Date.now()}`;
      
      // 创建初始版本（用于实时更新）
      setRecommendationVersions([{
        id: initialVersionId,
        title: '初始方案',
        content: '',
        timestamp: Date.now()
      }]);
      setCurrentVersionId(initialVersionId);

      await sendChatStream({
        endpoint: AI_ENDPOINT,
        apiId: APP_ID,
        messages,
        onUpdate: (content: string) => {
          fullResponse = content;
          // 更新当前版本的内容
          setRecommendationVersions([{
            id: initialVersionId,
            title: '初始方案',
            content: content,
            timestamp: Date.now()
          }]);
        },
        onComplete: () => {
          setIsAnalyzing(false);
          // 保存对话历史
          setChatHistory([
            ...messages,
            {
              role: 'assistant',
              content: fullResponse
            }
          ]);
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

  // 处理继续对话
  const handleContinueChat = async (userMessage: string) => {
    if (!userMessage.trim()) {
      toast.error('请输入您的要求');
      return;
    }

    if (chatHistory.length === 0) {
      toast.error('请先生成初始方案');
      return;
    }

    setIsAnalyzing(true);

    abortControllerRef.current = new AbortController();

    // 构建新的消息
    const newMessages: ChatMessage[] = [
      ...chatHistory,
      {
        role: 'user',
        content: userMessage
      }
    ];

    try {
      let fullResponse = '';
      const newVersionId = `v-${Date.now()}`;
      const versionNumber = recommendationVersions.length;
      
      // 添加新版本（用于实时更新）
      const newVersion: RecommendationVersion = {
        id: newVersionId,
        title: `调整方案 ${versionNumber}`,
        content: '',
        userFeedback: userMessage,
        timestamp: Date.now()
      };
      
      setRecommendationVersions(prev => [...prev, newVersion]);
      setCurrentVersionId(newVersionId);

      await sendChatStream({
        endpoint: AI_ENDPOINT,
        apiId: APP_ID,
        messages: newMessages,
        onUpdate: (content: string) => {
          fullResponse = content;
          // 更新新版本的内容
          setRecommendationVersions(prev => 
            prev.map(v => 
              v.id === newVersionId 
                ? { ...v, content: content }
                : v
            )
          );
        },
        onComplete: () => {
          setIsAnalyzing(false);
          // 更新对话历史
          setChatHistory([
            ...newMessages,
            {
              role: 'assistant',
              content: fullResponse
            }
          ]);
          toast.success('方案已更新');
        },
        onError: (error: Error) => {
          setIsAnalyzing(false);
          const errorMessage = error.message || '调整失败，请重试';
          toast.error(`调整失败: ${errorMessage}`);
          console.error('AI chat error:', error);
        },
        signal: abortControllerRef.current.signal
      });
    } catch (error) {
      setIsAnalyzing(false);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      toast.error(`调整失败: ${errorMessage}`);
      console.error('Chat error:', error);
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
              versions={recommendationVersions}
              currentVersionId={currentVersionId}
              onVersionChange={setCurrentVersionId}
              isLoading={isAnalyzing}
              onContinueChat={handleContinueChat}
              hasInitialRecommendation={chatHistory.length > 0}
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
