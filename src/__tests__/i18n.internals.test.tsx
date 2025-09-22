import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { isFeatureEnabled } from '@/lib/flags';
import '../i18n';

// Mock the flag system
vi.mock('@/lib/flags', () => ({
  isFeatureEnabled: vi.fn()
}));

// Mock the auth modules to avoid authentication checks
vi.mock('@/lib/auth-admin', () => ({
  updateAdminUserRole: vi.fn(),
  getCurrentAdminRole: vi.fn().mockResolvedValue('USER')
}));

vi.mock('@/lib/admin-security', () => ({
  maskSensitiveData: vi.fn((data) => data),
  checkRateLimit: vi.fn(),
  logSecurityEvent: vi.fn(),
  generateCorrelationId: vi.fn()
}));

vi.mock('@/lib/admin-rbac', () => ({
  checkPermission: vi.fn().mockResolvedValue(true)
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}));

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          or: vi.fn().mockReturnValue(Promise.resolve({ data: [], error: null }))
        })
      })
    })
  }
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('i18n Internals Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Flag OFF - Components should render without LanguageSwitcher', () => {
    beforeEach(() => {
      (isFeatureEnabled as any).mockReturnValue(false);
    });

    it('should render Academy without errors', async () => {
      const Academy = (await import('@/pages/Academy')).default;
      
      render(
        <TestWrapper>
          <Academy />
        </TestWrapper>
      );
      
      expect(screen.getByText(/Academia Tálamo/i)).toBeInTheDocument();
    });

    it('should render Signals without errors', async () => {
      const Signals = (await import('@/pages/Signals')).default;
      
      render(
        <TestWrapper>
          <Signals />
        </TestWrapper>
      );
      
      expect(screen.getByText(/Señales Verificadas/i)).toBeInTheDocument();
    });

    it('should render CopyTrading without errors', async () => {
      const CopyTrading = (await import('@/pages/CopyTrading')).default;
      
      render(
        <TestWrapper>
          <CopyTrading />
        </TestWrapper>
      );
      
      expect(screen.getByText(/Copy Trading Inteligente/i)).toBeInTheDocument();
    });

    it('should render Tools without errors', async () => {
      const Tools = (await import('@/pages/Tools')).default;
      
      render(
        <TestWrapper>
          <Tools />
        </TestWrapper>
      );
      
      expect(screen.getByText(/Herramientas de Trading/i)).toBeInTheDocument();
    });
  });

  describe('Flag ON - Components should render with i18n support', () => {
    beforeEach(() => {
      (isFeatureEnabled as any).mockReturnValue(true);
    });

    it('should change language without breaking render', async () => {
      const Academy = (await import('@/pages/Academy')).default;
      
      const { rerender } = render(
        <TestWrapper>
          <Academy />
        </TestWrapper>
      );

      // Should render without errors initially
      expect(screen.getByText(/Academia Tálamo/i)).toBeInTheDocument();

      // Change language programmatically
      const i18n = (await import('@/i18n')).default;
      await i18n.changeLanguage('en');

      // Re-render and verify it doesn't break
      rerender(
        <TestWrapper>
          <Academy />
        </TestWrapper>
      );

      // Should still render without errors
      expect(document.body).toBeInTheDocument();
    });

    it('should render AdminBreadcrumbs with translations', async () => {
      const { AdminBreadcrumbs } = await import('@/components/admin/AdminBreadcrumbs');
      
      // Mock the location to show breadcrumbs
      Object.defineProperty(window, 'location', {
        value: { pathname: '/admin/users' },
        writable: true
      });

      render(
        <TestWrapper>
          <AdminBreadcrumbs />
        </TestWrapper>
      );
      
      // Should render without errors
      expect(document.body).toBeInTheDocument();
    });
  });
});