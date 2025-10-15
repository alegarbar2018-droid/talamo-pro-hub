import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, TrendingUp, Target, Shield, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export function StrategyEvaluationGuide() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const metrics = [
    {
      icon: Award,
      name: t("copy.evaluation.profit_factor"),
      description: t("copy.evaluation.profit_factor_desc"),
      good: "> 1.5",
      excellent: "> 2.0"
    },
    {
      icon: Target,
      name: t("copy.evaluation.win_rate"),
      description: t("copy.evaluation.win_rate_desc"),
      good: "> 50%",
      excellent: "> 60%"
    },
    {
      icon: Shield,
      name: t("copy.evaluation.max_drawdown"),
      description: t("copy.evaluation.max_drawdown_desc"),
      good: "< 20%",
      excellent: "< 10%"
    },
    {
      icon: TrendingUp,
      name: t("copy.evaluation.monthly_return"),
      description: t("copy.evaluation.monthly_return_desc"),
      good: "> 3%",
      excellent: "> 5%"
    }
  ];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-primary/20">
        <CardHeader>
          <CollapsibleTrigger className="flex items-center justify-between w-full group">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {t("copy.evaluation.title")}
            </CardTitle>
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t("copy.evaluation.description")}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {metrics.map((metric, idx) => (
                <div key={idx} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <metric.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-1">{metric.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {metric.description}
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          Bueno: {metric.good}
                        </Badge>
                        <Badge variant="default" className="text-xs">
                          Excelente: {metric.excellent}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
