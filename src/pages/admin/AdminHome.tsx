import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, FileText, Home, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminHome() {
  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">管理后台</h1>
              <p className="text-muted-foreground mt-2">
                管理产品库存和历史案例
              </p>
            </div>
            <Link to="/">
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>产品管理</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                管理空调产品的库存、价格、规格等信息
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• 添加、编辑、删除产品</li>
                <li>• 更新库存数量和价格</li>
                <li>• 设置促销信息</li>
                <li>• 管理产品规格参数</li>
              </ul>
              <Link to="/admin/products">
                <Button className="w-full">
                  进入产品管理
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>案例管理</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                管理历史成功案例，为AI推荐提供参考
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• 添加、编辑、删除案例</li>
                <li>• 上传户型图</li>
                <li>• 记录解决方案和费用</li>
                <li>• 收集客户反馈</li>
              </ul>
              <Link to="/admin/cases">
                <Button className="w-full">
                  进入案例管理
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">1. 产品管理</h3>
              <p className="text-sm text-muted-foreground">
                在产品管理页面，您可以添加新的空调产品，更新现有产品的库存和价格信息。
                AI推荐系统会优先推荐有库存的产品，并考虑促销信息。
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">2. 案例管理</h3>
              <p className="text-sm text-muted-foreground">
                在案例管理页面，您可以添加历史成功案例。AI会参考这些案例，
                为相似户型的客户提供更精准的推荐方案。建议上传户型图并详细记录解决方案。
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">3. AI推荐机制</h3>
              <p className="text-sm text-muted-foreground">
                AI会综合考虑产品库存、历史案例、户型特点和用户需求，
                生成专业的空调配置方案。数据越完整，推荐越精准。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
