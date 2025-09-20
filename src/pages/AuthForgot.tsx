import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail } from 'lucide-react';
import { resetPassword } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export default function AuthForgot() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast({
          title: "Error al enviar el enlace",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setSent(true);
      toast({
        title: "Enlace enviado",
        description: "Revisa tu email para restablecer tu contraseña."
      });
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        title: "Error inesperado",
        description: "Ha ocurrido un error. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-line bg-surface">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl text-foreground">
                Enlace Enviado
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Hemos enviado un enlace de restablecimiento a tu email
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.</p>
              <p className="mt-2 font-medium">Email: {email}</p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Volver al inicio de sesión
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setSent(false)}
                className="w-full"
              >
                Enviar otro enlace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-line bg-surface">
        <CardHeader className="space-y-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/login')}
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
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <p className="text-xs text-muted-foreground">
                Debe ser el mismo email que usas para acceder a tu cuenta de Tálamo
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !email.trim()}
            >
              {loading ? "Enviando..." : "Enviar enlace de restablecimiento"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}