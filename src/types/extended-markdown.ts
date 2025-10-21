/**
 * Tálamo Extended Markdown Syntax v1.1
 * Type definitions for interactive learning components
 */

// ============================================================================
// META BLOCK
// ============================================================================

export type LessonLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LessonMeta {
  level?: LessonLevel;
  duration?: string; // e.g., "12min", "45min"
  tags?: string[];
  id?: string;
}

// ============================================================================
// TRADING SIMULATOR v1 (Legacy)
// ============================================================================

export interface TradingScenarioDataV1 {
  historical: number[];
  current: number;
  future: number[];
  correct_action: 'buy' | 'sell' | 'skip';
  entry?: number;
  stop_loss?: number;
  take_profit?: number;
}

export interface EducationalContext {
  concept: string;
  whatToLook: string[];
  hint: string;
}

export interface ChartAnnotation {
  type: 'support' | 'resistance' | 'hh' | 'hl' | 'lh' | 'll';
  price: number;
  label?: string;
}

export interface TradingSimulatorPropsV1 {
  asset: string;
  scenario: string;
  question: string;
  scenarioData: TradingScenarioDataV1;
  feedbackBuy: string;
  feedbackSell: string;
  feedbackSkip: string;
  educationalContext?: EducationalContext;
  annotations?: ChartAnnotation[];
}

// ============================================================================
// TRADING SIMULATOR v2 (Enhanced)
// ============================================================================

export type ChartType = 'candles' | 'line';
export type Timeframe = 'M1' | 'M5' | 'M15' | 'M30' | 'H1' | 'H4' | 'D1' | 'W1';
export type RevealStrategy = 'after_decision' | 'progressive' | 'immediate';
export type TradeAction = 'market_buy' | 'market_sell' | 'limit_buy' | 'limit_sell' | 'skip' | 'identify_trend' | 'plan_buy' | 'plan_sell';

export interface MarketParams {
  spread: number;
  slippage?: number;
  commission_per_lot?: number;
  pip_size?: number;
}

export interface RiskParams {
  initial_balance: number;
  risk_pct: number; // max 5%
  min_rr: number; // minimum risk:reward ratio
}

export interface OHLCCandle {
  timestamp: string; // ISO 8601
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface Dataset {
  ohlc: [string, number, number, number, number, number?][]; // [timestamp, O, H, L, C, V?]
}

export interface AnnotationsV2 {
  higherHighs?: number[]; // indices
  higherLows?: number[];
  lowerHighs?: number[];
  lowerLows?: number[];
  supportZones?: number[]; // price levels
  resistanceZones?: number[];
  trendLines?: Array<{ start: number; end: number; price1: number; price2: number }>;
  patternBoxes?: Array<{ start: number; end: number; label: string }>;
}

export interface Hint {
  id: string;
  text: string;
  revealed?: boolean;
}

export interface Rubric {
  trend_alignment?: number;
  rr_meets_min?: number;
  structure_based_sl?: number;
  entry_location_quality?: number;
  [key: string]: number | undefined;
}

export interface SimulationStep {
  id: string;
  slice: { start?: number; end: number };
  question: string;
  correct_action: TradeAction;
  hints?: string[];
  feedback?: Record<string, string>;
}

export interface ActionsConfig {
  allowed: TradeAction[];
  default?: TradeAction;
}

export interface TradingSimulatorPropsV2 {
  // Core attributes
  asset: string;
  scenario: string;
  v?: '2';
  chart?: ChartType;
  timeframe?: Timeframe;
  reveal_future?: RevealStrategy;
  currency?: string;

  // Sections
  market?: MarketParams;
  risk?: RiskParams;
  dataset?: Dataset;
  annotations?: AnnotationsV2;
  context?: EducationalContext; // alias for educational_context
  question: string;
  hints?: string[] | Hint[];
  rubric?: Rubric;
  steps?: SimulationStep[];
  actions?: ActionsConfig;

  // Feedback
  feedback_general?: string;
  feedback_buy?: string;
  feedback_sell?: string;
  feedback_skip?: string;
  feedback?: Record<TradeAction, string>; // flexible feedback map

  // Legacy support (v1)
  scenarioData?: TradingScenarioDataV1;
  educationalContext?: EducationalContext;
  feedbackBuy?: string;
  feedbackSell?: string;
  feedbackSkip?: string;
}

// ============================================================================
// OTHER INTERACTIVE BLOCKS
// ============================================================================

export interface AccordionItem {
  title: string;
  content: string;
}

export interface TabItem {
  label: string;
  content: string;
}

export interface FlipCardProps {
  front: string;
  back: string;
}

export type CalloutType = 'info' | 'warning' | 'success' | 'danger' | 'tip';

export interface CalloutProps {
  type: CalloutType;
  content: string;
}

// Step content for progressive lessons
export interface StepContent {
  id: string;
  title: string;
  content: string;
  index: number;
}

// ============================================================================
// BLOCK TYPES
// ============================================================================

export type BlockType = 
  | 'meta'
  | 'step'
  | 'accordion'
  | 'tabs'
  | 'flipcard'
  | 'callout'
  | 'trading-sim'
  | 'tip'
  | 'warning'
  | 'danger'
  | 'success';

export interface ParsedBlock {
  type: BlockType;
  content: string;
  attributes?: Record<string, string>;
  props?: any;
  raw?: string;
  line?: number;
}

export interface ParseError {
  line: number;
  block: BlockType;
  field?: string;
  message: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}

export interface ParseResult {
  blocks: ParsedBlock[];
  errors: ParseError[];
  meta?: LessonMeta;
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: ParseError[];
  warnings: ParseError[];
}

// Whitelisted trading assets
export const ALLOWED_ASSETS = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
  'XAUUSD', 'XAGUSD', 'BTCUSD', 'ETHUSD',
  'US30', 'US100', 'US500', 'DE40', 'UK100'
] as const;

export type AllowedAsset = typeof ALLOWED_ASSETS[number];
