import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Lock, User, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Declare gtag function for analytics (Google Analytics)  
declare global {
  function gtag(...args: any[]): void;
}

interface Step4CredentialsProps {
  data: {
    email: string;
    affiliation: "verified" | "not_affiliated" | "pending" | null;
  };
  onComplete: () => void;
}

const Step4Credentials = ({ data, onComplete }: Step4CredentialsProps) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    language: "",
    level: "",
    goal: "",
    risk: "",
    assets: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequirements = [
    { test: (pwd: string) => pwd.length >= 8, text: "Mínimo 8 caracteres" },
    { test: (pwd: string) => /[A-Z]/.test(pwd), text: "Una mayúscula" },
    { test: (pwd: string) => /[0-9]/.test(pwd), text: "Un número" },
  ];

  const assetOptions = [
    "Forex (EUR/USD, GBP/USD)",
    "Oro (XAU/USD)",
    "Índices (US30, NAS100)",
    "Petróleo (WTI, Brent)",
    "Criptomonedas",
    "Commodities",
  ];

  const handleAssetChange = (asset: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      assets: checked
        ? [...prev.assets, asset]
        : prev.assets.filter(a => a !== asset),
    }));
  };

  const isPasswordValid = passwordRequirements.every(req => req.test(formData.password));
  const doPasswordsMatch = formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (data.affiliation !== "verified") {
      toast({
        title: "Error de validación",
        description: "Debes validar tu afiliación antes de continuar",
        variant: "destructive",
      });
      return;
    }

    if (!isPasswordValid) {
      toast({
        title: "Contraseña inválida",
        description: "La contraseña no cumple con los requisitos mínimos",
        variant: "destructive",
      });
      return;
    }

    if (!doPasswordsMatch) {
      toast({
        title: "Contraseñas no coinciden",
        description: "Verifica que ambas contraseñas sean iguales",
        variant: "destructive",
      });
      return;
    }

    if (!formData.language || !formData.level || !formData.goal || !formData.risk) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa toda la información del perfil",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/access/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: formData.password,
          profile: {
            language: formData.language,
            level: formData.level,
            goal: formData.goal,
            risk: formData.risk,
            assets: formData.assets,
          },
        }),
      });

      if (response.ok) {
        // Track analytics
        if (typeof gtag !== "undefined") {
          gtag("event", "access.completed", {
            email: data.email,
            level: formData.level,
            goal: formData.goal,
          });
        }

        toast({
          title: "¡Cuenta creada exitosamente!",
          description: "Bienvenido a Tálamo. Redirigiendo a tu panel...",
        });

        setTimeout(() => {
          onComplete();
        }, 1500);

      } else {
        const error = await response.json();
        toast({
          title: "Error al crear cuenta",
          description: error.message || "Ocurrió un error inesperado",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error("Account creation error:", error);
      toast({
        title: "Error de conexión",
        description: "Verifica tu conexión y reintenta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Configurar tu acceso a Tálamo</h2>
        <p className="text-lg text-muted-foreground">
          Crea tu contraseña y completa tu perfil de trader
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contraseña Section */}
        <div className="bg-surface border border-line rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Contraseña de acceso
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Crea una contraseña segura"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Requisitos de contraseña:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle 
                    className={`h-4 w-4 ${req.test(formData.password) ? 'text-emerald-500' : 'text-muted-foreground'}`}
                  />
                  <span className={req.test(formData.password) ? 'text-foreground' : 'text-muted-foreground'}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Perfil Section */}
        <div className="bg-surface border border-line rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil de trader
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Idioma preferido</Label>
              <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nivel de experiencia</Label>
              <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inicial">Inicial</SelectItem>
                  <SelectItem value="intermedio">Intermedio</SelectItem>
                  <SelectItem value="avanzado">Avanzado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Objetivo principal</Label>
              <Select value={formData.goal} onValueChange={(value) => setFormData(prev => ({ ...prev, goal: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intradia">Trading intradía</SelectItem>
                  <SelectItem value="swing">Swing trading</SelectItem>
                  <SelectItem value="mixto">Estrategia mixta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tolerancia al riesgo</Label>
              <Select value={formData.risk} onValueChange={(value) => setFormData(prev => ({ ...prev, risk: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tolerancia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Activos de interés (selecciona todos los que apliquen):</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {assetOptions.map((asset) => (
                <div key={asset} className="flex items-center space-x-2">
                  <Checkbox
                    id={asset}
                    checked={formData.assets.includes(asset)}
                    onCheckedChange={(checked) => handleAssetChange(asset, checked as boolean)}
                  />
                  <Label htmlFor={asset} className="text-sm font-normal cursor-pointer">
                    {asset}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-gradient-primary hover:shadow-glow h-12 text-base"
          disabled={isLoading || !isPasswordValid || !doPasswordsMatch}
          data-event="access.credentials.submit"
        >
          {isLoading ? "Creando cuenta..." : "Acceder a mi panel"}
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </form>
    </div>
  );
};

export default Step4Credentials;