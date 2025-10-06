import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const integrationSchema = z.object({
  name: z.string().min(3),
  type: z.string().min(1),
  enabled: z.boolean(),
});

type IntegrationFormValues = z.infer<typeof integrationSchema>;

interface IntegrationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const IntegrationForm: React.FC<IntegrationFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<IntegrationFormValues>({
    resolver: zodResolver(integrationSchema),
    defaultValues: { name: '', type: '', enabled: true },
  });

  const onSubmit = async (data: IntegrationFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('integrations').insert([{ name: data.name, type: data.type, enabled: data.enabled }]);
      if (error) throw error;
      toast.success(t('admin.integrations.created_success'));
      onSuccess();
    } catch (error: any) {
      toast.error(t('admin.integrations.created_error'), { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>{t('admin.integrations.form.name')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="type" render={({ field }) => (
          <FormItem><FormLabel>{t('admin.integrations.form.type')}</FormLabel><FormControl><Input placeholder="api, webhook, oauth" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="enabled" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4"><div><FormLabel>{t('admin.integrations.form.enabled')}</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
        )} />
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>{t('admin.integrations.form.cancel')}</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t('admin.integrations.form.submit')}</Button>
        </div>
      </form>
    </Form>
  );
};
