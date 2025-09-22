/**
 * Feature Flags System for Talamo Pro Hub
 * 
 * All new features must be guarded by flags and OFF by default.
 * This ensures backwards compatibility and safe rollouts.
 */

export type TalamoFlag = 
  | 'academy_v1'      // Academia module
  | 'signals_v1'      // Trading signals module  
  | 'copy_v1'         // Copy trading module
  | 'rbac_v1'         // Advanced RBAC system
  | 'obs_v1'          // Observability and metrics
  | 'api_v1'          // New versioned APIs
  | 'i18n_v1'         // Internationalization system

/**
 * Parse feature flags from environment variable
 * Format: "flag1,flag2,flag3" or empty string
 */
function parseFlags(): Set<TalamoFlag> {
  const flagsEnv = import.meta.env.VITE_TALAMO_FLAGS || '';
  
  if (!flagsEnv.trim()) {
    return new Set();
  }
  
  const flags = flagsEnv
    .split(',')
    .map(f => f.trim() as TalamoFlag)
    .filter(f => isValidFlag(f));
    
  return new Set(flags);
}

/**
 * Validate if a flag name is valid
 */
function isValidFlag(flag: string): flag is TalamoFlag {
  const validFlags: TalamoFlag[] = [
    'academy_v1',
    'signals_v1', 
    'copy_v1',
    'rbac_v1',
    'obs_v1',
    'api_v1',
    'i18n_v1'
  ];
  
  return validFlags.includes(flag as TalamoFlag);
}

// Global flags cache - parsed once at startup
const ACTIVE_FLAGS = parseFlags();

/**
 * Check if a feature flag is enabled
 */
export function isFeatureEnabled(flag: TalamoFlag): boolean {
  return ACTIVE_FLAGS.has(flag);
}

/**
 * Get all active flags (for debugging/observability)
 */
export function getActiveFlags(): TalamoFlag[] {
  return Array.from(ACTIVE_FLAGS);
}

/**
 * Development helper - log active flags to console
 */
export function debugFlags(): void {
  if (import.meta.env.DEV) {
    const flags = getActiveFlags();
    if (flags.length > 0) {
      console.info('[TALAMO FLAGS]', flags);
    } else {
      console.info('[TALAMO FLAGS] No flags active - production mode');
    }
  }
}

/**
 * React hook for feature flags (memo for performance)
 */
export function useFeatureFlag(flag: TalamoFlag): boolean {
  // Since flags are parsed at startup and don't change during runtime,
  // we can safely return the cached value without re-rendering concerns
  return isFeatureEnabled(flag);
}

// Initialize flags logging in dev mode
if (import.meta.env.DEV) {
  debugFlags();
}