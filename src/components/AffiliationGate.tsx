import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, AlertTriangle, CheckCircle, Users, ArrowRight } from "lucide-react";

interface AffiliationGateProps {
  user: any;
  onValidated: () => void;
}

const AffiliationGate = ({ user, onValidated }: AffiliationGateProps) => {
  const [showModal, setShowModal] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Simulate affiliation check
    const checkAffiliation = async () => {
      setIsChecking(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (user?.isAffiliated) {
        onValidated();
      } else {
        setShowModal(true);
      }
      setIsChecking(false);
    };

    checkAffiliation();
  }, [user, onValidated]);

  const steps = [
    {
      title: "Abre una cuenta en Exness",
      description: "Regístrate usando nuestro enlace de partner para validación automática",
      action: "Ir a Exness",
    },
    {
      title: "Completa la verificación",
      description: "Verifica tu identidad y realiza un depósito mínimo según los términos de Exness",
      action: "Guía de verificación",
    },
    {
      title: "Accede a Tálamo",
      description: "Una vez validada la afiliación, tendrás acceso completo a todas las herramientas",
      action: "Verificar acceso",
    },
  ];

  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
          <p className="text-muted-foreground">Validando afiliación...</p>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="max-w-2xl bg-surface border-line">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-teal" />
            Validación de Afiliación Requerida
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Para acceder a Tálamo, necesitas una cuenta Exness afiliada con nuestro partner
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert className="border-warning/20 bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-foreground">
              <strong>Importante:</strong> Tálamo es gratuito. Nuestro modelo de negocio se basa en spreads del broker
              cuando operas. Solo ganamos si tú ganas y operas más.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Proceso de Validación (3 pasos simples)</h3>

            {steps.map((step, index) => (
              <Card key={index} className="border-line bg-background">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-foreground flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center">
                      <span className="text-teal font-semibold">{index + 1}</span>
                    </div>
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground mb-3">{step.description}</CardDescription>
                  <Button variant="outline" size="sm" className="border-teal text-teal hover:bg-teal/10">
                    {step.action}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">¿Por qué necesitamos esto?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Garantizamos acceso a herramientas profesionales sin costo</li>
              <li>• Mantenemos transparencia total en nuestro modelo de negocio</li>
              <li>• Nos alineamos contigo: ganamos cuando tú también ganas</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
              Entiendo, continúar después
            </Button>
            <Button
              className="flex-1 bg-gradient-primary hover:shadow-glow"
              onClick={() => window.open("https://one.exness.link/intl/a/", "_blank")}
            >
              Comenzar con Exness
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            <p>Partner ID: 1141465940423171000</p>
            <p>Una vez completado el proceso, tu acceso se habilitará automáticamente</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AffiliationGate;
