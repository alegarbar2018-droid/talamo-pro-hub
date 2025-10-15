// Onboarding Logic Engine
// Centralizes all calculation and recommendation logic

export type CapitalBand = '<500' | '500-2000' | '2000-10000' | '>10000';
export type RiskTolerance = 'bajo' | 'medio' | 'alto';
export type Availability = '<2h' | '2-5h' | '5-10h' | '>10h';
export type TradingStyle = 'tranquila' | 'moderada' | 'rapida';
export type Platform = 'MT4' | 'MT5' | 'solo_copiar' | 'no_lo_se';
export type Goal = 'aprender' | 'operar' | 'copiar' | 'senales' | 'otro';
export type UserLevel = 'nuevo' | 'en_marcha' | 'con_experiencia' | 'avanzado';

export interface OnboardingProfile {
  // Existing fields
  first_name: string;
  phone: string;
  language: string;
  
  // New onboarding fields
  capital_band: CapitalBand;
  risk_tolerance: RiskTolerance;
  availability: Availability;
  trading_style: TradingStyle;
  platform_preference: Platform;
  goal: Goal;
  
  // Optional fields
  level?: string;
  interested_assets?: string[];
}

export interface ExperienceAnswers {
  control_perdidas: 0 | 1; // 0 = mala respuesta, 1 = buena
  tamano_posicion: 0 | 1;
  planificacion: 0 | 1;
  registro: 0 | 1;
  tiempo_operando: 0 | 1 | 2 | 3; // Nunca/demo=0, <6m=1, 6-24m=2, >2y=3
  num_operaciones: 0 | 1 | 2; // <50=0, 50-200=1, >200=2
}

export interface Recommendation {
  route: string;
  primaryAccount: string;
  secondaryAccount?: string;
  reasons: string[];
}

/**
 * Calcula el nivel del usuario basado en respuestas de experiencia
 */
export function calculateLevel(answers: ExperienceAnswers): UserLevel {
  // Comportamiento (máx 4 pts)
  const behaviorScore = 
    answers.control_perdidas + 
    answers.tamano_posicion + 
    answers.planificacion + 
    answers.registro;
  
  // Experiencia real (máx 5 pts)
  const experienceScore = 
    answers.tiempo_operando + 
    answers.num_operaciones;
  
  // Total (0-9)
  const totalScore = behaviorScore + experienceScore;
  
  if (totalScore <= 2) return 'nuevo';
  if (totalScore <= 5) return 'en_marcha';
  if (totalScore <= 8) return 'con_experiencia';
  return 'avanzado';
}

/**
 * Mapea nivel calculado a los niveles existentes en la BD
 */
export function mapLevelToExisting(level: UserLevel): string {
  const mapping: Record<UserLevel, string> = {
    'nuevo': 'beginner',
    'en_marcha': 'intermediate',
    'con_experiencia': 'advanced',
    'avanzado': 'expert'
  };
  return mapping[level];
}

/**
 * Construye recomendación de cuenta y ruta basado en perfil y nivel
 */
export function buildRecommendation(
  profile: OnboardingProfile, 
  level: UserLevel
): Recommendation {
  let route = '';
  let primaryAccount = '';
  let secondaryAccount = '';
  const reasons: string[] = [];
  
  // Caso prioritario: Copy Trading
  if (profile.goal === 'copiar' || profile.availability === '<2h') {
    route = 'Invertir sin operar';
    primaryAccount = 'Copy Trading';
    reasons.push('Ideal para quienes tienen poco tiempo disponible');
    reasons.push('No requiere experiencia previa en trading');
    return { route, primaryAccount, reasons };
  }
  
  // Caso: Aprender
  if (profile.goal === 'aprender' && (level === 'nuevo' || level === 'en_marcha')) {
    route = 'Aprender y operar';
    primaryAccount = 'Standard Cent';
    secondaryAccount = 'Standard';
    reasons.push('Permite practicar con riesgo mínimo');
    reasons.push('Ideal para desarrollar habilidades sin presión');
    
    if (profile.capital_band === '<500') {
      reasons.push('Compatible con tu capital inicial');
    }
  }
  
  // Caso: Operar con experiencia
  else if (profile.goal === 'operar' && level === 'con_experiencia') {
    route = 'Operar con experiencia';
    primaryAccount = 'Standard';
    secondaryAccount = 'Pro';
    reasons.push('Condiciones profesionales para traders con experiencia');
    reasons.push('Spreads competitivos y ejecución rápida');
    
    if (profile.risk_tolerance === 'alto') {
      reasons.push('Soporta estrategias más agresivas');
    }
  }
  
  // Caso: Avanzado
  else if (level === 'avanzado' && profile.trading_style === 'rapida') {
    route = 'Operar avanzado';
    primaryAccount = 'Zero';
    secondaryAccount = 'Raw Spread';
    reasons.push('Spreads ultra bajos para scalping y alta frecuencia');
    reasons.push('Ideal para traders profesionales');
  }
  
  // Caso: Señales
  else if (profile.goal === 'senales') {
    route = 'Aprender con señales';
    primaryAccount = 'Standard Cent';
    secondaryAccount = 'Standard';
    reasons.push('Aprende mientras sigues recomendaciones de expertos');
    reasons.push('Reduce el riesgo mientras ganas experiencia');
  }
  
  // Ajustes por capital
  if (profile.capital_band === '<500' && primaryAccount !== 'Copy Trading') {
    primaryAccount = 'Standard Cent';
    if (!reasons.includes('Compatible con tu capital inicial')) {
      reasons.push('Ajustado a tu capital disponible');
    }
  }
  
  if (profile.capital_band === '>10000' && (level === 'con_experiencia' || level === 'avanzado')) {
    primaryAccount = 'Pro';
    reasons.push('Cuenta profesional para capital significativo');
  }
  
  // Fallback
  if (!route) {
    route = 'Aprender y operar';
    primaryAccount = 'Standard Cent';
    reasons.push('Recomendación base para comenzar con seguridad');
  }
  
  return { route, primaryAccount, secondaryAccount, reasons };
}

/**
 * Prepara el objeto completo para actualizar en Supabase
 */
export function prepareProfileUpdate(
  profile: OnboardingProfile,
  answers: ExperienceAnswers
): Record<string, any> {
  const level = calculateLevel(answers);
  const recommendation = buildRecommendation(profile, level);
  
  return {
    // Campos existentes
    first_name: profile.first_name,
    phone: profile.phone,
    language: profile.language,
    level: mapLevelToExisting(level),
    risk_tolerance: profile.risk_tolerance,
    goal: profile.goal,
    interested_assets: profile.interested_assets || [],
    
    // Nuevos campos del onboarding
    capital_band: profile.capital_band,
    availability: profile.availability,
    trading_style: profile.trading_style,
    platform_preference: profile.platform_preference,
    experience_score: answers.control_perdidas + answers.tamano_posicion + 
                      answers.planificacion + answers.registro +
                      answers.tiempo_operando + answers.num_operaciones,
    recommended_account: recommendation.primaryAccount,
    recommended_route: recommendation.route,
    onboarding_completed: true,
    onboarding_completed_at: new Date().toISOString(),
  };
}
