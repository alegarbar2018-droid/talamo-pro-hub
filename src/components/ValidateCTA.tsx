import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Target, ArrowRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ValidateCTAProps {
  onOpenChangePartner: () => void;
  href?: string;
  variant?: "default" | "outline";
  size?: "default" | "lg";
  className?: string;
}

export const ValidateCTA = ({ 
  onOpenChangePartner, 
  href = "/auth/validate",
  variant = "outline",
  size = "default",
  className = ""
}: ValidateCTAProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const navigate = useNavigate();
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const menuItems = [
    {
      label: "Solicitar cambio de partner",
      action: () => {
        onOpenChangePartner();
        setIsOpen(false);
      },
      event: "cta_not_affiliated_change_partner"
    },
    {
      label: "Crear cuenta nueva", 
      action: () => {
        navigate("/auth/exness?flow=create");
        setIsOpen(false);
      },
      event: "cta_not_affiliated_create_account"
    },
    {
      label: "Volver a validar",
      action: () => {
        navigate(href);
        setIsOpen(false);
      },
      event: "cta_validate"
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setFocusIndex(prev => (prev + 1) % menuItems.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusIndex(prev => prev <= 0 ? menuItems.length - 1 : prev - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (focusIndex >= 0) {
          menuItems[focusIndex].action();
        }
        break;
    }
  };

  const handleMainAction = () => {
    console.info('CTA: Validar Acceso');
    navigate(href);
  };

  const handleTogglePopover = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setFocusIndex(-1);
    }
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      {/* Main Button */}
      <Button
        variant={variant}
        size={size}
        onClick={handleMainAction}
        className={`
          ${variant === "outline" ? "border-teal text-teal hover:bg-teal/10" : ""}
          rounded-r-none border-r-0
        `}
        data-event="cta_validate"
      >
        <Target className="h-5 w-5 mr-2" />
        Validar Acceso
      </Button>

      {/* Dropdown Trigger */}
      <button
        ref={triggerRef}
        onClick={handleTogglePopover}
        className={`
          inline-flex items-center justify-center
          ${variant === "outline" 
            ? "border border-teal text-teal hover:bg-teal/10" 
            : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          }
          ${size === "lg" ? "h-11 px-3" : "h-10 px-3"}
          rounded-l-none font-medium transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        `}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        data-event="cta_not_affiliated_open"
        onKeyDown={handleKeyDown}
      >
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Secondary Option Label */}
      <div className="absolute -bottom-7 left-0 right-0 text-center">
        <span className="text-xs text-teal/80 font-medium whitespace-nowrap bg-background/80 px-2 py-1 rounded-md border border-teal/20">
          <Users className="h-3 w-3 inline mr-1" />
          Tengo cuenta pero no estoy afiliado
        </span>
      </div>

      {/* Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="menu"
          tabIndex={-1}
          className="absolute top-full mt-2 left-0 z-50 w-80 rounded-md border bg-popover p-4 text-popover-foreground shadow-md"
        >
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm">¿Tu cuenta no está afiliada?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Elige una opción para acceder a Tálamo:
              </p>
            </div>
            
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className={`
                    w-full text-left px-3 py-2 text-sm rounded-md transition-colors
                    hover:bg-accent hover:text-accent-foreground
                    ${focusIndex === index ? "bg-accent text-accent-foreground" : ""}
                    focus-visible:outline-none focus-visible:bg-accent focus-visible:text-accent-foreground
                  `}
                  data-event={item.event}
                  onMouseEnter={() => setFocusIndex(index)}
                >
                  {item.label}
                  {index === 0 && <span className="text-xs text-muted-foreground block mt-1">
                    (ID: 1141465940423171000)
                  </span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};