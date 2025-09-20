import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertTriangle, Shield } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface EligibleStepProps {
  email: string;
  password: string;
  confirmPassword: string;
  isDemoMode: boolean;
  uid: string;
  loading: boolean;
  error: string;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
  onSuccess: () => void;
}

export const EligibleStep = ({
  email,
  password,
  confirmPassword,
  isDemoMode,
  uid,
  loading,
  error,
  onPasswordChange,
  onConfirmPasswordChange,
  onError,
  onLoading,
  onSuccess
}: EligibleStepProps) => {
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    onLoading(true);
    
    try {
      // Validate password
      if (password !== confirmPassword) {
        onError("Las contraseñas no coinciden");
        return;
      }

      if (password.length < 8 || !/(?=.*[A-Z])(?=.*\d)/.test(password)) {
        onError("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número");
        return;
      }

      // For demo mode, skip real registration
      if (isDemoMode) {
        onSuccess();
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
      onSuccess();
      
    } catch (err: any) {
      onError(err.message || "Error al crear cuenta");
    } finally {
      onLoading(false);
    }
  };

  return (
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
                onChange={(e) => onPasswordChange(e.target.value)}
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
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
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
};