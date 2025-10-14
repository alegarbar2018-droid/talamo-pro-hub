import React, { useState } from 'react';
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
}) => {
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
    const historicalData = scenarioData.historical.map((price, idx) => ({
      index: idx,
      price,
      label: `T-${scenarioData.historical.length - idx}`,
    }));

    const currentData = {
      index: scenarioData.historical.length,
      price: scenarioData.current,
      label: 'Now',
    };

    const allData = [...historicalData, currentData];

    // Add future data only if action has been taken
    if (isRevealed) {
      const futureData = scenarioData.future.map((price, idx) => ({
        index: scenarioData.historical.length + 1 + idx,
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
    
    const finalPrice = scenarioData.future[scenarioData.future.length - 1];
    const entryPrice = scenarioData.entry || scenarioData.current;
    
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
          Opportunity {isCorrect ? 'Correctly' : ''} Skipped
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

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{asset}</h3>
              <p className="text-sm text-muted-foreground">Scenario: {scenario}</p>
            </div>
            {isRevealed && getResultBadge()}
          </div>

          {/* Chart */}
          <div className="w-full h-64 bg-muted/20 rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="label" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  domain={['dataMin - 0.001', 'dataMax + 0.001']}
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <ReferenceLine 
                  x={scenarioData.historical.length} 
                  stroke="hsl(var(--primary))" 
                  strokeDasharray="3 3"
                  label={{ value: 'Current', fill: 'hsl(var(--primary))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={isRevealed ? 'hsl(var(--chart-3))' : 'hsl(var(--chart-1))'}
                  strokeWidth={2}
                  dot={false}
                  animationDuration={isRevealed ? 1000 : 300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Question or Result */}
          {userAction === 'idle' && (
            <div className="space-y-4">
              <p className="text-center font-medium">{question}</p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => handleAction('buy')}
                  className="bg-success hover:bg-success/90 text-success-foreground"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  BUY
                </Button>
                <Button
                  onClick={() => handleAction('sell')}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  SELL
                </Button>
                <Button
                  onClick={() => handleAction('skip')}
                  variant="outline"
                >
                  SKIP
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
                      {showExplanation ? 'Hide' : 'Show'} Risk Management Details
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground">Entry Price:</span>
                        <p className="font-mono font-semibold">{scenarioData.entry?.toFixed(4)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Current Price:</span>
                        <p className="font-mono font-semibold">{scenarioData.current.toFixed(4)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Stop Loss:</span>
                        <p className="font-mono font-semibold text-destructive">{scenarioData.sl.toFixed(4)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Take Profit:</span>
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
                Try Another Scenario
              </Button>
            </div>
          )}

          {userAction !== 'idle' && !isRevealed && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-pulse text-muted-foreground">Revealing price action...</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
