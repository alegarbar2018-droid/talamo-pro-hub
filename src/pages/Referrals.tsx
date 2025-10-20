import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Gift, Users, DollarSign, TrendingUp, Sparkles, ExternalLink } from "lucide-react";

const Referrals = () => {
  const { t } = useTranslation(["referrals", "common"]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <Badge className="bg-gradient-to-r from-teal/20 to-cyan/20 text-teal border-teal/30">
            <Sparkles className="h-3 w-3 mr-1" />
            {t("referrals:status")}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal to-cyan bg-clip-text text-transparent">
            {t("referrals:title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("referrals:subtitle")}
          </p>
        </div>

        {/* Current Process Alert */}
        <Alert className="border-teal/30 bg-teal/5">
          <Gift className="h-4 w-4 text-teal" />
          <AlertDescription className="text-sm">
            {t("referrals:current_process")}
          </AlertDescription>
        </Alert>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-line">
            <CardHeader>
              <Users className="h-8 w-8 text-teal mb-2" />
              <CardTitle>{t("referrals:benefits.network.title")}</CardTitle>
              <CardDescription>{t("referrals:benefits.network.description")}</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-line">
            <CardHeader>
              <DollarSign className="h-8 w-8 text-teal mb-2" />
              <CardTitle>{t("referrals:benefits.commissions.title")}</CardTitle>
              <CardDescription>{t("referrals:benefits.commissions.description")}</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-line">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-teal mb-2" />
              <CardTitle>{t("referrals:benefits.passive.title")}</CardTitle>
              <CardDescription>{t("referrals:benefits.passive.description")}</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-line">
            <CardHeader>
              <Gift className="h-8 w-8 text-teal mb-2" />
              <CardTitle>{t("referrals:benefits.bonuses.title")}</CardTitle>
              <CardDescription>{t("referrals:benefits.bonuses.description")}</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* IB Program Info */}
        <Card className="border-teal/20 bg-gradient-to-br from-teal/5 to-transparent">
          <CardHeader>
            <CardTitle>{t("referrals:ib_program.title")}</CardTitle>
            <CardDescription>{t("referrals:ib_program.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">{t("referrals:ib_program.how_it_works")}</h4>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>{t("referrals:ib_program.steps.1")}</li>
                <li>{t("referrals:ib_program.steps.2")}</li>
                <li>{t("referrals:ib_program.steps.3")}</li>
                <li>{t("referrals:ib_program.steps.4")}</li>
              </ol>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-teal to-cyan hover:from-teal/90 hover:to-cyan/90"
              onClick={() => window.open("https://partners.exness.com", "_blank")}
            >
              {t("referrals:ib_program.cta")}
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <Card>
          <CardHeader>
            <CardTitle>{t("referrals:coming_soon.title")}</CardTitle>
            <CardDescription>{t("referrals:coming_soon.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["dashboard", "tracking", "payments", "materials"].map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="text-teal mt-0.5">✓</span>
                  <span>{t(`referrals:coming_soon.features.${feature}`)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Referrals;
