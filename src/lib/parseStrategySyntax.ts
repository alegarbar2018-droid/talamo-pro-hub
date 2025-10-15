import { z } from 'zod';
import type { CopyStrategy, AccountType, BillingPeriod, RiskBand, CumulativeReturnPoint } from '@/modules/copy/types';

// Schema de validación
const strategySyntaxSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  photo_url: z.string().url().optional(),
  account_type: z.enum(['Social Standard', 'Pro']),
  strategy_equity: z.number().positive(),
  min_investment: z.number().min(10),
  performance_fee_pct: z.number().min(0).max(100),
  leverage: z.number().positive(),
  billing_period: z.enum(['Weekly', 'Monthly', 'Quarterly']),
  symbols: z.array(z.string()).min(1),
  external_link: z.string().url(),
  risk_band: z.enum(['Conservador', 'Moderado', 'Agresivo']).optional(),
  profit_factor: z.number().optional(),
  max_drawdown: z.number().optional(),
  win_rate: z.number().optional(),
  cagr: z.number().optional(),
  total_trades: z.number().int().optional(),
  cumulative_return_series: z.array(z.object({
    date: z.string(),
    value: z.number()
  })).optional()
});

/**
 * Genera slug desde nombre
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Agrega parámetros UTM al link externo
 */
function addUTMParams(url: string): string {
  const utmParams = new URLSearchParams({
    utm_source: 'talamo',
    utm_medium: 'copy',
    utm_campaign: 'dir'
  });
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${utmParams.toString()}`;
}

/**
 * Calcula risk_band basado en max_drawdown y leverage
 */
function calculateRiskBand(maxDrawdown?: number, leverage?: number): RiskBand | undefined {
  if (!maxDrawdown) return undefined;
  
  // Reglas simples basadas en DD
  if (maxDrawdown < 15) return 'Conservador';
  if (maxDrawdown < 25) return 'Moderado';
  return 'Agresivo';
}

/**
 * Parsea YAML simple (formato clave: valor)
 */
function parseYAML(content: string): Record<string, any> {
  const result: Record<string, any> = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = trimmed.substring(0, colonIndex).trim();
    let value: any = trimmed.substring(colonIndex + 1).trim();
    
    // Parse arrays (formato: [item1, item2])
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayValue = value.substring(1, value.length - 1)
        .split(',')
        .map((v: string) => v.trim().replace(/['"]/g, ''));
      result[key] = arrayValue;
    }
    // Parse numbers
    else if (!isNaN(Number(value)) && value !== '') {
      result[key] = Number(value);
    }
    // Parse booleans
    else if (value === 'true' || value === 'false') {
      result[key] = value === 'true';
    }
    // Remove quotes from strings
    else {
      result[key] = value.replace(/^["']|["']$/g, '');
    }
  }
  
  return result;
}

/**
 * Parsea Markdown (busca bloques de código YAML o listas)
 */
function parseMarkdown(content: string): Record<string, any> {
  // Buscar bloque de código YAML
  const yamlMatch = content.match(/```(?:yaml|yml)\s*\n([\s\S]*?)\n```/);
  if (yamlMatch) {
    return parseYAML(yamlMatch[1]);
  }
  
  // Si no hay bloque YAML, intentar parsear como YAML directamente
  return parseYAML(content);
}

/**
 * Parsea Syntax Guide y retorna objeto Strategy validado
 */
export function parseStrategySyntaxGuide(
  input: string,
  format: 'yaml' | 'markdown'
): Partial<CopyStrategy> {
  // Parse según formato
  const rawData = format === 'yaml' ? parseYAML(input) : parseMarkdown(input);
  
  // Mapear claves snake_case a camelCase si es necesario
  const normalized = {
    name: rawData.name,
    description: rawData.description,
    photo_url: rawData.photo_url || rawData.photoUrl,
    account_type: rawData.account_type || rawData.accountType,
    strategy_equity: rawData.strategy_equity || rawData.strategyEquity,
    min_investment: rawData.min_investment || rawData.minInvestment,
    performance_fee_pct: rawData.performance_fee_pct || rawData.performanceFeePct,
    leverage: rawData.leverage,
    billing_period: rawData.billing_period || rawData.billingPeriod,
    symbols: rawData.symbols,
    external_link: rawData.external_link || rawData.externalLink,
    risk_band: rawData.risk_band || rawData.riskBand,
    profit_factor: rawData.profit_factor || rawData.profitFactor,
    max_drawdown: rawData.max_drawdown || rawData.maxDrawdown,
    win_rate: rawData.win_rate || rawData.winRate,
    cagr: rawData.cagr,
    total_trades: rawData.total_trades || rawData.totalTrades,
    cumulative_return_series: rawData.cumulative_return_series || rawData.cumulativeReturnSeries
  };
  
  // Validar con schema
  const validated = strategySyntaxSchema.parse(normalized);
  
  // Generar slug
  const slug = generateSlug(validated.name);
  
  // Agregar UTM a external_link
  const externalLinkWithUTM = addUTMParams(validated.external_link);
  
  // Calcular risk_band si no existe
  const riskBand = validated.risk_band || calculateRiskBand(validated.max_drawdown, validated.leverage);
  
  // Sanitizar descripción (remover HTML peligroso)
  const cleanDescription = validated.description
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .trim();
  
  return {
    slug,
    name: validated.name,
    description: cleanDescription,
    photo_url: validated.photo_url,
    account_type: validated.account_type as AccountType,
    strategy_equity: validated.strategy_equity,
    min_investment: validated.min_investment,
    performance_fee_pct: validated.performance_fee_pct,
    leverage: validated.leverage,
    billing_period: validated.billing_period as BillingPeriod,
    symbols: validated.symbols,
    external_link: externalLinkWithUTM,
    risk_band: riskBand,
    profit_factor: validated.profit_factor,
    max_drawdown: validated.max_drawdown,
    win_rate: validated.win_rate,
    cagr: validated.cagr,
    total_trades: validated.total_trades,
    cumulative_return_series: validated.cumulative_return_series as CumulativeReturnPoint[] | undefined,
    status: 'draft' // Siempre draft al importar
  };
}

/**
 * Valida que una URL sea del bucket permitido
 */
export function validateAvatarURL(url: string): boolean {
  if (!url) return true; // opcional
  
  // Debe ser del bucket copy-trading-avatars
  const bucketPattern = /copy-trading-avatars/;
  return bucketPattern.test(url);
}
