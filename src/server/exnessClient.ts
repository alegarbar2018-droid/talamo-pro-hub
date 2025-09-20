interface ExnessLoginResponse {
  token?: string;
  access?: string;
  data?: {
    token?: string;
    access?: string;
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
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
      }

      const data: ExnessLoginResponse = await response.json();
      const token = data.token || data.access || data.data?.token || data.data?.access;
      
      if (!token) {
        throw new Error('No token received from login response');
      }

      this.token = token;
      // Set expiry to 10 minutes from now (conservative estimate)
      this.tokenExpiry = Date.now() + (10 * 60 * 1000);
      
      return token;
    } catch (error) {
      console.error('Exness login error:', error);
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
  }> {
    try {
      const token = await this.getValidToken();
      const url = `${this.baseUrl}/partner/affiliation/`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `JWT ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.status === 401 && retryCount === 0) {
        // Token expired, clear it and retry once
        this.token = null;
        this.tokenExpiry = null;
        return this.checkAffiliationByEmail(email, 1);
      }

      if (response.status === 429 && retryCount === 0) {
        // Rate limited, wait and retry once
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.checkAffiliationByEmail(email, 1);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: ExnessAffiliationResponse = await response.json();
      const partnerId = data.affiliation ? process.env.EXNESS_PARTNER_ID || null : null;

      return {
        isAffiliated: data.affiliation,
        partnerId,
        partnerIdMatch: data.affiliation,
        clientUid: data.client_uid,
        accounts: data.accounts,
      };
    } catch (error) {
      console.error('Exness affiliation check error:', error);
      throw new Error(`Failed to check affiliation: ${error instanceof Error ? error.message : 'Unknown error'}`);
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