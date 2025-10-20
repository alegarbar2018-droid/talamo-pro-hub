import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, ExternalLink } from "lucide-react";

const RiskWarning = () => {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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

export default RiskWarning;
