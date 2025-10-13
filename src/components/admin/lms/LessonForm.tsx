import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, X, ImagePlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const lessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  position: z.coerce.number().min(0),
  duration_min: z.coerce.number().optional(),
  content_md: z.string().optional(),
  video_external_url: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

interface Resource {
  id?: string;
  kind: string;
  title: string;
  storage_key?: string;
  external_url?: string;
  position: number;
  file?: File;
}

interface LessonFormProps {
  moduleId: string;
  existingItemsCount?: number;
  lesson?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const LessonForm: React.FC<LessonFormProps> = ({ 
  moduleId, 
  existingItemsCount = 0,
  lesson,
  onSuccess, 
  onCancel 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lessonVideoFile, setLessonVideoFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isUploadingContentImage, setIsUploadingContentImage] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch existing resources when editing a lesson
  const { data: existingResources } = useQuery({
    queryKey: ['lesson-resources', lesson?.id],
    queryFn: async () => {
      if (!lesson?.id) return [];
      const { data, error } = await supabase
        .from('lms_resources')
        .select('*')
        .eq('lesson_id', lesson.id)
        .order('position');
      if (error) throw error;
      return data || [];
    },
    enabled: !!lesson?.id,
  });

  // Load existing resources into state when editing
  useEffect(() => {
    if (existingResources && existingResources.length > 0 && resources.length === 0) {
      setResources(existingResources.map(r => ({
        id: r.id,
        kind: r.kind,
        title: r.title,
        storage_key: r.storage_key || undefined,
        external_url: r.external_url || undefined,
        position: r.position,
      })));
    }
  }, [existingResources]);

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson?.course_item?.title || "",
      position: lesson?.position || existingItemsCount + 1,
      duration_min: lesson?.duration_min || 0,
      content_md: lesson?.content_md || "",
      video_external_url: lesson?.video_external_url || "",
      status: lesson?.status || "draft",
    },
  });

  const handleAddResource = () => {
    setResources([
      ...resources,
      {
        kind: "link",
        title: "",
        position: resources.length,
      },
    ]);
  };

  const handleRemoveResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const handleInsertImageInContent = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate it's an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploadingContentImage(true);
    try {
      // Upload to lms-assets bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `lesson-content/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('lms-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('lms-assets')
        .getPublicUrl(filePath);

      // Insert markdown syntax at cursor position
      const textarea = contentTextareaRef.current;
      if (textarea) {
        const cursorPos = textarea.selectionStart;
        const currentContent = form.getValues('content_md') || '';
        const imageMarkdown = `\n![${file.name}](${publicUrl})\n`;
        
        const newContent = 
          currentContent.substring(0, cursorPos) + 
          imageMarkdown + 
          currentContent.substring(cursorPos);
        
        form.setValue('content_md', newContent);
        
        // Set cursor after inserted image
        setTimeout(() => {
          textarea.focus();
          const newCursorPos = cursorPos + imageMarkdown.length;
          textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
      }

      toast.success('Image inserted successfully');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image: ' + error.message);
    } finally {
      setIsUploadingContentImage(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleResourceChange = (index: number, field: string, value: any) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], [field]: value };
    setResources(updated);
  };

  const handleResourceFileChange = (index: number, file: File) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], file };
    setResources(updated);
  };

  const uploadToStorage = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage.from(bucket).upload(`public/${path}`, file, { upsert: true });

    if (error) throw error;
    return data.path;
  };

  const onSubmit = async (data: LessonFormValues) => {
    setIsSubmitting(true);
    try {
      // Upload video if provided
      let videoStorageKey = lesson?.video_storage_key || null;
      if (lessonVideoFile) {
        videoStorageKey = await uploadToStorage(
          lessonVideoFile,
          "lms",
          `lessons/${Date.now()}-${lessonVideoFile.name}`,
        );
      }

      // Upload cover image if provided
      let coverImagePath = lesson?.cover_image || null;
      if (coverImage) {
        coverImagePath = await uploadToStorage(coverImage, "lms-assets", `covers/${Date.now()}-${coverImage.name}`);
      }

      if (lesson) {
        // UPDATE existing lesson
        // Update course_item
        const { error: itemError } = await supabase
          .from("course_items")
          .update({
            title: data.title,
            duration_min: data.duration_min,
            status: data.status,
          })
          .eq("id", lesson.item_id);

        if (itemError) throw itemError;

        // Update lesson
        const { error: lessonError } = await supabase
          .from("lms_lessons")
          .update({
            position: data.position,
            duration_min: data.duration_min,
            content_md: data.content_md,
            video_storage_key: videoStorageKey,
            video_external_url: data.video_external_url || null,
            cover_image: coverImagePath,
            status: data.status,
          })
          .eq("id", lesson.id);

        if (lessonError) throw lessonError;

        // Handle resources - only update if there are changes
        // Delete removed resources and update/create new ones
        const existingResourceIds = existingResources?.map(r => r.id) || [];
        const currentResourceIds = resources.filter(r => r.id).map(r => r.id);
        
        // Delete resources that were removed
        const resourcesToDelete = existingResourceIds.filter(id => !currentResourceIds.includes(id));
        if (resourcesToDelete.length > 0) {
          await supabase
            .from("lms_resources")
            .delete()
            .in("id", resourcesToDelete);
        }

        // Update or create resources
        for (const resource of resources) {
          let storageKey = resource.storage_key;

          // Upload new file if provided
          if (resource.file) {
            storageKey = await uploadToStorage(
              resource.file,
              "lms-assets",
              `lessons/${lesson.id}/${Date.now()}-${resource.file.name}`,
            );
          }

          if (resource.id) {
            // Update existing resource
            await supabase.from("lms_resources").update({
              kind: resource.kind,
              title: resource.title,
              storage_key: storageKey,
              external_url: resource.external_url,
              position: resource.position,
            }).eq("id", resource.id);
          } else {
            // Create new resource
            await supabase.from("lms_resources").insert({
              lesson_id: lesson.id,
              kind: resource.kind,
              title: resource.title,
              storage_key: storageKey,
              external_url: resource.external_url,
              position: resource.position,
            });
          }
        }

        toast.success("Lesson updated successfully");
      } else {
        // CREATE new lesson
        // Create course_item first
        const { data: courseItem, error: itemError } = await supabase
          .from("course_items")
          .insert([
            {
              title: data.title,
              kind: "lesson",
              provider: "internal",
              duration_min: data.duration_min,
              status: data.status,
            },
          ])
          .select()
          .single();

        if (itemError) throw itemError;

        // Then create lesson
        const { data: newLesson, error: lessonError } = await supabase
          .from("lms_lessons")
          .insert([
            {
              module_id: moduleId,
              item_id: courseItem.id,
              position: data.position,
              duration_min: data.duration_min,
              content_md: data.content_md,
              video_storage_key: videoStorageKey,
              video_external_url: data.video_external_url || null,
              cover_image: coverImagePath,
              status: data.status,
            },
          ])
          .select()
          .single();

        if (lessonError) throw lessonError;

        // Upload and create resources
        for (const resource of resources) {
          let storageKey = resource.storage_key;

          if (resource.file) {
            storageKey = await uploadToStorage(
              resource.file,
              "lms-assets",
              `lessons/${newLesson.id}/${Date.now()}-${resource.file.name}`,
            );
          }

          await supabase.from("lms_resources").insert({
            lesson_id: newLesson.id,
            kind: resource.kind,
            title: resource.title,
            storage_key: storageKey,
            external_url: resource.external_url,
            position: resource.position,
          });
        }

        toast.success("Lesson created successfully");
      }
      
      onSuccess();
    } catch (error: any) {
      console.error("Error saving lesson:", error);
      toast.error("Failed to save lesson", {
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
            name="duration_min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="30" {...field} />
                </FormControl>
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="content_md"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson Content (Markdown)</FormLabel>
              <FormControl>
                <Textarea
                  ref={contentTextareaRef}
                  placeholder="# Introduction&#10;&#10;Lesson content here..."
                  className="min-h-[200px] font-mono text-sm"
                  {...field}
                />
              </FormControl>
              <div className="flex items-center justify-between mt-2">
                <FormDescription>Supports Markdown formatting</FormDescription>
                <div>
                  <input
                    type="file"
                    id="content-image-input"
                    accept="image/*"
                    className="hidden"
                    onChange={handleInsertImageInContent}
                    disabled={isUploadingContentImage}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('content-image-input')?.click()}
                    disabled={isUploadingContentImage}
                  >
                    <ImagePlus className="w-4 h-4 mr-2" />
                    {isUploadingContentImage ? 'Uploading...' : 'Insert Image'}
                  </Button>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div>
            <FormLabel>Video</FormLabel>
            <div className="grid gap-4 mt-2">
              <div>
                <label className="block text-sm mb-2">Upload Video</label>
                {lesson?.video_storage_key && !lessonVideoFile && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Current: {lesson.video_storage_key.split('/').pop()}
                  </p>
                )}
                <Input type="file" accept="video/*" onChange={(e) => setLessonVideoFile(e.target.files?.[0] || null)} />
              </div>
              <FormField
                control={form.control}
                name="video_external_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Or External Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/..." {...field} />
                    </FormControl>
                    <FormDescription>YouTube, Vimeo, etc.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            <FormLabel>Cover Image (optional)</FormLabel>
            {lesson?.cover_image && !coverImage && (
              <p className="text-sm text-muted-foreground mb-2">
                Current: {lesson.cover_image.split('/').pop()}
              </p>
            )}
            <Input
              type="file"
              accept="image/*"
              className="mt-2"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Resources & Materials</FormLabel>
            <Button type="button" variant="outline" size="sm" onClick={handleAddResource}>
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </div>

          {resources.map((resource, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Type</label>
                        <Select
                          value={resource.kind}
                          onValueChange={(value) => handleResourceChange(index, "kind", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="doc">Document</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="zip">ZIP File</SelectItem>
                            <SelectItem value="link">External Link</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          value={resource.title}
                          onChange={(e) => handleResourceChange(index, "title", e.target.value)}
                          placeholder="Resource title"
                        />
                      </div>
                    </div>

                    {resource.kind === "link" ? (
                      <div>
                        <label className="text-sm font-medium">URL</label>
                        <Input
                          value={resource.external_url || ""}
                          onChange={(e) => handleResourceChange(index, "external_url", e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="text-sm font-medium">Upload File</label>
                        {resource.storage_key && !resource.file && (
                          <p className="text-sm text-muted-foreground mb-2">
                            Current: {resource.storage_key.split('/').pop()}
                          </p>
                        )}
                        <Input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleResourceFileChange(index, file);
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveResource(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {lesson ? 'Update Lesson' : 'Create Lesson'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
