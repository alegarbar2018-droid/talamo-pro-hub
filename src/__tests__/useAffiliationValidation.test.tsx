import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAffiliationValidation } from '@/hooks/useAffiliationValidation';

// Mock Supabase client
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

describe('useAffiliationValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should handle successful affiliation validation', async () => {
    mockInvoke.mockResolvedValue({
      data: {
        success: true,
        is_affiliated: true,
        uid: 'test-uid-123'
      },
      error: null
    });

    const { result } = renderHook(() => useAffiliationValidation());
    
    const mockOnSuccess = vi.fn();
    const mockOnNotAffiliated = vi.fn();
    const mockOnDemo = vi.fn();

    await act(async () => {
      await result.current.validateAffiliation(
        'test@exness.com',
        mockOnSuccess,
        mockOnNotAffiliated,
        mockOnDemo
      );
    });

    expect(mockInvoke).toHaveBeenCalledWith('secure-affiliation-check', {
      body: { email: 'test@exness.com' }
    });
    expect(mockOnSuccess).toHaveBeenCalledWith('test-uid-123');
    expect(mockOnNotAffiliated).not.toHaveBeenCalled();
  });

  it('should handle not affiliated response', async () => {
    mockInvoke.mockResolvedValue({
      data: {
        success: true,
        is_affiliated: false
      },
      error: null
    });

    const { result } = renderHook(() => useAffiliationValidation());
    
    const mockOnSuccess = vi.fn();
    const mockOnNotAffiliated = vi.fn();
    const mockOnDemo = vi.fn();

    await act(async () => {
      await result.current.validateAffiliation(
        'test@notaffiliated.com',
        mockOnSuccess,
        mockOnNotAffiliated,
        mockOnDemo
      );
    });

    expect(mockOnNotAffiliated).toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('should handle demo mode', async () => {
    mockInvoke.mockResolvedValue({
      data: {
        success: true,
        demo_mode: true,
        is_affiliated: true
      },
      error: null
    });

    const { result } = renderHook(() => useAffiliationValidation());
    
    const mockOnSuccess = vi.fn();
    const mockOnNotAffiliated = vi.fn();
    const mockOnDemo = vi.fn();

    await act(async () => {
      await result.current.validateAffiliation(
        'demo@test.com',
        mockOnSuccess,
        mockOnNotAffiliated,
        mockOnDemo
      );
    });

    expect(mockOnDemo).toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnNotAffiliated).not.toHaveBeenCalled();
  });

  it('should handle existing user', async () => {
    mockInvoke.mockResolvedValue({
      data: {
        success: true,
        user_exists: true
      },
      error: null
    });

    const { result } = renderHook(() => useAffiliationValidation());
    
    const mockOnSuccess = vi.fn();
    const mockOnNotAffiliated = vi.fn();
    const mockOnDemo = vi.fn();
    const mockOnUserExists = vi.fn();

    await act(async () => {
      await result.current.validateAffiliation(
        'existing@user.com',
        mockOnSuccess,
        mockOnNotAffiliated,
        mockOnDemo,
        mockOnUserExists
      );
    });

    expect(mockOnUserExists).toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('should handle rate limiting', async () => {
    vi.useFakeTimers();
    
    mockInvoke.mockResolvedValue({
      data: {
        rate_limited: true,
        retry_after: 60
      },
      error: { status: 429 }
    });

    const { result } = renderHook(() => useAffiliationValidation());
    
    const mockOnSuccess = vi.fn();
    const mockOnNotAffiliated = vi.fn();
    const mockOnDemo = vi.fn();

    await act(async () => {
      await result.current.validateAffiliation(
        'test@example.com',
        mockOnSuccess,
        mockOnNotAffiliated,
        mockOnDemo
      );
    });

    expect(result.current.cooldownSeconds).toBe(60);
    expect(result.current.error).toContain('Demasiadas solicitudes');

    // Test cooldown countdown
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.cooldownSeconds).toBe(59);

    vi.useRealTimers();
  });

  it('should handle service unavailable error', async () => {
    mockInvoke.mockResolvedValue({
      data: null,
      error: { status: 503, message: 'Service unavailable' }
    });

    const { result } = renderHook(() => useAffiliationValidation());
    
    const mockOnSuccess = vi.fn();
    const mockOnNotAffiliated = vi.fn();
    const mockOnDemo = vi.fn();

    await act(async () => {
      await result.current.validateAffiliation(
        'test@example.com',
        mockOnSuccess,
        mockOnNotAffiliated,
        mockOnDemo
      );
    });

    expect(result.current.error).toContain('temporalmente no disponible');
    expect(mockOnNotAffiliated).not.toHaveBeenCalled();
  });

  it('should reset validation state', () => {
    const { result } = renderHook(() => useAffiliationValidation());
    
    // Set some error state
    act(() => {
      result.current.resetValidation();
    });

    expect(result.current.error).toBe('');
    expect(result.current.cooldownSeconds).toBe(0);
  });
});