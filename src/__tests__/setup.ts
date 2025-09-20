import { beforeAll, vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock console methods to avoid noise in tests
beforeAll(() => {
  Object.defineProperty(console, 'info', {
    value: vi.fn(),
  });
  
  Object.defineProperty(console, 'log', {
    value: vi.fn(),
  });
  
  Object.defineProperty(console, 'warn', {
    value: vi.fn(),
  });
  
  Object.defineProperty(console, 'error', {
    value: vi.fn(),
  });
});

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:3000',
    hash: '',
  },
  writable: true,
});

// Mock gtag if it exists
global.gtag = vi.fn();