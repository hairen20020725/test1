import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Loader2, Send, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { useState } from 'react';

// 方案版本接口
interface RecommendationVersion {
  id: string;
  title: string;
  content: string;
  userFeedback?: string;
  timestamp: number;
}

interface RecommendationResultProps {
  versions: RecommendationVersion[];
  currentVersionId: string;
  onVersionChange: (versionId: string) => void;
  isLoading: boolean;
  onExport?: () => void;
  onContinueChat?: (message: string) => void;
  hasInitialRecommendation?: boolean;
}

export function RecommendationResult({ 
  versions,
  currentVersionId,
  onVersionChange,
  isLoading, 
  onExport,
  onContinueChat,
  hasInitialRecommendation = false
}: RecommendationResultProps) {
  const [chatMessage, setChatMessage] = useState('');

  const currentVersion = versions.find(v => v.id === currentVersionId);
  const hasContent = versions.length > 0 && versions.some(v => v.content);

  const handleExport = () => {
    if (!currentVersion?.content) {
      toast.error('暂无内容可导出');
      return;
    }

    // 导出当前版本
    let exportContent = `# ${currentVersion.title}\n\n`;
    if (currentVersion.userFeedback) {
      exportContent += `**客户反馈**: ${currentVersion.userFeedback}\n\n---\n\n`;
    }
    exportContent += currentVersion.content;

    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `空调方案_${currentVersion.title}_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('方案已导出');
    onExport?.();
  };

  const handleExportAll = () => {
    if (versions.length === 0) {
      toast.error('暂无内容可导出');
      return;
    }

    // 导出所有版本
    let exportContent = '# 空调方案推荐 - 完整历史\n\n';
    versions.forEach((version, index) => {
      exportContent += `## ${version.title}\n\n`;
      if (version.userFeedback) {
        exportContent += `**客户反馈**: ${version.userFeedback}\n\n`;
      }
      exportContent += version.content;
      if (index < versions.length - 1) {
        exportContent += '\n\n---\n\n';
      }
    });

    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `空调方案_完整历史_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('完整方案已导出');
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
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg md:text-xl">推荐方案</CardTitle>
          {hasContent && !isLoading && (
            <div className="flex gap-2">
              {versions.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportAll}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">导出全部</span>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">导出当前</span>
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto flex flex-col p-0">
        {isLoading && versions.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground px-6">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">AI正在分析户型图，生成推荐方案...</p>
          </div>
        )}

        {!isLoading && versions.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground px-6">
            <div className="text-center">
              <p className="text-sm">上传户型图并填写参数后</p>
              <p className="text-sm">点击"开始分析"查看推荐方案</p>
            </div>
          </div>
        )}

        {versions.length > 0 && (
          <>
            <Tabs 
              value={currentVersionId} 
              onValueChange={onVersionChange}
              className="flex-1 flex flex-col"
            >
              <TabsList className="w-full justify-start rounded-none border-b bg-muted/30 px-6 overflow-x-auto flex-shrink-0">
                {versions.map((version) => (
                  <TabsTrigger 
                    key={version.id} 
                    value={version.id}
                    className="relative data-[state=active]:bg-background"
                  >
                    {version.title}
                    {version.userFeedback && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        💬
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {versions.map((version) => (
                <TabsContent 
                  key={version.id} 
                  value={version.id}
                  className="flex-1 overflow-auto mt-0 px-6 py-4"
                >
                  {version.userFeedback && (
                    <div className="mb-4 p-3 bg-accent/50 rounded-lg border border-border">
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">客户反馈</p>
                          <p className="text-sm">{version.userFeedback}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {version.content}
                    </ReactMarkdown>
                    {isLoading && version.id === currentVersionId && (
                      <span className="inline-flex items-center gap-1 text-primary">
                        <Loader2 className="w-3 h-3 animate-spin" />
                      </span>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* 多轮对话输入区域 */}
            {hasInitialRecommendation && onContinueChat && (
              <div className="flex-shrink-0 border-t px-6 py-4">
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
