import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useObservability } from '@/components/business/ObservabilityProvider';
import { InvestorProfileWizardSimple } from '@/components/copy/InvestorProfileWizardSimple';
import { CopyTradingIntroSimple } from '@/components/copy/CopyTradingIntroSimple';
import { SafetySection } from '@/components/copy/SafetySection';
import { RealisticExpectations } from '@/components/copy/RealisticExpectations';
import TradingDisclaimer from '@/components/ui/trading-disclaimer';
import Navigation from '@/components/Navigation';
import type { StrategyAllocation } from '@/modules/copy/types';

export default function CopyInfo() {
  const navigate = useNavigate();
  const { t } = useTranslation(['copy', 'common']);
  const { trackPageView } = useObservability();
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    document.title = "Copy Trading — Información para Inversionistas";
    trackPageView("copy-info");
    window.scrollTo(0, 0);
  }, [trackPageView]);

  const handleWizardComplete = (allocations: StrategyAllocation[]) => {
    console.log('Allocations completed:', allocations);
    // El wizard se encarga de la redirección apropiada
    // Si el usuario no está autenticado, irá a /onboarding?flow=investor
    // Si está autenticado, irá a /copy-trading
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-background">
        <div className="container mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common:back', { defaultValue: 'Volver' })}
          </Button>

          <div className="text-center space-y-4">
            <Badge variant="secondary" className="mb-2">
              {t('copy:simple.hero.badge')}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {t('copy:simple.hero.title')}
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('copy:simple.hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => setWizardOpen(true)}
                className="gap-2"
              >
                <TrendingUp className="h-5 w-5" />
                {t('copy:simple.hero.cta_primary')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="gap-2"
              >
                <GraduationCap className="h-5 w-5" />
                {t('copy:simple.hero.cta_secondary')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4">
        <div id="how-it-works">
          <CopyTradingIntroSimple />
        </div>

        <SafetySection />

        <RealisticExpectations />

        {/* CTA Section */}
        <section className="py-12 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold">¿Listo para empezar?</h2>
            <p className="text-lg text-muted-foreground">
              Completa tu perfil de inversionista en 3 minutos y recibe recomendaciones personalizadas
            </p>
            <Button
              size="lg"
              onClick={() => setWizardOpen(true)}
              className="gap-2"
            >
              <TrendingUp className="h-5 w-5" />
              {t('copy:simple.hero.cta_primary')}
            </Button>
            <div className="pt-4">
              <Button
                variant="link"
                onClick={() => navigate('/copy-trading')}
                className="text-sm"
              >
                ¿Eres trader experimentado? Ver catálogo completo →
              </Button>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="py-6">
          <TradingDisclaimer variant="full" context="copy-trading" />
        </div>
      </div>

      {/* Wizard Modal */}
      <InvestorProfileWizardSimple
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={handleWizardComplete}
      />
    </div>
  );
}
