import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, ArrowRight, AlertTriangle, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthGate() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleValidateAccess = () => {
    const email = user?.email || '';
    navigate(`/onboarding?step=validate&email=${encodeURIComponent(email)}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-line bg-surface">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl text-foreground">
              Validación de Afiliación Requerida
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Para acceder a Tálamo, necesitas completar la validación de afiliación con Exness
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-primary/20 bg-primary/5">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-muted-foreground">
              <span className="font-semibold text-foreground">Acceso por afiliación:</span> Tálamo requiere que tu cuenta de Exness esté afiliada con nuestro partner oficial para garantizar el acceso a la plataforma premium.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <span className="font-medium text-foreground">Tu cuenta:</span> {user?.email}
              </p>
              <p>
                Validaremos que tu cuenta de Exness esté registrada bajo nuestro partner oficial para proceder.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleValidateAccess}
                className="w-full bg-gradient-primary hover:shadow-glow h-12"
                size="lg"
              >
                <Shield className="h-5 w-5 mr-2" />
                Ir a validar afiliación
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              <div className="text-center">
                <Button 
                  variant="link" 
                  onClick={() => navigate('/onboarding?step=choose')}
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  <Users className="h-4 w-4 mr-2" />
                  ¿No tienes cuenta en Exness? Solicitar acceso
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-line">
            <div className="flex justify-between items-center text-sm">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Volver al inicio
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                Cerrar sesión
              </Button>
            </div>
          </div>

          <Alert className="border-warning/20 bg-warning/5">
            <AlertDescription className="text-sm">
              <span className="font-medium">¿Olvidaste tu contraseña?</span>{' '}
              <Button 
                variant="link" 
                onClick={() => navigate('/auth/forgot')} 
                className="h-auto p-0 text-warning hover:underline"
              >
                Restablecer contraseña
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}