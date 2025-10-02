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
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/Users";
import { AdminAnalytics } from "./pages/admin/Analytics";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
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
            <Route path="/signals" element={<Signals />} />
            <Route path="/copy-trading" element={<CopyTrading />} />
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
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="signals" element={<AdminSignals />} />
            </Route>
            <Route path="*" element={<NotFound />} />
            </Routes>
          </ObservabilityProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
