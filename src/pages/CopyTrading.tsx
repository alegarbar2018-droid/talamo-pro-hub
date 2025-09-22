import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  Activity,
  BarChart3,
  Target,
  CheckCircle,
  Settings,
  PieChart
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CopyTrading = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['copy']);
  const [followedStrategies, setFollowedStrategies] = useState<string[]>([]);

  const strategies = [
    {
      id: "conservative",
      name: "Estrategia Conservadora",
      description: "Enfoque de bajo riesgo con gestión defensiva de capital",
      riskTier: "Conservador",
      riskColor: "success",
      pf: 1.68,
      maxDD: 8.2,
      greenMonthsPct: 78,
      monthlyReturn: 4.2,
      winRate: 73,
      avgRR: 1.5,
      totalTrades: 284,
      verification: "Verificada",
      description_long: "Esta estrategia se centra en la preservación del capital con crecimiento constante. Utiliza análisis técnico conservador y nunca arriesga más del 1% por operación.",
      instruments: ["EURUSD", "GBPUSD", "USDJPY"],
      timeframes: ["H4", "D1"],
      minBalance: 1000
    },
    {
      id: "moderate", 
      name: "Estrategia Moderada",
      description: "Balance entre crecimiento y protección del capital",
      riskTier: "Moderado", 
      riskColor: "warning",
      pf: 2.24,
      maxDD: 15.3,
      greenMonthsPct: 71,
      monthlyReturn: 7.8,
      winRate: 65,
      avgRR: 2.1,
      totalTrades: 198,
      verification: "Verificada",
      description_long: "Estrategia balanceada que busca un crecimiento sostenible con riesgo controlado. Combina múltiples timeframes y técnicas de análisis.",
      instruments: ["XAUUSD", "EURUSD", "GBPJPY"],
      timeframes: ["H1", "H4"],
      minBalance: 2000
    },
    {
      id: "aggressive",
      name: "Estrategia Agresiva", 
      description: "Máximo potencial de crecimiento con mayor exposición al riesgo",
      riskTier: "Agresivo",
      riskColor: "destructive",
      pf: 3.12,
      maxDD: 24.7,
      greenMonthsPct: 64,
      monthlyReturn: 12.1,
      winRate: 58,
      avgRR: 2.8,
      totalTrades: 156,
      verification: "Beta",
      description_long: "Estrategia de alto rendimiento para traders experimentados. Utiliza apalancamiento mayor y técnicas avanzadas de trading.",
      instruments: ["XAUUSD", "GBPJPY", "USDCAD", "BITCOIN"],
      timeframes: ["M15", "H1"],
      minBalance: 5000
    }
  ];

  const getRiskColor = (riskColor: string) => {
    switch (riskColor) {
      case "success": return "text-success border-success/30 bg-success/10";
      case "warning": return "text-warning border-warning/30 bg-warning/10";
      case "destructive": return "text-destructive border-destructive/30 bg-destructive/10";
      default: return "text-muted-foreground border-muted/30 bg-muted/10";
    }
  };

  const toggleFollow = (strategyId: string) => {
    if (followedStrategies.includes(strategyId)) {
      setFollowedStrategies(followedStrategies.filter(id => id !== strategyId));
    } else {
      setFollowedStrategies([...followedStrategies, strategyId]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-line bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('copy:title')}</h1>
              <p className="text-muted-foreground">{t('copy:subtitle')}</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/dashboard")}
              className="text-teal hover:bg-teal/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('copy:back_to_dashboard')}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Risk Warning */}
        <Alert className="border-warning/20 bg-warning/10 mb-6">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-foreground">
            <strong>{t('copy:risk_warning.title')}</strong> {t('copy:risk_warning.description')}
          </AlertDescription>
        </Alert>

        {/* Overview Stats */}
        {followedStrategies.length > 0 && (
          <Card className="border-line bg-surface mb-6">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Activity className="h-5 w-5 text-teal" />
                {t('copy:active_strategies.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal">{followedStrategies.length}</div>
                  <div className="text-sm text-muted-foreground">{t('copy:active_strategies.followed')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">+8.4%</div>
                  <div className="text-sm text-muted-foreground">{t('copy:active_strategies.estimated_return')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal">12.3%</div>
                  <div className="text-sm text-muted-foreground">{t('copy:active_strategies.max_drawdown')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Strategies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {strategies.map((strategy) => {
            const isFollowed = followedStrategies.includes(strategy.id);
            
            return (
              <Card 
                key={strategy.id} 
                className={`border-line transition-all ${
                  isFollowed 
                    ? 'bg-teal/5 border-teal/30 shadow-glow-subtle' 
                    : 'bg-surface hover:shadow-glow-subtle'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Users className="h-5 w-5 text-teal" />
                        {strategy.name}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {strategy.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getRiskColor(strategy.riskColor)}>
                        {strategy.riskTier}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {strategy.verification}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Profit Factor:</span>
                      <div className="font-bold text-foreground">{strategy.pf}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max DD:</span>
                      <div className="font-bold text-destructive">{strategy.maxDD}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Meses verdes:</span>
                      <div className="font-bold text-success">{strategy.greenMonthsPct}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Retorno mensual:</span>
                      <div className="font-bold text-teal">{strategy.monthlyReturn}%</div>
                    </div>
                  </div>
                  
                  {/* Performance Indicators */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Win Rate</span>
                        <span className="text-foreground">{strategy.winRate}%</span>
                      </div>
                      <Progress value={strategy.winRate} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">RR Promedio:</span>
                        <div className="font-medium text-foreground">1:{strategy.avgRR}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total trades:</span>
                        <div className="font-medium text-foreground">{strategy.totalTrades}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Instruments */}
                  <div>
                    <span className="text-sm text-muted-foreground">Instrumentos:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {strategy.instruments.map((instrument) => (
                        <Badge key={instrument} variant="outline" className="text-xs">
                          {instrument}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => toggleFollow(strategy.id)}
                      className={`flex-1 ${
                        isFollowed 
                          ? 'bg-teal/20 text-teal border-teal hover:bg-teal/30' 
                          : 'bg-gradient-primary hover:shadow-glow'
                      }`}
                      variant={isFollowed ? "outline" : "default"}
                    >
                      {isFollowed ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Siguiendo
                        </>
                      ) : (
                        "Configurar copia"
                      )}
                    </Button>
                    <Button variant="outline" size="icon" className="border-line">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Balance mínimo */}
                  <div className="text-xs text-muted-foreground pt-2 border-t border-line">
                    Balance mínimo recomendado: ${strategy.minBalance.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Risk Management Section */}
        <Card className="border-line bg-surface">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-teal" />
              Gestión de Riesgo en Copy Trading
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Lineamientos importantes para el copy trading seguro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Reglas de oro</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Target className="h-4 w-4 mt-0.5 text-teal flex-shrink-0" />
                    Nunca arriesgue más del 2-5% de su capital total
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="h-4 w-4 mt-0.5 text-teal flex-shrink-0" />
                    Diversifique entre múltiples estrategias
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="h-4 w-4 mt-0.5 text-teal flex-shrink-0" />
                    Establezca límites de drawdown máximo
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="h-4 w-4 mt-0.5 text-teal flex-shrink-0" />
                    Monitoree regularmente el rendimiento
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Configuración recomendada</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Estrategia Conservadora:</span>
                    <span className="text-foreground">40-60% del capital</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Estrategia Moderada:</span>
                    <span className="text-foreground">30-40% del capital</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Estrategia Agresiva:</span>
                    <span className="text-foreground">10-20% del capital</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full border-teal text-teal hover:bg-teal/10"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar límites de riesgo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-warning/20 bg-warning/5 mt-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Importante sobre Copy Trading</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• El copy trading no requiere acceso directo a su cuenta de trading</p>
                  <p>• Las señales se proporcionan para que usted ejecute manualmente</p>
                  <p>• Tálamo nunca opera directamente en su cuenta</p>
                  <p>• Usted mantiene control total sobre sus operaciones en todo momento</p>
                  <p>• Los resultados mostrados son simulaciones basadas en datos históricos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CopyTrading;