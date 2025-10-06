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
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const toolSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  url: z.string().url('Must be a valid URL'),
});

type ToolFormValues = z.infer<typeof toolSchema>;

interface ToolFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ToolForm: React.FC<ToolFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ToolFormValues>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      url: '',
    },
  });

  const onSubmit = async (data: ToolFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('tools').insert([{
        name: data.name,
        description: data.description,
        category: data.category,
        url: data.url,
      }]);

      if (error) throw error;

      toast.success(t('admin.tools.created_success'));
      onSuccess();
    } catch (error: any) {
      console.error('Error creating tool:', error);
      toast.error(t('admin.tools.created_error'), {
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
              <FormLabel>{t('admin.tools.form.name')}</FormLabel>
              <FormControl>
                <Input placeholder="Risk Calculator" {...field} />
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
              <FormLabel>{t('admin.tools.form.description')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Calculate optimal position sizes based on risk..."
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.tools.form.category')}</FormLabel>
              <FormControl>
                <Input placeholder="Calculator" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.tools.form.url')}</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {t('admin.tools.form.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('admin.tools.form.submit')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
