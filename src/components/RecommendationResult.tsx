import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Download, Loader2, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { useState } from 'react';

interface RecommendationResultProps {
  content: string;
  isLoading: boolean;
  onExport?: () => void;
  onContinueChat?: (message: string) => void;
  hasInitialRecommendation?: boolean;
}

export function RecommendationResult({ 
  content, 
  isLoading, 
  onExport,
  onContinueChat,
  hasInitialRecommendation = false
}: RecommendationResultProps) {
  const [chatMessage, setChatMessage] = useState('');

  const handleExport = () => {
    if (!content) {
      toast.error('暂无内容可导出');
      return;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `空调方案推荐_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('方案已导出');
    onExport?.();
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) {
      toast.error('请输入您的要求');
      return;
    }
    onContinueChat?.(chatMessage);
    setChatMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg md:text-xl">推荐方案</CardTitle>
          {content && !isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">导出方案</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto flex flex-col">
        {isLoading && !content && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">AI正在分析户型图，生成推荐方案...</p>
          </div>
        )}

        {!isLoading && !content && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <p className="text-sm">上传户型图并填写参数后</p>
              <p className="text-sm">点击"开始分析"查看推荐方案</p>
            </div>
          </div>
        )}

        {content && (
          <>
            <div className="flex-1 overflow-auto mb-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
                {isLoading && (
                  <span className="inline-flex items-center gap-1 text-primary">
                    <Loader2 className="w-3 h-3 animate-spin" />
                  </span>
                )}
              </div>
            </div>

            {/* 多轮对话输入区域 */}
            {hasInitialRecommendation && onContinueChat && (
              <div className="flex-shrink-0 border-t pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Send className="w-4 h-4" />
                    <span>对方案有疑问？告诉我您的要求，我会为您调整</span>
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="例如：客厅的空调能不能换成2匹的？预算能否控制在2万以内？"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={isLoading || !chatMessage.trim()}
                      className="gap-2"
                    >
                      <Send className="w-4 h-4" />
                      发送要求
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    💡 提示：按 Enter 发送，Shift + Enter 换行
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
