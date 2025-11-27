import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type ACProduct, getACTypeName } from '@/data/ac-products';
import { Zap, Volume2, Thermometer, DollarSign, Package } from 'lucide-react';

interface ProductCardProps {
  product: ACProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasPromotion = product.originalPrice && product.originalPrice > product.currentPrice;
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{product.brand} {product.model}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {getACTypeName(product.type)}
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
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" />
            <span>{product.horsePower}匹</span>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-primary" />
            <span>{product.noise}dB</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span>{product.cooling}W</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <span>库存{product.stock}台</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">当前售价</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              ¥{product.currentPrice.toLocaleString()}
            </span>
            {hasPromotion && (
              <span className="text-sm text-muted-foreground line-through">
                ¥{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>
          {product.promotion && (
            <p className="text-xs text-orange-600 mt-1">🔥 {product.promotion}</p>
          )}
        </div>

        <div>
          <p className="text-sm font-medium mb-2">适用面积</p>
          <p className="text-sm text-muted-foreground">
            {product.suitableArea.min}-{product.suitableArea.max}㎡
          </p>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">产品特点</p>
          <div className="flex flex-wrap gap-1">
            {product.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">适用场景</p>
          <p className="text-sm text-muted-foreground">
            {product.bestFor.join('、')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
