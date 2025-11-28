# 数据库更新指南

## 📋 目录
1. [当前数据库结构](#当前数据库结构)
2. [如何更新数据库](#如何更新数据库)
3. [常见更新场景](#常见更新场景)
4. [数据库管理工具](#数据库管理工具)

---

## 当前数据库结构

### 表结构

#### 1. products（产品表）
存储空调产品信息

| 字段名 | 类型 | 说明 | 必填 |
|--------|------|------|------|
| id | uuid | 主键 | 是 |
| product_id | text | 产品编号（唯一） | 是 |
| brand | text | 品牌 | 是 |
| model | text | 型号 | 是 |
| type | text | 类型（central/split/duct/portable） | 是 |
| horse_power | numeric | 匹数 | 是 |
| suitable_area_min | integer | 适用面积最小值 | 是 |
| suitable_area_max | integer | 适用面积最大值 | 是 |
| energy_level | text | 能效等级 | 是 |
| current_price | numeric | 当前售价 | 是 |
| original_price | numeric | 原价 | 否 |
| stock | integer | 库存数量 | 是 |
| in_stock | boolean | 是否有货 | 是 |
| features | jsonb | 产品特点数组 | 是 |
| best_for | jsonb | 适用场景数组 | 是 |
| noise | integer | 噪音分贝 | 是 |
| cooling | integer | 制冷量W | 是 |
| heating | integer | 制热量W | 是 |
| promotion | text | 促销信息 | 否 |
| created_at | timestamptz | 创建时间 | 自动 |
| updated_at | timestamptz | 更新时间 | 自动 |

#### 2. historical_cases（历史案例表）
存储历史安装案例

| 字段名 | 类型 | 说明 | 必填 |
|--------|------|------|------|
| id | uuid | 主键 | 是 |
| case_id | text | 案例编号（唯一） | 是 |
| title | text | 案例标题 | 是 |
| house_area | integer | 总面积 | 是 |
| house_rooms | text | 房间配置 | 是 |
| house_orientation | text | 主要朝向 | 是 |
| house_floor | integer | 楼层 | 是 |
| house_building_type | text | 建筑类型 | 是 |
| description | text | 户型描述 | 是 |
| floor_plan_image | text | 户型图URL | 否 |
| solution_type | text | 方案类型 | 是 |
| solution_products | jsonb | 产品配置数组 | 是 |
| solution_total_cost | numeric | 总费用 | 是 |
| solution_install_cost | numeric | 安装费用 | 是 |
| customer_feedback | text | 客户反馈 | 是 |
| tips | jsonb | 注意事项数组 | 是 |
| completed_date | text | 完成日期 | 是 |
| created_at | timestamptz | 创建时间 | 自动 |
| updated_at | timestamptz | 更新时间 | 自动 |

### 存储桶

#### app-7ua9s9vs9fr5_floor_plans
- **用途**：存储户型图图片
- **文件大小限制**：1MB
- **允许的文件类型**：jpg, jpeg, png, webp
- **访问权限**：公开可读

---

## 如何更新数据库

### 方法一：通过管理后台界面（推荐）

这是最简单、最安全的方式，适合日常数据维护。

#### 1. 登录管理后台
```
访问地址：/admin/login
默认密码：admin123
```

#### 2. 管理产品数据
- 访问：`/admin/products`
- 可以进行：
  - ✅ 添加新产品
  - ✅ 编辑现有产品
  - ✅ 删除产品
  - ✅ 查看所有产品

#### 3. 管理案例数据
- 访问：`/admin/cases`
- 可以进行：
  - ✅ 添加新案例
  - ✅ 编辑现有案例
  - ✅ 删除案例
  - ✅ 上传户型图
  - ✅ 查看所有案例

### 方法二：通过Supabase控制台

适合批量操作或需要直接操作数据库的场景。

#### 1. 访问Supabase控制台
```
URL: https://backend.appmiaoda.com/projects/supabase252312970925752320
```

#### 2. 进入Table Editor
- 左侧菜单选择 "Table Editor"
- 选择要编辑的表：`products` 或 `historical_cases`

#### 3. 操作数据
- **添加数据**：点击 "Insert row" 按钮
- **编辑数据**：点击单元格直接编辑
- **删除数据**：选中行后点击删除按钮
- **批量导入**：使用 "Import data" 功能

#### 4. 执行SQL查询
- 左侧菜单选择 "SQL Editor"
- 可以执行自定义SQL语句

### 方法三：通过SQL迁移文件

适合结构性变更（添加字段、修改表结构等）。

#### 1. 创建新的迁移文件
在 `supabase/migrations/` 目录下创建新文件：
```bash
# 文件命名格式：00003_描述.sql
supabase/migrations/00003_add_new_field.sql
```

#### 2. 编写SQL语句
```sql
/*
# 迁移说明

## 变更内容
- 描述你要做的变更

## 影响范围
- 说明影响的表和字段
*/

-- 你的SQL语句
ALTER TABLE products ADD COLUMN new_field text;
```

#### 3. 应用迁移
迁移文件会在下次部署时自动应用。

---

## 常见更新场景

### 场景1：添加新产品

**通过管理后台**：
1. 访问 `/admin/products`
2. 点击"添加产品"按钮
3. 填写产品信息
4. 点击"添加产品"保存

**通过SQL**：
```sql
INSERT INTO products (
  product_id, brand, model, type, horse_power,
  suitable_area_min, suitable_area_max, energy_level,
  current_price, stock, in_stock, features, best_for,
  noise, cooling, heating
) VALUES (
  'split-007',
  '格力',
  '云锦 KFR-35GW',
  'split',
  1.5,
  15,
  22,
  '一级能效',
  3500,
  20,
  true,
  '["智能控制", "节能省电", "静音舒适"]'::jsonb,
  '["卧室", "书房"]'::jsonb,
  38,
  3500,
  4200
);
```

### 场景2：更新产品价格

**通过管理后台**：
1. 访问 `/admin/products`
2. 找到要更新的产品
3. 点击"编辑"按钮
4. 修改价格
5. 点击"更新产品"保存

**通过SQL**：
```sql
-- 更新单个产品价格
UPDATE products 
SET current_price = 2800 
WHERE product_id = 'split-001';

-- 批量更新某品牌产品价格（打9折）
UPDATE products 
SET current_price = current_price * 0.9 
WHERE brand = '格力';
```

### 场景3：删除过期产品

**通过管理后台**：
1. 访问 `/admin/products`
2. 找到要删除的产品
3. 点击"删除"按钮
4. 确认删除

**通过SQL**：
```sql
-- 删除指定产品
DELETE FROM products WHERE product_id = 'split-007';

-- 删除库存为0的产品
DELETE FROM products WHERE stock = 0;
```

### 场景4：添加新案例

**通过管理后台**：
1. 访问 `/admin/cases`
2. 点击"添加案例"按钮
3. 填写案例信息
4. 上传户型图（可选）
5. 添加产品配置
6. 点击"添加案例"保存

**通过SQL**：
```sql
INSERT INTO historical_cases (
  case_id, title, house_area, house_rooms,
  house_orientation, house_floor, house_building_type,
  description, solution_type, solution_products,
  solution_total_cost, solution_install_cost,
  customer_feedback, tips, completed_date
) VALUES (
  'case-006',
  '新案例标题',
  100,
  '3室2厅',
  '南向',
  10,
  '高层',
  '户型描述...',
  '中央空调',
  '[{"room": "全屋", "productId": "central-002", "quantity": 1, "installPosition": "客厅吊顶"}]'::jsonb,
  32000,
  8000,
  '客户反馈...',
  '["注意事项1", "注意事项2"]'::jsonb,
  '2024-12'
);
```

### 场景5：修改表结构（添加新字段）

**创建迁移文件**：`supabase/migrations/00003_add_warranty_field.sql`

```sql
/*
# 为产品表添加保修期字段

## 变更内容
- 在products表添加warranty_years字段（保修年限）

## 影响范围
- products表
*/

-- 添加保修年限字段
ALTER TABLE products 
ADD COLUMN warranty_years integer DEFAULT 1;

-- 为现有产品设置默认值
UPDATE products 
SET warranty_years = 3 
WHERE brand IN ('格力', '美的', '大金');

UPDATE products 
SET warranty_years = 1 
WHERE brand NOT IN ('格力', '美的', '大金');
```

### 场景6：批量更新库存状态

**通过SQL**：
```sql
-- 将库存为0的产品标记为无货
UPDATE products 
SET in_stock = false 
WHERE stock = 0;

-- 将库存大于0的产品标记为有货
UPDATE products 
SET in_stock = true 
WHERE stock > 0;
```

### 场景7：查询统计数据

**通过SQL**：
```sql
-- 统计各品牌产品数量
SELECT brand, COUNT(*) as count 
FROM products 
GROUP BY brand 
ORDER BY count DESC;

-- 统计各类型产品平均价格
SELECT type, AVG(current_price) as avg_price 
FROM products 
GROUP BY type;

-- 查询最受欢迎的产品（被案例引用最多）
SELECT p.brand, p.model, COUNT(*) as usage_count
FROM products p
JOIN historical_cases c ON c.solution_products::text LIKE '%' || p.product_id || '%'
GROUP BY p.brand, p.model
ORDER BY usage_count DESC
LIMIT 10;

-- 统计各户型面积段的案例数量
SELECT 
  CASE 
    WHEN house_area < 70 THEN '小户型(<70㎡)'
    WHEN house_area < 100 THEN '中户型(70-100㎡)'
    WHEN house_area < 150 THEN '大户型(100-150㎡)'
    ELSE '超大户型(>150㎡)'
  END as size_range,
  COUNT(*) as count
FROM historical_cases
GROUP BY size_range
ORDER BY count DESC;
```

---

## 数据库管理工具

### 1. Supabase控制台（推荐）
- **访问地址**：https://backend.appmiaoda.com/projects/supabase252312970925752320
- **功能**：
  - 📊 Table Editor：可视化编辑表数据
  - 💾 SQL Editor：执行SQL查询
  - 📁 Storage：管理文件存储
  - 📈 Database：查看数据库统计
  - 🔐 Authentication：用户认证管理

### 2. 管理后台界面
- **访问地址**：/admin/login
- **默认密码**：admin123
- **功能**：
  - ✏️ 产品管理：添加、编辑、删除产品
  - 📋 案例管理：添加、编辑、删除案例
  - 🖼️ 图片上传：上传和管理户型图

### 3. 数据库客户端工具（可选）
如果需要更强大的数据库管理功能，可以使用以下工具：

#### DBeaver（推荐）
- 免费开源
- 支持PostgreSQL
- 功能强大

#### pgAdmin
- PostgreSQL官方工具
- 功能全面
- 适合专业用户

#### TablePlus
- 界面美观
- 操作简单
- 支持多种数据库

**连接信息**：
```
Host: 从VITE_SUPABASE_URL中提取
Port: 5432
Database: postgres
User: postgres
Password: 需要从Supabase控制台获取
```

---

## 数据备份与恢复

### 备份数据

**方法1：通过Supabase控制台**
1. 进入SQL Editor
2. 执行导出命令：
```sql
-- 导出产品数据
COPY products TO '/tmp/products_backup.csv' CSV HEADER;

-- 导出案例数据
COPY historical_cases TO '/tmp/cases_backup.csv' CSV HEADER;
```

**方法2：通过管理后台**
- 在产品管理或案例管理页面
- 可以逐个查看和记录数据

### 恢复数据

**通过SQL**：
```sql
-- 清空表（谨慎操作！）
TRUNCATE products CASCADE;
TRUNCATE historical_cases CASCADE;

-- 重新插入数据
-- 使用原始迁移文件中的INSERT语句
```

---

## 注意事项

### ⚠️ 重要提醒

1. **删除操作不可恢复**
   - 删除数据前请确认
   - 建议先备份重要数据

2. **修改表结构需谨慎**
   - 添加字段：相对安全
   - 删除字段：可能影响应用功能
   - 修改字段类型：可能导致数据丢失

3. **JSONB字段格式**
   - features和best_for字段是数组格式：`["项1", "项2"]`
   - solution_products字段是对象数组格式：`[{"room": "客厅", "productId": "xxx", ...}]`
   - 必须使用有效的JSON格式

4. **产品ID引用**
   - 删除产品前检查是否被案例引用
   - 案例中的productId必须对应实际存在的产品

5. **图片文件**
   - 文件名不能包含中文字符
   - 文件大小不超过1MB
   - 只支持jpg、jpeg、png、webp格式

6. **自动更新时间**
   - updated_at字段会在每次UPDATE时自动更新
   - 不需要手动设置

---

## 常见问题

### Q1: 如何重置所有数据？
A: 可以通过SQL Editor执行：
```sql
-- 清空所有产品
TRUNCATE products CASCADE;

-- 清空所有案例
TRUNCATE historical_cases CASCADE;

-- 然后重新运行初始化SQL（从迁移文件复制）
```

### Q2: 如何修改管理员密码？
A: 在项目根目录的`.env`文件中添加：
```
VITE_ADMIN_PASSWORD=your_new_password
```

### Q3: 数据库连接信息在哪里？
A: 在`.env`文件中：
```
VITE_SUPABASE_URL=https://backend.appmiaoda.com/projects/supabase252312970925752320
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Q4: 如何查看当前有多少数据？
A: 通过SQL查询：
```sql
-- 查看产品数量
SELECT COUNT(*) FROM products;

-- 查看案例数量
SELECT COUNT(*) FROM historical_cases;

-- 查看各类型产品数量
SELECT type, COUNT(*) FROM products GROUP BY type;
```

### Q5: 上传的图片存储在哪里？
A: 存储在Supabase Storage的`app-7ua9s9vs9fr5_floor_plans`桶中，可以在Supabase控制台的Storage部分查看和管理。

---

## 技术支持

如果遇到数据库相关问题：

1. **检查错误信息**：查看浏览器控制台或应用日志
2. **验证数据格式**：确保数据符合字段类型要求
3. **查看迁移文件**：了解表结构定义
4. **使用管理后台**：优先使用界面操作，更安全

---

## 更新日志

- **2024-12-27**：创建数据库更新指南文档
- **初始版本**：包含产品表和案例表的完整说明
