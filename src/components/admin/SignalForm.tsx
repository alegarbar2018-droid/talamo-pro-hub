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
  FormDescription,
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

const signalSchema = z.object({
  instrument: z.string().min(1, 'Instrument is required'),
  timeframe: z.enum(['M5', 'M15', 'H1', 'H4', 'D1', 'W1'], {
    required_error: 'Timeframe is required',
  }),
  rr: z.coerce.number().min(1, 'Risk/Reward must be at least 1'),
  entry_price: z.coerce.number().optional(),
  stop_loss: z.coerce.number().optional(),
  take_profit: z.coerce.number().optional(),
  logic: z.string().min(20, 'Logic must be at least 20 characters'),
  invalidation: z.string().min(10, 'Invalidation must be at least 10 characters'),
});

type SignalFormValues = z.infer<typeof signalSchema>;

interface SignalFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const SignalForm: React.FC<SignalFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<SignalFormValues>({
    resolver: zodResolver(signalSchema),
    defaultValues: {
      instrument: '',
      timeframe: 'H1',
      rr: 2,
      logic: '',
      invalidation: '',
    },
  });

  const onSubmit = async (data: SignalFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('signals-create', {
        body: {
          title: `${data.instrument} - ${data.timeframe}`,
          ...data,
        },
      });

      if (error) throw error;

      toast.success(t('admin.signals.created_success'));
      onSuccess();
    } catch (error: any) {
      console.error('Error creating signal:', error);
      toast.error(t('admin.signals.created_error'), {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="instrument"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('admin.signals.form.instrument')}</FormLabel>
                <FormControl>
                  <Input placeholder="BTCUSDT" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeframe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('admin.signals.form.timeframe')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="M5">M5</SelectItem>
                    <SelectItem value="M15">M15</SelectItem>
                    <SelectItem value="H1">H1</SelectItem>
                    <SelectItem value="H4">H4</SelectItem>
                    <SelectItem value="D1">D1</SelectItem>
                    <SelectItem value="W1">W1</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="rr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.signals.form.rr')}</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" placeholder="2.0" {...field} />
              </FormControl>
              <FormDescription>{t('admin.signals.form.rr_desc')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="entry_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('admin.signals.form.entry_price')}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="95000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stop_loss"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('admin.signals.form.stop_loss')}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="93000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="take_profit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('admin.signals.form.take_profit')}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="100000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="logic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.signals.form.logic')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('admin.signals.form.logic_placeholder')}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>{t('admin.signals.form.logic_desc')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="invalidation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.signals.form.invalidation')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('admin.signals.form.invalidation_placeholder')}
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>{t('admin.signals.form.invalidation_desc')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {t('admin.signals.form.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('admin.signals.form.submit')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
