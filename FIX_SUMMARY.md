# 🔧 户型图保存问题修复总结

## 问题
在案例添加/编辑表单中，上传户型图后无法保存。

## 根本原因
编辑模式下，如果用户没有上传新图片，系统会将`imageUrl`设置为`null`，导致原有图片URL被清空。

## 修复方案

### 代码修改
**文件**：`src/pages/admin/CaseForm.tsx`

1. **添加状态管理**
```typescript
const [existingImageUrl, setExistingImageUrl] = useState<string>('');
```

2. **加载案例时保存原图片URL**
```typescript
if (caseData.floorPlanImage) {
  setImagePreview(caseData.floorPlanImage);
  setExistingImageUrl(caseData.floorPlanImage); // 新增
}
```

3. **提交时正确处理图片URL**
```typescript
// 修改前
let imageUrl = null;
if (imageFile) {
  imageUrl = await uploadImage();
}

// 修改后
let imageUrl = existingImageUrl; // 默认使用原有URL
if (imageFile) {
  const uploadedUrl = await uploadImage();
  imageUrl = uploadedUrl; // 使用新上传的URL
}
```

## 修复效果

### ✅ 添加案例
- 不上传图片：案例保存成功，图片字段为空
- 上传图片：图片上传成功，案例保存成功

### ✅ 编辑案例
- 不修改图片：保留原有图片，案例更新成功
- 上传新图片：新图片替换旧图片，案例更新成功

## 测试建议

1. **添加案例（含图片）**
   - 进入 `/admin/case/add`
   - 上传户型图
   - 填写必填字段
   - 点击"添加案例"
   - ✅ 预期：成功保存

2. **编辑案例（不修改图片）**
   - 进入 `/admin/cases`
   - 点击"编辑"
   - 修改其他字段
   - 点击"更新案例"
   - ✅ 预期：原图片保留

3. **编辑案例（更换图片）**
   - 进入 `/admin/cases`
   - 点击"编辑"
   - 上传新图片
   - 点击"更新案例"
   - ✅ 预期：显示新图片

## 相关文档

- 详细修复说明：`IMAGE_UPLOAD_FIX.md`
- 故障排除指南：`TROUBLESHOOTING.md`
- 使用指南：`ADMIN_GUIDE.md`

---

**修复时间**：2025-11-27  
**修复状态**：✅ 已完成  
**代码检查**：✅ 通过
