"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function ChangePartnerGuidePage() {
  const { toast } = useToast();
  const partnerId = "1141465940423171000";

  const copyPartnerId = () => {
    navigator.clipboard.writeText(partnerId);
    toast({
      title: "ID copiado",
      description: "Partner ID copiado al portapapeles"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-line bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" asChild className="mr-4">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tálamo</h1>
              <p className="text-muted-foreground">Guía de cambio de partner</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-line bg-surface">
          <CardHeader>
            <CardTitle className="text-foreground">
              Cómo cambiar tu Partner ID en Exness
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Para acceder a Tálamo de forma gratuita, tu cuenta de Exness debe estar 
              afiliada a nuestro partner. Sigue estos pasos para cambiar tu Partner ID:
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-background rounded-lg border border-line">
                <div className="flex-shrink-0 w-8 h-8 bg-teal text-background rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Accede a tu Área Personal de Exness
                  </h3>
                  <p className="text-muted-foreground">
                    Inicia sesión en tu cuenta de Exness en{" "}
                    <a 
                      href="https://my.exness.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal hover:underline"
                    >
                      my.exness.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-background rounded-lg border border-line">
                <div className="flex-shrink-0 w-8 h-8 bg-teal text-background rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Navega a Configuración de Partner
                  </h3>
                  <p className="text-muted-foreground">
                    Ve a <strong>Configuración</strong> → <strong>Cambiar Partner</strong> 
                    o busca la opción "Partner ID" en tu panel de control.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-background rounded-lg border border-line">
                <div className="flex-shrink-0 w-8 h-8 bg-teal text-background rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Introduce nuestro Partner ID
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Copia e introduce el siguiente Partner ID:
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-surface rounded-lg border border-line">
                    <code className="text-teal font-mono text-lg flex-1">
                      {partnerId}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyPartnerId}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">
                ⚠️ Importante
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• El cambio de partner puede tardar algunas horas en procesarse</li>
                <li>• Una vez completado, podrás validar tu acceso en Tálamo</li>
                <li>• Tu historial de trading y fondos no se verán afectados</li>
                <li>• El acceso a Tálamo es completamente gratuito</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1">
                <Link to="/auth/validate">
                  Validar mi acceso
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <a 
                  href="/auth/exness?flow=create" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Crear cuenta en Exness
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Risk Warning */}
        <Card className="border-warning/20 bg-warning/5 mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Aviso de Riesgo</h3>
                <p className="text-sm text-muted-foreground">
                  El trading de CFDs conlleva un alto riesgo de pérdida de capital. Entre el 74-89% de las 
                  cuentas de inversores minoristas pierden dinero al operar CFDs. Debe considerar si comprende 
                  cómo funcionan los CFDs y si puede permitirse el alto riesgo de perder su dinero.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}