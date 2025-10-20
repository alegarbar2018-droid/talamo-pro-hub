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
      <div className="border-b border-line/50 bg-gradient-to-br from-teal/5 via-surface to-cyan/5 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal/20 via-teal/10 to-transparent border border-teal/30">
              <BookMarked className="h-4 w-4 text-teal" />
              <span className="text-sm font-medium text-teal">Diario de Trading</span>
            </div>
            
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal to-cyan bg-clip-text text-transparent">
                {t("tools:journal.title")}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mt-2">
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
