import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Target, TrendingUp, GraduationCap, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Academia", href: "/academy", icon: GraduationCap, description: "Aprende trading profesional" },
    { label: "Señales", href: "/signals", icon: TrendingUp, description: "Señales verificadas en vivo" },
    { label: "Copy Trading", href: "/copy-trading", icon: Users, description: "Copia a traders exitosos" },
    { label: "Herramientas", href: "/tools", icon: Zap, description: "Tools profesionales" }
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                Tálamo
              </span>
              <Badge variant="outline" className="border-teal text-teal text-xs">
                Trading Hub
              </Badge>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() => handleNavigation(item.href)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              Iniciar Sesión
            </Button>
            <Button 
              onClick={() => navigate("/onboarding?step=choose")}
              className="bg-gradient-primary hover:shadow-glow relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Únete Gratis
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-line">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">T</span>
                    </div>
                    <span className="text-xl font-bold text-foreground">Tálamo</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 p-6 space-y-4">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavigation(item.href)}
                      className="w-full flex items-start gap-3 p-4 text-left rounded-xl hover:bg-primary/10 transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{item.label}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* CTA Section */}
                <div className="p-6 border-t border-line space-y-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleNavigation("/login")}
                    className="w-full"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    onClick={() => handleNavigation("/onboarding?step=choose")}
                    className="w-full bg-gradient-primary hover:shadow-glow"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Únete Gratis a Tálamo
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;