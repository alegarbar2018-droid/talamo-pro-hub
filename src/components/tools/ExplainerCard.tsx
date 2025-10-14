import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2 } from "lucide-react";

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
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-line/50 bg-surface/30">
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
      <CardContent className="space-y-6">
        {/* Cuándo usarla */}
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-2">Cuándo usarla:</h4>
          <ul className="space-y-1.5">
            {whenToUse.map((item, idx) => (
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
            {whatYouNeed.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex gap-3 pt-4">
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
