import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const postSchema = z.object({
  title: z.string().min(5),
  body: z.string().min(20),
  section: z.string().min(1),
});

type PostFormValues = z.infer<typeof postSchema>;

interface PostFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const PostForm: React.FC<PostFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: '', body: '', section: '' },
  });

  const onSubmit = async (data: PostFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('posts').insert([{ title: data.title, body: data.body, section: data.section, author_id: user?.id || '' }]);
      if (error) throw error;
      toast.success(t('admin.community.created_success'));
      onSuccess();
    } catch (error: any) {
      toast.error(t('admin.community.created_error'), { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem><FormLabel>{t('admin.community.form.title')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="section" render={({ field }) => (
          <FormItem><FormLabel>{t('admin.community.form.section')}</FormLabel><FormControl><Input placeholder="general, trading, news" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="body" render={({ field }) => (
          <FormItem><FormLabel>{t('admin.community.form.body')}</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>{t('admin.community.form.cancel')}</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t('admin.community.form.submit')}</Button>
        </div>
      </form>
    </Form>
  );
};
