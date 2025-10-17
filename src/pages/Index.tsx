import { Suspense, lazy, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import { HeroSection } from "@/components/landing/HeroSection";
import { UserPathCards } from "@/components/landing/UserPathCards";
import { BeginnerSection } from "@/components/landing/BeginnerSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PartnerModal } from "@/components/landing/PartnerModal";

// Lazy load heavy components
const ValueProposition = lazy(() => import("@/components/ValueProposition"));
const HowItWorks = lazy(() => import("@/components/HowItWorks"));
const ModulesWithDetails = lazy(() => import("@/components/ModulesWithDetails"));
const WhyExness = lazy(() => import("@/components/WhyExness"));
const FAQExpanded = lazy(() => import("@/components/FAQExpanded"));

const Index = () => {
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const { i18n } = useTranslation();

  // Set document language when i18n language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language || "es";
  }, [i18n.language]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navigation />

      <HeroSection />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <UserPathCards />
      </div>

      {/* Lazy load non-critical sections */}
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-teal border-t-transparent rounded-full" /></div>}>
        <ValueProposition />
        
        <BeginnerSection />

        <HowItWorks />

        <ModulesWithDetails />

        <WhyExness />

        <FAQExpanded />
      </Suspense>

      <LandingFooter />

      <PartnerModal 
        isOpen={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
      />
    </div>
  );
};

export default Index;