import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import AuthCallbackPage from "./pages/AuthCallback";
import ResetPasswordPage from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Academy from "./pages/Academy";
import Signals from "./pages/Signals";
import CopyTrading from "./pages/CopyTrading";
import Tools from "./pages/Tools";
import AuthValidate from "./pages/AuthValidate";
import ChangePartnerGuide from "./pages/ChangePartnerGuide";
import ExnessRedirect from "./pages/ExnessRedirect";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/signals" element={<Signals />} />
            <Route path="/copy-trading" element={<CopyTrading />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/auth/validate" element={<AuthValidate />} />
            <Route path="/auth/exness" element={<ExnessRedirect />} />
            <Route path="/guide/change-partner" element={<ChangePartnerGuide />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
