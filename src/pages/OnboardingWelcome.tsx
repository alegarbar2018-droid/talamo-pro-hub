import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { 
  prepareProfileUpdate, 
  OnboardingProfile, 
  ExperienceAnswers 
} from '@/lib/onboarding-engine';
import { Scene1Bienvenida } from '@/components/onboarding/Scene1Bienvenida';
import { Scene2PerfilCompleto } from '@/components/onboarding/Scene2PerfilCompleto';
import { Scene3PlanPersonalizado } from '@/components/onboarding/Scene3PlanPersonalizado';
import { MentorFloating } from '@/components/onboarding/MentorFloating';

// Variants para animaciones
const pageVariants = {
  enter: { x: '100%', opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 }
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
  duration: 0.5
};

const OnboardingWelcome = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  const [currentScene, setCurrentScene] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  
  // Estado del onboarding
  const [profile, setProfile] = useState<Partial<OnboardingProfile>>({
    first_name: user?.profile?.first_name || '',
    phone: user?.profile?.phone || '',
    language: 'es'
  });
  
  const [experienceAnswers, setExperienceAnswers] = useState<ExperienceAnswers>({
    control_perdidas: 0,
    tamano_posicion: 0,
    planificacion: 0,
    registro: 0,
    tiempo_operando: 0,
    num_operaciones: 0
  });
  
  const [mentorMessage, setMentorMessage] = useState('Tus respuestas nos ayudan a conocer tu punto de partida.');
  
  const handleSceneChange = (scene: 1 | 2 | 3) => {
    setCurrentScene(scene);
    
    // Actualizar mensaje del mentor según la escena
    if (scene === 2) {
      setMentorMessage('No hay respuestas malas, solo formas distintas de avanzar.');
    } else if (scene === 3) {
      setMentorMessage('Mientras contestas, voy armando tu plan personal.');
    }
  };
  
  const handleComplete = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Preparar datos usando el motor de lógica
      const updateData = prepareProfileUpdate(
        profile as OnboardingProfile, 
        experienceAnswers
      );
      
      // Actualizar en Supabase
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Refrescar contexto de autenticación
      await refreshUser();
      
      toast({
        title: '¡Onboarding completado!',
        description: 'Tu perfil ha sido configurado exitosamente',
      });
      
      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Error',
        description: 'No se pudo completar el onboarding',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Barra superior fija */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-lg font-bold">Tálamo</div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div 
                key={step}
                className={`h-2 w-8 rounded-full transition-all duration-300 ${
                  step <= currentScene ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Contenedor de escenas */}
      <div className="pt-20 pb-8">
        <AnimatePresence mode="wait">
          {currentScene === 1 && (
            <motion.div
              key="scene1"
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
            >
              <Scene1Bienvenida 
                profile={profile}
                onUpdate={setProfile}
                onNext={() => handleSceneChange(2)}
              />
            </motion.div>
          )}
          
          {currentScene === 2 && (
            <motion.div
              key="scene2"
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
            >
              <Scene2PerfilCompleto
                profile={profile}
                onUpdate={setProfile}
                experienceAnswers={experienceAnswers}
                onUpdateExperience={setExperienceAnswers}
                onNext={() => handleSceneChange(3)}
                onBack={() => handleSceneChange(1)}
              />
            </motion.div>
          )}
          
          {currentScene === 3 && (
            <motion.div
              key="scene3"
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
            >
              <Scene3PlanPersonalizado
                profile={profile}
                experienceAnswers={experienceAnswers}
                onComplete={handleComplete}
                onBack={() => handleSceneChange(2)}
                loading={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Mentor flotante */}
      <MentorFloating message={mentorMessage} show={currentScene !== 3} />
    </div>
  );
};

export default OnboardingWelcome;
