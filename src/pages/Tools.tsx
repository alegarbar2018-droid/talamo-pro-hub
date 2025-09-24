import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calculator, 
  ArrowLeft,
  TrendingDown,
  BookOpen,
  Lock,
  AlertTriangle,
  Target,
  BarChart3,
  Activity,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TradingDisclaimer from "@/components/ui/trading-disclaimer";
import { useObservability } from "@/components/business/ObservabilityProvider";

const Tools = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['tools']);
  const { trackPageView, trackInteraction } = useObservability();
  const [riskCalc, setRiskCalc] = useState({
    balance: "",
    riskPercent: "",
    slPips: "",
    pipValue: "0.1"
  });
  const [calcResult, setCalcResult] = useState<number | null>(null);

  const [journalEntry, setJournalEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    pair: "",
    entry: "",
    exit: "",
    result: "",
    notes: "",
    tags: ""
  });

  useEffect(() => {
    trackPageView('tools');
  }, [trackPageView]);

  const calculateLotSize = () => {
    const balance = parseFloat(riskCalc.balance);
    const riskPercent = parseFloat(riskCalc.riskPercent);
    const slPips = parseFloat(riskCalc.slPips);
    const pipValue = parseFloat(riskCalc.pipValue);

    if (!balance || !riskPercent || !slPips || !pipValue) {
      alert(t('tools:alerts.complete_fields'));
      return;
    }

    if (slPips <= 0) {
      alert(t('tools:alerts.sl_positive'));
      return;
    }

    const riskAmount = (balance * riskPercent) / 100;
    const lotSize = riskAmount / (slPips * pipValue);
    
    setCalcResult(Math.round(lotSize * 100) / 100);
    trackInteraction('risk_calculator_used', 'calculate', { 
      balance, 
      riskPercent, 
      slPips, 
      lotSize: Math.round(lotSize * 100) / 100 
    });
  };

  const saveJournalEntry = () => {
    // Mock save to localStorage
    const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
    const newEntry = {
      ...journalEntry,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    entries.push(newEntry);
    localStorage.setItem("journalEntries", JSON.stringify(entries));
    
    // Reset form
    setJournalEntry({
      date: new Date().toISOString().split('T')[0],
      pair: "",
      entry: "",
      exit: "",
      result: "",
      notes: "",
      tags: ""
    });
    
    alert(t('tools:alerts.entry_saved'));
    trackInteraction('journal_entry_saved', 'submit', { pair: journalEntry.pair });
  };

  const tools = [
    {
      id: "risk-calculator",
      name: "Calculadora de Riesgo",
      description: "Calcula el tamaño de posición óptimo",
      icon: Calculator,
      available: true
    },
    {
      id: "dd-panel", 
      name: "Panel de Drawdown",
      description: "Simulador de drawdown y recuperación",
      icon: TrendingDown,
      available: true
    },
    {
      id: "journal",
      name: "Journal de Trading", 
      description: "Registro de operaciones y aprendizajes",
      icon: BookOpen,
      available: true
    },
    {
      id: "audit",
      name: "Auditoría MT4/MT5",
      description: "Análisis de cuentas de trading (Solo lectura)",
      icon: BarChart3,
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-line bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('tools:title')}</h1>
              <p className="text-muted-foreground">{t('tools:subtitle')}</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/dashboard")}
              className="text-teal hover:bg-teal/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('tools:back_to_dashboard')}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="risk-calculator" className="space-y-6">
          {/* Tools Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <TabsList key={tool.id} className="h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value={tool.id}
                  disabled={!tool.available}
                  className="w-full h-auto p-4 flex flex-col items-center gap-2 data-[state=active]:bg-surface data-[state=active]:border-teal data-[state=active]:border"
                >
                  <tool.icon className={`h-6 w-6 ${tool.available ? 'text-teal' : 'text-muted-foreground'}`} />
                  <div className="text-center">
                    <div className={`font-medium ${tool.available ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {tool.name}
                    </div>
                    {!tool.available && (
                      <Lock className="h-3 w-3 mx-auto mt-1 text-muted-foreground" />
                    )}
                  </div>
                </TabsTrigger>
              </TabsList>
            ))}
          </div>

          {/* Risk Calculator */}
          <TabsContent value="risk-calculator">
            <Card className="border-line bg-surface">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-teal" />
                  Calculadora de Riesgo
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Determina el tamaño de posición óptimo basado en tu gestión de riesgo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="balance" className="text-foreground">Balance de cuenta ($)</Label>
                      <Input
                        id="balance"
                        type="number"
                        placeholder="10000"
                        value={riskCalc.balance}
                        onChange={(e) => setRiskCalc({...riskCalc, balance: e.target.value})}
                        className="bg-input border-line focus:border-teal"
                      />
                    </div>

                    <div>
                      <Label htmlFor="risk" className="text-foreground">Riesgo por trade (%)</Label>
                      <Input
                        id="risk"
                        type="number"
                        placeholder="1"
                        value={riskCalc.riskPercent}
                        onChange={(e) => setRiskCalc({...riskCalc, riskPercent: e.target.value})}
                        className="bg-input border-line focus:border-teal"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sl" className="text-foreground">Stop Loss (pips)</Label>
                      <Input
                        id="sl"
                        type="number"
                        placeholder="50"
                        value={riskCalc.slPips}
                        onChange={(e) => setRiskCalc({...riskCalc, slPips: e.target.value})}
                        className="bg-input border-line focus:border-teal"
                      />
                    </div>

                    <div>
                      <Label htmlFor="pipValue" className="text-foreground">Valor del pip</Label>
                      <Select value={riskCalc.pipValue} onValueChange={(value) => 
                        setRiskCalc({...riskCalc, pipValue: value})
                      }>
                        <SelectTrigger className="bg-input border-line">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.1">0.1 (EURUSD, GBPUSD)</SelectItem>
                          <SelectItem value="0.01">0.01 (USDJPY)</SelectItem>
                          <SelectItem value="1">1.0 (XAUUSD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={calculateLotSize}
                      className="w-full bg-gradient-primary hover:shadow-glow"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Calcular Tamaño de Posición
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {calcResult !== null && (
                      <Card className="border-teal/30 bg-teal/5">
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-teal mb-2">
                            {calcResult} lotes
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Tamaño de posición recomendado
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Alert className="border-warning/20 bg-warning/10">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <AlertDescription className="text-foreground">
                        <strong>Recomendación:</strong> No arriesgue más del 1-2% de su capital por operación. 
                        Esta calculadora es una guía, siempre ajuste según su estrategia.
                      </AlertDescription>
                    </Alert>

                    <div className="text-sm text-muted-foreground space-y-2">
                      <h4 className="font-semibold text-foreground">Cómo usar:</h4>
                      <ul className="space-y-1">
                        <li>• Ingrese su balance actual</li>
                        <li>• Defina su % de riesgo por trade</li>
                        <li>• Especifique la distancia del SL</li>
                        <li>• Seleccione el valor del pip</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drawdown Panel */}
          <TabsContent value="dd-panel">
            <Card className="border-line bg-surface">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-teal" />
                  Panel de Drawdown
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Simula escenarios de drawdown y planifica la recuperación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Simulador de Drawdown
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Herramienta para analizar el impacto de rachas perdedoras y planificar la recuperación
                  </p>
                  <Button variant="outline" className="border-teal text-teal hover:bg-teal/10">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar simulación
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trading Journal */}
          <TabsContent value="journal">
            <Card className="border-line bg-surface">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-teal" />
                  Journal de Trading
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Registra tus operaciones y reflexiones para mejorar continuamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="date" className="text-foreground">Fecha</Label>
                      <Input
                        id="date"
                        type="date"
                        value={journalEntry.date}
                        onChange={(e) => setJournalEntry({...journalEntry, date: e.target.value})}
                        className="bg-input border-line focus:border-teal"
                      />
                    </div>

                    <div>
                      <Label htmlFor="pair" className="text-foreground">Instrumento</Label>
                      <Input
                        id="pair"
                        placeholder="EURUSD"
                        value={journalEntry.pair}
                        onChange={(e) => setJournalEntry({...journalEntry, pair: e.target.value})}
                        className="bg-input border-line focus:border-teal"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="entry" className="text-foreground">Entrada</Label>
                        <Input
                          id="entry"
                          placeholder="1.0850"
                          value={journalEntry.entry}
                          onChange={(e) => setJournalEntry({...journalEntry, entry: e.target.value})}
                          className="bg-input border-line focus:border-teal"
                        />
                      </div>
                      <div>
                        <Label htmlFor="exit" className="text-foreground">Salida</Label>
                        <Input
                          id="exit"
                          placeholder="1.0920"
                          value={journalEntry.exit}
                          onChange={(e) => setJournalEntry({...journalEntry, exit: e.target.value})}
                          className="bg-input border-line focus:border-teal"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="result" className="text-foreground">Resultado ($)</Label>
                      <Input
                        id="result"
                        placeholder="+120"
                        value={journalEntry.result}
                        onChange={(e) => setJournalEntry({...journalEntry, result: e.target.value})}
                        className="bg-input border-line focus:border-teal"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="notes" className="text-foreground">Notas y reflexiones</Label>
                      <textarea
                        id="notes"
                        rows={6}
                        placeholder="¿Qué funcionó bien? ¿Qué puedes mejorar? ¿Seguiste tu plan?"
                        value={journalEntry.notes}
                        onChange={(e) => setJournalEntry({...journalEntry, notes: e.target.value})}
                        className="w-full bg-input border-line focus:border-teal rounded-md p-3 text-foreground placeholder-muted-foreground"
                      />
                    </div>

                    <div>
                      <Label htmlFor="tags" className="text-foreground">Etiquetas (separadas por comas)</Label>
                      <Input
                        id="tags"
                        placeholder="ruptura, disciplina, análisis"
                        value={journalEntry.tags}
                        onChange={(e) => setJournalEntry({...journalEntry, tags: e.target.value})}
                        className="bg-input border-line focus:border-teal"
                      />
                    </div>

                    <Button 
                      onClick={saveJournalEntry}
                      className="w-full bg-gradient-primary hover:shadow-glow"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Guardar en Journal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Tool */}
          <TabsContent value="audit">
            <Card className="border-line bg-surface opacity-50">
              <CardContent className="text-center py-12">
                <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Auditoría MT4/MT5
                </h3>
                <p className="text-muted-foreground mb-4">
                  Herramienta para análisis de cuentas reales (solo lectura). Próximamente disponible.
                </p>
                <Alert className="border-warning/20 bg-warning/10 max-w-md mx-auto">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <AlertDescription className="text-foreground text-sm">
                    Esta función estará disponible próximamente. Permitirá auditar cuentas MT4/MT5 
                    con acceso de solo lectura (investor password).
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Trading Disclaimer */}
        <TradingDisclaimer 
          context="tools" 
          variant="compact" 
          showCollapsible={true}
          className="mt-8"
        />
      </div>
    </div>
  );
};

export default Tools;