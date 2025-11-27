/*
# 创建空调产品和历史案例表

## 1. 新建表

### products（产品表）
- `id` (uuid, 主键)
- `product_id` (text, 产品编号，唯一)
- `brand` (text, 品牌)
- `model` (text, 型号)
- `type` (text, 类型：central/split/duct/portable)
- `horse_power` (numeric, 匹数)
- `suitable_area_min` (integer, 适用面积最小值)
- `suitable_area_max` (integer, 适用面积最大值)
- `energy_level` (text, 能效等级)
- `current_price` (numeric, 当前售价)
- `original_price` (numeric, 原价，可选)
- `stock` (integer, 库存数量)
- `in_stock` (boolean, 是否有货)
- `features` (jsonb, 产品特点数组)
- `best_for` (jsonb, 适用场景数组)
- `noise` (integer, 噪音分贝)
- `cooling` (integer, 制冷量W)
- `heating` (integer, 制热量W)
- `promotion` (text, 促销信息，可选)
- `created_at` (timestamptz, 创建时间)
- `updated_at` (timestamptz, 更新时间)

### historical_cases（历史案例表）
- `id` (uuid, 主键)
- `case_id` (text, 案例编号，唯一)
- `title` (text, 案例标题)
- `house_area` (integer, 总面积)
- `house_rooms` (text, 房间配置)
- `house_orientation` (text, 主要朝向)
- `house_floor` (integer, 楼层)
- `house_building_type` (text, 建筑类型)
- `description` (text, 户型描述)
- `floor_plan_image` (text, 户型图URL，可选)
- `solution_type` (text, 方案类型)
- `solution_products` (jsonb, 产品配置数组)
- `solution_total_cost` (numeric, 总费用)
- `solution_install_cost` (numeric, 安装费用)
- `customer_feedback` (text, 客户反馈)
- `tips` (jsonb, 注意事项数组)
- `completed_date` (text, 完成日期)
- `created_at` (timestamptz, 创建时间)
- `updated_at` (timestamptz, 更新时间)

## 2. 安全策略
- 不启用RLS，允许所有人读写（管理后台场景）
- 后续可根据需要添加认证和权限控制

## 3. 索引
- 为常用查询字段创建索引
*/

-- 创建产品表
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text UNIQUE NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  type text NOT NULL CHECK (type IN ('central', 'split', 'duct', 'portable')),
  horse_power numeric NOT NULL,
  suitable_area_min integer NOT NULL,
  suitable_area_max integer NOT NULL,
  energy_level text NOT NULL,
  current_price numeric NOT NULL,
  original_price numeric,
  stock integer NOT NULL DEFAULT 0,
  in_stock boolean NOT NULL DEFAULT true,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  best_for jsonb NOT NULL DEFAULT '[]'::jsonb,
  noise integer NOT NULL,
  cooling integer NOT NULL,
  heating integer NOT NULL,
  promotion text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建历史案例表
CREATE TABLE IF NOT EXISTS historical_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id text UNIQUE NOT NULL,
  title text NOT NULL,
  house_area integer NOT NULL,
  house_rooms text NOT NULL,
  house_orientation text NOT NULL,
  house_floor integer NOT NULL,
  house_building_type text NOT NULL,
  description text NOT NULL,
  floor_plan_image text,
  solution_type text NOT NULL,
  solution_products jsonb NOT NULL DEFAULT '[]'::jsonb,
  solution_total_cost numeric NOT NULL,
  solution_install_cost numeric NOT NULL,
  customer_feedback text NOT NULL,
  tips jsonb NOT NULL DEFAULT '[]'::jsonb,
  completed_date text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_cases_house_area ON historical_cases(house_area);
CREATE INDEX IF NOT EXISTS idx_cases_house_rooms ON historical_cases(house_rooms);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为产品表添加更新时间触发器
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 为案例表添加更新时间触发器
CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON historical_cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 插入初始产品数据
INSERT INTO products (product_id, brand, model, type, horse_power, suitable_area_min, suitable_area_max, energy_level, current_price, original_price, stock, in_stock, features, best_for, noise, cooling, heating, promotion) VALUES
('central-001', '格力', 'GMV-H180WL/A', 'central', 6, 100, 150, '一级能效', 38000, 45000, 3, true, '["全直流变频", "智能控制", "静音运行", "节能省电"]'::jsonb, '["大户型", "别墅", "复式"]'::jsonb, 38, 18000, 20000, '限时优惠，立减7000元'),
('central-002', '美的', 'MDS-H140W', 'central', 5, 80, 120, '一级能效', 32000, null, 5, true, '["智能温控", "低噪音", "快速制冷", "WiFi控制"]'::jsonb, '["三室两厅", "四室两厅"]'::jsonb, 36, 14000, 16000, null),
('central-003', '大金', 'VRV-P系列', 'central', 8, 150, 200, '一级能效', 58000, null, 2, true, '["高端品质", "超静音", "精准控温", "长寿命"]'::jsonb, '["大别墅", "豪宅", "高端住宅"]'::jsonb, 35, 22400, 25000, null),
('duct-001', '格力', 'FGR5/C', 'duct', 2, 25, 35, '一级能效', 6200, null, 12, true, '["隐藏式安装", "美观大方", "制冷均匀"]'::jsonb, '["客厅", "主卧"]'::jsonb, 40, 5000, 5800, null),
('duct-002', '美的', 'KFR-72T2W', 'duct', 3, 35, 50, '一级能效', 7800, null, 8, true, '["大风量", "快速制冷", "节能静音"]'::jsonb, '["大客厅", "开放式空间"]'::jsonb, 42, 7200, 8000, null),
('split-001', '格力', '云佳 KFR-35GW', 'split', 1.5, 15, 22, '一级能效', 3100, 3500, 25, true, '["性价比高", "静音舒适", "快速制冷"]'::jsonb, '["卧室", "书房", "小客厅"]'::jsonb, 38, 3500, 4200, '热销款，优惠400元'),
('split-002', '美的', '酷省电 KFR-26GW', 'split', 1, 10, 15, '一级能效', 2400, null, 30, true, '["超级节能", "智能温控", "除湿功能"]'::jsonb, '["小卧室", "儿童房", "书房"]'::jsonb, 36, 2600, 3200, null),
('split-003', '海尔', '智尊 KFR-35GW', 'split', 1.5, 15, 22, '一级能效', 3300, null, 18, true, '["自清洁", "智能控制", "健康除菌"]'::jsonb, '["主卧", "客卧", "老人房"]'::jsonb, 37, 3500, 4000, null),
('split-004', '奥克斯', '倾城 KFR-35GW', 'split', 1.5, 15, 22, '新一级能效', 2200, null, 35, true, '["高性价比", "快速制冷", "节能省电"]'::jsonb, '["出租房", "预算有限"]'::jsonb, 39, 3500, 3800, null),
('split-005', '格力', '悦雅 KFR-50GW', 'split', 2, 22, 32, '一级能效', 3900, null, 20, true, '["大匹数", "强劲制冷", "智能控制"]'::jsonb, '["大卧室", "客厅"]'::jsonb, 40, 5000, 5800, null),
('split-006', '美的', '风尊 KFR-72LW', 'split', 3, 32, 50, '一级能效', 5600, null, 15, true, '["柜机", "大风量", "快速制冷", "除湿净化"]'::jsonb, '["大客厅", "开放式空间"]'::jsonb, 43, 7200, 8000, null),
('portable-001', '美的', 'KY-25/N', 'portable', 1, 8, 12, '三级能效', 1680, null, 10, true, '["移动方便", "免安装", "适合租房"]'::jsonb, '["租房", "临时使用", "小房间"]'::jsonb, 45, 2500, 0, null);

-- 插入初始案例数据
INSERT INTO historical_cases (case_id, title, house_area, house_rooms, house_orientation, house_floor, house_building_type, description, solution_type, solution_products, solution_total_cost, solution_install_cost, customer_feedback, tips, completed_date) VALUES
('case-001', '阳光花园120㎡三室两厅中央空调方案', 120, '3室2厅', '南北通透', 15, '高层', '南北通透户型，客厅朝南约35㎡，主卧朝南20㎡，次卧朝北15㎡，儿童房朝北12㎡，餐厅与客厅连通。业主要求整体美观，静音舒适。', '中央空调', '[{"room": "全屋", "productId": "central-002", "quantity": 1, "installPosition": "客厅吊顶内，出风口分布各房间"}]'::jsonb, 32000, 8000, '非常满意！整体美观大方，温度控制精准，噪音很小，夏天全家都很舒适。', '["中央空调需要提前规划吊顶高度，建议预留28-30cm", "出风口位置要避开床头和沙发直吹", "定期清洗滤网，保持良好效果", "南北通透户型制冷效果好，能耗相对较低"]'::jsonb, '2024-05'),
('case-002', '锦绣家园85㎡两室两厅风管机+分体式方案', 85, '2室2厅', '南向', 8, '高层', '客厅朝南30㎡，主卧18㎡，次卧12㎡。业主预算有限，希望客厅美观，卧室实用。', '风管机+分体式', '[{"room": "客厅", "productId": "duct-001", "quantity": 1, "installPosition": "客厅吊顶中央，侧出风"}, {"room": "主卧", "productId": "split-001", "quantity": 1, "installPosition": "床尾墙面，避免直吹"}, {"room": "次卧", "productId": "split-002", "quantity": 1, "installPosition": "窗户上方，侧送风"}]'::jsonb, 11700, 2800, '方案很合理，客厅用风管机很美观，卧室用挂机性价比高，总体效果很好。', '["风管机只需客厅局部吊顶，节省空间", "卧室挂机选择静音型号，睡眠更舒适", "主卧面积较大选1.5匹，次卧小选1匹", "安装时注意室外机位置，避免噪音影响"]'::jsonb, '2024-06'),
('case-003', '幸福里60㎡小两居全分体式经济方案', 60, '2室1厅', '东南向', 5, '多层', '客厅20㎡，主卧15㎡，次卧10㎡。年轻夫妻首套房，预算有限，追求性价比。', '全分体式', '[{"room": "客厅", "productId": "split-005", "quantity": 1, "installPosition": "电视墙侧面，避免对着沙发"}, {"room": "主卧", "productId": "split-001", "quantity": 1, "installPosition": "床尾墙面，高度1.8米"}, {"room": "次卧", "productId": "split-004", "quantity": 1, "installPosition": "窗户上方，侧送风"}]'::jsonb, 9200, 1800, '价格实惠，效果不错，奥克斯的性价比确实高，格力的质量也很好。', '["小户型选择分体式最经济实用", "客厅选2匹柜机，制冷快", "卧室选1.5匹挂机，够用且省电", "次卧预算有限可选性价比品牌", "多层建筑室外机安装方便，费用较低"]'::jsonb, '2024-07'),
('case-004', '碧水湾180㎡复式别墅中央空调方案', 180, '4室3厅', '南向', 1, '别墅', '复式别墅，一层客厅餐厅50㎡，厨房15㎡，二层主卧套房35㎡，三个次卧各18㎡。业主追求高品质，预算充足。', '中央空调', '[{"room": "全屋", "productId": "central-003", "quantity": 1, "installPosition": "一层设备间，风管分布各楼层"}]'::jsonb, 58000, 15000, '大金的品质确实好，运行非常安静，温度控制精准，全家都很满意。', '["别墅建议选择高端品牌，质量和服务更有保障", "复式结构需要合理规划风管走向", "每层设置独立温控，节能舒适", "定期专业保养，延长使用寿命", "设备间要预留足够空间，方便维护"]'::jsonb, '2024-04'),
('case-005', '学府雅苑95㎡三室一厅混合方案', 95, '3室1厅', '西向', 20, '高层', '客厅28㎡，主卧16㎡，次卧12㎡，儿童房10㎡。西向户型，下午西晒严重。家有老人和小孩，要求静音健康。', '风管机+分体式', '[{"room": "客厅", "productId": "duct-001", "quantity": 1, "installPosition": "客厅中央吊顶，多出风口均匀送风"}, {"room": "主卧", "productId": "split-003", "quantity": 1, "installPosition": "床侧墙面，带自清洁功能"}, {"room": "次卧（老人房）", "productId": "split-003", "quantity": 1, "installPosition": "窗户上方，静音模式"}, {"room": "儿童房", "productId": "split-002", "quantity": 1, "installPosition": "书桌对面墙，避免直吹"}]'::jsonb, 15900, 3200, '海尔的自清洁功能很实用，老人和小孩用着放心。西晒问题解决了，夏天不热了。', '["西向户型建议适当增加匹数，应对西晒", "老人房和儿童房选择健康功能型号", "海尔自清洁功能减少细菌滋生", "客厅风管机多出风口，温度更均匀", "高层建筑注意室外机固定，确保安全"]'::jsonb, '2024-08');
