import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, ChevronDown, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface TradingSimulatorProps {
  asset: string;
  scenario: string;
  scenarioData: {
    historical: number[];
    current: number;
    future: number[];
    correct_action: 'buy' | 'sell' | 'skip';
    entry?: number;
    sl?: number;
    tp?: number;
  };
  question: string;
  feedbackBuy: string;
  feedbackSell: string;
  feedbackSkip: string;
  educationalContext?: {
    concept: string;
    whatToLook: string[];
    hint?: string;
  };
  annotations?: {
    higherHighs?: number[];
    higherLows?: number[];
    support?: number;
    resistance?: number;
    trendLine?: {
      startIdx: number;
      startPrice: number;
      endIdx: number;
      endPrice: number;
    };
  };
}

type UserAction = 'idle' | 'buy' | 'sell' | 'skip';

export const TradingSimulator: React.FC<TradingSimulatorProps> = ({
  asset,
  scenario,
  scenarioData,
  question,
  feedbackBuy,
  feedbackSell,
  feedbackSkip,
  educationalContext,
  annotations,
}) => {
  const { t } = useTranslation('academy');
  const [userAction, setUserAction] = useState<UserAction>('idle');
  const [isRevealed, setIsRevealed] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAction = (action: 'buy' | 'sell' | 'skip') => {
    setUserAction(action);
    setTimeout(() => {
      setIsRevealed(true);
    }, 500);
  };

  // Prepare chart data
  const getChartData = () => {
    const historicalData = (scenarioData.historical || []).map((price, idx) => ({
      index: idx,
      price,
      label: `T-${(scenarioData.historical || []).length - idx}`,
    }));

    const currentData = {
      index: (scenarioData.historical || []).length,
      price: scenarioData.current || 0,
      label: 'Now',
    };

    const allData = [...historicalData, currentData];

    // Add future data only if action has been taken
    if (isRevealed) {
      const futureData = (scenarioData.future || []).map((price, idx) => ({
        index: (scenarioData.historical || []).length + 1 + idx,
        price,
        label: `T+${idx + 1}`,
      }));
      return [...allData, ...futureData];
    }

    return allData;
  };

  const chartData = getChartData();

  // Calculate pips won/lost
  const calculatePips = () => {
    if (!isRevealed || userAction === 'idle' || userAction === 'skip') return 0;
    
    const futureData = scenarioData.future || [];
    if (futureData.length === 0) return 0;
    
    const finalPrice = futureData[futureData.length - 1];
    const entryPrice = scenarioData.entry || scenarioData.current || 0;
    
    if (userAction === 'buy') {
      return Math.round((finalPrice - entryPrice) * 10000);
    } else if (userAction === 'sell') {
      return Math.round((entryPrice - finalPrice) * 10000);
    }
    
    return 0;
  };

  const pipsResult = calculatePips();
  const isCorrect = userAction === scenarioData.correct_action;

  // Get feedback based on user action
  const getFeedback = () => {
    if (userAction === 'buy') return feedbackBuy;
    if (userAction === 'sell') return feedbackSell;
    if (userAction === 'skip') return feedbackSkip;
    return '';
  };

  const getResultBadge = () => {
    if (userAction === 'skip') {
      return (
        <Badge variant="outline" className="text-base px-4 py-2">
          <AlertCircle className="w-5 h-5 mr-2" />
          {t('simulator.opportunity_skipped')} {isCorrect ? t('simulator.correctly') : ''}
        </Badge>
      );
    }

    if (pipsResult > 0) {
      return (
        <Badge className="bg-success text-success-foreground text-base px-4 py-2">
          <TrendingUp className="w-5 h-5 mr-2" />
          +{pipsResult} pips ✅
        </Badge>
      );
    } else if (pipsResult < 0) {
      return (
        <Badge className="bg-destructive text-destructive-foreground text-base px-4 py-2">
          <TrendingDown className="w-5 h-5 mr-2" />
          {pipsResult} pips ❌
        </Badge>
      );
    }

    return null;
  };

  const getLineColor = () => {
    if (!isRevealed) return 'hsl(174, 72%, 46%)'; // Teal vibrante antes de acción
    
    if (userAction === 'skip') return 'hsl(var(--muted-foreground))';
    
    if (pipsResult > 0) return 'hsl(var(--success))'; // Verde = profit
    if (pipsResult < 0) return 'hsl(var(--destructive))'; // Rojo = loss
    
    return 'hsl(174, 72%, 46%)'; // Fallback teal
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{asset}</h3>
              <p className="text-sm text-muted-foreground">{t('simulator.scenario')}: {scenario}</p>
            </div>
            {isRevealed && getResultBadge()}
          </div>

          {/* Educational Context Section */}
          {educationalContext && (
            <div className="mb-4 p-4 bg-primary/5 border-l-4 border-primary rounded-lg">
              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <span>📚</span>
                <span>{t('simulator.concept')}: {educationalContext.concept}</span>
              </h4>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{t('simulator.what_to_look')}</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {educationalContext.whatToLook.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                {educationalContext.hint && (
                  <p className="mt-3 text-primary italic flex items-center gap-2">
                    <span>💡</span>
                    <span>{t('simulator.hint')}: {educationalContext.hint}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="w-full h-64 bg-background/95 border border-border rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                  opacity={0.3}
                />
                <XAxis 
                  dataKey="label" 
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
                  stroke="hsl(var(--border))"
                />
                <YAxis 
                  domain={['dataMin - 0.0005', 'dataMax + 0.0005']}
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
                  tickFormatter={(value) => value.toFixed(4)}
                  stroke="hsl(var(--border))"
                  width={60}
                />
                <Tooltip
                  formatter={(value: number) => [value.toFixed(4), 'Price']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                />
                
                {/* Current Time Marker */}
                <ReferenceLine 
                  x={(scenarioData.historical || []).length} 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ 
                    value: t('simulator.now'), 
                    position: 'top', 
                    fill: 'hsl(var(--primary))',
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}
                />
                
                {/* Support Level */}
                {annotations?.support && (
                  <ReferenceLine 
                    y={annotations.support}
                    stroke="hsl(var(--success))"
                    strokeDasharray="3 3"
                    strokeWidth={1.5}
                    label={{
                      value: t('simulator.support'),
                      position: 'left',
                      fill: 'hsl(var(--success))',
                      fontSize: 10,
                      fontWeight: 'bold'
                    }}
                  />
                )}
                
                {/* Resistance Level */}
                {annotations?.resistance && (
                  <ReferenceLine 
                    y={annotations.resistance}
                    stroke="hsl(var(--destructive))"
                    strokeDasharray="3 3"
                    strokeWidth={1.5}
                    label={{
                      value: t('simulator.resistance'),
                      position: 'left',
                      fill: 'hsl(var(--destructive))',
                      fontSize: 10,
                      fontWeight: 'bold'
                    }}
                  />
                )}
                
                {/* Higher Highs Markers */}
                {annotations?.higherHighs?.map((idx) => (
                  <ReferenceLine
                    key={`hh-${idx}`}
                    x={idx}
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    label={{
                      value: 'HH',
                      position: 'top',
                      fill: 'hsl(var(--success))',
                      fontSize: 9,
                      fontWeight: 'bold'
                    }}
                  />
                ))}
                
                {/* Higher Lows Markers */}
                {annotations?.higherLows?.map((idx) => (
                  <ReferenceLine
                    key={`hl-${idx}`}
                    x={idx}
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    label={{
                      value: 'HL',
                      position: 'bottom',
                      fill: 'hsl(var(--chart-2))',
                      fontSize: 9,
                      fontWeight: 'bold'
                    }}
                  />
                ))}
                
                {/* Stop Loss Line */}
                {scenarioData.sl && isRevealed && (
                  <ReferenceLine 
                    y={scenarioData.sl} 
                    stroke="hsl(var(--destructive))" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{ 
                      value: 'SL', 
                      position: 'right', 
                      fill: 'hsl(var(--destructive))',
                      fontSize: 11,
                      fontWeight: 'bold'
                    }}
                  />
                )}
                
                {/* Take Profit Line */}
                {scenarioData.tp && isRevealed && (
                  <ReferenceLine 
                    y={scenarioData.tp} 
                    stroke="hsl(var(--success))" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={{ 
                      value: 'TP', 
                      position: 'right', 
                      fill: 'hsl(var(--success))',
                      fontSize: 11,
                      fontWeight: 'bold'
                    }}
                  />
                )}
                
                {/* Price Line */}
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={getLineColor()}
                  strokeWidth={3}
                  dot={{ fill: getLineColor(), r: 3 }}
                  activeDot={{ r: 6, fill: getLineColor() }}
                  animationDuration={isRevealed ? 1000 : 300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Question or Result */}
          {userAction === 'idle' && (
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg border border-border">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{question}</ReactMarkdown>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => handleAction('buy')}
                  className="bg-success hover:bg-success/90 text-success-foreground"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {t('simulator.buy')}
                </Button>
                <Button
                  onClick={() => handleAction('sell')}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  {t('simulator.sell')}
                </Button>
                <Button
                  onClick={() => handleAction('skip')}
                  variant="outline"
                >
                  {t('simulator.skip')}
                </Button>
              </div>
            </div>
          )}

          {isRevealed && (
            <div className="space-y-4">
              {/* Feedback */}
              <div className={`p-4 rounded-lg ${
                isCorrect 
                  ? 'bg-success/10 border border-success/20' 
                  : 'bg-destructive/10 border border-destructive/20'
              }`}>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{getFeedback()}</ReactMarkdown>
                </div>
              </div>

              {/* Detailed Explanation Collapsible */}
              {scenarioData.sl && scenarioData.tp && (
                <Collapsible open={showExplanation} onOpenChange={setShowExplanation}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${showExplanation ? 'rotate-180' : ''}`} />
                      {showExplanation ? t('simulator.hide') : t('simulator.show')} {t('simulator.risk_management')}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground">{t('simulator.entry_price')}:</span>
                        <p className="font-mono font-semibold">{scenarioData.entry?.toFixed(4)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('simulator.current_price')}:</span>
                        <p className="font-mono font-semibold">{scenarioData.current.toFixed(4)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('simulator.stop_loss')}:</span>
                        <p className="font-mono font-semibold text-destructive">{scenarioData.sl.toFixed(4)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('simulator.take_profit')}:</span>
                        <p className="font-mono font-semibold text-success">{scenarioData.tp.toFixed(4)}</p>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Try Again Button */}
              <Button 
                onClick={() => {
                  setUserAction('idle');
                  setIsRevealed(false);
                  setShowExplanation(false);
                }}
                variant="secondary"
                className="w-full"
              >
                {t('simulator.try_again')}
              </Button>
            </div>
          )}

          {userAction !== 'idle' && !isRevealed && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-pulse text-muted-foreground">{t('simulator.revealing')}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
