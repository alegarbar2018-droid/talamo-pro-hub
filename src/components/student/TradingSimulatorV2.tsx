/**
 * Trading Simulator v2 - Enhanced Interactive Trading Scenarios
 * Supports OHLC data, risk management, rubric scoring, and multi-step scenarios
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ReferenceLine, Area, ComposedChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, AlertCircle, CheckCircle2, 
  ChevronDown, ChevronUp, Eye, EyeOff, Target, Shield
} from 'lucide-react';
import { TradingSimulatorPropsV2, TradeAction, Hint } from '@/types/extended-markdown';
import { cn } from '@/lib/utils';

type UserAction = 'idle' | TradeAction;

interface TradingSimulatorV2Props extends TradingSimulatorPropsV2 {
  className?: string;
}

export const TradingSimulatorV2: React.FC<TradingSimulatorV2Props> = ({
  asset,
  scenario,
  v,
  chart = 'line',
  timeframe = 'H1',
  reveal_future = 'after_decision',
  currency = 'USD',
  market,
  risk,
  dataset,
  annotations,
  context,
  question,
  hints: hintsData,
  rubric,
  steps,
  actions,
  feedback_general,
  feedback_buy,
  feedback_sell,
  feedback_skip,
  feedback,
  // Legacy v1 props
  scenarioData,
  educationalContext,
  feedbackBuy,
  feedbackSell,
  feedbackSkip,
  className
}) => {
  const [userAction, setUserAction] = useState<UserAction>('idle');
  const [isRevealed, setIsRevealed] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());
  const [score, setScore] = useState<number | null>(null);

  const isV2 = v === '2';
  const eduContext = context || educationalContext;
  
  // Normalize hints with proper validation
  const normalizedHints: Hint[] = React.useMemo(() => {
    // Check if hintsData exists and is an array
    if (!hintsData || !Array.isArray(hintsData)) {
      console.warn('TradingSimulatorV2: hints is not an array', hintsData);
      return [];
    }
    
    // If array is empty, return empty array
    if (hintsData.length === 0) return [];
    
    // If first element is a string, convert string array to Hint objects
    if (typeof hintsData[0] === 'string') {
      return (hintsData as string[]).map((text, idx) => ({ id: `hint-${idx}`, text }));
    }
    
    // Otherwise assume it's already an array of Hint objects
    return hintsData as Hint[];
  }, [hintsData]);

  // Get allowed actions
  const allowedActions: TradeAction[] = actions?.allowed || ['market_buy', 'market_sell', 'skip'];

  // Handle action
  const handleAction = useCallback((action: TradeAction) => {
    setUserAction(action);
    
    // Calculate score if rubric provided
    if (isV2 && rubric && scenarioData) {
      const calculatedScore = calculateScore(action, scenarioData.correct_action, rubric);
      setScore(calculatedScore);
    }

    setTimeout(() => {
      setIsRevealed(true);
    }, 800);
  }, [isV2, rubric, scenarioData]);

  // Get chart data
  const getChartData = useCallback(() => {
    if (!scenarioData) return [];

    const historical = scenarioData.historical.map((price, i) => ({
      index: i,
      price,
      phase: 'historical'
    }));

    const current = {
      index: scenarioData.historical.length,
      price: scenarioData.current,
      phase: 'current'
    };

    const future = isRevealed
      ? scenarioData.future.map((price, i) => ({
          index: scenarioData.historical.length + 1 + i,
          price,
          phase: 'future'
        }))
      : [];

    return [...historical, current, ...future];
  }, [scenarioData, isRevealed]);

  // Calculate pips won/lost
  const calculatePips = useCallback((): number => {
    if (!scenarioData || !isRevealed) return 0;

    const { correct_action, entry, stop_loss, take_profit, future } = scenarioData;
    const finalPrice = future[future.length - 1];

    if (!entry || userAction === 'skip') return 0;

    if (userAction === 'market_buy' || (userAction === 'idle' && correct_action === 'buy')) {
      if (take_profit && finalPrice >= take_profit) {
        return Math.round((take_profit - entry) * 10000);
      }
      if (stop_loss && finalPrice <= stop_loss) {
        return -Math.round((entry - stop_loss) * 10000);
      }
      return Math.round((finalPrice - entry) * 10000);
    }

    if (userAction === 'market_sell' || (userAction === 'idle' && correct_action === 'sell')) {
      if (take_profit && finalPrice <= take_profit) {
        return Math.round((entry - take_profit) * 10000);
      }
      if (stop_loss && finalPrice >= stop_loss) {
        return -Math.round((stop_loss - entry) * 10000);
      }
      return Math.round((entry - finalPrice) * 10000);
    }

    return 0;
  }, [scenarioData, isRevealed, userAction]);

  // Get feedback message
  const getFeedback = useCallback((): string => {
    if (feedback && userAction !== 'idle') {
      return feedback[userAction] || '';
    }

    switch (userAction) {
      case 'market_buy':
        return feedback_buy || feedbackBuy || '';
      case 'market_sell':
        return feedback_sell || feedbackSell || '';
      case 'skip':
        return feedback_skip || feedbackSkip || '';
      default:
        return '';
    }
  }, [userAction, feedback, feedback_buy, feedback_sell, feedback_skip, feedbackBuy, feedbackSell, feedbackSkip]);

  // Toggle hint
  const toggleHint = (index: number) => {
    setRevealedHints(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Reset simulation
  const handleReset = () => {
    setUserAction('idle');
    setIsRevealed(false);
    setShowExplanation(false);
    setRevealedHints(new Set());
    setScore(null);
  };

  const pips = calculatePips();
  const chartData = getChartData();

  return (
    <Card className={cn('my-6 border-primary/20 shadow-lg', className)}>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {asset}
            </Badge>
            {isV2 && (
              <>
                <Badge variant="secondary">{timeframe}</Badge>
                <Badge variant="secondary">{chart}</Badge>
              </>
            )}
          </div>
          {isV2 && risk && (
            <Badge variant="outline" className="gap-1">
              <Shield className="h-3 w-3" />
              Risk: {risk.risk_pct}% | Min R:R {risk.min_rr}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl">{scenario.replace(/_/g, ' ').toUpperCase()}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Educational Context */}
        {eduContext && (
          <Alert className="border-primary/30 bg-primary/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">{eduContext.concept}</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {eduContext.whatToLook.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="text-sm italic text-muted-foreground">{eduContext.hint}</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Chart */}
        <div className="rounded-lg border bg-card p-4">
          <ResponsiveContainer width="100%" height={300}>
            {chart === 'candles' && dataset ? (
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
                {scenarioData?.entry && (
                  <ReferenceLine y={scenarioData.entry} stroke="blue" strokeDasharray="3 3" label="Entry" />
                )}
                {scenarioData?.stop_loss && (
                  <ReferenceLine y={scenarioData.stop_loss} stroke="red" strokeDasharray="3 3" label="SL" />
                )}
                {scenarioData?.take_profit && (
                  <ReferenceLine y={scenarioData.take_profit} stroke="green" strokeDasharray="3 3" label="TP" />
                )}
              </ComposedChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={getLineColor(pips)}
                  strokeWidth={2}
                  dot={{ fill: getLineColor(pips) }}
                />
                {scenarioData?.entry && (
                  <ReferenceLine y={scenarioData.entry} stroke="blue" strokeDasharray="3 3" label="Entry" />
                )}
                {scenarioData?.stop_loss && (
                  <ReferenceLine y={scenarioData.stop_loss} stroke="red" strokeDasharray="3 3" label="SL" />
                )}
                {scenarioData?.take_profit && (
                  <ReferenceLine y={scenarioData.take_profit} stroke="green" strokeDasharray="3 3" label="TP" />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Question */}
        <div className="rounded-lg bg-muted p-4">
          <p className="font-medium whitespace-pre-wrap">{question}</p>
        </div>

        {/* Hints */}
        {normalizedHints.length > 0 && (
          <div className="space-y-2">
            {normalizedHints.map((hint, idx) => (
              <Collapsible key={hint.id}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between"
                    onClick={() => toggleHint(idx)}
                  >
                    <span className="flex items-center gap-2">
                      {revealedHints.has(idx) ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      Hint {idx + 1}
                    </span>
                    {revealedHints.has(idx) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 rounded-md border bg-muted/50 p-3 text-sm">
                  {hint.text}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}

        {/* Actions */}
        {userAction === 'idle' && (
          <div className="flex gap-3 justify-center">
            {allowedActions.includes('market_buy') && (
              <Button onClick={() => handleAction('market_buy')} className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Buy
              </Button>
            )}
            {allowedActions.includes('market_sell') && (
              <Button onClick={() => handleAction('market_sell')} variant="destructive" className="gap-2">
                <TrendingDown className="h-4 w-4" />
                Sell
              </Button>
            )}
            {allowedActions.includes('skip') && (
              <Button onClick={() => handleAction('skip')} variant="outline" className="gap-2">
                Skip
              </Button>
            )}
          </div>
        )}

        {/* Results */}
        {isRevealed && (
          <div className="space-y-4">
            {/* Score */}
            {score !== null && rubric && (
              <div className="rounded-lg border bg-card p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Score</span>
                  <Badge variant={score >= 0.7 ? 'default' : score >= 0.5 ? 'secondary' : 'destructive'}>
                    {Math.round(score * 100)}%
                  </Badge>
                </div>
                <Progress value={score * 100} className="h-2" />
              </div>
            )}

            {/* Pips Result */}
            {getResultBadge(pips, userAction)}

            {/* Feedback */}
            <Alert className={cn(
              pips > 0 ? 'border-green-500/50 bg-green-500/10' :
              pips < 0 ? 'border-red-500/50 bg-red-500/10' :
              'border-yellow-500/50 bg-yellow-500/10'
            )}>
              <AlertDescription className="whitespace-pre-wrap">
                {getFeedback()}
              </AlertDescription>
            </Alert>

            {/* General Feedback */}
            {feedback_general && (
              <Alert>
                <AlertDescription className="whitespace-pre-wrap">
                  {feedback_general}
                </AlertDescription>
              </Alert>
            )}

            {/* Risk Management Details */}
            {scenarioData?.entry && scenarioData?.stop_loss && scenarioData?.take_profit && (
              <Collapsible open={showExplanation} onOpenChange={setShowExplanation}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full">
                    {showExplanation ? 'Hide' : 'Show'} Risk Management Details
                    {showExplanation ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pt-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Entry</p>
                      <p className="font-mono font-semibold">{scenarioData.entry.toFixed(5)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Stop Loss</p>
                      <p className="font-mono font-semibold text-red-500">{scenarioData.stop_loss.toFixed(5)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Take Profit</p>
                      <p className="font-mono font-semibold text-green-500">{scenarioData.take_profit.toFixed(5)}</p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            <Button onClick={handleReset} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {userAction !== 'idle' && !isRevealed && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Revealing results...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper functions
function getLineColor(pips: number): string {
  if (pips > 0) return 'hsl(var(--success))';
  if (pips < 0) return 'hsl(var(--destructive))';
  return 'hsl(var(--muted-foreground))';
}

function getResultBadge(pips: number, action: UserAction) {
  if (action === 'skip') {
    return (
      <Badge variant="outline" className="w-full justify-center py-2 text-base">
        ⚠️ Opportunity Skipped
      </Badge>
    );
  }

  if (pips > 0) {
    return (
      <Badge className="w-full justify-center py-2 text-base bg-green-500 hover:bg-green-600">
        <CheckCircle2 className="mr-2 h-4 w-4" />
        +{pips} pips won
      </Badge>
    );
  }

  if (pips < 0) {
    return (
      <Badge variant="destructive" className="w-full justify-center py-2 text-base">
        <AlertCircle className="mr-2 h-4 w-4" />
        {pips} pips lost
      </Badge>
    );
  }

  return null;
}

function calculateScore(
  userAction: TradeAction,
  correctAction: string,
  rubric: Record<string, number>
): number {
  let score = 0;

  // Simple scoring: full points if action matches
  if (userAction === `market_${correctAction}` || userAction === correctAction) {
    score = 1;
  } else if (userAction === 'skip') {
    score = 0.3; // Partial credit for recognizing uncertainty
  }

  return score;
}
