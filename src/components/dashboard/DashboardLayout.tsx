import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardSidebar />
      <SidebarInset>
        {/* Mobile trigger - visible only on mobile */}
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden px-4">
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
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
