import { describe, it, expect } from 'vitest';
import { validatePasswordStrength, validateEmailFormat, createSuccessResponse, createErrorResponse } from '@/lib/validation';

describe('Password Validation', () => {
  it('should validate strong passwords', () => {
    const result = validatePasswordStrength('Password123');
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.code).toBeUndefined();
  });

  it('should reject passwords under 8 characters', () => {
    const result = validatePasswordStrength('Pass1');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('La contraseña debe tener al menos 8 caracteres');
    expect(result.code).toBe('WeakPassword');
  });

  it('should reject passwords without uppercase letters', () => {
    const result = validatePasswordStrength('password123');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('La contraseña debe incluir al menos una letra mayúscula');
    expect(result.code).toBe('WeakPassword');
  });

  it('should reject passwords without numbers', () => {
    const result = validatePasswordStrength('Password');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('La contraseña debe incluir al menos un número');
    expect(result.code).toBe('WeakPassword');
  });

  it('should reject passwords with multiple issues', () => {
    const result = validatePasswordStrength('pass');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(3);
    expect(result.code).toBe('WeakPassword');
  });
});

describe('Email Validation', () => {
  it('should validate correct email formats', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org'
    ];

    validEmails.forEach(email => {
      expect(validateEmailFormat(email)).toBe(true);
    });
  });

  it('should reject invalid email formats', () => {
    const invalidEmails = [
      'invalid-email',
      '@domain.com',
      'user@',
      'user..name@domain.com',
      ''
    ];

    invalidEmails.forEach(email => {
      expect(validateEmailFormat(email)).toBe(false);
    });
  });

  it('should reject emails that are too long', () => {
    const longEmail = 'a'.repeat(250) + '@example.com';
    expect(validateEmailFormat(longEmail)).toBe(false);
  });
});

describe('API Response Helpers', () => {
  it('should create success responses', () => {
    const response = createSuccessResponse({ id: 1 }, 'Success message');
    
    expect(response.ok).toBe(true);
    expect(response.data).toEqual({ id: 1 });
    expect(response.message).toBe('Success message');
  });

  it('should create error responses', () => {
    const response = createErrorResponse('BadRequest', 'Invalid input');
    
    expect(response.ok).toBe(false);
    expect(response.code).toBe('BadRequest');
    expect(response.message).toBe('Invalid input');
    expect(response.data).toBeUndefined();
  });
});