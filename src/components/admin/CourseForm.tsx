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

const courseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  kind: z.enum(['video', 'scorm', 'pdf', 'quiz']),
  provider: z.enum(['articulate', 'internal', 'youtube', 'vimeo']),
  external_url: z.string().url().optional().or(z.literal('')),
  duration_min: z.coerce.number().optional(),
  tags: z.string().optional(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CourseForm: React.FC<CourseFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      kind: 'video',
      provider: 'internal',
      external_url: '',
      tags: '',
    },
  });

  const onSubmit = async (data: CourseFormValues) => {
    setIsSubmitting(true);
    try {
      const tags = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      
      const { error } = await supabase.from('course_items').insert({
        title: data.title,
        kind: data.kind,
        provider: data.provider,
        external_url: data.external_url || null,
        duration_min: data.duration_min || null,
        tags,
        status: 'draft',
      });

      if (error) throw error;

      toast.success(t('admin.lms.created_success'));
      onSuccess();
    } catch (error: any) {
      console.error('Error creating course:', error);
      toast.error(t('admin.lms.created_error'), {
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.lms.form.title')}</FormLabel>
              <FormControl>
                <Input placeholder="Introduction to Trading" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="kind"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('admin.lms.form.kind')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="scorm">SCORM</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('admin.lms.form.provider')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="articulate">Articulate</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="vimeo">Vimeo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="external_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.lms.form.external_url')}</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>{t('admin.lms.form.external_url_desc')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration_min"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.lms.form.duration')}</FormLabel>
              <FormControl>
                <Input type="number" placeholder="30" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.lms.form.tags')}</FormLabel>
              <FormControl>
                <Textarea placeholder="beginner, trading, crypto" {...field} />
              </FormControl>
              <FormDescription>{t('admin.lms.form.tags_desc')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {t('admin.lms.form.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('admin.lms.form.submit')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
