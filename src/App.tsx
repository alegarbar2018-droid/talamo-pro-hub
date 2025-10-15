import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ObservabilityProvider } from "@/components/business/ObservabilityProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AuthForgot from "./pages/AuthForgot";
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Academy from "./pages/Academy";
import Signals from "./pages/Signals";
import CopyTrading from "./pages/CopyTrading";
import Tools from "./pages/Tools";
import AuthValidate from "./pages/AuthValidate";
import ChangePartnerGuide from "./pages/ChangePartnerGuide";
import ExnessRedirect from "./pages/ExnessRedirect";
import AccessWizard from "./pages/AccessWizard";
import AcademyInfo from "./pages/AcademyInfo";
import SignalsInfo from "./pages/SignalsInfo";
import CopyInfo from "./pages/CopyInfo";
import ToolsInfo from "./pages/ToolsInfo";
import CourseView from "./pages/CourseView";
import LessonView from "./pages/LessonView";
import QuizView from "./pages/QuizView";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/Users";
import { AdminAnalytics } from "./pages/admin/Analytics";
import AdminSignals from "./pages/admin/Signals";
import AdminAffiliation from "./pages/admin/Affiliation";
import AdminLMS from "./pages/admin/LMS";
import AdminCopy from "./pages/admin/Copy";
import AdminEAs from "./pages/admin/EAs";
import AdminTools from "./pages/admin/Tools";
import AdminCompetitions from "./pages/admin/Competitions";
import AdminCommunity from "./pages/admin/Community";
import AdminReferrals from "./pages/admin/Referrals";
import AdminIntegrations from "./pages/admin/Integrations";
import AdminAudit from "./pages/admin/Audit";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
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
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/auth/forgot" element={<AuthForgot />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/academy/course/:slug" element={<CourseView />} />
            <Route path="/academy/lesson/:lessonId" element={<LessonView />} />
            <Route path="/academy/quiz/:quizId" element={<QuizView />} />
            <Route path="/signals" element={<Signals />} />
            <Route path="/copy-trading" element={<CopyTrading />} />
            <Route path="/CopyTrading" element={<Navigate to="/copy-trading" replace />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/access" element={<AccessWizard />} />
            
            {/* Public info pages */}
            <Route path="/academy-info" element={<AcademyInfo />} />
            <Route path="/signals-info" element={<SignalsInfo />} />
            <Route path="/copy-info" element={<CopyInfo />} />
            <Route path="/tools-info" element={<ToolsInfo />} />
            
            {/* Legacy redirects */}
            <Route path="/auth/validate" element={<Navigate to="/onboarding?step=validate" replace />} />
            <Route path="/auth/register" element={<Navigate to="/onboarding?step=choose" replace />} />
            <Route path="/signup" element={<Navigate to="/onboarding?step=choose" replace />} />
            <Route path="/access-wizard" element={<Navigate to="/onboarding?step=choose" replace />} />
            
            <Route path="/auth/exness" element={<ExnessRedirect />} />
            <Route path="/guide/change-partner" element={<ChangePartnerGuide />} />
            <Route path="/admin/*" element={<AdminLayout />}>
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
          </ObservabilityProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
