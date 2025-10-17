import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ObservabilityProvider } from "@/components/business/ObservabilityProvider";
import { OnboardingGuard } from "@/components/OnboardingGuard";
import { Loader2 } from "lucide-react";

// Critical pages - loaded immediately
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Lazy load non-critical pages
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthForgot = lazy(() => import("./pages/AuthForgot"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const OnboardingWelcome = lazy(() => import("./pages/OnboardingWelcome"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Academy = lazy(() => import("./pages/Academy"));
const Signals = lazy(() => import("./pages/Signals"));
const CopyTrading = lazy(() => import("./pages/CopyTrading"));
const Tools = lazy(() => import("./pages/Tools"));
const Journal = lazy(() => import("./pages/Journal"));
const Audit = lazy(() => import("./pages/Audit"));
const AuditDetail = lazy(() => import("./pages/AuditDetail"));
const Settings = lazy(() => import("./pages/Settings"));
const ChangePartnerGuide = lazy(() => import("./pages/ChangePartnerGuide"));
const ExnessRedirect = lazy(() => import("./pages/ExnessRedirect"));
const AccessWizard = lazy(() => import("./pages/AccessWizard"));
const AcademyInfo = lazy(() => import("./pages/AcademyInfo"));
const SignalsInfo = lazy(() => import("./pages/SignalsInfo"));
const CopyInfo = lazy(() => import("./pages/CopyInfo"));
const ToolsInfo = lazy(() => import("./pages/ToolsInfo"));
const CourseView = lazy(() => import("./pages/CourseView"));
const LessonView = lazy(() => import("./pages/LessonView"));
const QuizView = lazy(() => import("./pages/QuizView"));

// Admin pages
const AdminLayout = lazy(() => import("./components/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminUsers = lazy(() => import("./pages/admin/Users").then(m => ({ default: m.AdminUsers })));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics").then(m => ({ default: m.AdminAnalytics })));
const AdminSignals = lazy(() => import("./pages/admin/Signals"));
const AdminAffiliation = lazy(() => import("./pages/admin/Affiliation"));
const AdminLMS = lazy(() => import("./pages/admin/LMS"));
const AdminCopy = lazy(() => import("./pages/admin/Copy"));
const AdminEAs = lazy(() => import("./pages/admin/EAs"));
const AdminTools = lazy(() => import("./pages/admin/Tools"));
const AdminCompetitions = lazy(() => import("./pages/admin/Competitions"));
const AdminCommunity = lazy(() => import("./pages/admin/Community"));
const AdminReferrals = lazy(() => import("./pages/admin/Referrals"));
const AdminIntegrations = lazy(() => import("./pages/admin/Integrations"));
const AdminAudit = lazy(() => import("./pages/admin/Audit"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-teal" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ObservabilityProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/auth/forgot" element={<AuthForgot />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/onboarding-welcome" element={<OnboardingWelcome />} />
            
            {/* Protected routes - require onboarding completion */}
            <Route path="/dashboard" element={<OnboardingGuard><Dashboard /></OnboardingGuard>} />
            <Route path="/academy" element={<OnboardingGuard><Academy /></OnboardingGuard>} />
            <Route path="/academy/course/:slug" element={<OnboardingGuard><CourseView /></OnboardingGuard>} />
            <Route path="/academy/lesson/:lessonId" element={<OnboardingGuard><LessonView /></OnboardingGuard>} />
            <Route path="/academy/quiz/:quizId" element={<OnboardingGuard><QuizView /></OnboardingGuard>} />
            <Route path="/signals" element={<OnboardingGuard><Signals /></OnboardingGuard>} />
            <Route path="/copy-trading" element={<OnboardingGuard><CopyTrading /></OnboardingGuard>} />
            <Route path="/CopyTrading" element={<Navigate to="/copy-trading" replace />} />
            <Route path="/tools" element={<OnboardingGuard><Tools /></OnboardingGuard>} />
            <Route path="/journal" element={<OnboardingGuard><Journal /></OnboardingGuard>} />
            <Route path="/audit" element={<OnboardingGuard><Audit /></OnboardingGuard>} />
            <Route path="/audit/:accountId" element={<OnboardingGuard><AuditDetail /></OnboardingGuard>} />
            <Route path="/settings" element={<OnboardingGuard><Settings /></OnboardingGuard>} />
            <Route path="/access" element={<AccessWizard />} />
            
            {/* Public info pages */}
            <Route path="/academy-info" element={<AcademyInfo />} />
            <Route path="/signals-info" element={<SignalsInfo />} />
            <Route path="/copy-info" element={<CopyInfo />} />
            <Route path="/tools-info" element={<ToolsInfo />} />
            
            {/* Legacy redirects */}
            <Route path="/auth/validate" element={<Navigate to="/onboarding?step=validate" replace />} />
            <Route path="/auth/register" element={<Navigate to="/onboarding" replace />} />
            <Route path="/signup" element={<Navigate to="/onboarding" replace />} />
            <Route path="/access-wizard" element={<Navigate to="/onboarding" replace />} />
            
            <Route path="/auth/exness" element={<ExnessRedirect />} />
            <Route path="/guide/change-partner" element={<ChangePartnerGuide />} />
            <Route path="/admin/*" element={<OnboardingGuard><AdminLayout /></OnboardingGuard>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="affiliation" element={<AdminAffiliation />} />
              <Route path="lms" element={<AdminLMS />} />
              <Route path="academy" element={<Navigate to="/admin/lms" replace />} />
              <Route path="signals" element={<AdminSignals />} />
              <Route path="copy" element={<AdminCopy />} />
              <Route path="eas" element={<AdminEAs />} />
              <Route path="tools" element={<AdminTools />} />
              <Route path="competitions" element={<AdminCompetitions />} />
              <Route path="community" element={<AdminCommunity />} />
              <Route path="referrals" element={<AdminReferrals />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="integrations" element={<AdminIntegrations />} />
              <Route path="audit" element={<AdminAudit />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ObservabilityProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
