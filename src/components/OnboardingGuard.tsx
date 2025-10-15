import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Mientras carga la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Si no hay usuario autenticado, redirigir a login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si el usuario NO completó el onboarding, redirigir a onboarding
  const onboardingCompleted = (user.profile as any)?.onboarding_completed;
  if (!onboardingCompleted) {
    return <Navigate to="/onboarding-welcome" replace />;
  }
  
  // Si completó el onboarding, mostrar el contenido protegido
  return <>{children}</>;
};
