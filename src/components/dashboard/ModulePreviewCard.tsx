import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

interface ModulePreviewCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  progress?: number;
  actionLabel: string;
  actionPath: string;
  stats?: {
    label: string;
    value: string | number;
  }[];
}

export function ModulePreviewCard({
  title,
  description,
  icon: Icon,
  badge,
  progress,
  actionLabel,
  actionPath,
  stats,
}: ModulePreviewCardProps) {
  const navigate = useNavigate();

  return (
    <Card className={cn(
      "group border-line",
      DESIGN_TOKENS.shadow.cardHover,
      DESIGN_TOKENS.transition.card,
      DESIGN_TOKENS.radius.card
    )}>
      <CardHeader className={DESIGN_TOKENS.spacing.card.base}>
        <div className="flex items-start justify-between mb-2">
          <div className={cn(
            "p-3 bg-gradient-to-br from-teal/20 to-cyan/20 group-hover:scale-110",
            DESIGN_TOKENS.radius.button,
            DESIGN_TOKENS.transition.default
          )}>
            <Icon className={cn(DESIGN_TOKENS.icon.lg, "text-teal")} />
          </div>
          {badge && (
            <Badge variant="outline" className="border-teal/30 text-teal bg-teal/10">
              {badge}
            </Badge>
          )}
        </div>
        <CardTitle className="text-foreground">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className={cn(DESIGN_TOKENS.spacing.card.base, "pt-0 space-y-4")}>
        {progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="text-teal font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {stats && stats.length > 0 && (
          <div className={cn("grid grid-cols-2", DESIGN_TOKENS.spacing.gap.sm)}>
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={cn("p-2 bg-muted/50 text-center", DESIGN_TOKENS.radius.button)}
              >
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
        
        <Button
          variant="outline"
          className={cn(
            "w-full border-teal text-teal hover:bg-teal hover:text-white group-hover:translate-x-1",
            DESIGN_TOKENS.transition.default
          )}
          onClick={() => navigate(actionPath)}
        >
          {actionLabel}
          <ArrowRight className={cn(DESIGN_TOKENS.icon.sm, "ml-2")} />
        </Button>
      </CardContent>
    </Card>
  );
}
