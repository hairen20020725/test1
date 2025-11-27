// 空调产品知识库 - 包含历史案例和现有库存

// 产品信息（现有库存）
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
  currentPrice: number; // 当前售价
  originalPrice?: number; // 原价（如有促销）
  stock: number; // 库存数量
  inStock: boolean; // 是否有货
  features: string[];
  bestFor: string[]; // 最适合的场景
  noise: number; // 噪音分贝
  cooling: number; // 制冷量 (W)
  heating: number; // 制热量 (W)
  promotion?: string; // 促销信息
}

// 历史案例
export interface HistoricalCase {
  id: string;
  title: string; // 案例标题
  houseType: {
    area: number; // 总面积
    rooms: string; // 房间配置，如"3室2厅"
    orientation: string; // 主要朝向
    floor: number; // 楼层
    buildingType: string; // 建筑类型：高层/多层/别墅
  };
  description: string; // 户型描述
  solution: {
    type: string; // 方案类型：中央空调/风管机+分体式/全分体式
    products: Array<{
      room: string; // 房间名称
      productId: string; // 产品ID
      quantity: number; // 数量
      installPosition: string; // 安装位置
    }>;
    totalCost: number; // 总费用
    installCost: number; // 安装费用
  };
  customerFeedback: string; // 客户反馈
  tips: string[]; // 注意事项和经验总结
  completedDate: string; // 完成日期
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
    currentPrice: 38000,
    originalPrice: 45000,
    stock: 3,
    inStock: true,
    features: ['全直流变频', '智能控制', '静音运行', '节能省电'],
    bestFor: ['大户型', '别墅', '复式'],
    noise: 38,
    cooling: 18000,
    heating: 20000,
    promotion: '限时优惠，立减7000元'
  },
  {
    id: 'central-002',
    brand: '美的',
    model: 'MDS-H140W',
    type: 'central',
    horsePower: 5,
    suitableArea: { min: 80, max: 120 },
    energyLevel: '一级能效',
    currentPrice: 32000,
    stock: 5,
    inStock: true,
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
    currentPrice: 58000,
    stock: 2,
    inStock: true,
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
    currentPrice: 6200,
    stock: 12,
    inStock: true,
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
    currentPrice: 7800,
    stock: 8,
    inStock: true,
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
    currentPrice: 3100,
    originalPrice: 3500,
    stock: 25,
    inStock: true,
    features: ['性价比高', '静音舒适', '快速制冷'],
    bestFor: ['卧室', '书房', '小客厅'],
    noise: 38,
    cooling: 3500,
    heating: 4200,
    promotion: '热销款，优惠400元'
  },
  {
    id: 'split-002',
    brand: '美的',
    model: '酷省电 KFR-26GW',
    type: 'split',
    horsePower: 1,
    suitableArea: { min: 10, max: 15 },
    energyLevel: '一级能效',
    currentPrice: 2400,
    stock: 30,
    inStock: true,
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
    currentPrice: 3300,
    stock: 18,
    inStock: true,
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
    currentPrice: 2200,
    stock: 35,
    inStock: true,
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
    currentPrice: 3900,
    stock: 20,
    inStock: true,
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
    currentPrice: 5600,
    stock: 15,
    inStock: true,
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
    currentPrice: 1680,
    stock: 10,
    inStock: true,
    features: ['移动方便', '免安装', '适合租房'],
    bestFor: ['租房', '临时使用', '小房间'],
    noise: 45,
    cooling: 2500,
    heating: 0
  }
];

// 历史成功案例
export const historicalCases: HistoricalCase[] = [
  {
    id: 'case-001',
    title: '阳光花园120㎡三室两厅中央空调方案',
    houseType: {
      area: 120,
      rooms: '3室2厅',
      orientation: '南北通透',
      floor: 15,
      buildingType: '高层'
    },
    description: '南北通透户型，客厅朝南约35㎡，主卧朝南20㎡，次卧朝北15㎡，儿童房朝北12㎡，餐厅与客厅连通。业主要求整体美观，静音舒适。',
    solution: {
      type: '中央空调',
      products: [
        {
          room: '全屋',
          productId: 'central-002',
          quantity: 1,
          installPosition: '客厅吊顶内，出风口分布各房间'
        }
      ],
      totalCost: 32000,
      installCost: 8000
    },
    customerFeedback: '非常满意！整体美观大方，温度控制精准，噪音很小，夏天全家都很舒适。',
    tips: [
      '中央空调需要提前规划吊顶高度，建议预留28-30cm',
      '出风口位置要避开床头和沙发直吹',
      '定期清洗滤网，保持良好效果',
      '南北通透户型制冷效果好，能耗相对较低'
    ],
    completedDate: '2024-05'
  },
  {
    id: 'case-002',
    title: '锦绣家园85㎡两室两厅风管机+分体式方案',
    houseType: {
      area: 85,
      rooms: '2室2厅',
      orientation: '南向',
      floor: 8,
      buildingType: '高层'
    },
    description: '客厅朝南30㎡，主卧18㎡，次卧12㎡。业主预算有限，希望客厅美观，卧室实用。',
    solution: {
      type: '风管机+分体式',
      products: [
        {
          room: '客厅',
          productId: 'duct-001',
          quantity: 1,
          installPosition: '客厅吊顶中央，侧出风'
        },
        {
          room: '主卧',
          productId: 'split-001',
          quantity: 1,
          installPosition: '床尾墙面，避免直吹'
        },
        {
          room: '次卧',
          productId: 'split-002',
          quantity: 1,
          installPosition: '窗户上方，侧送风'
        }
      ],
      totalCost: 11700,
      installCost: 2800
    },
    customerFeedback: '方案很合理，客厅用风管机很美观，卧室用挂机性价比高，总体效果很好。',
    tips: [
      '风管机只需客厅局部吊顶，节省空间',
      '卧室挂机选择静音型号，睡眠更舒适',
      '主卧面积较大选1.5匹，次卧小选1匹',
      '安装时注意室外机位置，避免噪音影响'
    ],
    completedDate: '2024-06'
  },
  {
    id: 'case-003',
    title: '幸福里60㎡小两居全分体式经济方案',
    houseType: {
      area: 60,
      rooms: '2室1厅',
      orientation: '东南向',
      floor: 5,
      buildingType: '多层'
    },
    description: '客厅20㎡，主卧15㎡，次卧10㎡。年轻夫妻首套房，预算有限，追求性价比。',
    solution: {
      type: '全分体式',
      products: [
        {
          room: '客厅',
          productId: 'split-005',
          quantity: 1,
          installPosition: '电视墙侧面，避免对着沙发'
        },
        {
          room: '主卧',
          productId: 'split-001',
          quantity: 1,
          installPosition: '床尾墙面，高度1.8米'
        },
        {
          room: '次卧',
          productId: 'split-004',
          quantity: 1,
          installPosition: '窗户上方，侧送风'
        }
      ],
      totalCost: 9200,
      installCost: 1800
    },
    customerFeedback: '价格实惠，效果不错，奥克斯的性价比确实高，格力的质量也很好。',
    tips: [
      '小户型选择分体式最经济实用',
      '客厅选2匹柜机，制冷快',
      '卧室选1.5匹挂机，够用且省电',
      '次卧预算有限可选性价比品牌',
      '多层建筑室外机安装方便，费用较低'
    ],
    completedDate: '2024-07'
  },
  {
    id: 'case-004',
    title: '碧水湾180㎡复式别墅中央空调方案',
    houseType: {
      area: 180,
      rooms: '4室3厅',
      orientation: '南向',
      floor: 1,
      buildingType: '别墅'
    },
    description: '复式别墅，一层客厅餐厅50㎡，厨房15㎡，二层主卧套房35㎡，三个次卧各18㎡。业主追求高品质，预算充足。',
    solution: {
      type: '中央空调',
      products: [
        {
          room: '全屋',
          productId: 'central-003',
          quantity: 1,
          installPosition: '一层设备间，风管分布各楼层'
        }
      ],
      totalCost: 58000,
      installCost: 15000
    },
    customerFeedback: '大金的品质确实好，运行非常安静，温度控制精准，全家都很满意。',
    tips: [
      '别墅建议选择高端品牌，质量和服务更有保障',
      '复式结构需要合理规划风管走向',
      '每层设置独立温控，节能舒适',
      '定期专业保养，延长使用寿命',
      '设备间要预留足够空间，方便维护'
    ],
    completedDate: '2024-04'
  },
  {
    id: 'case-005',
    title: '学府雅苑95㎡三室一厅混合方案',
    houseType: {
      area: 95,
      rooms: '3室1厅',
      orientation: '西向',
      floor: 20,
      buildingType: '高层'
    },
    description: '客厅28㎡，主卧16㎡，次卧12㎡，儿童房10㎡。西向户型，下午西晒严重。家有老人和小孩，要求静音健康。',
    solution: {
      type: '风管机+分体式',
      products: [
        {
          room: '客厅',
          productId: 'duct-001',
          quantity: 1,
          installPosition: '客厅中央吊顶，多出风口均匀送风'
        },
        {
          room: '主卧',
          productId: 'split-003',
          quantity: 1,
          installPosition: '床侧墙面，带自清洁功能'
        },
        {
          room: '次卧（老人房）',
          productId: 'split-003',
          quantity: 1,
          installPosition: '窗户上方，静音模式'
        },
        {
          room: '儿童房',
          productId: 'split-002',
          quantity: 1,
          installPosition: '书桌对面墙，避免直吹'
        }
      ],
      totalCost: 15900,
      installCost: 3200
    },
    customerFeedback: '海尔的自清洁功能很实用，老人和小孩用着放心。西晒问题解决了，夏天不热了。',
    tips: [
      '西向户型建议适当增加匹数，应对西晒',
      '老人房和儿童房选择健康功能型号',
      '海尔自清洁功能减少细菌滋生',
      '客厅风管机多出风口，温度更均匀',
      '高层建筑注意室外机固定，确保安全'
    ],
    completedDate: '2024-08'
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

// 将产品知识库和历史案例转换为AI可读的文本格式
export function getACKnowledgeBase(): string {
  let knowledge = '# 空调产品知识库和历史案例\n\n';
  
  knowledge += '## 一、现有库存产品\n\n';
  
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
    
    knowledge += `### ${getACTypeName(type as ACProduct['type'])}\n\n`;
    
    products.forEach(product => {
      knowledge += `#### ${product.brand} ${product.model} (产品ID: ${product.id})\n`;
      knowledge += `- **匹数**: ${product.horsePower}匹\n`;
      knowledge += `- **适用面积**: ${product.suitableArea.min}-${product.suitableArea.max}㎡\n`;
      knowledge += `- **能效等级**: ${product.energyLevel}\n`;
      knowledge += `- **当前售价**: ¥${product.currentPrice.toLocaleString()}`;
      if (product.originalPrice) {
        knowledge += ` (原价¥${product.originalPrice.toLocaleString()})`;
      }
      knowledge += '\n';
      knowledge += `- **库存**: ${product.stock}台 ${product.inStock ? '✓有货' : '✗缺货'}\n`;
      knowledge += `- **制冷量**: ${product.cooling}W | **制热量**: ${product.heating}W\n`;
      knowledge += `- **噪音**: ${product.noise}dB\n`;
      knowledge += `- **特点**: ${product.features.join('、')}\n`;
      knowledge += `- **适用场景**: ${product.bestFor.join('、')}\n`;
      if (product.promotion) {
        knowledge += `- **促销信息**: ${product.promotion}\n`;
      }
      knowledge += '\n';
    });
  });

  knowledge += '\n## 二、历史成功案例\n\n';
  knowledge += '以下是我们过往完成的真实案例，可作为参考：\n\n';

  historicalCases.forEach((case_, index) => {
    knowledge += `### 案例${index + 1}: ${case_.title}\n\n`;
    knowledge += `**户型信息**:\n`;
    knowledge += `- 面积: ${case_.houseType.area}㎡\n`;
    knowledge += `- 户型: ${case_.houseType.rooms}\n`;
    knowledge += `- 朝向: ${case_.houseType.orientation}\n`;
    knowledge += `- 楼层: ${case_.houseType.floor}层\n`;
    knowledge += `- 建筑类型: ${case_.houseType.buildingType}\n\n`;
    
    knowledge += `**户型描述**: ${case_.description}\n\n`;
    
    knowledge += `**解决方案** (${case_.solution.type}):\n`;
    case_.solution.products.forEach(p => {
      const product = acProducts.find(prod => prod.id === p.productId);
      if (product) {
        knowledge += `- ${p.room}: ${product.brand} ${product.model} × ${p.quantity}台\n`;
        knowledge += `  安装位置: ${p.installPosition}\n`;
      }
    });
    knowledge += `- 设备费用: ¥${case_.solution.totalCost.toLocaleString()}\n`;
    knowledge += `- 安装费用: ¥${case_.solution.installCost.toLocaleString()}\n`;
    knowledge += `- 总费用: ¥${(case_.solution.totalCost + case_.solution.installCost).toLocaleString()}\n\n`;
    
    knowledge += `**客户反馈**: ${case_.customerFeedback}\n\n`;
    
    knowledge += `**经验总结**:\n`;
    case_.tips.forEach(tip => {
      knowledge += `- ${tip}\n`;
    });
    knowledge += `\n**完成时间**: ${case_.completedDate}\n\n`;
    knowledge += '---\n\n';
  });

  knowledge += '\n## 三、推荐原则\n\n';
  knowledge += '1. **优先推荐有库存的产品**: 确保方案可立即实施\n';
  knowledge += '2. **参考历史案例**: 找到相似户型的成功经验\n';
  knowledge += '3. **面积精准匹配**: 根据房间面积选择合适匹数\n';
  knowledge += '4. **考虑实际预算**: 在预算范围内选择性价比最高的产品\n';
  knowledge += '5. **使用场景优化**: 卧室优先静音，客厅优先制冷量，老人房优先健康功能\n';
  knowledge += '6. **户型适配**: 大户型推荐中央空调，中户型推荐风管机+分体式，小户型推荐全分体式\n';
  knowledge += '7. **能效优先**: 优先推荐一级能效产品，长期使用更省电\n';
  knowledge += '8. **关注促销**: 优先推荐有促销活动的产品，为客户节省费用\n';

  return knowledge;
}

// 从数据库数据生成知识库（用于AI推荐）
export async function generateKnowledgeBaseFromDB(
  products: any[],
  cases: any[]
): Promise<string> {
  let knowledge = '# 空调产品知识库和历史案例\n\n';
  
  knowledge += '## 一、现有库存产品\n\n';
  
  const groupedProducts: Record<string, any[]> = {
    central: [],
    duct: [],
    split: [],
    portable: []
  };

  products.forEach(product => {
    if (groupedProducts[product.type]) {
      groupedProducts[product.type].push(product);
    }
  });

  Object.entries(groupedProducts).forEach(([type, prods]) => {
    if (prods.length === 0) return;
    
    knowledge += `### ${getACTypeName(type as any)}\n\n`;
    
    prods.forEach(product => {
      knowledge += `#### ${product.brand} ${product.model} (产品ID: ${product.id})\n`;
      knowledge += `- **匹数**: ${product.horsePower}匹\n`;
      knowledge += `- **适用面积**: ${product.suitableArea.min}-${product.suitableArea.max}㎡\n`;
      knowledge += `- **能效等级**: ${product.energyLevel}\n`;
      knowledge += `- **当前售价**: ¥${product.currentPrice.toLocaleString()}`;
      if (product.originalPrice) {
        knowledge += ` (原价¥${product.originalPrice.toLocaleString()})`;
      }
      knowledge += '\n';
      knowledge += `- **库存**: ${product.stock}台 ${product.inStock ? '✓有货' : '✗缺货'}\n`;
      knowledge += `- **制冷量**: ${product.cooling}W | **制热量**: ${product.heating}W\n`;
      knowledge += `- **噪音**: ${product.noise}dB\n`;
      knowledge += `- **特点**: ${product.features.join('、')}\n`;
      knowledge += `- **适用场景**: ${product.bestFor.join('、')}\n`;
      if (product.promotion) {
        knowledge += `- **促销信息**: ${product.promotion}\n`;
      }
      knowledge += '\n';
    });
  });

  knowledge += '\n## 二、历史成功案例\n\n';
  knowledge += '以下是我们过往完成的真实案例，可作为参考：\n\n';

  cases.forEach((case_, index) => {
    knowledge += `### 案例${index + 1}: ${case_.title}\n\n`;
    knowledge += `**户型信息**:\n`;
    knowledge += `- 面积: ${case_.houseType.area}㎡\n`;
    knowledge += `- 户型: ${case_.houseType.rooms}\n`;
    knowledge += `- 朝向: ${case_.houseType.orientation}\n`;
    knowledge += `- 楼层: ${case_.houseType.floor}层\n`;
    knowledge += `- 建筑类型: ${case_.houseType.buildingType}\n\n`;
    
    knowledge += `**户型描述**: ${case_.description}\n\n`;
    
    knowledge += `**解决方案** (${case_.solution.type}):\n`;
    case_.solution.products.forEach((p: any) => {
      const product = products.find(prod => prod.id === p.productId);
      if (product) {
        knowledge += `- ${p.room}: ${product.brand} ${product.model} × ${p.quantity}台\n`;
        knowledge += `  安装位置: ${p.installPosition}\n`;
      }
    });
    knowledge += `- 设备费用: ¥${case_.solution.totalCost.toLocaleString()}\n`;
    knowledge += `- 安装费用: ¥${case_.solution.installCost.toLocaleString()}\n`;
    knowledge += `- 总费用: ¥${(case_.solution.totalCost + case_.solution.installCost).toLocaleString()}\n\n`;
    
    knowledge += `**客户反馈**: ${case_.customerFeedback}\n\n`;
    
    knowledge += `**经验总结**:\n`;
    case_.tips.forEach((tip: string) => {
      knowledge += `- ${tip}\n`;
    });
    knowledge += `\n**完成时间**: ${case_.completedDate}\n\n`;
    knowledge += '---\n\n';
  });

  knowledge += '\n## 三、推荐原则\n\n';
  knowledge += '1. **优先推荐有库存的产品**: 确保方案可立即实施\n';
  knowledge += '2. **参考历史案例**: 找到相似户型的成功经验\n';
  knowledge += '3. **面积精准匹配**: 根据房间面积选择合适匹数\n';
  knowledge += '4. **考虑实际预算**: 在预算范围内选择性价比最高的产品\n';
  knowledge += '5. **使用场景优化**: 卧室优先静音，客厅优先制冷量，老人房优先健康功能\n';
  knowledge += '6. **户型适配**: 大户型推荐中央空调，中户型推荐风管机+分体式，小户型推荐全分体式\n';
  knowledge += '7. **能效优先**: 优先推荐一级能效产品，长期使用更省电\n';
  knowledge += '8. **关注促销**: 优先推荐有促销活动的产品，为客户节省费用\n';

  return knowledge;
}
