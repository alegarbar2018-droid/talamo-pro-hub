import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock } from "lucide-react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface CalculatorCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  category: 'basic' | 'intermediate' | 'advanced';
  requiresContractSpec?: boolean;
  previewValue?: string;
  previewLabel?: string;
  onOpen: () => void;
  tags?: string[];
}

export function CalculatorCard({
  title,
  description,
  icon: Icon,
  category,
  requiresContractSpec = false,
  previewValue,
  previewLabel,
  onOpen,
  tags,
}: CalculatorCardProps) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'basic':
        return 'bg-success/10 text-success border-success/30';
      case 'intermediate':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'advanced':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/30';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'basic':
        return 'Básica';
      case 'intermediate':
        return 'Intermedia';
      case 'advanced':
        return 'Avanzada';
      default:
        return cat;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="group relative overflow-hidden border-line/50 bg-surface/30 backdrop-blur-sm transition-all duration-300 hover:border-teal/30 hover:shadow-glow-subtle cursor-pointer"
        onClick={onOpen}
        role="article"
        aria-label={`${title} calculator card`}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal/0 to-teal/0 group-hover:from-teal/5 group-hover:to-teal/10 transition-all duration-300 pointer-events-none" />

      <CardHeader className="relative">
        <div className="flex items-start justify-between gap-4 mb-3">
          {/* Icon */}
          <div className="p-2.5 rounded-lg bg-gradient-to-br from-teal/20 to-teal/5 border border-teal/30 group-hover:border-teal/50 transition-colors">
            <Icon className="w-5 h-5 text-teal" />
          </div>

          {/* Category badge */}
          <Badge className={`${getCategoryColor(category)} text-xs`}>
            {getCategoryLabel(category)}
          </Badge>
        </div>

        <CardTitle className="text-lg group-hover:text-teal transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-sm">
          {description}
        </CardDescription>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs border-line/30 text-muted-foreground"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Preview value (if available) */}
        {previewValue && previewLabel && (
          <div className="p-3 rounded-lg bg-muted/20 border border-line/30">
            <p className="text-xs text-muted-foreground mb-1">{previewLabel}</p>
            <p className="text-lg font-bold bg-gradient-to-r from-teal to-teal-dark bg-clip-text text-transparent">
              {previewValue}
            </p>
          </div>
        )}

        {/* Requires contract spec notice */}
        {requiresContractSpec && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-warning/5 border border-warning/20 rounded px-2 py-1.5">
            <Lock className="w-3.5 h-3.5 text-warning" />
            <span>Requiere especificaciones de contrato</span>
          </div>
        )}

        {/* Open button */}
        <Button
          variant="ghost"
          className="w-full justify-between hover:bg-teal/10 hover:text-teal transition-colors group/btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          aria-label={`Open ${title} calculator`}
        >
          <span>Abrir calculadora</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
    </motion.div>
  );
}
