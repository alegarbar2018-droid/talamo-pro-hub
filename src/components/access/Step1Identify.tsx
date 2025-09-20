import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, User, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Declare gtag function for analytics (Google Analytics)
declare global {
  function gtag(...args: any[]): void;
}

interface Step1IdentifyProps {
  data: {
    name: string;
    email: string;
  };
  onUpdate: (data: { name: string; email: string }) => void;
  onNext: () => void;
}

const Step1Identify = ({ data, onUpdate, onNext }: Step1IdentifyProps) => {
  const [formData, setFormData] = useState({
    name: data.name || "",
    email: data.email || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData({
      name: data.name || "",
      email: data.email || "",
    });
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Campos obligatorios",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor ingresa un email válido",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Register the lead
      const response = await fetch(`https://xogbavprnnbfamcjrsel.supabase.co/functions/v1/access-start`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZ2JhdnBybm5iZmFtY2pyc2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNDM3ODQsImV4cCI6MjA3MzkxOTc4NH0.6l1XCkopeKxOPzj9vfYcslB-H-Q-w7F8tPLhGYu-rYw`
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
        }),
      });
      
      // Continue even if lead registration fails (non-blocking)
    } catch (error) {
      console.log("Lead registration failed (non-blocking)", error);
    }

    // Update wizard data and continue
    onUpdate({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
    });
    
    // Track analytics event
    if (typeof gtag !== "undefined") {
      gtag("event", "access.identification.submitted", {
        email: formData.email.trim().toLowerCase(),
      });
    }

    setIsLoading(false);
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Inicia tu proceso</h2>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Tálamo es un ecosistema para traders serios. Completa tus datos para continuar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium">
              Nombre completo
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                id="name"
                type="text"
                placeholder="Ingresa tu nombre completo"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="pl-10 h-12 text-base"
                required
                aria-describedby="name-description"
              />
            </div>
            <p id="name-description" className="text-sm text-muted-foreground">
              Como aparecerá en tu perfil de Tálamo
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10 h-12 text-base"
                required
                aria-describedby="email-description"
              />
            </div>
            <p id="email-description" className="text-sm text-muted-foreground">
              Debe coincidir con tu email de Exness para la validación
            </p>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-gradient-primary hover:shadow-glow h-12 text-base"
          disabled={isLoading}
          data-event="access.identification.continue"
        >
          {isLoading ? "Procesando..." : "Continuar"}
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Al continuar, aceptas nuestros{" "}
          <button className="text-primary hover:underline">términos de uso</button> y{" "}
          <button className="text-primary hover:underline">política de privacidad</button>.
        </p>
      </div>
    </div>
  );
};

export default Step1Identify;