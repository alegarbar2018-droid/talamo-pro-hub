import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Sparkles, Copy, CheckCircle2, Loader2, ArrowRight, 
  Shield, TrendingUp, Zap, Users, DollarSign, Clock,
  ChevronDown, Target, Award
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ReferralAgent {
  id: string;
  exness_referral_link: string;
  exness_referral_code: string;
  commission_share_percentage: number;
  created_at: string;
}

export default function Referrals() {
  const { t } = useTranslation(['referrals', 'common']);
  const { toast } = useToast();
  const [agent, setAgent] = useState<ReferralAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadAgentData();
  }, []);

  const loadAgentData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('referral_agents')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        setAgent(data);
      }
    } catch (error) {
      console.error('Error loading agent:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgentLink = async () => {
    setCreating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: t('common:error'),
          description: t('referrals:errors.login'),
          variant: 'destructive'
        });
        return;
      }

      const response = await supabase.functions.invoke('create-referral-agent', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) throw response.error;

      const { agent: newAgent } = response.data;
      setAgent(newAgent);

      toast({
        title: '✅ ' + t('referrals:cta.your_link'),
        description: t('referrals:cta.description'),
      });
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        title: t('common:error'),
        description: t('referrals:errors.create'),
        variant: 'destructive'
      });
    } finally {
      setCreating(false);
    }
  };

  const handleCopyLink = () => {
    if (!agent) return;
    
    navigator.clipboard.writeText(agent.exness_referral_link);
    setCopied(true);
    toast({
      title: t('referrals:cta.copied'),
      description: agent.exness_referral_link
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/30 to-background"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-primary opacity-8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(185,100,38,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(185,100,38,0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>

      <div className="relative container-default space-y-20 py-16">
        
        {/* 1. PREMIUM HERO */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Badge className="bg-gradient-to-r from-teal via-cyan to-teal bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] text-white border-0 px-6 py-2.5 font-semibold shadow-lg">
              <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
              {t('referrals:hero.badge')}
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="hero-title">
              <span className="text-foreground">{t('referrals:hero.title')}</span>
              <br />
              <span className="gradient-text">{t('referrals:hero.subtitle')}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('referrals:hero.description')}
            </p>
          </motion.div>
        </motion.section>

        {/* 2. TRUST BAR */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: Users, label: t('referrals:trust.partners'), value: '247' },
            { icon: DollarSign, label: t('referrals:trust.earnings'), value: '$12,840' },
            { icon: TrendingUp, label: t('referrals:trust.signups'), value: '18' }
          ].map((stat, i) => (
            <Card key={i} className="border-border/50 bg-surface/50 backdrop-blur-sm text-center">
              <CardContent className="pt-6 space-y-2">
                <stat.icon className="h-8 w-8 text-primary mx-auto" />
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.section>

        {/* 3. THE PROBLEM */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('referrals:problem.title')}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              t('referrals:problem.point1'),
              t('referrals:problem.point2'),
              t('referrals:problem.point3')
            ].map((point, i) => (
              <Card key={i} className="border-destructive/30 bg-destructive/5 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground leading-relaxed">{point}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* 4. THE DIFFERENCE */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('referrals:difference.title')}
            </h2>
            <p className="text-xl text-primary font-semibold">
              {t('referrals:difference.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, ...t('referrals:difference.point1', { returnObjects: true }) as any },
              { icon: Shield, ...t('referrals:difference.point2', { returnObjects: true }) as any },
              { icon: Award, ...t('referrals:difference.point3', { returnObjects: true }) as any }
            ].map((item, i) => (
              <Card key={i} className="border-primary/30 bg-primary/5 backdrop-blur-sm group hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="p-3 rounded-xl bg-primary/20 w-fit mb-3 group-hover:scale-110 transition-transform">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* 5. HOW IT WORKS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('referrals:how.title')}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              t('referrals:how.step1', { returnObjects: true }) as any,
              t('referrals:how.step2', { returnObjects: true }) as any,
              t('referrals:how.step3', { returnObjects: true }) as any
            ].map((step, i) => (
              <Card key={i} className="border-border/50 bg-surface/50 backdrop-blur-sm relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {i + 1}
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Example Calculation */}
          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                {t('referrals:how.example.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-muted-foreground">
                <p className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>{t('referrals:how.example.setup')}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>{t('referrals:how.example.commission')}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>{t('referrals:how.example.total')}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">→</span>
                  <span className="text-primary font-bold text-lg">{t('referrals:how.example.your_cut')}</span>
                </p>
              </div>
              <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-4">
                {t('referrals:how.example.note')}
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* 6. BENEFITS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('referrals:benefits.title')}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: DollarSign, ...t('referrals:benefits.benefit1', { returnObjects: true }) as any },
              { icon: TrendingUp, ...t('referrals:benefits.benefit2', { returnObjects: true }) as any },
              { icon: Clock, ...t('referrals:benefits.benefit3', { returnObjects: true }) as any },
              { icon: Zap, ...t('referrals:benefits.benefit4', { returnObjects: true }) as any }
            ].map((benefit, i) => (
              <Card key={i} className="border-border/50 bg-surface/50 backdrop-blur-sm group hover:border-primary/30 transition-all">
                <CardHeader>
                  <div className="p-3 rounded-xl bg-primary/20 w-fit mb-3 group-hover:scale-110 transition-transform">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {benefit.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* 7. WHY IT EXISTS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="space-y-8"
        >
          <Card className="border-border/50 bg-gradient-to-br from-surface/80 to-transparent backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl text-center">{t('referrals:why.title')}</CardTitle>
              <CardDescription className="text-center text-lg text-primary font-semibold">
                {t('referrals:why.intro')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{t('referrals:why.point1')}</p>
              <p>{t('referrals:why.point2')}</p>
              <p>{t('referrals:why.point3')}</p>
              <p className="text-center text-foreground font-bold text-xl pt-4">
                {t('referrals:why.conclusion')}
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* 8. CTA FINAL */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              {t('referrals:cta.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('referrals:cta.description')}
            </p>
          </div>

          {agent ? (
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-surface/50 to-transparent backdrop-blur-sm shadow-xl max-w-3xl mx-auto">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">{t('referrals:cta.your_link')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-background/60 backdrop-blur-sm rounded-xl font-mono text-sm break-all border border-primary/20">
                  {agent.exness_referral_link}
                </div>
                <Button 
                  onClick={handleCopyLink} 
                  size="lg"
                  className="w-full bg-gradient-to-r from-teal to-cyan hover:from-teal/90 hover:to-cyan/90 shadow-lg group"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      {t('referrals:cta.copied')}
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                      {t('referrals:cta.button_copy')}
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2 p-4 bg-primary/5 rounded-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold">
                    {t('referrals:cta.commission')}: <span className="text-primary text-lg">{agent.commission_share_percentage}%</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-surface/50 to-transparent backdrop-blur-sm shadow-xl max-w-3xl mx-auto">
              <CardContent className="pt-8">
                <Button 
                  onClick={handleCreateAgentLink}
                  disabled={creating}
                  size="lg"
                  className="w-full bg-gradient-to-r from-teal to-cyan hover:from-teal/90 hover:to-cyan/90 shadow-lg group text-lg py-6"
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                      {t('referrals:cta.creating')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
                      {t('referrals:cta.button_create')}
                      <ArrowRight className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.section>

        {/* 9. FAQ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">{t('referrals:faq.title')}</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {['q1', 'q2', 'q3', 'q4', 'q5'].map((key) => {
              const faq = t(`referrals:faq.${key}`, { returnObjects: true }) as any;
              return (
                <AccordionItem key={key} value={key} className="border border-border/50 rounded-xl px-6 bg-surface/50 backdrop-blur-sm">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </motion.section>

      </div>
    </div>
  );
}
