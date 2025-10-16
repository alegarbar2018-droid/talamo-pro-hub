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
  
  // Only show spinner on initial load, not when user data is being revalidated
  // If we have cached profile data or the profile has loaded, don't block
  const hasProfileData = user?.profile !== undefined;
  const shouldShowSpinner = loading && !user;
  
  if (shouldShowSpinner) {
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
  // Solo redirigir si tenemos el perfil cargado y NO está completado
  const onboardingCompleted = user.profile?.onboarding_completed;
  if (onboardingCompleted === false) {
    return <Navigate to="/onboarding-welcome" replace />;
  }
  
  // Si completó el onboarding o no hay información de onboarding, mostrar el contenido
  return <>{children}</>;
};
