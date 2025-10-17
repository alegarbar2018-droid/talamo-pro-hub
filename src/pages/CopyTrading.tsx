import React, { useState, memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TradingDisclaimer from "@/components/ui/trading-disclaimer";
import { withPageTracking } from '@/components/business/ObservabilityProvider';
import { SEOHead } from "@/components/SEOHead";
import { getSEOConfig } from "@/lib/seo-config";
import { getBreadcrumbSchema } from "@/lib/structured-data";
import { 
  CopyTradingIntro, 
  StrategyEvaluationGuide, 
  InvestorProfileWizard,
  FundingInstructions,
  StrategyCard
} from '@/components/copy';
import type { CopyStrategy, StrategyAllocation } from '@/modules/copy/types';
import { User, ArrowLeft, Sparkles } from 'lucide-react';

// Memoize strategy card to prevent unnecessary re-renders
const MemoizedStrategyCard = memo(StrategyCard);

const CopyTrading: React.FC = () => {
  const { t, i18n } = useTranslation(['copy', 'common']);
  const navigate = useNavigate();
  const location = useLocation();
  
  const seoConfig = getSEOConfig('copyTrading', i18n.language);
  const structuredData = getBreadcrumbSchema([
    { name: "Inicio", url: "https://talamo.app/" },
    { name: "Copy Trading", url: "https://talamo.app/copy-trading" }
  ]);
  
  // Recuperar recomendaciones del estado de navegación
  const recommendedAllocations = location.state?.recommendedAllocations as StrategyAllocation[] | undefined;
  const showWelcome = location.state?.showWelcome as boolean | undefined;
  
  const [wizardOpen, setWizardOpen] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(!!recommendedAllocations);
  
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
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - strategies don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Track page view
  React.useEffect(() => {
    console.log('Copy Trading page viewed', { strategies_count: strategies.length });
  }, [strategies.length]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonicalPath="/copy-trading"
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-line/50 bg-gradient-to-br from-background via-teal/5 to-primary/5">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="mb-6 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>

          <div className="space-y-6 max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal/20 via-teal/10 to-transparent border border-teal/30 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span className="text-sm font-medium text-teal">Copy Trading Profesional</span>
            </div>
            
            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                Copy Trading
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-light max-w-3xl">
                Sigue estrategias de traders verificados y diversifica tu cartera con{" "}
                <span className="text-teal font-medium">gestión profesional</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Alert para nuevos usuarios del flujo inversor */}
        {showWelcome && recommendedAllocations && (
          <Alert className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/30">
            <Sparkles className="h-5 w-5 text-primary" />
            <AlertTitle className="text-lg font-bold">¡Bienvenido a Copy Trading!</AlertTitle>
            <AlertDescription className="text-base">
              Aquí están las {recommendedAllocations.length} estrategias recomendadas según tu perfil de inversionista.
              Revisa cada una y decide cómo distribuir tu capital.
            </AlertDescription>
          </Alert>
        )}

        {/* Estrategias Recomendadas - Destacadas */}
        {showRecommendations && recommendedAllocations && recommendedAllocations.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Recomendadas para Ti
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRecommendations(false)}
              >
                Ver todo el catálogo
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recommendedAllocations.map((allocation) => (
                <div key={allocation.strategy.id} className="relative">
                  {/* Badge de recomendado */}
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      ${allocation.suggested_amount}
                    </div>
                  </div>
                  <div className="ring-2 ring-primary/50 rounded-lg">
                    <MemoizedStrategyCard strategy={allocation.strategy} />
                  </div>
                  {allocation.reason && (
                    <p className="mt-2 text-xs text-muted-foreground italic">
                      💡 {allocation.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center">
                👇 Explora más estrategias en el catálogo completo
              </p>
            </div>
          </section>
        )}
        
        {/* A. Intro + Diversificación */}
        {!showRecommendations && <CopyTradingIntro />}
        
        {/* B. Acordeón Evaluación */}
        <StrategyEvaluationGuide />
        
        {/* C. Botón Wizard */}
        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={() => setWizardOpen(true)}
            className="gap-2"
          >
            <User className="h-5 w-5" />
            {t('copy:wizard.actions.profile_button')}
          </Button>
        </div>
        
        <TradingDisclaimer variant="compact" />

        {/* D. Catálogo de Estrategias */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {showRecommendations ? 'Todas las Estrategias Disponibles' : t('copy:catalog.title')}
          </h2>
          
          {isLoading ? (
            <p className="text-center text-muted-foreground py-12">{t('copy:catalog.loading')}</p>
          ) : strategies.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">{t('copy:catalog.empty')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {strategies.map((strategy) => (
                <MemoizedStrategyCard key={strategy.id} strategy={strategy} />
              ))}
            </div>
          )}
        </div>

        {/* E. Instrucciones de Fondeo */}
        <FundingInstructions />
        
        <TradingDisclaimer variant="full" />
      </div>
      
      {/* Modals */}
      <InvestorProfileWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={(allocations) => {
          console.log('Allocations:', allocations);
          setWizardOpen(false);
        }}
      />
    </div>
  );
};

export default withPageTracking(CopyTrading, 'copy-trading');
