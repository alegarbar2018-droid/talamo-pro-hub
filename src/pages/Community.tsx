import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, MessageSquare, TrendingUp, Sparkles, Mail, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/layout/PageHero";
import { FaDiscord, FaTelegram } from "react-icons/fa";

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <PageHero
        module="community"
        title={t("community:title")}
        subtitle={t("community:subtitle")}
        badge={{
          icon: Sparkles,
          text: t("community:status")
        }}
        containerWidth="narrow"
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Social Platforms */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-teal via-cyan to-teal bg-clip-text text-transparent">
              {t("community:social.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("community:social.description")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Discord Card */}
            <Card className="border-[#5865F2]/20 bg-gradient-to-br from-[#5865F2]/5 to-transparent hover:border-[#5865F2]/40 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-[#5865F2]/10">
                    <FaDiscord className="h-6 w-6 text-[#5865F2]" />
                  </div>
                  <CardTitle>{t("community:social.discord.title")}</CardTitle>
                </div>
                <CardDescription>{t("community:social.discord.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  className="w-full bg-[#5865F2] hover:bg-[#5865F2]/90 text-white"
                >
                  <a 
                    href="https://discord.gg/tNBpaVYqF7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    {t("community:social.discord.button")}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Telegram Card */}
            <Card className="border-[#0088cc]/20 bg-gradient-to-br from-[#0088cc]/5 to-transparent hover:border-[#0088cc]/40 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-[#0088cc]/10">
                    <FaTelegram className="h-6 w-6 text-[#0088cc]" />
                  </div>
                  <CardTitle>{t("community:social.telegram.title")}</CardTitle>
                </div>
                <CardDescription>{t("community:social.telegram.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  className="w-full bg-[#0088cc] hover:bg-[#0088cc]/90 text-white"
                >
                  <a 
                    href="https://t.me/+tcJhfpcfe_NhNjcx" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    {t("community:social.telegram.button")}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
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
