/**
 * Calculator System Types
 * Defines the structure for modular calculator components
 */

export type CalculatorInputType = 'number' | 'select' | 'toggle';

export interface CalculatorInputOption {
  value: string;
  label: string;
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: CalculatorInputType;
  unit?: string;
  tooltip: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | string | boolean;
  options?: CalculatorInputOption[];
  required?: boolean;
  warningThreshold?: {
    value: number;
    message: string;
    severity: 'low' | 'medium' | 'high';
  };
}

export type ResultFormat = 'number' | 'currency' | 'percentage' | 'pips';

export interface CalculatorResult {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  format: ResultFormat;
  decimals: number;
  tooltip?: string;
  sentiment?: 'positive' | 'negative' | 'neutral' | 'warning';
  highlight?: boolean;
}

export interface FormulaStep {
  step: number;
  description: string;
  formula: string;
  example?: string;
  variables?: Record<string, string>;
}

export interface CalculatorFormula {
  title: string;
  description: string;
  steps: FormulaStep[];
  references?: string[];
}

export interface CalculatorConfig {
  id: string;
  title: string;
  description: string;
  category: 'basic' | 'intermediate' | 'advanced';
  icon: React.ComponentType<{ className?: string }>;
  inputs: CalculatorInput[];
  formula: CalculatorFormula;
  requiresContractSpec?: boolean;
  tags?: string[];
}

export interface CalculatorState {
  inputs: Record<string, number | string | boolean>;
  results: CalculatorResult[];
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
  isCalculating: boolean;
}

export interface UseCalculatorReturn {
  state: CalculatorState;
  updateInput: (id: string, value: number | string | boolean) => void;
  calculate: () => void;
  reset: () => void;
  validateInputs: () => boolean;
  getInputValue: (id: string) => number | string | boolean;
  history: CalculatorHistoryEntry[];
}

export interface CalculatorHistoryEntry {
  timestamp: Date;
  inputs: Record<string, number | string | boolean>;
  results: CalculatorResult[];
}
