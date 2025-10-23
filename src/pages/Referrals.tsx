import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Gift, Users, DollarSign, TrendingUp, Sparkles, 
  Copy, CheckCircle2, Loader2 
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <Badge className="bg-gradient-to-r from-teal/20 to-cyan/20 text-teal border-teal/30">
            <Sparkles className="h-3 w-3 mr-1" />
            {agent ? t('referrals:status_active') : t('referrals:status')}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal to-cyan bg-clip-text text-transparent">
            {t('referrals:title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('referrals:subtitle')}
          </p>
        </div>

        {/* Agent Link Card */}
        {agent ? (
          <Card className="border-teal/20 bg-gradient-to-br from-teal/5 to-transparent">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-teal" />
                <CardTitle>{t('referrals:yourLink')}</CardTitle>
              </div>
              <CardDescription>
                {t('referrals:shareDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg font-mono text-sm break-all">
                {agent.exness_referral_link}
              </div>
              <Button 
                onClick={handleCopyLink} 
                className="w-full bg-gradient-to-r from-teal to-cyan hover:from-teal/90 hover:to-cyan/90"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {t('referrals:copied')}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    {t('referrals:copyLink')}
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {t('referrals:commissionShare')}: {agent.commission_share_percentage}%
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-teal/20 bg-gradient-to-br from-teal/5 to-transparent">
            <CardHeader>
              <CardTitle>{t('referrals:become_agent')}</CardTitle>
              <CardDescription>
                {t('referrals:description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleCreateAgentLink}
                disabled={creating}
                className="w-full bg-gradient-to-r from-teal to-cyan hover:from-teal/90 hover:to-cyan/90"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('referrals:creating')}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t('referrals:createLink')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-line">
            <CardHeader>
              <DollarSign className="h-8 w-8 text-teal mb-2" />
              <CardTitle>{t('referrals:benefits.rewards.title')}</CardTitle>
              <CardDescription>
                {t('referrals:benefits.rewards.description')}
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-line">
            <CardHeader>
              <Users className="h-8 w-8 text-teal mb-2" />
              <CardTitle>{t('referrals:benefits.tracking.title')}</CardTitle>
              <CardDescription>
                {t('referrals:benefits.tracking.description')}
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-line">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-teal mb-2" />
              <CardTitle>{t('referrals:benefits.easy.title')}</CardTitle>
              <CardDescription>
                {t('referrals:benefits.easy.description')}
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-line">
            <CardHeader>
              <Gift className="h-8 w-8 text-teal mb-2" />
              <CardTitle>{t('referrals:benefits.passive.title')}</CardTitle>
              <CardDescription>
                {t('referrals:benefits.passive.description')}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Commission Rates */}
        <Card>
          <CardHeader>
            <CardTitle>{t('referrals:commission_rates.title')}</CardTitle>
            <CardDescription>
              {t('referrals:commission_rates.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="font-medium">Standard</span>
                <span className="text-teal font-semibold">$3-5 {t('referrals:commission_rates.per_lot')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="font-medium">Pro</span>
                <span className="text-teal font-semibold">$1.5-2 {t('referrals:commission_rates.per_lot')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="font-medium">Raw Spread</span>
                <span className="text-teal font-semibold">$0.5-1 {t('referrals:commission_rates.per_lot')}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              * {t('referrals:commission_rates.note')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
