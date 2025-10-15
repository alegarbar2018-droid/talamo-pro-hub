import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExplainerCardProps {
  title: string;
  description: string;
  whenToUse: string[];
  whatYouNeed: string[];
  primaryCTA: {
    label: string;
    onClick: () => void;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
  badge?: {
    label: "Básica" | "Avanzada" | "Próximamente";
    variant: "default" | "secondary" | "outline";
  };
  icon?: React.ReactNode;
}

export function ExplainerCard({
  title,
  description,
  whenToUse,
  whatYouNeed,
  primaryCTA,
  secondaryCTA,
  badge,
  icon,
}: ExplainerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasLongContent = whenToUse.length > 3 || whatYouNeed.length > 3;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-line/50 bg-surface/30 flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-3 rounded-lg bg-primary/10">
                {icon}
              </div>
            )}
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              {badge && (
                <Badge variant={badge.variant} className="mt-2">
                  {badge.label}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <CardDescription className="mt-3 text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-1 flex flex-col">
        <div className={cn("space-y-6", !isExpanded && hasLongContent && "relative")}>
          {/* Cuándo usarla */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-2">Cuándo usarla:</h4>
            <ul className="space-y-1.5">
              {(isExpanded ? whenToUse : whenToUse.slice(0, 3)).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Qué necesitas */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-2">Qué necesitas:</h4>
            <ul className="space-y-1.5">
              {(isExpanded ? whatYouNeed : whatYouNeed.slice(0, 3)).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Gradient overlay when collapsed */}
          {!isExpanded && hasLongContent && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-surface/30 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Expand/Collapse button */}
        {hasLongContent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full -mt-2"
          >
            {isExpanded ? (
              <>
                Ver menos
                <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Ver más detalles
                <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}

        {/* CTAs */}
        <div className="flex gap-3 pt-4 mt-auto">
          <Button onClick={primaryCTA.onClick} className="flex-1">
            {primaryCTA.label}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {secondaryCTA && (
            <Button variant="outline" asChild>
              <a href={secondaryCTA.href} target="_blank" rel="noopener noreferrer">
                {secondaryCTA.label}
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
