import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, CheckCircle, AlertTriangle, ExternalLink, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Declare gtag function for analytics (Google Analytics)
declare global {
  function gtag(...args: any[]): void;
}

interface Step3ValidateProps {
  data: {
    email: string;
    affiliation: "verified" | "not_affiliated" | "pending" | null;
    source: "exness" | "demo-bypass" | null;
  };
  onUpdate: (data: { affiliation: "verified" | "not_affiliated" | "pending"; source?: "exness" | "demo-bypass" }) => void;
  onNext: () => void;
  onOpenChangePartner: () => void;
}

const Step3Validate = ({ data, onUpdate, onNext, onOpenChangePartner }: Step3ValidateProps) => {
  const [email, setEmail] = useState(data.email || "");
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    status: "success" | "not_affiliated" | "error";
    message: string;
    source?: string;
  } | null>(data.affiliation ? {
    status: data.affiliation === "verified" ? "success" : "not_affiliated",
    message: data.affiliation === "verified" ? "Afiliación verificada" : "Cuenta no afiliada",
    source: data.source || undefined,
  } : null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email requerido",
        description: "Por favor ingresa tu email de Exness",
        variant: "destructive",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor ingresa un email válido",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setValidationResult(null);

    try {
      // Track analytics
      if (typeof gtag !== "undefined") {
        gtag("event", "access.validation.requested", { email });
      }

      const response = await fetch(`https://xogbavprnnbfamcjrsel.supabase.co/functions/v1/validate-affiliation`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZ2JhdnBybm5iZmFtY2pyc2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNDM3ODQsImV4cCI6MjA3MzkxOTc4NH0.6l1XCkopeKxOPzj9vfYcslB-H-Q-w7F8tPLhGYu-rYw`
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (response.ok) {
        const result = await response.json();
        
        setValidationResult({
          status: "success",
          message: "Afiliación verificada",
          source: result.source || "exness",
        });

        onUpdate({
          affiliation: "verified",
          source: result.source || "exness",
        });

        // Track success
        if (typeof gtag !== "undefined") {
          gtag("event", "access.validation.success", { 
            email, 
            source: result.source 
          });
        }

        toast({
          title: "¡Validación exitosa!",
          description: "Tu afiliación ha sido verificada correctamente",
        });

      } else if (response.status === 403) {
        const error = await response.json();
        
        if (error.code === "NotAffiliated") {
          setValidationResult({
            status: "not_affiliated",
            message: "Tu cuenta de Exness no está afiliada a Tálamo",
          });

          onUpdate({ affiliation: "not_affiliated" });

          // Track not affiliated
          if (typeof gtag !== "undefined") {
            gtag("event", "access.validation.not_affiliated", { email });
          }
        }

      } else if (response.status === 401) {
        setValidationResult({
          status: "error",
          message: "No pudimos autenticar con el bróker. Intenta nuevamente en unos minutos.",
        });

      } else if (response.status === 429) {
        setValidationResult({
          status: "error",
          message: "Demasiadas solicitudes. Intenta nuevamente en 1–2 minutos.",
        });

      } else {
        setValidationResult({
          status: "error",
          message: "Servicio del bróker con incidencias. Reintentaremos pronto.",
        });
      }

    } catch (error) {
      console.error("Validation error:", error);
      setValidationResult({
        status: "error",
        message: "Error de conexión. Verifica tu internet y reintenta.",
      });

    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setValidationResult(null);
    onUpdate({ affiliation: "pending" });
  };

  const handleChangePartner = () => {
    // Track analytics
    if (typeof gtag !== "undefined") {
      gtag("event", "access.validation.change_partner_opened");
    }
    onOpenChangePartner();
  };

  const handleCreateNew = () => {
    // Track analytics
    if (typeof gtag !== "undefined") {
      gtag("event", "access.validation.create_new_clicked");
    }
    window.open("https://one.exnessonelink.com/boarding/sign-up/303589/a/nvle22j1te?lng=es", "_blank");
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Validar afiliación</h2>
        <p className="text-lg text-muted-foreground">
          Ingresa el email de tu cuenta de Exness para verificar la afiliación
        </p>
      </div>

      <form onSubmit={handleValidate} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="validation-email" className="text-base font-medium">
            Email de Exness
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              id="validation-email"
              type="email"
              placeholder="Email registrado en Exness"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 text-base"
              required
              disabled={validationResult?.status === "success"}
            />
          </div>
        </div>

        {!validationResult && (
          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-primary hover:shadow-glow h-12 text-base"
            disabled={isLoading}
            data-event="access.validation.submit"
          >
            {isLoading ? "Validando..." : "Validar afiliación"}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        )}
      </form>

      {/* Results */}
      {validationResult && (
        <div className="space-y-4">
          {validationResult.status === "success" && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">
                    {validationResult.message}
                  </h3>
                  {validationResult.source && (
                    <p className="text-sm text-emerald-700 dark:text-emerald-400">
                      Validado vía {validationResult.source === "demo-bypass" ? "demo" : "Exness"}
                    </p>
                  )}
                  <Button
                    onClick={onNext}
                    className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
                    data-event="access.validation.continue"
                  >
                    Continuar
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {validationResult.status === "not_affiliated" && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-amber-800 dark:text-amber-300">
                      {validationResult.message}
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      Elige una opción:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      onClick={handleChangePartner}
                      variant="outline"
                      className="border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/20"
                      data-event="access.validation.change_partner"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Solicitar cambio de partner
                    </Button>

                    <Button
                      onClick={handleCreateNew}
                      variant="outline"
                      className="border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/20"
                      data-event="access.validation.create_new"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Crear cuenta nueva
                    </Button>
                  </div>

                  <Button
                    onClick={handleRetry}
                    variant="link"
                    className="text-amber-700 dark:text-amber-400 p-0 h-auto font-normal"
                  >
                    Volver a validar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {validationResult.status === "error" && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-4 flex-1">
                  <h3 className="font-semibold text-red-800 dark:text-red-300">
                    {validationResult.message}
                  </h3>
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    className="border-red-300 text-red-800 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                  >
                    Reintentar validación
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Step3Validate;