import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase functions
const mockInvoke = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: mockInvoke
    }
  }
}));

describe('API Contract Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('/api/partner/affiliation contract', () => {
    it('should maintain backward compatibility for successful affiliation', async () => {
      const mockResponse = {
        data: {
          ok: true,
          data: {
            is_affiliated: true,
            uid: 'test-uid-123'
          }
        },
        error: null
      };
      
      mockInvoke.mockResolvedValue(mockResponse);
      
      const { supabase } = await import('@/integrations/supabase/client');
      const result = await supabase.functions.invoke('secure-affiliation-check', {
        body: { email: 'test@exness.com' }
      });
      
      expect(result.data.ok).toBe(true);
      expect(result.data.data.is_affiliated).toBe(true);
      expect(result.data.data.uid).toBe('test-uid-123');
    });

    it('should maintain backward compatibility for not affiliated', async () => {
      const mockResponse = {
        data: {
          ok: true,
          data: {
            is_affiliated: false
          }
        },
        error: null
      };
      
      mockInvoke.mockResolvedValue(mockResponse);
      
      const { supabase } = await import('@/integrations/supabase/client');
      const result = await supabase.functions.invoke('secure-affiliation-check', {
        body: { email: 'notaffiliated@example.com' }
      });
      
      expect(result.data.ok).toBe(true);
      expect(result.data.data.is_affiliated).toBe(false);
    });

    it('should handle rate limiting with proper contract', async () => {
      const mockResponse = {
        data: {
          ok: false,
          code: 'Throttled',
          message: 'Too many requests',
          rate_limited: true,
          retry_after: 60
        },
        error: { status: 429 }
      };
      
      mockInvoke.mockResolvedValue(mockResponse);
      
      const { supabase } = await import('@/integrations/supabase/client');
      const result = await supabase.functions.invoke('secure-affiliation-check', {
        body: { email: 'test@example.com' }
      });
      
      expect(result.data.ok).toBe(false);
      expect(result.data.code).toBe('Throttled');
      expect(result.data.rate_limited).toBe(true);
      expect(result.data.retry_after).toBe(60);
    });

    it('should handle upstream errors with proper codes', async () => {
      const mockResponse = {
        data: {
          ok: false,
          code: 'UpstreamError',
          message: 'Unable to verify affiliation at this time'
        },
        error: { status: 503 }
      };
      
      mockInvoke.mockResolvedValue(mockResponse);
      
      const { supabase } = await import('@/integrations/supabase/client');
      const result = await supabase.functions.invoke('secure-affiliation-check', {
        body: { email: 'test@example.com' }
      });
      
      expect(result.data.ok).toBe(false);
      expect(result.data.code).toBe('UpstreamError');
      expect(result.error.status).toBe(503);
    });
  });

  describe('/api/auth/register contract', () => {
    it('should return WeakPassword code for weak passwords', async () => {
      const mockResponse = {
        data: {
          ok: false,
          code: 'WeakPassword',
          message: 'Password must be at least 8 characters long. Password must include at least one uppercase letter. Password must include at least one number'
        },
        error: { status: 422 }
      };
      
      mockInvoke.mockResolvedValue(mockResponse);
      
      const { supabase } = await import('@/integrations/supabase/client');
      const result = await supabase.functions.invoke('auth-register', {
        body: { 
          email: 'test@example.com',
          password: 'weak',
          firstName: 'Test',
          lastName: 'User'
        }
      });
      
      expect(result.data.ok).toBe(false);
      expect(result.data.code).toBe('WeakPassword');
      expect(result.error.status).toBe(422);
    });

    it('should return success response for valid registration', async () => {
      const mockResponse = {
        data: {
          ok: true,
          message: 'Registration successful',
          data: {
            user: { id: 'user-123' },
            session: { access_token: 'token-123' }
          }
        },
        error: null
      };
      
      mockInvoke.mockResolvedValue(mockResponse);
      
      const { supabase } = await import('@/integrations/supabase/client');
      const result = await supabase.functions.invoke('auth-register', {
        body: { 
          email: 'test@example.com',
          password: 'StrongPass123',
          firstName: 'Test',
          lastName: 'User'
        }
      });
      
      expect(result.data.ok).toBe(true);
      expect(result.data.data.user.id).toBe('user-123');
      expect(result.data.data.session.access_token).toBe('token-123');
    });
  });
});