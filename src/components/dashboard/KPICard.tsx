import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function KPICard({ title, value, icon: Icon, trend, className }: KPICardProps) {
  const isPositive = trend && trend.value > 0;
  const isNegative = trend && trend.value < 0;

  return (
    <Card className={cn(DESIGN_TOKENS.shadow.cardHover, DESIGN_TOKENS.transition.card, className)}>
      <CardContent className={DESIGN_TOKENS.spacing.card.base}>
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-xl bg-gradient-to-br from-teal/20 to-cyan/20", DESIGN_TOKENS.radius.button)}>
            <Icon className={cn(DESIGN_TOKENS.icon.md, "text-teal")} />
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                isPositive && "text-green-500",
                isNegative && "text-red-500"
              )}
            >
              {isPositive && <TrendingUp className={DESIGN_TOKENS.icon.xs} />}
              {isNegative && <TrendingDown className={DESIGN_TOKENS.icon.xs} />}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
          {trend && (
            <p className="text-xs text-muted-foreground">{trend.label}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
