import { useState, useCallback, useMemo } from "react";
import type { 
  CalculatorConfig, 
  CalculatorState, 
  CalculatorResult,
  UseCalculatorReturn,
  CalculatorHistoryEntry
} from "@/types/calculators";

const MAX_HISTORY = 5;

export function useCalculator(
  config: CalculatorConfig,
  calculateFn: (inputs: Record<string, number | string | boolean>) => CalculatorResult[]
): UseCalculatorReturn {
  
  // Initialize default inputs from config
  const defaultInputs = useMemo(() => {
    return config.inputs.reduce((acc, input) => {
      acc[input.id] = input.defaultValue;
      return acc;
    }, {} as Record<string, number | string | boolean>);
  }, [config.inputs]);

  const [state, setState] = useState<CalculatorState>({
    inputs: defaultInputs,
    results: [],
    isValid: true,
    errors: {},
    warnings: {},
    isCalculating: false,
  });

  const [history, setHistory] = useState<CalculatorHistoryEntry[]>([]);

  /**
   * Validate all inputs based on config rules
   */
  const validateInputs = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};

    config.inputs.forEach((inputConfig) => {
      const value = state.inputs[inputConfig.id];

      // Required field validation
      if (inputConfig.required && (value === null || value === undefined || value === '')) {
        errors[inputConfig.id] = `${inputConfig.label} es requerido`;
        return;
      }

      // Number validations
      if (inputConfig.type === 'number' && typeof value === 'number') {
        if (inputConfig.min !== undefined && value < inputConfig.min) {
          errors[inputConfig.id] = `Debe ser mayor o igual a ${inputConfig.min}`;
        }
        if (inputConfig.max !== undefined && value > inputConfig.max) {
          errors[inputConfig.id] = `Debe ser menor o igual a ${inputConfig.max}`;
        }

        // Warning thresholds
        if (inputConfig.warningThreshold && value >= inputConfig.warningThreshold.value) {
          warnings[inputConfig.id] = inputConfig.warningThreshold.message;
        }
      }
    });

    setState(prev => ({
      ...prev,
      errors,
      warnings,
      isValid: Object.keys(errors).length === 0
    }));

    return Object.keys(errors).length === 0;
  }, [config.inputs, state.inputs]);

  /**
   * Update a single input value
   */
  const updateInput = useCallback((id: string, value: number | string | boolean) => {
    setState(prev => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        [id]: value
      },
      errors: {
        ...prev.errors,
        [id]: undefined
      }
    }));
  }, []);

  /**
   * Execute calculation
   */
  const calculate = useCallback(() => {
    if (!validateInputs()) {
      return;
    }

    setState(prev => ({ ...prev, isCalculating: true }));

    try {
      const results = calculateFn(state.inputs);
      
      setState(prev => ({
        ...prev,
        results,
        isCalculating: false
      }));

      // Add to history
      setHistory(prev => {
        const newEntry: CalculatorHistoryEntry = {
          timestamp: new Date(),
          inputs: { ...state.inputs },
          results
        };
        return [newEntry, ...prev].slice(0, MAX_HISTORY);
      });
    } catch (error) {
      console.error('Calculation error:', error);
      setState(prev => ({
        ...prev,
        isCalculating: false,
        errors: {
          ...prev.errors,
          calculation: error instanceof Error ? error.message : 'Error en el cálculo'
        }
      }));
    }
  }, [calculateFn, state.inputs, validateInputs]);

  /**
   * Reset calculator to defaults
   */
  const reset = useCallback(() => {
    setState({
      inputs: defaultInputs,
      results: [],
      isValid: true,
      errors: {},
      warnings: {},
      isCalculating: false,
    });
  }, [defaultInputs]);

  /**
   * Get input value by id
   */
  const getInputValue = useCallback((id: string): number | string | boolean => {
    return state.inputs[id] ?? '';
  }, [state.inputs]);

  return {
    state,
    updateInput,
    calculate,
    reset,
    validateInputs,
    getInputValue,
    history
  };
}
