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
    <Sidebar collapsible="icon" className="border-r border-line">
      <SidebarHeader className="border-b border-line p-4">
        <div className="flex items-center justify-between">
          {open && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal to-cyan flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-teal to-cyan bg-clip-text text-transparent">
                Tálamo
              </span>
            </div>
          )}
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={!open ? "sr-only" : ""}>
            {t("dashboard:modules.title", "Módulos")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      end={item.path === "/dashboard"}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-teal/10 text-teal font-medium"
                          : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{t(item.labelKey)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Community Section */}
        <SidebarGroup>
          <SidebarGroupLabel className={!open ? "sr-only" : ""}>
            {t("nav:community")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {communityItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-teal/10 text-teal font-medium"
                          : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {open && (
                        <div className="flex items-center justify-between flex-1">
                          <span>{t(item.labelKey)}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-teal/20 text-teal border-teal/30"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-line p-2">
        {!open ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-teal to-cyan text-white text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">Usuario</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="h-4 w-4 mr-2" />
                {t("nav:settings")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LanguageSwitcher />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                {t("nav:logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-teal to-cyan text-white text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium truncate">Usuario</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="h-4 w-4 mr-2" />
                {t("nav:settings")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LanguageSwitcher />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                {t("nav:logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
