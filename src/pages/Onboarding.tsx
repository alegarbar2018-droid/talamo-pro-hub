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

type OnboardingStep = "choose" | "validate" | "eligible" | "blocked" | "create-password" | "profile" | "done";

interface WizardState {
  step: OnboardingStep;
  email: string;
  uid: string;
  isDemoMode: boolean;
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
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  
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
      isDemoMode
    };
    localStorage.setItem('talamo.wizard.state', JSON.stringify(state));
  };

  // Update URL when step changes
  useEffect(() => {
    setSearchParams({ step });
    saveWizardState(step);
    
    // Analytics tracking
    console.info(`onboarding_view`, { step });
  }, [step, setSearchParams, email, uid, isDemoMode]);

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

          {/* Explainer Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="why-affiliation" className="border-line">
              <AccordionTrigger className="text-left font-medium">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  ¿Por qué pedimos afiliación?
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
                      El acceso a Tálamo es sin membresía porque nuestro modelo se sostiene con rebates 
                      de spread cuando operas con tu cuenta Exness afiliada a Tálamo. No hay costos extra para ti.
                    </p>
                    <p>
                      Así evitamos vender promesas y cursos vacíos: solo ganamos si tú operas con disciplina 
                      a largo plazo. Nuestro foco es ejecución con estructura, métricas y control de riesgo.
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
                        <p className="font-medium text-foreground text-sm">Validación por API</p>
                        <p className="text-xs text-muted-foreground">Solo email/UID, proceso seguro</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground text-sm">Cambio de partner</p>
                        <p className="text-xs text-muted-foreground">Disponible si no estás afiliado</p>
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
      blocked: 3,
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
        {step === "blocked" && renderBlockedStep()}
        {step === "create-password" && renderEligibleStep()}
        {step === "profile" && renderProfileStep()}
        {step === "done" && renderDoneStep()}
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