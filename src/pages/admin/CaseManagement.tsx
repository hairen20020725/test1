import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Home } from 'lucide-react';
import { getAllCases, deleteCase } from '@/db/api';
import type { HistoricalCase } from '@/types/types';
import { Link } from 'react-router-dom';
import { AdminProtected } from '@/components/AdminProtected';

export default function CaseManagement() {
  const [cases, setCases] = useState<HistoricalCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    const data = await getAllCases();
    setCases(data);
    setLoading(false);
  };

  const handleDelete = async (caseId: string) => {
    if (!confirm('确定要删除这个案例吗？')) return;

    try {
      await deleteCase(caseId);
      toast.success('删除成功');
      loadCases();
    } catch (error) {
      toast.error('删除失败');
    }
  };

  return (
    <AdminProtected>
    <div className="min-h-screen bg-secondary/30 p-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">案例管理</h1>
            <p className="text-muted-foreground mt-2">管理历史成功案例</p>
          </div>
          <Link to="/admin/case/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              添加案例
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">加载中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {cases.map(case_ => (
              <Card key={case_.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{case_.title}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{case_.houseType.rooms}</Badge>
                        <Badge variant="outline">{case_.houseType.area}㎡</Badge>
                        <Badge variant="outline">{case_.houseType.buildingType}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/admin/case/edit/${case_.id}`}>
                        <Button size="sm" variant="outline">
                          <Pencil className="w-3 h-3 mr-1" />
                          编辑
                        </Button>
                      </Link>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(case_.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{case_.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">方案类型:</span>
                      <p className="font-medium">{case_.solution.type}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">设备费用:</span>
                      <p className="font-medium">¥{case_.solution.totalCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">总费用:</span>
                      <p className="font-medium text-primary">
                        ¥{(case_.solution.totalCost + case_.solution.installCost).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">客户反馈:</span>
                    <p className="text-sm mt-1">{case_.customerFeedback}</p>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    完成时间: {case_.completedDate}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    </AdminProtected>
  );
}
