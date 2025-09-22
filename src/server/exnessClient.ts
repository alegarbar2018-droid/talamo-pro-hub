interface ExnessLoginResponse {
  token?: string;
  access?: string;
  expires_in?: number;
  data?: {
    token?: string;
    access?: string;
    expires_in?: number;
  };
}

interface ExnessAffiliationResponse {
  affiliation: boolean;
  accounts: string[];
  client_uid: string;
}

interface ExnessError {
  message: string;
  code?: string;
}

class ExnessClient {
  private token: string | null = null;
  private tokenExpiry: number | null = null;
  private readonly baseUrl: string;
  private readonly email: string;
  private readonly password: string;
  private readonly SAFETY_WINDOW_MS = 120 * 1000; // 2 minutes safety buffer

  constructor() {
    // Support both Node.js and Deno environments safely
    const getEnvVar = (key: string) => {
      // Try process.env first (Node.js/Browser)
      if (typeof process !== 'undefined' && process?.env) {
        return process.env[key];
      }
      // Try Deno.env if available (Deno runtime)
      try {
        const denoGlobal = (globalThis as any).Deno;
        if (denoGlobal?.env) {
          return denoGlobal.env.get(key);
        }
      } catch {
        // Ignore errors accessing Deno
      }
      return '';
    };

    this.baseUrl = getEnvVar('PARTNER_API_BASE') || '';
    this.email = getEnvVar('PARTNER_API_USER') || '';
    this.password = getEnvVar('PARTNER_API_PASSWORD') || '';
    
    if (!this.baseUrl || !this.email || !this.password) {
      throw new Error('Missing required Exness API configuration');
    }
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private addJitter(delay: number): number {
    return delay + Math.random() * 300; // Add up to 300ms jitter
  }

  private async login(): Promise<string> {
    const url = `${this.baseUrl}/auth/`;
    
    try {
      console.log(`[ExnessClient] Attempting login to Exness API`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
      }

      const data: ExnessLoginResponse = await response.json();
      const token = data.token || data.access || data.data?.token || data.data?.access;
      
      if (!token) {
        throw new Error('No token received from login response');
      }

      // Try to extract token expiry from response if available
      const expiresIn = data.expires_in || data.data?.expires_in;
      const expiryTime = expiresIn 
        ? Date.now() + (expiresIn * 1000) 
        : Date.now() + (10 * 60 * 1000); // Default 10 minutes

      this.token = token;
      this.tokenExpiry = expiryTime;
      
      console.log(`[ExnessClient] Login successful, token expires at ${new Date(expiryTime).toISOString()}`);
      
      return token;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('[ExnessClient] Login request timeout');
        throw new Error('Login request timeout');
      }
      
      console.error('[ExnessClient] Login error:', error);
      throw new Error(`Failed to authenticate with Exness: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async getToken(): Promise<string> {
    const now = Date.now();
    
    // Check if token exists and is still valid with safety window
    if (this.token && this.tokenExpiry && now < (this.tokenExpiry - this.SAFETY_WINDOW_MS)) {
      return this.token;
    }
    
    // Clear expired token
    this.token = null;
    this.tokenExpiry = null;
    
    return await this.login();
  }

  private async fetchWithRetry(url: string, init: RequestInit, maxRetries = 2): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(url, {
          ...init,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        // Handle rate limiting with exponential backoff
        if (response.status === 429 && attempt < maxRetries) {
          const retryAfter = parseInt(response.headers.get('retry-after') || '2');
          const baseDelay = Math.max(retryAfter * 1000, 300 * Math.pow(2, attempt));
          const delayWithJitter = this.addJitter(baseDelay);
          
          console.log(`[ExnessClient] Rate limited, retrying after ${delayWithJitter}ms (attempt ${attempt + 1})`);
          await new Promise(resolve => setTimeout(resolve, delayWithJitter));
          continue;
        }
        
        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (error instanceof Error && error.name === 'AbortError') {
          lastError = new Error('Request timeout');
          break; // Don't retry timeouts
        }
        
        // For 5xx errors, retry once
        if (attempt < Math.min(maxRetries, 1)) {
          const delay = this.addJitter(1000 * Math.pow(2, attempt));
          console.log(`[ExnessClient] Network error, retrying after ${delay}ms (attempt ${attempt + 1})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
    }
    
    throw lastError || new Error('Max retries exceeded');
  }

  async checkAffiliationByEmail(email: string): Promise<{
    isAffiliated: boolean;
    partnerId?: string | null;
    partnerIdMatch: boolean;
    clientUid?: string | null;
    accounts?: string[];
    error?: string;
    code?: string;
  }> {
    const normalizedEmail = this.normalizeEmail(email);
    const startTime = Date.now();
    const getEnvVar = (key: string) => {
      if (typeof process !== 'undefined' && process?.env) {
        return process.env[key];
      }
      try {
        const denoGlobal = (globalThis as any).Deno;
        if (denoGlobal?.env) {
          return denoGlobal.env.get(key);
        }
      } catch {
        // Ignore errors accessing Deno
      }
      return '';
    };
    const expectedPartnerId = getEnvVar('EXNESS_PARTNER_ID');

    try {
      const token = await this.getToken();
      const url = `${this.baseUrl}/partner/affiliation/`;

      console.log(`[ExnessClient] Attempting affiliation check for normalized email`);

      const response = await this.fetchWithRetry(url, {
        method: 'POST',
        headers: {
          'Authorization': `JWT ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const responseTime = Date.now() - startTime;
      console.log(`[ExnessClient] Response received in ${responseTime}ms with status: ${response.status}`);

      // Handle 401 - don't retry, invalid token
      if (response.status === 401) {
        console.error(`[ExnessClient] Authentication failed - invalid credentials`);
        this.token = null;
        this.tokenExpiry = null;
        return {
          isAffiliated: false,
          partnerId: null,
          partnerIdMatch: false,
          clientUid: null,
          accounts: [],
          error: 'Authentication failed',
          code: 'Unauthorized'
        };
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error(`[ExnessClient] API error: ${response.status} ${response.statusText} - ${errorText}`);
        
        const errorCode = response.status >= 500 ? 'UpstreamError' : 
                         response.status === 429 ? 'Throttled' :
                         response.status >= 400 ? 'BadRequest' : 'UnknownError';
        
        return {
          isAffiliated: false,
          partnerId: null,
          partnerIdMatch: false,
          clientUid: null,
          accounts: [],
          error: `API request failed: ${response.status} ${response.statusText}`,
          code: errorCode
        };
      }

      const data: ExnessAffiliationResponse = await response.json();
      const partnerId = data.affiliation ? expectedPartnerId : null;
      const partnerIdMatch = data.affiliation && partnerId === expectedPartnerId;

      console.log(`[ExnessClient] Affiliation check completed: ${data.affiliation ? 'affiliated' : 'not affiliated'} (${responseTime}ms)`);

      return {
        isAffiliated: data.affiliation,
        partnerId,
        partnerIdMatch,
        clientUid: data.client_uid,
        accounts: data.accounts || [],
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error(`[ExnessClient] Affiliation check error (${responseTime}ms):`, error);
      
      const errorCode = error instanceof Error && error.message === 'Request timeout' ? 'Timeout' : 'NetworkError';
      
      return {
        isAffiliated: false,
        partnerId: null,
        partnerIdMatch: false,
        clientUid: null,
        accounts: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        code: errorCode
      };
    }
  }
}

// Singleton instance
let exnessClient: ExnessClient | null = null;

export function getExnessClient(): ExnessClient {
  if (!exnessClient) {
    exnessClient = new ExnessClient();
  }
  return exnessClient;
}