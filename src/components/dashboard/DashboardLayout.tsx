import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative">
        {/* Global sidebar trigger - always visible */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <SidebarTrigger />
        </div>
        
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
