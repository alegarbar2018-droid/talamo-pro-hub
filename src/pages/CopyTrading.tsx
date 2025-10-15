import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import TradingDisclaimer from "@/components/ui/trading-disclaimer";
import { withPageTracking } from '@/components/business/ObservabilityProvider';
import { useObservability } from '@/components/business/ObservabilityProvider';
import { 
  CopyTradingIntro, 
  StrategyEvaluationGuide, 
  InvestorProfileWizard,
  AffiliationGateBlock 
} from '@/components/copy';
import type { CopyStrategy } from '@/modules/copy/types';

const CopyTrading: React.FC = () => {
  const { t } = useTranslation();
  const { trackEvent } = useObservability();
  
  const [wizardOpen, setWizardOpen] = useState(false);
  
  // Fetch estrategias publicadas
  const { data: strategies = [], isLoading } = useQuery({
    queryKey: ['copy-strategies-published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('copy_strategies' as any)
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as any[] as CopyStrategy[];
    }
  });

  // Track page view
  React.useEffect(() => {
    // Simplificado para evitar error de tipos
    console.log('Copy Trading page viewed', { strategies_count: strategies.length });
  }, [strategies.length]);

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
          <div className="space-y-6 max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal/20 via-teal/10 to-transparent border border-teal/30 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span className="text-sm font-medium text-teal">Copy Trading Profesional</span>
            </div>
            
            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                Copy Trading
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl">
                Sigue estrategias de traders verificados y diversifica tu cartera con{" "}
                <span className="text-teal font-medium">gestión profesional</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* A. Intro + Diversificación */}
        <CopyTradingIntro />
        
        {/* B. Acordeón Evaluación */}
        <StrategyEvaluationGuide />
        
        {/* C. Botón Wizard */}
        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={() => setWizardOpen(true)}
            className="gap-2"
          >
            {t('copy.wizard.actions.profile_button')}
          </Button>
        </div>
        
        <TradingDisclaimer variant="compact" />

        {/* D. Catálogo de Estrategias */}
        <div>
          <h2 className="text-2xl font-bold mb-4">{t('copy.catalog.title')}</h2>
          
          {isLoading ? (
            <p className="text-center text-muted-foreground py-12">{t('copy.catalog.loading')}</p>
          ) : strategies.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">{t('copy.catalog.empty')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {strategies.map((strategy) => (
                <div key={strategy.id} className="p-4 border border-line rounded-lg bg-surface/50">
                  <h3 className="font-semibold text-lg mb-2">{strategy.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{strategy.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('copy.strategy_card.min_investment')}:</span>
                      <span className="font-medium">${strategy.min_investment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('copy.strategy_card.fee')}:</span>
                      <span className="font-medium">{strategy.performance_fee_pct}%</span>
                    </div>
                    {strategy.profit_factor && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">PF:</span>
                        <span className="font-medium">{strategy.profit_factor}x</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full mt-4"
                    onClick={() => window.open(strategy.external_link, '_blank')}
                  >
                    {t('copy.strategy_card.follow')}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* F. Disclaimers + Gating */}
        <AffiliationGateBlock />
        
        <TradingDisclaimer variant="full" />
      </div>
      
      {/* Modals */}
      <InvestorProfileWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={(allocations) => {
          console.log('Allocations:', allocations);
          // TODO: Mostrar modal con resultados o navegar
        }}
      />
    </div>
  );
};

export default withPageTracking(CopyTrading, 'copy-trading');
