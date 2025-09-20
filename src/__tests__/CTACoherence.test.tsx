import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Index from '@/pages/Index';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

const renderIndex = () => {
  return render(
    <BrowserRouter>
      <Index />
    </BrowserRouter>
  );
};

describe('CTA Coherence Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('header CTA navigates to onboarding choose step', () => {
    renderIndex();
    
    const headerCTA = screen.getByTestId('cta-solicitar-acceso-header') || 
                     screen.getByText('Solicitar acceso');
    
    fireEvent.click(headerCTA);
    
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding?step=choose');
  });

  it('hero main CTA opens Exness account creation', () => {
    const mockOpen = vi.fn();
    window.open = mockOpen;
    
    renderIndex();
    
    const heroMainCTA = screen.getByText('Abrir cuenta en Exness');
    
    fireEvent.click(heroMainCTA);
    
    expect(mockOpen).toHaveBeenCalledWith(
      'https://one.exnesstrack.org/boarding/sign-up/303589/a/nvle22j1te?lng=es',
      '_blank'
    );
  });

  it('hero secondary CTA navigates to validation step', () => {
    renderIndex();
    
    const heroSecondaryCTA = screen.getByText('Ya tengo cuenta en Exness');
    
    fireEvent.click(heroSecondaryCTA);
    
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding?step=validate');
  });

  it('business model CTA navigates to validation step', () => {
    renderIndex();
    
    const modelCTA = screen.getByTestId('cta-validar-acceso-modelo') ||
                     screen.getByText('Validar acceso');
    
    fireEvent.click(modelCTA);
    
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding?step=validate');
  });

  it('final section CTA navigates to onboarding choose step', () => {
    renderIndex();
    
    const finalCTA = screen.getByTestId('cta-solicitar-acceso-final') ||
                     screen.getAllByText('Solicitar acceso').find(el => 
                       el.closest('section')?.className.includes('bg-gradient-primary')
                     );
    
    fireEvent.click(finalCTA);
    
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding?step=choose');
  });

  it('premium language is used throughout', () => {
    renderIndex();
    
    // Check that premium language is used
    expect(screen.getByText('Solicitar acceso')).toBeInTheDocument();
    expect(screen.getByText('Abrir cuenta en Exness')).toBeInTheDocument();
    expect(screen.getByText('Ya tengo cuenta en Exness')).toBeInTheDocument();
    expect(screen.getByText('Validar acceso')).toBeInTheDocument();
    
    // Check that "gratis" is avoided in CTAs (but can appear in long text)
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button.textContent).not.toMatch(/gratis/i);
    });
  });

  it('business model section uses premium language', () => {
    renderIndex();
    
    expect(screen.getByText('¿Por qué el acceso sin membresía?')).toBeInTheDocument();
    
    // Long text can mention "gratis" but not CTAs
    const longText = screen.getByText(/nuestro modelo es simple y transparente/i);
    expect(longText).toBeInTheDocument();
  });
});