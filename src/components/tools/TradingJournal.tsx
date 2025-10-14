import { useState, useEffect } from "react";
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
} from "lucide-react";
import { format } from "date-fns";

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
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
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
          onClick={() => setShowNewEntry(!showNewEntry)}
          className="bg-teal hover:bg-teal/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Entrada
        </Button>
      </div>

      {/* Mentor Recommendations */}
      {entries && entries.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-teal/5 to-surface border-teal/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-teal/10">
              <Sparkles className="w-6 h-6 text-teal" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  Recomendaciones de tu Mentor AI
                </h3>
                <p className="text-sm text-muted-foreground">
                  Análisis basado en tus últimas {entries.length} operaciones
                </p>
              </div>

              {isLoadingMentor ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analizando tu journal...</span>
                </div>
              ) : mentorRec ? (
                <div className="space-y-4">
                  {/* Statistics */}
                  {mentorRec.statistics && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 rounded-lg bg-surface/50 border border-line/50">
                        <div className="text-sm text-muted-foreground">Operaciones</div>
                        <div className="text-xl font-bold text-foreground">
                          {mentorRec.statistics.totalTrades}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-surface/50 border border-line/50">
                        <div className="text-sm text-muted-foreground">Win Rate</div>
                        <div className="text-xl font-bold text-teal">
                          {mentorRec.statistics.winRate}%
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-surface/50 border border-line/50">
                        <div className="text-sm text-muted-foreground">P&L Total</div>
                        <div className={`text-xl font-bold ${parseFloat(mentorRec.statistics.totalProfit) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${mentorRec.statistics.totalProfit}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-surface/50 border border-line/50">
                        <div className="text-sm text-muted-foreground">Profit Factor</div>
                        <div className="text-xl font-bold text-foreground">
                          {mentorRec.statistics.profitFactor}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recommendation - Premium Style */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background via-surface/80 to-background border border-teal/30 shadow-2xl backdrop-blur-sm">
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal/10 via-teal/5 to-transparent opacity-50 animate-pulse" style={{ animationDuration: '3s' }} />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-teal/5 to-transparent" />
                    
                    {/* Glow effect */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-teal/20 via-teal/10 to-teal/20 rounded-2xl blur-sm -z-10" />
                    
                    <div className="relative p-8">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-teal/20 to-teal/10 border border-teal/30 shadow-lg">
                            <TypeIcon className={`w-6 h-6 ${typeColor}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg font-bold text-foreground">Análisis del Mentor</h4>
                              <Badge variant="secondary" className="capitalize text-xs font-semibold px-2 py-0.5">
                                {mentorRec.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3" />
                              Personalizado para tu perfil
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-4 text-foreground">
                        {mentorRec.recommendation.split('\n').map((paragraph, idx) => {
                          const isBold = paragraph.includes('**');
                          const cleanText = paragraph.replace(/\*\*/g, '');
                          
                          if (cleanText.trim() === '') return null;
                          
                          if (isBold) {
                            return (
                              <div key={idx} className="flex items-start gap-3 mt-5 first:mt-0">
                                <div className="w-1 h-6 bg-gradient-to-b from-teal to-teal/50 rounded-full mt-0.5" />
                                <h5 className="text-base font-bold text-teal leading-tight">
                                  {cleanText}
                                </h5>
                              </div>
                            );
                          }
                          
                          if (cleanText.match(/^[\d\-\•\*]\s/)) {
                            return (
                              <div key={idx} className="flex gap-3 items-start pl-3 py-1">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-teal to-teal/70 mt-2 flex-shrink-0 shadow-sm" />
                                <p className="text-sm leading-relaxed text-foreground/90">
                                  {cleanText.replace(/^[\d\-\•\*]\s/, '')}
                                </p>
                              </div>
                            );
                          }
                          
                          return (
                            <p key={idx} className="text-[15px] leading-relaxed text-foreground/85 pl-3">
                              {cleanText}
                            </p>
                          );
                        })}
                      </div>
                      
                      {/* Footer */}
                      <div className="mt-8 pt-5 border-t border-line/30">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <Brain className="w-4 h-4 text-teal" />
                            <span className="font-medium">
                              {entries.length} operaciones analizadas
                            </span>
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-teal/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                            <span>AI activo</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => refetchMentor()}
                    variant="outline"
                    size="sm"
                    className="border-teal/30 hover:bg-teal/10"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Actualizar Recomendaciones
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No se pudieron cargar las recomendaciones. Intenta nuevamente.
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* New Entry Form */}
      {showNewEntry && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Nueva Operación</h3>
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
                  className="w-full p-2 rounded-md border border-line bg-surface"
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
                className="w-full p-2 rounded-md border border-line bg-surface"
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