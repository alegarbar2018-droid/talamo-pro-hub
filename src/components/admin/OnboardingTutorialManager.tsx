import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Trash2, Eye, Edit2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Tutorial {
  id: string;
  tutorial_key: string;
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  is_active: boolean;
  display_order: number;
}

export const OnboardingTutorialManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Tutorial>>({
    tutorial_key: 'change_partner_exness',
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    duration_seconds: 0,
    is_active: true,
    display_order: 0
  });

  const { data: tutorials, isLoading } = useQuery({
    queryKey: ['onboarding-tutorials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('onboarding_tutorials')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as Tutorial[];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (tutorial: Partial<Tutorial>) => {
      if (editingId) {
        const { data, error } = await supabase
          .from('onboarding_tutorials')
          .update(tutorial)
          .eq('id', editingId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Ensure required fields are present
        if (!tutorial.title || !tutorial.tutorial_key) {
          throw new Error('Title and tutorial_key are required');
        }
        
        const { data, error } = await supabase
          .from('onboarding_tutorials')
          .insert([tutorial as any])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-tutorials'] });
      toast.success(editingId ? 'Tutorial actualizado' : 'Tutorial creado');
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al guardar tutorial');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('onboarding_tutorials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-tutorials'] });
      toast.success('Tutorial eliminado');
    }
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      tutorial_key: 'change_partner_exness',
      title: '',
      description: '',
      video_url: '',
      thumbnail_url: '',
      duration_seconds: 0,
      is_active: true,
      display_order: 0
    });
  };

  const handleEdit = (tutorial: Tutorial) => {
    setEditingId(tutorial.id);
    setFormData(tutorial);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Video Tutoriales del Onboarding
            </CardTitle>
            <CardDescription>
              Gestiona videos para ayudar a los usuarios en el proceso de registro
            </CardDescription>
          </div>
          <Button onClick={() => resetForm()} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Tutorial
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Lista de Tutoriales</TabsTrigger>
            <TabsTrigger value="form">
              {editingId ? 'Editar' : 'Crear'} Tutorial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Cargando...</p>
            ) : tutorials && tutorials.length > 0 ? (
              <div className="space-y-3">
                {tutorials.map((tutorial) => (
                  <Card key={tutorial.id} className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">
                              {tutorial.title}
                            </h4>
                            {tutorial.is_active ? (
                              <Badge variant="default" className="text-xs">Activo</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Inactivo</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Key: <code className="bg-muted px-1.5 py-0.5 rounded">{tutorial.tutorial_key}</code>
                          </p>
                          {tutorial.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {tutorial.description}
                            </p>
                          )}
                          {tutorial.video_url && (
                            <a 
                              href={tutorial.video_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Ver video
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(tutorial)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (confirm('¿Eliminar este tutorial?')) {
                                deleteMutation.mutate(tutorial.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay tutoriales. Crea uno en la pestaña "Crear Tutorial".
              </p>
            )}
          </TabsContent>

          <TabsContent value="form">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="ej: Cómo cambiar tu afiliación en Exness"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tutorial_key">Key (único) *</Label>
                  <Input
                    id="tutorial_key"
                    value={formData.tutorial_key}
                    onChange={(e) => setFormData({ ...formData, tutorial_key: e.target.value })}
                    required
                    placeholder="change_partner_exness"
                    disabled={!!editingId}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción opcional del tutorial"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video_url">URL del Video *</Label>
                <Input
                  id="video_url"
                  type="url"
                  value={formData.video_url || ''}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  required
                  placeholder="https://youtube.com/... o URL de Supabase Storage"
                />
                <p className="text-xs text-muted-foreground">
                  Puede ser YouTube, Vimeo, o archivo subido a Supabase Storage
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">URL del Thumbnail (opcional)</Label>
                <Input
                  id="thumbnail_url"
                  type="url"
                  value={formData.thumbnail_url || ''}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración (segundos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_seconds || 0}
                    onChange={(e) => setFormData({ ...formData, duration_seconds: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Orden de visualización</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order || 0}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <Label htmlFor="is_active" className="cursor-pointer">
                  Tutorial activo
                </Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'} Tutorial
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};