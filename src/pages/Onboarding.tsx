import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { useOnboardingPersistence } from "@/hooks/useOnboardingPersistence";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { IntroStep } from "@/components/onboarding/steps/IntroStep";
import { EmailCaptureStep } from "@/components/onboarding/steps/EmailCaptureStep";
import { UserExistsStep } from "@/components/onboarding/steps/UserExistsStep";
import { NoExnessAccountStep } from "@/components/onboarding/steps/NoExnessAccountStep";
import { ExnessDetectionStep } from "@/components/onboarding/steps/ExnessDetectionStep";
import { HasExnessFlowStep } from "@/components/onboarding/steps/HasExnessFlowStep";
import { NoExnessFlowStep } from "@/components/onboarding/steps/NoExnessFlowStep";
import { CapitalStep } from "@/components/onboarding/steps/CapitalStep";
import { ExperienceStep } from "@/components/onboarding/steps/ExperienceStep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Users, GraduationCap, TrendingUp, CheckCircle, AlertTriangle, Shield, Loader2, ArrowLeft } from "lucide-react";

const Onboarding = () => {
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
    accountStatus,
    setAccountStatus,
    getStepNumber,
    progress,
    goBack,
    canGoBack,
  } = useOnboardingState();
  
  const { saveState, loadState, clearState } = useOnboardingPersistence();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [wizardState, setWizardState] = useState<any>(null);

  // Load saved state on mount
  useEffect(() => {
    const saved = loadState();
    if (saved && saved.step && saved.step !== "intro") {
      if (saved.email) setEmail(saved.email);
      if (saved.name) setName(saved.name);
      if (saved.goal) setGoal(saved.goal);
      if (saved.capital) setCapital(saved.capital);
      if (saved.experience) setExperience(saved.experience);
      if (saved.step) setStep(saved.step);
      if (saved.accountStatus) setAccountStatus(saved.accountStatus);
      
      toast({
        title: "Progreso restaurado",
        description: "Continuamos donde lo dejaste"
      });
    }
  }, []);

  // Load investor wizard state
  useEffect(() => {
    if (flowOrigin === 'investor') {
      const saved = sessionStorage.getItem('investor_wizard_state');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setWizardState(parsed);
          if (parsed.goal) {
            setGoal('copiar');
          }
        } catch (e) {
          console.error('Error parsing wizard state:', e);
        }
      }
    }
  }, [flowOrigin]);

  // Save state on changes
  useEffect(() => {
    saveState({ step, email, name, goal, capital, experience, accountStatus });
  }, [step, email, name, goal, capital, experience, accountStatus, saveState]);

  // Validation logic
  const handleEmailValidation = async (emailToValidate: string) => {
    setLoading(true);
    setValidationError("");
    
    try {
      const { data, error: apiError } = await supabase.functions.invoke(
        'secure-affiliation-check',
        { body: { email: emailToValidate } }
      );

      if (apiError?.status === 429 || data?.rate_limited) {
        const retryAfter = data?.retry_after || 300;
        setValidationError(`Demasiadas solicitudes. Espera ${retryAfter}s.`);
        setLoading(false);
        return;
      }

      if (apiError?.status === 503 || data?.code === 'UpstreamError') {
        setValidationError("Servicio temporalmente no disponible. Intenta en unos minutos.");
        setLoading(false);
        return;
      }

      if (data?.code === 'BadRequest') {
        setValidationError("Email inválido. Verifica el formato.");
        setLoading(false);
        return;
      }

      // Success - route based on response
      if (data?.ok && data?.data) {
        const { user_exists, is_affiliated, has_exness_account, uid: responseUid, demo_mode } = data.data;

        if (user_exists) {
          setAccountStatus('exists');
          setStep('user-exists');
        } else if (demo_mode) {
          setIsDemoMode(true);
          setAccountStatus('affiliated');
          setStep('create-password');
          toast({
            title: "Modo Demo Activado",
            description: "Acceso temporal para explorar Tálamo"
          });
        } else if (is_affiliated) {
          setUid(responseUid || '');
          setAccountStatus('affiliated');
          setStep('create-password');
        } else if (has_exness_account === false) {
          setAccountStatus('no-exness');
          setStep('no-exness-account');
        } else {
          // Has Exness but not affiliated
          setAccountStatus('not-affiliated');
          setStep('exness-detection');
        }
      } else {
        // Fallback
        setAccountStatus('not-affiliated');
        setStep('exness-detection');
      }
    } catch (err: any) {
      console.error('Validation error:', err);
      setValidationError("Error inesperado. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Create password
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

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: { uid }
        }
      });

      if (signUpError) throw signUpError;
      setStep("welcome");
      
    } catch (err: any) {
      setError(err.message || "Error al crear cuenta");
    } finally {
      setLoading(false);
    }
  };

  // Complete onboarding
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

      const { error: updateError } = await supabase
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
      
      if (updateError) throw updateError;
      
      await refreshUser();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      clearState();
      
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
        reason: 'Perfecta para principiantes. Opera con micro-lotes ($1 = 100 centavos) y practica sin riesgo alto.',
        nextStep: goal === 'aprender' ? 'Comenzar con la academia' : 'Explorar herramientas básicas'
      };
    } else if (experience === 'intermedia') {
      return {
        account: capital === '>10000' ? 'Pro' : 'Standard',
        reason: capital === '>10000' 
          ? 'Cuenta Pro: spreads desde 0.1 pips, ideal para tu capital y experiencia.'
          : 'Cuenta Standard: spreads competitivos y condiciones balanceadas para traders intermedios.',
        nextStep: goal === 'copiar' ? 'Explorar estrategias de copy trading' : 'Acceder a herramientas avanzadas'
      };
    } else {
      return {
        account: capital === '>10000' ? 'Zero' : 'Pro',
        reason: capital === '>10000'
          ? 'Cuenta Zero: spreads de 0.0 pips en pares principales, perfecta para scalping y alta frecuencia.'
          : 'Cuenta Pro: condiciones profesionales con spreads reducidos.',
        nextStep: 'Acceder a herramientas profesionales'
      };
    }
  };

  const renderStep = () => {
    const fadeIn = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    };

    switch (step) {
      case "intro":
        return <IntroStep onContinue={() => setStep("email-capture")} onBack={goBack} canGoBack={canGoBack} />;

      case "email-capture":
        return (
          <EmailCaptureStep
            email={email}
            onEmailChange={setEmail}
            onContinue={handleEmailValidation}
            loading={loading}
            error={validationError}
            onBack={goBack}
            canGoBack={canGoBack}
          />
        );

      case "user-exists":
        return (
          <UserExistsStep
            email={email}
            onTryAnotherEmail={() => {
              setEmail("");
              setAccountStatus('unknown');
              setStep("email-capture");
            }}
          />
        );

      case "no-exness-account":
        return (
          <NoExnessAccountStep
            onAccountCreated={() => setStep("email-capture")}
          />
        );

      case "exness-detection":
        return (
          <ExnessDetectionStep
            onHasExness={() => setStep("has-exness-flow")}
            onNoExness={() => setStep("no-exness-flow")}
            onTryAnotherEmail={() => {
              setEmail("");
              setAccountStatus('unknown');
              setStep("email-capture");
            }}
          />
        );

      case "has-exness-flow":
        return (
          <HasExnessFlowStep
            onCompleted={() => setStep("email-capture")}
          />
        );

      case "no-exness-flow":
        return (
          <NoExnessFlowStep
            onAccountCreated={() => setStep("email-capture")}
          />
        );

      case "create-password":
        return (
          <motion.div
            key="create-password"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6 sm:space-y-8"
          >
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-glow-primary">
                  <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                Crear tu acceso a Tálamo
              </h2>
              
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Esta contraseña es para tu cuenta de Tálamo, independiente de Exness
              </p>
            </div>

            {isDemoMode && (
              <Alert className="bg-warning/10 border-warning/30">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-warning">
                  Modo demo — acceso temporal para explorar la plataforma
                </AlertDescription>
              </Alert>
            )}

            <Card className="border-border/50 bg-gradient-to-br from-surface/80 via-surface/50 to-surface/30 backdrop-blur-xl shadow-xl">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-6 p-4 rounded-xl bg-background/50 border border-border/30">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">
                        Seguridad y privacidad
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Tu panel de Tálamo es independiente de tu cuenta de trading. Solo validamos tu afiliación para darte acceso gratuito a las herramientas.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleCreatePassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm sm:text-base font-medium">
                      Crear contraseña
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="h-14 sm:h-16 px-4 text-base sm:text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl transition-all duration-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm sm:text-base font-medium">
                      Confirmar contraseña
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      className="h-14 sm:h-16 px-4 text-base sm:text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl transition-all duration-300"
                    />
                  </div>

                  <div className="text-xs sm:text-sm text-muted-foreground bg-background/30 p-4 rounded-lg border border-border/30">
                    La contraseña debe tener al menos 8 caracteres, incluir una mayúscula y un número.
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex gap-3">
                    {canGoBack && (
                      <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        onClick={goBack}
                        disabled={loading}
                        className="h-14 sm:h-16 px-6 rounded-xl sm:rounded-2xl transition-all duration-300"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={
                        password.length < 8 || 
                        password !== confirmPassword || 
                        !/(?=.*[A-Z])(?=.*\d)/.test(password) || 
                        loading
                      }
                      className="flex-1 h-14 sm:h-16 bg-gradient-primary hover:shadow-glow-primary text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Creando cuenta...
                        </>
                      ) : (
                        "Continuar"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
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
            className="space-y-6 sm:space-y-8"
          >
            <div className="text-center space-y-4 sm:space-y-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="flex items-center justify-center mb-6"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl flex items-center justify-center shadow-glow-primary">
                  <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                </div>
              </motion.div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                ¡Bienvenido a Tálamo!
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Vamos a personalizar tu experiencia en solo 3 pasos
              </p>
            </div>
            
            <Card className="border-border/50 bg-gradient-to-br from-surface/80 via-surface/50 to-surface/30 backdrop-blur-xl shadow-xl">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-base sm:text-lg font-medium">¿Cómo te llamas?</Label>
                  <Input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-14 sm:h-16 px-4 text-base sm:text-lg bg-background/50 border-2 border-border focus:border-primary rounded-xl transition-all duration-300"
                  />
                </div>
                
                <div className="flex gap-3">
                  {canGoBack && (
                    <Button
                      variant="outline"
                      onClick={goBack}
                      className="h-14 sm:h-16 px-6 rounded-xl sm:rounded-2xl transition-all duration-300"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  )}
                  <Button
                    onClick={() => setStep("goal")}
                    disabled={!name.trim()}
                    className="flex-1 h-14 sm:h-16 bg-gradient-primary hover:shadow-glow-primary text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Comenzar
                  </Button>
                </div>
              </CardContent>
            </Card>
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
            className="space-y-6 sm:space-y-8"
          >
            <div className="text-center space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                Hola {name}, ¿qué te gustaría hacer?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Selecciona la opción que más te interese
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { value: 'copiar', icon: Users, title: 'Copiar traders exitosos', desc: 'Invierte automáticamente siguiendo estrategias verificadas' },
                { value: 'aprender', icon: GraduationCap, title: 'Aprender trading', desc: 'Domina el trading desde cero con nuestra academia' },
                { value: 'operar', icon: TrendingUp, title: 'Operar por mi cuenta', desc: 'Usa herramientas profesionales y señales de trading' },
                { value: 'mixto', icon: Sparkles, title: 'Todo lo anterior', desc: 'Acceso completo a todas las funcionalidades' }
              ].map((option, index) => (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  onClick={() => {
                    setGoal(option.value as any);
                    setStep('capital');
                  }}
                  className="group p-6 sm:p-8 rounded-2xl border-2 border-border/50 bg-gradient-to-br from-surface/80 to-surface/40 hover:border-primary/50 hover:shadow-glow-primary transition-all text-left"
                >
                  <option.icon className="h-10 w-10 sm:h-12 sm:w-12 mb-4 text-primary" />
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {option.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {option.desc}
                  </p>
                </motion.button>
              ))}
            </div>
            
            {canGoBack && (
              <Button
                variant="outline"
                onClick={goBack}
                className="w-full h-14 sm:h-16 rounded-xl sm:rounded-2xl transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver
              </Button>
            )}
          </motion.div>
        );

      case "capital":
        return (
          <CapitalStep
            capital={capital}
            onCapitalChange={setCapital}
            onContinue={() => setStep("experience")}
            onBack={goBack}
            canGoBack={canGoBack}
          />
        );

      case "experience":
        return (
          <ExperienceStep
            experience={experience}
            onExperienceChange={setExperience}
            onContinue={() => setStep("recommendation")}
            onBack={goBack}
            canGoBack={canGoBack}
          />
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
            className="space-y-6 sm:space-y-8"
          >
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0.9, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
                className="flex items-center justify-center mb-6"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl flex items-center justify-center shadow-glow-primary">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
              </motion.div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                ¡Tu plan está listo!
              </h2>
            </div>
              
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-surface/90 via-surface/60 to-surface/40 backdrop-blur-xl shadow-glow-primary">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">Recomendación personalizada</span>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-bold text-primary">
                    {recommendation.account}
                  </h3>
                  
                  <p className="text-base sm:text-lg text-foreground/80 leading-relaxed">
                    {recommendation.reason}
                  </p>
                  
                  <div className="pt-6 border-t border-border/50 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Tu siguiente paso
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-foreground">
                      {recommendation.nextStep}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {canGoBack && (
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      onClick={goBack}
                      disabled={loading}
                      className="h-14 sm:h-16 px-6 rounded-xl sm:rounded-2xl transition-all duration-300"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  )}
                  <Button
                    onClick={handleComplete}
                    disabled={loading}
                    className="flex-1 h-14 sm:h-16 bg-gradient-primary hover:shadow-glow-primary text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Configurando...
                      </>
                    ) : (
                      "Comenzar mi camino"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      <OnboardingHeader stepNumber={getStepNumber()} progress={progress} />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </main>

      {/* Background gradient effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
      </div>
    </div>
  );
};

export default Onboarding;
