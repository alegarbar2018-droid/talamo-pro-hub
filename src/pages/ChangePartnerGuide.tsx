import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, ArrowLeft, CheckCircle2, AlertCircle, MessageSquare, FileText, Send, Clock, ExternalLink } from "lucide-react";
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
      image: step1Image,
      icon: MessageSquare
    },
    {
      number: 2,
      title: "Solicitar el enlace",
      description: 'En el chat del asistente de Exness, escribe el texto exacto: "cambio de partner" y envíalo.',
      image: step2Image,
      icon: FileText
    },
    {
      number: 3,
      title: "Obtener el formulario",
      description: "El Asistente de Exness generará automáticamente un enlace para acceder al formulario de solicitud de cambio de Partner. Haz clic en el Link proporcionado.",
      image: step3Image,
      icon: ExternalLink
    },
    {
      number: 4,
      title: "Completar la Solicitud",
      description: 'Complete el formulario de "Partner Change". Es crucial que en el campo: "New partner\'s link or wallet account number" ingreses nuestro ID de Partner.',
      image: step4Image,
      icon: Copy
    },
    {
      number: 5,
      title: "Envío y Confirmación",
      description: "Una vez que hayas llenado todos los campos, haz clic en Submit. Recibirás una respuesta sobre el estado de tu solicitud directamente en tu correo en un plazo aproximado de 72 horas laborables.",
      image: null,
      icon: Send
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header con gradiente */}
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild className="hover:bg-primary/10 transition-colors">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Link>
              </Button>
              <div className="h-8 w-px bg-border" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Tálamo
                </h1>
                <p className="text-sm text-muted-foreground">Guía de cambio de partner</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <CheckCircle2 className="h-4 w-4" />
            Proceso Simple y Rápido
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Únete a <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Tálamo</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Si ya tienes una cuenta en Exness, cambiar tu afiliación es muy sencillo. 
            Sigue estos pasos y comienza a disfrutar de nuestra plataforma educativa profesional.
          </p>
        </div>

        {/* Partner ID Card - Destacado con gradiente */}
        <Card className="mb-16 border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
          <CardContent className="p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-primary/20">
                <Copy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2 text-2xl">
                  Nuestro Partner ID de Tálamo
                </h3>
                <p className="text-muted-foreground">
                  Necesitarás este código en el paso 4 del proceso
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-6 bg-card rounded-xl border-2 border-primary/30 shadow-inner">
              <code className="text-primary font-mono text-2xl md:text-3xl font-bold flex-1 text-center sm:text-left">
                {partnerId}
              </code>
              <Button
                onClick={copyPartnerId}
                size="lg"
                className="h-12 px-6 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Copy className="h-5 w-5 mr-2" />
                Copiar ID
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timeline de pasos */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-3 text-center">
            {steps.length} Pasos Sencillos
          </h3>
          <p className="text-center text-muted-foreground mb-12">
            El proceso completo toma menos de 5 minutos
          </p>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.number} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className="overflow-hidden border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                  {/* Header con gradiente y número */}
                  <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <span className="text-2xl font-bold text-primary-foreground">{step.number}</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 p-2 bg-card rounded-lg border-2 border-primary/20 shadow-sm">
                          <step.icon className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-1">{step.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Paso {step.number} de {steps.length}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 md:p-8">
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      {step.description}
                    </p>
                    
                    {step.image && (
                      <div className="rounded-xl border-2 border-border overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-muted/20">
                        <img 
                          src={step.image} 
                          alt={`Paso ${step.number}: ${step.title}`}
                          className="w-full h-auto hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Información importante con iconos */}
        <Card className="border-2 border-warning/30 bg-gradient-to-br from-warning/10 to-warning/5 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-warning/20">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <CardTitle className="text-2xl">Información Importante</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3 p-4 bg-card/50 rounded-lg border border-warning/20 hover:border-warning/40 transition-colors">
                <Clock className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground mb-1">Tiempo de procesamiento</p>
                  <p className="text-sm text-muted-foreground">Hasta <strong>72 horas laborables</strong></p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-card/50 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground mb-1">Completamente gratuito</p>
                  <p className="text-sm text-muted-foreground">Sin costos adicionales</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-card/50 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground mb-1">Sin pérdidas</p>
                  <p className="text-sm text-muted-foreground">Tu historial y fondos están seguros</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-card/50 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground mb-1">Validación inmediata</p>
                  <p className="text-sm text-muted-foreground">Acceso tras completar el cambio</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTAs principales con diseño mejorado */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ya cambié mi partner</h3>
              <p className="text-muted-foreground mb-6">
                Valida tu afiliación y comienza a usar Tálamo
              </p>
              <Button asChild size="lg" className="w-full shadow-md hover:shadow-lg transition-all">
                <Link to="/auth/validate">
                  Validar mi acceso
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ExternalLink className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ir a Exness</h3>
              <p className="text-muted-foreground mb-6">
                Accede a tu cuenta para iniciar el proceso
              </p>
              <Button variant="outline" asChild size="lg" className="w-full">
                <a 
                  href="https://my.exness.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  Abrir mi cuenta
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Opción alternativa */}
        <Card className="mt-8 border-2 border-border hover:border-primary/20 transition-colors">
          <CardHeader>
            <CardTitle className="text-xl">¿Aún no tienes cuenta en Exness?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Si aún no tienes una cuenta en Exness, puedes crear una directamente con nuestra afiliación 
              y comenzar a usar Tálamo de inmediato sin necesidad de cambiar de partner.
            </p>
            <Button asChild variant="secondary" size="lg" className="hover:bg-secondary/80">
              <Link to="/auth/exness?flow=create" className="inline-flex items-center gap-2">
                Crear cuenta nueva en Exness
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Aviso de Riesgo con mejor diseño */}
        <Card className="mt-12 border-2 border-destructive/30 bg-gradient-to-br from-destructive/10 to-destructive/5">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-destructive/20 flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-3 text-lg">Aviso de Riesgo</h3>
                <p className="text-muted-foreground leading-relaxed">
                  El trading de CFDs conlleva un alto riesgo de pérdida de capital. Entre el 74-89% de las 
                  cuentas de inversores minoristas pierden dinero al operar CFDs. Debe considerar si comprende 
                  cómo funcionan los CFDs y si puede permitirse el alto riesgo de perder su dinero. 
                  Tálamo es una plataforma educativa y las herramientas proporcionadas son para fines informativos únicamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}