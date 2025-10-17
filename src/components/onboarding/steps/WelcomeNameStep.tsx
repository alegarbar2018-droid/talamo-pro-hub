import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface WelcomeNameStepProps {
  name: string;
  onNameChange: (name: string) => void;
  onContinue: () => void;
}

export const WelcomeNameStep: React.FC<WelcomeNameStepProps> = ({
  name,
  onNameChange,
  onContinue
}) => {
  return (
    <div className="space-y-8 text-center max-w-2xl mx-auto">
      <div className="space-y-4">
        <Sparkles className="h-16 w-16 mx-auto text-primary" />
        <h1 className="text-4xl font-bold">¡Bienvenido a Tálamo!</h1>
        <p className="text-xl text-muted-foreground">
          Vamos a personalizar tu experiencia en solo 4 pasos
        </p>
      </div>
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="¿Cómo te llamas?"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full max-w-md mx-auto block px-6 py-4 text-lg rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
        />
        
        <Button
          onClick={onContinue}
          disabled={!name.trim()}
          size="lg"
          className="text-lg px-8"
        >
          Comenzar
        </Button>
      </div>
    </div>
  );
};
