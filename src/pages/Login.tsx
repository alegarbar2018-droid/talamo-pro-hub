import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock authentication
    setTimeout(() => {
      if (email && password) {
        localStorage.setItem("user", JSON.stringify({ 
          email, 
          id: "1", 
          name: "Usuario Demo",
          role: "USER",
          isAffiliated: email.includes("demo") 
        }));
        navigate("/dashboard");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tálamo</h1>
          <p className="text-muted-foreground">Trading profesional, sin promesas vacías</p>
        </div>

        <Card className="border-line bg-surface shadow-glow-subtle">
          <CardHeader>
            <CardTitle className="text-foreground">Iniciar Sesión</CardTitle>
            <CardDescription className="text-muted-foreground">
              Accede a tu plataforma de trading profesional
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <Alert className="border-warning/20 bg-warning/10">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-sm text-foreground">
                  Para acceso completo, tu cuenta debe estar afiliada con nuestro partner Exness.
                  <br />
                  <span className="text-xs text-muted-foreground">
                    Usa "demo@email.com" para simular usuario validado.
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
                {isLoading ? "Validando..." : "Iniciar Sesión"}
              </Button>
              
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-teal hover:text-teal-ink"
                  onClick={() => navigate("/register")}
                >
                  ¿No tienes cuenta? Regístrate
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

export default Login;