import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle, ArrowRight, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function HowItWorks() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const steps = [
    {
      number: "1",
      title: t('landing:how_step1_title'),
      description: t('landing:how_step1_desc'),
      tooltip: t('landing:how_step1_tooltip'),
      actions: [
        { label: t('landing:exness_create'), onClick: () => navigate('/exness-redirect?flow=create'), primary: true },
        { label: t('landing:exness_have'), onClick: () => navigate('/auth/validate'), primary: false }
      ]
    },
    {
      number: "2",
      title: t('landing:how_step2_title'),
      description: t('landing:how_step2_desc'),
      tooltip: t('landing:how_step2_tooltip')
    },
    {
      number: "3",
      title: t('landing:how_step3_title'),
      description: t('landing:how_step3_desc'),
      tooltip: t('landing:how_step3_tooltip')
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            {t('landing:how_badge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('landing:how_title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('landing:how_subtitle')}
          </p>
        </div>

        {/* Steps Card */}
        <Card className="max-w-4xl mx-auto bg-card border-border p-8 md:p-12">
          <TooltipProvider>
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex gap-6 items-start group">
                    {/* Number */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md">
                      {step.number}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          {step.title}
                        </h3>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="text-muted-foreground hover:text-foreground transition-colors">
                              <HelpCircle className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{step.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {step.description}
                      </p>
                      
                      {/* Step-specific actions */}
                      {step.actions && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          {step.actions.map((action, actionIndex) => (
                            <Button
                              key={actionIndex}
                              size="sm"
                              variant={action.primary ? "default" : "outline"}
                              onClick={action.onClick}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Arrow for non-last items */}
                    {index < steps.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-primary/30 hidden md:block" />
                    )}
                  </div>

                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="ml-6 h-8 w-0.5 bg-gradient-to-b from-primary/30 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </TooltipProvider>

          {/* Success indicator */}
          <div className="mt-12 pt-8 border-t border-border flex items-center justify-center gap-3 text-primary">
            <CheckCircle className="w-6 h-6" />
            <span className="font-medium">{t('landing:how_success')}</span>
          </div>
        </Card>
      </div>
    </section>
  );
}
