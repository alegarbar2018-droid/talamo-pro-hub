import { render } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Onboarding from '@/pages/Onboarding';

// Mock supabase
const mockInvoke = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: mockInvoke
    }
  }
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams(), vi.fn()]
  };
});

const renderOnboarding = (initialStep = 'choose') => {
  const searchParams = new URLSearchParams();
  if (initialStep !== 'choose') {
    searchParams.set('step', initialStep);
  }
  
  return render(
    <BrowserRouter>
      <Onboarding />
    </BrowserRouter>
  );
};

describe('Onboarding Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows choose step by default', () => {
    renderOnboarding();
    
    expect(screen.getByText('Acceso a Tálamo')).toBeInTheDocument();
    expect(screen.getByText('Ya tengo cuenta en Exness')).toBeInTheDocument();
    expect(screen.getByText('Abrir cuenta en Exness')).toBeInTheDocument();
  });

  it('shows validation form when step is validate', () => {
    renderOnboarding('validate');
    
    expect(screen.getByText('Validar Acceso')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu-email@example.com')).toBeInTheDocument();
    expect(screen.getByText('Validar acceso')).toBeInTheDocument();
  });

  it('processes demo access correctly', async () => {
    renderOnboarding('validate');
    
    const emailInput = screen.getByPlaceholderText('tu-email@example.com');
    const submitButton = screen.getByText('Validar acceso');
    
    fireEvent.change(emailInput, { target: { value: 'demo@talamo.app' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Acceso Demo')).toBeInTheDocument();
      expect(screen.getByText('Modo demo — acceso temporal sin validación por API')).toBeInTheDocument();
    });
    
    // Should not call Supabase for demo emails
    expect(mockInvoke).not.toHaveBeenCalled();
  });

  it('handles successful affiliation validation', async () => {
    // Mock successful response
    mockInvoke.mockResolvedValue({
      data: { affiliation: true, client_uid: 'UID123' },
      error: null
    });
    
    renderOnboarding('validate');
    
    const emailInput = screen.getByPlaceholderText('tu-email@example.com');
    const submitButton = screen.getByText('Validar acceso');
    
    fireEvent.change(emailInput, { target: { value: 'garciacosme1030@yahoo.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Acceso Verificado')).toBeInTheDocument();
      expect(screen.getByText('Tu cuenta está afiliada correctamente')).toBeInTheDocument();
    });
    
    expect(mockInvoke).toHaveBeenCalledWith('validate-affiliation', {
      body: { email: 'garciacosme1030@yahoo.com' }
    });
  });

  it('handles blocked affiliation', async () => {
    // Mock blocked response
    mockInvoke.mockResolvedValue({
      data: { affiliation: false },
      error: null
    });
    
    renderOnboarding('validate');
    
    const emailInput = screen.getByPlaceholderText('tu-email@example.com');
    const submitButton = screen.getByText('Validar acceso');
    
    fireEvent.change(emailInput, { target: { value: 'alegarbar@hotmail.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Cuenta no afiliada')).toBeInTheDocument();
      expect(screen.getByText('Abrir cuenta con nuestro enlace')).toBeInTheDocument();
      expect(screen.getByText('Solicitar cambio de partner')).toBeInTheDocument();
    });
  });

  it('handles API errors correctly', async () => {
    // Mock 401 error
    mockInvoke.mockRejectedValue({ status: 401 });
    
    renderOnboarding('validate');
    
    const emailInput = screen.getByPlaceholderText('tu-email@example.com');
    const submitButton = screen.getByText('Validar acceso');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('No autenticado (401)')).toBeInTheDocument();
    });
  });

  it('requires minimum password length', () => {
    renderOnboarding('eligible');
    
    const passwordInput = screen.getByPlaceholderText('Mínimo 6 caracteres');
    const submitButton = screen.getByText('Acceder a mi panel');
    
    fireEvent.change(passwordInput, { target: { value: '123' } });
    
    expect(submitButton).toBeDisabled();
    
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    
    expect(submitButton).not.toBeDisabled();
  });

  it('navigates to correct external links', () => {
    const mockOpen = vi.fn();
    window.open = mockOpen;
    
    renderOnboarding('choose');
    
    const createAccountButton = screen.getByText('Abrir cuenta en Exness');
    fireEvent.click(createAccountButton);
    
    expect(mockOpen).toHaveBeenCalledWith(
      'https://one.exnesstrack.org/boarding/sign-up/303589/a/nvle22j1te?lng=es',
      '_blank'
    );
  });
});