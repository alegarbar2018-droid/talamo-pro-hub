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
import { Loader2, Plus, X, ImagePlus, HelpCircle, Wand2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

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
  const [showSyntaxGuide, setShowSyntaxGuide] = useState(false);
  const [isFormattingWithAI, setIsFormattingWithAI] = useState(false);
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

  const handleFormatWithAI = async () => {
    const currentContent = form.getValues('content_md');
    
    if (!currentContent || currentContent.trim() === '') {
      toast.error('No hay contenido para formatear');
      return;
    }

    setIsFormattingWithAI(true);
    const toastId = toast.loading('Formateando contenido con IA...', {
      description: 'Esto puede tomar unos segundos'
    });
    
    try {
      console.log('Calling format-lesson-content function...');
      
      const { data, error } = await supabase.functions.invoke('format-lesson-content', {
        body: { content: currentContent }
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.formattedContent) {
        form.setValue('content_md', data.formattedContent);
        toast.success('Contenido formateado exitosamente', { id: toastId });
      } else {
        console.error('No formatted content in response:', data);
        throw new Error('No se recibió contenido formateado');
      }
    } catch (error: any) {
      console.error('Error formatting with AI:', error);
      
      let errorMessage = 'Error al formatear con IA';
      let errorDescription = error.message || 'Error desconocido';
      
      if (error.message?.includes('Rate limit') || error.message?.includes('429')) {
        errorDescription = 'Límite de solicitudes excedido. Intenta de nuevo en unos minutos.';
      } else if (error.message?.includes('Payment required') || error.message?.includes('402')) {
        errorDescription = 'Se requiere pago. Agrega créditos a tu workspace de Lovable AI.';
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('FunctionsFetchError')) {
        errorDescription = 'No se pudo conectar con el servidor. Verifica que la función esté desplegada correctamente.';
      }
      
      toast.error(errorMessage, {
        id: toastId,
        description: errorDescription
      });
    } finally {
      setIsFormattingWithAI(false);
    }
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
              <div className="flex items-center justify-between">
                <FormLabel>Lesson Content (Markdown)</FormLabel>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSyntaxGuide(!showSyntaxGuide)}
                  >
                    <HelpCircle className="w-4 h-4 mr-1" />
                    Syntax Guide
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href="/docs/AI_LESSON_CREATOR_PROMPT.md" target="_blank" rel="noopener noreferrer">
                      🤖 AI Instructions
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={handleFormatWithAI}
                    disabled={isFormattingWithAI}
                  >
                    {isFormattingWithAI ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        Formateando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-1" />
                        Formatear con IA
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {showSyntaxGuide && (
                <Collapsible open={showSyntaxGuide} className="border rounded-lg p-4 bg-muted/50 mb-2">
                  <CollapsibleContent>
                    <div className="space-y-3 text-sm max-h-[500px] overflow-y-auto pr-2">
                      <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                        <h4 className="font-semibold mb-2 text-primary">✨ Tálamo Extended Markdown v1.1</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          Sistema de componentes interactivos para lecciones. <a href="/docs/EXTENDED_MARKDOWN_SYNTAX_v1.1.md" target="_blank" className="underline">Ver documentación completa</a>
                        </p>
                        <p className="text-xs bg-gradient-primary/10 p-2 rounded border border-teal/20">
                          🤖 <strong>Nuevo:</strong> Para generar contenido con IA, usa el botón <span className="font-mono bg-background px-1">AI Instructions</span> arriba. Contiene un prompt completo para que cualquier IA genere lecciones siguiendo este formato.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-1">📋 Meta (Metadata de lección - Nuevo v1.1)</h4>
                        <pre className="bg-background p-2 rounded text-xs overflow-x-auto whitespace-pre">
{`:::meta
level: beginner
duration: 15min
tags: forex, trend-trading, price-action
id: lesson-trend-01
:::`}
                        </pre>
                        <p className="text-xs text-muted-foreground mt-1">
                          Define nivel, duración estimada, tags y ID único. Mejora SEO y filtrado.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-1">📚 Accordion (Secciones Colapsables)</h4>
                        <pre className="bg-background p-2 rounded text-xs overflow-x-auto whitespace-pre">
{`:::accordion
## Section Title 1
Content here...

## Section Title 2
More content...
:::`}
                        </pre>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-1">📑 Tabs</h4>
                        <pre className="bg-background p-2 rounded text-xs overflow-x-auto whitespace-pre">
{`:::tabs
[label="Long Position"]
Setup para posición larga...

[label="Short Position"]
Setup para posición corta...
:::`}
                        </pre>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-1">🔄 Flip Card (Pregunta/Respuesta)</h4>
                        <pre className="bg-background p-2 rounded text-xs overflow-x-auto whitespace-pre">
{`:::flipcard
[front]
¿Qué es un higher high (HH)?

[back]
Un HH ocurre cuando el precio hace un pico más alto que el anterior, indicando momentum alcista.
:::`}
                        </pre>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-1">⚠️ Callout (Mensajes Destacados)</h4>
                        <pre className="bg-background p-2 rounded text-xs overflow-x-auto whitespace-pre">
{`:::callout type="warning"
⚠️ **Advertencia de Riesgo**: Nunca arriesgues más del 1-2% de tu cuenta en una sola operación.
:::`}
                        </pre>
                        <p className="text-xs text-muted-foreground mt-1">
                          Types: info, warning, success, danger, tip
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-1">📊 Trading Simulator v1 (Clásico)</h4>
                        <pre className="bg-background p-2 rounded text-xs overflow-x-auto whitespace-pre">
{`:::trading-sim asset="EURUSD" scenario="uptrend_pullback"
[context]
{
  "concept": "Comprar pullbacks en tendencia alcista",
  "whatToLook": ["HH y HL", "Pullback a soporte", "Rechazo alcista"],
  "hint": "La tendencia es tu amiga"
}

[scenario_data]
{
  "historical": [1.0800, 1.0820, 1.0850, 1.0880],
  "current": 1.0865,
  "future": [1.0870, 1.0885, 1.0900],
  "correct_action": "buy",
  "entry": 1.0865,
  "stop_loss": 1.0850,
  "take_profit": 1.0900
}

[question]
¿Detectas la tendencia? ¿Dónde colocarías SL y TP?

[feedback_buy]
✅ Excelente. Identificaste correctamente el pullback en tendencia alcista.

[feedback_sell]
❌ Incorrecto. Vendiste contra la tendencia establecida.

[feedback_skip]
⚠️ Oportunidad perdida. Este era un setup de alta probabilidad.
:::`}
                        </pre>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-1">🚀 Trading Simulator v2 (Avanzado - Nuevo v1.1)</h4>
                        <pre className="bg-background p-2 rounded text-xs overflow-x-auto whitespace-pre">
{`:::trading-sim asset="EURUSD" scenario="uptrend_pullback" v="2"
chart="candles" timeframe="H1" reveal_future="after_decision"

[market]
{ "spread": 0.0002, "slippage": 0.0001, "commission_per_lot": 7 }

[risk]
{ "initial_balance": 10000, "risk_pct": 1, "min_rr": 1.5 }

[dataset]
{
  "ohlc": [
    ["2024-05-01T10:00Z", 1.0810, 1.0830, 1.0800, 1.0820],
    ["2024-05-01T11:00Z", 1.0820, 1.0850, 1.0815, 1.0845],
    ["2024-05-01T12:00Z", 1.0845, 1.0860, 1.0840, 1.0855]
  ]
}

[annotations]
{ "higherHighs": [1, 3], "supportZones": [1.0850] }

[context]
{
  "concept": "Pullbacks con gestión de riesgo",
  "whatToLook": ["Estructura HH/HL", "Zona de soporte", "R:R mínimo 1.5"],
  "hint": "Valida estructura + zona + R:R"
}

[hints]
- Busca HH y HL crecientes
- ¿Está el precio en soporte?
- ¿Tu R:R cumple mínimo 1.5?

[rubric]
{
  "trend_alignment": 0.35,
  "rr_meets_min": 0.35,
  "structure_based_sl": 0.20,
  "entry_location_quality": 0.10
}

[question]
1. ¿Detectas HH y HL?
2. ¿Dónde colocarías SL y TP?
3. ¿Cumple tu R:R el mínimo?

[feedback_general]
Siempre valida: estructura + zona + R:R.

[feedback_buy]
✅ A favor de tendencia con R:R correcto.

[feedback_sell]
❌ Contra tendencia, R:R bajo.

[feedback_skip]
⚠️ Setup válido omitido.
:::`}
                        </pre>
                        <p className="text-xs text-muted-foreground mt-1">
                          v2 incluye: datos OHLC, gestión de riesgo, hints progresivos, scoring con rubric, y validación automática.
                        </p>
                      </div>

                      <div className="bg-muted p-3 rounded-lg">
                        <h4 className="font-semibold mb-2">💡 Tips de Autor</h4>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          <li>• Usa <code className="bg-background px-1 py-0.5 rounded">:::meta</code> al inicio para metadata</li>
                          <li>• v1 para escenarios simples, v2 para análisis avanzado</li>
                          <li>• JSON debe ser válido (sin comas finales)</li>
                          <li>• Aliases: <code className="bg-background px-1 py-0.5 rounded">[context]</code> = <code className="bg-background px-1 py-0.5 rounded">[educational_context]</code></li>
                          <li>• Valida con: <code className="bg-background px-1 py-0.5 rounded">npm run validate-lesson</code></li>
                        </ul>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              <FormControl>
                <Textarea
                  ref={contentTextareaRef}
                  placeholder="# Introduction&#10;&#10;Lesson content here...&#10;&#10;🤖 Tip: Use AI Instructions button above to generate content with ChatGPT, Claude, or any AI.&#10;&#10;:::callout type=&quot;info&quot;&#10;💡 Use the Syntax Guide for interactive elements!&#10;:::"
                  className="min-h-[200px] font-mono text-sm"
                  {...field}
                />
              </FormControl>
              <div className="flex items-center justify-between mt-2">
                <FormDescription>Supports Markdown + Interactive Components</FormDescription>
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
            <FormLabel>Video (Optional)</FormLabel>
            <div className="space-y-4 mt-2">
              <FormField
                control={form.control}
                name="video_external_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">
                      YouTube/Vimeo URL (Recommended)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://www.youtube.com/watch?v=..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      ✅ Paste any YouTube or Vimeo link. Supported formats:
                      <ul className="list-disc list-inside mt-1 space-y-0.5">
                        <li>youtube.com/watch?v=VIDEO_ID</li>
                        <li>youtu.be/VIDEO_ID</li>
                        <li>vimeo.com/VIDEO_ID</li>
                      </ul>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or upload file
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Upload Video File</label>
                {lesson?.video_storage_key && !lessonVideoFile && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Current: {lesson.video_storage_key.split('/').pop()}
                  </p>
                )}
                <Input 
                  type="file" 
                  accept="video/*" 
                  onChange={(e) => setLessonVideoFile(e.target.files?.[0] || null)} 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Only if you have a local video file. YouTube links are preferred for better performance.
                </p>
              </div>
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
