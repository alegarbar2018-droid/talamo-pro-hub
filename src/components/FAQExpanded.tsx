import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertTriangle } from "lucide-react";

const FAQExpanded = () => {
  const faqs = [
    {
      question: "¿Tálamo vende cursos?",
      answer: "No. Es un ecosistema gratuito financiado por comisiones IB cuando operas en Exness con nuestra afiliación. No vendemos cursos, señales premium ni promesas de rentabilidad."
    },
    {
      question: "¿Cómo ganan dinero entonces?",
      answer: "Por spread IB con nuestra afiliación en Exness. Nuestro incentivo está alineado contigo: ganamos cuando operas, pero solo si confías lo suficiente para seguir haciéndolo. No necesitamos prometerte ganancias irreales."
    },
    {
      question: "¿Piden acceso a mis fondos?",
      answer: "No. Solo validamos email/UID para confirmar que tu cuenta está afiliada. Para auditoría transparente, usamos investor password (solo lectura). Nunca pedimos trading password ni acceso para operar."
    },
    {
      question: "¿Pueden operar mi cuenta?",
      answer: "No. Nunca. Investor password es solo lectura para verificar métricas. Tu cuenta es 100% tuya. En copy trading enviamos alertas; tú decides si ejecutas manualmente."
    },
    {
      question: "¿Garantizan resultados?",
      answer: "No. El trading implica riesgo de pérdida. Te damos estructura, educación y herramientas profesionales, pero los resultados dependen de tu disciplina, gestión de riesgo y condiciones de mercado."
    },
    {
      question: "Ya tengo cuenta con otro partner...",
      answer: "Sí, puedes solicitar cambio de partner: 1141465940423171000. El proceso toma unas horas. Tu historial y fondos no se afectan. Una vez completado, podrás acceder a Tálamo."
    },
    {
      question: "¿Costos ocultos?",
      answer: "No. Los costos son los del bróker (spread, swap, comisiones) que pagarías de cualquier forma. Tálamo no añade cargos. La comisión IB la paga Exness, no tú."
    },
    {
      question: "¿Qué mercados cubren?",
      answer: "FX, índices, oro, petróleo y cripto (según regulación). Nos enfocamos en instrumentos con spread competitivo y liquidez adecuada para estrategias profesionales."
    },
    {
      question: "¿Qué incluye la academia?",
      answer: "Niveles 0→4 con objetivos, práctica y evaluación por lección. Desde setup y seguridad hasta algoritmos y EAs. Progresión estructurada con criterios mínimos y certificación interna."
    },
    {
      question: "¿Idiomas y regiones?",
      answer: "Español primero; luego inglés/portugués. Algunas funciones dependen de la entidad/región. Exness opera globalmente, pero disponibilidad específica varía según país."
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
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Risk Warning */}
      <Card className="border-warning/20 bg-warning/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-warning flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Aviso de Riesgo</h3>
              <p className="text-sm text-muted-foreground">
                El trading de CFDs conlleva un alto riesgo de pérdida de capital. Entre el 74-89% de las 
                cuentas de inversores minoristas pierden dinero al operar CFDs con este proveedor. 
                Debe considerar si comprende cómo funcionan los CFDs y si puede permitirse el alto riesgo 
                de perder su dinero. El rendimiento pasado no es indicativo de resultados futuros.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FAQExpanded;