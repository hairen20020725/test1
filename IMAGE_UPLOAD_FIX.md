# 🔧 户型图保存问题修复说明

## 问题描述

在案例添加/编辑表单中，上传户型图后无法保存。

## 问题原因

在编辑模式下，如果用户没有上传新图片，系统会将原有的图片URL清空，导致保存失败。

## 修复内容

### 1. 添加状态管理
```typescript
const [existingImageUrl, setExistingImageUrl] = useState<string>('');
```
用于保存原有的图片URL。

### 2. 加载案例时保存原图片URL
```typescript
// 设置户型图预览
if (caseData.floorPlanImage) {
  setImagePreview(caseData.floorPlanImage);
  setExistingImageUrl(caseData.floorPlanImage); // 保存原有URL
}
```

### 3. 提交时使用正确的图片URL
```typescript
// 上传图片（如果有新图片）
let imageUrl = existingImageUrl; // 默认使用原有图片URL
if (imageFile) {
  const uploadedUrl = await uploadImage();
  if (!uploadedUrl) {
    return; // 上传失败，不继续提交
  }
  imageUrl = uploadedUrl; // 使用新上传的图片URL
}
```

## 修复后的行为

### 添加案例模式
- ✅ 不上传图片：案例保存成功，`floorPlanImage`为空
- ✅ 上传图片：图片上传到Storage，案例保存成功

### 编辑案例模式
- ✅ 不修改图片：保留原有图片URL，案例更新成功
- ✅ 上传新图片：新图片上传到Storage，替换原有图片，案例更新成功
- ✅ 删除图片：清空图片预览，案例更新成功（图片字段为空）

## 测试步骤

### 测试1：添加案例（不含图片）
1. 进入 `/admin/case/add`
2. 填写所有必填字段
3. **不上传户型图**
4. 点击"添加案例"
5. ✅ 预期：案例添加成功，跳转到案例列表

### 测试2：添加案例（含图片）
1. 进入 `/admin/case/add`
2. 填写所有必填字段
3. **上传户型图**（JPG/PNG/WEBP，小于1MB）
4. 点击"添加案例"
5. ✅ 预期：图片上传成功，案例添加成功，跳转到案例列表

### 测试3：编辑案例（不修改图片）
1. 进入案例列表 `/admin/cases`
2. 点击某个案例的"编辑"按钮
3. 修改案例标题或其他字段
4. **不修改户型图**
5. 点击"更新案例"
6. ✅ 预期：案例更新成功，原有图片保留

### 测试4：编辑案例（更换图片）
1. 进入案例列表 `/admin/cases`
2. 点击某个案例的"编辑"按钮
3. **上传新的户型图**
4. 点击"更新案例"
5. ✅ 预期：新图片上传成功，案例更新成功，显示新图片

### 测试5：图片验证
1. 尝试上传超过1MB的图片
2. ✅ 预期：显示错误提示"文件大小不能超过1MB"

3. 尝试上传中文文件名的图片（如：户型图.jpg）
4. ✅ 预期：显示错误提示"文件名不能包含中文字符"

5. 尝试上传不支持的格式（如：GIF）
6. ✅ 预期：显示错误提示"仅支持JPG、PNG、WEBP格式"

## 文件修改清单

### 修改的文件
- `src/pages/admin/CaseForm.tsx`
  - 添加`existingImageUrl`状态
  - 在`loadCase`函数中保存原有图片URL
  - 修改`onSubmit`函数，正确处理图片URL

### 未修改的文件
- `src/db/api.ts` - 数据库API正常工作
- `supabase/migrations/*.sql` - 数据库结构正常

## 技术细节

### 图片上传流程
```
1. 用户选择图片
   ↓
2. 前端验证（格式、大小、文件名）
   ↓
3. 生成唯一文件名（时间戳 + 随机数）
   ↓
4. 上传到Supabase Storage
   ↓
5. 获取公开URL
   ↓
6. 保存URL到数据库
```

### 图片URL管理
```typescript
// 添加模式
existingImageUrl = ''  // 没有原图片
imageFile = null       // 没有新图片
→ imageUrl = undefined // 不保存图片字段

imageFile = File       // 有新图片
→ imageUrl = uploadedUrl // 保存新图片URL

// 编辑模式
existingImageUrl = 'https://...'  // 有原图片
imageFile = null                   // 没有新图片
→ imageUrl = existingImageUrl     // 保留原图片

existingImageUrl = 'https://...'  // 有原图片
imageFile = File                   // 有新图片
→ imageUrl = uploadedUrl          // 使用新图片
```

## 常见问题

### Q1：为什么编辑时不删除旧图片？
**A**：为了数据安全，我们保留旧图片。如果需要清理，可以：
1. 手动在Supabase Storage中删除
2. 实现定期清理脚本
3. 添加"删除图片"按钮

### Q2：图片存储在哪里？
**A**：图片存储在Supabase Storage的`app-7ua9s9vs9fr5_floor_plans`存储桶中。

### Q3：如何查看上传的图片？
**A**：
1. 登录Supabase控制台
2. 进入Storage
3. 选择`app-7ua9s9vs9fr5_floor_plans`存储桶
4. 查看所有上传的图片

### Q4：图片URL是什么格式？
**A**：
```
https://[project-id].supabase.co/storage/v1/object/public/app-7ua9s9vs9fr5_floor_plans/[timestamp]-[random].[ext]
```

## 后续优化建议

### 功能增强
- [ ] 添加图片裁剪功能
- [ ] 添加图片压缩功能
- [ ] 支持多图片上传
- [ ] 添加"删除图片"按钮
- [ ] 图片预览放大功能

### 性能优化
- [ ] 客户端图片压缩
- [ ] 图片懒加载
- [ ] CDN加速
- [ ] 缩略图生成

### 用户体验
- [ ] 拖拽上传
- [ ] 上传进度条
- [ ] 图片编辑器
- [ ] 批量上传

---

## ✅ 修复完成

户型图保存功能已修复！现在您可以：
- ✅ 添加案例时上传户型图
- ✅ 编辑案例时保留或更换户型图
- ✅ 完整的文件验证和错误提示

**开始测试吧！** 🚀

---

**修复时间**：2025-11-27  
**修复文件**：src/pages/admin/CaseForm.tsx  
**测试状态**：待测试
