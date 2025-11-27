// 空调产品类型
export interface ACProduct {
  id: string;
  brand: string;
  model: string;
  type: 'central' | 'split' | 'duct' | 'portable';
  horsePower: number;
  suitableArea: {
    min: number;
    max: number;
  };
  energyLevel: string;
  currentPrice: number;
  originalPrice?: number;
  stock: number;
  inStock: boolean;
  features: string[];
  bestFor: string[];
  noise: number;
  cooling: number;
  heating: number;
  promotion?: string;
}

// 历史案例类型
export interface HistoricalCase {
  id: string;
  title: string;
  houseType: {
    area: number;
    rooms: string;
    orientation: string;
    floor: number;
    buildingType: string;
  };
  description: string;
  floorPlanImage?: string;
  solution: {
    type: string;
    products: Array<{
      room: string;
      productId: string;
      quantity: number;
      installPosition: string;
    }>;
    totalCost: number;
    installCost: number;
  };
  customerFeedback: string;
  tips: string[];
  completedDate: string;
}
