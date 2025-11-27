import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ImageUpload';
import { ParameterForm, type ParameterFormValues } from '@/components/ParameterForm';
import { RecommendationResult } from '@/components/RecommendationResult';
import { sendChatStream, type ChatMessage } from '@/utils/ai-chat';
import { toast } from 'sonner';
import { AirVent } from 'lucide-react';

const APP_ID = import.meta.env.VITE_APP_ID;
const AI_ENDPOINT = 'https://api-integrations.appmiaoda.com/app-7ua9s9vs9fr5/api-2jBYdN3A9Jyz/v2/chat/completions';

export default function Home() {
  const [imageBase64, setImageBase64] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

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

    let prompt = '请作为一名专业的空调方案顾问，分析这张户型图，并提供详细的空调配置方案。';

    if (values.roomCount) {
      prompt += `\n房间数量：${values.roomCount}`;
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
      prompt += `\n主要朝向：${orientationMap[values.orientation] || values.orientation}`;
    }

    if (values.requirements) {
      prompt += `\n使用需求：${values.requirements}`;
    }

    prompt += `

请按照以下结构提供推荐方案：

## 户型分析
- 分析户型的基本结构、面积估算
- 分析各房间的功能和特点
- 分析朝向对空调需求的影响

## 空调配置方案
### 推荐型号
- 为每个房间推荐合适的空调型号（中央空调/分体式空调/风管机等）
- 说明推荐理由（匹数、能效等级、功能特点）

### 数量建议
- 明确每个房间需要的空调数量
- 说明配置依据

### 安装位置建议
- 为每个房间提供最佳安装位置
- 说明安装位置的选择理由

## 预算估算
- 提供设备采购预算范围
- 提供安装费用预算
- 提供总预算范围

## 注意事项
- 安装注意事项
- 使用建议
- 维护保养建议

请确保方案专业、详细、实用。`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: '你是一名专业的空调方案顾问，擅长根据户型图分析并提供个性化的空调配置方案。你的建议应该专业、详细、实用，考虑到用户的实际需求和预算。'
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
      </div>
    </div>
  );
}
