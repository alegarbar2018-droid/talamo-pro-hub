import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Phone } from 'lucide-react';
import { OnboardingProfile } from '@/lib/onboarding-engine';

interface Scene1BienvenidaProps {
  profile: Partial<OnboardingProfile>;
  onUpdate: (profile: Partial<OnboardingProfile>) => void;
  onNext: () => void;
}

export const Scene1Bienvenida: React.FC<Scene1BienvenidaProps> = ({
  profile,
  onUpdate,
  onNext
}) => {
  const [acceptedWhatsApp, setAcceptedWhatsApp] = useState(false);
  
  const isValid = 
    profile.first_name && 
    profile.first_name.trim().length > 0 &&
    profile.phone && 
    profile.phone.trim().length >= 10 &&
    acceptedWhatsApp;
  
  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };
  
  return (
    <div className="min-h-[calc(100dvh-80px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Avatar del mentor */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        {/* Título */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Empecemos con lo básico</h1>
          <p className="text-muted-foreground">
            Hola, soy tu guía Tálamo. Te acompañaré para que encuentres la forma más clara de invertir u operar según tu experiencia.
          </p>
        </div>
        
        {/* Formulario */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="first_name">Nombre</Label>
            <Input
              id="first_name"
              type="text"
              placeholder="Tu nombre"
              value={profile.first_name || ''}
              onChange={(e) => onUpdate({ ...profile, first_name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+52 123 456 7890"
                className="pl-10"
                value={profile.phone || ''}
                onChange={(e) => onUpdate({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="whatsapp-consent"
              checked={acceptedWhatsApp}
              onCheckedChange={(checked) => setAcceptedWhatsApp(checked as boolean)}
            />
            <label
              htmlFor="whatsapp-consent"
              className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Acepto recibir orientación por WhatsApp
            </label>
          </div>
          
          <Button 
            onClick={handleNext}
            disabled={!isValid}
            className="w-full"
            size="lg"
          >
            Comenzar
          </Button>
        </div>
      </div>
    </div>
  );
};
