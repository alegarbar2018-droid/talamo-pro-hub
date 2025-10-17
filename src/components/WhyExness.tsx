import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Shield, Zap, ExternalLink, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function WhyExness() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="py-20 relative overflow-hidden bg-background">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 bg-grid-white/[0.01] -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-foreground text-sm font-medium">
            <Info className="w-4 h-4" />
            {t('landing:exness_requirement')}
          </span>
        </div>

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            {t('landing:why_exness_title')}
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
            {t('landing:why_exness_subtitle')}
          </p>
          
          {/* IB Model Explanation */}
          <div className="bg-muted/50 border border-border rounded-lg p-6 text-left mt-8">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              {t('landing:ib_model_title')}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('landing:ib_model_explanation')}
            </p>
            <p className="text-sm text-muted-foreground italic">
              {t('landing:ib_model_disclaimer')}
            </p>
          </div>
        </div>

        {/* Verifiable Facts Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl flex items-center gap-2">
                {t('landing:exness_spreads_title')}
                <a 
                  href="https://www.exness.com/accounts/account-types/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              {t('landing:exness_spreads_desc')}
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl flex items-center gap-2">
                {t('landing:exness_regulation_title')}
                <a 
                  href="https://www.exness.com/about-exness/regulation/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              {t('landing:exness_regulation_desc')}
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl flex items-center gap-2">
                {t('landing:exness_withdrawals_title')}
                <a 
                  href="https://www.exness.com/deposit-and-withdraw/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              {t('landing:exness_withdrawals_desc')}
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            {t('landing:exness_cta_prompt')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/exness-redirect?flow=create')}
            >
              {t('landing:exness_create')}
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/auth/validate')}
            >
              {t('landing:exness_have')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
