import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import step1Image from "@/assets/change-partner-step1.png";
import step2Image from "@/assets/change-partner-step2.png";
import step3Image from "@/assets/change-partner-step3.png";
import step4Image from "@/assets/change-partner-step4.png";

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

  const steps = [
    {
      number: 1,
      title: "Contactar a Soporte",
      description: "Inicia sesión en tu Área Personal de Exness. En la esquina inferior derecha, haz clic en el icono de chat (burbuja) para abrir el asistente de soporte.",
      image: step1Image
    },
    {
      number: 2,
      title: "Solicitar el enlace",
      description: 'En el chat del asistente de Exness, escribe el texto exacto: "cambio de partner" y envíalo.',
      image: step2Image
    },
    {
      number: 3,
      title: "Obtener el formulario",
      description: "El Asistente de Exness generará automáticamente un enlace para acceder al formulario de solicitud de cambio de Partner. Haz clic en el Link proporcionado.",
      image: step3Image
    },
    {
      number: 4,
      title: "Completar la Solicitud",
      description: 'Complete el formulario de "Partner Change". Es crucial que en el campo: "New partner\'s link or wallet account number" ingreses nuestro ID de Partner.',
      image: step4Image
    },
    {
      number: 5,
      title: "Envío y Confirmación",
      description: "Una vez que hayas llenado todos los campos, haz clic en Submit. Recibirás una respuesta sobre el estado de tu solicitud directamente en tu correo en un plazo aproximado de 72 horas laborables.",
      image: null
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Introducción */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Guía Rápida: Cambiar tu Partner de Exness a Tálamo
          </h2>
          <p className="text-lg text-muted-foreground">
            Si ya tienes una cuenta en Exness pero no estás afiliado a Tálamo (o estás con otro partner), 
            el proceso para unirte a nuestra comunidad profesional es simple y rápido.
          </p>
        </div>

        {/* Partner ID destacado */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-3 text-lg">
              Nuestro Partner ID de Tálamo:
            </h3>
            <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
              <code className="text-primary font-mono text-xl md:text-2xl font-bold flex-1">
                {partnerId}
              </code>
              <Button
                onClick={copyPartnerId}
                size="sm"
                className="h-10 px-4"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Necesitarás este ID en el paso 4 del proceso
            </p>
          </CardContent>
        </Card>

        {/* Pasos */}
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-foreground">
            Sigue estos {steps.length} pasos para solicitar el cambio de afiliación:
          </h3>

          {steps.map((step) => (
            <Card key={step.number} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4 text-base">
                  {step.description}
                </p>
                {step.image && (
                  <div className="rounded-lg border border-border overflow-hidden bg-muted/20">
                    <img 
                      src={step.image} 
                      alt={`Paso ${step.number}: ${step.title}`}
                      className="w-full h-auto"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Información importante */}
        <Card className="mt-8 border-warning/30 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              Información Importante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>El cambio de partner puede tardar hasta <strong>72 horas laborables</strong> en procesarse</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Una vez completado, podrás validar tu acceso en Tálamo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Tu <strong>historial de trading y fondos no se verán afectados</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>El acceso a Tálamo es <strong>completamente gratuito</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Asegúrate de copiar correctamente nuestro Partner ID: <code className="text-primary font-mono">{partnerId}</code></span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button asChild size="lg" className="w-full">
            <Link to="/auth/validate">
              Validar mi acceso ahora
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="w-full">
            <a 
              href="https://my.exness.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Ir a mi cuenta de Exness
            </a>
          </Button>
        </div>

        {/* ¿Necesitas crear una cuenta? */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>¿Aún no tienes cuenta en Exness?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Si aún no tienes una cuenta en Exness, puedes crear una directamente con nuestra afiliación 
              y comenzar a usar Tálamo de inmediato sin necesidad de cambiar de partner.
            </p>
            <Button asChild variant="secondary">
              <Link to="/auth/exness?flow=create">
                Crear cuenta nueva en Exness
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Aviso de Riesgo */}
        <Card className="mt-8 border-destructive/20 bg-destructive/5">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="text-destructive">⚠️</span>
              Aviso de Riesgo
            </h3>
            <p className="text-sm text-muted-foreground">
              El trading de CFDs conlleva un alto riesgo de pérdida de capital. Entre el 74-89% de las 
              cuentas de inversores minoristas pierden dinero al operar CFDs. Debe considerar si comprende 
              cómo funcionan los CFDs y si puede permitirse el alto riesgo de perder su dinero. 
              Tálamo es una plataforma educativa y las herramientas proporcionadas son para fines informativos únicamente.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}