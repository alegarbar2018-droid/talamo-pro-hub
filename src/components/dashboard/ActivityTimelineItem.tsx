import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityTimelineItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  type?: "success" | "info" | "warning";
}

export function ActivityTimelineItem({
  icon: Icon,
  title,
  description,
  time,
  type = "info",
}: ActivityTimelineItemProps) {
  return (
    <div className="flex gap-4 group">
      <div className="relative flex flex-col items-center">
        <div
          className={cn(
            "p-2 rounded-lg",
            type === "success" && "bg-green-500/10",
            type === "info" && "bg-teal/10",
            type === "warning" && "bg-yellow-500/10"
          )}
        >
          <Icon
            className={cn(
              "h-4 w-4",
              type === "success" && "text-green-500",
              type === "info" && "text-teal",
              type === "warning" && "text-yellow-500"
            )}
          />
        </div>
        <div className="w-px h-full bg-border group-last:hidden mt-2" />
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-start justify-between mb-1">
          <p className="font-medium text-foreground text-sm">{title}</p>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
