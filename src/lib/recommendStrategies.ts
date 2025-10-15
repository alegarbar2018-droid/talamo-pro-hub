import { CopyStrategy, RiskProfile, StrategyRecommendation } from "@/modules/copy/types";

/**
 * Recommends strategies based on investor risk profile and total investment
 */
export function recommendStrategies(
  riskProfile: RiskProfile,
  totalInvestment: number,
  strategies: CopyStrategy[]
): StrategyRecommendation[] {
  // Filter only active strategies
  const activeStrategies = strategies.filter(s => s.status === 'active');
  
  // Categorize strategies by risk level based on max drawdown
  const lowRisk = activeStrategies.filter(s => (s.max_drawdown || 100) <= 15);
  const mediumRisk = activeStrategies.filter(s => (s.max_drawdown || 100) > 15 && (s.max_drawdown || 100) <= 30);
  const highRisk = activeStrategies.filter(s => (s.max_drawdown || 100) > 30);
  
  let recommendations: StrategyRecommendation[] = [];
  
  switch (riskProfile) {
    case 'conservative':
      // 70% low risk, 30% medium risk
      if (lowRisk.length > 0 && mediumRisk.length > 0) {
        const primary = lowRisk.sort((a, b) => (b.profit_factor || 0) - (a.profit_factor || 0))[0];
        const secondary = mediumRisk.sort((a, b) => (b.profit_factor || 0) - (a.profit_factor || 0))[0];
        
        recommendations = [
          {
            strategy: primary,
            recommendedAmount: totalInvestment * 0.7,
            percentage: 70,
            reason: 'Estrategia conservadora con bajo riesgo y retornos estables'
          },
          {
            strategy: secondary,
            recommendedAmount: totalInvestment * 0.3,
            percentage: 30,
            reason: 'Estrategia moderada para diversificación'
          }
        ];
      } else if (lowRisk.length > 0) {
        const primary = lowRisk.sort((a, b) => (b.profit_factor || 0) - (a.profit_factor || 0))[0];
        recommendations = [{
          strategy: primary,
          recommendedAmount: totalInvestment,
          percentage: 100,
          reason: 'Mejor estrategia conservadora disponible'
        }];
      }
      break;
      
    case 'moderate':
      // 50% medium, 30% low, 20% high
      if (mediumRisk.length > 0 && lowRisk.length > 0 && highRisk.length > 0) {
        const primary = mediumRisk.sort((a, b) => (b.profit_factor || 0) - (a.profit_factor || 0))[0];
        const secondary = lowRisk.sort((a, b) => (b.profit_factor || 0) - (a.profit_factor || 0))[0];
        const tertiary = highRisk.sort((a, b) => (b.profit_factor || 0) - (a.profit_factor || 0))[0];
        
        recommendations = [
          {
            strategy: primary,
            recommendedAmount: totalInvestment * 0.5,
            percentage: 50,
            reason: 'Estrategia equilibrada con buen potencial de retorno'
          },
          {
            strategy: secondary,
            recommendedAmount: totalInvestment * 0.3,
            percentage: 30,
            reason: 'Base conservadora para estabilidad'
          },
          {
            strategy: tertiary,
            recommendedAmount: totalInvestment * 0.2,
            percentage: 20,
            reason: 'Componente agresivo para mayor retorno potencial'
          }
        ];
      } else if (mediumRisk.length > 0) {
        const primary = mediumRisk.sort((a, b) => (b.profit_factor || 0) - (a.profit_factor || 0))[0];
        recommendations = [{
          strategy: primary,
          recommendedAmount: totalInvestment,
          percentage: 100,
          reason: 'Mejor estrategia moderada disponible'
        }];
      }
      break;
      
    case 'aggressive':
      // 60% high, 40% medium
      if (highRisk.length > 0 && mediumRisk.length > 0) {
        const primary = highRisk.sort((a, b) => (b.total_return_percentage || 0) - (a.total_return_percentage || 0))[0];
        const secondary = mediumRisk.sort((a, b) => (b.profit_factor || 0) - (a.profit_factor || 0))[0];
        
        recommendations = [
          {
            strategy: primary,
            recommendedAmount: totalInvestment * 0.6,
            percentage: 60,
            reason: 'Estrategia agresiva con alto potencial de retorno'
          },
          {
            strategy: secondary,
            recommendedAmount: totalInvestment * 0.4,
            percentage: 40,
            reason: 'Balance con estrategia moderada'
          }
        ];
      } else if (highRisk.length > 0) {
        const primary = highRisk.sort((a, b) => (b.total_return_percentage || 0) - (a.total_return_percentage || 0))[0];
        recommendations = [{
          strategy: primary,
          recommendedAmount: totalInvestment,
          percentage: 100,
          reason: 'Mejor estrategia agresiva disponible'
        }];
      }
      break;
  }
  
  // Filter out strategies below minimum investment
  recommendations = recommendations.filter(
    rec => rec.recommendedAmount >= rec.strategy.min_investment
  );
  
  // Adjust if no valid recommendations
  if (recommendations.length === 0 && activeStrategies.length > 0) {
    // Return best overall strategy
    const best = activeStrategies.sort((a, b) => (b.profit_factor || 0) - (a.profit_factor || 0))[0];
    if (totalInvestment >= best.min_investment) {
      recommendations = [{
        strategy: best,
        recommendedAmount: totalInvestment,
        percentage: 100,
        reason: 'Mejor estrategia disponible según tu inversión'
      }];
    }
  }
  
  return recommendations;
}

/**
 * Calculate risk score based on strategy metrics
 */
export function calculateRiskScore(strategy: CopyStrategy): number {
  const drawdownWeight = 0.4;
  const profitFactorWeight = 0.3;
  const winRateWeight = 0.3;
  
  const drawdownScore = Math.max(0, 100 - (strategy.max_drawdown || 0));
  const profitFactorScore = Math.min(100, ((strategy.profit_factor || 1) / 3) * 100);
  const winRateScore = strategy.win_rate || 50;
  
  return (
    drawdownScore * drawdownWeight +
    profitFactorScore * profitFactorWeight +
    winRateScore * winRateWeight
  );
}
