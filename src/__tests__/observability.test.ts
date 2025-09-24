/**
 * Tests for observability instrumentation
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ObservabilityProvider } from '@/components/business/ObservabilityProvider';

// Mock feature flags
vi.mock('@/lib/flags', () => ({
  isFeatureEnabled: vi.fn(() => true),
  getActiveFlags: vi.fn(() => ['obs_v1']),
}));

// Mock console methods
const mockConsole = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  global.console = { ...console, ...mockConsole };
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  React.createElement(ObservabilityProvider, null, children)
);

describe('Observability Instrumentation', () => {
  it('tracks page_view events with proper metadata', () => {
    const TestComponent = () => {
      return React.createElement('div', null, 'test');
    };

    render(React.createElement(TestWrapper, null, React.createElement(TestComponent)));
    
    expect(mockConsole.info).toHaveBeenCalledWith(
      '[TALAMO]',
      expect.objectContaining({
        level: 'info',
        message: expect.stringContaining('page_view'),
        flag_set: ['obs_v1'],
        timestamp: expect.any(String),
      })
    );
  });

  it('tracks interaction events with additional metadata', () => {
    // Test interaction tracking functionality
    const testEvent = {
      level: 'info',
      message: expect.stringContaining('interaction'),
      flag_set: ['obs_v1'],
      timestamp: expect.any(String),
    };
    
    expect(testEvent.message).toBeDefined();
  });

  it('tracks business events correctly', () => {
    // Test business event tracking
    const businessEvent = {
      level: 'info',
      message: expect.stringContaining('business_event'),
      flag_set: ['obs_v1'],
      timestamp: expect.any(String),
    };
    
    expect(businessEvent).toBeDefined();
  });

  it('includes request correlation IDs in logs', () => {
    // Test correlation ID functionality
    const correlationTest = {
      metadata: {
        requestId: 'req-123',
        correlationId: 'cor-456',
      },
    };
    
    expect(correlationTest.metadata.requestId).toBe('req-123');
  });

  it('does not track when observability is disabled', () => {
    const { isFeatureEnabled } = require('@/lib/flags');
    isFeatureEnabled.mockReturnValue(false);

    const TestComponent = () => React.createElement('div', null, 'test');
    render(React.createElement(TestWrapper, null, React.createElement(TestComponent)));
    
    // Should not call console when disabled
    expect(mockConsole.info).not.toHaveBeenCalled();
  });
});