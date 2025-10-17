import { Shield, TrendingUp, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ValueProposition() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="py-20 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4">
        {/* Main heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('landing:value_title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('landing:value_subtitle')}
          </p>
        </div>

        {/* Three pillars */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Pillar 1 */}
          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {t('landing:value_pillar1_title')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('landing:value_pillar1_desc')}
            </p>
            <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
              {t('landing:value_pillar1_proof')}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {t('landing:value_pillar2_title')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('landing:value_pillar2_desc')}
            </p>
            <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
              {t('landing:value_pillar2_proof')}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {t('landing:value_pillar3_title')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('landing:value_pillar3_desc')}
            </p>
            <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
              {t('landing:value_pillar3_proof')}
            </p>
          </div>
        </div>

        {/* IB Model Note */}
        <div className="max-w-3xl mx-auto mb-12 bg-muted/30 border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-center">
            {t('landing:value_ib_note')}{' '}
            <a 
              href="https://www.investopedia.com/terms/i/introducingbroker.asp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              {t('landing:value_ib_learn')} <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            onClick={() => navigate('/auth/validate')}
          >
            {t('landing:exness_have')}
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => navigate('/onboarding')}
          >
            {t('landing:cta_access')}
          </Button>
        </div>
      </div>
    </section>
  );
}
