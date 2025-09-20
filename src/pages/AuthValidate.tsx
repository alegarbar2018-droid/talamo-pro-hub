import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  TrendingUp, 
  Users, 
  Calculator,
  AlertTriangle,
  CheckCircle,
  Copy,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Target,
  Activity,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ValidationResult {
  isAffiliated: boolean;
  partnerId?: string | null;
  partnerIdMatch: boolean;
  clientUid?: string | null;
  accounts?: string[];
}

export default function AuthValidatePage() {
  const [email, setEmail] = useState('');
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email requerido",
        description: "Por favor introduce tu email de Exness",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Use mock API that simulates real validation
      const { mockValidateAffiliation } = await import('@/lib/mockApi');
      const data = await mockValidateAffiliation(email.trim(), uid.trim() || undefined);

      setResult(data);

      if (data.isAffiliated && data.partnerIdMatch) {
        // Store validation status
        localStorage.setItem("isValidated", "true");
        
        toast({
          title: "✅ ¡Validación exitosa!",
          description: "Tu cuenta está correctamente afiliada a nuestro partner.",
        });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        toast({
          title: "Cuenta no afiliada",
          description: "Tu cuenta no está afiliada a nuestro partner. Sigue las instrucciones para cambiarla.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast({
        title: "Error de validación",
        description: "Ha ocurrido un error. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-line bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tálamo</h1>
              <p className="text-muted-foreground">Validación de afiliación con Exness</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Validation Form */}
        <Card className="border-line bg-surface mb-8">
          <CardHeader>
            <CardTitle className="text-foreground">
              Validar tu cuenta de Exness
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Introduce los datos de tu cuenta para verificar la afiliación con nuestro partner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleValidation} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email de tu cuenta Exness *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="bg-background border-line text-foreground"
                  />
                  <p className="text-xs text-muted-foreground">
                    El mismo email que usas para acceder a tu área personal de Exness
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uid" className="text-foreground">
                    UID de cliente (opcional)
                  </Label>
                  <Input
                    id="uid"
                    type="text"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    placeholder="123456789"
                    className="bg-background border-line text-foreground"
                  />
                  <p className="text-xs text-muted-foreground">
                    Puedes encontrar tu UID en tu área personal de Exness
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Validando..." : "Validar afiliación"}
              </Button>
            </form>

            {/* Demo hint */}
            <Alert className="mt-6 border-teal/20 bg-teal/5">
              <CheckCircle className="h-4 w-4 text-teal" />
              <AlertDescription className="text-sm">
                <strong>Para demo:</strong> Usa demo@email.com o cualquier email que contenga "exness" o "demo"
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Validation Result */}
        {result && (
          <Card className={`border-line bg-surface mb-8 ${
            result.isAffiliated && result.partnerIdMatch 
              ? 'border-green-500/20 bg-green-500/5' 
              : 'border-red-500/20 bg-red-500/5'
          }`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${
                result.isAffiliated && result.partnerIdMatch ? 'text-green-600' : 'text-red-600'
              }`}>
                {result.isAffiliated && result.partnerIdMatch ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
                {result.isAffiliated && result.partnerIdMatch 
                  ? '¡Validación exitosa!' 
                  : 'Cuenta no afiliada'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.isAffiliated && result.partnerIdMatch ? (
                <div className="space-y-4">
                  <p className="text-foreground">
                    Tu cuenta está correctamente afiliada a nuestro partner. Ahora tienes acceso completo a Tálamo.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Partner ID:</span>
                      <p className="font-mono text-teal">{result.partnerId}</p>
                    </div>
                    {result.clientUid && (
                      <div>
                        <span className="text-muted-foreground">Client UID:</span>
                        <p className="font-mono">{result.clientUid}</p>
                      </div>
                    )}
                  </div>
                  <Button onClick={() => navigate('/dashboard')} className="w-full">
                    Ir al Panel de Control
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-foreground">
                    Tu cuenta no está afiliada a nuestro partner. Para acceder a Tálamo de forma gratuita, 
                    necesitas cambiar tu Partner ID.
                  </p>
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => window.open('/auth/exness?flow=create', '_blank')}
                      className="flex-1"
                    >
                      Crear cuenta en Exness
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowModal(true)}
                      className="flex-1"
                    >
                      Cambiar partner ID
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="border-line bg-surface">
          <CardHeader>
            <CardTitle className="text-foreground">
              ¿Cómo funciona la validación?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-teal/10 text-teal rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Verificación</h3>
                  <p className="text-sm text-muted-foreground">
                    Verificamos si tu cuenta Exness está afiliada a nuestro partner
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-teal/10 text-teal rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Activación</h3>
                  <p className="text-sm text-muted-foreground">
                    Si está afiliada, activamos tu acceso completo a Tálamo
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-teal/10 text-teal rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Acceso total</h3>
                  <p className="text-sm text-muted-foreground">
                    Disfruta de todas las herramientas y contenidos sin restricciones
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Partner Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-surface border border-line rounded-2xl p-6 max-w-lg w-full">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Cambio de Partner en Exness
              </h3>
              
              <div className="space-y-4 mb-6">
                <p className="text-muted-foreground">
                  Para cambiar tu Partner ID y acceder a Tálamo gratuitamente:
                </p>
                
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-teal text-background rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>Accede a tu área personal de Exness en my.exness.com</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-teal text-background rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>Ve a Configuración → Cambiar Partner</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 bg-teal text-background rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <div>
                      <span>Introduce nuestro Partner ID:</span>
                      <div className="flex items-center gap-2 mt-2 p-2 bg-background rounded border">
                        <code className="text-teal font-mono flex-1">1141465940423171000</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText("1141465940423171000");
                            toast({
                              title: "ID copiado",
                              description: "Partner ID copiado al portapapeles"
                            });
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1">
                  Cerrar
                </Button>
                <Button onClick={() => navigate('/guide/change-partner')} className="flex-1">
                  Ver guía completa
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}