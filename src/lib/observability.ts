/**
 * Observability and Metrics System
 * 
 * Provides logging, metrics, and monitoring capabilities.
 * All functionality is gated by the 'obs_v1' feature flag.
 */

import { isFeatureEnabled, getActiveFlags } from './flags';

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  method?: string;
  path?: string;
  status?: number;
  duration_ms?: number;
  flag_set?: string[];
  message: string;
  metadata?: Record<string, any>;
}

export interface MetricEntry {
  name: string;
  value: number;
  unit: 'ms' | 'count' | 'bytes';
  tags?: Record<string, string>;
  timestamp: string;
}

/**
 * Safe logger that only operates when observability is enabled
 */
class ObservabilityLogger {
  private enabled: boolean;
  
  constructor() {
    this.enabled = isFeatureEnabled('obs_v1');
  }

  private createLogEntry(
    level: LogEntry['level'], 
    message: string, 
    metadata?: Partial<LogEntry>
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      flag_set: getActiveFlags(),
      ...metadata,
    };
  }

  info(message: string, metadata?: Partial<LogEntry>): void {
    if (!this.enabled) return;
    
    const entry = this.createLogEntry('info', message, metadata);
    console.info('[TALAMO]', entry);
  }

  warn(message: string, metadata?: Partial<LogEntry>): void {
    if (!this.enabled) return;
    
    const entry = this.createLogEntry('warn', message, metadata);
    console.warn('[TALAMO]', entry);
  }

  error(message: string, error?: Error, metadata?: Partial<LogEntry>): void {
    if (!this.enabled) return;
    
    const entry = this.createLogEntry('error', message, {
      ...metadata,
      ...(error && { error_message: error.message, error_stack: error.stack }),
    });
    console.error('[TALAMO]', entry);
  }

  debug(message: string, metadata?: Partial<LogEntry>): void {
    if (!this.enabled || !import.meta.env.DEV) return;
    
    const entry = this.createLogEntry('debug', message, metadata);
    console.debug('[TALAMO]', entry);
  }

  /**
   * Log API request/response cycle
   */
  apiCall(
    method: string,
    path: string,
    status: number,
    duration_ms: number,
    metadata?: Record<string, any>
  ): void {
    const level = status >= 400 ? 'warn' : 'info';
    this[level](`API ${method} ${path}`, {
      method,
      path,
      status,
      duration_ms,
      metadata,
    });
  }

  /**
   * Log performance metric
   */
  metric(name: string, value: number, unit: MetricEntry['unit'], tags?: Record<string, string>): void {
    if (!this.enabled) return;

    const metric: MetricEntry = {
      name,
      value,
      unit,
      tags,
      timestamp: new Date().toISOString(),
    };

    console.info('[TALAMO METRIC]', metric);
  }
}

/**
 * Request/Response middleware for API observability
 */
export function createApiMiddleware() {
  if (!isFeatureEnabled('obs_v1')) {
    // Return pass-through middleware when disabled
    return {
      logRequest: () => {},
      logResponse: () => {},
      logError: () => {},
    };
  }

  return {
    logRequest(method: string, path: string, metadata?: Record<string, any>) {
      logger.debug(`API Request: ${method} ${path}`, { method, path, metadata });
    },

    logResponse(method: string, path: string, status: number, duration_ms: number) {
      logger.apiCall(method, path, status, duration_ms);
    },

    logError(method: string, path: string, error: Error, duration_ms: number) {
      logger.error(`API Error: ${method} ${path}`, error, {
        method,
        path,
        duration_ms,
      });
    },
  };
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private enabled: boolean;
  private measurements: Map<string, number>;

  constructor() {
    this.enabled = isFeatureEnabled('obs_v1');
    this.measurements = new Map();
  }

  /**
   * Start timing an operation
   */
  start(key: string): void {
    if (!this.enabled) return;
    this.measurements.set(key, globalThis.performance.now());
  }

  /**
   * End timing and log the result
   */
  end(key: string, metadata?: Record<string, any>): number {
    if (!this.enabled) return 0;

    const startTime = this.measurements.get(key);
    if (!startTime) return 0;

    const duration = globalThis.performance.now() - startTime;
    this.measurements.delete(key);

    logger.metric(`performance.${key}`, duration, 'ms', metadata as Record<string, string>);
    
    return duration;
  }

  /**
   * Measure and log a function execution time
   */
  async measure<T>(key: string, fn: () => Promise<T>): Promise<T> {
    if (!this.enabled) {
      return await fn();
    }

    this.start(key);
    try {
      const result = await fn();
      this.end(key);
      return result;
    } catch (error) {
      this.end(key);
      throw error;
    }
  }
}

// Global instances
export const logger = new ObservabilityLogger();
export const performanceMonitor = new PerformanceMonitor();
export const apiMiddleware = createApiMiddleware();

/**
 * React hook for component performance monitoring
 */
export function usePerformanceMonitor(componentName: string) {
  if (!isFeatureEnabled('obs_v1')) {
    return {
      startTimer: () => {},
      endTimer: () => {},
    };
  }

  return {
    startTimer: (operation: string) => {
      performanceMonitor.start(`${componentName}.${operation}`);
    },
    
    endTimer: (operation: string) => {
      performanceMonitor.end(`${componentName}.${operation}`);
    },
  };
}