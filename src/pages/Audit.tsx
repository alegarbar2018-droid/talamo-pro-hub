import { AuditDashboard } from "@/components/tools/audit";
import TradingDisclaimer from "@/components/ui/trading-disclaimer";
import { useTranslation } from "react-i18next";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Audit = () => {
  const { t } = useTranslation(["tools"]);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-slate-500/10 bg-gradient-to-br from-slate-950/50 via-background to-gray-950/40 backdrop-blur-xl py-16">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-500/20 rounded-full blur-3xl opacity-30" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="mb-6 text-muted-foreground hover:text-foreground hover:bg-slate-500/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>

          <div className="space-y-6 max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-500/10 backdrop-blur-md border border-slate-500/20 shadow-sm shadow-slate-500/10">
              <Shield className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-400">Auditoría Verificada</span>
            </div>
            
            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-slate-300 via-gray-300 to-slate-400 bg-clip-text text-transparent leading-tight tracking-tight drop-shadow-[0_0_30px_rgba(148,163,184,0.2)]">
                {t("tools:audit.title")}
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-light max-w-3xl">
                {t("tools:audit.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <AuditDashboard />
      </div>

      <TradingDisclaimer />
    </div>
  );
};

export default Audit;
