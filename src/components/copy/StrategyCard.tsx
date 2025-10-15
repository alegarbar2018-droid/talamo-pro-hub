import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Shield,
  ExternalLink,
  Target,
  Percent
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CopyStrategy } from '@/modules/copy/types';
import { addUTMParams } from '@/lib/addUTMParams';

interface StrategyCardProps {
  strategy: CopyStrategy;
}

export const StrategyCard = ({ strategy }: StrategyCardProps) => {
  const { t } = useTranslation(['copy']);
  
  const getRiskColor = (risk: string) => {
    const colors = {
      conservative: 'bg-success/20 text-success border-success/30',
      moderate: 'bg-warning/20 text-warning border-warning/30',
      aggressive: 'bg-destructive/20 text-destructive border-destructive/30'
    };
    return colors[risk as keyof typeof colors] || colors.moderate;
  };
  
  const getAccountTypeColor = (type: string) => {
    return type === 'Pro' 
      ? 'bg-primary/20 text-primary border-primary/30'
      : 'bg-muted/20 text-muted-foreground border-muted/30';
  };

  return (
    <Card className="border-line bg-surface/50 hover:shadow-glow-subtle transition-all h-full flex flex-col">
      <CardHeader className="space-y-3">
        {/* Trader Info */}
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={strategy.trader_avatar_url} alt={strategy.trader_name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {strategy.trader_name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-1">{strategy.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{t('copy:strategy_card.by', 'Por')} {strategy.trader_name}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {strategy.risk_band && (
            <Badge variant="outline" className={getRiskColor(strategy.risk_band)}>
              {t(`copy:risk.${strategy.risk_band}`, strategy.risk_band)}
            </Badge>
          )}
          <Badge variant="outline" className={getAccountTypeColor(strategy.account_type)}>
            {strategy.account_type}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {strategy.description}
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span className="text-xs">{t('copy:strategy_card.min_investment', 'Mín. Inversión')}</span>
            </div>
            <p className="font-semibold text-foreground">${strategy.min_investment}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Percent className="h-3 w-3" />
              <span className="text-xs">{t('copy:strategy_card.fee', 'Fee')}</span>
            </div>
            <p className="font-semibold text-foreground">{strategy.performance_fee_pct}%</p>
          </div>

          {strategy.profit_factor && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <BarChart3 className="h-3 w-3" />
                <span className="text-xs">PF</span>
              </div>
              <p className="font-semibold text-success">{strategy.profit_factor}x</p>
            </div>
          )}

          {strategy.max_drawdown && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <TrendingDown className="h-3 w-3" />
                <span className="text-xs">Max DD</span>
              </div>
              <p className="font-semibold text-destructive">{strategy.max_drawdown}%</p>
            </div>
          )}

          {strategy.win_rate && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Target className="h-3 w-3" />
                <span className="text-xs">{t('copy:strategy_card.win_rate', 'Win Rate')}</span>
              </div>
              <p className="font-semibold text-foreground">{strategy.win_rate}%</p>
            </div>
          )}

          {strategy.monthly_return_percentage && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs">{t('copy:strategy_card.monthly_return', 'Ret. Mensual')}</span>
              </div>
              <p className="font-semibold text-success">+{strategy.monthly_return_percentage}%</p>
            </div>
          )}
        </div>

        {/* Symbols */}
        {strategy.symbols_traded && strategy.symbols_traded.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {t('copy:strategy_card.symbols', 'Símbolos')}:
            </p>
            <div className="flex flex-wrap gap-1">
              {strategy.symbols_traded.slice(0, 5).map((symbol) => (
                <Badge key={symbol} variant="outline" className="text-xs">
                  {symbol}
                </Badge>
              ))}
              {strategy.symbols_traded.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{strategy.symbols_traded.length - 5}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Button 
          className="w-full gap-2" 
          onClick={() => {
            const link = addUTMParams(strategy.strategy_link, {
              source: 'talamo',
              medium: 'copy_trading',
              campaign: strategy.name
            });
            window.open(link, '_blank', 'noopener,noreferrer');
          }}
        >
          <Shield className="h-4 w-4" />
          {t('copy:strategy_card.follow', 'Seguir en Exness')}
          <ExternalLink className="h-3 w-3" />
        </Button>

        {/* Additional Info */}
        <div className="pt-2 border-t border-line space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>{t('copy:strategy_card.leverage', 'Apalancamiento')}:</span>
            <span className="font-medium text-foreground">1:{strategy.leverage}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('copy:strategy_card.equity', 'Strategy Equity')}:</span>
            <span className="font-medium text-foreground">${strategy.strategy_equity.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('copy:strategy_card.billing', 'Facturación')}:</span>
            <span className="font-medium text-foreground capitalize">
              {t(`copy:billing.${strategy.billing_period}`, strategy.billing_period)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
