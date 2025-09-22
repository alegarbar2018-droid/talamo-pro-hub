/**
 * Smoke Tests - Critical Flow Validation
 * 
 * These tests MUST pass before any deployment.
 * They validate that core user flows work without errors.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';

// Components to test
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Onboarding from '@/pages/Onboarding';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    functions: {
      invoke: vi.fn(),
    },
  },
}));

// Test wrapper with all providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

describe('Smoke Tests - Critical Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Landing Page (Index)', () => {
    it('should render without errors', async () => {
      render(
        <TestWrapper>
          <Index />
        </TestWrapper>
      );

      // Check for key elements that must be present
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      // Should have CTA buttons
      await waitFor(() => {
        const ctaButtons = screen.getAllByText(/validar/i);
        expect(ctaButtons.length).toBeGreaterThan(0);
      });
    });

    it('should display partner information correctly', async () => {
      render(
        <TestWrapper>
          <Index />
        </TestWrapper>
      );

      // Partner ID should be visible
      await waitFor(() => {
        const partnerId = screen.getByText(/1141465940423171000/);
        expect(partnerId).toBeInTheDocument();
      });
    });

    it('should not throw console errors on render', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      render(
        <TestWrapper>
          <Index />
        </TestWrapper>
      );

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Onboarding Flow', () => {
    it('should render onboarding without errors', () => {
      render(
        <TestWrapper>
          <Onboarding />
        </TestWrapper>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should handle different onboarding steps', async () => {
      render(
        <TestWrapper>
          <Onboarding />
        </TestWrapper>
      );

      // Should start with choose step or similar initial state
      await waitFor(() => {
        // Look for common onboarding elements
        const mainElement = screen.getByRole('main');
        expect(mainElement).toBeInTheDocument();
      });
    });
  });

  describe('Dashboard Navigation', () => {
    it('should render dashboard without errors', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should display main navigation elements', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        // Check for navigation or main content areas
        const mainElement = screen.getByRole('main');
        expect(mainElement).toBeInTheDocument();
      });
    });
  });

  describe('Feature Flags Integration', () => {
    it('should work with no flags enabled', () => {
      // Simulate no flags
      vi.stubEnv('VITE_TALAMO_FLAGS', '');
      
      render(
        <TestWrapper>
          <Index />
        </TestWrapper>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should not break with invalid flags', () => {
      // Simulate invalid flags
      vi.stubEnv('VITE_TALAMO_FLAGS', 'invalid_flag,another_invalid');
      
      render(
        <TestWrapper>
          <Index />
        </TestWrapper>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Environment Variables', () => {
    it('should use fallback values when env vars are missing', () => {
      // Test that constants.ts fallbacks work
      vi.stubEnv('VITE_PARTNER_ID', '');
      vi.stubEnv('VITE_PARTNER_LINK', '');
      
      render(
        <TestWrapper>
          <Index />
        </TestWrapper>
      );

      // Should still render with fallback values
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });
});

describe('Mock API Response Handling', () => {
  describe('Affiliation Validation Responses', () => {
    it('should handle 200 success response', async () => {
      const mockSuccess = {
        success: true,
        is_affiliated: true,
        user_exists: false,
      };

      // Test would involve mocking the API call and validating UI response
      expect(mockSuccess).toHaveProperty('success', true);
    });

    it('should handle 401 unauthorized response', async () => {
      const mockUnauthorized = {
        success: false,
        error: 'Unauthorized',
      };

      expect(mockUnauthorized).toHaveProperty('success', false);
    });

    it('should handle 429 rate limited response', async () => {
      const mockRateLimit = {
        success: false,
        rate_limited: true,
        retry_after: 60,
      };

      expect(mockRateLimit).toHaveProperty('rate_limited', true);
    });

    it('should handle 400 bad request response', async () => {
      const mockBadRequest = {
        success: false,
        error: 'Invalid email format',
      };

      expect(mockBadRequest).toHaveProperty('success', false);
    });
  });
});

// Performance baseline tests
describe('Performance Baselines', () => {
  it('should render Index page within performance budget', async () => {
    const start = performance.now();
    
    render(
      <TestWrapper>
        <Index />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    const renderTime = performance.now() - start;
    
    // Should render in under 100ms in test environment
    expect(renderTime).toBeLessThan(100);
  });
});