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

  constructor() {
    this.baseUrl = process.env.PARTNER_API_BASE || '';
    this.email = process.env.PARTNER_API_USER || '';
    this.password = process.env.PARTNER_API_PASSWORD || '';
    
    if (!this.baseUrl || !this.email || !this.password) {
      throw new Error('Missing required Exness API configuration');
    }
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

  private async getValidToken(): Promise<string> {
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }
    
    return await this.login();
  }

  async checkAffiliationByEmail(email: string, retryCount = 0): Promise<{
    isAffiliated: boolean;
    partnerId?: string | null;
    partnerIdMatch: boolean;
    clientUid?: string | null;
    accounts?: string[];
    error?: string;
  }> {
    const maxRetries = 3;
    const startTime = Date.now();

    try {
      const token = await this.getValidToken();
      const url = `${this.baseUrl}/partner/affiliation/`;

      console.log(`[ExnessClient] Attempting affiliation check for email (attempt ${retryCount + 1}/${maxRetries + 1})`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `JWT ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseTime = Date.now() - startTime;
      console.log(`[ExnessClient] Response received in ${responseTime}ms with status: ${response.status}`);

      // Handle token expiry with retry
      if (response.status === 401 && retryCount < maxRetries) {
        console.log(`[ExnessClient] Token expired, clearing cache and retrying`);
        this.token = null;
        this.tokenExpiry = null;
        const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 4000); // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return this.checkAffiliationByEmail(email, retryCount + 1);
      }

      // Handle rate limiting with retry  
      if (response.status === 429 && retryCount < maxRetries) {
        const retryAfter = parseInt(response.headers.get('retry-after') || '2');
        const backoffDelay = Math.max(retryAfter * 1000, 1000 * Math.pow(2, retryCount));
        console.log(`[ExnessClient] Rate limited, retrying after ${backoffDelay}ms`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return this.checkAffiliationByEmail(email, retryCount + 1);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[ExnessClient] API error: ${response.status} ${response.statusText} - ${errorText}`);
        
        return {
          isAffiliated: false,
          partnerId: null,
          partnerIdMatch: false,
          clientUid: null,
          accounts: [],
          error: `API request failed: ${response.status} ${response.statusText}`
        };
      }

      const data: ExnessAffiliationResponse = await response.json();
      const partnerId = data.affiliation ? process.env.EXNESS_PARTNER_ID || null : null;

      console.log(`[ExnessClient] Affiliation check completed: ${data.affiliation ? 'affiliated' : 'not affiliated'}`);

      return {
        isAffiliated: data.affiliation,
        partnerId,
        partnerIdMatch: data.affiliation,
        clientUid: data.client_uid,
        accounts: data.accounts,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.error(`[ExnessClient] Request timeout after ${responseTime}ms`);
        if (retryCount < maxRetries) {
          const backoffDelay = 1000 * Math.pow(2, retryCount);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          return this.checkAffiliationByEmail(email, retryCount + 1);
        }
        return {
          isAffiliated: false,
          partnerId: null,
          partnerIdMatch: false,
          clientUid: null,
          accounts: [],
          error: 'Request timeout'
        };
      }

      console.error(`[ExnessClient] Affiliation check error (${responseTime}ms):`, error);
      
      // Retry on network errors
      if (retryCount < maxRetries) {
        const backoffDelay = 1000 * Math.pow(2, retryCount);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return this.checkAffiliationByEmail(email, retryCount + 1);
      }

      return {
        isAffiliated: false,
        partnerId: null,
        partnerIdMatch: false,
        clientUid: null,
        accounts: [],
        error: error instanceof Error ? error.message : 'Unknown error'
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