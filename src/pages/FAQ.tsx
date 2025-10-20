import { SEOHead } from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import FAQExpanded from "@/components/FAQExpanded";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { getFAQSchema } from "@/lib/structured-data";

export default function FAQ() {
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
      question: "¿Hay costos ocultos?",
      answer: "No. Los costos son los del bróker (spread, swap, comisiones) que pagarías de cualquier forma. Tálamo no añade cargos. La comisión IB la paga Exness, no tú."
    },
    {
      question: "¿Necesito cuenta Exness?",
      answer: "Sí, con nuestro partner ID para acceder a todo el ecosistema. Si ya tienes cuenta con otro partner, puedes solicitar cambio de partner: 1141465940423171000."
    },
    {
      question: "Ya tengo cuenta con otro partner...",
      answer: "Sí, puedes solicitar cambio de partner: 1141465940423171000. El proceso toma unas horas. Tu historial y fondos no se afectan. Una vez completado, podrás acceder a Tálamo."
    },
    {
      question: "¿Garantizan resultados?",
      answer: "No. El trading implica riesgo de pérdida. Te damos estructura, educación y herramientas profesionales, pero los resultados dependen de tu disciplina, gestión de riesgo y condiciones de mercado."
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
      question: "¿Qué mercados cubren?",
      answer: "FX, índices, oro, petróleo y cripto (según regulación). Nos enfocamos en instrumentos con spread competitivo y liquidez adecuada para estrategias profesionales."
    },
    {
      question: "¿Qué incluye la academia?",
      answer: "146 lecciones organizadas en 3 niveles, desde fundamentos hasta estrategias avanzadas. Progresión estructurada con quizzes y certificación interna."
    }
  ];

  const structuredData = [
    getFAQSchema(faqs)
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Preguntas Frecuentes - Tálamo Trading"
        description="Respuestas claras sobre nuestro modelo IB, funcionamiento, requisitos de cuenta Exness, herramientas profesionales y términos de uso."
        keywords="FAQ trading, preguntas frecuentes trading, Exness partner ID, IB trading, modelo de comisiones"
        canonicalPath="/faq"
        structuredData={structuredData}
      />
      <Navigation />
      
      <div className="pt-20">
        <FAQExpanded />
      </div>

      <LandingFooter />
    </div>
  );
}
