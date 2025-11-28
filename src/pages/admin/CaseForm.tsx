import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useForm, useFieldArray } from 'react-hook-form';
import { ArrowLeft, Plus, Trash2, Upload, X } from 'lucide-react';
import { addCase, updateCase, getAllProducts, getCaseById } from '@/db/api';
import { supabase } from '@/db/supabase';
import type { ACProduct } from '@/types/types';
import { AdminProtected } from '@/components/AdminProtected';

const BUCKET_NAME = 'app-7ua9s9vs9fr5_floor_plans';

export default function CaseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [products, setProducts] = useState<ACProduct[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');

  const form = useForm({
    defaultValues: {
      caseId: '',
      title: '',
      houseArea: 100,
      houseRooms: '3室2厅',
      houseOrientation: '南向',
      houseFloor: 10,
      houseBuildingType: '高层',
      description: '',
      solutionType: '中央空调',
      solutionProducts: [
        {
          room: '',
          productId: '',
          quantity: 1,
          installPosition: ''
        }
      ],
      solutionTotalCost: 0,
      solutionInstallCost: 0,
      customerFeedback: '',
      tips: '',
      completedDate: new Date().toISOString().split('T')[0]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'solutionProducts'
  });

  useEffect(() => {
    loadProducts();
    if (isEdit && id) {
      loadCase(id);
    }
  }, [id, isEdit]);

  const loadProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
  };

  const loadCase = async (caseId: string) => {
    setLoading(true);
    try {
      const caseData = await getCaseById(caseId);
      if (caseData) {
        // 设置表单值
        form.reset({
          caseId: caseData.id,
          title: caseData.title,
          houseArea: caseData.houseType.area,
          houseRooms: caseData.houseType.rooms,
          houseOrientation: caseData.houseType.orientation,
          houseFloor: caseData.houseType.floor,
          houseBuildingType: caseData.houseType.buildingType,
          description: caseData.description,
          solutionType: caseData.solution.type,
          solutionProducts: caseData.solution.products,
          solutionTotalCost: caseData.solution.totalCost,
          solutionInstallCost: caseData.solution.installCost,
          customerFeedback: caseData.customerFeedback,
          tips: caseData.tips.join('\n'),
          completedDate: caseData.completedDate
        });

        // 设置户型图预览
        if (caseData.floorPlanImage) {
          setImagePreview(caseData.floorPlanImage);
          setExistingImageUrl(caseData.floorPlanImage);
        }
      }
    } catch (error) {
      console.error('加载案例失败:', error);
      toast.error('加载案例失败');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件');
      return;
    }

    // 验证文件大小（1MB）
    if (file.size > 1024 * 1024) {
      toast.error('图片大小不能超过1MB');
      return;
    }

    // 验证文件名不包含中文
    if (/[\u4e00-\u9fa5]/.test(file.name)) {
      toast.error('文件名不能包含中文字符，请重命名后再上传');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error('上传失败:', uploadError);
        toast.error('图片上传失败');
        return null;
      }

      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('上传错误:', error);
      toast.error('图片上传失败');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      // 上传图片（如果有新图片）
      let imageUrl = existingImageUrl; // 默认使用原有图片URL
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (!uploadedUrl) {
          return; // 上传失败，不继续提交
        }
        imageUrl = uploadedUrl; // 使用新上传的图片URL
      }

      // 解析tips（用换行符分隔）
      const tipsArray = values.tips
        .split('\n')
        .map((t: string) => t.trim())
        .filter((t: string) => t);

      const caseData = {
        id: values.caseId,
        title: values.title,
        houseType: {
          area: Number(values.houseArea),
          rooms: values.houseRooms,
          orientation: values.houseOrientation,
          floor: Number(values.houseFloor),
          buildingType: values.houseBuildingType
        },
        description: values.description,
        floorPlanImage: imageUrl || undefined,
        solution: {
          type: values.solutionType,
          products: values.solutionProducts.map((p: any) => ({
            room: p.room,
            productId: p.productId,
            quantity: Number(p.quantity),
            installPosition: p.installPosition
          })),
          totalCost: Number(values.solutionTotalCost),
          installCost: Number(values.solutionInstallCost)
        },
        customerFeedback: values.customerFeedback,
        tips: tipsArray,
        completedDate: values.completedDate
      };

      if (isEdit) {
        await updateCase(id, caseData);
        toast.success('案例更新成功');
      } else {
        await addCase(caseData);
        toast.success('案例添加成功');
      }

      navigate('/admin/cases');
    } catch (error) {
      console.error('保存失败:', error);
      toast.error(isEdit ? '更新失败' : '添加失败');
    }
  };

  return (
    <AdminProtected>
    <div className="min-h-screen bg-secondary/30 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/admin/cases')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回案例列表
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <p className="text-muted-foreground">加载中...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{isEdit ? '编辑案例' : '添加案例'}</CardTitle>
            </CardHeader>
            <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* 基本信息 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">基本信息</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="caseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>案例ID *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="如: case-006" disabled={isEdit} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="completedDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>完成日期 *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>案例标题 *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="如: 阳光花园120㎡三室两厅中央空调方案" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 户型信息 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">户型信息</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="houseArea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>面积(㎡) *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="houseRooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>户型 *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="如: 3室2厅" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="houseOrientation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>朝向 *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="南向">南向</SelectItem>
                              <SelectItem value="北向">北向</SelectItem>
                              <SelectItem value="东向">东向</SelectItem>
                              <SelectItem value="西向">西向</SelectItem>
                              <SelectItem value="南北通透">南北通透</SelectItem>
                              <SelectItem value="东西通透">东西通透</SelectItem>
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
                      name="houseFloor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>楼层 *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="houseBuildingType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>建筑类型 *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="高层">高层</SelectItem>
                              <SelectItem value="多层">多层</SelectItem>
                              <SelectItem value="别墅">别墅</SelectItem>
                              <SelectItem value="复式">复式</SelectItem>
                              <SelectItem value="平层">平层</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>户型描述 *</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="详细描述户型特点，如房间布局、朝向、特殊需求等"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 户型图上传 */}
                  <div className="space-y-2">
                    <FormLabel>户型图</FormLabel>
                    <div className="flex items-start gap-4">
                      {imagePreview ? (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="户型图预览" 
                            className="w-48 h-48 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setImagePreview('');
                              setImageFile(null);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="w-48 h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">点击上传图片</span>
                          <span className="text-xs text-muted-foreground mt-1">最大1MB</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageSelect}
                          />
                        </label>
                      )}
                      <div className="flex-1 text-sm text-muted-foreground space-y-1">
                        <p>• 支持JPG、PNG、WEBP格式</p>
                        <p>• 文件大小不超过1MB</p>
                        <p>• 文件名不能包含中文字符</p>
                        <p>• 建议上传清晰的户型图以便客户参考</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 解决方案 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">解决方案</h3>
                  
                  <FormField
                    control={form.control}
                    name="solutionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>方案类型 *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="如: 中央空调、风管机+分体式、全分体式" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 产品配置 */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <FormLabel>产品配置 *</FormLabel>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => append({ room: '', productId: '', quantity: 1, installPosition: '' })}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        添加产品
                      </Button>
                    </div>

                    {fields.map((field, index) => (
                      <Card key={field.id}>
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">产品 {index + 1}</span>
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <FormField
                                control={form.control}
                                name={`solutionProducts.${index}.room`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>房间</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="如: 客厅、主卧" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`solutionProducts.${index}.productId`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>产品</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="选择产品" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {products.map(product => (
                                          <SelectItem key={product.id} value={product.id}>
                                            {product.brand} {product.model}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <FormField
                                control={form.control}
                                name={`solutionProducts.${index}.quantity`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>数量</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`solutionProducts.${index}.installPosition`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>安装位置</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="如: 客厅吊顶中央" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="solutionTotalCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>设备费用(元) *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="solutionInstallCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>安装费用(元) *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* 客户反馈和经验总结 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">客户反馈与经验</h3>
                  
                  <FormField
                    control={form.control}
                    name="customerFeedback"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>客户反馈 *</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="记录客户对方案的评价和使用体验"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tips"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>注意事项和经验总结 *</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="每行一条经验，如：&#10;中央空调需要提前规划吊顶高度&#10;出风口位置要避开床头直吹&#10;定期清洗滤网保持良好效果"
                            rows={5}
                          />
                        </FormControl>
                        <FormDescription>
                          每行一条经验，将自动转换为列表
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate('/admin/cases')}>
                    取消
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? '上传中...' : (isEdit ? '更新案例' : '添加案例')}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
    </AdminProtected>
  );
}
