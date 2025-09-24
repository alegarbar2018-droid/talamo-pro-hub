import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Shield, Zap } from "lucide-react";

const strategies = [
  { name: "Conservative", risk: 1, color: "#22c55e", icon: Shield },
  { name: "Moderate", risk: 2, color: "#f59e0b", icon: TrendingUp },
  { name: "Aggressive", risk: 3, color: "#ef4444", icon: Zap }
];

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
        color: "#22c55e"
      },
      {
        name: "Moderate", 
        percentage: Math.round(moderateWeight * 100),
        amount: Math.round(totalInvestment * moderateWeight),
        color: "#f59e0b"
      },
      {
        name: "Aggressive",
        percentage: Math.round(aggressiveWeight * 100), 
        amount: Math.round(totalInvestment * aggressiveWeight),
        color: "#ef4444"
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
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="percentage"
                  stroke="none"
                >
                  {allocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  formatter={(value, entry) => (
                    <span className="text-white text-sm">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Allocation Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white mb-3">Distribución Sugerida</h4>
            {allocation.map((item, index) => {
              const Strategy = strategies.find(s => s.name === item.name);
              const StrategyIcon = Strategy?.icon || TrendingUp;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <StrategyIcon className="w-3 h-3" style={{ color: item.color }} />
                      </div>
                      <span className="text-white font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">${item.amount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                  <Progress 
                    value={item.percentage} 
                    className="h-2"
                    style={{ 
                      background: `${item.color}20`,
                    }}
                  />
                </div>
              );
            })}
          </div>
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