import { ReactNode } from "react";
import { HelpCircle, LucideIcon } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { motion } from "framer-motion";

interface SpecificationRowProps {
  label: string;
  value: string | number;
  unit?: string;
  tooltip?: string;
  icon: LucideIcon;
  variant?: "default" | "positive" | "negative" | "warning";
}

export function SpecificationRow({
  label,
  value,
  unit,
  tooltip,
  icon: Icon,
  variant = "default"
}: SpecificationRowProps) {
  const variantClasses = {
    default: "text-foreground",
    positive: "text-teal",
    negative: "text-red-500",
    warning: "text-amber-500"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-surface/50 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-teal/10 text-teal group-hover:bg-teal/20 transition-colors">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">{label}</p>
          {tooltip && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <HelpCircle className="h-3 w-3 text-muted-foreground/50 hover:text-teal cursor-help transition-colors" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p className="text-sm">{tooltip}</p>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className={`text-lg font-semibold ${variantClasses[variant]}`}>
          {value}
        </p>
        {unit && <p className="text-xs text-muted-foreground">{unit}</p>}
      </div>
    </motion.div>
  );
}
