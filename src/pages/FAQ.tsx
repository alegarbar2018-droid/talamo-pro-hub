import { SEOHead } from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import FAQExpanded from "@/components/FAQExpanded";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { getFAQSchema } from "@/lib/structured-data";

export default function FAQ() {
  const faqs = [
    {
      question: "¿Qué es Tálamo Trading?",
      answer: "Tálamo es un ecosistema profesional de trading 100% gratuito que incluye academia estructurada (146 lecciones), señales verificadas, copy trading, herramientas profesionales, auditoría transparente y comunidad. Todo financiado por comisiones IB de Exness."
    },
    {
      question: "¿Cómo funciona el modelo IB?",
      answer: "IB (Introducing Broker) significa que ganamos una pequeña comisión del spread cuando operas en Exness con nuestra afiliación. Esta comisión la paga el bróker, no tú. Nuestros incentivos están 100% alineados contigo."
    },
    {
      question: "¿Por qué necesito cuenta Exness?",
      answer: "Nuestro partner ID (1141465940423171000) con Exness es lo que financia todo el ecosistema. Sin cuenta afiliada, no podemos sostener la operación."
    },
    {
      question: "Ya tengo cuenta Exness con otro partner",
      answer: "Puedes solicitar cambio de partner al ID 1141465940423171000. El proceso toma entre 1-4 horas, tu historial y fondos permanecen intactos."
    },
    {
      question: "¿Qué incluye la Academia?",
      answer: "146 lecciones estructuradas en 3 niveles progresivos (Fundamentos, Intermedio, Avanzado). Cada lección incluye contenido teórico, ejemplos prácticos y quizzes de validación."
    },
    {
      question: "¿Cómo funcionan las Señales?",
      answer: "Publicamos análisis técnicos profesionales con RR mínimo 1:2, lógica completa, condiciones de invalidación y niveles exactos. NO son señales premium de canal VIP."
    },
    {
      question: "¿Qué es Copy Trading en Tálamo?",
      answer: "Sistema de alertas automáticas de estrategias verificadas. Tú decides manualmente si ejecutar o no cada operación. NUNCA accedemos a tu cuenta."
    },
    {
      question: "¿Qué herramientas profesionales ofrecen?",
      answer: "Suite completa de calculadoras: tamaño de posición, valor del pip, margen, TP/SL, P&L, risk/reward, swap. También journal de trading con métricas como Profit Factor y Sharpe Ratio."
    },
    {
      question: "¿Cómo funciona la auditoría de cuentas?",
      answer: "Usamos investor password (solo lectura) para verificar métricas reales. NUNCA pedimos trading password. Es una contraseña de MT4/MT5 que solo permite ver operaciones sin ejecutar."
    },
    {
      question: "¿Garantizan rentabilidad?",
      answer: "NO. El trading de CFDs conlleva alto riesgo (74-89% de cuentas retail pierden dinero). Tálamo NO promete ganancias. Ofrecemos estructura profesional, no garantías de rentabilidad."
    },
    {
      question: "¿Qué mercados puedo operar?",
      answer: "FX, índices globales, metales preciosos, petróleo y criptomonedas (según regulación). Instrumentos con spread competitivo y alta liquidez."
    },
    {
      question: "¿Tálamo tiene costos ocultos?",
      answer: "NO. Cero cargos por nuestra parte. Los únicos costos son los del bróker (spread, swap, comisiones). La comisión IB la paga Exness a nosotros."
    },
    {
      question: "¿Puedo usar Tálamo sin operar?",
      answer: "No. Para acceder al ecosistema completo necesitas cuenta Exness afiliada. Si solo quieres explorar, puedes ver las páginas de información de cada módulo."
    },
    {
      question: "¿Es Tálamo una empresa regulada?",
      answer: "Tálamo es una plataforma educativa. NO somos bróker ni manejamos fondos. Tu cuenta está con Exness (regulado por FCA, CySEC, FSCA, FSA). Operamos bajo modelo IB transparente."
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
