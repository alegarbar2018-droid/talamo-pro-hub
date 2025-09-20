"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertTriangle, ExternalLink, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ValidationResult {
  isAffiliated: boolean;
  partnerId?: string | null;
  partnerIdMatch: boolean;
  clientUid?: string | null;
  accounts?: string[];
}

const ChangePartnerModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { toast } = useToast();
  const partnerId = process.env.NEXT_PUBLIC_EXNESS_PARTNER_ID || "1141465940423171000";

  const copyPartnerId = () => {
    navigator.clipboard.writeText(partnerId);
    toast({
      title: "ID copiado",
      description: "Partner ID copiado al portapapeles"
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-line rounded-2xl p-6 max-w-lg w-full">
        <h3 className="text-xl font-bold text-foreground mb-4">
          Cambio de Partner en Exness
        </h3>
        <p className="text-muted-foreground mb-4">
          Para acceder a Tálamo, necesitas cambiar tu Partner ID en Exness:
        </p>
        
        <ol className="mt-4 space-y-3 text-sm text-white/80 list-decimal list-inside">
          <li>Inicia sesión en tu Área Personal de Exness</li>
          <li>Ve a "Configuración" → "Cambiar Partner"</li>
          <li>Introduce este Partner ID: 
            <div className="flex items-center gap-2 mt-2 p-3 bg-background rounded-lg border border-line">
              <code className="text-teal font-mono">{partnerId}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyPartnerId}
                className="h-8 w-8 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </li>
        </ol>
        
        <p className="mt-4 text-xs text-white/60">
          Nota: El acceso gratuito a Tálamo depende de que tu cuenta esté afiliada a nuestro partner.
        </p>
        
        <div className="mt-5 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ValidatePage() {
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleValidate = async () => {
    if (!email.trim()) {
      setError("El email es requerido");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Use mock API for MVP
      const { mockValidateAffiliation } = await import('@/lib/mockApi');
      const data = await mockValidateAffiliation(email.trim(), uid.trim() || undefined);

      // Remove this block since we're using mock data above

      setResult(data);

      if (data.isAffiliated && data.partnerIdMatch) {
        // Store affiliation in localStorage for MVP
        const { setUserValidation } = await import('@/lib/auth');
        setUserValidation(true);
        
        toast({
          title: "✅ Acceso desbloqueado",
          description: "Tu cuenta está verificada con nuestro partner"
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-line bg-surface">
        <CardHeader>
          <CardTitle className="text-center text-foreground">
            Validar Acceso a Tálamo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-foreground">
              Email de tu cuenta Exness *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="mt-1"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="uid" className="text-foreground">
              UID de cuenta (opcional)
            </Label>
            <Input
              id="uid"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="12345678"
              className="mt-1"
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert variant={result.isAffiliated && result.partnerIdMatch ? "default" : "destructive"}>
              {result.isAffiliated && result.partnerIdMatch ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription>
                {result.isAffiliated && result.partnerIdMatch
                  ? "✅ Tu cuenta está afiliada a nuestro partner. Acceso desbloqueado."
                  : "❌ Tu cuenta no está afiliada a nuestro partner o no se encontró."}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleValidate}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Validar Acceso
          </Button>

          {result && result.isAffiliated && result.partnerIdMatch && (
            <Button onClick={goToDashboard} className="w-full" variant="outline">
              Ir al Panel
            </Button>
          )}

          {result && (!result.isAffiliated || !result.partnerIdMatch) && (
            <div className="space-y-2">
              <Button asChild className="w-full" variant="outline">
                <a href="/auth/exness?flow=create" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Crear Cuenta en Exness
                </a>
              </Button>
              <Button
                onClick={() => setShowModal(true)}
                className="w-full"
                variant="secondary"
              >
                Cambio de Partner
              </Button>
            </div>
          )}

          <div className="text-center">
            <Button variant="link" asChild>
              <a href="/guide/change-partner">
                Guía de cambio de partner
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <ChangePartnerModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
}