import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '@/db/api';
import type { ACProduct } from '@/types/types';

export default function ProductManagement() {
  const [products, setProducts] = useState<ACProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ACProduct | null>(null);

  const form = useForm<{
    id: string;
    brand: string;
    model: string;
    type: 'central' | 'split' | 'duct' | 'portable';
    horsePower: number;
    suitableAreaMin: number;
    suitableAreaMax: number;
    energyLevel: string;
    currentPrice: number;
    originalPrice: number;
    stock: number;
    inStock: boolean;
    features: string;
    bestFor: string;
    noise: number;
    cooling: number;
    heating: number;
    promotion: string;
  }>({
    defaultValues: {
      id: '',
      brand: '',
      model: '',
      type: 'split',
      horsePower: 1,
      suitableAreaMin: 10,
      suitableAreaMax: 15,
      energyLevel: '一级能效',
      currentPrice: 0,
      originalPrice: 0,
      stock: 0,
      inStock: true,
      features: '',
      bestFor: '',
      noise: 35,
      cooling: 2600,
      heating: 3200,
      promotion: ''
    }
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.reset();
    setDialogOpen(true);
  };

  const handleEdit = (product: ACProduct) => {
    setEditingProduct(product);
    form.reset({
      id: product.id,
      brand: product.brand,
      model: product.model,
      type: product.type,
      horsePower: product.horsePower,
      suitableAreaMin: product.suitableArea.min,
      suitableAreaMax: product.suitableArea.max,
      energyLevel: product.energyLevel,
      currentPrice: product.currentPrice,
      originalPrice: product.originalPrice || 0,
      stock: product.stock,
      inStock: product.inStock,
      features: product.features.join('、'),
      bestFor: product.bestFor.join('、'),
      noise: product.noise,
      cooling: product.cooling,
      heating: product.heating,
      promotion: product.promotion || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('确定要删除这个产品吗？')) return;

    try {
      await deleteProduct(productId);
      toast.success('删除成功');
      loadProducts();
    } catch (error) {
      toast.error('删除失败');
    }
  };

  const onSubmit = async (values: any) => {
    try {
      const productData: any = {
        id: values.id,
        brand: values.brand,
        model: values.model,
        type: values.type,
        horsePower: Number(values.horsePower),
        suitableArea: {
          min: Number(values.suitableAreaMin),
          max: Number(values.suitableAreaMax)
        },
        energyLevel: values.energyLevel,
        currentPrice: Number(values.currentPrice),
        originalPrice: values.originalPrice ? Number(values.originalPrice) : undefined,
        stock: Number(values.stock),
        inStock: values.inStock,
        features: values.features.split('、').filter((f: string) => f.trim()),
        bestFor: values.bestFor.split('、').filter((b: string) => b.trim()),
        noise: Number(values.noise),
        cooling: Number(values.cooling),
        heating: Number(values.heating),
        promotion: values.promotion || undefined
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('更新成功');
      } else {
        await addProduct(productData);
        toast.success('添加成功');
      }

      setDialogOpen(false);
      loadProducts();
    } catch (error) {
      toast.error(editingProduct ? '更新失败' : '添加失败');
    }
  };

  const getTypeName = (type: string) => {
    const map: Record<string, string> = {
      central: '中央空调',
      split: '分体式',
      duct: '风管机',
      portable: '移动空调'
    };
    return map[type] || type;
  };

  return (
    <div className="min-h-screen bg-secondary/30 p-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">产品管理</h1>
            <p className="text-muted-foreground mt-2">管理空调产品库存和信息</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                添加产品
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? '编辑产品' : '添加产品'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>产品ID *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="如: split-007" disabled={!!editingProduct} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>产品类型 *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="central">中央空调</SelectItem>
                              <SelectItem value="split">分体式</SelectItem>
                              <SelectItem value="duct">风管机</SelectItem>
                              <SelectItem value="portable">移动空调</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>品牌 *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="如: 格力" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>型号 *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="如: KFR-35GW" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="horsePower"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>匹数 *</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.5" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="suitableAreaMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>最小面积(㎡) *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="suitableAreaMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>最大面积(㎡) *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="currentPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>当前售价 *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="originalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>原价</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>库存数量 *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="energyLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>能效等级 *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="如: 一级能效" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="noise"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>噪音(dB) *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cooling"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>制冷量(W) *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="heating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>制热量(W) *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>产品特点 * (用"、"分隔)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="如: 静音舒适、快速制冷、智能控制" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bestFor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>适用场景 * (用"、"分隔)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="如: 卧室、书房、小客厅" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="promotion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>促销信息</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="如: 限时优惠，立减1000元" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      取消
                    </Button>
                    <Button type="submit">
                      {editingProduct ? '更新' : '添加'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">加载中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {products.map(product => (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{product.brand} {product.model}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getTypeName(product.type)} · {product.horsePower}匹
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <Badge variant="secondary">{product.energyLevel}</Badge>
                      {product.inStock ? (
                        <Badge variant="default" className="bg-green-600">有货</Badge>
                      ) : (
                        <Badge variant="destructive">缺货</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">
                      ¥{product.currentPrice.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.currentPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ¥{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span>库存: {product.stock}台</span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    适用面积: {product.suitableArea.min}-{product.suitableArea.max}㎡
                  </div>

                  {product.promotion && (
                    <p className="text-xs text-orange-600">🔥 {product.promotion}</p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(product)}>
                      <Pencil className="w-3 h-3 mr-1" />
                      编辑
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
