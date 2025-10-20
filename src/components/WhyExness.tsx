import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Activity, Shield, Zap, ExternalLink, Award, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function WhyExness() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-background via-surface/30 to-background/95">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-gradient-primary opacity-5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(185,100%,38%,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(185,100%,38%,0.01)_1px,transparent_1px)] bg-[size:80px_80px]"></div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface/80 border border-primary/30 text-primary text-sm font-semibold backdrop-blur-sm shadow-[var(--shadow-glow-subtle)]">
            <Award className="w-4 h-4" />
            {t('landing:due_diligence_badge')}
          </span>
        </div>

        {/* Heading */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t('landing:why_exness_title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {t('landing:why_exness_subtitle')}
          </p>
        </div>

        {/* Due Diligence Explanation Card */}
        <div className="max-w-5xl mx-auto mb-20">
          <Card className="relative overflow-hidden bg-surface/50 backdrop-blur-sm border-primary/20 shadow-[var(--shadow-elevated)] hover:shadow-[var(--glow-primary)] transition-all duration-500">
            {/* Gradient glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none"></div>
            
            <CardHeader className="relative pb-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 shadow-[var(--shadow-glow-subtle)]">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl md:text-3xl mb-3">
                    {t('landing:due_diligence_title')}
                  </CardTitle>
                  <CardDescription className="text-base md:text-lg leading-relaxed text-muted-foreground/90">
                    {t('landing:due_diligence_explanation')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Professional Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-20 max-w-6xl mx-auto">
          <Card className="group relative overflow-hidden bg-surface/50 backdrop-blur-sm border-line/50 hover:border-primary/30 hover:shadow-[var(--shadow-elevated)] transition-all duration-500">
            {/* Card gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <CardHeader className="relative">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:shadow-[var(--shadow-glow-subtle)] transition-all duration-300">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl md:text-2xl flex items-center justify-between mb-2">
                <span>{t('landing:exness_liquidity_title')}</span>
                <a 
                  href="https://www.exness.com/accounts/account-types/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary/60 hover:text-primary transition-colors"
                  aria-label="Ver tipos de cuenta"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-muted-foreground/90 leading-relaxed">
                {t('landing:exness_liquidity_desc')}
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-surface/50 backdrop-blur-sm border-line/50 hover:border-primary/30 hover:shadow-[var(--shadow-elevated)] transition-all duration-500">
            {/* Card gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <CardHeader className="relative">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:shadow-[var(--shadow-glow-subtle)] transition-all duration-300">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl md:text-2xl flex items-center justify-between mb-2">
                <span>{t('landing:exness_infrastructure_title')}</span>
                <a 
                  href="https://www.exness.com/about-exness/regulation/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary/60 hover:text-primary transition-colors"
                  aria-label="Ver regulación"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-muted-foreground/90 leading-relaxed">
                {t('landing:exness_infrastructure_desc')}
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-surface/50 backdrop-blur-sm border-line/50 hover:border-primary/30 hover:shadow-[var(--shadow-elevated)] transition-all duration-500">
            {/* Card gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <CardHeader className="relative">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:shadow-[var(--shadow-glow-subtle)] transition-all duration-300">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl md:text-2xl flex items-center justify-between mb-2">
                <span>{t('landing:exness_technology_title')}</span>
                <a 
                  href="https://www.exness.com/deposit-and-withdraw/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary/60 hover:text-primary transition-colors"
                  aria-label="Ver depósitos y retiros"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-muted-foreground/90 leading-relaxed">
                {t('landing:exness_technology_desc')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* IB Model Transparency Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="bg-surface/30 backdrop-blur-sm border-line/30">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-muted-foreground">
                {t('landing:ib_model_title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground/80 leading-relaxed">
                {t('landing:ib_model_explanation')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-lg md:text-xl text-muted-foreground mb-10 font-medium">
            {t('landing:exness_cta_prompt')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="text-base px-10 py-7 shadow-[var(--shadow-glow-subtle)] hover:shadow-[var(--glow-primary)] transition-all duration-300 bg-gradient-primary"
              onClick={() => navigate('/exness-redirect?flow=create')}
            >
              {t('landing:exness_create')}
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-base px-10 py-7 border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
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
