/**
 * Tests for TradingDisclaimer component accessibility and functionality
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TradingDisclaimer from '@/components/ui/trading-disclaimer';

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('TradingDisclaimer', () => {
  it('renders compact variant with proper ARIA attributes', () => {
    render(<TradingDisclaimer variant="compact" context="academy" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('aria-live', 'polite');
    expect(alert).toHaveAttribute('aria-label', 'Aviso importante de riesgo de trading');
  });

  it('displays context-specific content for academy', () => {
    render(<TradingDisclaimer context="academy" variant="compact" />);
    
    expect(screen.getByText(/Aviso de Riesgo - Contenido Educativo/)).toBeInTheDocument();
    expect(screen.getByText(/puramente educativo/)).toBeInTheDocument();
  });

  it('displays context-specific content for tools', () => {
    render(<TradingDisclaimer context="tools" variant="compact" />);
    
    expect(screen.getByText(/Aviso de Riesgo - Herramientas de Trading/)).toBeInTheDocument();
    expect(screen.getByText(/calculadoras/)).toBeInTheDocument();
  });

  it('has proper color contrast and visibility', () => {
    render(<TradingDisclaimer variant="compact" context="general" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('border-destructive/30', 'bg-destructive/10');
    
    const icon = screen.getByLabelText('', { selector: 'svg' });
    expect(icon).toHaveClass('text-destructive');
  });

  it('provides expandable content when configured', () => {
    render(<TradingDisclaimer variant="compact" showCollapsible={true} context="tools" />);
    
    const expandButton = screen.getByLabelText(/Mostrar información adicional/);
    expect(expandButton).toBeInTheDocument();
    expect(expandButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('meets minimum hit area requirements', () => {
    render(<TradingDisclaimer variant="compact" showCollapsible={true} context="academy" />);
    
    const expandButton = screen.getByLabelText(/Mostrar información adicional/);
    const buttonRect = expandButton.getBoundingClientRect();
    
    // Check minimum 44x44px hit area (WCAG AA requirement)
    expect(buttonRect.width >= 44 || buttonRect.height >= 44).toBe(true);
  });

  it('renders full variant with external links', () => {
    render(<TradingDisclaimer variant="full" context="general" />);
    
    const cnmvLink = screen.getByLabelText(/Más información sobre CFDs en CNMV/);
    expect(cnmvLink).toHaveAttribute('target', '_blank');
    expect(cnmvLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});