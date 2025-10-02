import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, ArrowLeft, X } from 'lucide-react';
import { signIn, resetPassword } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showEmergencyReset, setShowEmergencyReset] = useState(false);
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
      console.log('=== LOGIN ATTEMPT START ===');
      console.log('Email:', email);
      console.log('Browser:', navigator.userAgent);
      
      // Check for existing session before login
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      console.log('Existing session found:', !!existingSession);
      
      if (existingSession) {
        console.log('Clearing existing session before new login...');
        await supabase.auth.signOut({ scope: 'local' });
        
        // Small delay to ensure cleanup
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log('Attempting signIn...');
      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.error('SignIn error:', error);
        
        // Track failed attempts
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        
        // Show emergency reset after 2 failed attempts
        if (newFailedAttempts >= 2) {
          setShowEmergencyReset(true);
        }
        
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
        console.log('SignIn successful');
        
        // Reset failed attempts on success
        setFailedAttempts(0);
        setShowEmergencyReset(false);
        
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente."
        });
        
        // Redirect to dashboard after successful login
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      
      if (newFailedAttempts >= 2) {
        setShowEmergencyReset(true);
      }
      
      toast({
        title: "Error inesperado",
        description: "Ha ocurrido un error. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      console.log('=== LOGIN ATTEMPT END ===');
    }
  };

  const handleEmergencyReset = async () => {
    console.log('🚨 Emergency reset triggered');
    
    try {
      // Import cleanup function
      const { forceCleanSession } = await import('@/lib/auth');
      
      // Force sign out
      await supabase.auth.signOut({ scope: 'local' });
      
      // Clean all session data
      forceCleanSession();
      
      toast({
        title: "Sesión limpiada",
        description: "Todos los datos de sesión han sido eliminados. Intenta iniciar sesión nuevamente.",
      });
      
      // Reset states
      setFailedAttempts(0);
      setShowEmergencyReset(false);
      
      // Reload page to start fresh
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error during emergency reset:', error);
      toast({
        title: "Error",
        description: "No se pudo limpiar la sesión. Intenta cerrar y abrir el navegador.",
        variant: "destructive",
      });
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
        {/* Close button to return to home */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="fixed top-4 right-4 z-50 text-muted-foreground hover:text-foreground bg-background/80 backdrop-blur-sm border border-line hover:bg-surface"
        >
          <X className="h-5 w-5" />
        </Button>
        
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
      {/* Close button to return to home */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/')}
        className="fixed top-4 right-4 z-50 text-muted-foreground hover:text-foreground bg-background/80 backdrop-blur-sm border border-line hover:bg-surface"
      >
        <X className="h-5 w-5" />
      </Button>
      
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

          {showEmergencyReset && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive mb-3">
                ¿Problemas para iniciar sesión? Puede haber datos corruptos en tu navegador.
              </p>
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                onClick={handleEmergencyReset}
              >
                🔥 Limpiar datos y reintentar
              </Button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-line">
            <p className="text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link to="/onboarding?step=choose" className="text-teal hover:underline">
                Solicitar acceso
              </Link>
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}