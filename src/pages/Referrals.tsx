import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Gift, Users, DollarSign, TrendingUp, Sparkles, 
  Copy, CheckCircle2, Loader2, ArrowRight
} from 'lucide-react';

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

  // Load agent data on mount
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
        .single();

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
          description: t('referrals:error.login'),
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
        title: t('referrals:success.created'),
        description: t('referrals:success.description'),
      });
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        title: t('common:error'),
        description: t('referrals:error.create'),
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
      title: t('referrals:copied'),
      description: t('referrals:shareDescription')
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/30 to-background"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-primary opacity-8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-rgb),0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-rgb),0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 space-y-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <Badge className="bg-gradient-to-r from-teal/20 to-cyan/20 text-teal border-teal/30 px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 mr-2" />
            {agent ? t('referrals:status_active') : t('referrals:status')}
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            <span className="text-foreground">{t('referrals:title').split(' ').slice(0, -2).join(' ')} </span>
            <span className="text-primary">{t('referrals:title').split(' ').slice(-2).join(' ')}</span>
            <div className="absolute left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-primary rounded-full opacity-60 mt-2"></div>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('referrals:subtitle')}
          </p>
          
          <p className="text-base md:text-lg text-muted-foreground/80 max-w-4xl mx-auto leading-relaxed">
            {t('referrals:hero_description')}
          </p>
        </motion.div>

        {/* Agent Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {agent ? (
            <Card className="border-teal/30 bg-gradient-to-br from-teal/10 via-surface/50 to-transparent backdrop-blur-sm shadow-xl shadow-teal/10 overflow-hidden relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal/5 via-transparent to-teal/5 pointer-events-none"></div>
              
              <CardHeader className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-teal/20">
                    <CheckCircle2 className="h-6 w-6 text-teal" />
                  </div>
                  <CardTitle className="text-2xl">{t('referrals:yourLink')}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {t('referrals:shareDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 relative">
                <div className="p-5 bg-background/60 backdrop-blur-sm rounded-xl font-mono text-sm break-all border border-teal/20 shadow-inner">
                  {agent.exness_referral_link}
                </div>
                <Button 
                  onClick={handleCopyLink} 
                  size="lg"
                  className="w-full bg-gradient-to-r from-teal to-cyan hover:from-teal/90 hover:to-cyan/90 shadow-lg shadow-teal/20 hover:shadow-xl hover:shadow-teal/30 transition-all duration-300 group"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      {t('referrals:copied')}
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                      {t('referrals:copyLink')}
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-teal/5 to-transparent rounded-lg border border-teal/10">
                  <DollarSign className="h-5 w-5 text-teal" />
                  <p className="text-sm font-semibold text-foreground">
                    {t('referrals:commissionShare')}: <span className="text-teal text-lg">{agent.commission_share_percentage}%</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-teal/30 bg-gradient-to-br from-teal/10 via-surface/50 to-transparent backdrop-blur-sm shadow-xl shadow-teal/10 overflow-hidden relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal/5 via-transparent to-teal/5 pointer-events-none"></div>
              
              <CardHeader className="relative">
                <CardTitle className="text-2xl">{t('referrals:become_agent')}</CardTitle>
                <CardDescription className="text-base">
                  {t('referrals:description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button 
                  onClick={handleCreateAgentLink}
                  disabled={creating}
                  size="lg"
                  className="w-full bg-gradient-to-r from-teal to-cyan hover:from-teal/90 hover:to-cyan/90 shadow-lg shadow-teal/20 hover:shadow-xl hover:shadow-teal/30 transition-all duration-300 group"
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {t('referrals:creating')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                      {t('referrals:createLink')}
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Benefits Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {[
            { icon: DollarSign, title: t('referrals:benefits.rewards.title'), desc: t('referrals:benefits.rewards.description') },
            { icon: Users, title: t('referrals:benefits.tracking.title'), desc: t('referrals:benefits.tracking.description') },
            { icon: TrendingUp, title: t('referrals:benefits.easy.title'), desc: t('referrals:benefits.easy.description') },
            { icon: Gift, title: t('referrals:benefits.passive.title'), desc: t('referrals:benefits.passive.description') }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
            >
              <Card className="border-teal/20 bg-gradient-to-br from-surface/80 to-transparent backdrop-blur-sm hover:border-teal/40 transition-all duration-300 group hover:shadow-lg hover:shadow-teal/10 h-full">
                <CardHeader>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-teal/20 to-teal/5 w-fit mb-3 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="h-8 w-8 text-teal" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-teal transition-colors">{benefit.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {benefit.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Card className="border-teal/20 bg-gradient-to-br from-surface/80 to-transparent backdrop-blur-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-primary opacity-5 rounded-full blur-3xl"></div>
            
            <CardHeader className="relative">
              <CardTitle className="text-3xl">{t('referrals:how_it_works.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative">
              <div className="space-y-3">
                <p className="text-muted-foreground text-lg leading-relaxed">{t('referrals:how_it_works.intro')}</p>
                <p className="text-muted-foreground leading-relaxed">{t('referrals:how_it_works.explanation')}</p>
                <p className="text-foreground font-semibold text-lg mt-4">{t('referrals:how_it_works.share')}</p>
              </div>
              
              <div className="overflow-x-auto rounded-xl border border-teal/20 bg-background/40 backdrop-blur-sm">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-teal/20 bg-gradient-to-r from-teal/10 to-transparent">
                      <th className="text-left p-4 font-bold text-foreground">{t('referrals:how_it_works.table.account_type')}</th>
                      <th className="text-left p-4 font-bold text-foreground">{t('referrals:how_it_works.table.talamo_commission')}</th>
                      <th className="text-left p-4 font-bold text-teal">{t('referrals:how_it_works.table.your_earning')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-teal/10 hover:bg-teal/5 transition-colors">
                      <td className="p-4 font-medium">{t('referrals:how_it_works.table.standard')}</td>
                      <td className="p-4 text-muted-foreground">{t('referrals:how_it_works.table.standard_commission')}</td>
                      <td className="p-4 text-teal font-bold text-lg">{t('referrals:how_it_works.table.standard_earning')}</td>
                    </tr>
                    <tr className="hover:bg-teal/5 transition-colors">
                      <td className="p-4 font-medium">{t('referrals:how_it_works.table.pro')}</td>
                      <td className="p-4 text-muted-foreground">{t('referrals:how_it_works.table.pro_commission')}</td>
                      <td className="p-4 text-teal font-bold text-lg">{t('referrals:how_it_works.table.pro_earning')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* What You Earn */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card className="border-teal/20 bg-gradient-to-br from-surface/80 to-transparent backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                {t('referrals:what_you_earn.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-foreground font-semibold text-lg">{t('referrals:what_you_earn.intro')}</p>
              <ul className="space-y-4">
                {[
                  t('referrals:what_you_earn.benefit_1'),
                  t('referrals:what_you_earn.benefit_2'),
                  t('referrals:what_you_earn.benefit_3')
                ].map((benefit, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-teal/5 to-transparent border border-teal/10 hover:border-teal/20 transition-all"
                  >
                    <div className="p-1 rounded-full bg-teal/20 mt-0.5">
                      <CheckCircle2 className="h-5 w-5 text-teal" />
                    </div>
                    <span className="text-muted-foreground text-base leading-relaxed">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="pt-6 mt-6 border-t border-teal/20">
                <p className="text-foreground font-bold text-xl text-center bg-gradient-to-r from-teal to-cyan bg-clip-text text-transparent">
                  {t('referrals:what_you_earn.outro')}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Why This Program Exists */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Card className="border-teal/30 bg-gradient-to-br from-teal/10 via-surface/50 to-transparent backdrop-blur-sm shadow-xl shadow-teal/10 overflow-hidden relative">
            {/* Premium decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-glow pointer-events-none"></div>
            
            <CardHeader className="relative">
              <CardTitle className="text-3xl flex items-center gap-3">
                {t('referrals:why_exists.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 relative">
              <div className="space-y-4">
                <p className="text-foreground font-bold text-lg">{t('referrals:why_exists.intro')}</p>
                <p className="text-muted-foreground text-base leading-relaxed">{t('referrals:why_exists.purpose')}</p>
                <p className="text-muted-foreground text-base leading-relaxed">{t('referrals:why_exists.growth')}</p>
              </div>
              
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-teal/20 via-teal/10 to-transparent border border-teal/30">
                <p className="text-2xl font-bold text-center bg-gradient-to-r from-teal to-cyan bg-clip-text text-transparent">
                  {t('referrals:why_exists.values')}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
