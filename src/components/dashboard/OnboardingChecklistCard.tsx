import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

interface OnboardingChecklistCardProps {
  items: ChecklistItem[];
  onToggle?: (id: string) => void;
}

export function OnboardingChecklistCard({ items, onToggle }: OnboardingChecklistCardProps) {
  const completedCount = items.filter((item) => item.completed).length;
  const progress = (completedCount / items.length) * 100;
  const allCompleted = completedCount === items.length;

  if (allCompleted) {
    return null; // Hide when all tasks are completed
  }

  return (
    <Card className="border-teal/20">
      <CardHeader className={DESIGN_TOKENS.spacing.card.base}>
        <div className="flex items-center gap-2">
          <CheckCircle2 className={cn(DESIGN_TOKENS.icon.md, "text-teal")} />
          <CardTitle>Primeros Pasos</CardTitle>
        </div>
        <CardDescription>
          Completa estos pasos para aprovechar al máximo la plataforma
        </CardDescription>
      </CardHeader>
      <CardContent className={cn(DESIGN_TOKENS.spacing.card.base, "pt-0 space-y-4")}>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progreso</span>
            <span className="text-teal font-medium">
              {completedCount}/{items.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <Checkbox
                id={item.id}
                checked={item.completed}
                onCheckedChange={() => onToggle?.(item.id)}
                className="border-teal data-[state=checked]:bg-teal"
              />
              <label
                htmlFor={item.id}
                className={cn(
                  "text-sm cursor-pointer flex-1",
                  item.completed
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                )}
              >
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
