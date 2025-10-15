import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, Users, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CopyTradingIntro = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="border-line bg-surface/50 backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-foreground">¿Qué es Copy Trading?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Copiar es <strong>asignar capital a la gestión de un trader profesional</strong>. 
              El trader opera en Exness usando su estrategia verificada, y tú recibes señales 
              para replicar sus operaciones manualmente en tu propia cuenta.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mt-2">
              <strong>Empieza definiendo tu perfil de riesgo y tu monto total</strong>; luego 
              diversifica entre varias estrategias para reducir exposición puntual. Esto no es 
              "hacer dinero fácil" — es educación + disciplina.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/30">
          <Shield className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">Importante:</strong> Define tu monto total y 
            tu perfil de riesgo <em>antes</em> de elegir estrategias. Diversifica por símbolos 
            y estilos para reducir correlación.
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/academy')}
            className="gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Aprende los básicos de riesgo
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Ver todas las estrategias
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
