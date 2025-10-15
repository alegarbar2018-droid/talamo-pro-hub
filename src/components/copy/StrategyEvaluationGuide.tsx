import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { TrendingUp, AlertTriangle, BarChart3, Activity, CheckCircle, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const StrategyEvaluationGuide = () => {
  const { t } = useTranslation(['copy']);
  
  const metrics = [
    {
      id: 'pf',
      title: 'Profit Factor (PF)',
      icon: TrendingUp,
      content: 'Relación entre ganancias brutas y pérdidas brutas. PF > 1.5 indica gestión sólida. No es garantía, es histórico. Combina con otros KPIs.'
    },
    {
      id: 'dd',
      title: 'Drawdown (DD)',
      icon: AlertTriangle,
      content: 'Caída máxima desde un pico. DD < 15% = conservador; 15-25% = moderado; >25% = agresivo. Define tu límite de exposición antes de copiar.'
    },
    {
      id: 'consistency',
      title: 'Consistencia (% Meses Verdes)',
      icon: CheckCircle,
      content: 'Porcentaje de meses rentables. >70% sugiere disciplina. Mira distribución de retornos, no solo promedio.'
    },
    {
      id: 'cagr',
      title: 'CAGR / Curva de Rendimiento',
      icon: BarChart3,
      content: 'CAGR = tasa de crecimiento anual compuesta. Curva suave > spikes erráticos. Busca crecimiento sostenible.'
    },
    {
      id: 'rules',
      title: 'Reglas y Gestión de Riesgo',
      icon: Shield,
      content: 'Lee las reglas del trader: límites de exposición, stop-loss, tamaño de posición. Estrategia sin reglas = red flag.'
    },
    {
      id: 'correlation',
      title: 'Correlación de Símbolos',
      icon: Activity,
      content: 'Evita copiar múltiples estrategias que operen los mismos pares. Diversifica por símbolos para reducir riesgo concentrado.'
    }
  ];
  
  return (
    <Card className="border-line bg-surface/50">
      <Accordion type="single" collapsible className="px-6">
        <AccordionItem value="evaluation" className="border-none">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">
            <span className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {t('copy:evaluation.title')}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2 pb-4">
              <p className="text-sm text-muted-foreground">
                {t('copy:evaluation.subtitle')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.id} className="p-3 rounded-lg bg-surface border border-line">
                      <div className="flex items-start gap-2 mb-2">
                        <Icon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <h4 className="text-sm font-semibold text-foreground">{metric.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{metric.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
