import { describe, it, expect } from 'vitest';

// Password validation function extracted from Register.tsx logic
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (password.length < 8) {
    return {
      isValid: false,
      error: "La contraseña debe tener al menos 8 caracteres."
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: "La contraseña debe contener al menos una letra mayúscula."
    };
  }

  if (!/\d/.test(password)) {
    return {
      isValid: false,
      error: "La contraseña debe contener al menos un número."
    };
  }

  return { isValid: true };
};

describe('Password Validation', () => {
  it('should reject passwords shorter than 8 characters', () => {
    const result = validatePassword('Short1');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('8 caracteres');
  });

  it('should reject passwords without uppercase letter', () => {
    const result = validatePassword('lowercase123');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('mayúscula');
  });

  it('should reject passwords without numbers', () => {
    const result = validatePassword('UppercaseLowercase');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('número');
  });

  it('should accept valid passwords', () => {
    const result = validatePassword('ValidPass123');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept passwords with special characters', () => {
    const result = validatePassword('ValidPass123!@#');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept minimum valid password', () => {
    const result = validatePassword('Abcdef12');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});