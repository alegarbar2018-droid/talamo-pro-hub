import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const moduleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  position: z.coerce.number().min(0),
});

type ModuleFormValues = z.infer<typeof moduleSchema>;

interface ModuleFormProps {
  courseId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ModuleForm: React.FC<ModuleFormProps> = ({ courseId, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: '',
      position: 0,
    },
  });

  const onSubmit = async (data: ModuleFormValues) => {
    setIsSubmitting(true);
    try {
      // Create course_item first
      const { data: courseItem, error: itemError } = await supabase
        .from('course_items')
        .insert([{
          title: data.title,
          kind: 'module',
          provider: 'internal',
          status: 'draft',
        }])
        .select()
        .single();

      if (itemError) throw itemError;

      // Create module
      const { error: moduleError } = await supabase
        .from('lms_modules')
        .insert([{
          course_id: courseId,
          item_id: courseItem.id,
          position: data.position,
        }]);

      if (moduleError) throw moduleError;

      toast.success('Module created');
      onSuccess();
    } catch (error: any) {
      toast.error('Failed to create module', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module Title</FormLabel>
              <FormControl>
                <Input placeholder="Introduction to Trading" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position/Order</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
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
            Create Module
          </Button>
        </div>
      </form>
    </Form>
  );
};
