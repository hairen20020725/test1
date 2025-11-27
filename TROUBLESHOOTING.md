# 🔧 故障排除指南

## 常见问题解决方案

### ❌ 错误：`acProducts is not defined`

**问题描述**：
浏览器控制台显示 `Uncaught ReferenceError: acProducts is not defined`

**原因**：
这是浏览器缓存问题。代码已经更新，但浏览器仍在使用旧版本的缓存文件。

**解决方案**：

#### 方法1：硬刷新浏览器（推荐）

1. **Windows/Linux**：
   - Chrome/Edge: 按 `Ctrl + Shift + R` 或 `Ctrl + F5`
   - Firefox: 按 `Ctrl + Shift + R` 或 `Ctrl + F5`

2. **Mac**：
   - Chrome/Edge: 按 `Cmd + Shift + R`
   - Firefox: 按 `Cmd + Shift + R`
   - Safari: 按 `Cmd + Option + R`

#### 方法2：清除浏览器缓存

1. 打开浏览器开发者工具（F12）
2. 右键点击刷新按钮
3. 选择"清空缓存并硬性重新加载"

#### 方法3：清除应用缓存（开发环境）

如果您在开发环境中，可以运行：

```bash
# 清除Vite缓存
rm -rf .vite node_modules/.vite dist

# 重新启动开发服务器
npm run dev
```

### ✅ 验证修复

刷新后，您应该能够：
- ✅ 正常访问首页
- ✅ 看到产品列表（从数据库加载）
- ✅ 点击"管理后台"按钮
- ✅ 上传户型图并获取AI推荐

### 📝 技术说明

**代码已修复**：
- ❌ 旧代码：使用硬编码的 `acProducts` 数组
- ✅ 新代码：从数据库动态加载 `products` 状态

**修改内容**：
```typescript
// 旧代码（已删除）
import { acProducts } from '@/data/ac-products';

// 新代码
const [products, setProducts] = useState<ACProduct[]>([]);

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  const productsData = await getAllProducts();
  setProducts(productsData);
};
```

---

## 其他常见问题

### 问题：页面加载缓慢

**解决方案**：
- 检查网络连接
- 确保Supabase数据库连接正常
- 查看浏览器控制台是否有错误信息

### 问题：产品列表为空

**可能原因**：
1. 数据库连接失败
2. 数据未正确插入

**解决方案**：
1. 检查 `.env` 文件中的Supabase配置
2. 确认数据库迁移已成功执行
3. 在管理后台手动添加产品

### 问题：AI推荐失败

**可能原因**：
1. 未上传户型图
2. AI服务连接失败
3. 数据库中没有产品数据

**解决方案**：
1. 确保已上传户型图
2. 检查网络连接
3. 在管理后台添加产品数据

### 问题：无法访问管理后台

**解决方案**：
1. 确认URL路径正确：`/admin`
2. 检查路由配置是否正确
3. 清除浏览器缓存后重试

---

## 🆘 获取帮助

如果以上方法都无法解决问题，请：

1. 📋 查看浏览器控制台的完整错误信息
2. 📖 查看项目文档：
   - `README.md` - 项目说明
   - `TODO.md` - 开发进度
   - `ADMIN_GUIDE.md` - 管理后台使用指南
   - `QUICK_START.md` - 快速入门
3. 💬 提交问题反馈，包含：
   - 错误截图
   - 浏览器版本
   - 操作步骤

---

**最后更新**：2025-11-27
