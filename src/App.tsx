import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/Users";

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
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/signals" element={<Signals />} />
            <Route path="/copy-trading" element={<CopyTrading />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/access" element={<AccessWizard />} />
            <Route path="/auth/validate" element={<AuthValidate />} />
            <Route path="/auth/exness" element={<ExnessRedirect />} />
            <Route path="/guide/change-partner" element={<ChangePartnerGuide />} />
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
