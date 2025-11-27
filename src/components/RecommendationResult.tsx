import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

interface RecommendationResultProps {
  content: string;
  isLoading: boolean;
  onExport?: () => void;
}

export function RecommendationResult({ content, isLoading, onExport }: RecommendationResultProps) {
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

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">推荐方案</CardTitle>
          {content && !isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              导出方案
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
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
        )}
      </CardContent>
    </Card>
  );
}
