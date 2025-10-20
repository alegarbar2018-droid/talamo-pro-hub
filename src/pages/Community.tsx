import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, TrendingUp, Sparkles, Mail } from "lucide-react";
import { toast } from "sonner";

const Community = () => {
  const { t } = useTranslation(["community", "common"]);
  const [email, setEmail] = useState("");

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    toast.success("¡Gracias por tu interés!", {
      description: "Te notificaremos cuando la comunidad esté disponible.",
    });
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <Badge className="bg-gradient-to-r from-teal/20 to-cyan/20 text-teal border-teal/30">
            <Sparkles className="h-3 w-3 mr-1" />
            {t("community:status")}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal to-cyan bg-clip-text text-transparent">
            {t("community:title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("community:subtitle")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-line">
            <CardHeader>
              <Users className="h-8 w-8 text-teal mb-2" />
              <CardTitle>{t("community:features.network.title")}</CardTitle>
              <CardDescription>{t("community:features.network.description")}</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-line">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-teal mb-2" />
              <CardTitle>{t("community:features.discussions.title")}</CardTitle>
              <CardDescription>{t("community:features.discussions.description")}</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-line">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-teal mb-2" />
              <CardTitle>{t("community:features.strategies.title")}</CardTitle>
              <CardDescription>{t("community:features.strategies.description")}</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Waitlist Card */}
        <Card className="border-teal/20 bg-gradient-to-br from-teal/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-teal" />
              {t("community:waitlist.title")}
            </CardTitle>
            <CardDescription>{t("community:waitlist.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinWaitlist} className="flex gap-2">
              <Input
                type="email"
                placeholder={t("community:waitlist.placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="bg-gradient-to-r from-teal to-cyan hover:from-teal/90 hover:to-cyan/90">
                {t("community:waitlist.button")}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Coming Soon Features */}
        <Card>
          <CardHeader>
            <CardTitle>{t("community:coming_soon.title")}</CardTitle>
            <CardDescription>{t("community:coming_soon.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["forums", "leaderboard", "events", "mentorship"].map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="text-teal mt-0.5">✓</span>
                  <span>{t(`community:coming_soon.features.${feature}`)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;
