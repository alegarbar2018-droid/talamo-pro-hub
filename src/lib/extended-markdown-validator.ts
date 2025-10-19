/**
 * Tálamo Extended Markdown Validator
 * Validates interactive blocks and provides helpful error messages
 */

import { z } from 'zod';
import {
  ALLOWED_ASSETS,
  ParseError,
  ValidationResult,
  TradingSimulatorPropsV2,
  MarketParams,
  RiskParams,
  Rubric,
  LessonMeta
} from '@/types/extended-markdown';

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

const LessonMetaSchema = z.object({
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  duration: z.string().regex(/^\d+min$/).optional(),
  tags: z.array(z.string()).optional(),
  id: z.string().optional()
});

const EducationalContextSchema = z.object({
  concept: z.string().min(1, 'Concept cannot be empty'),
  whatToLook: z.array(z.string()).min(1, 'Must have at least one item to look for'),
  hint: z.string().min(1, 'Hint cannot be empty')
});

const MarketParamsSchema = z.object({
  spread: z.number().positive('Spread must be positive'),
  slippage: z.number().nonnegative('Slippage cannot be negative').optional(),
  commission_per_lot: z.number().nonnegative('Commission cannot be negative').optional(),
  pip_size: z.number().positive('Pip size must be positive').optional()
});

const RiskParamsSchema = z.object({
  initial_balance: z.number().positive('Initial balance must be positive'),
  risk_pct: z.number().min(0.1).max(5, 'Risk percentage must be between 0.1% and 5%'),
  min_rr: z.number().min(1, 'Minimum R:R must be at least 1')
});

const DatasetSchema = z.object({
  ohlc: z.array(
    z.tuple([
      z.string(), // timestamp
      z.number(), // open
      z.number(), // high
      z.number(), // low
      z.number(), // close
      z.number().optional() // volume
    ])
  ).min(2, 'Dataset must have at least 2 candles')
});

const AnnotationsV2Schema = z.object({
  higherHighs: z.array(z.number()).optional(),
  higherLows: z.array(z.number()).optional(),
  lowerHighs: z.array(z.number()).optional(),
  lowerLows: z.array(z.number()).optional(),
  supportZones: z.array(z.number()).optional(),
  resistanceZones: z.array(z.number()).optional(),
  trendLines: z.array(z.object({
    start: z.number(),
    end: z.number(),
    price1: z.number(),
    price2: z.number()
  })).optional(),
  patternBoxes: z.array(z.object({
    start: z.number(),
    end: z.number(),
    label: z.string()
  })).optional()
});

const RubricSchema = z.record(z.number()).refine(
  (rubric) => {
    const sum = Object.values(rubric).reduce((acc, val) => acc + val, 0);
    return Math.abs(sum - 1) < 0.01; // allow small floating point errors
  },
  { message: 'Rubric weights must sum to 1.0' }
);

const SimulationStepSchema = z.object({
  id: z.string(),
  slice: z.object({
    start: z.number().optional(),
    end: z.number()
  }),
  question: z.string().min(1, 'Step question cannot be empty'),
  correct_action: z.enum(['market_buy', 'market_sell', 'skip', 'identify_trend', 'plan_buy', 'plan_sell']),
  hints: z.array(z.string()).optional(),
  feedback: z.record(z.string()).optional()
});

const TradingSimV1Schema = z.object({
  asset: z.enum(ALLOWED_ASSETS as any, { errorMap: () => ({ message: 'Invalid asset. Must be one of: ' + ALLOWED_ASSETS.join(', ') }) }),
  scenario: z.string().min(1, 'Scenario cannot be empty'),
  question: z.string().min(1, 'Question cannot be empty'),
  scenarioData: z.object({
    historical: z.array(z.number()).min(2, 'Historical data must have at least 2 points'),
    current: z.number(),
    future: z.array(z.number()).min(1, 'Future data must have at least 1 point'),
    correct_action: z.enum(['buy', 'sell', 'skip']),
    entry: z.number().optional(),
    stop_loss: z.number().optional(),
    take_profit: z.number().optional()
  }),
  feedbackBuy: z.string().optional(),
  feedbackSell: z.string().optional(),
  feedbackSkip: z.string().optional(),
  educationalContext: EducationalContextSchema.optional(),
  annotations: z.array(z.object({
    type: z.enum(['support', 'resistance', 'hh', 'hl', 'lh', 'll']),
    price: z.number(),
    label: z.string().optional()
  })).optional()
});

const TradingSimV2Schema = z.object({
  asset: z.enum(ALLOWED_ASSETS as any, { errorMap: () => ({ message: 'Invalid asset. Must be one of: ' + ALLOWED_ASSETS.join(', ') }) }),
  scenario: z.string().min(1, 'Scenario cannot be empty'),
  v: z.literal('2').optional(),
  chart: z.enum(['candles', 'line']).optional(),
  timeframe: z.enum(['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1']).optional(),
  reveal_future: z.enum(['after_decision', 'progressive', 'immediate']).optional(),
  currency: z.string().optional(),
  market: MarketParamsSchema.optional(),
  risk: RiskParamsSchema.optional(),
  dataset: DatasetSchema.optional(),
  annotations: AnnotationsV2Schema.optional(),
  context: EducationalContextSchema.optional(),
  question: z.string().min(1, 'Question cannot be empty'),
  hints: z.array(z.string()).optional(),
  rubric: RubricSchema.optional(),
  steps: z.array(SimulationStepSchema).optional(),
  feedback_general: z.string().optional(),
  feedback_buy: z.string().optional(),
  feedback_sell: z.string().optional(),
  feedback_skip: z.string().optional(),
  feedback: z.record(z.string()).optional()
});

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export function validateLessonMeta(data: unknown): ValidationResult {
  const errors: ParseError[] = [];
  
  try {
    LessonMetaSchema.parse(data);
    return { valid: true, errors: [], warnings: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        errors.push({
          line: 0,
          block: 'meta',
          field: err.path.join('.'),
          message: err.message,
          severity: 'error',
          suggestion: getSuggestionForMetaError(err)
        });
      });
    }
  }

  return { valid: false, errors, warnings: [] };
}

export function validateTradingSim(data: unknown, line: number = 0): ValidationResult {
  const errors: ParseError[] = [];
  const warnings: ParseError[] = [];

  // Detect version
  const version = (data as any)?.v === '2' ? 'v2' : 'v1';
  const schema = version === 'v2' ? TradingSimV2Schema : TradingSimV1Schema;

  try {
    const parsed = schema.parse(data);

    // Additional validations for v2
    if (version === 'v2') {
      const v2Data = parsed as z.infer<typeof TradingSimV2Schema>;

      // Validate temporal consistency for dataset
      if (v2Data.dataset?.ohlc) {
        for (let i = 1; i < v2Data.dataset.ohlc.length; i++) {
          const prev = new Date(v2Data.dataset.ohlc[i - 1][0]);
          const curr = new Date(v2Data.dataset.ohlc[i][0]);
          if (curr <= prev) {
            errors.push({
              line,
              block: 'trading-sim',
              field: 'dataset.ohlc',
              message: `Timestamps must be in chronological order (index ${i})`,
              severity: 'error'
            });
          }
        }

        // Validate OHLC consistency (high >= open/close, low <= open/close)
        v2Data.dataset.ohlc.forEach((candle, idx) => {
          const [, open, high, low, close] = candle;
          if (high < Math.max(open, close) || low > Math.min(open, close)) {
            errors.push({
              line,
              block: 'trading-sim',
              field: 'dataset.ohlc',
              message: `Invalid OHLC at index ${idx}: high must be >= max(open,close) and low <= min(open,close)`,
              severity: 'error'
            });
          }
        });
      }

      // Validate entry/sl/tp coherence if present
      const scenarioData = (data as any).scenarioData;
      if (scenarioData?.entry && scenarioData?.stop_loss && scenarioData?.take_profit) {
        const { entry, stop_loss, take_profit, correct_action } = scenarioData;
        
        if (correct_action === 'buy') {
          if (stop_loss >= entry) {
            errors.push({
              line,
              block: 'trading-sim',
              field: 'scenarioData.stop_loss',
              message: 'For BUY: stop_loss must be < entry',
              severity: 'error'
            });
          }
          if (take_profit <= entry) {
            errors.push({
              line,
              block: 'trading-sim',
              field: 'scenarioData.take_profit',
              message: 'For BUY: take_profit must be > entry',
              severity: 'error'
            });
          }
        } else if (correct_action === 'sell') {
          if (stop_loss <= entry) {
            errors.push({
              line,
              block: 'trading-sim',
              field: 'scenarioData.stop_loss',
              message: 'For SELL: stop_loss must be > entry',
              severity: 'error'
            });
          }
          if (take_profit >= entry) {
            errors.push({
              line,
              block: 'trading-sim',
              field: 'scenarioData.take_profit',
              message: 'For SELL: take_profit must be < entry',
              severity: 'error'
            });
          }
        }
      }

      // Warn if no feedback provided
      if (!v2Data.feedback_buy && !v2Data.feedback_sell && !v2Data.feedback_skip && !v2Data.feedback) {
        warnings.push({
          line,
          block: 'trading-sim',
          message: 'No feedback messages provided. Consider adding feedback for better learning experience.',
          severity: 'warning'
        });
      }
    }

    return { valid: errors.length === 0, errors, warnings };
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        errors.push({
          line,
          block: 'trading-sim',
          field: err.path.join('.'),
          message: err.message,
          severity: 'error',
          suggestion: getSuggestionForTradingSimError(err)
        });
      });
    } else {
      errors.push({
        line,
        block: 'trading-sim',
        message: 'Invalid JSON or unknown error',
        severity: 'error'
      });
    }
  }

  return { valid: false, errors, warnings };
}

export function validateJSON(jsonString: string, line: number = 0): ValidationResult {
  const errors: ParseError[] = [];

  try {
    JSON.parse(jsonString);
    return { valid: true, errors: [], warnings: [] };
  } catch (error: any) {
    const message = error.message || 'Invalid JSON';
    
    errors.push({
      line,
      block: 'trading-sim',
      message: `JSON Parse Error: ${message}`,
      severity: 'error',
      suggestion: getJSONSuggestion(message)
    });
  }

  return { valid: false, errors, warnings: [] };
}

// ============================================================================
// ERROR SUGGESTIONS
// ============================================================================

function getSuggestionForMetaError(error: z.ZodIssue): string {
  if (error.path.includes('duration')) {
    return 'Duration must be in format: "12min", "45min", etc.';
  }
  if (error.path.includes('level')) {
    return 'Level must be one of: beginner, intermediate, advanced';
  }
  return '';
}

function getSuggestionForTradingSimError(error: z.ZodIssue): string {
  if (error.path.includes('asset')) {
    return `Valid assets: ${ALLOWED_ASSETS.join(', ')}`;
  }
  if (error.path.includes('risk_pct')) {
    return 'Risk percentage must be between 0.1% and 5%';
  }
  if (error.path.includes('rubric')) {
    return 'Rubric weights must sum to exactly 1.0';
  }
  return '';
}

function getJSONSuggestion(errorMessage: string): string {
  if (errorMessage.includes('Unexpected token')) {
    return 'Check for missing commas, quotes, or brackets. All strings must use double quotes.';
  }
  if (errorMessage.includes('trailing comma')) {
    return 'Remove trailing commas from arrays and objects.';
  }
  return 'Ensure valid JSON: use double quotes, no trailing commas, proper brackets.';
}

// ============================================================================
// BATCH VALIDATION
// ============================================================================

export function validateAllBlocks(content: string): ValidationResult {
  const errors: ParseError[] = [];
  const warnings: ParseError[] = [];
  
  // Simple regex to find all trading-sim blocks with line numbers
  const blockRegex = /:::trading-sim[^\n]*\n([\s\S]*?):::/g;
  const lines = content.split('\n');
  let match;

  while ((match = blockRegex.exec(content)) !== null) {
    const blockContent = match[1];
    const blockStart = content.substring(0, match.index).split('\n').length;

    // Extract JSON sections
    const jsonSections = extractJSONSections(blockContent);
    
    jsonSections.forEach(({ json, line: relLine }) => {
      const absLine = blockStart + relLine;
      const jsonValidation = validateJSON(json, absLine);
      errors.push(...jsonValidation.errors);
      warnings.push(...jsonValidation.warnings);
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

function extractJSONSections(content: string): Array<{ json: string; line: number }> {
  const sections: Array<{ json: string; line: number }> = [];
  const lines = content.split('\n');
  let inSection = false;
  let currentJSON = '';
  let startLine = 0;

  const jsonSectionStarts = ['[market]', '[risk]', '[dataset]', '[annotations]', '[context]', '[educational_context]', '[rubric]', '[steps]'];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    
    if (jsonSectionStarts.some(start => trimmed.startsWith(start))) {
      if (currentJSON) {
        sections.push({ json: currentJSON.trim(), line: startLine });
      }
      inSection = true;
      currentJSON = '';
      startLine = idx + 1;
    } else if (inSection && (trimmed.startsWith('[') || trimmed === ':::')) {
      sections.push({ json: currentJSON.trim(), line: startLine });
      inSection = false;
      currentJSON = '';
    } else if (inSection) {
      currentJSON += line + '\n';
    }
  });

  if (currentJSON) {
    sections.push({ json: currentJSON.trim(), line: startLine });
  }

  return sections.filter(s => s.json.length > 0);
}
