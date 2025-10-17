import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface TechTermProps {
  term: string;
  definition: string;
  children?: React.ReactNode;
}

export function TechTerm({ term, definition, children }: TechTermProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted decoration-primary cursor-help text-primary">
            {children || term}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-surface border-line">
          <p className="font-semibold text-foreground mb-1">{term}</p>
          <p className="text-sm text-muted-foreground">{definition}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
