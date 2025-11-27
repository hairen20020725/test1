import { supabase } from './supabase';
import type { ACProduct, HistoricalCase } from '@/types/types';

// ==================== 产品管理 ====================

// 获取所有产品
export async function getAllProducts(): Promise<ACProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('type', { ascending: true })
    .order('horse_power', { ascending: true });

  if (error) {
    console.error('获取产品列表失败:', error);
    return [];
  }

  return Array.isArray(data) ? data.map(mapProductFromDB) : [];
}

// 根据类型获取产品
export async function getProductsByType(type: string): Promise<ACProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('type', type)
    .order('horse_power', { ascending: true });

  if (error) {
    console.error('获取产品列表失败:', error);
    return [];
  }

  return Array.isArray(data) ? data.map(mapProductFromDB) : [];
}

// 获取有库存的产品
export async function getInStockProducts(): Promise<ACProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('type', { ascending: true });

  if (error) {
    console.error('获取有货产品失败:', error);
    return [];
  }

  return Array.isArray(data) ? data.map(mapProductFromDB) : [];
}

// 添加产品
export async function addProduct(product: Omit<ACProduct, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('products')
    .insert([mapProductToDB(product)])
    .select()
    .maybeSingle();

  if (error) {
    console.error('添加产品失败:', error);
    throw new Error('添加产品失败');
  }

  return data ? mapProductFromDB(data) : null;
}

// 更新产品
export async function updateProduct(productId: string, updates: Partial<ACProduct>) {
  const { data, error } = await supabase
    .from('products')
    .update(mapProductToDB(updates))
    .eq('product_id', productId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('更新产品失败:', error);
    throw new Error('更新产品失败');
  }

  return data ? mapProductFromDB(data) : null;
}

// 删除产品
export async function deleteProduct(productId: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('product_id', productId);

  if (error) {
    console.error('删除产品失败:', error);
    throw new Error('删除产品失败');
  }
}

// ==================== 案例管理 ====================

// 获取所有案例
export async function getAllCases(): Promise<HistoricalCase[]> {
  const { data, error } = await supabase
    .from('historical_cases')
    .select('*')
    .order('house_area', { ascending: true });

  if (error) {
    console.error('获取案例列表失败:', error);
    return [];
  }

  return Array.isArray(data) ? data.map(mapCaseFromDB) : [];
}

// 根据ID获取单个案例
export async function getCaseById(id: string): Promise<HistoricalCase | null> {
  const { data, error } = await supabase
    .from('historical_cases')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('获取案例失败:', error);
    return null;
  }

  return data ? mapCaseFromDB(data) : null;
}

// 根据面积范围获取案例
export async function getCasesByAreaRange(minArea: number, maxArea: number): Promise<HistoricalCase[]> {
  const { data, error } = await supabase
    .from('historical_cases')
    .select('*')
    .gte('house_area', minArea)
    .lte('house_area', maxArea)
    .order('house_area', { ascending: true });

  if (error) {
    console.error('获取案例失败:', error);
    return [];
  }

  return Array.isArray(data) ? data.map(mapCaseFromDB) : [];
}

// 添加案例
export async function addCase(case_: Omit<HistoricalCase, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('historical_cases')
    .insert([mapCaseToDB(case_)])
    .select()
    .maybeSingle();

  if (error) {
    console.error('添加案例失败:', error);
    throw new Error('添加案例失败');
  }

  return data ? mapCaseFromDB(data) : null;
}

// 更新案例
export async function updateCase(caseId: string, updates: Partial<HistoricalCase>) {
  const { data, error } = await supabase
    .from('historical_cases')
    .update(mapCaseToDB(updates))
    .eq('case_id', caseId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('更新案例失败:', error);
    throw new Error('更新案例失败');
  }

  return data ? mapCaseFromDB(data) : null;
}

// 删除案例
export async function deleteCase(caseId: string) {
  const { error } = await supabase
    .from('historical_cases')
    .delete()
    .eq('case_id', caseId);

  if (error) {
    console.error('删除案例失败:', error);
    throw new Error('删除案例失败');
  }
}

// ==================== 数据映射函数 ====================

// 将数据库产品数据映射为应用数据
function mapProductFromDB(dbProduct: any): ACProduct {
  return {
    id: dbProduct.product_id,
    brand: dbProduct.brand,
    model: dbProduct.model,
    type: dbProduct.type,
    horsePower: Number(dbProduct.horse_power),
    suitableArea: {
      min: dbProduct.suitable_area_min,
      max: dbProduct.suitable_area_max
    },
    energyLevel: dbProduct.energy_level,
    currentPrice: Number(dbProduct.current_price),
    originalPrice: dbProduct.original_price ? Number(dbProduct.original_price) : undefined,
    stock: dbProduct.stock,
    inStock: dbProduct.in_stock,
    features: dbProduct.features || [],
    bestFor: dbProduct.best_for || [],
    noise: dbProduct.noise,
    cooling: dbProduct.cooling,
    heating: dbProduct.heating,
    promotion: dbProduct.promotion || undefined
  };
}

// 将应用产品数据映射为数据库数据
function mapProductToDB(product: Partial<ACProduct>): any {
  const dbProduct: any = {};

  if (product.id) dbProduct.product_id = product.id;
  if (product.brand) dbProduct.brand = product.brand;
  if (product.model) dbProduct.model = product.model;
  if (product.type) dbProduct.type = product.type;
  if (product.horsePower !== undefined) dbProduct.horse_power = product.horsePower;
  if (product.suitableArea) {
    dbProduct.suitable_area_min = product.suitableArea.min;
    dbProduct.suitable_area_max = product.suitableArea.max;
  }
  if (product.energyLevel) dbProduct.energy_level = product.energyLevel;
  if (product.currentPrice !== undefined) dbProduct.current_price = product.currentPrice;
  if (product.originalPrice !== undefined) dbProduct.original_price = product.originalPrice;
  if (product.stock !== undefined) dbProduct.stock = product.stock;
  if (product.inStock !== undefined) dbProduct.in_stock = product.inStock;
  if (product.features) dbProduct.features = product.features;
  if (product.bestFor) dbProduct.best_for = product.bestFor;
  if (product.noise !== undefined) dbProduct.noise = product.noise;
  if (product.cooling !== undefined) dbProduct.cooling = product.cooling;
  if (product.heating !== undefined) dbProduct.heating = product.heating;
  if (product.promotion !== undefined) dbProduct.promotion = product.promotion;

  return dbProduct;
}

// 将数据库案例数据映射为应用数据
function mapCaseFromDB(dbCase: any): HistoricalCase {
  return {
    id: dbCase.case_id,
    title: dbCase.title,
    houseType: {
      area: dbCase.house_area,
      rooms: dbCase.house_rooms,
      orientation: dbCase.house_orientation,
      floor: dbCase.house_floor,
      buildingType: dbCase.house_building_type
    },
    description: dbCase.description,
    floorPlanImage: dbCase.floor_plan_image || undefined,
    solution: {
      type: dbCase.solution_type,
      products: dbCase.solution_products || [],
      totalCost: Number(dbCase.solution_total_cost),
      installCost: Number(dbCase.solution_install_cost)
    },
    customerFeedback: dbCase.customer_feedback,
    tips: dbCase.tips || [],
    completedDate: dbCase.completed_date
  };
}

// 将应用案例数据映射为数据库数据
function mapCaseToDB(case_: Partial<HistoricalCase>): any {
  const dbCase: any = {};

  if (case_.id) dbCase.case_id = case_.id;
  if (case_.title) dbCase.title = case_.title;
  if (case_.houseType) {
    dbCase.house_area = case_.houseType.area;
    dbCase.house_rooms = case_.houseType.rooms;
    dbCase.house_orientation = case_.houseType.orientation;
    dbCase.house_floor = case_.houseType.floor;
    dbCase.house_building_type = case_.houseType.buildingType;
  }
  if (case_.description) dbCase.description = case_.description;
  if (case_.floorPlanImage !== undefined) dbCase.floor_plan_image = case_.floorPlanImage;
  if (case_.solution) {
    dbCase.solution_type = case_.solution.type;
    dbCase.solution_products = case_.solution.products;
    dbCase.solution_total_cost = case_.solution.totalCost;
    dbCase.solution_install_cost = case_.solution.installCost;
  }
  if (case_.customerFeedback) dbCase.customer_feedback = case_.customerFeedback;
  if (case_.tips) dbCase.tips = case_.tips;
  if (case_.completedDate) dbCase.completed_date = case_.completedDate;

  return dbCase;
}
