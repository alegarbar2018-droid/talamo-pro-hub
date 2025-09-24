import React from 'react';
import BusinessMetricsDashboard from '@/components/business/BusinessMetricsDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isFeatureEnabled } from '@/lib/flags';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { PermissionGuard } from '@/components/admin/PermissionGuard';

export const AdminAnalytics: React.FC = () => {
  return (
    <PermissionGuard 
      resource="analytics" 
      action="read" 
      requiredRoles={['ADMIN', 'ANALYST']}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analíticas y Observabilidad</h1>
          <p className="text-muted-foreground">
            Dashboard de métricas de negocio y observabilidad del sistema
          </p>
        </div>
        
        {!isFeatureEnabled('obs_v1') ? (
          <>
            <Alert className="border-warning/20 bg-warning/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                El módulo de observabilidad no está habilitado. Para activar las métricas de negocio, 
                habilite la feature flag 'obs_v1' en la configuración del sistema.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Módulo de Observabilidad</CardTitle>
                <CardDescription>
                  Este dashboard proporciona métricas en tiempo real sobre el rendimiento del negocio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">North Star Metric (NSM)</h4>
                      <p className="text-sm text-muted-foreground">
                        Traders activos en los últimos 30 días con métricas de retención
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Embudo de Afiliación</h4>
                      <p className="text-sm text-muted-foreground">
                        Métricas de conversión, latencia y tasa de error del proceso de validación
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">KPIs de Negocio</h4>
                      <p className="text-sm text-muted-foreground">
                        ARPT, R30/R90, LTV/CAC y alertas automáticas
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Alertas en Tiempo Real</h4>
                      <p className="text-sm text-muted-foreground">
                        Notificaciones automáticas para anomalías y umbrales críticos
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <BusinessMetricsDashboard />
        )}
      </div>
    </PermissionGuard>
  );
};