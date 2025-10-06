import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens'),
  level: z.coerce.number().min(0).max(10),
  duration_min: z.coerce.number().optional(),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published']),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface FullCourseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const FullCourseForm: React.FC<FullCourseFormProps> = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      slug: '',
      level: 0,
      tags: '',
      status: 'draft',
    },
  });

  const onSubmit = async (data: CourseFormValues) => {
    setIsSubmitting(true);
    try {
      const tags = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      
      // First create the course_item
      const { data: courseItem, error: itemError } = await supabase
        .from('course_items')
        .insert([{
          title: data.title,
          kind: 'course',
          provider: 'internal',
          duration_min: data.duration_min || null,
          tags,
          status: data.status,
        }])
        .select()
        .single();

      if (itemError) throw itemError;

      // Then create the lms_course linking to the course_item
      const { error: courseError } = await supabase
        .from('lms_courses')
        .insert([{
          item_id: courseItem.id,
          slug: data.slug,
          level: data.level,
          status: data.status,
        }]);

      if (courseError) throw courseError;

      toast.success('Course created successfully');
      onSuccess();
    } catch (error: any) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course', {
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
              <FormLabel>Course Title</FormLabel>
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
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug (URL friendly)</FormLabel>
                <FormControl>
                  <Input placeholder="intro-trading" {...field} />
                </FormControl>
                <FormDescription>Used in URLs</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormDescription>0=Beginner, 1-4=Advanced</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="duration_min"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Duration (minutes)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="120" {...field} />
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
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Textarea placeholder="beginner, trading, fundamentals" {...field} />
              </FormControl>
              <FormDescription>Comma separated</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Only published courses are visible to users</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Course
          </Button>
        </div>
      </form>
    </Form>
  );
};
