import { TradingJournal } from "@/components/tools/TradingJournal";
import TradingDisclaimer from "@/components/ui/trading-disclaimer";
import { useTranslation } from "react-i18next";
import { BookMarked, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Journal = () => {
  const { t } = useTranslation(["tools"]);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative border-b border-indigo-500/10 bg-gradient-to-br from-indigo-950/40 via-background to-blue-950/30 backdrop-blur-xl py-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-30" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 shadow-sm shadow-indigo-500/10">
              <BookMarked className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-400">Diario de Trading</span>
            </div>
            
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                {t("tools:journal.title")}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mt-2 font-light">
                {t("tools:journal.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <TradingJournal />
      </div>

      <TradingDisclaimer />
    </div>
  );
};

export default Journal;
