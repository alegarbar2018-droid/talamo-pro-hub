import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FAQExpanded = () => {
  const navigate = useNavigate();
  
  const faqs = [
    {
      question: "¿Qué es Tálamo Trading?",
      answer: "Tálamo es un ecosistema profesional de trading 100% gratuito que incluye academia estructurada (146 lecciones), señales verificadas, copy trading, herramientas profesionales, auditoría transparente y comunidad. Todo financiado por comisiones IB de Exness, no vendemos cursos ni membresías premium.",
      link: { text: "Ver qué es Tálamo", path: "/#que-es-talamo" }
    },
    {
      question: "¿Cómo funciona el modelo IB?",
      answer: "IB (Introducing Broker) significa que ganamos una pequeña comisión del spread cuando operas en Exness con nuestra afiliación. Esta comisión la paga el bróker, no tú. Nuestros costos e incentivos están 100% alineados contigo: solo ganamos si operas con confianza sostenida en el tiempo.",
      link: { text: "¿Qué es un IB?", path: "https://www.investopedia.com/terms/i/introducingbroker.asp", external: true }
    },
    {
      question: "¿Por qué necesito cuenta Exness?",
      answer: "Nuestro partner ID (1141465940423171000) con Exness es lo que financia todo el ecosistema. Sin cuenta afiliada, no podemos sostener la operación. Es el precio justo por acceder a todo gratis: usar nuestro link de afiliación cuando crees tu cuenta o cambiar de partner si ya tienes una.",
      link: { text: "Guía de cambio de partner", path: "/change-partner-guide" }
    },
    {
      question: "Ya tengo cuenta Exness con otro partner",
      answer: "Sin problema. Puedes solicitar cambio de partner al ID 1141465940423171000. El proceso toma entre 1-4 horas, tu historial y fondos permanecen intactos, y una vez completado tendrás acceso total a Tálamo. Es un proceso estándar de Exness.",
      link: { text: "Instrucciones detalladas", path: "/change-partner-guide" }
    },
    {
      question: "¿Qué incluye la Academia?",
      answer: "146 lecciones estructuradas en 3 niveles progresivos (Fundamentos, Intermedio, Avanzado). Cada lección incluye contenido teórico, ejemplos prácticos y quizzes de validación. Vas desde conceptos básicos hasta estrategias profesionales de gestión de riesgo y análisis técnico avanzado.",
      link: { text: "Ver contenido completo", path: "/academy-info" }
    },
    {
      question: "¿Cómo funcionan las Señales?",
      answer: "Publicamos análisis técnicos profesionales con RR mínimo 1:2, lógica completa, condiciones de invalidación y niveles exactos (entry, SL, TP). NO son señales premium de canal VIP. Son análisis estructurados que tú evalúas y decides si ejecutar en tu terminal.",
      link: { text: "Ver ejemplo de señal", path: "/signals-info" }
    },
    {
      question: "¿Qué es Copy Trading en Tálamo?",
      answer: "Sistema de alertas automáticas de estrategias verificadas. Tú decides manualmente si ejecutar o no cada operación. NUNCA accedemos a tu cuenta, no usamos trading password, solo métricas con investor password (solo lectura). Control total en tus manos.",
      link: { text: "Cómo funciona", path: "/copy-info" }
    },
    {
      question: "¿Qué herramientas profesionales ofrecen?",
      answer: "Suite completa de calculadoras: tamaño de posición, valor del pip, margen, TP/SL a precio, P&L en tiempo real, risk/reward, swap, y más. También journal de trading para registro de operaciones y análisis de desempeño con métricas como Profit Factor y Sharpe Ratio.",
      link: { text: "Ver todas las herramientas", path: "/tools-info" }
    },
    {
      question: "¿Cómo funciona la auditoría de cuentas?",
      answer: "Usamos investor password (solo lectura) para verificar métricas reales de cuentas. NUNCA pedimos trading password ni acceso para operar. Es una contraseña de MT4/MT5 que solo permite ver operaciones, sin poder ejecutar nada. Tu cuenta está 100% segura.",
      link: { text: "Más sobre investor password", path: "/tools-info#audit" }
    },
    {
      question: "¿Garantizan rentabilidad?",
      answer: "NO. El trading de CFDs conlleva alto riesgo de pérdida (74-89% de cuentas retail pierden dinero). Tálamo NO promete ganancias. Ofrecemos estructura profesional, educación sólida y herramientas verificadas. Los resultados dependen 100% de tu disciplina, gestión de riesgo y condiciones de mercado.",
      link: { text: "Ver aviso de riesgo completo", path: "#risk-warning" }
    },
    {
      question: "¿Qué mercados puedo operar?",
      answer: "FX (pares de divisas), índices globales, metales preciosos (oro, plata), petróleo y criptomonedas (según regulación de tu región). Nos enfocamos en instrumentos con spread competitivo, alta liquidez y adecuados para estrategias profesionales de gestión de riesgo.",
      link: { text: "Ver especificaciones de contratos", path: "/tools-info#contracts" }
    },
    {
      question: "¿Tálamo tiene costos ocultos?",
      answer: "NO. Cero cargos por nuestra parte. Los únicos costos son los normales del bróker (spread, swap, comisiones) que pagarías de cualquier forma. La comisión IB la paga Exness a nosotros, no sale de tu bolsillo. Transparencia total.",
      link: null
    },
    {
      question: "¿Puedo usar Tálamo sin operar?",
      answer: "No. Para acceder al ecosistema completo necesitas cuenta Exness afiliada. Si solo quieres explorar, puedes ver las páginas de información de cada módulo, pero el acceso completo (dashboard, academia interactiva, señales en vivo, copy trading) requiere validación de afiliación.",
      link: { text: "Comenzar proceso de registro", path: "/onboarding" }
    },
    {
      question: "¿Ofrecen soporte en vivo?",
      answer: "Ofrecemos soporte por comunidad y recursos de ayuda. Para temas de cuenta Exness (depósitos, retiros, problemas técnicos de plataforma), debes contactar directamente al soporte de Exness, que es 24/7 multicanal.",
      link: { text: "Contactar soporte Exness", path: "https://www.exness.com/support/", external: true }
    },
    {
      question: "¿Es Tálamo una empresa regulada?",
      answer: "Tálamo es una plataforma educativa y de herramientas para traders. NO somos bróker ni manejamos fondos. Tu cuenta de trading está con Exness (regulado por FCA, CySEC, FSCA, FSA). Nosotros operamos bajo modelo IB transparente sin acceso a tu dinero.",
      link: { text: "Ver regulaciones de Exness", path: "https://www.exness.com/regulation/", external: true }
    }
  ];

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Preguntas Frecuentes
        </h2>
        <p className="text-muted-foreground">
          Respuestas claras sobre nuestro modelo, funcionamiento y términos
        </p>
      </div>

      <Card className="border-line bg-surface mb-8">
        <CardContent className="p-6">
          <Accordion type="multiple" className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                    {faq.link && (
                      faq.link.external ? (
                        <a
                          href={faq.link.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          {faq.link.text}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => {
                            if (faq.link.path.startsWith('/#')) {
                              // Navigate to home page first if not already there
                              if (window.location.pathname !== '/') {
                                navigate('/');
                                // Wait for navigation and then scroll
                                setTimeout(() => {
                                  const element = document.querySelector(faq.link.path.substring(1));
                                  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }, 100);
                              } else {
                                // Already on home page, just scroll
                                const element = document.querySelector(faq.link.path.substring(1));
                                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            } else {
                              navigate(faq.link.path);
                            }
                          }}
                          className="h-auto p-0 text-sm text-primary hover:text-primary/80"
                        >
                          {faq.link.text} →
                        </Button>
                      )
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Risk Warning */}
      <Card id="risk-warning" className="border-warning/20 bg-warning/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-warning flex-shrink-0 mt-1" />
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Aviso de Riesgo Regulatorio</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                El trading de CFDs conlleva un alto riesgo de pérdida de capital. Entre el 74-89% de las 
                cuentas de inversores minoristas pierden dinero al operar CFDs. Debe considerar si comprende 
                cómo funcionan los CFDs y si puede permitirse el alto riesgo de perder su dinero.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                El rendimiento pasado no es indicativo de resultados futuros. Las señales y estrategias de copy 
                trading mostradas son solo para fines educativos y no constituyen asesoramiento financiero. 
                Tálamo no garantiza ni promete rentabilidad alguna.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="https://www.cnmv.es/portal/home.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Más información CNMV
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://www.exness.com/legal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Términos legales Exness
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FAQExpanded;