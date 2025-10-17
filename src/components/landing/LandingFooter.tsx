import { useNavigate } from "react-router-dom";

export const LandingFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-line bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-foreground text-xl">Tálamo</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Trading profesional, sin promesas vacías
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Plataforma</h4>
            <div className="space-y-2 text-sm">
              <button 
                onClick={() => navigate("/academy")}
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Academia
              </button>
              <button 
                onClick={() => navigate("/signals")}
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Señales
              </button>
              <button 
                onClick={() => navigate("/copy-trading")}
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Copy Trading
              </button>
              <button 
                onClick={() => navigate("/tools")}
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Herramientas
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Cuenta</h4>
            <div className="space-y-2 text-sm">
              <button 
                onClick={() => navigate("/login")}
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => navigate("/onboarding")}
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Solicitar Acceso
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <div className="space-y-2 text-sm">
              <button className="block text-muted-foreground hover:text-foreground transition-colors">
                Términos de Servicio
              </button>
              <button className="block text-muted-foreground hover:text-foreground transition-colors">
                Política de Privacidad
              </button>
              <button className="block text-muted-foreground hover:text-foreground transition-colors">
                Aviso de Riesgos
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-line mt-8 pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            <strong>Aviso de riesgo:</strong> El trading de CFDs conlleva un alto nivel de riesgo y puede resultar en la pérdida de todo su capital. 
            No debe arriesgar más de lo que puede permitirse perder. Antes de decidir operar, debe considerar cuidadosamente sus objetivos de inversión, 
            nivel de experiencia y tolerancia al riesgo.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            © 2024 Tálamo Trading. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
