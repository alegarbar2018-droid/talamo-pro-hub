import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { signIn, resetPassword } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Pre-fill email from URL params if provided
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Error de inicio de sesión",
          description: error.message === 'Invalid login credentials' 
            ? "Credenciales incorrectas. Verifica tu email y contraseña."
            : error.message,
          variant: "destructive"
        });
        return;
      }

      if (data.user) {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente."
        });
        
        // Redirect to dashboard after successful login
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error inesperado",
        description: "Ha ocurrido un error. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      const { error } = await resetPassword(resetEmail);
      
      if (error) {
        toast({
          title: "Error al enviar el enlace",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Enlace enviado",
        description: "Revisa tu email para restablecer tu contraseña."
      });
      setShowResetForm(false);
      setResetEmail('');
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        title: "Error inesperado",
        description: "Ha ocurrido un error. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setResetLoading(false);
    }
  };

  if (showResetForm) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-line bg-surface">
          <CardHeader className="space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowResetForm(false)}
              className="w-fit p-0 h-auto text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio de sesión
            </Button>
            <CardTitle className="text-2xl text-foreground">Restablecer contraseña</CardTitle>
            <CardDescription className="text-muted-foreground">
              Introduce tu email para recibir un enlace de restablecimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-foreground">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="tu@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="bg-background border-line text-foreground"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={resetLoading || !resetEmail.trim()}
              >
                {resetLoading ? "Enviando..." : "Enviar enlace"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-line bg-surface">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-foreground">Iniciar sesión</CardTitle>
          <CardDescription className="text-muted-foreground">
            Accede a tu cuenta de Tálamo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-line text-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background border-line text-foreground pr-10"
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

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/auth/forgot')}
                className="text-sm text-teal hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !email.trim() || !password.trim()}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-line">
            <p className="text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link to="/onboarding?step=choose" className="text-teal hover:underline">
                Solicitar acceso
              </Link>
            </p>
          </div>

          <Alert className="mt-4 border-warning/20 bg-warning/5">
            <AlertDescription className="text-sm text-muted-foreground">
              <strong>Prueba con:</strong> demo@email.com para acceso rápido
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}