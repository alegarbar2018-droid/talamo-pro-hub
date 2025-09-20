import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    if (!formData.acceptTerms) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }

    setIsLoading(true);
    
    // Mock registration
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({
        email: formData.email,
        name: formData.name,
        id: "1",
        role: "USER",
        isAffiliated: formData.email.includes("demo")
      }));
      navigate("/onboarding");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tálamo</h1>
          <p className="text-muted-foreground">Únete a la comunidad de trading profesional</p>
        </div>

        <Card className="border-line bg-surface shadow-glow-subtle">
          <CardHeader>
            <CardTitle className="text-foreground">Crear Cuenta</CardTitle>
            <CardDescription className="text-muted-foreground">
              Comienza tu camino hacia el trading profesional
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Nombre completo
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre completo"
                  required
                  className="bg-input border-line focus:border-teal focus:ring-teal"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  required
                  className="bg-input border-line focus:border-teal focus:ring-teal"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="bg-input border-line focus:border-teal focus:ring-teal pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirmar contraseña
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="bg-input border-line focus:border-teal focus:ring-teal"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, acceptTerms: checked as boolean })
                  }
                />
                <label htmlFor="terms" className="text-sm text-foreground">
                  Acepto los{" "}
                  <Button variant="link" className="p-0 h-auto text-teal">
                    términos y condiciones
                  </Button>{" "}
                  y la{" "}
                  <Button variant="link" className="p-0 h-auto text-teal">
                    política de privacidad
                  </Button>
                </label>
              </div>

              <Alert className="border-warning/20 bg-warning/10">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-sm text-foreground">
                  Necesitarás una cuenta Exness afiliada para acceso completo.
                  <br />
                  <span className="text-xs text-muted-foreground">
                    Usa "demo@email.com" para simular validación exitosa.
                  </span>
                </AlertDescription>
              </Alert>
            </CardContent>
            
            <CardFooter className="space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:shadow-glow"
                disabled={isLoading}
              >
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
              
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-teal hover:text-teal-ink"
                  onClick={() => navigate("/login")}
                >
                  ¿Ya tienes cuenta? Inicia sesión
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>El trading de CFDs conlleva un alto riesgo de pérdida</p>
          <p>Entre el 74-89% de cuentas minoristas pierden dinero</p>
        </div>
      </div>
    </div>
  );
};

export default Register;