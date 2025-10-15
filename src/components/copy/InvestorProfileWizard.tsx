import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import { recommendStrategies } from '@/lib/recommendStrategies';
import type { InvestorProfile, InvestorRiskProfile, StrategyAllocation, CopyStrategy } from '@/modules/copy/types';

interface InvestorProfileWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete?: (allocations: StrategyAllocation[]) => void;
}

export const InvestorProfileWizard = ({ open, onClose, onComplete }: InvestorProfileWizardProps) => {
  const [step, setStep] = useState(1);
  const [allocations, setAllocations] = useState<StrategyAllocation[]>([]);
  const [profile, setProfile] = useState<InvestorProfile>({
    risk_profile: 'moderate',
    total_investment: 100,
    experience: 'beginner',
    risk_tolerance: 5,
    investment_horizon: 'medium'
  });
  
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
    onComplete?.(allocations);
    onClose();
    setStep(1); // Reset para próxima vez
  };

  const updateProfile = (updates: Partial<InvestorProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const getRiskProfileLabel = (risk: InvestorRiskProfile) => {
    const labels = {
      conservative: 'Conservador',
      moderate: 'Moderado',
      aggressive: 'Agresivo'
    };
    return labels[risk];
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Definir Perfil de Inversionista
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
          {/* Step 1: Perfil de Riesgo */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Paso 1: Perfil de Riesgo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Define tu tolerancia al riesgo y horizonte de inversión
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Experiencia en Trading</Label>
                  <Select
                    value={profile.experience}
                    onValueChange={(v) => updateProfile({ experience: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Principiante</SelectItem>
                      <SelectItem value="intermediate">Intermedio</SelectItem>
                      <SelectItem value="advanced">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Horizonte de Inversión</Label>
                  <Select
                    value={profile.investment_horizon}
                    onValueChange={(v) => updateProfile({ investment_horizon: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Corto plazo (&lt;6 meses)</SelectItem>
                      <SelectItem value="medium">Mediano plazo (6-18 meses)</SelectItem>
                      <SelectItem value="long">Largo plazo (&gt;18 meses)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tolerancia al Riesgo: {profile.risk_tolerance}/10</Label>
                  <Slider
                    value={[profile.risk_tolerance]}
                    onValueChange={([v]) => updateProfile({ risk_tolerance: v })}
                    min={1}
                    max={10}
                    step={1}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    1 = Muy conservador | 10 = Muy agresivo
                  </p>
                </div>

                <Card className="p-3 bg-muted/50">
                  <p className="text-sm">
                    <strong>Perfil calculado:</strong>{' '}
                    <Badge variant="outline">
                      {getRiskProfileLabel(
                        profile.risk_tolerance <= 3 ? 'conservative' : 
                        profile.risk_tolerance <= 7 ? 'moderate' : 'aggressive'
                      )}
                    </Badge>
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* Step 2: Monto Total */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Paso 2: Monto de Inversión</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Define cuánto capital deseas asignar al copy trading
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Monto Total (USD)</Label>
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
                    Mínimo: $10 USD
                  </p>
                </div>

                <Card className="p-4 bg-primary/5 border-primary/20">
                  <h4 className="font-semibold text-sm mb-2">Recomendaciones de Diversificación</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Distribuye entre al menos 3 estrategias descorrelacionadas</li>
                    <li>• No asignes más del 40% a una sola estrategia</li>
                    <li>• Considera diferentes símbolos y estilos de trading</li>
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {/* Step 3: Asignación Sugerida */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Paso 3: Asignación Sugerida</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Basado en tu perfil, te sugerimos estas estrategias
                </p>
              </div>

              {loadingStrategies ? (
                <Card className="p-4 bg-muted/50">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm text-muted-foreground">Calculando asignaciones óptimas...</p>
                  </div>
                </Card>
              ) : allocations.length === 0 ? (
                <Card className="p-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground text-center">
                    No se encontraron estrategias compatibles con tu perfil.
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Intenta ajustar tu monto de inversión o perfil de riesgo.
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {allocations.map((allocation) => (
                    <Card key={allocation.strategy.id} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">{allocation.strategy.name}</h4>
                          <p className="text-xs text-muted-foreground">{allocation.strategy.description}</p>
                        </div>
                        <Badge variant="outline">{allocation.strategy.risk_band}</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Monto sugerido:</span>
                          <span className="font-semibold ml-2">${allocation.suggested_amount}</span>
                          <span className="text-muted-foreground ml-1">({allocation.percentage}%)</span>
                        </div>
                      </div>
                      {allocation.reason && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {allocation.reason}
                        </p>
                      )}
                    </Card>
                  ))}
                  
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <p className="text-xs text-muted-foreground">
                      <strong>Nota educativa:</strong> Esta es una sugerencia basada en tu perfil. 
                      Puedes ajustar montos manualmente. Recuerda diversificar y no asignar más del 40% 
                      a una sola estrategia.
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
            Atrás
          </Button>

          {step < 3 ? (
            <Button
              onClick={handleNext}
              disabled={step === 2 && profile.total_investment < 10}
              className="gap-2"
            >
              Siguiente
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="gap-2">
              Ver Estrategias
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
