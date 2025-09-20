import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          <Route path="/auth/validate" element={<AuthValidate />} />
          <Route path="/auth/exness" element={<ExnessRedirect />} />
          <Route path="/guide/change-partner" element={<ChangePartnerGuide />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
