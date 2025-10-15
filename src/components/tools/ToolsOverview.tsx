import { ExplainerCard } from "./ExplainerCard";
import { Calculator, FileText, BookOpen } from "lucide-react";

interface ToolsOverviewProps {
  onNavigateToCalculators: () => void;
  onNavigateToContracts: () => void;
  onNavigateToFormulas: () => void;
}

export function ToolsOverview({
  onNavigateToCalculators,
  onNavigateToContracts,
  onNavigateToFormulas,
}: ToolsOverviewProps) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
          <Calculator className="h-4 w-4" />
          <span>Herramientas Profesionales</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
          Transforma decisiones intuitivas en{" "}
          <span className="text-primary">ejecución calculada</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          La diferencia entre traders consistentes y los que dependen de la suerte está en la preparación. 
          Nuestras herramientas eliminan el margen de error humano y te permiten operar con la precisión de un profesional.
        </p>
      </div>

      {/* Problem Statement */}
      <div className="max-w-4xl mx-auto p-6 rounded-lg bg-muted/30 border border-line/50">
        <h3 className="text-lg font-semibold text-foreground mb-3">
          El problema que resolvemos
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Muchos traders pierden dinero no por falta de análisis, sino por errores evitables: sobreapalancarse, 
          no calcular correctamente el riesgo, desconocer los costos de mantener posiciones, o simplemente operar 
          instrumentos sin entender sus especificaciones técnicas. <strong className="text-foreground">Estas herramientas 
          están diseñadas para que nunca más pierdas una operación por un error de cálculo o falta de información.</strong>
        </p>
      </div>

      {/* Tools Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calculadoras */}
        <ExplainerCard
          title="Calculadoras de Trading"
          description="Tu copiloto matemático para cada operación. Elimina la incertidumbre y opera con confianza absoluta en tus números."
          icon={<Calculator className="h-6 w-6 text-primary" />}
          whenToUse={[
            "Determinar tamaño exacto de posición según tu riesgo",
            "Calcular P&L potencial antes de ejecutar",
            "Validar que tu exposición total no exceda tus límites",
            "Planificar escenarios de pérdida y recuperación"
          ]}
          whatYouNeed={[
            "Balance actual de tu cuenta",
            "Porcentaje de riesgo que aceptas por trade",
            "Distancia al Stop Loss en pips",
            "Especificaciones del contrato (valor del pip)"
          ]}
          primaryCTA={{
            label: "Abrir Calculadoras",
            onClick: onNavigateToCalculators
          }}
          badge={{
            label: "Básica",
            variant: "default"
          }}
        />

        {/* Fichas de Contrato */}
        <ExplainerCard
          title="Especificaciones de Contratos"
          description="La 'ficha técnica' completa de cada instrumento. Conoce todos los detalles antes de arriesgar tu capital."
          icon={<FileText className="h-6 w-6 text-primary" />}
          whenToUse={[
            "Verificar el valor real de cada pip/punto en dólares",
            "Calcular costos de financiamiento overnight (swaps)",
            "Conocer horarios exactos de trading del instrumento",
            "Entender el tamaño del contrato y apalancamiento necesario",
            "Planificar operaciones swing considerando costos"
          ]}
          whatYouNeed={[
            "Símbolo del instrumento a operar",
            "Tu tipo de cuenta (Standard, Pro, Raw)",
            "Horizonte temporal de la operación (intraday vs swing)"
          ]}
          primaryCTA={{
            label: "Ver Especificaciones",
            onClick: onNavigateToContracts
          }}
          badge={{
            label: "Básica",
            variant: "default"
          }}
        />

        {/* Glosario de Fórmulas */}
        <ExplainerCard
          title="Biblioteca de Fórmulas"
          description="Comprende el 'por qué' detrás de cada cálculo. No solo uses las herramientas, domina los conceptos que las sustentan."
          icon={<BookOpen className="h-6 w-6 text-primary" />}
          whenToUse={[
            "Aprender cómo se calcula cada métrica de trading",
            "Revisar conceptos antes de ajustar tu estrategia",
            "Entender las matemáticas del money management",
            "Verificar fórmulas al crear tu propio plan de trading",
            "Educar tu criterio para decisiones más informadas"
          ]}
          whatYouNeed={[
            "Curiosidad por entender más allá del resultado",
            "Tiempo para estudiar ejemplos paso a paso",
            "Libreta para tomar notas (recomendado)"
          ]}
          primaryCTA={{
            label: "Explorar Fórmulas",
            onClick: onNavigateToFormulas
          }}
          secondaryCTA={{
            label: "Ver en Academia",
            href: "/academy"
          }}
          badge={{
            label: "Básica",
            variant: "default"
          }}
        />
      </div>

      {/* Value Proposition Section */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Por qué estas herramientas marcan la diferencia
          </h2>
          <p className="text-muted-foreground">
            No son solo calculadoras. Son tu sistema de control de riesgo profesional.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="p-5 rounded-lg bg-surface/50 border border-line/50">
            <h4 className="font-semibold text-foreground mb-2">🎯 Consistencia en cada operación</h4>
            <p className="text-sm text-muted-foreground">
              Eliminas la variabilidad emocional. Cada trade sigue el mismo proceso calculado, 
              lo que genera resultados predecibles a largo plazo.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-surface/50 border border-line/50">
            <h4 className="font-semibold text-foreground mb-2">⚡ Velocidad de ejecución</h4>
            <p className="text-sm text-muted-foreground">
              En mercados rápidos, no puedes perder tiempo calculando manualmente. Obtén los números 
              correctos en segundos y ejecuta con confianza.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-surface/50 border border-line/50">
            <h4 className="font-semibold text-foreground mb-2">🛡️ Protección contra errores costosos</h4>
            <p className="text-sm text-muted-foreground">
              Un solo error de cálculo puede borrar semanas de ganancias. Estas herramientas son tu red de seguridad 
              contra sobreapalancamiento y exposición excesiva.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-surface/50 border border-line/50">
            <h4 className="font-semibold text-foreground mb-2">📈 Desarrollo de disciplina</h4>
            <p className="text-sm text-muted-foreground">
              Al seguir un proceso definido antes de cada operación, internalizas hábitos profesionales 
              que eventualmente se vuelven automáticos.
            </p>
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="max-w-4xl mx-auto p-8 border border-primary/20 rounded-lg bg-gradient-to-br from-primary/5 to-transparent">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          Tu primera sesión profesional
        </h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Abre la Calculadora de Posición</h4>
              <p className="text-sm text-muted-foreground">
                Ingresa tu balance, tu % de riesgo deseado (máximo 2%), y la distancia a tu SL. 
                Obtén el tamaño exacto de lotes a operar.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Consulta las Especificaciones del Contrato</h4>
              <p className="text-sm text-muted-foreground">
                Busca el símbolo que vas a operar. Verifica el valor del pip, los swaps (si mantendrás overnight), 
                y confirma los horarios de trading.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Revisa las Fórmulas (opcional pero recomendado)</h4>
              <p className="text-sm text-muted-foreground">
                Si algo no te queda claro, entra al glosario. Entender el 'por qué' detrás de los números 
                te dará mayor confianza en tus decisiones.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-background/50 rounded border border-line/50">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Resultado:</strong> Habrás transformado un impulso de trading en una 
              operación calculada, con riesgo controlado y fundamentación técnica. Así es como operan los profesionales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
