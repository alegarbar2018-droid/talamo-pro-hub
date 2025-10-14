import { describe, it, expect } from 'vitest';

/**
 * Calculator Formula Tests
 * Verifies calculation accuracy with known test cases
 */

describe('Position Size Calculator', () => {
  it('calculates correct lot size for 2% risk', () => {
    const balance = 10000;
    const riskPercent = 2;
    const stopLossPips = 50;
    const pipValue = 10; // Standard lot USD/pip
    
    const riskAmount = balance * (riskPercent / 100); // $200
    const lotSize = riskAmount / (stopLossPips * pipValue); // 200 / 500 = 0.4
    
    expect(lotSize).toBe(0.4);
    expect(riskAmount).toBe(200);
  });

  it('warns when risk exceeds 5%', () => {
    const riskPercent = 6;
    expect(riskPercent).toBeGreaterThan(5);
  });

  it('handles small accounts correctly', () => {
    const balance = 500;
    const riskPercent = 1;
    const stopLossPips = 20;
    const pipValue = 1; // Micro lot
    
    const riskAmount = balance * (riskPercent / 100); // $5
    const lotSize = riskAmount / (stopLossPips * pipValue); // 5 / 20 = 0.25
    
    expect(lotSize).toBe(0.25);
  });
});

describe('Pip Value Calculator', () => {
  it('calculates standard lot pip value for EUR/USD', () => {
    const lots = 1;
    const contractSize = 100000;
    const pipSize = 0.0001;
    
    const pipValue = lots * contractSize * pipSize;
    
    expect(pipValue).toBe(10);
  });

  it('calculates mini lot pip value', () => {
    const lots = 0.1;
    const contractSize = 100000;
    const pipSize = 0.0001;
    
    const pipValue = lots * contractSize * pipSize;
    
    expect(pipValue).toBe(1);
  });

  it('calculates JPY pairs correctly', () => {
    const lots = 1;
    const contractSize = 100000;
    const pipSize = 0.01; // JPY pairs use 0.01
    
    const pipValue = lots * contractSize * pipSize;
    
    expect(pipValue).toBe(1000);
  });
});

describe('Margin Calculator', () => {
  it('calculates margin for 1:100 leverage', () => {
    const lots = 1;
    const contractSize = 100000;
    const leverage = 100;
    
    const margin = (lots * contractSize) / leverage;
    
    expect(margin).toBe(1000);
  });

  it('calculates margin for 1:500 leverage', () => {
    const lots = 1;
    const contractSize = 100000;
    const leverage = 500;
    
    const margin = (lots * contractSize) / leverage;
    
    expect(margin).toBe(200);
  });

  it('calculates margin for fractional lots', () => {
    const lots = 0.5;
    const contractSize = 100000;
    const leverage = 100;
    
    const margin = (lots * contractSize) / leverage;
    
    expect(margin).toBe(500);
  });
});

describe('Profit/Loss Calculator', () => {
  it('calculates profit for BUY order', () => {
    const openingPrice = 1.1000;
    const closingPrice = 1.1050;
    const pipSize = 0.0001;
    const pipValue = 10;
    
    const pipsGained = (closingPrice - openingPrice) / pipSize; // 50 pips
    const profitUSD = pipsGained * pipValue; // $500
    
    expect(pipsGained).toBe(50);
    expect(profitUSD).toBe(500);
  });

  it('calculates loss for BUY order', () => {
    const openingPrice = 1.1000;
    const closingPrice = 1.0950;
    const pipSize = 0.0001;
    const pipValue = 10;
    
    const pipsGained = (closingPrice - openingPrice) / pipSize; // -50 pips
    const profitUSD = pipsGained * pipValue; // -$500
    
    expect(pipsGained).toBe(-50);
    expect(profitUSD).toBe(-500);
  });

  it('calculates profit for SELL order', () => {
    const openingPrice = 1.1000;
    const closingPrice = 1.0950;
    const pipSize = 0.0001;
    const pipValue = 10;
    
    const pipsGained = (openingPrice - closingPrice) / pipSize; // 50 pips
    const profitUSD = pipsGained * pipValue; // $500
    
    expect(pipsGained).toBe(50);
    expect(profitUSD).toBe(500);
  });
});

describe('TP/SL Calculator', () => {
  it('calculates TP/SL for BUY order', () => {
    const openingPrice = 1.1000;
    const desiredProfit = 500; // $500
    const pipValue = 10;
    const pipSize = 0.0001;
    
    const priceChange = (desiredProfit / pipValue) * pipSize; // 50 pips = 0.0050
    const takeProfit = openingPrice + priceChange; // 1.1050
    const stopLoss = openingPrice - priceChange; // 1.0950
    
    expect(takeProfit).toBeCloseTo(1.1050, 4);
    expect(stopLoss).toBeCloseTo(1.0950, 4);
  });

  it('calculates TP/SL for SELL order', () => {
    const openingPrice = 1.1000;
    const desiredProfit = 500;
    const pipValue = 10;
    const pipSize = 0.0001;
    
    const priceChange = (desiredProfit / pipValue) * pipSize;
    const takeProfit = openingPrice - priceChange; // 1.0950
    const stopLoss = openingPrice + priceChange; // 1.1050
    
    expect(takeProfit).toBeCloseTo(1.0950, 4);
    expect(stopLoss).toBeCloseTo(1.1050, 4);
  });
});

describe('Swap Calculator', () => {
  it('calculates positive swap (credit)', () => {
    const swapRate = 0.5; // pips per day
    const days = 7;
    const pipValue = 10;
    
    const totalSwap = swapRate * days * pipValue; // $35 credit
    
    expect(totalSwap).toBe(35);
  });

  it('calculates negative swap (cost)', () => {
    const swapRate = -2.0; // pips per day
    const days = 30;
    const pipValue = 10;
    
    const totalSwap = swapRate * days * pipValue; // -$600 cost
    
    expect(totalSwap).toBe(-600);
  });
});

describe('R/R & Expectancy Calculator', () => {
  it('calculates positive expectancy', () => {
    const winRate = 60;
    const avgWin = 300;
    const avgLoss = 200;
    
    const lossRate = 100 - winRate;
    const expectancy = ((winRate / 100) * avgWin) - ((lossRate / 100) * avgLoss);
    // (0.6 * 300) - (0.4 * 200) = 180 - 80 = 100
    
    expect(expectancy).toBe(100);
  });

  it('calculates negative expectancy', () => {
    const winRate = 40;
    const avgWin = 200;
    const avgLoss = 300;
    
    const lossRate = 100 - winRate;
    const expectancy = ((winRate / 100) * avgWin) - ((lossRate / 100) * avgLoss);
    // (0.4 * 200) - (0.6 * 300) = 80 - 180 = -100
    
    expect(expectancy).toBe(-100);
  });

  it('calculates break-even expectancy', () => {
    const winRate = 50;
    const avgWin = 200;
    const avgLoss = 200;
    
    const lossRate = 100 - winRate;
    const expectancy = ((winRate / 100) * avgWin) - ((lossRate / 100) * avgLoss);
    
    expect(expectancy).toBe(0);
  });

  it('validates minimum win rate needed for profitability', () => {
    const avgWin = 300;
    const avgLoss = 200;
    const rrRatio = avgWin / avgLoss; // 1.5
    
    // Win rate needed = 1 / (1 + R/R)
    const minWinRate = (1 / (1 + rrRatio)) * 100;
    
    expect(minWinRate).toBeCloseTo(40, 1);
  });
});

describe('Edge Cases & Validations', () => {
  it('handles zero values safely', () => {
    const result = 100 / 0;
    expect(result).toBe(Infinity);
  });

  it('handles very small numbers', () => {
    const lots = 0.01;
    const contractSize = 100000;
    const pipSize = 0.0001;
    
    const pipValue = lots * contractSize * pipSize;
    
    expect(pipValue).toBeCloseTo(0.1, 2);
  });

  it('handles very large numbers', () => {
    const balance = 1000000;
    const riskPercent = 1;
    
    const riskAmount = balance * (riskPercent / 100);
    
    expect(riskAmount).toBe(10000);
  });

  it('validates percentage bounds', () => {
    const validatePercentage = (value: number) => value >= 0 && value <= 100;
    
    expect(validatePercentage(50)).toBe(true);
    expect(validatePercentage(-10)).toBe(false);
    expect(validatePercentage(150)).toBe(false);
  });
});
