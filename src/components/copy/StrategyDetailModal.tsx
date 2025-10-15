import { CopyStrategy } from "@/modules/copy/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, TrendingUp, Award, Target, Shield, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency, formatPercentage } from "@/lib/locale";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { OrderHistoryTable } from "./OrderHistoryTable";

interface StrategyDetailModalProps {
  strategy: CopyStrategy | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StrategyDetailModal({ strategy, isOpen, onClose }: StrategyDetailModalProps) {
  const { t, i18n } = useTranslation();

  if (!strategy) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage src={strategy.trader_avatar_url} alt={strategy.trader_name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                {strategy.trader_name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{strategy.trader_name}</DialogTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="default">{strategy.account_type.toUpperCase()}</Badge>
                <Badge variant="outline">
                  {t("copy.strategy.leverage")}: {strategy.leverage}:1
                </Badge>
              </div>
            </div>
          </div>
          {strategy.trader_bio && (
            <DialogDescription className="text-base">
              {strategy.trader_bio}
            </DialogDescription>
          )}
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">{t("copy.strategy.overview")}</TabsTrigger>
            <TabsTrigger value="performance">{t("copy.strategy.performance")}</TabsTrigger>
            <TabsTrigger value="orders">{t("copy.strategy.orders")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{t("copy.strategy.total_return")}</span>
                </div>
                <p className="text-3xl font-bold text-primary">
                  {formatPercentage(strategy.total_return_percentage || 0, i18n.language)}
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{t("copy.strategy.strategy_equity")}</span>
                </div>
                <p className="text-3xl font-bold">
                  {formatCurrency(strategy.strategy_equity, i18n.language)}
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{t("copy.strategy.profit_factor")}</span>
                </div>
                <p className="text-3xl font-bold">
                  {strategy.profit_factor?.toFixed(2) || 'N/A'}
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{t("copy.strategy.win_rate")}</span>
                </div>
                <p className="text-3xl font-bold">
                  {formatPercentage(strategy.win_rate || 0, i18n.language)}
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{t("copy.strategy.max_dd")}</span>
                </div>
                <p className="text-3xl font-bold text-destructive">
                  {formatPercentage(strategy.max_drawdown || 0, i18n.language)}
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{t("copy.strategy.monthly_return")}</span>
                </div>
                <p className="text-3xl font-bold">
                  {formatPercentage(strategy.monthly_return_percentage || 0, i18n.language)}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <h4 className="font-semibold mb-3">{t("copy.strategy.investment_details")}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("copy.strategy.min_investment")}</span>
                  <span className="font-semibold">{formatCurrency(strategy.min_investment, i18n.language)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("copy.strategy.performance_fee")}</span>
                  <span className="font-semibold">{formatPercentage(strategy.performance_fee, i18n.language)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("copy.strategy.billing_period")}</span>
                  <span className="font-semibold capitalize">{strategy.billing_period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("copy.strategy.total_trades")}</span>
                  <span className="font-semibold">{strategy.total_trades || 0}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <h4 className="font-semibold mb-3">{t("copy.strategy.symbols_traded")}</h4>
              <div className="flex flex-wrap gap-2">
                {strategy.symbols_traded.map((symbol, idx) => (
                  <Badge key={idx} variant="secondary">
                    {symbol}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            {strategy.cumulative_return_data && strategy.cumulative_return_data.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-semibold">{t("copy.strategy.cumulative_return_chart")}</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={strategy.cumulative_return_data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [`${value.toFixed(2)}%`, 'Return']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="return" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                {t("copy.strategy.no_performance_data")}
              </p>
            )}
          </TabsContent>

          <TabsContent value="orders">
            <OrderHistoryTable strategyId={strategy.id} />
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {t("common.close")}
          </Button>
          <Button 
            onClick={() => window.open(strategy.strategy_link, '_blank')}
            className="flex-1 gap-2"
          >
            {t("copy.strategy.invest_now")}
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
