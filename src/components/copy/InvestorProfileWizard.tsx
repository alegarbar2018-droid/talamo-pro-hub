import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { InvestorProfile, RiskProfile, StrategyRecommendation } from "@/modules/copy/types";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { formatCurrency } from "@/lib/locale";
import { Badge } from "@/components/ui/badge";

interface InvestorProfileWizardProps {
  isOpen: boolean;
  onClose: () => void;
  strategies: any[];
  onRecommendationsReady: (recommendations: StrategyRecommendation[]) => void;
}

export function InvestorProfileWizard({ 
  isOpen, 
  onClose, 
  strategies,
  onRecommendationsReady 
}: InvestorProfileWizardProps) {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<InvestorProfile>>({
    riskTolerance: 5,
    experience: 'beginner',
    investmentHorizon: 'medium'
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Generate recommendations
      const { recommendStrategies } = require('@/lib/recommendStrategies');
      const recommendations = recommendStrategies(
        profile.riskProfile!,
        profile.totalInvestment!,
        strategies
      );
      onRecommendationsReady(recommendations);
      setStep(5); // Show results
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return profile.experience && profile.riskTolerance && profile.investmentHorizon;
      case 2:
        return profile.totalInvestment && profile.totalInvestment >= 100;
      case 3:
        return profile.riskProfile;
      default:
        return true;
    }
  };

  const getRiskProfile = (): RiskProfile => {
    const risk = profile.riskTolerance || 5;
    const exp = profile.experience;
    
    if (risk <= 3 || exp === 'beginner') return 'conservative';
    if (risk >= 7 && exp === 'advanced') return 'aggressive';
    return 'moderate';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {t("copy.wizard.title")}
          </DialogTitle>
          <Progress value={progress} className="mt-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {t("copy.wizard.step")} {step} {t("copy.wizard.of")} {totalSteps}
          </p>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6 py-4">
            <div>
              <h3 className="font-semibold text-lg mb-4">
                {t("copy.wizard.step1.title")}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label>{t("copy.wizard.step1.experience")}</Label>
                  <RadioGroup 
                    value={profile.experience} 
                    onValueChange={(val) => setProfile({...profile, experience: val as any})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-accent">
                      <RadioGroupItem value="beginner" id="beginner" />
                      <Label htmlFor="beginner" className="cursor-pointer flex-1">
                        <div className="font-medium">{t("copy.wizard.step1.beginner")}</div>
                        <p className="text-sm text-muted-foreground">
                          {t("copy.wizard.step1.beginner_desc")}
                        </p>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-accent">
                      <RadioGroupItem value="intermediate" id="intermediate" />
                      <Label htmlFor="intermediate" className="cursor-pointer flex-1">
                        <div className="font-medium">{t("copy.wizard.step1.intermediate")}</div>
                        <p className="text-sm text-muted-foreground">
                          {t("copy.wizard.step1.intermediate_desc")}
                        </p>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-accent">
                      <RadioGroupItem value="advanced" id="advanced" />
                      <Label htmlFor="advanced" className="cursor-pointer flex-1">
                        <div className="font-medium">{t("copy.wizard.step1.advanced")}</div>
                        <p className="text-sm text-muted-foreground">
                          {t("copy.wizard.step1.advanced_desc")}
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>
                    {t("copy.wizard.step1.risk_tolerance")} ({profile.riskTolerance}/10)
                  </Label>
                  <Input 
                    type="range"
                    min="1"
                    max="10"
                    value={profile.riskTolerance}
                    onChange={(e) => setProfile({...profile, riskTolerance: parseInt(e.target.value)})}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{t("copy.wizard.step1.conservative")}</span>
                    <span>{t("copy.wizard.step1.aggressive")}</span>
                  </div>
                </div>

                <div>
                  <Label>{t("copy.wizard.step1.horizon")}</Label>
                  <RadioGroup 
                    value={profile.investmentHorizon} 
                    onValueChange={(val) => setProfile({...profile, investmentHorizon: val as any})}
                    className="mt-2 flex gap-2"
                  >
                    <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-accent flex-1">
                      <RadioGroupItem value="short" id="short" />
                      <Label htmlFor="short" className="cursor-pointer">
                        {t("copy.wizard.step1.short")}
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-accent flex-1">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="cursor-pointer">
                        {t("copy.wizard.step1.medium")}
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-accent flex-1">
                      <RadioGroupItem value="long" id="long" />
                      <Label htmlFor="long" className="cursor-pointer">
                        {t("copy.wizard.step1.long")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 py-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {t("copy.wizard.step2.title")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("copy.wizard.step2.description")}
              </p>
              
              <Label>{t("copy.wizard.step2.amount")} (USD)</Label>
              <Input 
                type="number"
                min="100"
                step="100"
                value={profile.totalInvestment || ''}
                onChange={(e) => setProfile({...profile, totalInvestment: parseFloat(e.target.value)})}
                placeholder="1000"
                className="mt-2 text-lg"
              />

              {profile.totalInvestment && profile.totalInvestment < 500 && (
                <p className="text-sm text-amber-500 mt-2">
                  {t("copy.wizard.step2.low_amount_warning")}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 py-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {t("copy.wizard.step3.title")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("copy.wizard.step3.description")}
              </p>

              <RadioGroup 
                value={getRiskProfile()} 
                onValueChange={(val) => setProfile({...profile, riskProfile: val as RiskProfile})}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="conservative" id="conservative" className="mt-1" />
                  <Label htmlFor="conservative" className="cursor-pointer flex-1">
                    <div className="font-medium mb-1">{t("copy.wizard.step3.conservative")}</div>
                    <p className="text-sm text-muted-foreground">
                      {t("copy.wizard.step3.conservative_desc")}
                    </p>
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="moderate" id="moderate" className="mt-1" />
                  <Label htmlFor="moderate" className="cursor-pointer flex-1">
                    <div className="font-medium mb-1">{t("copy.wizard.step3.moderate")}</div>
                    <p className="text-sm text-muted-foreground">
                      {t("copy.wizard.step3.moderate_desc")}
                    </p>
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="aggressive" id="aggressive" className="mt-1" />
                  <Label htmlFor="aggressive" className="cursor-pointer flex-1">
                    <div className="font-medium mb-1">{t("copy.wizard.step3.aggressive")}</div>
                    <p className="text-sm text-muted-foreground">
                      {t("copy.wizard.step3.aggressive_desc")}
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 py-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {t("copy.wizard.step4.title")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("copy.wizard.step4.description")}
              </p>

              <div className="space-y-4 p-4 rounded-lg border bg-card">
                <div>
                  <h4 className="font-semibold mb-2">{t("copy.wizard.step4.option1")}</h4>
                  <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                    <li>{t("copy.wizard.step4.app_step1")}</li>
                    <li>{t("copy.wizard.step4.app_step2")}</li>
                    <li>{t("copy.wizard.step4.app_step3")}</li>
                    <li>{t("copy.wizard.step4.app_step4")}</li>
                  </ol>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">{t("copy.wizard.step4.option2")}</h4>
                  <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                    <li>{t("copy.wizard.step4.web_step1")}</li>
                    <li>{t("copy.wizard.step4.web_step2")}</li>
                    <li>{t("copy.wizard.step4.web_step3")}</li>
                    <li>{t("copy.wizard.step4.web_step4")}</li>
                  </ol>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => window.open('https://my.exness.com', '_blank')}
                >
                  {t("copy.wizard.step4.go_to_exness")}
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {t("common.back")}
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={!isStepValid()}
            className="gap-2"
          >
            {step === totalSteps ? t("copy.wizard.get_recommendations") : t("common.next")}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
