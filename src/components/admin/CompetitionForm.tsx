import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const competitionSchema = z.object({
  name: z.string().min(3),
  rules: z.string().min(10),
  starts_at: z.string(),
  ends_at: z.string(),
});

type CompetitionFormValues = z.infer<typeof competitionSchema>;

interface CompetitionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CompetitionForm: React.FC<CompetitionFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<CompetitionFormValues>({
    resolver: zodResolver(competitionSchema),
    defaultValues: { name: '', rules: '', starts_at: '', ends_at: '' },
  });

  const onSubmit = async (data: CompetitionFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('competitions').insert([{ name: data.name, rules: data.rules, starts_at: data.starts_at, ends_at: data.ends_at }]);
      if (error) throw error;
      toast.success(t('admin.competitions.created_success'));
      onSuccess();
    } catch (error: any) {
      toast.error(t('admin.competitions.created_error'), { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>{t('admin.competitions.form.name')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="rules" render={({ field }) => (
          <FormItem><FormLabel>{t('admin.competitions.form.rules')}</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="starts_at" render={({ field }) => (
            <FormItem><FormLabel>{t('admin.competitions.form.starts_at')}</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="ends_at" render={({ field }) => (
            <FormItem><FormLabel>{t('admin.competitions.form.ends_at')}</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>{t('admin.competitions.form.cancel')}</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t('admin.competitions.form.submit')}</Button>
        </div>
      </form>
    </Form>
  );
};
