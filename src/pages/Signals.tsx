import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

const Signals = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['signals']);
  const [filters, setFilters] = useState({
    market: "all",
    timeframe: "all",
    minRR: "all"
  });

  const signals = [
    {
      id: "1",
      title: "XAUUSD - Ruptura de resistencia",
      instrument: "XAUUSD",
      type: "LONG",
      timeframe: "H4",
      rr: 3.0,
      entry: "2018.50",
      sl: "2010.00",
      tp: "2044.00",
      logic: "Ruptura confirmada de resistencia en 2015 con retesteo exitoso. RSI saliendo de sobrevendido y confluencia con EMA 200.",
      invalidation: "Cierre por debajo de 2010 en H4",
      status: "Activa",
      publishedAt: "Hace 2h",
      author: "Analista Senior",
      confidence: "Alta"
    },
    {
      id: "2", 
      title: "EURUSD - Patrón de reversión",
      instrument: "EURUSD",
      type: "SHORT",
      timeframe: "H1",
      rr: 2.5,
      entry: "1.0850",
      sl: "1.0880",
      tp: "1.0775",
      logic: "Formación de doble techo en confluencia con zona de oferta. Divergencia bajista en MACD confirma debilidad.",
      invalidation: "Ruptura por encima de 1.0885",
      status: "TP alcanzado",
      publishedAt: "Hace 1d",
      author: "Analista Senior",
      confidence: "Media"
    },
    {
      id: "3",
      title: "GBPJPY - Continuación de tendencia",
      instrument: "GBPJPY", 
      type: "LONG",
      timeframe: "H4",
      rr: 2.0,
      entry: "188.20",
      sl: "185.50",
      tp: "193.60",
      logic: "Pullback a EMA 50 en tendencia alcista establecida. Soporte dinámico y nivel de Fibonacci 61.8%.",
      invalidation: "Cierre por debajo de 185.00 en H4",
      status: "SL alcanzado", 
      publishedAt: "Hace 2d",
      author: "Analista Junior",
      confidence: "Media"
    }
  ];

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

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-line bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('signals:title')}</h1>
              <p className="text-muted-foreground">{t('signals:subtitle')}</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/dashboard")}
              className="text-teal hover:bg-teal/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('signals:back_to_dashboard')}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Risk Warning */}
        <Alert className="border-warning/20 bg-warning/10 mb-6">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-foreground">
            <strong>{t('signals:risk_warning.title')}</strong> {t('signals:risk_warning.description')}
          </AlertDescription>
        </Alert>

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
                      <CardTitle className="text-foreground">{signal.title}</CardTitle>
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
                         <div className="font-mono font-medium text-foreground">{signal.entry}</div>
                       </div>
                       <div>
                         <span className="text-muted-foreground">{t('signals:signal.stop_loss')}</span>
                         <div className="font-mono font-medium text-destructive">{signal.sl}</div>
                       </div>
                       <div>
                         <span className="text-muted-foreground">{t('signals:signal.take_profit')}</span>
                         <div className="font-mono font-medium text-success">{signal.tp}</div>
                       </div>
                     </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {signal.publishedAt}
                      </div>
                       <div className="flex items-center gap-1">
                         <Target className="h-4 w-4" />
                         {t('signals:signal.confidence')} {signal.confidence}
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
                   <Button variant="outline" className="border-teal text-teal hover:bg-teal/10">
                     <Eye className="h-4 w-4 mr-2" />
                     {t('signals:signal.view_full_analysis')}
                   </Button>
                   <Button variant="outline" className="border-line">
                     <Activity className="h-4 w-4 mr-2" />
                     {t('signals:signal.view_chart')}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal">67%</div>
                <div className="text-sm text-muted-foreground">{t('signals:performance.win_rate')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal">2.1</div>
                <div className="text-sm text-muted-foreground">{t('signals:performance.avg_rr')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal">24</div>
                <div className="text-sm text-muted-foreground">{t('signals:performance.published_signals')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal">+12.3%</div>
                <div className="text-sm text-muted-foreground">{t('signals:performance.simulated_return')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signals;