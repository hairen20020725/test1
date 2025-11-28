# 快速参考卡片 🚀

## 🔐 管理后台访问

```
登录地址：/admin/login
默认密码：admin123
会话时长：2小时
```

**修改密码**：在`.env`文件添加
```bash
VITE_ADMIN_PASSWORD=your_password
```

---

## 📊 数据库访问

### Supabase控制台
```
URL: https://backend.appmiaoda.com/projects/supabase252312970925752320
```

### 环境变量（.env）
```bash
VITE_APP_ID=app-7ua9s9vs9fr5
VITE_SUPABASE_URL=https://backend.appmiaoda.com/projects/supabase252312970925752320
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 常用SQL命令

### 查询数据
```sql
-- 查看所有产品
SELECT * FROM products ORDER BY created_at DESC;

-- 查看所有案例
SELECT * FROM historical_cases ORDER BY created_at DESC;

-- 统计产品数量
SELECT COUNT(*) FROM products;

-- 按品牌统计
SELECT brand, COUNT(*) FROM products GROUP BY brand;

-- 查看有货产品
SELECT * FROM products WHERE in_stock = true;

-- 查看促销产品
SELECT * FROM products WHERE promotion IS NOT NULL;
```

### 更新数据
```sql
-- 更新产品价格
UPDATE products SET current_price = 2800 WHERE product_id = 'split-001';

-- 批量打折
UPDATE products SET current_price = current_price * 0.9 WHERE brand = '格力';

-- 更新库存
UPDATE products SET stock = 50, in_stock = true WHERE product_id = 'split-001';

-- 添加促销信息
UPDATE products SET promotion = '限时优惠' WHERE product_id = 'split-001';
```

### 删除数据
```sql
-- 删除指定产品
DELETE FROM products WHERE product_id = 'split-007';

-- 删除无货产品
DELETE FROM products WHERE stock = 0 AND in_stock = false;

-- 删除指定案例
DELETE FROM historical_cases WHERE case_id = 'case-006';
```

### 插入数据
```sql
-- 添加新产品
INSERT INTO products (
  product_id, brand, model, type, horse_power,
  suitable_area_min, suitable_area_max, energy_level,
  current_price, stock, in_stock, features, best_for,
  noise, cooling, heating
) VALUES (
  'split-007', '格力', '云锦 KFR-35GW', 'split', 1.5,
  15, 22, '一级能效', 3500, 20, true,
  '["智能控制", "节能省电"]'::jsonb,
  '["卧室", "书房"]'::jsonb,
  38, 3500, 4200
);
```

---

## 🗂️ 数据表结构

### products（产品表）
```
主要字段：
- product_id (产品编号，唯一)
- brand (品牌)
- model (型号)
- type (类型：central/split/duct/portable)
- current_price (当前价格)
- stock (库存)
- in_stock (是否有货)
```

### historical_cases（案例表）
```
主要字段：
- case_id (案例编号，唯一)
- title (标题)
- house_area (面积)
- house_rooms (房间配置)
- solution_type (方案类型)
- solution_total_cost (总费用)
```

---

## 🎯 管理后台功能

### 产品管理（/admin/products）
- ✅ 查看所有产品
- ✅ 添加新产品
- ✅ 编辑产品信息
- ✅ 删除产品

### 案例管理（/admin/cases）
- ✅ 查看所有案例
- ✅ 添加新案例
- ✅ 编辑案例信息
- ✅ 上传户型图
- ✅ 删除案例

---

## 📁 文件结构

```
/workspace/app-7ua9s9vs9fr5/
├── src/
│   ├── pages/
│   │   ├── Home.tsx                    # 首页
│   │   ├── AdminLogin.tsx              # 管理员登录
│   │   └── admin/
│   │       ├── AdminHome.tsx           # 管理后台首页
│   │       ├── ProductManagement.tsx   # 产品管理
│   │       ├── CaseManagement.tsx      # 案例管理
│   │       └── CaseForm.tsx            # 案例表单
│   ├── components/
│   │   └── AdminProtected.tsx          # 管理后台保护组件
│   ├── db/
│   │   ├── supabase.ts                 # Supabase客户端
│   │   └── api.ts                      # API函数
│   └── types/
│       └── types.ts                    # TypeScript类型定义
├── supabase/
│   └── migrations/
│       ├── 00001_create_ac_products_and_cases_tables.sql
│       └── 00002_create_floor_plan_storage_bucket.sql
├── .env                                # 环境变量
├── ADMIN_ACCESS.md                     # 管理后台访问说明
├── DATABASE_UPDATE_GUIDE.md            # 数据库更新指南
└── QUICK_REFERENCE.md                  # 快速参考（本文件）
```

---

## 🔧 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 代码检查
pnpm run lint

# 构建生产版本
pnpm run build
```

---

## 📦 产品类型说明

| 类型 | 代码 | 说明 |
|------|------|------|
| 中央空调 | central | 适合大户型、别墅 |
| 分体式空调 | split | 最常见，挂机/柜机 |
| 风管机 | duct | 隐藏式安装，美观 |
| 移动空调 | portable | 免安装，适合租房 |

---

## 🎨 JSONB字段格式

### features（产品特点）
```json
["智能控制", "节能省电", "静音舒适", "快速制冷"]
```

### best_for（适用场景）
```json
["卧室", "书房", "客厅"]
```

### solution_products（方案产品配置）
```json
[
  {
    "room": "客厅",
    "productId": "split-001",
    "quantity": 1,
    "installPosition": "电视墙侧面"
  }
]
```

### tips（注意事项）
```json
["注意事项1", "注意事项2", "注意事项3"]
```

---

## ⚡ 快速操作

### 重置管理员密码
1. 编辑`.env`文件
2. 添加`VITE_ADMIN_PASSWORD=new_password`
3. 重启应用

### 清空所有数据
```sql
TRUNCATE products CASCADE;
TRUNCATE historical_cases CASCADE;
```

### 恢复初始数据
运行迁移文件中的INSERT语句：
```bash
supabase/migrations/00001_create_ac_products_and_cases_tables.sql
```

### 查看数据统计
```sql
-- 产品统计
SELECT 
  type,
  COUNT(*) as count,
  AVG(current_price) as avg_price,
  SUM(stock) as total_stock
FROM products 
GROUP BY type;

-- 案例统计
SELECT 
  solution_type,
  COUNT(*) as count,
  AVG(solution_total_cost) as avg_cost
FROM historical_cases 
GROUP BY solution_type;
```

---

## 🚨 故障排查

### 问题：无法登录管理后台
- 检查密码是否正确（默认：admin123）
- 检查`.env`文件中的VITE_ADMIN_PASSWORD配置
- 清除浏览器缓存和sessionStorage

### 问题：数据不显示
- 检查Supabase连接是否正常
- 查看浏览器控制台错误信息
- 确认数据库中有数据

### 问题：图片上传失败
- 检查文件大小（不超过1MB）
- 检查文件格式（jpg/jpeg/png/webp）
- 确认文件名不包含中文字符

### 问题：会话过期
- 会话有效期为2小时
- 重新登录即可
- 可以点击"退出登录"主动退出

---

## 📞 获取帮助

1. 查看详细文档：`DATABASE_UPDATE_GUIDE.md`
2. 查看管理后台说明：`ADMIN_ACCESS.md`
3. 检查浏览器控制台错误信息
4. 查看Supabase控制台日志

---

## ✅ 检查清单

### 部署前检查
- [ ] 修改了默认管理员密码
- [ ] 测试了产品添加功能
- [ ] 测试了案例添加功能
- [ ] 测试了图片上传功能
- [ ] 检查了数据库连接
- [ ] 运行了`pnpm run lint`

### 日常维护检查
- [ ] 定期备份数据
- [ ] 检查库存状态
- [ ] 更新产品价格
- [ ] 添加新案例
- [ ] 清理过期数据

---

**最后更新：2024-12-27**
