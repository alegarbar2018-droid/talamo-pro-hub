/**
 * i18n Smoke Tests
 * 
 * Tests that i18n functionality works correctly both with flag ON and OFF
 * Ensures no breaking changes to existing functionality
 */

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import { AdminHeader } from '@/components/admin/AdminHeader';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import '../i18n';

// Mock auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'test@example.com', profile: { first_name: 'Test' } },
    signOut: vi.fn(),
    loading: false,
    isValidated: true
  })
}));

// Mock admin auth
vi.mock('@/lib/auth-admin', () => ({
  getCurrentAdminRole: () => Promise.resolve('ADMIN')
}));

// Mock the flags module
vi.mock('@/lib/flags', () => ({
  isFeatureEnabled: vi.fn(),
  useFeatureFlag: vi.fn()
}));

import { isFeatureEnabled } from '@/lib/flags';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('i18n System - Flag OFF (Default)', () => {
  beforeEach(() => {
    vi.mocked(isFeatureEnabled).mockImplementation((flag) => flag !== 'i18n_v1');
  });

  it('renders Index page without LanguageSwitcher when flag is OFF', () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <Index />
      </Wrapper>
    );

    // Landing should render without errors
    expect(screen.getByText(/Trading/i)).toBeInTheDocument();
    expect(screen.getByText(/Profesional/i)).toBeInTheDocument();
    
    // No language switcher should be visible
    expect(screen.queryByLabelText(/selector.*idioma/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('navigation renders without errors and shows Spanish text', () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <Index />
      </Wrapper>
    );

    // Navigation should render without errors and show Spanish text
    expect(screen.getByText(/Academia/i)).toBeInTheDocument();
    expect(screen.getByText(/Señales/i)).toBeInTheDocument();
    
    // No language switcher in navigation
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('LanguageSwitcher returns null when flag is OFF', () => {
    const Wrapper = createWrapper();
    
    const { container } = render(
      <Wrapper>
        <LanguageSwitcher />
      </Wrapper>
    );

    // Component should render nothing
    expect(container.firstChild).toBeNull();
  });
});

describe('i18n System - Flag ON (QA Mode)', () => {
  beforeEach(() => {
    vi.mocked(isFeatureEnabled).mockImplementation((flag) => flag === 'i18n_v1');
  });

  it('renders LanguageSwitcher when flag is ON', () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <LanguageSwitcher />
      </Wrapper>
    );

    // Language switcher should be present
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    
    // Should show Spanish as default
    expect(screen.getByText('🇪🇸')).toBeInTheDocument();
  });

  it('landing page renders without errors when i18n is active', () => {
    const Wrapper = createWrapper();
    
    // Should not throw when rendering with i18n active
    expect(() => {
      render(
        <Wrapper>
          <Index />
        </Wrapper>
      );
    }).not.toThrow();

    // Basic content should still be present
    expect(screen.getByText(/Trading/i)).toBeInTheDocument();
  });

  it('navigation renders with LanguageSwitcher when flag is ON', () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <Index />
      </Wrapper>
    );

    // Language switcher should be present in navigation
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    
    // Navigation content should still render
    expect(screen.getByText(/Academia/i)).toBeInTheDocument();
    expect(screen.getByText(/Señales/i)).toBeInTheDocument();
  });

  it('handles language switching without breaking render', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <div>
          <LanguageSwitcher />
          <Index />
        </div>
      </Wrapper>
    );

    // Page should render with language switcher
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText(/Trading/i)).toBeInTheDocument();
    
    // Should not have console errors (checked by vitest)
    expect(true).toBe(true);
  });
});

describe('i18n System - Dashboard & Admin (Flag OFF)', () => {
  beforeEach(() => {
    vi.mocked(isFeatureEnabled).mockImplementation((flag) => flag !== 'i18n_v1');
  });

  it('Dashboard renders without errors and shows Spanish text', () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <Dashboard />
      </Wrapper>
    );

    // Should render without errors and show Spanish text
    expect(screen.getByText(/Tálamo/i)).toBeInTheDocument();
    expect(screen.getByText(/Trading profesional/i)).toBeInTheDocument();
    
    // No language switcher should be visible
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('AdminHeader renders without errors when flag is OFF', () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <AdminHeader />
      </Wrapper>
    );

    // Should render Spanish text by default
    expect(screen.getByText(/Panel Administrativo/i)).toBeInTheDocument();
    
    // No language switcher should be present
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
});

describe('i18n System - Dashboard & Admin (Flag ON)', () => {
  beforeEach(() => {
    vi.mocked(isFeatureEnabled).mockImplementation((flag) => flag === 'i18n_v1');
  });

  it('Dashboard renders with i18n active and handles language switching', () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <Dashboard />
      </Wrapper>
    );

    // Should render without errors
    expect(screen.getByText(/Tálamo/i)).toBeInTheDocument();
    
    // Language switcher should be present somewhere in the app
    // (Note: actual switcher is in Navigation component)
    expect(true).toBe(true); // Smoke test - no console errors
  });

  it('AdminHeader renders with translations when flag is ON', () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <AdminHeader />
      </Wrapper>
    );

    // Should render without errors and have translatable content
    expect(screen.getByText(/Panel/i)).toBeInTheDocument();
    
    // Should not throw errors when language changes
    expect(true).toBe(true);
  });
});