import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  HelpCircle
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PARTNER_ID, PARTNER_LINK } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

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
    <Card className="border-line bg-surface shadow-glow-subtle">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-foreground flex items-center justify-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          Acceso a Tálamo
        </CardTitle>
        <CardDescription>
          Selecciona tu situación para continuar
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
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
          Abrir cuenta en Exness
        </Button>
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          Necesitas una cuenta Exness afiliada con nuestro partner (ID: {PARTNER_ID}) para acceder
        </p>
      </CardContent>
    </Card>
  );

  const renderValidateStep = () => (
    <Card className="border-line bg-surface shadow-glow-subtle">
      <CardHeader>
        <CardTitle className="text-xl text-foreground flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Validar Acceso
        </CardTitle>
        <CardDescription>
          Ingresa el email de tu cuenta Exness para validar afiliación
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email de Exness</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            disabled={!email || loading}
            className="w-full bg-gradient-primary hover:shadow-glow h-11"
          >
            {loading ? "Validando..." : "Validar acceso"}
          </Button>
        </form>
      </CardContent>
    </Card>
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
    <Card className="border-line bg-surface shadow-glow-subtle">
      <CardHeader>
        <CardTitle className="text-xl text-foreground flex items-center gap-2">
          <X className="h-5 w-5 text-destructive" />
          Cuenta no afiliada
        </CardTitle>
        <CardDescription>
          Tu cuenta no está vinculada con nuestro partner en Exness
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Para acceder a Tálamo, tu cuenta debe estar afiliada con nuestro partner ID: <strong>{PARTNER_ID}</strong></p>
        </div>
        
        <div className="space-y-2">
          <Button
            size="lg"
            onClick={handleCreateExnessAccount}
            className="w-full bg-gradient-primary hover:shadow-glow"
          >
            <ExternalLink className="h-5 w-5 mr-2" />
            Abrir cuenta con nuestro enlace
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.location.hash = "partner-change"}
            className="w-full"
          >
            <Users className="h-5 w-5 mr-2" />
            Solicitar cambio de partner
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            onClick={() => setStep("validate")}
            className="w-full"
          >
            Volver a validar
          </Button>
        </div>
        
        <div className="pt-4 border-t border-line">
          <Button
            variant="link"
            size="sm"
            onClick={() => window.location.hash = "faq"}
            className="w-full text-muted-foreground"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ sobre afiliación
          </Button>
        </div>
      </CardContent>
    </Card>
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
    </div>
  );
};

export default Onboarding;