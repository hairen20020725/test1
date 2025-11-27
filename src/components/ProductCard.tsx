import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type ACProduct, getACTypeName } from '@/data/ac-products';
import { Zap, Volume2, Thermometer, DollarSign } from 'lucide-react';

interface ProductCardProps {
  product: ACProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{product.brand} {product.model}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {getACTypeName(product.type)}
            </p>
          </div>
          <Badge variant="secondary">{product.energyLevel}</Badge>
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
            <DollarSign className="w-4 h-4 text-primary" />
            <span>¥{product.price.min.toLocaleString()}-{product.price.max.toLocaleString()}</span>
          </div>
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
