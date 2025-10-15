import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Shield, AlertCircle } from "lucide-react";

export function CopyTradingIntro() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Users,
      title: t("copy.intro.feature1_title"),
      description: t("copy.intro.feature1_desc")
    },
    {
      icon: TrendingUp,
      title: t("copy.intro.feature2_title"),
      description: t("copy.intro.feature2_desc")
    },
    {
      icon: Shield,
      title: t("copy.intro.feature3_title"),
      description: t("copy.intro.feature3_desc")
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-background via-background to-primary/5 border-primary/20">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
            {t("copy.intro.title")}
          </h2>
          
          <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
            {t("copy.intro.description")}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50 border border-primary/10">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-500 mb-1">
                {t("copy.intro.diversification_title")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("copy.intro.diversification_desc")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
