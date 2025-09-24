import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, Zap } from "lucide-react";

export default function PortfolioDiversificationDemo() {
  const [totalInvestment, setTotalInvestment] = useState(10000);
  const [riskAversion, setRiskAversion] = useState([5]); // 1-10 scale

  const allocation = useMemo(() => {
    const risk = riskAversion[0];
    
    // Calculate allocation based on risk aversion (1 = very conservative, 10 = very aggressive)
    let conservativeWeight = Math.max(0, (11 - risk) / 10); // Higher for low risk
    let aggressiveWeight = Math.max(0, risk / 10); // Higher for high risk
    let moderateWeight = 1 - Math.abs(risk - 5.5) / 5.5; // Peak at moderate risk
    
    // Normalize weights
    const totalWeight = conservativeWeight + moderateWeight + aggressiveWeight;
    conservativeWeight = conservativeWeight / totalWeight;
    moderateWeight = moderateWeight / totalWeight;
    aggressiveWeight = aggressiveWeight / totalWeight;
    
    return [
      {
        name: "Conservative",
        percentage: Math.round(conservativeWeight * 100),
        amount: Math.round(totalInvestment * conservativeWeight),
        color: "text-green-400"
      },
      {
        name: "Moderate", 
        percentage: Math.round(moderateWeight * 100),
        amount: Math.round(totalInvestment * moderateWeight),
        color: "text-yellow-400"
      },
      {
        name: "Aggressive",
        percentage: Math.round(aggressiveWeight * 100), 
        amount: Math.round(totalInvestment * aggressiveWeight),
        color: "text-red-400"
      }
    ].filter(item => item.percentage > 0);
  }, [totalInvestment, riskAversion]);

  const getRiskLabel = (risk: number) => {
    if (risk <= 3) return { label: "Muy Conservador", color: "text-green-400" };
    if (risk <= 5) return { label: "Conservador", color: "text-green-300" };
    if (risk <= 7) return { label: "Moderado", color: "text-yellow-400" };
    if (risk <= 9) return { label: "Agresivo", color: "text-orange-400" };
    return { label: "Muy Agresivo", color: "text-red-400" };
  };

  const currentRiskLabel = getRiskLabel(riskAversion[0]);

  return (
    <Card className="bg-surface/50 backdrop-blur-xl border-primary/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          Calculadora de Diversificación de Portafolio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-white">Capital a invertir ($)</Label>
            <Input
              type="number"
              value={totalInvestment}
              onChange={(e) => setTotalInvestment(Number(e.target.value) || 0)}
              className="text-lg font-semibold"
              placeholder="Ingresa tu capital"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-white flex items-center justify-between">
              Aversión al Riesgo
              <Badge variant="outline" className={`${currentRiskLabel.color} border-current`}>
                {currentRiskLabel.label}
              </Badge>
            </Label>
            <Slider
              value={riskAversion}
              onValueChange={setRiskAversion}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Muy Conservador</span>
              <span>Muy Agresivo</span>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white mb-3">Distribución Sugerida</h4>
          {allocation.map((item, index) => {
            const icons = { Conservative: Shield, Moderate: TrendingUp, Aggressive: Zap };
            const Icon = icons[item.name as keyof typeof icons] || TrendingUp;
            
            return (
              <div key={index} className="flex items-center justify-between p-4 bg-surface/30 rounded-lg border border-primary/10">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  <div>
                    <span className="text-white font-medium">{item.name}</span>
                    <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">${item.amount.toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Educational Note */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-primary">Recuerda:</strong> Esta es una guía educativa basada en tu tolerancia al riesgo. 
            La diversificación reduce el riesgo pero no lo elimina. Siempre invierte solo lo que puedas permitirte perder 
            y considera consultar con un asesor financiero.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}