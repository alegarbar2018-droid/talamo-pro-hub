import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Activity, Shield, Zap, ExternalLink, Award, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function WhyExness() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      {/* Premium decorative elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold backdrop-blur-sm">
            <Award className="w-4 h-4" />
            {t('landing:due_diligence_badge')}
          </span>
        </div>

        {/* Heading */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
            {t('landing:why_exness_title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t('landing:why_exness_subtitle')}
          </p>
        </div>

        {/* Due Diligence Explanation Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                {t('landing:due_diligence_title')}
              </CardTitle>
              <CardDescription className="text-base leading-relaxed pt-2">
                {t('landing:due_diligence_explanation')}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Professional Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="group bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-xl flex items-center justify-between">
                {t('landing:exness_liquidity_title')}
                <a 
                  href="https://www.exness.com/accounts/account-types/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                  aria-label="Ver tipos de cuenta"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {t('landing:exness_liquidity_desc')}
              </p>
            </CardContent>
          </Card>

          <Card className="group bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-xl flex items-center justify-between">
                {t('landing:exness_infrastructure_title')}
                <a 
                  href="https://www.exness.com/about-exness/regulation/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                  aria-label="Ver regulación"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {t('landing:exness_infrastructure_desc')}
              </p>
            </CardContent>
          </Card>

          <Card className="group bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-xl flex items-center justify-between">
                {t('landing:exness_technology_title')}
                <a 
                  href="https://www.exness.com/deposit-and-withdraw/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                  aria-label="Ver depósitos y retiros"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {t('landing:exness_technology_desc')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* IB Model Transparency Card */}
        <div className="max-w-3xl mx-auto mb-12">
          <Card className="bg-muted/30 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">
                {t('landing:ib_model_title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {t('landing:ib_model_explanation')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-8 font-medium">
            {t('landing:exness_cta_prompt')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="text-base px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              onClick={() => navigate('/exness-redirect?flow=create')}
            >
              {t('landing:exness_create')}
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-base px-8 py-6 border-primary/50 hover:bg-primary/5"
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
