import type { InvestorProfile, InvestorRiskProfile, CopyStrategy, StrategyAllocation, RiskBand } from '@/modules/copy/types';

/**
 * Verifica si una estrategia es compatible con el perfil de riesgo del inversionista
 */
function isCompatibleRiskBand(
  strategyBand: RiskBand | undefined,
  investorProfile: InvestorRiskProfile
): boolean {
  if (!strategyBand) return true; // Si no tiene band, asumimos compatible
  
  const riskMapping = {
    conservative: ['Conservador'],
    moderate: ['Conservador', 'Moderado'],
    aggressive: ['Conservador', 'Moderado', 'Agresivo']
  };
  
  return riskMapping[investorProfile].includes(strategyBand);
}

/**
 * Calcula el solapamiento de símbolos entre dos arrays (0-1)
 */
function calculateSymbolOverlap(symbols1: string[], symbols2: string[]): number {
  const set1 = new Set(symbols1);
  const set2 = new Set(symbols2);
  const intersection = [...set1].filter(s => set2.has(s));
  
  const union = new Set([...symbols1, ...symbols2]);
  if (union.size === 0) return 0;
  
  return intersection.length / Math.min(symbols1.length, symbols2.length);
}

/**
 * Calcula peso base de una estrategia basado en KPIs
 */
function calculateStrategyScore(strategy: CopyStrategy): number {
  let score = 1.0;
  
  // Bonus por profit factor
  if (strategy.profit_factor && strategy.profit_factor > 1.5) {
    score *= (1 + (strategy.profit_factor - 1.5) * 0.1);
  }
  
  // Penalización por drawdown alto
  if (strategy.max_drawdown) {
    if (strategy.max_drawdown < 15) {
      score *= 1.2; // Bonus conservador
    } else if (strategy.max_drawdown > 25) {
      score *= 0.8; // Penalización agresivo
    }
  }
  
  // Bonus por win rate alto
  if (strategy.win_rate && strategy.win_rate > 60) {
    score *= 1.1;
  }
  
  return score;
}

/**
 * Algoritmo de recomendación de estrategias
 * Fase 5: Asignación educativa basada en perfil de riesgo, diversificación y límites
 */
export function recommendStrategies(
  profile: InvestorProfile,
  strategies: CopyStrategy[]
): StrategyAllocation[] {
  const { total_investment, risk_tolerance } = profile;
  
  // Determinar perfil de riesgo basado en tolerance
  const riskProfile: InvestorRiskProfile = 
    risk_tolerance <= 3 ? 'conservative' :
    risk_tolerance <= 7 ? 'moderate' : 'aggressive';
  
  // 1. Filtrar estrategias compatibles y factibles
  const compatible = strategies
    .filter(s => s.status === 'published')
    .filter(s => isCompatibleRiskBand(s.risk_band, riskProfile))
    .filter(s => s.min_investment <= total_investment * 0.4) // Máx 40% por estrategia
    .sort((a, b) => calculateStrategyScore(b) - calculateStrategyScore(a));
  
  if (compatible.length === 0) {
    return [];
  }
  
  // 2. Seleccionar estrategias diversificadas (max 5)
  const selected: CopyStrategy[] = [];
  const maxStrategies = Math.min(5, Math.max(3, Math.floor(total_investment / 50))); // Min 3, ideal según capital
  
  for (const strategy of compatible) {
    if (selected.length >= maxStrategies) break;
    
    // Verificar que no tenga demasiado overlap con estrategias ya seleccionadas
    let hasHighOverlap = false;
    for (const existing of selected) {
      const overlap = calculateSymbolOverlap(strategy.symbols, existing.symbols);
      if (overlap > 0.6) { // Más del 60% de overlap = rechazar
        hasHighOverlap = true;
        break;
      }
    }
    
    if (!hasHighOverlap) {
      selected.push(strategy);
    }
  }
  
  // 3. Calcular pesos iniciales
  const weights = selected.map(s => calculateStrategyScore(s));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  
  // 4. Normalizar y asignar montos
  const allocations: StrategyAllocation[] = [];
  let remaining = total_investment;
  
  for (let i = 0; i < selected.length; i++) {
    const strategy = selected[i];
    const normalizedWeight = weights[i] / totalWeight;
    
    // Calcular monto sugerido
    let suggestedAmount = Math.round(total_investment * normalizedWeight);
    
    // Aplicar límites
    suggestedAmount = Math.max(strategy.min_investment, suggestedAmount);
    suggestedAmount = Math.min(total_investment * 0.4, suggestedAmount); // Cap 40%
    
    // Si es la última estrategia, asignar todo lo que queda (si es suficiente)
    if (i === selected.length - 1 && remaining >= strategy.min_investment) {
      suggestedAmount = remaining;
    }
    
    // Ajustar si excede el remanente
    if (suggestedAmount > remaining) {
      suggestedAmount = remaining;
    }
    
    if (suggestedAmount >= strategy.min_investment) {
      allocations.push({
        strategy,
        suggested_amount: suggestedAmount,
        percentage: Math.round((suggestedAmount / total_investment) * 100),
        reason: generateAllocationReason(strategy, riskProfile)
      });
      
      remaining -= suggestedAmount;
    }
  }
  
  // 5. Si queda remanente significativo, redistribuir proporcionalmente
  if (remaining > 10 && allocations.length > 0) {
    const perStrategy = Math.floor(remaining / allocations.length);
    allocations.forEach(a => {
      a.suggested_amount += perStrategy;
      a.percentage = Math.round((a.suggested_amount / total_investment) * 100);
    });
  }
  
  return allocations;
}

/**
 * Genera razón educativa para la asignación
 */
function generateAllocationReason(strategy: CopyStrategy, profile: InvestorRiskProfile): string {
  const reasons: string[] = [];
  
  // Razón de perfil
  if (strategy.risk_band === 'Conservador' && profile === 'conservative') {
    reasons.push('Alineado con tu perfil conservador');
  } else if (strategy.risk_band === 'Moderado') {
    reasons.push('Balance entre riesgo y retorno');
  }
  
  // Razón de KPIs
  if (strategy.profit_factor && strategy.profit_factor > 2) {
    reasons.push(`PF sólido (${strategy.profit_factor.toFixed(2)})`);
  }
  
  if (strategy.max_drawdown && strategy.max_drawdown < 20) {
    reasons.push(`DD controlado (${strategy.max_drawdown}%)`);
  }
  
  // Razón de símbolos
  if (strategy.symbols.length > 3) {
    reasons.push('Diversificación multi-activo');
  }
  
  return reasons.length > 0 ? reasons.join(' • ') : 'Estrategia compatible con tu perfil';
}

/**
 * Valida que una asignación cumpla con límites de exposición
 */
export function validateAllocation(allocation: StrategyAllocation, totalInvestment: number): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Mínimo de inversión
  if (allocation.suggested_amount < allocation.strategy.min_investment) {
    errors.push(`Monto menor al mínimo requerido ($${allocation.strategy.min_investment})`);
  }
  
  // Cap de 40%
  if (allocation.percentage > 40) {
    errors.push('Supera el límite de 40% por estrategia');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
