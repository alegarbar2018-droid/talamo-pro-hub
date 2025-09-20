import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  Lightbulb,
  Eye,
  Lock,
  TrendingUp,
  Globe,
  Copy
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PARTNER_ID, PARTNER_LINK } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import ChangePartnerModal from "@/components/access/ChangePartnerModal";

type OnboardingStep = "choose" | "validate" | "eligible" | "create-password" | "profile" | "done";

interface WizardState {
  step: OnboardingStep;
  email: string;
  uid: string;
  isDemoMode: boolean;
  isNotAffiliated: boolean;
}

const Onboarding = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStep = (searchParams.get("step") as OnboardingStep) || "choose";
  
  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profile, setProfile] = useState({
    language: "español",
    level: "",
    objective: "",
    riskTolerance: "",
    interests: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uid, setUid] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isNotAffiliated, setIsNotAffiliated] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [showNewAccountCreated, setShowNewAccountCreated] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('talamo.wizard.state');
    if (savedState) {
      const parsed: WizardState = JSON.parse(savedState);
      if (parsed.step !== initialStep) {
        // Offer to resume
        const shouldResume = window.confirm('Tienes un proceso de acceso iniciado. ¿Quieres continuarlo?');
        if (shouldResume) {
          setStep(parsed.step);
          setEmail(parsed.email);
          setUid(parsed.uid);
          setIsDemoMode(parsed.isDemoMode);
          setIsNotAffiliated(parsed.isNotAffiliated || false);
          setSearchParams({ step: parsed.step });
        } else {
          localStorage.removeItem('talamo.wizard.state');
        }
      }
    }
  }, [initialStep, setSearchParams]);

  // Save state to localStorage
  const saveWizardState = (newStep: OnboardingStep) => {
    const state: WizardState = {
      step: newStep,
      email,
      uid,
      isDemoMode,
      isNotAffiliated
    };
    localStorage.setItem('talamo.wizard.state', JSON.stringify(state));
  };

  // Update URL when step changes
  useEffect(() => {
    setSearchParams({ step });
    saveWizardState(step);
    
    // Analytics tracking
    console.info(`onboarding_view`, { step });
  }, [step, setSearchParams, email, uid, isDemoMode, isNotAffiliated]);

  const submitValidate = async (targetEmail: string) => {
    setError("");
    setIsNotAffiliated(false); // Reset state first
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
        setIsNotAffiliated(false);
        setStep("eligible");
        console.info(`exness_validate_success`, { email: targetEmail, uid: data.client_uid });
      } else {
        // User is not affiliated - show options immediately
        console.info(`User not affiliated, showing options`);
        setIsNotAffiliated(true);
        console.info(`exness_validate_blocked`, { email: targetEmail });
        
        // Force re-render and scroll after state update
        setTimeout(() => {
          const blockB = document.getElementById('block-b-not-affiliated');
          if (blockB) {
            blockB.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    } catch (err: any) {
      setIsNotAffiliated(false); // Reset on error
      if (err?.status === 401) {
        setError("No pudimos autenticarnos con el bróker. Intenta nuevamente en unos minutos.");
      } else if (err?.status === 429) {
        setError("Demasiadas solicitudes. Espera 1–2 minutos y reintenta.");
      } else if (err?.status === 400) {
        setError("Solicitud inválida. Revisa tu correo e inténtalo de nuevo.");
      } else if (err?.status >= 500) {
        setError("Servicio del bróker con incidencias. Intentaremos de nuevo pronto.");
      } else {
        setError("No pudimos validar tu afiliación.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitValidate(email); // Execute validation
  };

  const handleRetryValidation = () => {
    setError("");
    setIsNotAffiliated(false);
    setShowNewAccountCreated(false);
    // Focus on email input
    setTimeout(() => {
      const emailInput = document.getElementById('email');
      if (emailInput) {
        emailInput.focus();
      }
    }, 100);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate password
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }

      if (password.length < 8 || !/(?=.*[A-Z])(?=.*\d)/.test(password)) {
        setError("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número");
        return;
      }

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

  const handleCopyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(""), 2000);
      toast({
        title: "Copiado",
        description: `${label} copiado al portapapeles`,
      });
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Error",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive"
      });
    }
  };

  const handleCreateExnessAccount = () => {
    window.open(PARTNER_LINK, "_blank");
    setShowNewAccountCreated(true);
    console.info(`open_partner_link`);
  };

  const renderChooseStep = () => (
    <div className="space-y-6">
      <Card className="border-line bg-surface shadow-glow-subtle">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground flex items-center justify-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Solicitar Acceso a Tálamo
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
              onClick={handleCreateExnessAccount}
              className="w-full bg-gradient-primary hover:shadow-glow h-12"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Abrir cuenta en Exness
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Al terminar, vuelve para validar tu afiliación y continuar
            </p>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => setStep("validate")}
              className="w-full border-primary text-primary hover:bg-primary/5 h-12"
            >
              <Shield className="h-5 w-5 mr-2" />
              Ya tengo cuenta en Exness
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
              <p className="font-medium text-foreground">Acceso sin membresía</p>
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
      {/* Block A: Validar afiliación */}
      <Card className="border-line bg-surface shadow-glow-subtle">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Ya tengo cuenta en Exness
          </CardTitle>
          <CardDescription>
            Verificaremos que tu cuenta esté afiliada con nuestro partner oficial
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-xl p-6 shadow-glow-subtle backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
                <Info className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-foreground text-lg">Validación segura con API oficial</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Consultaremos directamente la API de Exness para verificar que tu cuenta esté 
                  registrada bajo nuestro partner oficial (<code className="bg-primary/10 text-primary px-2 py-1 rounded font-mono text-sm">{PARTNER_ID}</code>). 
                  Este proceso es completamente seguro, automático y no requiere credenciales.
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Proceso encriptado y privado</span>
                </div>
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
            
            {error && !isNotAffiliated && (
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

          {/* Debug state information */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-2 bg-gray-100 rounded text-xs font-mono">
              Debug: isNotAffiliated={String(isNotAffiliated)}, error="{error}", step="{step}", email="{email}"
            </div>
          )}

          {/* Results for not affiliated - PROMINENT DISPLAY */}
          {isNotAffiliated && (
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-200 border-2 border-amber-300 rounded-xl dark:from-amber-900 dark:via-orange-900 dark:to-amber-800 dark:border-amber-600 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-3">
                      Tu cuenta no está afiliada a Tálamo
                    </h3>
                    <p className="text-base text-amber-800 dark:text-amber-200 mb-4 leading-relaxed">
                      No hay problema. Tienes dos opciones claras para continuar y acceder a la plataforma premium de Tálamo.
                    </p>
                    <div className="flex items-center gap-3 text-amber-700 dark:text-amber-300">
                      <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-amber-900" />
                      </div>
                      <span className="font-semibold text-lg">Ve las opciones disponibles abajo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Explainer Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="why-affiliation" className="border-line">
              <AccordionTrigger className="text-left font-medium">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Acceso por afiliación: por qué lo pedimos
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Acceso por afiliación: incentivos alineados
                  </h4>
                  
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Tálamo no cobra membresía. Nuestro modelo se sostiene con rebates de spread 
                      cuando operas con tu cuenta Exness afiliada a Tálamo. No hay costos extra para ti.
                    </p>
                    <p>
                      Esto alinea incentivos: solo ganamos si tú operas con estructura a largo plazo. 
                      Nuestra prioridad es ejecución con datos y control de riesgo, no vender promesas.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-start gap-2">
                      <Lock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground text-sm">Tu cuenta, tus fondos</p>
                        <p className="text-xs text-muted-foreground">Tálamo nunca opera tu cuenta</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Eye className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground text-sm">Validamos únicamente tu afiliación</p>
                        <p className="text-xs text-muted-foreground">Email/UID por API, proceso seguro</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground text-sm">Cuenta no afiliada</p>
                        <p className="text-xs text-muted-foreground">Puedes crear nueva o solicitar cambio</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Globe className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground text-sm">Transparencia total</p>
                        <p className="text-xs text-muted-foreground">Métricas y advertencias de riesgo</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Block B: OPCIONES PARA CUENTAS NO AFILIADAS */}
      {isNotAffiliated && (
        <div className="mt-8">
          <Card id="block-b-not-affiliated" className="border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:border-amber-600 dark:from-amber-950 dark:via-orange-950 dark:to-amber-900 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                  <HelpCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl text-foreground">
                    🚀 Opciones para continuar
                  </CardTitle>
                  <CardDescription className="text-amber-800 dark:text-amber-200 mt-1 text-lg">
                    Tu cuenta no está afiliada con Tálamo. Elige una opción:
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Option 1: Create new account */}
              <Card className="border-line bg-surface">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    Crear cuenta nueva con nuestro enlace
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Puedes abrir una cuenta Exness bajo nuestra afiliación conservando tus mismos datos personales, 
                    pero con email distinto (Exness no permite dos cuentas con el mismo correo).
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 dark:bg-blue-950 dark:border-blue-800">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm mb-2">
                      Cómo usar un email alternativo:
                    </h4>
                    <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• <strong>Gmail:</strong> tunombre+talamo@gmail.com (alias)</li>
                      <li>• <strong>Outlook/Yahoo/otros:</strong> usar un correo distinto o alias</li>
                    </ul>
                  </div>
                  
                  <Button
                    onClick={handleCreateExnessAccount}
                    className="w-full bg-gradient-primary hover:shadow-glow"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir cuenta en Exness
                  </Button>
                  
                  {showNewAccountCreated && (
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 dark:bg-green-950 dark:border-green-800">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          ¡Perfecto! Cuando termines de crear tu cuenta, vuelve aquí para validar.
                        </p>
                      </div>
                      <Button
                        onClick={handleRetryValidation}
                        variant="outline"
                        className="w-full border-green-500 text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Ya la creé, volver a validar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Option 2: Request partner change */}
              <Card className="border-line bg-surface">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Solicitar cambio de partner
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Solicita a Exness que cambie tu cuenta actual al partner de Tálamo. 
                    Tu historial y fondos no se verán afectados.
                  </p>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        setShowPartnerModal(true);
                        console.info(`partner_change_modal_open`);
                      }}
                      className="w-full bg-gradient-primary hover:shadow-glow"
                    >
                      Solicitar cambio de partner
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    
                    <Button
                      onClick={() => handleCopyText(PARTNER_ID, "Partner ID")}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      {copiedText === "Partner ID" ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          ¡Partner ID copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar Partner ID
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleRetryValidation}
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground"
                  >
                    Volver a validar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
          </Card>
        </div>
      )}
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
      
      <CardContent className="space-y-6">
        {isDemoMode && (
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Modo demo — acceso temporal sin validación por API</span>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-950 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0 dark:text-blue-400" />
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Seguridad y privacidad</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Tu panel es independiente de tu cuenta de trading. Tálamo no accede a tus fondos; 
                solo validamos tu afiliación para proporcionarte acceso sin membresía.
              </p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-medium">Crear contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="bg-input border-line h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-base font-medium">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="bg-input border-line h-11"
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <p>La contraseña debe tener al menos 8 caracteres, incluir una mayúscula y un número.</p>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <Button
            type="submit"
            disabled={
              password.length < 8 || 
              password !== confirmPassword || 
              !/(?=.*[A-Z])(?=.*\d)/.test(password) || 
              loading
            }
            className="w-full bg-gradient-primary hover:shadow-glow h-11"
          >
            {loading ? "Creando cuenta..." : "Continuar al perfil"}
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
                
                <div className="bg-surface border border-line rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-3">Solicitar cambio de partner (3 pasos)</h4>
                  
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <div>
                        <p className="font-medium text-foreground">Abre el chat de soporte en tu Área Personal de Exness</p>
                        <p className="text-muted-foreground">(icono abajo a la derecha)</p>
                      </div>
                    </li>
                    
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Escribe exactamente:</p>
                        <div className="mt-1 flex items-center gap-2 bg-muted p-2 rounded text-xs font-mono">
                          <span>change partner</span>
                          <Button
                            onClick={() => handleCopyText("change partner", "Texto")}
                            size="sm"
                            variant="ghost"
                            className="h-auto p-1"
                          >
                            {copiedText === "Texto" ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                    </li>
                    
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">En el formulario:</p>
                        <ul className="mt-1 space-y-1 text-xs">
                          <li>• Selecciona la cuenta a cambiar</li>
                          <li>• En "Please specify the new partner" pega:</li>
                        </ul>
                        <div className="mt-2 flex items-center gap-2 bg-muted p-2 rounded text-xs font-mono">
                          <span>{PARTNER_ID}</span>
                          <Button
                            onClick={() => handleCopyText(PARTNER_ID, "Partner ID")}
                            size="sm"
                            variant="ghost"
                            className="h-auto p-1"
                          >
                            {copiedText === "Partner ID" ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                        <p className="text-xs mt-1">Motivo sugerido: <em>Quiero afiliar mi cuenta a Tálamo</em></p>
                      </div>
                    </li>
                  </ol>
                  
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Nota:</strong> Cuando Exness confirme el cambio, vuelve y presiona "Volver a validar".
                    </p>
                  </div>
                </div>
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

  const renderProfileStep = () => {
    const handleProfileSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.info(`profile_completed`, { profile });
      setStep("done");
    };

    return (
      <Card className="border-line bg-surface shadow-glow-subtle">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Completar Perfil
          </CardTitle>
          <CardDescription>
            Personaliza tu experiencia en Tálamo según tus objetivos
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level" className="text-base font-medium">Nivel de experiencia</Label>
                <select
                  id="level"
                  value={profile.level}
                  onChange={(e) => setProfile({...profile, level: e.target.value})}
                  required
                  className="w-full h-11 rounded-md border border-line bg-input px-3 py-2 text-sm"
                >
                  <option value="">Selecciona tu nivel</option>
                  <option value="inicial">Inicial</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective" className="text-base font-medium">Objetivo principal</Label>
                <select
                  id="objective"
                  value={profile.objective}
                  onChange={(e) => setProfile({...profile, objective: e.target.value})}
                  required
                  className="w-full h-11 rounded-md border border-line bg-input px-3 py-2 text-sm"
                >
                  <option value="">Selecciona tu objetivo</option>
                  <option value="intraday">Trading intradía</option>
                  <option value="swing">Swing trading</option>
                  <option value="scalping">Scalping</option>
                  <option value="mixed">Combinado</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskTolerance" className="text-base font-medium">Tolerancia al riesgo</Label>
              <select
                id="riskTolerance"
                value={profile.riskTolerance}
                onChange={(e) => setProfile({...profile, riskTolerance: e.target.value})}
                required
                className="w-full h-11 rounded-md border border-line bg-input px-3 py-2 text-sm"
              >
                <option value="">Selecciona tu tolerancia</option>
                <option value="conservador">Conservador (1-2% por operación)</option>
                <option value="moderado">Moderado (2-3% por operación)</option>
                <option value="agresivo">Agresivo (3-5% por operación)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Activos de interés (selecciona varios)</Label>
              <div className="grid grid-cols-2 gap-2">
                {['XAUUSD', 'EURUSD', 'GBPUSD', 'USOIL', 'US30', 'US500', 'BTCUSD', 'Crypto'].map((asset) => (
                  <label key={asset} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.interests.includes(asset)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProfile({...profile, interests: [...profile.interests, asset]});
                        } else {
                          setProfile({...profile, interests: profile.interests.filter(i => i !== asset)});
                        }
                      }}
                      className="rounded border-line"
                    />
                    <span className="text-sm">{asset}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={!profile.level || !profile.objective || !profile.riskTolerance}
              className="w-full bg-gradient-primary hover:shadow-glow h-11"
            >
              Acceder a mi panel
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  const renderDoneStep = () => (
    <Card className="border-line bg-surface shadow-glow-subtle">
      <CardHeader>
        <CardTitle className="text-xl text-foreground flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          ¡Bienvenido a Tálamo!
        </CardTitle>
        <CardDescription>
          Tu cuenta ha sido configurada exitosamente
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 dark:bg-green-950 dark:border-green-800">
          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Próximos pasos:</h3>
          <ul className="space-y-1 text-sm text-green-800 dark:text-green-200">
            <li>✓ Explora la Academia estructurada</li>
            <li>✓ Configura tu Journal de trading</li>
            <li>✓ Revisa las herramientas disponibles</li>
            <li>✓ Únete a la comunidad</li>
          </ul>
        </div>
        
        <Button
          onClick={() => {
            localStorage.removeItem('talamo.wizard.state');
            navigate("/dashboard");
          }}
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
      "create-password": 3,
      profile: 4,
      done: 5
    };
    return stepMap[step];
  };

  const progress = (getStepNumber() / 5) * 100;

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
                <p className="text-sm text-muted-foreground">Paso {getStepNumber()} de 5</p>
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
        {step === "create-password" && renderEligibleStep()}
        {step === "profile" && renderProfileStep()}
        {step === "done" && renderDoneStep()}
      </div>
      
      {/* Change Partner Modal */}
      <ChangePartnerModal 
        isOpen={showPartnerModal} 
        onClose={() => setShowPartnerModal(false)}
        onRetryValidation={handleRetryValidation}
      />
    </div>
  );
};

export default Onboarding;