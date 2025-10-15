import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

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
  primaryCTA,
  badge,
  icon,
}: ExplainerCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-line/50 bg-surface/30 group cursor-pointer" onClick={primaryCTA.onClick}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          {icon && (
            <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              {icon}
            </div>
          )}
          {badge && (
            <Badge variant={badge.variant} className="text-xs">
              {badge.label}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg leading-tight">{title}</CardTitle>
        <CardDescription className="text-sm line-clamp-2 mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          variant="ghost" 
          className="w-full justify-between group-hover:bg-primary/5"
          onClick={(e) => {
            e.stopPropagation();
            primaryCTA.onClick();
          }}
        >
          {primaryCTA.label}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}
