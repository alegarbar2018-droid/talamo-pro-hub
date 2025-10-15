import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StatsCardsProps {
  stats: {
    win_rate: number;
    max_dd: number;
    profit_factor: number;
    total_trades: number;
  } | null;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const { t } = useTranslation();
  
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="bg-surface border-line/50">
            <CardContent className="p-6">
              <div className="h-20 animate-pulse bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: t('tools.audit.stats.win_rate', 'Win Rate'),
      value: `${stats.win_rate.toFixed(1)}%`,
      icon: Target,
      color: 'text-teal',
    },
    {
      label: t('tools.audit.stats.max_dd', 'Max Drawdown'),
      value: `-${stats.max_dd.toFixed(2)}%`,
      icon: TrendingDown,
      color: 'text-loss',
    },
    {
      label: t('tools.audit.stats.profit_factor', 'Profit Factor'),
      value: stats.profit_factor > 100 ? '∞' : stats.profit_factor.toFixed(2),
      icon: TrendingUp,
      color: 'text-profit',
    },
    {
      label: t('tools.audit.stats.total_trades', 'Total Trades'),
      value: stats.total_trades.toString(),
      icon: BarChart3,
      color: 'text-muted-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="bg-surface border-line/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-3xl font-bold tabular-nums mt-2 ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color} opacity-50`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
