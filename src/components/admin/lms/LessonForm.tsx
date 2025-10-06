import React, { useState } from "react";
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
import { Loader2, Plus, X } from "lucide-react";

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
  onSuccess: () => void;
  onCancel: () => void;
}

export const LessonForm: React.FC<LessonFormProps> = ({ moduleId, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lessonVideoFile, setLessonVideoFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      position: 0,
      duration_min: 0,
      content_md: "",
      video_external_url: "",
      status: "draft",
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
      let videoStorageKey = null;
      if (lessonVideoFile) {
        videoStorageKey = await uploadToStorage(
          lessonVideoFile,
          "lms",
          `lessons/${Date.now()}-${lessonVideoFile.name}`,
        );
      }

      // Upload cover image if provided
      let coverImagePath = null;
      if (coverImage) {
        coverImagePath = await uploadToStorage(coverImage, "lms-assets", `covers/${Date.now()}-${coverImage.name}`);
      }

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
      const { data: lesson, error: lessonError } = await supabase
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
            `lessons/${lesson.id}/${Date.now()}-${resource.file.name}`,
          );
        }

        await supabase.from("lms_resources").insert({
          lesson_id: lesson.id,
          kind: resource.kind,
          title: resource.title,
          storage_key: storageKey,
          external_url: resource.external_url,
          position: resource.position,
        });
      }

      toast.success("Lesson created successfully");
      onSuccess();
    } catch (error: any) {
      console.error("Error creating lesson:", error);
      toast.error("Failed to create lesson", {
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

        <div className="grid grid-cols-3 gap-4">
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
                  placeholder="# Introduction&#10;&#10;Lesson content here..."
                  className="min-h-[200px] font-mono text-sm"
                  {...field}
                />
              </FormControl>
              <FormDescription>Supports Markdown formatting</FormDescription>
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
            Create Lesson
          </Button>
        </div>
      </form>
    </Form>
  );
};
