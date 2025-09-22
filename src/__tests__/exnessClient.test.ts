import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock environment variables
const mockEnv = {
  PARTNER_API_BASE: 'https://api.test.com',
  PARTNER_API_USER: 'test@user.com',
  PARTNER_API_PASSWORD: 'testpassword',
  EXNESS_PARTNER_ID: '1141465940423171000'
};

// Mock Deno.env for testing
vi.stubGlobal('Deno', {
  env: {
    get: (key: string) => mockEnv[key as keyof typeof mockEnv]
  }
});

// Import after mocking
import { getExnessClient } from '@/server/exnessClient';

describe('ExnessClient', () => {
  let client: ReturnType<typeof getExnessClient>;

  beforeEach(() => {
    vi.clearAllMocks();
    client = getExnessClient();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Authentication', () => {
    it('should handle successful login', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ token: 'test-token-123', expires_in: 3600 })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ 
            affiliation: true, 
            client_uid: 'test-uid', 
            accounts: ['123', '456'] 
          })
        });

      const result = await client.checkAffiliationByEmail('test@exness.com');

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result.isAffiliated).toBe(true);
      expect(result.clientUid).toBe('test-uid');
    });

    it('should handle login timeout', async () => {
      vi.useFakeTimers();
      
      // Mock a slow response
      mockFetch.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ token: 'test-token' })
        }), 15000))
      );

      const resultPromise = client.checkAffiliationByEmail('test@exness.com');
      
      // Advance time to trigger timeout
      vi.advanceTimersByTime(11000);
      
      const result = await resultPromise;
      
      expect(result.error).toContain('timeout');
      expect(result.isAffiliated).toBe(false);
      
      vi.useRealTimers();
    });
  });

  describe('Affiliation Check', () => {
    beforeEach(() => {
      // Mock successful login
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ token: 'test-token-123' })
      });
    });

    it('should handle successful affiliation check', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 
          affiliation: true, 
          client_uid: 'test-uid-123', 
          accounts: ['12345', '67890'] 
        })
      });

      const result = await client.checkAffiliationByEmail('affiliated@exness.com');

      expect(result.isAffiliated).toBe(true);
      expect(result.partnerIdMatch).toBe(true);
      expect(result.clientUid).toBe('test-uid-123');
      expect(result.accounts).toEqual(['12345', '67890']);
      expect(result.partnerId).toBe('1141465940423171000');
    });

    it('should handle not affiliated user', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ affiliation: false })
      });

      const result = await client.checkAffiliationByEmail('notaffiliated@example.com');

      expect(result.isAffiliated).toBe(false);
      expect(result.partnerIdMatch).toBe(false);
      expect(result.partnerId).toBeNull();
    });

    it('should handle 401 errors with retry', async () => {
      // First call fails with 401, second succeeds after token refresh
      mockFetch
        .mockResolvedValueOnce({ status: 401, ok: false }) // First affiliation call fails
        .mockResolvedValueOnce({ // Second login call
          ok: true,
          json: () => Promise.resolve({ token: 'new-token-456' })
        })
        .mockResolvedValueOnce({ // Second affiliation call succeeds
          ok: true,
          json: () => Promise.resolve({ affiliation: true, client_uid: 'test-uid' })
        });

      const result = await client.checkAffiliationByEmail('test@exness.com');

      expect(result.isAffiliated).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(4); // 1 initial login + 1 failed call + 1 retry login + 1 successful call
    });

    it('should handle 429 rate limiting with exponential backoff', async () => {
      vi.useFakeTimers();

      let callCount = 0;
      mockFetch.mockImplementation(() => {
        callCount++;
        if (callCount <= 2) {
          return Promise.resolve({
            status: 429,
            ok: false,
            headers: new Map([['retry-after', '2']])
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ affiliation: true })
        });
      });

      const resultPromise = client.checkAffiliationByEmail('test@exness.com');
      
      // Advance timers to trigger retries
      vi.advanceTimersByTime(5000);
      
      const result = await resultPromise;

      expect(result.isAffiliated).toBe(true);
      expect(callCount).toBeGreaterThan(2);
      
      vi.useRealTimers();
    });

    it('should handle network errors with retry', async () => {
      let attempts = 0;
      mockFetch.mockImplementation(() => {
        attempts++;
        if (attempts <= 2) {
          throw new Error('Network error');
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ affiliation: false })
        });
      });

      const result = await client.checkAffiliationByEmail('test@exness.com');

      expect(result.isAffiliated).toBe(false);
      expect(attempts).toBe(4); // 1 login + 3 affiliation attempts
    });

    it('should handle maximum retries exceeded', async () => {
      mockFetch.mockImplementation(() => {
        throw new Error('Persistent network error');
      });

      const result = await client.checkAffiliationByEmail('test@exness.com');

      expect(result.isAffiliated).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed API responses', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ token: 'test-token' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}) // Empty response
        });

      const result = await client.checkAffiliationByEmail('test@exness.com');

      expect(result.isAffiliated).toBe(false);
      expect(result.error).toBeUndefined(); // Should handle gracefully
    });

    it('should handle API errors with proper status codes', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ token: 'test-token' })
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          text: () => Promise.resolve('Server error details')
        });

      const result = await client.checkAffiliationByEmail('test@exness.com');

      expect(result.isAffiliated).toBe(false);
      expect(result.error).toContain('500');
    });
  });
});