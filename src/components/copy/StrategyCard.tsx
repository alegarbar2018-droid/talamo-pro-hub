import { CopyStrategy } from "@/modules/copy/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, TrendingUp, TrendingDown, Shield, Award, Target } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency, formatPercentage } from "@/lib/locale";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface StrategyCardProps {
  strategy: CopyStrategy;
  onViewDetails: (strategy: CopyStrategy) => void;
}

export function StrategyCard({ strategy, onViewDetails }: StrategyCardProps) {
  const { t, i18n } = useTranslation();
  
  const getAccountTypeBadge = () => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      social: "default",
      standard: "secondary",
      pro: "outline"
    };
    
    return (
      <Badge variant={variants[strategy.account_type] || "default"} className="text-xs">
        {strategy.account_type.toUpperCase()}
      </Badge>
    );
  };

  const isPositiveReturn = (strategy.total_return_percentage || 0) >= 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarImage src={strategy.trader_avatar_url} alt={strategy.trader_name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {strategy.trader_name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{strategy.trader_name}</h3>
              {getAccountTypeBadge()}
            </div>
          </div>
          
          <div className={`flex items-center gap-1 ${isPositiveReturn ? 'text-green-500' : 'text-red-500'}`}>
            {isPositiveReturn ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            <span className="font-bold text-lg">
              {formatPercentage(strategy.total_return_percentage || 0, i18n.language)}
            </span>
          </div>
        </div>

        {strategy.cumulative_return_data && strategy.cumulative_return_data.length > 0 && (
          <div className="h-20 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={strategy.cumulative_return_data}>
                <defs>
                  <linearGradient id={`gradient-${strategy.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="return"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill={`url(#gradient-${strategy.id})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">PF:</span>
            <span className="font-semibold">{strategy.profit_factor?.toFixed(2) || 'N/A'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">WR:</span>
            <span className="font-semibold">{formatPercentage(strategy.win_rate || 0, i18n.language)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Max DD:</span>
            <span className="font-semibold">{formatPercentage(strategy.max_drawdown || 0, i18n.language)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{t("copy.strategy.monthly_return")}</span>
            <span className="font-semibold">{formatPercentage(strategy.monthly_return_percentage || 0, i18n.language)}</span>
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">{t("copy.strategy.min_balance")}</span>
            <span className="font-semibold">{formatCurrency(strategy.min_investment, i18n.language)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("copy.strategy.performance_fee")}</span>
            <span className="font-semibold">{formatPercentage(strategy.performance_fee, i18n.language)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 pt-2">
          {strategy.symbols_traded.slice(0, 3).map((symbol, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {symbol}
            </Badge>
          ))}
          {strategy.symbols_traded.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{strategy.symbols_traded.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onViewDetails(strategy)}
        >
          {t("copy.strategy.view_details")}
        </Button>
        <Button 
          className="flex-1 gap-2"
          onClick={() => window.open(strategy.strategy_link, '_blank')}
        >
          {t("copy.strategy.invest_now")}
          <ExternalLink className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
