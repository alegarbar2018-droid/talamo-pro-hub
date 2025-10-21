import React, { useState, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead } from "@/components/SEOHead";
import { getSEOConfig } from "@/lib/seo-config";
import { getArticleSchema, getBreadcrumbSchema } from "@/lib/structured-data";
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Filter,
  Clock,
  Target,
  AlertTriangle,
  Eye,
  Activity,
  BarChart3,
  Calculator,
  Copy,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { useNavigate } from "react-router-dom";
import TradingDisclaimer from "@/components/ui/trading-disclaimer";
import { useObservability, withPageTracking } from "@/components/business/ObservabilityProvider";
import { useSignals, useSignalsPerformance } from "@/hooks/useSignals";
import { toast } from "@/hooks/use-toast";

// Memoized signal card for performance
const SignalCard = memo(
  ({ signal, getStatusColor, getTypeIcon, calculatePipsFromPrice, navigate, trackInteraction, t }: any) => (
    <Card className="border-line bg-surface hover:shadow-glow-subtle transition-all w-full">
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
              {getTypeIcon(signal.type)}
              <div className="min-w-0 flex-1">
                <CardTitle className="text-foreground text-sm sm:text-lg leading-tight">
                  {signal.instrument} - {signal.type}
                </CardTitle>
                <CardDescription className="text-muted-foreground text-[11px] sm:text-sm">
                  {signal.timeframe} • {signal.author}
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-teal text-teal text-[10px] sm:text-xs shrink-0 whitespace-nowrap px-1.5 sm:px-2.5">
              RR 1:{parseInt(signal.rr)}
            </Badge>
          </div>
          <Badge className={`${getStatusColor(signal.status)} w-fit text-[10px] sm:text-xs px-2 py-0.5`}>
            {t(`signals:signal.status.${signal.status.toLowerCase().replace(/ /g, "_")}`) || signal.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-3 sm:px-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Price levels - Always visible */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full">
            <div className="bg-surface/50 p-1.5 sm:p-2 rounded-lg border border-line/50">
              <span className="text-muted-foreground block text-[10px] sm:text-xs mb-0.5 sm:mb-1">
                {t("signals:signal.entry")}
              </span>
              <div className="font-mono font-semibold text-foreground text-[11px] sm:text-sm">
                {signal.entry.toFixed(5)}
              </div>
            </div>
            <div className="bg-surface/50 p-1.5 sm:p-2 rounded-lg border border-destructive/20">
              <span className="text-muted-foreground block text-[10px] sm:text-xs mb-0.5 sm:mb-1">
                {t("signals:signal.stop_loss")}
              </span>
              <div className="font-mono font-semibold text-destructive text-[11px] sm:text-sm">{signal.sl.toFixed(5)}</div>
            </div>
            <div className="bg-surface/50 p-1.5 sm:p-2 rounded-lg border border-success/20">
              <span className="text-muted-foreground block text-[10px] sm:text-xs mb-0.5 sm:mb-1">
                {t("signals:signal.take_profit")}
              </span>
              <div className="font-mono font-semibold text-success text-[11px] sm:text-sm">{signal.tp.toFixed(5)}</div>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-[11px] sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">{signal.publishedAt}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3 sm:h-4 sm:w-4" />
              {t("signals:signal.confidence")}: {signal.confidence}%
            </div>
          </div>

          {/* Analysis sections */}
          <div>
            <h4 className="font-semibold text-foreground mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-teal" />
              {t("signals:signal.analysis_logic")}
            </h4>
            <p className="text-[11px] sm:text-sm text-muted-foreground leading-relaxed break-words">{signal.logic}</p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-warning" />
              {t("signals:signal.invalidation")}
            </h4>
            <p className="text-[11px] sm:text-sm text-muted-foreground break-words">{signal.invalidation}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-line">
          <Button
            className="bg-teal hover:bg-teal/90 text-white w-full text-xs sm:text-sm h-9 sm:h-10"
            size="sm"
            onClick={() => {
              const { sl_pips, tp_pips } = calculatePipsFromPrice(
                signal.entry,
                signal.sl,
                signal.tp,
                signal.instrument,
              );
              trackInteraction("signal_card", "open_in_tools_click", {
                signal_id: signal.id,
                instrument: signal.instrument,
                type: signal.type,
              });
              navigate(
                `/tools?calc=position-size&symbol=${signal.instrument}&dir=${signal.type}&entry=${signal.entry}&sl_pips=${sl_pips}&tp_pips=${tp_pips}`,
              );
            }}
          >
            <Calculator className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Calcular
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-line w-full text-xs sm:text-sm h-9 sm:h-10"
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
                  published_at: signal.publishedAt,
                };
                navigator.clipboard.writeText(JSON.stringify(jsonPayload, null, 2));
                toast({ title: "JSON copiado", description: "Los datos de la señal se copiaron al portapapeles" });
                trackInteraction("signal_card", "copy_json", { signal_id: signal.id, instrument: signal.instrument });
              }}
            >
              <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Copiar JSON</span>
              <span className="sm:hidden">JSON</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-teal text-teal hover:bg-teal/10 w-full text-xs sm:text-sm h-9 sm:h-10"
              onClick={() =>
                trackInteraction("signal_card", "view_full_analysis", {
                  signal_id: signal.id,
                  signal_type: signal.type,
                  instrument: signal.instrument,
                })
              }
              aria-label={`Ver análisis completo de ${signal.instrument}`}
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{t("signals:signal.view_full_analysis")}</span>
              <span className="sm:hidden">Análisis</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
);
SignalCard.displayName = "SignalCard";

const Signals = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["signals"]);
  const { trackInteraction, trackBusinessEvent } = useObservability();
  const { signals, loading, error } = useSignals();
  const { performance, loading: perfLoading } = useSignalsPerformance();
  const [filters, setFilters] = useState({
    market: "all",
    timeframe: "all",
    minRR: "all",
  });

  const seoConfig = getSEOConfig("signals", i18n.language);
  const structuredData = [
    getArticleSchema(
      "Señales de Trading en Tiempo Real",
      "Señales profesionales verificadas con análisis técnico completo",
      new Date().toISOString(),
    ),
    getBreadcrumbSchema([
      { name: "Inicio", url: "https://talamo.app/" },
      { name: "Señales", url: "https://talamo.app/signals" },
    ]),
  ];

  // Track page view and signal interactions
  React.useEffect(() => {
    trackBusinessEvent("signal_viewed", {
      page: "signals_list",
      filters_active: Object.values(filters).some((f) => f !== "all"),
    });
  }, [trackBusinessEvent, filters]);

  // Memoize filtered signals
  const filteredSignals = useMemo(() => {
    return signals.filter((signal) => {
      if (filters.market !== "all" && signal.instrument !== filters.market) return false;
      if (filters.timeframe !== "all" && signal.timeframe !== filters.timeframe) return false;
      if (filters.minRR !== "all" && signal.rr < parseFloat(filters.minRR)) return false;
      return true;
    });
  }, [signals, filters]);

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      Activa: "bg-teal/20 text-teal border-teal/30",
      Active: "bg-teal/20 text-teal border-teal/30",
      Ativo: "bg-teal/20 text-teal border-teal/30",
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
    return type === "LONG" ? (
      <TrendingUp className="h-4 w-4 text-success" />
    ) : (
      <TrendingDown className="h-4 w-4 text-destructive" />
    );
  };

  const calculatePipsFromPrice = (
    entry: number,
    sl: number,
    tp: number,
    symbol: string,
  ): { sl_pips: number; tp_pips: number } => {
    const pipValue = symbol.includes("JPY") ? 0.01 : 0.0001;
    return {
      sl_pips: Math.abs(Math.round((entry - sl) / pipValue)),
      tp_pips: Math.abs(Math.round((tp - entry) / pipValue)),
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
      <div className="overflow-x-hidden w-full">
        <SEOHead
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonicalPath="/signals"
        type="article"
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <PageHero
        module="signals"
        title={t("signals:title")}
        subtitle={t("signals:subtitle")}
        subtitleHighlight="análisis profesional verificado"
        badge={{
          icon: Activity,
          text: "Señales Verificadas",
          pulse: true,
        }}
        features={[
          { icon: Activity, text: "Tiempo Real" },
          { icon: Target, text: "R:R Optimizado" },
          { icon: BarChart3, text: "Análisis Verificado" },
        ]}
      />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Filters */}
        <Card className="border-line bg-surface mb-4 sm:mb-6">
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
            <CardTitle className="text-foreground flex items-center gap-2 text-sm sm:text-lg">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-teal" />
              {t("signals:filters.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2 block">
                  {t("signals:filters.market")}
                </label>
                <Select value={filters.market} onValueChange={(value) => setFilters({ ...filters, market: value })}>
                  <SelectTrigger className="bg-input border-line h-9 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("signals:filters.all_markets")}</SelectItem>
                    <SelectItem value="XAUUSD">XAUUSD</SelectItem>
                    <SelectItem value="EURUSD">EURUSD</SelectItem>
                    <SelectItem value="GBPJPY">GBPJPY</SelectItem>
                    <SelectItem value="USDCAD">USDCAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2 block">
                  {t("signals:filters.timeframe")}
                </label>
                <Select
                  value={filters.timeframe}
                  onValueChange={(value) => setFilters({ ...filters, timeframe: value })}
                >
                  <SelectTrigger className="bg-input border-line h-9 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("signals:filters.all_timeframes")}</SelectItem>
                    <SelectItem value="M15">M15</SelectItem>
                    <SelectItem value="H1">H1</SelectItem>
                    <SelectItem value="H4">H4</SelectItem>
                    <SelectItem value="D1">D1</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2 block">
                  {t("signals:filters.min_rr")}
                </label>
                <Select value={filters.minRR} onValueChange={(value) => setFilters({ ...filters, minRR: value })}>
                  <SelectTrigger className="bg-input border-line h-9 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("signals:filters.any_rr")}</SelectItem>
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
        <div className="space-y-4 sm:space-y-6">
          {filteredSignals.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              getStatusColor={getStatusColor}
              getTypeIcon={getTypeIcon}
              calculatePipsFromPrice={calculatePipsFromPrice}
              navigate={navigate}
              trackInteraction={trackInteraction}
              t={t}
            />
          ))}
        </div>

        {filteredSignals.length === 0 && (
          <Card className="border-line bg-surface">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">{t("signals:empty")}</p>
              <Button
                variant="outline"
                onClick={() => setFilters({ market: "all", timeframe: "all", minRR: "all" })}
                className="mt-4 border-teal text-teal hover:bg-teal/10"
              >
                {t("signals:clear_filters")}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Historical Performance */}
        <Card className="border-line bg-surface mt-8">
          <CardHeader>
            <CardTitle className="text-foreground">{t("signals:performance.title")}</CardTitle>
            <CardDescription className="text-muted-foreground">{t("signals:performance.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            {perfLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal">{performance?.winRate || 0}%</div>
                  <div className="text-sm text-muted-foreground">{t("signals:performance.win_rate")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal">{performance?.avgRr || 0}</div>
                  <div className="text-sm text-muted-foreground">{t("signals:performance.avg_rr")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal">{performance?.totalSignals || 0}</div>
                  <div className="text-sm text-muted-foreground">{t("signals:performance.published_signals")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal">
                    {performance?.simulatedReturn >= 0 ? "+" : ""}
                    {performance?.simulatedReturn || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">{t("signals:performance.simulated_return")}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risk Warning */}
        <TradingDisclaimer variant="full" context="signals" showCollapsible={true} className="mt-8" />
      </div>
      </div>
    </div>
  );
};

export default withPageTracking(Signals, "signals");
