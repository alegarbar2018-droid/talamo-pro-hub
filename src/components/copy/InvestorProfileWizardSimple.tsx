import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, DollarSign, TrendingUp, Loader2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { recommendStrategies } from '@/lib/recommendStrategies';
import type { InvestorProfile, InvestorRiskProfile, StrategyAllocation, CopyStrategy } from '@/modules/copy/types';

interface InvestorProfileWizardSimpleProps {
  open: boolean;
  onClose: () => void;
  onComplete?: (allocations: StrategyAllocation[]) => void;
}

export const InvestorProfileWizardSimple = ({ open, onClose, onComplete }: InvestorProfileWizardSimpleProps) => {
  const { t } = useTranslation(['copy']);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [allocations, setAllocations] = useState<StrategyAllocation[]>([]);
  const [profile, setProfile] = useState<InvestorProfile>({
    risk_profile: 'moderate',
    total_investment: 100,
    experience: 'beginner',
    risk_tolerance: 5,
    investment_horizon: 'medium'
  });

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    if (open && step > 1) {
      const wizardState = {
        profile,
        allocations,
        timestamp: new Date().toISOString()
      };
      sessionStorage.setItem('investor_wizard_state', JSON.stringify(wizardState));
    }
  }, [profile, allocations, step, open]);
  
  // Fetch estrategias publicadas
  const { data: strategies, isLoading: loadingStrategies } = useQuery({
    queryKey: ['published-strategies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('copy_strategies' as any)
        .select('*')
        .eq('status', 'published');
      
      if (error) throw error;
      return data as any[] as CopyStrategy[];
    },
    enabled: open && step === 3
  });

  const handleNext = () => {
    if (step === 2) {
      // Calcular asignaciones al pasar de step 2 a 3
      if (strategies && strategies.length > 0) {
        const recommended = recommendStrategies(profile, strategies);
        setAllocations(recommended);
      }
    }
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    if (!user) {
      // Usuario NO autenticado: guardar estado y redirigir a onboarding
      const wizardState = {
        profile,
        allocations,
        timestamp: new Date().toISOString()
      };
      sessionStorage.setItem('investor_wizard_state', JSON.stringify(wizardState));
      
      // Redirigir al flujo de onboarding con parámetro de origen
      navigate('/onboarding?flow=investor&step=validate-email');
      onClose();
    } else {
      // Usuario autenticado: ir directo a copy-trading con recomendaciones
      onComplete?.(allocations);
      navigate('/copy-trading', {
        state: {
          recommendedAllocations: allocations,
          showWelcome: true
        }
      });
      onClose();
      setStep(1);
    }
  };

  const updateProfile = (updates: Partial<InvestorProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  // Mapear respuesta de riesgo a tolerancia numérica
  const mapRiskResponseToTolerance = (response: string): number => {
    const mapping: Record<string, number> = {
      'panic': 2,      // Conservador
      'wait': 5,       // Moderado
      'invest_more': 8 // Agresivo
    };
    return mapping[response] || 5;
  };

  // Calcular perfil basado en tolerancia
  const calculateRiskProfile = (tolerance: number): InvestorRiskProfile => {
    if (tolerance <= 3) return 'conservative';
    if (tolerance <= 7) return 'moderate';
    return 'aggressive';
  };

  const currentRiskProfile = calculateRiskProfile(profile.risk_tolerance);

  const getRiskBadgeVariant = (risk: InvestorRiskProfile) => {
    const variants = {
      conservative: 'secondary',
      moderate: 'default',
      aggressive: 'destructive'
    };
    return variants[risk] as any;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {t('copy:wizard.title')}
          </DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s === step ? 'bg-primary' : s < step ? 'bg-primary/50' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Step 1: Perfil de Riesgo Simplificado */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('copy:simple.wizard.step1.title')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('copy:simple.wizard.step1.subtitle')}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>{t('copy:simple.wizard.step1.investment_experience')}</Label>
                  <Select
                    value={profile.experience}
                    onValueChange={(v) => updateProfile({ experience: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">{t('copy:simple.wizard.step1.experience_never')}</SelectItem>
                      <SelectItem value="intermediate">{t('copy:simple.wizard.step1.experience_some')}</SelectItem>
                      <SelectItem value="advanced">{t('copy:simple.wizard.step1.experience_regular')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t('copy:simple.wizard.step1.investment_horizon')}</Label>
                  <Select
                    value={profile.investment_horizon}
                    onValueChange={(v) => updateProfile({ investment_horizon: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">{t('copy:simple.wizard.step1.horizon_short')}</SelectItem>
                      <SelectItem value="medium">{t('copy:simple.wizard.step1.horizon_medium')}</SelectItem>
                      <SelectItem value="long">{t('copy:simple.wizard.step1.horizon_long')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-3 block">{t('copy:simple.wizard.step1.risk_question')}</Label>
                  <RadioGroup
                    value={profile.risk_tolerance <= 3 ? 'panic' : profile.risk_tolerance <= 7 ? 'wait' : 'invest_more'}
                    onValueChange={(v) => {
                      const tolerance = mapRiskResponseToTolerance(v);
                      updateProfile({ 
                        risk_tolerance: tolerance,
                        risk_profile: calculateRiskProfile(tolerance)
                      });
                    }}
                    className="space-y-3"
                  >
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="panic" id="panic" />
                      <Label htmlFor="panic" className="cursor-pointer flex-1 text-sm">
                        {t('copy:simple.wizard.step1.risk_option_a')}
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="wait" id="wait" />
                      <Label htmlFor="wait" className="cursor-pointer flex-1 text-sm">
                        {t('copy:simple.wizard.step1.risk_option_b')}
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="invest_more" id="invest_more" />
                      <Label htmlFor="invest_more" className="cursor-pointer flex-1 text-sm">
                        {t('copy:simple.wizard.step1.risk_option_c')}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Card className="p-4 bg-primary/5 border-primary/20">
                  <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                    {t('copy:simple.wizard.step1.profile_calculated')}
                    <Badge variant={getRiskBadgeVariant(currentRiskProfile)}>
                      {t(`copy:simple.wizard.step1.profile_${currentRiskProfile}`)}
                    </Badge>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t(`copy:simple.wizard.step1.profile_${currentRiskProfile}_desc`)}
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* Step 2: Monto Total Mejorado */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('copy:simple.wizard.step2.title')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('copy:simple.wizard.step2.subtitle')}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>{t('copy:simple.wizard.step2.amount_label')}</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min={10}
                      value={profile.total_investment}
                      onChange={(e) => updateProfile({ total_investment: parseFloat(e.target.value) || 0 })}
                      className="pl-9"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('copy:simple.wizard.step2.amount_min')}
                  </p>
                </div>

                <Card className="p-4 bg-destructive/5 border-destructive/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{t('copy:simple.wizard.step2.warning_title')}</h4>
                      <p className="text-xs text-muted-foreground">{t('copy:simple.wizard.step2.warning_desc')}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-muted/50">
                  <h4 className="font-semibold text-sm mb-2">{t('copy:simple.wizard.step2.suggestions_title')}</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• {t('copy:simple.wizard.step2.suggestion_beginner')}</p>
                    <p>• {t('copy:simple.wizard.step2.suggestion_intermediate')}</p>
                    <p>• {t('copy:simple.wizard.step2.suggestion_advanced')}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                    💡 {t('copy:simple.wizard.step2.diversification_note')}
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* Step 3: Asignación Simplificada */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('copy:simple.wizard.step3.title')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('copy:simple.wizard.step3.subtitle')}
                </p>
              </div>

              {loadingStrategies ? (
                <Card className="p-6 bg-muted/50">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">{t('copy:simple.wizard.step3.loading')}</p>
                  </div>
                </Card>
              ) : allocations.length === 0 ? (
                <Card className="p-6 bg-muted/50">
                  <p className="text-sm text-center mb-2">
                    {t('copy:simple.wizard.step3.no_strategies')}
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    {t('copy:simple.wizard.step3.no_strategies_help')}
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {allocations.map((allocation) => {
                    const riskLabel = allocation.strategy.risk_band === 'conservative' 
                      ? t('copy:simple.strategy_simple.risk_low')
                      : allocation.strategy.risk_band === 'moderate'
                      ? t('copy:simple.strategy_simple.risk_medium')
                      : t('copy:simple.strategy_simple.risk_high');

                    return (
                      <Card key={allocation.strategy.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold">{allocation.strategy.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {t('copy:simple.strategy_simple.trader_by')} {allocation.strategy.trader_name}
                            </p>
                          </div>
                          <Badge variant={getRiskBadgeVariant(allocation.strategy.risk_band || 'moderate')}>
                            {riskLabel}
                          </Badge>
                        </div>
                        
                        <div className="bg-primary/5 rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {t('copy:simple.wizard.step3.suggested_amount')}:
                            </span>
                            <span className="font-bold text-lg">${allocation.suggested_amount}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {allocation.percentage}% de tu inversión
                          </p>
                        </div>

                        {allocation.reason && (
                          <div className="border-t pt-3">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              {t('copy:simple.wizard.step3.why_this')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {allocation.reason}
                            </p>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                  
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <p className="text-xs text-muted-foreground">
                      💡 <strong>Nota:</strong> {t('copy:simple.wizard.step3.educational_note')}
                    </p>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('copy:wizard.actions.back')}
          </Button>

          {step < 3 ? (
            <Button
              onClick={handleNext}
              disabled={step === 2 && profile.total_investment < 10}
              className="gap-2"
            >
              {t('copy:wizard.actions.next')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="gap-2" disabled={allocations.length === 0}>
              {user ? t('copy:wizard.actions.complete') : 'Solicitar Acceso para Continuar'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
