import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  roomCount: z.string().optional(),
  orientation: z.string().optional(),
  requirements: z.string().optional(),
});

export type ParameterFormValues = z.infer<typeof formSchema>;

interface ParameterFormProps {
  onSubmit: (values: ParameterFormValues) => void;
  disabled?: boolean;
}

export function ParameterForm({ onSubmit, disabled }: ParameterFormProps) {
  const form = useForm<ParameterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomCount: '',
      orientation: '',
      requirements: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="roomCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>房间数量（可选）</FormLabel>
              <FormControl>
                <Input
                  placeholder="例如：3室2厅"
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="orientation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>主要朝向（可选）</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择朝向" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="south">南向</SelectItem>
                  <SelectItem value="north">北向</SelectItem>
                  <SelectItem value="east">东向</SelectItem>
                  <SelectItem value="west">西向</SelectItem>
                  <SelectItem value="southeast">东南向</SelectItem>
                  <SelectItem value="southwest">西南向</SelectItem>
                  <SelectItem value="northeast">东北向</SelectItem>
                  <SelectItem value="northwest">西北向</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>使用需求（可选）</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="例如：家里有老人和小孩，希望温度控制精准，噪音小..."
                  className="min-h-24 resize-none"
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={disabled}
        >
          {disabled ? '分析中...' : '开始分析'}
        </Button>
      </form>
    </Form>
  );
}
