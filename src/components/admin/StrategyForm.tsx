import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const strategySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  risk_tier: z.enum(['low', 'medium', 'high']),
  pf: z.coerce.number().min(1, 'Profit Factor must be at least 1'),
  max_dd: z.coerce.number().min(0, 'Max Drawdown must be positive'),
  green_months_pct: z.coerce.number().min(0).max(100, 'Must be between 0-100'),
});

type StrategyFormValues = z.infer<typeof strategySchema>;

interface StrategyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const StrategyForm: React.FC<StrategyFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<StrategyFormValues>({
    resolver: zodResolver(strategySchema),
    defaultValues: {
      name: '',
      description: '',
      risk_tier: 'medium',
      pf: 1.5,
      max_dd: 10,
      green_months_pct: 70,
    },
  });

  const onSubmit = async (data: StrategyFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('strategies').insert([{
        name: data.name,
        description: data.description,
        risk_tier: data.risk_tier,
        pf: data.pf,
        max_dd: data.max_dd,
        green_months_pct: data.green_months_pct,
      }]);

      if (error) throw error;

      toast.success(t('admin.copy.created_success'));
      onSuccess();
    } catch (error: any) {
      console.error('Error creating strategy:', error);
      toast.error(t('admin.copy.created_error'), {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.copy.form.name')}</FormLabel>
              <FormControl>
                <Input placeholder="Conservative Growth Strategy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.copy.form.description')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Long-term strategy focused on steady growth..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="risk_tier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.copy.form.risk_tier')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">{t('admin.copy.risk_tier.low')}</SelectItem>
                  <SelectItem value="medium">{t('admin.copy.risk_tier.medium')}</SelectItem>
                  <SelectItem value="high">{t('admin.copy.risk_tier.high')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="pf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('admin.copy.form.pf')}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="1.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_dd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('admin.copy.form.max_dd')}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="green_months_pct"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('admin.copy.form.green_months')}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="70" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {t('admin.copy.form.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('admin.copy.form.submit')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
