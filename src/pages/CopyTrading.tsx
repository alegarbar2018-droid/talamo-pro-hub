import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Shield, TrendingUp, Users, Sparkles, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TradingDisclaimer } from "@/components/ui/trading-disclaimer";
import { withPageTracking } from "@/components/business/ObservabilityProvider";
import { useObservability } from "@/components/business/ObservabilityProvider";
import { supabase } from "@/integrations/supabase/client";
import { CopyStrategy, StrategyRecommendation } from "@/modules/copy/types";
import { CopyTradingIntro } from "@/components/copy/CopyTradingIntro";
import { StrategyEvaluationGuide } from "@/components/copy/StrategyEvaluationGuide";
import { StrategyCard } from "@/components/copy/StrategyCard";
import { StrategyDetailModal } from "@/components/copy/StrategyDetailModal";
import { InvestorProfileWizard } from "@/components/copy/InvestorProfileWizard";
import { FundingInstructionsCard } from "@/components/copy/FundingInstructionsCard";
import { Skeleton } from "@/components/ui/skeleton";

function CopyTrading() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { trackEvent } = useObservability();
  const [strategies, setStrategies] = useState<CopyStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState<CopyStrategy | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<StrategyRecommendation[]>([]);

  useEffect(() => {
    fetchStrategies();
    trackEvent('page_viewed', { page_name: 'copy_trading' });
  }, []);

  const fetchStrategies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('copy_strategies')
        .select('*')
        .eq('status', 'active')
        .order('total_return_percentage', { ascending: false });

      if (error) throw error;
      setStrategies((data || []) as CopyStrategy[]);
    } catch (error) {
      console.error('Error fetching strategies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (strategy: CopyStrategy) => {
    setSelectedStrategy(strategy);
    setIsDetailModalOpen(true);
    trackEvent('strategy_viewed', { strategy_id: strategy.id });
  };

  const handleRecommendations = (recs: StrategyRecommendation[]) => {
    setRecommendations(recs);
    setIsWizardOpen(false);
    trackEvent('profile_completed', { recommendations_count: recs.length });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 border-b border-primary/10">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute top-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4 py-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-6 gap-2 hover:gap-3 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t("copy.back_to_dashboard")}
          </Button>

          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {t("copy.subtitle")}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              {t("copy.title")}
            </h1>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <div className="font-semibold">Verified Traders</div>
                  <div className="text-sm text-muted-foreground">Proven track records</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                <TrendingUp className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <div className="font-semibold">Transparent</div>
                  <div className="text-sm text-muted-foreground">Full history visible</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                <Users className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <div className="font-semibold">Control Total</div>
                  <div className="text-sm text-muted-foreground">You decide everything</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        <CopyTradingIntro />

        <div className="flex justify-center">
          <Button size="lg" onClick={() => setIsWizardOpen(true)} className="gap-2">
            <UserCircle className="w-5 h-5" />
            {t("copy.wizard.title")}
          </Button>
        </div>

        <StrategyEvaluationGuide />

        <div>
          <h2 className="text-2xl font-bold mb-6">Available Strategies</h2>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-96" />)}
            </div>
          ) : strategies.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No active strategies available
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {strategies.map(strategy => (
                <StrategyCard 
                  key={strategy.id} 
                  strategy={strategy}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>

        <FundingInstructionsCard />
        <TradingDisclaimer />
      </div>

      <StrategyDetailModal 
        strategy={selectedStrategy}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <InvestorProfileWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        strategies={strategies}
        onRecommendationsReady={handleRecommendations}
      />
    </div>
  );
}

export default withPageTracking(CopyTrading, 'CopyTrading');
