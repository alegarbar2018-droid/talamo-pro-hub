import { TradingJournal } from "@/components/tools/TradingJournal";
import TradingDisclaimer from "@/components/ui/trading-disclaimer";
import { useTranslation } from "react-i18next";
import { BookMarked } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";

const Journal = () => {
  const { t } = useTranslation(["tools"]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <PageHero
        module="journal"
        title={t("tools:journal.title")}
        subtitle={t("tools:journal.subtitle")}
        badge={{
          icon: BookMarked,
          text: 'Diario de Trading'
        }}
      />

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <TradingJournal />
      </div>

      <TradingDisclaimer />
    </div>
  );
};

export default Journal;
