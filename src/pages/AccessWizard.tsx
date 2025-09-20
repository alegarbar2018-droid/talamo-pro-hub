import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X } from "lucide-react";
import Step1Identify from "@/components/access/Step1Identify";
import Step2Experience from "@/components/access/Step2Experience";
import Step3Preferences from "@/components/access/Step3Preferences";
import Step4RiskProfile from "@/components/access/Step4RiskProfile";
import Step5Requirement from "@/components/access/Step5Requirement";
import Step3Validate from "@/components/access/Step3Validate";
import Step4Credentials from "@/components/access/Step4Credentials";
import ChangePartnerModal from "@/components/access/ChangePartnerModal";

const AccessWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [wizardData, setWizardData] = useState({
    name: "",
    email: "",
    experience: "",
    tradingStyle: "",
    riskProfile: "",
    affiliation: null as "verified" | "not_affiliated" | "pending" | null,
    source: null as "exness" | "demo-bypass" | null,
  });

  // Load state from localStorage on mount
  useEffect(() => {
    const savedStep = localStorage.getItem("talamo.access.step");
    const savedName = localStorage.getItem("talamo.access.name");
    const savedEmail = localStorage.getItem("talamo.access.email");
    const savedExperience = localStorage.getItem("talamo.access.experience");
    const savedTradingStyle = localStorage.getItem("talamo.access.tradingStyle");
    const savedRiskProfile = localStorage.getItem("talamo.access.riskProfile");
    const savedAffiliation = localStorage.getItem("talamo.access.affiliation");
    const savedSource = localStorage.getItem("talamo.access.source");

    if (savedStep) setCurrentStep(parseInt(savedStep));
    if (savedName || savedEmail || savedExperience || savedTradingStyle || savedRiskProfile) {
      setWizardData(prev => ({
        ...prev,
        name: savedName || "",
        email: savedEmail || "",
        experience: savedExperience || "",
        tradingStyle: savedTradingStyle || "",
        riskProfile: savedRiskProfile || "",
        affiliation: savedAffiliation as any,
        source: savedSource as any,
      }));
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("talamo.access.step", currentStep.toString());
    if (wizardData.name) localStorage.setItem("talamo.access.name", wizardData.name);
    if (wizardData.email) localStorage.setItem("talamo.access.email", wizardData.email);
    if (wizardData.experience) localStorage.setItem("talamo.access.experience", wizardData.experience);
    if (wizardData.tradingStyle) localStorage.setItem("talamo.access.tradingStyle", wizardData.tradingStyle);
    if (wizardData.riskProfile) localStorage.setItem("talamo.access.riskProfile", wizardData.riskProfile);
    if (wizardData.affiliation) localStorage.setItem("talamo.access.affiliation", wizardData.affiliation);
    if (wizardData.source) localStorage.setItem("talamo.access.source", wizardData.source);
  }, [currentStep, wizardData]);

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateWizardData = (data: Partial<typeof wizardData>) => {
    setWizardData(prev => ({ ...prev, ...data }));
  };

  const clearProgress = () => {
    localStorage.removeItem("talamo.access.step");
    localStorage.removeItem("talamo.access.name");
    localStorage.removeItem("talamo.access.email");
    localStorage.removeItem("talamo.access.experience");
    localStorage.removeItem("talamo.access.tradingStyle");
    localStorage.removeItem("talamo.access.riskProfile");
    localStorage.removeItem("talamo.access.affiliation");
    localStorage.removeItem("talamo.access.source");
  };

  const handleExit = () => {
    clearProgress();
    navigate("/");
  };

  const progress = (currentStep / 7) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-line bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExit}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Acceso por afiliación</h1>
                <p className="text-sm text-muted-foreground">Paso {currentStep} de 7</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {currentStep > 1 && (
                <Button variant="ghost" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
              )}
            </div>
          </div>
          <div className="pb-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 1 && (
          <Step1Identify
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={nextStep}
          />
        )}
        
        {currentStep === 2 && (
          <Step2Experience
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={nextStep}
          />
        )}
        
        {currentStep === 3 && (
          <Step3Preferences
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={nextStep}
          />
        )}
        
        {currentStep === 4 && (
          <Step4RiskProfile
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={nextStep}
          />
        )}
        
        {currentStep === 5 && (
          <Step5Requirement
            onNext={nextStep}
            onValidateNow={() => setCurrentStep(6)}
          />
        )}
        
        {currentStep === 6 && (
          <Step3Validate
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={nextStep}
            onOpenChangePartner={() => setShowPartnerModal(true)}
          />
        )}
        
        {currentStep === 7 && (
          <Step4Credentials
            data={wizardData}
            onComplete={() => {
              clearProgress();
              navigate("/dashboard");
            }}
          />
        )}
      </div>

      {/* Change Partner Modal */}
      <ChangePartnerModal
        isOpen={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
      />
    </div>
  );
};

export default AccessWizard;