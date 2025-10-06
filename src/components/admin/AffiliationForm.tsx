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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const affiliationSchema = z.object({
  email: z.string().email('Invalid email address'),
  partner_id: z.string().min(1, 'Partner ID is required'),
  is_affiliated: z.boolean(),
});

type AffiliationFormValues = z.infer<typeof affiliationSchema>;

interface AffiliationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AffiliationForm: React.FC<AffiliationFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<AffiliationFormValues>({
    resolver: zodResolver(affiliationSchema),
    defaultValues: {
      email: '',
      partner_id: '',
      is_affiliated: false,
    },
  });

  const onSubmit = async (data: AffiliationFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('affiliations').insert([{
        email: data.email,
        partner_id: data.partner_id,
        is_affiliated: data.is_affiliated,
        user_id: crypto.randomUUID(),
        verified_at: data.is_affiliated ? new Date().toISOString() : null,
      }]);

      if (error) throw error;

      toast.success(t('admin.affiliation.created_success'));
      onSuccess();
    } catch (error: any) {
      console.error('Error creating affiliation:', error);
      toast.error(t('admin.affiliation.created_error'), {
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.affiliation.form.email')}</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="partner_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.affiliation.form.partner_id')}</FormLabel>
              <FormControl>
                <Input placeholder="PARTNER123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_affiliated"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  {t('admin.affiliation.form.verified')}
                </FormLabel>
                <FormDescription>
                  {t('admin.affiliation.form.verified_desc')}
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {t('admin.affiliation.form.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('admin.affiliation.form.submit')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
