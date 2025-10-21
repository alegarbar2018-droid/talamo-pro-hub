import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export function DashboardLayout() {
  const location = useLocation();
  const isLessonView = location.pathname.includes('/academy/lesson/');
  
  return (
    <SidebarProvider defaultOpen={true}>
      {!isLessonView && <DashboardSidebar />}
      <SidebarInset className={cn(!isLessonView && "")}>
        {/* Mobile trigger - visible only on mobile and not in lesson view */}
        {!isLessonView && (
          <header className={cn(
            "sticky top-0 z-40 flex h-14 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden",
            DESIGN_TOKENS.spacing.gap.sm,
            "px-4"
          )}>
            <SidebarTrigger />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-bold text-base bg-gradient-to-r from-teal via-cyan to-teal bg-clip-text text-transparent">
                Tálamo
              </span>
              <span className="text-[9px] text-muted-foreground font-medium tracking-wider uppercase">
                Pro Hub
              </span>
            </div>
          </header>
        )}
        <main className={cn(
          "flex-1 overflow-auto",
          isLessonView && "p-0"
        )}>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
