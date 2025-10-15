import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  TrendingDown,
  ArrowLeft,
  Filter,
  Clock,
  Target,
  AlertTriangle,
  Eye,
  BarChart3,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TradingDisclaimer from "@/components/ui/trading-disclaimer";
import { useObservability, withPageTracking } from "@/components/business/ObservabilityProvider";
import { useSignals, useSignalsPerformance } from "@/hooks/useSignals";
import { Calculator, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Signals = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['signals']);
  const { trackInteraction, trackBusinessEvent } = useObservability();
  const { signals, loading, error } = useSignals();
  const { performance, loading: perfLoading } = useSignalsPerformance();
  const [filters, setFilters] = useState({
    market: "all",
    timeframe: "all",
    minRR: "all"
  });

  // Track page view and signal interactions
  React.useEffect(() => {
    trackBusinessEvent('signal_viewed', { 
      page: 'signals_list',
      filters_active: Object.values(filters).some(f => f !== 'all')
    });
  }, [trackBusinessEvent, filters]);

  const filteredSignals = signals.filter(signal => {
    if (filters.market !== "all" && signal.instrument !== filters.market) return false;
    if (filters.timeframe !== "all" && signal.timeframe !== filters.timeframe) return false;
    if (filters.minRR !== "all" && signal.rr < parseFloat(filters.minRR)) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      "Activa": "bg-teal/20 text-teal border-teal/30",
      "Active": "bg-teal/20 text-teal border-teal/30",
      "Ativo": "bg-teal/20 text-teal border-teal/30",
      "TP alcanzado": "bg-success/20 text-success border-success/30",
      "TP reached": "bg-success/20 text-success border-success/30",
      "TP atingido": "bg-success/20 text-success border-success/30",
      "SL alcanzado": "bg-destructive/20 text-destructive border-destructive/30",
      "SL reached": "bg-destructive/20 text-destructive border-destructive/30",
      "SL atingido": "bg-destructive/20 text-destructive border-destructive/30",
    };
    return statusMap[status] || "bg-muted/20 text-muted-foreground border-muted/30";
  };

  const getTypeIcon = (type: string) => {
    return type === "LONG" ? 
      <TrendingUp className="h-4 w-4 text-success" /> : 
      <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  const calculatePipsFromPrice = (
    entry: number, 
    sl: number, 
    tp: number, 
    symbol: string
  ): { sl_pips: number; tp_pips: number } => {
    const pipValue = symbol.includes("JPY") ? 0.01 : 0.0001;
    return {
      sl_pips: Math.abs(Math.round((entry - sl) / pipValue)),
      tp_pips: Math.abs(Math.round((tp - entry) / pipValue))
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-line/50 bg-gradient-to-br from-background via-teal/5 to-primary/5">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
            className="mb-8 hover:bg-surface/80 backdrop-blur-sm group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {t('signals:back_to_dashboard')}
          </Button>
          
          <div className="space-y-6 max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal/20 via-teal/10 to-transparent border border-teal/30 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span className="text-sm font-medium text-teal">Señales Verificadas</span>
            </div>
            
            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                {t('signals:title')}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl">
                {t('signals:subtitle')}{" "}
                <span className="text-teal font-medium">análisis profesional verificado</span>
              </p>
            </div>
            
            {/* Feature highlights */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface/50 backdrop-blur-sm border border-line/50">
                <Activity className="w-4 h-4 text-teal" />
                <span className="text-sm text-muted-foreground">Tiempo Real</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface/50 backdrop-blur-sm border border-line/50">
                <Target className="w-4 h-4 text-teal" />
                <span className="text-sm text-muted-foreground">R:R Optimizado</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface/50 backdrop-blur-sm border border-line/50">
                <BarChart3 className="w-4 h-4 text-teal" />
                <span className="text-sm text-muted-foreground">Análisis Verificado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Risk Warning */}
        <TradingDisclaimer 
          variant="full"
          context="signals"
          showCollapsible={true}
          className="mb-6"
        />

        {/* Filters */}
        <Card className="border-line bg-surface mb-6">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Filter className="h-5 w-5 text-teal" />
              {t('signals:filters.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t('signals:filters.market')}</label>
                <Select value={filters.market} onValueChange={(value) => 
                  setFilters({ ...filters, market: value })
                }>
                  <SelectTrigger className="bg-input border-line">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('signals:filters.all_markets')}</SelectItem>
                    <SelectItem value="XAUUSD">XAUUSD</SelectItem>
                    <SelectItem value="EURUSD">EURUSD</SelectItem>
                    <SelectItem value="GBPJPY">GBPJPY</SelectItem>
                    <SelectItem value="USDCAD">USDCAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t('signals:filters.timeframe')}</label>
                <Select value={filters.timeframe} onValueChange={(value) => 
                  setFilters({ ...filters, timeframe: value })
                }>
                  <SelectTrigger className="bg-input border-line">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('signals:filters.all_timeframes')}</SelectItem>
                    <SelectItem value="M15">M15</SelectItem>
                    <SelectItem value="H1">H1</SelectItem>
                    <SelectItem value="H4">H4</SelectItem>
                    <SelectItem value="D1">D1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t('signals:filters.min_rr')}</label>
                <Select value={filters.minRR} onValueChange={(value) => 
                  setFilters({ ...filters, minRR: value })
                }>
                  <SelectTrigger className="bg-input border-line">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('signals:filters.any_rr')}</SelectItem>
                    <SelectItem value="1.5">1.5+</SelectItem>
                    <SelectItem value="2.0">2.0+</SelectItem>
                    <SelectItem value="3.0">3.0+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signals Grid */}
        <div className="space-y-6">
          {filteredSignals.map((signal) => (
            <Card key={signal.id} className="border-line bg-surface hover:shadow-glow-subtle transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(signal.type)}
                  <div>
                      <CardTitle className="text-foreground">{signal.instrument} - {signal.type}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {signal.instrument} • {signal.timeframe} • Por {signal.author}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(signal.status)}>
                      {t(`signals:signal.status.${signal.status.toLowerCase().replace(/ /g, '_')}`) || signal.status}
                    </Badge>
                    <Badge variant="outline" className="border-teal text-teal">
                      RR 1:{signal.rr}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Signal Details */}
                  <div className="space-y-4">
                     <div className="grid grid-cols-3 gap-4 text-sm">
                       <div>
                          <span className="text-muted-foreground">{t('signals:signal.entry')}</span>
                          <div className="font-mono font-medium text-foreground">{signal.entry.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t('signals:signal.stop_loss')}</span>
                          <div className="font-mono font-medium text-destructive">{signal.sl.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t('signals:signal.take_profit')}</span>
                          <div className="font-mono font-medium text-success">{signal.tp.toFixed(2)}</div>
                        </div>
                     </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {signal.publishedAt}
                      </div>
                       <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {t('signals:signal.confidence')}: {signal.confidence}%
                        </div>
                    </div>
                  </div>
                  
                  {/* Analysis */}
                  <div className="space-y-4">
                     <div>
                       <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                         <BarChart3 className="h-4 w-4 text-teal" />
                         {t('signals:signal.analysis_logic')}
                       </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {signal.logic}
                      </p>
                    </div>
                    
                     <div>
                       <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                         <AlertTriangle className="h-4 w-4 text-warning" />
                         {t('signals:signal.invalidation')}
                       </h4>
                      <p className="text-sm text-muted-foreground">
                        {signal.invalidation}
                      </p>
                    </div>
                  </div>
                </div>
                
                 <div className="flex gap-3 mt-6 pt-4 border-t border-line">
                  <Button 
                    className="bg-teal hover:bg-teal/90 text-white"
                    onClick={() => {
                      const { sl_pips, tp_pips } = calculatePipsFromPrice(
                        signal.entry, 
                        signal.sl, 
                        signal.tp, 
                        signal.instrument
                      );
                      
                      trackInteraction('signal_card', 'open_in_tools_click', {
                        signal_id: signal.id,
                        instrument: signal.instrument,
                        type: signal.type
                      });
                      
                      navigate(`/tools?calc=position-size&symbol=${signal.instrument}&dir=${signal.type}&entry=${signal.entry}&sl_pips=${sl_pips}&tp_pips=${tp_pips}`);
                    }}
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Calcular en Tools
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-line"
                    onClick={() => {
                      const jsonPayload = {
                        instrument: signal.instrument,
                        type: signal.type,
                        entry: signal.entry,
                        stop_loss: signal.sl,
                        take_profit: signal.tp,
                        rr: signal.rr,
                        timeframe: signal.timeframe,
                        logic: signal.logic,
                        invalidation: signal.invalidation,
                        published_at: signal.publishedAt
                      };
                      
                      navigator.clipboard.writeText(JSON.stringify(jsonPayload, null, 2));
                      
                      toast({
                        title: "JSON copiado",
                        description: "Los datos de la señal se copiaron al portapapeles",
                      });
                      
                      trackInteraction('signal_card', 'copy_json', {
                        signal_id: signal.id,
                        instrument: signal.instrument
                      });
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar JSON
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-teal text-teal hover:bg-teal/10"
                    onClick={() => {
                      trackInteraction('signal_card', 'view_full_analysis', {
                        signal_id: signal.id,
                        signal_type: signal.type,
                        instrument: signal.instrument
                      });
                    }}
                    aria-label={`Ver análisis completo de ${signal.instrument}`}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t('signals:signal.view_full_analysis')}
                  </Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSignals.length === 0 && (
          <Card className="border-line bg-surface">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {t('signals:empty')}
              </p>
              <Button 
                variant="outline" 
                onClick={() => setFilters({ market: "all", timeframe: "all", minRR: "all" })}
                className="mt-4 border-teal text-teal hover:bg-teal/10"
              >
                {t('signals:clear_filters')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Historical Performance */}
        <Card className="border-line bg-surface mt-8">
          <CardHeader>
            <CardTitle className="text-foreground">{t('signals:performance.title')}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('signals:performance.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {perfLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-16" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal">
                    {performance?.winRate || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('signals:performance.win_rate')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal">
                    {performance?.avgRr || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('signals:performance.avg_rr')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal">
                    {performance?.totalSignals || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('signals:performance.published_signals')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal">
                    {performance?.simulatedReturn >= 0 ? '+' : ''}
                    {performance?.simulatedReturn || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('signals:performance.simulated_return')}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default withPageTracking(Signals, 'signals');