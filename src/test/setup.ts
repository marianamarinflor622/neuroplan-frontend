import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Limpia después de cada test
afterEach(() => {
  cleanup();
});

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
globalThis.localStorage = localStorageMock as any;

// Mock de console para evitar ruido en tests
globalThis.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};
