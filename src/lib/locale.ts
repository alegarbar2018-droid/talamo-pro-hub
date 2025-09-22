/**
 * Locale utilities for number and date formatting
 * Supports ES, EN, PT locales with proper defaults
 */

export interface LocaleFormatOptions {
  locale?: string;
  currency?: string;
  timezone?: string;
}

/**
 * Create a number formatter for the given locale
 */
export const nf = (locale: string = 'es', opts?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat(locale, { 
    maximumFractionDigits: 8,
    ...opts 
  });

/**
 * Create a date formatter for the given locale
 */
export const df = (locale: string = 'es', opts?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
    ...opts
  });

/**
 * Format currency amount with proper locale
 */
export const formatCurrency = (
  amount: number, 
  locale: string = 'es',
  currency: string = 'USD'
): string => {
  return nf(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format percentage with proper locale
 */
export const formatPercentage = (
  value: number,
  locale: string = 'es',
  decimals: number = 2
): string => {
  return nf(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};

/**
 * Get locale-specific date/time format
 */
export const formatDateTime = (
  date: Date,
  locale: string = 'es',
  options?: Intl.DateTimeFormatOptions
): string => {
  return df(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }).format(date);
};