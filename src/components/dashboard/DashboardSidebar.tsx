import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  BookOpen,
  Radio,
  Copy,
  Calculator,
  BookMarked,
  BarChart3,
  Users,
  Gift,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

const navigationItems = [
  { path: "/dashboard", icon: LayoutDashboard, labelKey: "nav:home" },
  { path: "/academy", icon: BookOpen, labelKey: "nav:academy" },
  { path: "/signals", icon: Radio, labelKey: "nav:signals" },
  { path: "/copy-trading", icon: Copy, labelKey: "nav:copy" },
  { path: "/tools", icon: Calculator, labelKey: "nav:tools" },
  { path: "/journal", icon: BookMarked, labelKey: "nav:journal" },
  { path: "/audit", icon: BarChart3, labelKey: "nav:audit" },
];

const communityItems = [
  { path: "/community", icon: Users, labelKey: "nav:community", badge: "soon" },
  { path: "/referrals", icon: Gift, labelKey: "nav:referrals", badge: "soon" },
];

export function DashboardSidebar() {
  const { t } = useTranslation(["nav", "dashboard"]);
  const { open } = useSidebar();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const userInitials = user?.email?.substring(0, 2).toUpperCase() || "U";

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-line/50 bg-gradient-to-b from-surface/95 via-background/98 to-surface/95 backdrop-blur-xl"
    >
      <SidebarHeader className="border-b border-line/50 p-4 bg-gradient-to-br from-teal/5 via-transparent to-cyan/5">
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal to-cyan rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-cyan flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-base">T</span>
            </div>
          </div>
          {open && (
            <div className="flex flex-col flex-1">
              <span className="font-bold text-xl bg-gradient-to-r from-teal via-cyan to-teal bg-clip-text text-transparent animate-gradient">
                Tálamo
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
                Pro Hub
              </span>
            </div>
          )}
          <SidebarTrigger className="hover:bg-teal/10 hover:text-teal transition-all rounded-lg p-2" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={!open ? "sr-only" : "text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2 px-3"}>
            {t("dashboard:modules.title", "Módulos")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item, index) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      end={item.path === "/dashboard"}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-teal/15 via-teal/10 to-cyan/15 text-teal font-semibold shadow-md shadow-teal/10"
                            : "hover:bg-gradient-to-r hover:from-muted/60 hover:to-muted/40 text-muted-foreground hover:text-foreground"
                        }`
                      }
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {({ isActive }) => (
                        <>
                          <div className={`flex-shrink-0 p-2 rounded-lg transition-all duration-300 ${
                            isActive 
                              ? "bg-gradient-to-br from-teal/20 to-cyan/20" 
                              : "bg-muted/50 group-hover:bg-muted"
                          }`}>
                            <item.icon className={`h-5 w-5 transition-all duration-300 ${
                              isActive ? "text-teal" : "text-muted-foreground group-hover:text-foreground"
                            }`} />
                          </div>
                          {open && (
                            <span className="text-sm font-medium tracking-wide">
                              {t(item.labelKey)}
                            </span>
                          )}
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-teal to-cyan rounded-r-full" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Community Section */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className={!open ? "sr-only" : "text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2 px-3"}>
            {t("nav:community")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {communityItems.map((item, index) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-teal/15 via-teal/10 to-cyan/15 text-teal font-semibold shadow-md shadow-teal/10"
                            : "hover:bg-gradient-to-r hover:from-muted/60 hover:to-muted/40 text-muted-foreground hover:text-foreground"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className={`flex-shrink-0 p-2 rounded-lg transition-all duration-300 ${
                            isActive 
                              ? "bg-gradient-to-br from-teal/20 to-cyan/20" 
                              : "bg-muted/50 group-hover:bg-muted"
                          }`}>
                            <item.icon className={`h-5 w-5 transition-all duration-300 ${
                              isActive ? "text-teal" : "text-muted-foreground group-hover:text-foreground"
                            }`} />
                          </div>
                          {open && (
                            <div className="flex items-center justify-between flex-1">
                              <span className="text-sm font-medium tracking-wide">
                                {t(item.labelKey)}
                              </span>
                              {item.badge && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold tracking-wide"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                          )}
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-teal to-cyan rounded-r-full" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-line/50 p-3 bg-gradient-to-br from-teal/5 via-transparent to-cyan/5 backdrop-blur-sm">
        {!open ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full p-2 rounded-xl hover:bg-gradient-to-r hover:from-teal/10 hover:to-cyan/10 transition-all duration-300 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal/30 to-cyan/30 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Avatar className="h-9 w-9 relative border-2 border-teal/20 shadow-lg">
                    <AvatarImage src={user?.profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-teal to-cyan text-white text-xs font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-64 bg-background/95 backdrop-blur-xl border-line/50">
              <div className="px-3 py-2.5 bg-gradient-to-br from-teal/10 to-cyan/10 rounded-t-lg">
                <p className="text-sm font-semibold text-foreground">Usuario</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-line/50" />
              <DropdownMenuItem 
                onClick={() => navigate("/settings")}
                className="gap-3 py-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-teal/10 hover:to-cyan/10"
              >
                <div className="p-1.5 rounded-lg bg-muted/50">
                  <Settings className="h-4 w-4 text-teal" />
                </div>
                <span className="font-medium">{t("nav:settings")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-teal/10 hover:to-cyan/10">
                <LanguageSwitcher />
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-line/50" />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="gap-3 py-2.5 cursor-pointer text-destructive hover:bg-destructive/10"
              >
                <div className="p-1.5 rounded-lg bg-destructive/10">
                  <LogOut className="h-4 w-4" />
                </div>
                <span className="font-medium">{t("nav:logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-teal/10 hover:to-cyan/10 transition-all duration-300 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal/30 to-cyan/30 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Avatar className="h-9 w-9 relative border-2 border-teal/20 shadow-lg">
                    <AvatarImage src={user?.profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-teal to-cyan text-white text-xs font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">Usuario</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-teal transition-colors" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-64 bg-background/95 backdrop-blur-xl border-line/50">
              <div className="px-3 py-2.5 bg-gradient-to-br from-teal/10 to-cyan/10 rounded-t-lg">
                <p className="text-sm font-semibold text-foreground">Usuario</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-line/50" />
              <DropdownMenuItem 
                onClick={() => navigate("/settings")}
                className="gap-3 py-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-teal/10 hover:to-cyan/10"
              >
                <div className="p-1.5 rounded-lg bg-muted/50">
                  <Settings className="h-4 w-4 text-teal" />
                </div>
                <span className="font-medium">{t("nav:settings")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-teal/10 hover:to-cyan/10">
                <LanguageSwitcher />
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-line/50" />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="gap-3 py-2.5 cursor-pointer text-destructive hover:bg-destructive/10"
              >
                <div className="p-1.5 rounded-lg bg-destructive/10">
                  <LogOut className="h-4 w-4" />
                </div>
                <span className="font-medium">{t("nav:logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
