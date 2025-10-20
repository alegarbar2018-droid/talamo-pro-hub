import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <Card className="group hover:shadow-glow-subtle hover:-translate-y-1 transition-all duration-300 border-line">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-teal/20 to-cyan/20 group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-6 w-6 text-teal" />
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
      <CardContent className="space-y-4">
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
          <div className="grid grid-cols-2 gap-2">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-muted/50 text-center"
              >
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
        
        <Button
          variant="outline"
          className="w-full border-teal text-teal hover:bg-teal hover:text-white group-hover:translate-x-1 transition-all"
          onClick={() => navigate(actionPath)}
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
