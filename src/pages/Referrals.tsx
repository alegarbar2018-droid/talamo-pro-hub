import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Sparkles, Copy, CheckCircle2, Loader2, 
  Shield, Zap, Users, DollarSign, TrendingUp, Target, Award
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
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-16 space-y-24">
        
        {/* Hero */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            {t('referrals:hero.badge')}
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            {t('referrals:hero.title')}
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('referrals:hero.subtitle')}
          </p>
        </motion.section>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { icon: Users, value: t('referrals:stats.activeAgents.value'), label: t('referrals:stats.activeAgents.label') },
            { icon: DollarSign, value: t('referrals:stats.paidThisMonth.value'), label: t('referrals:stats.paidThisMonth.label') },
            { icon: TrendingUp, value: t('referrals:stats.newReferralsToday.value'), label: t('referrals:stats.newReferralsToday.label') }
          ].map((stat, i) => (
            <Card key={i} className="text-center border-border/50">
              <CardContent className="pt-6 space-y-1">
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Why Different */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">{t('referrals:solution.title')}</h2>
            <p className="text-lg text-primary font-semibold">{t('referrals:solution.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {(t('referrals:solution.features', { returnObjects: true }) as any[]).map((feature, i) => {
              const icons = [Zap, Shield, Award];
              const Icon = icons[i];
              return (
                <Card key={i} className="border-primary/20 bg-primary/5">
                  <CardHeader className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription className="text-sm">{feature.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </motion.section>

        {/* How it Works */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-center">{t('referrals:howItWorks.title')}</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {(t('referrals:howItWorks.steps', { returnObjects: true }) as any[]).map((step, i) => (
              <Card key={i} className="relative border-border/50">
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="text-base">{step.title}</CardTitle>
                  <CardDescription className="text-sm">{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Commission Example */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {t('referrals:commissions.example.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <p><span className="text-primary font-bold">•</span> {t('referrals:commissions.example.setup')}</p>
                <p><span className="text-primary font-bold">•</span> {t('referrals:commissions.example.commission')}</p>
                <p><span className="text-primary font-bold">•</span> {t('referrals:commissions.example.total')}</p>
                <p className="text-primary font-bold text-base pt-2">
                  → {t('referrals:commissions.example.your_cut')}
                </p>
              </div>
              <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                {t('referrals:commissions.example.note')}
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold">{t('referrals:cta.title')}</h2>
            <p className="text-muted-foreground">{t('referrals:cta.subtitle')}</p>
          </div>

          {agent ? (
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-background max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  {t('referrals:cta.linkLabel')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-background rounded-lg font-mono text-sm break-all border border-border">
                  {agent.exness_referral_link}
                </div>
                <Button 
                  onClick={handleCopyLink} 
                  size="lg"
                  className="w-full"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      {t('referrals:cta.copied')}
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 mr-2" />
                      {t('referrals:cta.copyButton')}
                    </>
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span>{t('referrals:cta.commissionLabel')} <strong className="text-primary">{agent.commission_share_percentage}%</strong></span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-background max-w-2xl mx-auto">
              <CardContent className="py-12 text-center space-y-6">
                <p className="text-muted-foreground">
                  {t('referrals:cta.no_link')}
                </p>
                <Button 
                  onClick={handleCreateAgentLink} 
                  disabled={creating}
                  size="lg"
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {t('referrals:cta.generating')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      {t('referrals:cta.button_create')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.section>

        {/* FAQ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-center">{t('referrals:faq.title')}</h2>
          
          <Card className="max-w-3xl mx-auto border-border/50">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {(t('referrals:faq.items', { returnObjects: true }) as any[]).map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-medium">{item.q}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
