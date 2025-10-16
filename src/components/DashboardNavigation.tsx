import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LayoutDashboard, GraduationCap, TrendingUp, Users, Wrench, BookMarked, Shield, Settings, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const DashboardNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation(["nav"]);
  const { session } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: t("nav:academy"), href: "/academy", icon: GraduationCap },
    { label: t("nav:signals"), href: "/signals", icon: TrendingUp },
    { label: t("nav:copy"), href: "/copy-trading", icon: Users },
    { label: t("nav:tools"), href: "/tools", icon: Wrench },
    { label: t("nav:journal"), href: "/journal", icon: BookMarked },
    { label: t("nav:audit"), href: "/audit", icon: Shield }
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión",
        variant: "destructive"
      });
    } else {
      navigate("/");
    }
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 group"
          >
            <div className="w-7 h-7 bg-gradient-primary rounded-md flex items-center justify-center">
              <span className="text-white font-semibold text-sm">T</span>
            </div>
            <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
              Tálamo
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg flex items-center gap-2 ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {session?.user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  {t("nav:settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("nav:logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] p-0 bg-background border-border/40">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-border/20">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
                        <AvatarFallback>
                          {session?.user?.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {session?.user?.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-muted-foreground">Usuario</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex-1 p-6 space-y-2">
                    {navItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleNavigation(item.href)}
                        className={`w-full flex items-center gap-4 p-4 text-left rounded-lg transition-all duration-200 ${
                          isActive(item.href)
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted/50 text-foreground"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                          isActive(item.href) ? "bg-primary/20" : "bg-muted"
                        }`}>
                          <item.icon className={`h-4 w-4 ${
                            isActive(item.href) ? "text-primary" : "text-muted-foreground"
                          }`} />
                        </div>
                        <span className="font-medium text-sm">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Footer Actions */}
                  <div className="p-6 border-t border-border/20 space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => handleNavigation("/settings")}
                      className="w-full justify-start"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      {t("nav:settings")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full justify-start text-destructive hover:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("nav:logout")}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavigation;
