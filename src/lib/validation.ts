// Password validation utilities
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  code?: string;
}

export function validatePasswordStrength(password: string): PasswordValidationResult {
  const errors: string[] = [];
  
  if (!password || password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe incluir al menos una letra mayúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('La contraseña debe incluir al menos un número');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    code: errors.length > 0 ? 'WeakPassword' : undefined
  };
}

// Email validation
export function validateEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Generic response helpers
export interface ApiResponse<T = any> {
  ok: boolean;
  code?: string;
  message?: string;
  data?: T;
}

export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    ok: true,
    data,
    message
  };
}

export function createErrorResponse(code: string, message: string): ApiResponse {
  return {
    ok: false,
    code,
    message
  };
}