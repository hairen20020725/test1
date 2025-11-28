import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ProductCard';
import { getAllProducts } from '@/db/api';
import type { ACProduct } from '@/types/types';
import { ArrowLeft, Search, BookOpen, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ProductKnowledge() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ACProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const productsData = await getAllProducts();
    setProducts(productsData);
    setLoading(false);
  };

  // 过滤产品
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === 'all' || product.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // 排序产品
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.currentPrice - b.currentPrice;
      case 'price-desc':
        return b.currentPrice - a.currentPrice;
      case 'power-asc':
        return a.horsePower - b.horsePower;
      case 'power-desc':
        return b.horsePower - a.horsePower;
      case 'brand':
        return a.brand.localeCompare(b.brand, 'zh-CN');
      default:
        return 0;
    }
  });

  // 按类型分组
  const productsByType = {
    all: sortedProducts,
    central: sortedProducts.filter(p => p.type === 'central'),
    duct: sortedProducts.filter(p => p.type === 'duct'),
    split: sortedProducts.filter(p => p.type === 'split'),
    portable: sortedProducts.filter(p => p.type === 'portable'),
  };

  // 统计信息
  const stats = {
    total: products.length,
    central: products.filter(p => p.type === 'central').length,
    duct: products.filter(p => p.type === 'duct').length,
    split: products.filter(p => p.type === 'split').length,
    portable: products.filter(p => p.type === 'portable').length,
    inStock: products.filter(p => p.inStock).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* 顶部导航栏 */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="gap-1 md:gap-2 px-2 md:px-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">返回首页</span>
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <h1 className="text-lg md:text-2xl font-bold">产品知识库</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card>
            <CardContent className="pt-4 md:pt-6 pb-4 md:pb-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stats.total}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">全部产品</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 md:pt-6 pb-4 md:pb-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">{stats.central}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">中央空调</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 md:pt-6 pb-4 md:pb-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-600">{stats.duct}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">风管机</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 md:pt-6 pb-4 md:pb-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-600">{stats.split}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">分体式</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 md:pt-6 pb-4 md:pb-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-600">{stats.portable}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">移动空调</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 md:pt-6 pb-4 md:pb-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-emerald-600">{stats.inStock}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">有货产品</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 搜索和筛选 */}
        <Card className="mb-6 md:mb-8">
          <CardContent className="pt-4 md:pt-6 pb-4 md:pb-6">
            <div className="flex flex-col gap-3 md:gap-4">
              {/* 搜索框 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索品牌、型号或特点..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 md:h-11"
                />
              </div>

              {/* 排序选择 */}
              <div className="w-full">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="排序方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">默认排序</SelectItem>
                    <SelectItem value="price-asc">价格从低到高</SelectItem>
                    <SelectItem value="price-desc">价格从高到低</SelectItem>
                    <SelectItem value="power-asc">匹数从小到大</SelectItem>
                    <SelectItem value="power-desc">匹数从大到小</SelectItem>
                    <SelectItem value="brand">品牌排序</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 搜索结果提示 */}
            {searchQuery && (
              <div className="mt-4 text-sm text-muted-foreground">
                找到 <span className="font-semibold text-foreground">{filteredProducts.length}</span> 个相关产品
              </div>
            )}
          </CardContent>
        </Card>

        {/* 产品列表 */}
        <Card>
          <CardHeader className="pb-4 md:pb-6">
            <CardTitle className="text-lg md:text-xl">产品列表</CardTitle>
            <p className="text-xs md:text-sm text-muted-foreground">
              浏览我们的空调产品库，找到最适合您的产品
            </p>
          </CardHeader>
          <CardContent className="px-2 md:px-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">加载产品数据中...</p>
              </div>
            ) : (
              <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-4 md:mb-6 h-auto">
                  <TabsTrigger value="all" className="text-xs md:text-sm px-1 md:px-3 py-2">
                    <span className="hidden sm:inline">全部</span>
                    <span className="sm:hidden">全部</span>
                    <span className="ml-1">({productsByType.all.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="central" className="text-xs md:text-sm px-1 md:px-3 py-2">
                    <span className="hidden sm:inline">中央空调</span>
                    <span className="sm:hidden">中央</span>
                    <span className="ml-1">({productsByType.central.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="duct" className="text-xs md:text-sm px-1 md:px-3 py-2">
                    <span className="hidden sm:inline">风管机</span>
                    <span className="sm:hidden">风管</span>
                    <span className="ml-1">({productsByType.duct.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="split" className="text-xs md:text-sm px-1 md:px-3 py-2">
                    <span className="hidden sm:inline">分体式</span>
                    <span className="sm:hidden">分体</span>
                    <span className="ml-1">({productsByType.split.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="portable" className="text-xs md:text-sm px-1 md:px-3 py-2">
                    <span className="hidden sm:inline">移动空调</span>
                    <span className="sm:hidden">移动</span>
                    <span className="ml-1">({productsByType.portable.length})</span>
                  </TabsTrigger>
                </TabsList>

                {(['all', 'central', 'duct', 'split', 'portable'] as const).map((type) => (
                  <TabsContent key={type} value={type}>
                    {productsByType[type].length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">
                          {searchQuery ? '没有找到匹配的产品' : '暂无产品'}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0">
                        {productsByType[type].map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* 底部提示 */}
        <div className="mt-8 text-center">
          <Card className="inline-block">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                💡 提示：点击产品卡片可以查看详细信息
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
