import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Target,
  AlertCircle,
  Sparkles,
  BarChart3,
  Lightbulb,
  Brain,
  Shield,
  Eye,
  Loader2,
  Share2,
  Download,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { toPng } from "html-to-image";

interface JournalEntry {
  id: string;
  trade_date: string;
  instrument: string;
  direction: "BUY" | "SELL";
  entry_price: number;
  exit_price: number | null;
  lot_size: number;
  stop_loss: number | null;
  take_profit: number | null;
  result: number | null;
  result_pips: number | null;
  notes: string | null;
  emotions: string[] | null;
  tags: string[] | null;
  status: "open" | "closed" | "cancelled";
}

interface MentorRecommendation {
  recommendation: string;
  type: string;
  statistics?: {
    totalTrades: string;
    winRate: string;
    totalProfit: string;
    profitFactor: string;
  };
}

const emotionOptions = ["Confiado", "Ansioso", "Disciplinado", "FOMO", "Paciente", "Impulsivo", "Tranquilo", "Estresado"];

const typeIcons = {
  pattern: Eye,
  risk: Shield,
  psychology: Brain,
  strategy: Target,
  general: Lightbulb,
};

const typeColors = {
  pattern: "text-blue-500",
  risk: "text-yellow-500",
  psychology: "text-purple-500",
  strategy: "text-green-500",
  general: "text-teal",
};

export const TradingJournal = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const cardRef = useRef<HTMLDivElement>(null);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [formData, setFormData] = useState({
    trade_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    instrument: "",
    direction: "BUY" as "BUY" | "SELL",
    entry_price: "",
    exit_price: "",
    lot_size: "",
    stop_loss: "",
    take_profit: "",
    notes: "",
    tags: "",
    status: "open" as "open" | "closed",
  });

  // Fetch journal entries
  const { data: entries, isLoading } = useQuery({
    queryKey: ["journal-entries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .order("trade_date", { ascending: false });

      if (error) throw error;
      return data as JournalEntry[];
    },
  });

  // Fetch mentor recommendation
  const { data: mentorRec, isLoading: isLoadingMentor, refetch: refetchMentor } = useQuery({
    queryKey: ["journal-mentor"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("journal-mentor");
      if (error) throw error;
      return data as MentorRecommendation;
    },
    enabled: !!entries && entries.length > 0,
  });

  // Create entry mutation
  const createEntry = useMutation({
    mutationFn: async (entry: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("journal_entries")
        .insert([{ ...entry, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["journal-mentor"] });
      toast({
        title: "Operación registrada",
        description: "Tu entrada ha sido guardada en el journal",
      });
      setShowNewEntry(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      trade_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      instrument: "",
      direction: "BUY",
      entry_price: "",
      exit_price: "",
      lot_size: "",
      stop_loss: "",
      take_profit: "",
      notes: "",
      tags: "",
      status: "open",
    });
    setSelectedEmotions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.instrument || !formData.entry_price || !formData.lot_size) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa instrumento, precio de entrada y tamaño de lote",
        variant: "destructive",
      });
      return;
    }

    const entry: any = {
      trade_date: new Date(formData.trade_date).toISOString(),
      instrument: formData.instrument,
      direction: formData.direction,
      entry_price: parseFloat(formData.entry_price),
      exit_price: formData.exit_price ? parseFloat(formData.exit_price) : null,
      lot_size: parseFloat(formData.lot_size),
      stop_loss: formData.stop_loss ? parseFloat(formData.stop_loss) : null,
      take_profit: formData.take_profit ? parseFloat(formData.take_profit) : null,
      notes: formData.notes || null,
      tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : null,
      status: formData.status,
      emotions: selectedEmotions.length > 0 ? selectedEmotions : null,
    };

    // Calculate result if closed
    if (formData.status === "closed" && formData.exit_price) {
      const priceChange = formData.direction === "BUY"
        ? parseFloat(formData.exit_price) - parseFloat(formData.entry_price)
        : parseFloat(formData.entry_price) - parseFloat(formData.exit_price);
      entry.result = priceChange * parseFloat(formData.lot_size);
    }

    createEntry.mutate(entry);
  };

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleShareCard = async () => {
    if (!cardRef.current) return;
    
    setIsSharing(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0a0a0a',
      });
      
      // Try to use Web Share API if available
      if (navigator.share && navigator.canShare) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'mentor-analysis.png', { type: 'image/png' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Mi Análisis de Trading',
            text: 'Análisis de mi mentor AI de trading',
          });
          toast({
            title: "Compartido exitosamente",
            description: "La tarjeta ha sido compartida",
          });
          return;
        }
      }
      
      // Fallback: download the image
      const link = document.createElement('a');
      link.download = 'mentor-analysis.png';
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Imagen descargada",
        description: "Puedes compartirla desde tu galería",
      });
    } catch (error) {
      console.error('Error sharing card:', error);
      toast({
        title: "Error al compartir",
        description: "No se pudo compartir la tarjeta. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleRegenerateAnalysis = async () => {
    try {
      await refetchMentor();
      toast({
        title: "Análisis actualizado",
        description: "Se ha generado un nuevo análisis de tus operaciones",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el análisis. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const TypeIcon = mentorRec?.type ? typeIcons[mentorRec.type as keyof typeof typeIcons] || Lightbulb : Lightbulb;
  const typeColor = mentorRec?.type ? typeColors[mentorRec.type as keyof typeof typeColors] || "text-teal" : "text-teal";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-teal/20 to-teal/5 border border-teal/30">
            <BookOpen className="w-6 h-6 text-teal" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Diario de Trading</h2>
            <p className="text-muted-foreground">Registra y analiza tus operaciones con tu mentor AI</p>
          </div>
        </div>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Nueva Entrada clicked, current state:", showNewEntry);
            setShowNewEntry(!showNewEntry);
          }}
          className="bg-teal hover:bg-teal/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Entrada
        </Button>
      </div>

      {/* New Entry Form - Moved to top for visibility */}
      {showNewEntry && (
        <Card className="p-6 border-teal/30 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Nueva Operación</h3>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => setShowNewEntry(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Cerrar
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trade_date">Fecha y Hora</Label>
                <Input
                  id="trade_date"
                  type="datetime-local"
                  value={formData.trade_date}
                  onChange={(e) => setFormData({ ...formData, trade_date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instrument">Instrumento *</Label>
                <Input
                  id="instrument"
                  placeholder="EURUSD, XAUUSD, etc."
                  value={formData.instrument}
                  onChange={(e) => setFormData({ ...formData, instrument: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="direction">Dirección</Label>
                <select
                  id="direction"
                  className="w-full p-2 rounded-md border border-line bg-surface text-foreground"
                  value={formData.direction}
                  onChange={(e) => setFormData({ ...formData, direction: e.target.value as "BUY" | "SELL" })}
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lot_size">Tamaño de Lote *</Label>
                <Input
                  id="lot_size"
                  type="number"
                  step="0.01"
                  placeholder="0.01"
                  value={formData.lot_size}
                  onChange={(e) => setFormData({ ...formData, lot_size: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry_price">Precio de Entrada *</Label>
                <Input
                  id="entry_price"
                  type="number"
                  step="0.00001"
                  placeholder="1.12345"
                  value={formData.entry_price}
                  onChange={(e) => setFormData({ ...formData, entry_price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exit_price">Precio de Salida</Label>
                <Input
                  id="exit_price"
                  type="number"
                  step="0.00001"
                  placeholder="1.12545"
                  value={formData.exit_price}
                  onChange={(e) => setFormData({ ...formData, exit_price: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stop_loss">Stop Loss</Label>
                <Input
                  id="stop_loss"
                  type="number"
                  step="0.00001"
                  placeholder="1.12000"
                  value={formData.stop_loss}
                  onChange={(e) => setFormData({ ...formData, stop_loss: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="take_profit">Take Profit</Label>
                <Input
                  id="take_profit"
                  type="number"
                  step="0.00001"
                  placeholder="1.13000"
                  value={formData.take_profit}
                  onChange={(e) => setFormData({ ...formData, take_profit: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                className="w-full p-2 rounded-md border border-line bg-surface text-foreground"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "open" | "closed" })}
              >
                <option value="open">Abierta</option>
                <option value="closed">Cerrada</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>¿Cómo te sentías al operar?</Label>
              <div className="flex flex-wrap gap-2">
                {emotionOptions.map((emotion) => (
                  <Badge
                    key={emotion}
                    variant={selectedEmotions.includes(emotion) ? "default" : "outline"}
                    className={`cursor-pointer ${selectedEmotions.includes(emotion) ? 'bg-teal hover:bg-teal/90' : 'hover:bg-surface/50'}`}
                    onClick={() => toggleEmotion(emotion)}
                  >
                    {emotion}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas y Análisis</Label>
              <Textarea
                id="notes"
                placeholder="¿Qué funcionó bien? ¿Qué mejorar? ¿Seguiste tu plan?"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Etiquetas (separadas por coma)</Label>
              <Input
                id="tags"
                placeholder="breakout, soportes, tendencia"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="bg-teal hover:bg-teal/90" disabled={createEntry.isPending}>
                {createEntry.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Guardar Entrada
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowNewEntry(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Mentor Recommendations */}
      {entries && entries.length > 0 && (
        <div className="space-y-4">
          {/* Statistics Overview */}
          {mentorRec?.statistics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="p-4 bg-gradient-to-br from-surface to-surface/50">
                <div className="text-xs text-muted-foreground mb-1">Operaciones</div>
                <div className="text-2xl font-bold text-foreground">
                  {mentorRec.statistics.totalTrades}
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-teal/10 to-teal/5">
                <div className="text-xs text-muted-foreground mb-1">Win Rate</div>
                <div className="text-2xl font-bold text-teal">
                  {mentorRec.statistics.winRate}%
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-surface to-surface/50">
                <div className="text-xs text-muted-foreground mb-1">P&L Total</div>
                <div className={`text-2xl font-bold ${parseFloat(mentorRec.statistics.totalProfit) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${mentorRec.statistics.totalProfit}
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-surface to-surface/50">
                <div className="text-xs text-muted-foreground mb-1">Profit Factor</div>
                <div className="text-2xl font-bold text-foreground">
                  {mentorRec.statistics.profitFactor}
                </div>
              </Card>
            </div>
          )}

          {/* Mentor Card */}
          <Card className="overflow-hidden bg-background border-line/50">
            <div className="p-4 border-b border-line/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal/10">
                  <Brain className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Análisis de tu Mentor AI</h3>
                  <p className="text-xs text-muted-foreground">Basado en {entries.length} operaciones</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleRegenerateAnalysis}
                  variant="ghost"
                  size="sm"
                  disabled={isLoadingMentor}
                  className="hover:bg-surface"
                >
                  {isLoadingMentor ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  onClick={handleShareCard}
                  variant="ghost"
                  size="sm"
                  disabled={isSharing || !mentorRec}
                  className="hover:bg-surface"
                >
                  {isSharing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {isLoadingMentor ? (
              <div className="flex items-center justify-center gap-2 p-12 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analizando tu journal...</span>
              </div>
            ) : mentorRec ? (
              <div ref={cardRef} className="relative overflow-hidden bg-gradient-to-br from-teal via-teal/95 to-teal/90">
                {/* Subtle patterns */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_50%)]" />
                
                <div className="relative p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                        <TypeIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">Diagnóstico Profesional</h4>
                        <Badge className="mt-1.5 bg-white/15 text-white text-xs border-white/25 capitalize backdrop-blur-sm">
                          {mentorRec.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                      <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse shadow-lg" />
                      <span className="text-white text-xs font-medium">{entries.length} ops</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-3 text-white">
                    {mentorRec.recommendation.split('\n').map((paragraph, idx) => {
                      const isBold = paragraph.includes('**');
                      const cleanText = paragraph.replace(/\*\*/g, '');
                      
                      if (cleanText.trim() === '') return null;
                      
                      if (isBold) {
                        return (
                          <div key={idx} className="mt-5 first:mt-0">
                            <div className="flex items-center gap-2.5 mb-2">
                              <div className="h-[2.5px] w-10 bg-white/50 rounded-full" />
                              <h5 className="text-base font-bold text-white leading-tight">
                                {cleanText}
                              </h5>
                            </div>
                          </div>
                        );
                      }
                      
                      if (cleanText.match(/^[\d\-\•\*]\s/)) {
                        return (
                          <div key={idx} className="flex gap-3 items-start pl-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/80 mt-2 flex-shrink-0 shadow-sm" />
                            <p className="text-sm leading-relaxed text-white/95 font-medium">
                              {cleanText.replace(/^[\d\-\•\*]\s/, '')}
                            </p>
                          </div>
                        );
                      }
                      
                      return (
                        <p key={idx} className="text-sm leading-relaxed text-white/90 pl-2">
                          {cleanText}
                        </p>
                      );
                    })}
                  </div>

                  {/* Footer Branding with talamo.app */}
                  <div className="pt-4 mt-2 border-t border-white/15">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-white/15">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white text-xs font-semibold">Mentor AI Experto</p>
                          <p className="text-white/70 text-[10px]">PhD Trading & Psicología</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white/70 text-[10px]">
                          {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    {/* talamo.app branding */}
                    <div className="flex items-center justify-center pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <p className="text-white font-bold text-sm tracking-wide">talamo.app</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No se pudieron cargar las recomendaciones</p>
                <Button
                  onClick={handleRegenerateAnalysis}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  Reintentar
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Journal Entries List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Historial de Operaciones</h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal" />
          </div>
        ) : entries && entries.length > 0 ? (
          <div className="grid gap-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="p-4 hover:border-teal/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${entry.direction === "BUY" ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                      {entry.direction === "BUY" ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {entry.direction} {entry.instrument}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(entry.trade_date), "dd/MM/yyyy HH:mm")}
                      </p>
                    </div>
                  </div>
                  <Badge variant={entry.status === "open" ? "default" : entry.status === "closed" ? "secondary" : "outline"}>
                    {entry.status === "open" ? "Abierta" : entry.status === "closed" ? "Cerrada" : "Cancelada"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Entrada:</span>
                    <span className="ml-2 font-medium">{entry.entry_price}</span>
                  </div>
                  {entry.exit_price && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Salida:</span>
                      <span className="ml-2 font-medium">{entry.exit_price}</span>
                    </div>
                  )}
                  <div className="text-sm">
                    <span className="text-muted-foreground">Lotes:</span>
                    <span className="ml-2 font-medium">{entry.lot_size}</span>
                  </div>
                  {entry.result !== null && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Resultado:</span>
                      <span className={`ml-2 font-bold ${entry.result >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${entry.result.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {entry.emotions && entry.emotions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {entry.emotions.map((emotion, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                )}

                {entry.notes && (
                  <div className="mt-3 p-3 rounded-lg bg-surface/50 border border-line/50">
                    <p className="text-sm text-foreground">{entry.notes}</p>
                  </div>
                )}

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {entry.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay operaciones registradas</h3>
            <p className="text-muted-foreground mb-4">
              Comienza a documentar tus trades para recibir análisis personalizados de tu mentor AI
            </p>
            <Button onClick={() => setShowNewEntry(true)} className="bg-teal hover:bg-teal/90">
              <Plus className="w-4 h-4 mr-2" />
              Registrar Primera Operación
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};