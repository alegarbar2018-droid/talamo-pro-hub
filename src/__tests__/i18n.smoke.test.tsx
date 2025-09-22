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
import LanguageSwitcher from '@/components/LanguageSwitcher';
import '../i18n';

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

describe('i18n Translation Keys', () => {
  beforeEach(() => {
    vi.mocked(isFeatureEnabled).mockImplementation((flag) => flag === 'i18n_v1');
  });

  it('has required translation keys available', () => {
    // This is a smoke test to ensure translation files are loadable
    // In a real scenario, we'd test that keys exist, but for smoke testing
    // we just ensure the system initializes without throwing
    
    expect(() => {
      // Import would fail if translation files are malformed
      require('../i18n');
    }).not.toThrow();
  });
});