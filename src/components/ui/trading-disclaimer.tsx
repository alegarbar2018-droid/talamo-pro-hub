/**
 * TradingDisclaimer Component
 * 
 * Comprehensive legal disclaimer for trading-related content.
 * Meets regulatory requirements for financial services.
 */
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ExternalLink, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export interface TradingDisclaimerProps {
  variant?: 'compact' | 'full' | 'modal';
  context?: 'signals' | 'copy-trading' | 'academy' | 'tools' | 'general';
  className?: string;
  showCollapsible?: boolean;
}

const TradingDisclaimer = ({ 
  variant = 'compact', 
  context = 'general',
  className = '',
  showCollapsible = false 
}: TradingDisclaimerProps) => {
  const { t } = useTranslation(['common']);
  const [isExpanded, setIsExpanded] = useState(false);

  const getContextualWarning = (context: string) => {
    const warnings = {
      signals: {
        title: "⚠️ Aviso de Riesgo - Señales de Trading",
        description: "Las señales de trading son análisis educativos y no constituyen asesoramiento financiero personalizado. Los resultados pasados no garantizan resultados futuros.",
        additionalRisks: [
          "Las condiciones del mercado pueden cambiar rápidamente invalidando el análisis",
          "Los precios de ejecución pueden diferir significativamente de los sugeridos",
          "Cada trader debe considerar su propia tolerancia al riesgo y situación financiera"
        ]
      },
      'copy-trading': {
        title: "⚠️ Aviso de Riesgo - Copy Trading",
        description: "El copy trading implica riesgos significativos. Tálamo no ejecuta operaciones directamente en su cuenta - usted mantiene control total.",
        additionalRisks: [
          "Las estrategias pueden experimentar pérdidas sustanciales inesperadas",
          "Los resultados mostrados son simulaciones basadas en datos históricos",
          "Las condiciones de mercado futuras pueden diferir del rendimiento pasado",
          "Tálamo actúa únicamente como proveedor de señales educativas"
        ]
      },
      academy: {
        title: "⚠️ Aviso de Riesgo - Contenido Educativo",
        description: "Este contenido es puramente educativo y no constituye asesoramiento de inversión personalizado.",
        additionalRisks: [
          "La aplicación práctica requiere experiencia y conocimiento adicional",
          "Los ejemplos mostrados pueden no reflejar condiciones reales de mercado",
          "Recomendamos practicar en cuentas demo antes de operar con dinero real"
        ]
      },
      tools: {
        title: "⚠️ Aviso de Riesgo - Herramientas de Trading",
        description: "Las herramientas y calculadoras proporcionadas son estimativas y no garantizan resultados de trading.",
        additionalRisks: [
          "Los cálculos están basados en datos históricos y modelos teóricos",
          "Las condiciones reales de mercado pueden diferir significativamente",
          "Siempre verifique los resultados con su broker antes de operar"
        ]
      },
      general: {
        title: "⚠️ Aviso de Riesgo - Trading con CFDs",
        description: "El trading con CFDs conlleva un alto riesgo de perder dinero rápidamente debido al apalancamiento.",
        additionalRisks: [
          "Entre el 74-89% de las cuentas de inversores minoristas pierden dinero",
          "Solo invierta dinero que pueda permitirse perder completamente",
          "Los CFDs son instrumentos complejos con alto riesgo de pérdidas"
        ]
      }
    };

    return warnings[context] || warnings.general;
  };

  const warning = getContextualWarning(context);

  if (variant === 'compact') {
    return (
      <Alert 
        className={`border-destructive/30 bg-destructive/10 ${className}`}
        role="alert"
        aria-live="polite"
        aria-label="Aviso importante de riesgo de trading"
      >
        <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
        <AlertTitle className="text-destructive font-semibold">
          {warning.title}
        </AlertTitle>
        <AlertDescription className="text-foreground">
          <p className="mb-2">{warning.description}</p>
          {showCollapsible && (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 text-destructive hover:text-destructive/80"
                  aria-expanded={isExpanded}
                  aria-label="Mostrar información adicional de riesgo"
                >
                  {isExpanded ? (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" />
                      Ocultar detalles
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      Ver más información
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <ul className="text-sm space-y-1 ml-4">
                  {warning.additionalRisks.map((risk, index) => (
                    <li key={index} className="list-disc">
                      {risk}
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (variant === 'full') {
    return (
      <Card className={`border-destructive/30 bg-destructive/5 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle 
              className="h-6 w-6 text-destructive flex-shrink-0 mt-1" 
              aria-hidden="true"
            />
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-destructive text-lg mb-2">
                  {warning.title}
                </h3>
                <p className="text-foreground leading-relaxed">
                  {warning.description}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Riesgos adicionales a considerar:
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  {warning.additionalRisks.map((risk, index) => (
                    <li key={index} className="list-disc">
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-destructive/20">
                <h4 className="font-semibold text-foreground mb-2">
                  Aviso legal obligatorio:
                </h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• <strong>No es asesoramiento financiero:</strong> Este contenido es solo educativo</p>
                  <p>• <strong>Riesgo de pérdida total:</strong> Solo opere con dinero que pueda permitirse perder</p>
                  <p>• <strong>Regulación:</strong> Asegúrese de operar con brokers regulados</p>
                  <p>• <strong>Experiencia requerida:</strong> Los CFDs requieren conocimiento y experiencia</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                  asChild
                >
                  <a 
                    href="https://www.cnmv.es/portal/inversor/CFD.aspx" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Más información sobre CFDs en CNMV (se abre en ventana nueva)"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Más info CNMV
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                  asChild
                >
                  <a 
                    href="/legal/risk-disclosure" 
                    target="_blank"
                    aria-label="Declaración completa de riesgo (se abre en ventana nueva)"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Declaración completa
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Modal variant would be implemented as needed
  return null;
};

export default TradingDisclaimer;