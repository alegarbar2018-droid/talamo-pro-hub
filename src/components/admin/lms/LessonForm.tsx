import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';

const lessonSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  position: z.coerce.number().min(0),
  duration_min: z.coerce.number().optional(),
  video_external_url: z.string().url().optional().or(z.literal('')),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

interface LessonFormProps {
  moduleId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const LessonForm: React.FC<LessonFormProps> = ({ moduleId, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      position: 0,
      video_external_url: '',
    },
  });

  const handleVideoUpload = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('lms')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      toast.success('Video uploaded successfully');
      return fileName;
    } catch (error: any) {
      toast.error('Failed to upload video', { description: error.message });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: LessonFormValues) => {
    setIsSubmitting(true);
    try {
      let videoStorageKey: string | null = null;

      // Upload video if provided
      if (videoFile) {
        videoStorageKey = await handleVideoUpload(videoFile);
        if (!videoStorageKey) {
          setIsSubmitting(false);
          return;
        }
      }

      // Create course_item first
      const { data: courseItem, error: itemError } = await supabase
        .from('course_items')
        .insert([{
          title: data.title,
          kind: 'lesson',
          provider: 'internal',
          duration_min: data.duration_min || null,
          status: 'draft',
        }])
        .select()
        .single();

      if (itemError) throw itemError;

      // Create lesson
      const { error: lessonError } = await supabase
        .from('lms_lessons')
        .insert([{
          module_id: moduleId,
          item_id: courseItem.id,
          position: data.position,
          video_storage_key: videoStorageKey,
          video_external_url: data.video_external_url || null,
          resources: [],
        }]);

      if (lessonError) throw lessonError;

      toast.success('Lesson created');
      onSuccess();
    } catch (error: any) {
      toast.error('Failed to create lesson', { description: error.message });
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
              <FormLabel>Lesson Title</FormLabel>
              <FormControl>
                <Input placeholder="Introduction to Charts" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
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

          <FormField
            control={form.control}
            name="duration_min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="15" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormLabel>Video Upload</FormLabel>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              disabled={isUploading}
            />
            {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
          <FormDescription>Upload video to Supabase Storage</FormDescription>
        </div>

        <FormField
          control={form.control}
          name="video_external_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>External Video URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://youtube.com/watch?v=..." {...field} />
              </FormControl>
              <FormDescription>YouTube, Vimeo, etc.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Lesson
          </Button>
        </div>
      </form>
    </Form>
  );
};
