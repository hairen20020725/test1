// 空调产品知识库

export interface ACProduct {
  id: string;
  brand: string;
  model: string;
  type: 'central' | 'split' | 'duct' | 'portable';
  horsePower: number; // 匹数
  suitableArea: {
    min: number;
    max: number;
  };
  energyLevel: string; // 能效等级
  price: {
    min: number;
    max: number;
  };
  features: string[];
  bestFor: string[]; // 最适合的场景
  noise: number; // 噪音分贝
  cooling: number; // 制冷量 (W)
  heating: number; // 制热量 (W)
}

export const acProducts: ACProduct[] = [
  // 中央空调系列
  {
    id: 'central-001',
    brand: '格力',
    model: 'GMV-H180WL/A',
    type: 'central',
    horsePower: 6,
    suitableArea: { min: 100, max: 150 },
    energyLevel: '一级能效',
    price: { min: 35000, max: 45000 },
    features: ['全直流变频', '智能控制', '静音运行', '节能省电'],
    bestFor: ['大户型', '别墅', '复式'],
    noise: 38,
    cooling: 18000,
    heating: 20000
  },
  {
    id: 'central-002',
    brand: '美的',
    model: 'MDS-H140W',
    type: 'central',
    horsePower: 5,
    suitableArea: { min: 80, max: 120 },
    energyLevel: '一级能效',
    price: { min: 28000, max: 38000 },
    features: ['智能温控', '低噪音', '快速制冷', 'WiFi控制'],
    bestFor: ['三室两厅', '四室两厅'],
    noise: 36,
    cooling: 14000,
    heating: 16000
  },
  {
    id: 'central-003',
    brand: '大金',
    model: 'VRV-P系列',
    type: 'central',
    horsePower: 8,
    suitableArea: { min: 150, max: 200 },
    energyLevel: '一级能效',
    price: { min: 50000, max: 70000 },
    features: ['高端品质', '超静音', '精准控温', '长寿命'],
    bestFor: ['大别墅', '豪宅', '高端住宅'],
    noise: 35,
    cooling: 22400,
    heating: 25000
  },

  // 风管机系列
  {
    id: 'duct-001',
    brand: '格力',
    model: 'FGR5/C',
    type: 'duct',
    horsePower: 2,
    suitableArea: { min: 25, max: 35 },
    energyLevel: '一级能效',
    price: { min: 5500, max: 7500 },
    features: ['隐藏式安装', '美观大方', '制冷均匀'],
    bestFor: ['客厅', '主卧'],
    noise: 40,
    cooling: 5000,
    heating: 5800
  },
  {
    id: 'duct-002',
    brand: '美的',
    model: 'KFR-72T2W',
    type: 'duct',
    horsePower: 3,
    suitableArea: { min: 35, max: 50 },
    energyLevel: '一级能效',
    price: { min: 7000, max: 9000 },
    features: ['大风量', '快速制冷', '节能静音'],
    bestFor: ['大客厅', '开放式空间'],
    noise: 42,
    cooling: 7200,
    heating: 8000
  },

  // 分体式空调系列
  {
    id: 'split-001',
    brand: '格力',
    model: '云佳 KFR-35GW',
    type: 'split',
    horsePower: 1.5,
    suitableArea: { min: 15, max: 22 },
    energyLevel: '一级能效',
    price: { min: 2800, max: 3500 },
    features: ['性价比高', '静音舒适', '快速制冷'],
    bestFor: ['卧室', '书房', '小客厅'],
    noise: 38,
    cooling: 3500,
    heating: 4200
  },
  {
    id: 'split-002',
    brand: '美的',
    model: '酷省电 KFR-26GW',
    type: 'split',
    horsePower: 1,
    suitableArea: { min: 10, max: 15 },
    energyLevel: '一级能效',
    price: { min: 2200, max: 2800 },
    features: ['超级节能', '智能温控', '除湿功能'],
    bestFor: ['小卧室', '儿童房', '书房'],
    noise: 36,
    cooling: 2600,
    heating: 3200
  },
  {
    id: 'split-003',
    brand: '海尔',
    model: '智尊 KFR-35GW',
    type: 'split',
    horsePower: 1.5,
    suitableArea: { min: 15, max: 22 },
    energyLevel: '一级能效',
    price: { min: 3000, max: 3800 },
    features: ['自清洁', '智能控制', '健康除菌'],
    bestFor: ['主卧', '客卧', '老人房'],
    noise: 37,
    cooling: 3500,
    heating: 4000
  },
  {
    id: 'split-004',
    brand: '奥克斯',
    model: '倾城 KFR-35GW',
    type: 'split',
    horsePower: 1.5,
    suitableArea: { min: 15, max: 22 },
    energyLevel: '新一级能效',
    price: { min: 2000, max: 2600 },
    features: ['高性价比', '快速制冷', '节能省电'],
    bestFor: ['出租房', '预算有限'],
    noise: 39,
    cooling: 3500,
    heating: 3800
  },
  {
    id: 'split-005',
    brand: '格力',
    model: '悦雅 KFR-50GW',
    type: 'split',
    horsePower: 2,
    suitableArea: { min: 22, max: 32 },
    energyLevel: '一级能效',
    price: { min: 3500, max: 4500 },
    features: ['大匹数', '强劲制冷', '智能控制'],
    bestFor: ['大卧室', '客厅'],
    noise: 40,
    cooling: 5000,
    heating: 5800
  },
  {
    id: 'split-006',
    brand: '美的',
    model: '风尊 KFR-72LW',
    type: 'split',
    horsePower: 3,
    suitableArea: { min: 32, max: 50 },
    energyLevel: '一级能效',
    price: { min: 5000, max: 6500 },
    features: ['柜机', '大风量', '快速制冷', '除湿净化'],
    bestFor: ['大客厅', '开放式空间'],
    noise: 43,
    cooling: 7200,
    heating: 8000
  },

  // 移动空调（特殊场景）
  {
    id: 'portable-001',
    brand: '美的',
    model: 'KY-25/N',
    type: 'portable',
    horsePower: 1,
    suitableArea: { min: 8, max: 12 },
    energyLevel: '三级能效',
    price: { min: 1500, max: 2000 },
    features: ['移动方便', '免安装', '适合租房'],
    bestFor: ['租房', '临时使用', '小房间'],
    noise: 45,
    cooling: 2500,
    heating: 0
  }
];

// 获取产品类型的中文名称
export function getACTypeName(type: ACProduct['type']): string {
  const typeMap = {
    central: '中央空调',
    split: '分体式空调',
    duct: '风管机',
    portable: '移动空调'
  };
  return typeMap[type];
}

// 将产品知识库转换为AI可读的文本格式
export function getACKnowledgeBase(): string {
  let knowledge = '# 空调产品知识库\n\n';
  
  const groupedProducts: Record<string, ACProduct[]> = {
    central: [],
    duct: [],
    split: [],
    portable: []
  };

  acProducts.forEach(product => {
    groupedProducts[product.type].push(product);
  });

  Object.entries(groupedProducts).forEach(([type, products]) => {
    if (products.length === 0) return;
    
    knowledge += `## ${getACTypeName(type as ACProduct['type'])}\n\n`;
    
    products.forEach(product => {
      knowledge += `### ${product.brand} ${product.model}\n`;
      knowledge += `- **匹数**: ${product.horsePower}匹\n`;
      knowledge += `- **适用面积**: ${product.suitableArea.min}-${product.suitableArea.max}㎡\n`;
      knowledge += `- **能效等级**: ${product.energyLevel}\n`;
      knowledge += `- **价格区间**: ¥${product.price.min.toLocaleString()}-${product.price.max.toLocaleString()}\n`;
      knowledge += `- **制冷量**: ${product.cooling}W\n`;
      knowledge += `- **制热量**: ${product.heating}W\n`;
      knowledge += `- **噪音**: ${product.noise}dB\n`;
      knowledge += `- **特点**: ${product.features.join('、')}\n`;
      knowledge += `- **适用场景**: ${product.bestFor.join('、')}\n\n`;
    });
  });

  knowledge += '\n## 推荐原则\n\n';
  knowledge += '1. **面积匹配**: 根据房间面积选择合适匹数，确保制冷/制热效果\n';
  knowledge += '2. **预算考虑**: 在预算范围内选择性价比最高的产品\n';
  knowledge += '3. **使用场景**: 卧室优先静音，客厅优先制冷量，老人房优先健康功能\n';
  knowledge += '4. **户型适配**: 大户型推荐中央空调，中户型推荐风管机+分体式，小户型推荐全分体式\n';
  knowledge += '5. **能效优先**: 优先推荐一级能效产品，长期使用更省电\n';

  return knowledge;
}
