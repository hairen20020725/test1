/*
# 创建户型图存储桶

## 1. 存储桶配置
- 名称：`app-7ua9s9vs9fr5_floor_plans`
- 公开访问：是（允许查看户型图）
- 文件大小限制：1MB
- 允许的文件类型：图片（jpg, jpeg, png, webp）

## 2. 安全策略
- 允许所有人上传图片
- 允许所有人查看图片
- 允许所有人删除图片（管理后台场景）

## 3. 注意事项
- 文件名不能包含中文字符
- 前端需要验证文件大小和类型
*/

-- 创建存储桶
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'app-7ua9s9vs9fr5_floor_plans',
  'app-7ua9s9vs9fr5_floor_plans',
  true,
  1048576,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 允许所有人上传
CREATE POLICY "允许所有人上传户型图" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'app-7ua9s9vs9fr5_floor_plans');

-- 允许所有人查看
CREATE POLICY "允许所有人查看户型图" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'app-7ua9s9vs9fr5_floor_plans');

-- 允许所有人删除
CREATE POLICY "允许所有人删除户型图" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'app-7ua9s9vs9fr5_floor_plans');
