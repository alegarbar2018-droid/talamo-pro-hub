// Mock API for Exness validation - MVP implementation
export interface ValidationResult {
  isAffiliated: boolean;
  partnerId?: string | null;
  partnerIdMatch: boolean;
  clientUid?: string | null;
  accounts?: string[];
}

export const mockValidateAffiliation = async (email: string, uid?: string): Promise<ValidationResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock validation logic
  const validEmails = ['demo@email.com', 'test@exness.com', 'usuario@exness.com'];
  const isValidEmail = validEmails.includes(email.toLowerCase()) || 
                      email.toLowerCase().includes('exness') || 
                      email.toLowerCase().includes('demo');

  const partnerId = "1141465940423171000";

  return {
    isAffiliated: isValidEmail,
    partnerId: isValidEmail ? partnerId : null,
    partnerIdMatch: isValidEmail,
    clientUid: uid || null,
    accounts: isValidEmail ? ['12345678', '87654321'] : []
  };
};

export const getExnessCreateUrl = (): string => {
  // In production, this would come from environment variables
  return "https://one.exness.link/a/1141465940423171000";
};