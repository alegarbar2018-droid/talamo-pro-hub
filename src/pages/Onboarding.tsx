import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Users, GraduationCap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAffiliationValidation } from "@/hooks/useAffiliationValidation";
import { NotAffiliatedOptions } from "@/components/onboarding/NotAffiliatedOptions";
import ChangePartnerModal from "@/components/access/ChangePartnerModal";
import { CheckCircle, AlertTriangle, Shield } from "lucide-react";

const OnboardingNew = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const flowOrigin = searchParams.get('flow');
  
  const {
    step,
    setStep,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    name,
    setName,
    goal,
    setGoal,
    capital,
    setCapital,
    experience,
    setExperience,
    uid,
    setUid,
    isDemoMode,
    setIsDemoMode,
    isNotAffiliated,
    setIsNotAffiliated,
    showPartnerModal,
    setShowPartnerModal,
    getStepNumber,
  } = useOnboardingState();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wizardState, setWizardState] = useState<any>(null);
  const { loading: validating, error: validationError, cooldownSeconds, validateAffiliation } = useAffiliationValidation();
  const [showNewAccountCreated, setShowNewAccountCreated] = useState(false);

  useEffect(() => {
    if (flowOrigin === 'investor') {
      const saved = sessionStorage.getItem('investor_wizard_state');
      if (saved) {
        try {
          setWizardState(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing wizard state:', e);
        }
      }
    }
  }, [flowOrigin]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // Step 1: Validate email
  const handleValidateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await validateAffiliation(
      email,
      (clientUid) => {
        setUid(clientUid || "");
        setIsNotAffiliated(false);
        setIsDemoMode(false);
        setStep("create-password");
      },
      () => {
        setIsNotAffiliated(true);
        setTimeout(() => {
          const blockB = document.getElementById('block-b-not-affiliated');
          blockB?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      },
      () => {
        setIsDemoMode(true);
        setIsNotAffiliated(false);
        setStep("create-password");
        toast({
          title: "Modo Demo Activado",
          description: "Acceso temporal para explorar Tálamo",
        });
      }
    );
  };

  const handleCreateAccount = () => {
    setShowNewAccountCreated(true);
  };

  const handleRetryValidation = () => {
    setShowNewAccountCreated(false);
    setIsNotAffiliated(false);
    setShowPartnerModal(false);
  };

  // Step 2: Create password
  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }

      if (password.length < 8 || !/(?=.*[A-Z])(?=.*\d)/.test(password)) {
        setError("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número");
        return;
      }

      if (isDemoMode) {
        setStep("welcome");
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: { uid }
        }
      });

      if (error) throw error;
      setStep("welcome");
      
    } catch (err: any) {
      setError(err.message || "Error al crear cuenta");
    } finally {
      setLoading(false);
    }
  };

  // Step 7: Complete onboarding
  const handleComplete = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let recommendedAccount = 'Standard Cent';
      
      if (experience === 'ninguna' || experience === 'basica') {
        recommendedAccount = 'Standard Cent';
      } else if (experience === 'intermedia') {
        recommendedAccount = capital === '>10000' ? 'Pro' : 'Standard';
      } else if (experience === 'avanzada') {
        recommendedAccount = capital === '>10000' ? 'Zero' : 'Pro';
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: name,
          goal,
          capital_band: capital,
          level: experience,
          recommended_account: recommendedAccount,
          recommended_route: goal,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      await refreshUser();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: '¡Bienvenido a Tálamo!',
        description: 'Tu perfil está listo',
      });
      
      if (flowOrigin === 'investor' || goal === 'copiar') {
        navigate('/copy-trading');
      } else if (goal === 'aprender') {
        navigate('/academy');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Error',
        description: 'No se pudo completar el proceso',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getAccountRecommendation = () => {
    if (experience === 'ninguna' || experience === 'basica') {
      return {
        account: 'Standard Cent',
        reason: 'Perfecta para principiantes. Opera con micro-lotes ($1 = 100 centavos) y practica sin riesgo alto.'
      };
    } else if (experience === 'intermedia') {
      return {
        account: capital === '>10000' ? 'Pro' : 'Standard',
        reason: capital === '>10000' 
          ? 'Cuenta Pro: spreads desde 0.1 pips, ideal para tu capital y experiencia.'
          : 'Cuenta Standard: spreads competitivos y condiciones balanceadas para traders intermedios.'
      };
    } else {
      return {
        account: capital === '>10000' ? 'Zero' : 'Pro',
        reason: capital === '>10000'
          ? 'Cuenta Zero: spreads de 0.0 pips en pares principales, perfecta para scalping y alta frecuencia.'
          : 'Cuenta Pro: condiciones profesionales con spreads reducidos.'
      };
    }
  };

  const renderStep = () => {
    switch (step) {
      case "validate":
        return (
          <motion.div
            key="validate"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8 max-w-2xl mx-auto"
          >
            <div className="text-center space-y-4">
              <Sparkles className="h-16 w-16 mx-auto text-primary" />
              <h1 className="text-4xl font-bold">Comencemos tu registro</h1>
              <p className="text-xl text-muted-foreground">
                Para acceder a Tálamo, necesitas una cuenta en Exness. Es la plataforma donde operarás.
              </p>
            </div>

            <form onSubmit={handleValidateEmail} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Email de tu cuenta Exness
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  Si aún no tienes cuenta, te mostraremos cómo crear una en el siguiente paso
                </p>
              </div>
              
              {validationError && !isNotAffiliated && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}
              
              <Button
                type="submit"
                disabled={!email || validating || cooldownSeconds > 0}
                className="w-full h-14 text-lg"
                size="lg"
              >
                {validating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verificando...</span>
                  </div>
                ) : cooldownSeconds > 0 ? (
                  `Espera ${cooldownSeconds}s`
                ) : (
                  "Continuar"
                )}
              </Button>
            </form>

            {isNotAffiliated && (
              <div className="mt-6">
                <NotAffiliatedOptions
                  onCreateAccount={handleCreateAccount}
                  onRequestPartnerChange={() => setShowPartnerModal(true)}
                  onRetryValidation={handleRetryValidation}
                />
              </div>
            )}

            {showNewAccountCreated && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  ¡Perfecto! Cuando termines de crear tu cuenta, vuelve aquí.
                  <Button
                    onClick={handleRetryValidation}
                    variant="outline"
                    className="w-full mt-3"
                  >
                    Ya la creé, continuar
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="mt-8 p-6 bg-card/50 rounded-xl border border-border">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-semibold">¿Por qué Exness?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Exness es una plataforma regulada donde manejas tu dinero de forma segura. Tálamo es un servicio complementario 
                    que te proporciona herramientas, educación y señales para operar mejor. Nunca accedemos a tus fondos.
                  </p>
                </div>
              </div>
            </div>

            <ChangePartnerModal 
              isOpen={showPartnerModal} 
              onClose={() => setShowPartnerModal(false)}
              onRetryValidation={handleRetryValidation}
            />
          </motion.div>
        );

      case "create-password":
        return (
          <motion.div
            key="create-password"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8 max-w-2xl mx-auto"
          >
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 mx-auto text-primary" />
              <h1 className="text-4xl font-bold">Crear tu acceso a Tálamo</h1>
              <p className="text-xl text-muted-foreground">
                Esta contraseña es para tu cuenta de Tálamo, independiente de Exness
              </p>
            </div>

            {isDemoMode && (
              <Alert className="bg-warning/10 border-warning/20">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-warning">
                  Modo demo — acceso temporal para explorar la plataforma
                </AlertDescription>
              </Alert>
            )}

            <div className="p-6 bg-card/50 rounded-xl border border-border">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-semibold">Seguridad y privacidad</h3>
                  <p className="text-sm text-muted-foreground">
                    Tu panel de Tálamo es independiente de tu cuenta de trading. Solo validamos tu afiliación 
                    para darte acceso gratuito a las herramientas.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreatePassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">Crear contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-12 text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-12 text-lg"
                />
              </div>

              <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
                La contraseña debe tener al menos 8 caracteres, incluir una mayúscula y un número.
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button
                type="submit"
                disabled={
                  password.length < 8 || 
                  password !== confirmPassword || 
                  !/(?=.*[A-Z])(?=.*\d)/.test(password) || 
                  loading
                }
                className="w-full h-14 text-lg"
                size="lg"
              >
                {loading ? "Creando cuenta..." : "Continuar"}
              </Button>
            </form>
          </motion.div>
        );

      case "welcome":
        return (
          <motion.div
            key="welcome"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8 text-center max-w-2xl mx-auto"
          >
            <div className="space-y-4">
              <Sparkles className="h-16 w-16 mx-auto text-primary" />
              <h1 className="text-4xl font-bold">¡Bienvenido a Tálamo!</h1>
              <p className="text-xl text-muted-foreground">
                Vamos a personalizar tu experiencia en solo 3 pasos
              </p>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="¿Cómo te llamas?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full max-w-md mx-auto block px-6 py-4 text-lg rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
              />
              
              <Button
                onClick={() => setStep("goal")}
                disabled={!name.trim()}
                size="lg"
                className="text-lg px-8"
              >
                Comenzar
              </Button>
            </div>
          </motion.div>
        );

      case "goal":
        return (
          <motion.div
            key="goal"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8 max-w-4xl mx-auto"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Hola {name}, ¿qué te gustaría hacer?</h2>
              <p className="text-muted-foreground">
                Selecciona la opción que más te interese
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setGoal('copiar');
                  setStep('capital');
                }}
                className="group p-8 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <Users className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Copiar traders exitosos</h3>
                <p className="text-muted-foreground">Invierte automáticamente siguiendo estrategias verificadas</p>
              </button>

              <button
                onClick={() => {
                  setGoal('aprender');
                  setStep('capital');
                }}
                className="group p-8 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <GraduationCap className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Aprender trading</h3>
                <p className="text-muted-foreground">Domina el trading desde cero con nuestra academia</p>
              </button>

              <button
                onClick={() => {
                  setGoal('operar');
                  setStep('capital');
                }}
                className="group p-8 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <TrendingUp className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Operar por mi cuenta</h3>
                <p className="text-muted-foreground">Usa herramientas profesionales y señales de trading</p>
              </button>

              <button
                onClick={() => {
                  setGoal('mixto');
                  setStep('capital');
                }}
                className="group p-8 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <Sparkles className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Todo lo anterior</h3>
                <p className="text-muted-foreground">Acceso completo a todas las funcionalidades</p>
              </button>
            </div>
          </motion.div>
        );

      case "capital":
        return (
          <motion.div
            key="capital"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8 max-w-3xl mx-auto"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">¿Con cuánto capital iniciarías?</h2>
              <p className="text-muted-foreground">Esto nos ayuda a recomendarte la cuenta ideal</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setCapital('<500');
                  setStep('experience');
                }}
                className="p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="text-2xl font-bold mb-2">Menos de $500</div>
                <p className="text-sm text-muted-foreground">Ideal para empezar con micro-lotes</p>
              </button>

              <button
                onClick={() => {
                  setCapital('500-2000');
                  setStep('experience');
                }}
                className="p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="text-2xl font-bold mb-2">$500 - $2,000</div>
                <p className="text-sm text-muted-foreground">Buen balance para operar</p>
              </button>

              <button
                onClick={() => {
                  setCapital('2000-10000');
                  setStep('experience');
                }}
                className="p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="text-2xl font-bold mb-2">$2,000 - $10,000</div>
                <p className="text-sm text-muted-foreground">Capital intermedio sólido</p>
              </button>

              <button
                onClick={() => {
                  setCapital('>10000');
                  setStep('experience');
                }}
                className="p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="text-2xl font-bold mb-2">Más de $10,000</div>
                <p className="text-sm text-muted-foreground">Acceso a cuentas premium</p>
              </button>
            </div>

            <Button
              variant="ghost"
              onClick={() => setStep('goal')}
              className="mx-auto block"
            >
              ← Atrás
            </Button>
          </motion.div>
        );

      case "experience":
        return (
          <motion.div
            key="experience"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8 max-w-3xl mx-auto"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">¿Cuál es tu nivel de experiencia?</h2>
              <p className="text-muted-foreground">Último paso para personalizar tu ruta</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  setExperience('ninguna');
                  setStep('recommendation');
                }}
                className="w-full p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="font-semibold text-lg mb-1">Nunca he operado</div>
                <p className="text-sm text-muted-foreground">Quiero aprender desde cero</p>
              </button>

              <button
                onClick={() => {
                  setExperience('basica');
                  setStep('recommendation');
                }}
                className="w-full p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="font-semibold text-lg mb-1">Experiencia básica</div>
                <p className="text-sm text-muted-foreground">He probado en demo o hecho pocas operaciones reales</p>
              </button>

              <button
                onClick={() => {
                  setExperience('intermedia');
                  setStep('recommendation');
                }}
                className="w-full p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="font-semibold text-lg mb-1">Experiencia intermedia</div>
                <p className="text-sm text-muted-foreground">Opero regularmente, tengo mi estrategia</p>
              </button>

              <button
                onClick={() => {
                  setExperience('avanzada');
                  setStep('recommendation');
                }}
                className="w-full p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="font-semibold text-lg mb-1">Experiencia avanzada</div>
                <p className="text-sm text-muted-foreground">Trader consistente con historial verificable</p>
              </button>
            </div>

            <Button
              variant="ghost"
              onClick={() => setStep('capital')}
              className="mx-auto block"
            >
              ← Atrás
            </Button>
          </motion.div>
        );

      case "recommendation":
        const recommendation = getAccountRecommendation();
        
        return (
          <motion.div
            key="recommendation"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8 max-w-2xl mx-auto text-center"
          >
            <Sparkles className="h-16 w-16 mx-auto text-primary" />
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">¡Tu plan está listo!</h2>
              
              <div className="relative p-8 rounded-2xl bg-card border border-border shadow-lg">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-medium text-primary">Recomendación personalizada</span>
                    </div>
                    <h3 className="text-2xl font-bold text-primary">
                      {recommendation.account}
                    </h3>
                  </div>
                  
                  <p className="text-base leading-relaxed text-foreground/80">
                    {recommendation.reason}
                  </p>
                  
                  <div className="pt-6 border-t border-border/50 space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      Tu siguiente paso
                    </div>
                    <div className="text-lg font-semibold">
                      {goal === 'copiar' ? 'Explorar estrategias de copy trading' :
                       goal === 'aprender' ? 'Comenzar con la academia' :
                       goal === 'operar' ? 'Acceder a herramientas profesionales' :
                       'Explorar todas las funcionalidades'}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleComplete}
                disabled={loading}
                size="lg"
                className="text-lg px-8"
              >
                {loading ? 'Configurando tu cuenta...' : 'Comenzar mi camino'}
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-background">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-border z-50">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((getStepNumber() / 7) * 100)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <main className="flex-1 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </main>

      {/* Background gradient effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50" />
      </div>
    </div>
  );
};

export default OnboardingNew;
