import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  AlertTriangle,
  Shield,
  ExternalLink,
  X,
  Target,
  Users,
  HelpCircle,
  Info,
  Lightbulb
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PARTNER_ID, PARTNER_LINK } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import ChangePartnerModal from "@/components/access/ChangePartnerModal";

type OnboardingStep = "choose" | "validate" | "eligible" | "blocked" | "create-password" | "profile";

const Onboarding = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStep = (searchParams.get("step") as OnboardingStep) || "choose";
  
  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uid, setUid] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Update URL when step changes
  useEffect(() => {
    setSearchParams({ step });
    
    // Analytics tracking
    console.info(`onboarding_view`, { step });
  }, [step, setSearchParams]);

  const submitValidate = async (targetEmail: string) => {
    setError("");
    setLoading(true);
    
    console.info(`exness_validate_attempt`, { email: targetEmail });
    
    try {
      // Check for demo mode
      if (targetEmail.toLowerCase().includes("demo") || targetEmail.toLowerCase().includes("exness")) {
        setIsDemoMode(true);
        setStep("eligible");
        console.info(`demo_access`, { email: targetEmail });
        toast({
          title: "Modo Demo Activado",
          description: "Acceso temporal sin validación por API",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('validate-affiliation', {
        body: { email: targetEmail }
      });

      if (error) throw error;

      if (data?.affiliation === true) {
        setUid(data.client_uid || "");
        setStep("eligible");
        console.info(`exness_validate_success`, { email: targetEmail, uid: data.client_uid });
      } else {
        setStep("blocked");
        setError("Tu correo no está afiliado a nuestro partner en Exness.");
        console.info(`exness_validate_blocked`, { email: targetEmail });
      }
    } catch (err: any) {
      if (err?.status === 401) {
        setError("No autenticado (401)");
      } else if (err?.status === 429) {
        setError("Muchas solicitudes (429)");
      } else if (err?.status === 400) {
        setError("Solicitud inválida (400)");
      } else {
        setError("No pudimos validar tu afiliación.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("validate"); // Force validation state
    await submitValidate(email); // Execute validation
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // For demo mode, skip real registration
      if (isDemoMode) {
        setStep("profile");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: { uid }
        }
      });

      if (error) throw error;

      console.info(`register_success`, { email });
      setStep("profile");
      
    } catch (err: any) {
      setError(err.message || "Error al crear cuenta");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExnessAccount = () => {
    window.open(PARTNER_LINK, "_blank");
  };

  const renderChooseStep = () => (
    <div className="space-y-6">
      <Card className="border-line bg-surface shadow-glow-subtle">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground flex items-center justify-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Acceso a Tálamo
          </CardTitle>
          <CardDescription className="text-base">
            Plataforma premium de análisis y herramientas de trading para traders de Exness
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">¿Qué necesito para acceder?</h3>
                <p className="text-sm text-muted-foreground">
                  Una cuenta de Exness afiliada con nuestro partner oficial. Si ya tienes cuenta, 
                  validaremos tu afiliación. Si no, te ayudamos a crear una nueva.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              size="lg"
              onClick={() => setStep("validate")}
              className="w-full bg-gradient-primary hover:shadow-glow h-12"
            >
              <Shield className="h-5 w-5 mr-2" />
              Ya tengo cuenta en Exness
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={handleCreateExnessAccount}
              className="w-full border-primary text-primary hover:bg-primary/5 h-12"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Crear cuenta nueva en Exness
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Partner ID oficial: <code className="bg-muted px-1 rounded">{PARTNER_ID}</code>
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-warning/20 bg-warning/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Acceso sin costo</p>
              <p className="text-muted-foreground mt-1">
                Tálamo es completamente gratuito para cuentas afiliadas. No hay tarifas ni membresías.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderValidateStep = () => (
    <div className="space-y-6">
      <Card className="border-line bg-surface shadow-glow-subtle">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Validar Acceso
          </CardTitle>
          <CardDescription>
            Verificaremos que tu cuenta esté afiliada con nuestro partner oficial
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-950 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0 dark:text-blue-400" />
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Proceso de validación</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Consultaremos la API oficial de Exness para verificar que tu cuenta esté 
                  registrada bajo nuestro partner ID ({PARTNER_ID}). Este proceso es seguro y automático.
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium">
                Email de tu cuenta Exness
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input border-line h-11"
              />
              <p className="text-xs text-muted-foreground">
                Debe ser el mismo email que usas para acceder a tu cuenta de Exness
              </p>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <Button
              type="submit"
              disabled={!email || loading}
              className="w-full bg-gradient-primary hover:shadow-glow h-11"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Validando con API de Exness...
                </div>
              ) : (
                "Validar afiliación"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderEligibleStep = () => (
    <Card className="border-line bg-surface shadow-glow-subtle">
      <CardHeader>
        <CardTitle className="text-xl text-foreground flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          {isDemoMode ? "Acceso Demo" : "Acceso Verificado"}
        </CardTitle>
        <CardDescription>
          {isDemoMode 
            ? "Tienes acceso temporal para probar Tálamo" 
            : "Tu cuenta está afiliada correctamente"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isDemoMode && (
          <div className="mb-4 p-3 bg-orange-100 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Modo demo — acceso temporal sin validación por API</span>
            </div>
          </div>
        )}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Crear contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-input border-line"
            />
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            disabled={password.length < 6 || loading}
            className="w-full bg-gradient-primary hover:shadow-glow h-11"
          >
            {loading ? "Creando cuenta..." : "Acceder a mi panel"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderBlockedStep = () => (
    <div className="space-y-6">
      <Card className="border-line bg-surface shadow-glow-subtle">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Cuenta no afiliada
          </CardTitle>
          <CardDescription>
            Tu cuenta no está vinculada con nuestro partner en Exness
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 dark:bg-amber-950 dark:border-amber-800">
            <div className="space-y-3">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">¿Por qué no puedo acceder?</h3>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Para acceder a Tálamo sin costo, tu cuenta debe estar registrada bajo nuestro partner oficial 
                (ID: <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded font-mono">{PARTNER_ID}</code>). 
                Esto nos permite verificar tu elegibilidad y proporcionarte acceso gratuito.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-3">Elige una opción para continuar:</h4>
              <div className="space-y-3">
                <Button
                  size="lg"
                  onClick={handleCreateExnessAccount}
                  className="w-full bg-gradient-primary hover:shadow-glow justify-between"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    <div className="text-left">
                      <div>Crear cuenta nueva</div>
                      <div className="text-xs opacity-80">Recomendado - Acceso inmediato</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowPartnerModal(true)}
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <div className="text-left">
                      <div>Cambiar mi partner actual</div>
                      <div className="text-xs opacity-60">Si ya tengo cuenta en Exness</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={() => setStep("validate")}
                className="text-muted-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a validar
              </Button>
              
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate("/guide/change-partner")}
                className="text-muted-foreground"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Guía detallada
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100">¿Necesitas ayuda?</p>
              <p className="text-blue-800 dark:text-blue-200 mt-1">
                El proceso de cambio de partner es sencillo y lo gestiona directamente Exness. 
                Tu historial de trading y fondos no se verán afectados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProfileStep = () => (
    <Card className="border-line bg-surface shadow-glow-subtle">
      <CardHeader>
        <CardTitle className="text-xl text-foreground flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          ¡Cuenta creada!
        </CardTitle>
        <CardDescription>
          Tu cuenta ha sido configurada exitosamente
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center py-4">
          <p className="text-muted-foreground">
            Redirigiendo a tu panel...
          </p>
        </div>
        
        <Button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-gradient-primary hover:shadow-glow h-11"
        >
          Ir a mi panel
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );

  const getStepNumber = () => {
    const stepMap = {
      choose: 1,
      validate: 2,
      eligible: 3,
      blocked: 3,
      "create-password": 3,
      profile: 4
    };
    return stepMap[step];
  };

  const progress = (getStepNumber() / 4) * 100;

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
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Solicitar acceso</h1>
                <p className="text-sm text-muted-foreground">Paso {getStepNumber()} de 4</p>
              </div>
            </div>
            <Badge variant="outline" className="border-primary text-primary">
              Tálamo
            </Badge>
          </div>
          <div className="pb-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === "choose" && renderChooseStep()}
        {step === "validate" && renderValidateStep()}
        {step === "eligible" && renderEligibleStep()}
        {step === "blocked" && renderBlockedStep()}
        {step === "create-password" && renderEligibleStep()}
        {step === "profile" && renderProfileStep()}
      </div>
      
      {/* Change Partner Modal */}
      <ChangePartnerModal
        isOpen={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
      />
    </div>
  );
};

export default Onboarding;