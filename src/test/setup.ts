import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Default mock ethereum object
export const createMockEthereum = () => ({
  isMetaMask: true,
  request: vi.fn(),
  on: vi.fn(),
  removeListener: vi.fn(),
});

// Install a default mock on window.ethereum
Object.defineProperty(window, 'ethereum', {
  value: createMockEthereum(),
  writable: true,
  configurable: true,
});

// Mock window.open
Object.defineProperty(window, 'open', {
  value: vi.fn(),
  writable: true,
  configurable: true,
});

// Restore the ethereum mock before each test so that tests which
// set window.ethereum = undefined do not break subsequent tests.
beforeEach(() => {
  vi.clearAllMocks();
  if (!(window as any).ethereum || typeof (window as any).ethereum.request?.mockReset !== 'function') {
    (window as any).ethereum = createMockEthereum();
  }
});
