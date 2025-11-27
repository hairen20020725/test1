import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { convertImageToBase64 } from '@/utils/ai-chat';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageSelect: (base64: string, file: File) => void;
  disabled?: boolean;
}

export function ImageUpload({ onImageSelect, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('图片大小不能超过10MB');
      return;
    }

    try {
      const base64 = await convertImageToBase64(file);
      setPreview(base64);
      setFileName(file.name);
      onImageSelect(base64, file);
      toast.success('户型图上传成功');
    } catch (error) {
      toast.error('图片上传失败，请重试');
      console.error('Image upload error:', error);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/bmp': ['.bmp'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    disabled
  });

  const handleRemove = () => {
    setPreview(null);
    setFileName('');
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <Card
          {...getRootProps()}
          className={`
            border-2 border-dashed p-8 text-center cursor-pointer transition-all
            ${isDragActive ? 'border-primary bg-accent' : 'border-border hover:border-primary'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-accent">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground mb-1">
                {isDragActive ? '松开鼠标上传' : '上传户型图'}
              </p>
              <p className="text-sm text-muted-foreground">
                点击选择或拖拽图片到此处
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                支持 JPG、PNG、BMP、WEBP 格式，最大 10MB
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4">
          <div className="relative">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-muted">
                <img
                  src={preview}
                  alt="户型图预览"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-sm font-medium text-foreground truncate">
                    {fileName}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  户型图已上传，可以开始分析
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={disabled}
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
