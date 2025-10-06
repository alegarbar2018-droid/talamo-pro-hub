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
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const eaSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  download_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type EAFormValues = z.infer<typeof eaSchema>;

interface EAFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const EAForm: React.FC<EAFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<EAFormValues>({
    resolver: zodResolver(eaSchema),
    defaultValues: {
      name: '',
      description: '',
      download_url: '',
    },
  });

  const onSubmit = async (data: EAFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('eas').insert({
        name: data.name,
        description: data.description,
        download_url: data.download_url || null,
        status: 'draft',
        params: {},
      });

      if (error) throw error;

      toast.success(t('admin.eas.created_success'));
      onSuccess();
    } catch (error: any) {
      console.error('Error creating EA:', error);
      toast.error(t('admin.eas.created_error'), {
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
              <FormLabel>{t('admin.eas.form.name')}</FormLabel>
              <FormControl>
                <Input placeholder="Scalping EA Pro" {...field} />
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
              <FormLabel>{t('admin.eas.form.description')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Advanced scalping expert advisor for MT4/MT5..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="download_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.eas.form.download_url')}</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>{t('admin.eas.form.download_url_desc')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {t('admin.eas.form.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('admin.eas.form.submit')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
