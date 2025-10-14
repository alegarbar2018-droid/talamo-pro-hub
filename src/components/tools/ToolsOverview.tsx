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
    <div className="space-y-8">
      {/* Intro */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Herramientas profesionales para ejecutar con disciplina
        </h2>
        <p className="text-muted-foreground">
          Reduce errores y acelera tus decisiones con calculadoras precisas, especificaciones técnicas
          y fórmulas explicadas paso a paso.
        </p>
      </div>

      {/* Siguiente pasos - 3 tarjetas grandes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calculadoras */}
        <ExplainerCard
          title="Calculadoras"
          description="Herramientas para calcular tamaño de posición, riesgo, P&L y más en segundos."
          icon={<Calculator className="h-6 w-6 text-primary" />}
          whenToUse={[
            "Antes de abrir cualquier trade",
            "Para verificar tu exposición total",
            "Al planificar escenarios de drawdown"
          ]}
          whatYouNeed={[
            "Saldo de cuenta actual",
            "% de riesgo por operación",
            "Especificaciones del contrato"
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
          title="Fichas de Contrato"
          description="La 'cédula técnica' completa de cada símbolo: contract size, pip value, swaps, horarios."
          icon={<FileText className="h-6 w-6 text-primary" />}
          whenToUse={[
            "Al operar un nuevo símbolo por primera vez",
            "Para calcular costos overnight (swaps)",
            "Verificar horarios de trading del instrumento"
          ]}
          whatYouNeed={[
            "Nombre o símbolo del instrumento",
            "Tipo de cuenta (estándar, pro, etc.)"
          ]}
          primaryCTA={{
            label: "Abrir Contratos",
            onClick: onNavigateToContracts
          }}
          badge={{
            label: "Básica",
            variant: "default"
          }}
        />

        {/* Glosario de Fórmulas */}
        <ExplainerCard
          title="Glosario de Fórmulas"
          description="Definiciones claras con ejemplos prácticos para entender el 'por qué' detrás de cada cálculo."
          icon={<BookOpen className="h-6 w-6 text-primary" />}
          whenToUse={[
            "Para aprender nuevas fórmulas de trading",
            "Al revisar tu estrategia de gestión de riesgo",
            "Cuando necesitas un recordatorio rápido"
          ]}
          whatYouNeed={[
            "Concepto o término que quieres aprender",
            "Tiempo para leer ejemplos y casos de uso"
          ]}
          primaryCTA={{
            label: "Abrir Fórmulas",
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

      {/* Empty state guidance si es necesario */}
      <div className="mt-12 p-6 border border-line/50 rounded-lg bg-surface/20">
        <h3 className="font-semibold text-foreground mb-3">💡 Cómo empezar:</h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li>1. Explora las <strong>Calculadoras</strong> para familiarizarte con el tamaño de posición y gestión de riesgo.</li>
          <li>2. Revisa las <strong>Fichas de Contrato</strong> de los símbolos que operas habitualmente.</li>
          <li>3. Consulta el <strong>Glosario de Fórmulas</strong> cuando tengas dudas sobre algún concepto.</li>
        </ol>
      </div>
    </div>
  );
}
