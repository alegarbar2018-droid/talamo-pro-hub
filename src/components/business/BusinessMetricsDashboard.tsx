/**
 * BusinessMetricsDashboard Component
 * 
 * Real-time business metrics dashboard for admin users.
 * Shows NSM, ARPT, R30/R90, and affiliation funnel metrics.
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign, 
  Activity,
  AlertTriangle,
  RefreshCw,
  Clock,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useObservability } from './ObservabilityProvider';
import { isFeatureEnabled } from '@/lib/flags';

interface MetricsData {
  active_traders_30d: number;
  arpt: number;
  r30: number;
  r90: number;
  ltv_cac_ratio: number;
  funnel: {
    total_checks: number;
    successful_validations: number;
    conversion_rate: number;
    avg_latency_ms: number;
    error_rate: number;
    p95_latency: number;
  };
  alerts: Array<{
    type: string;
    severity: 'warning' | 'critical';
    message: string;
    value: number;
    threshold: number;
  }>;
}

const BusinessMetricsDashboard = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { trackInteraction, trackBusinessEvent } = useObservability();

  const fetchMetrics = async () => {
    if (!isFeatureEnabled('obs_v1')) {
      setError('Observability module not enabled');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await supabase.functions.invoke('business-metrics', {
        body: { action: 'get_dashboard' }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setMetrics(response.data?.data || null);
      setLastUpdate(new Date());
      setError(null);

      trackBusinessEvent('admin_dashboard_viewed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    trackInteraction('refresh_button', 'click', { dashboard: 'business_metrics' });
    fetchMetrics();
  };

  const getMetricTrend = (current: number, target: number) => {
    const percentage = ((current - target) / target) * 100;
    return {
      isPositive: current >= target,
      percentage: Math.abs(percentage)
    };
  };

  const getSeverityColor = (severity: 'warning' | 'critical') => {
    return severity === 'critical' 
      ? 'bg-destructive/20 text-destructive border-destructive/30'
      : 'bg-warning/20 text-warning border-warning/30';
  };

  if (!isFeatureEnabled('obs_v1')) {
    return (
      <Alert className="border-warning/20 bg-warning/10">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          El módulo de observabilidad no está habilitado. Habilite 'obs_v1' para ver las métricas.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert className="border-destructive/20 bg-destructive/10">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Error loading metrics: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Métricas de Negocio</h2>
          <p className="text-muted-foreground">
            Dashboard en tiempo real - Última actualización: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Alerts Section */}
      {metrics?.alerts && metrics.alerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Alertas Activas ({metrics.alerts.length})
          </h3>
          <div className="grid gap-3">
            {metrics.alerts.map((alert, index) => (
              <Alert key={index} className={getSeverityColor(alert.severity)}>
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span>{alert.message}</span>
                    <Badge variant="outline" className="ml-2">
                      {alert.value.toFixed(1)} / {alert.threshold}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* North Star Metric */}
      <Card className="border-teal/30 bg-teal/5">
        <CardHeader>
          <CardTitle className="text-teal flex items-center gap-2">
            <Target className="h-5 w-5" />
            North Star Metric (NSM)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">
                {metrics?.active_traders_30d?.toLocaleString() || '---'}
              </div>
              <div className="text-muted-foreground">Traders activos (30 días)</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Target: 1,000</div>
              {metrics?.active_traders_30d && (
                <div className={`text-sm flex items-center gap-1 ${
                  metrics.active_traders_30d >= 1000 ? 'text-success' : 'text-warning'
                }`}>
                  {metrics.active_traders_30d >= 1000 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {((metrics.active_traders_30d / 1000) * 100).toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-teal" />
              ARPT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${metrics?.arpt?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">Average Revenue Per Trader</p>
            <div className="text-xs text-warning mt-1">Placeholder - Integration pendiente</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-teal" />
              R30
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics?.r30?.toFixed(1) || '0.0'}%
            </div>
            <p className="text-xs text-muted-foreground">30-day Retention Rate</p>
            <Progress 
              value={metrics?.r30 || 0} 
              className="h-1 mt-2" 
            />
            <div className="text-xs text-muted-foreground mt-1">Target: 70%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-teal" />
              R90
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics?.r90?.toFixed(1) || '0.0'}%
            </div>
            <p className="text-xs text-muted-foreground">90-day Retention Rate</p>
            <Progress 
              value={metrics?.r90 || 0} 
              className="h-1 mt-2" 
            />
            <div className="text-xs text-muted-foreground mt-1">Target: 50%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-teal" />
              LTV/CAC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics?.ltv_cac_ratio?.toFixed(1) || '0.0'}x
            </div>
            <p className="text-xs text-muted-foreground">Lifetime Value / Customer Acquisition</p>
            <div className="text-xs text-warning mt-1">Placeholder - Integration pendiente</div>
          </CardContent>
        </Card>
      </div>

      {/* Affiliation Funnel Metrics */}
      {metrics?.funnel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-teal" />
              Embudo de Afiliación (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {metrics.funnel.total_checks}
                </div>
                <div className="text-sm text-muted-foreground">Total Validaciones</div>
              </div>

              <div className="space-y-2">
                <div className="text-2xl font-bold text-success">
                  {metrics.funnel.successful_validations}
                </div>
                <div className="text-sm text-muted-foreground">Exitosas</div>
              </div>

              <div className="space-y-2">
                <div className="text-2xl font-bold text-teal">
                  {metrics.funnel.conversion_rate.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Tasa de Conversión</div>
                <Progress value={metrics.funnel.conversion_rate} className="h-1" />
              </div>

              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {metrics.funnel.avg_latency_ms}ms
                </div>
                <div className="text-sm text-muted-foreground">Latencia Promedio</div>
              </div>

              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {metrics.funnel.p95_latency}ms
                </div>
                <div className="text-sm text-muted-foreground">P95 Latencia</div>
                <div className={`text-xs ${
                  metrics.funnel.p95_latency > 2500 ? 'text-warning' : 'text-success'
                }`}>
                  Target: &lt;2500ms
                </div>
              </div>

              <div className="space-y-2">
                <div className={`text-2xl font-bold ${
                  metrics.funnel.error_rate > 5 ? 'text-destructive' : 'text-success'
                }`}>
                  {metrics.funnel.error_rate.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Tasa de Error</div>
                <div className="text-xs text-muted-foreground">Target: &lt;5%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Auto-refresh indicator */}
      <div className="flex items-center justify-center text-xs text-muted-foreground">
        <Clock className="h-3 w-3 mr-1" />
        Actualización automática cada 30 segundos
      </div>
    </div>
  );
};

export default BusinessMetricsDashboard;