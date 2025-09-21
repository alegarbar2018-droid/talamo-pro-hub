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
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <button 
            onClick={() => navigate("/")}
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
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200" />
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/login")}
              className="text-sm font-medium"
            >
              Iniciar Sesión
            </Button>
            <Button 
              onClick={() => navigate("/onboarding?step=choose")}
              className="bg-gradient-primary hover:shadow-lg text-sm font-medium px-6"
            >
              Comenzar
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