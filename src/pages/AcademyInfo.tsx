import { useEffect } from "react";
import { useObservability } from "@/components/business/ObservabilityProvider";
import Navigation from "@/components/Navigation";
import AcademyHero from "@/components/academy/AcademyHero";
import AcademyValueProposition from "@/components/academy/AcademyValueProposition";
import AcademyJourneySimple from "@/components/academy/AcademyJourneySimple";

export default function AcademyInfo() {
  const { trackPageView } = useObservability();
  
  useEffect(() => {
    document.title = "Academia — Información";
    trackPageView("academy-info");
  }, [trackPageView]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navigation />
      
      {/* Premium background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-primary opacity-8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <main className="relative">
        {/* Hero renovado */}
        <AcademyHero />

        {/* Value Proposition */}
        <AcademyValueProposition />

        {/* Journey Path */}
        <AcademyJourneySimple />
      </main>
    </div>
  );
}
