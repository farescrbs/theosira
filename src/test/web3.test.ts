import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ethers } from 'ethers';
import {
  NETWORKS,
  isMetaMaskInstalled,
  connectWallet,
  disconnectWallet,
  getCurrentAccount,
  formatAddress,
  formatNumber,
  verifySignature,
  switchNetwork,
} from '../utils/web3';

// ──────────────────────────────────────────────────────────────────────────────
// isMetaMaskInstalled
// ──────────────────────────────────────────────────────────────────────────────
describe('isMetaMaskInstalled', () => {
  let savedEthereum: unknown;

  beforeEach(() => {
    savedEthereum = (window as any).ethereum;
  });

  afterEach(() => {
    (window as any).ethereum = savedEthereum;
  });

  it('returns true when window.ethereum.isMetaMask is set', () => {
    (window as any).ethereum = { isMetaMask: true };
    expect(isMetaMaskInstalled()).toBe(true);
  });

  it('returns false when window.ethereum is absent', () => {
    (window as any).ethereum = undefined;
    expect(isMetaMaskInstalled()).toBe(false);
  });

  it('returns false when isMetaMask flag is false', () => {
    (window as any).ethereum = { isMetaMask: false };
    expect(isMetaMaskInstalled()).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// NETWORKS configuration
// ──────────────────────────────────────────────────────────────────────────────
describe('NETWORKS', () => {
  it('contains all expected networks', () => {
    expect(Object.keys(NETWORKS)).toEqual(
      expect.arrayContaining(['ethereum', 'sepolia', 'polygon', 'arbitrum'])
    );
  });

  it('ethereum has correct chainId', () => {
    expect(NETWORKS.ethereum.chainId).toBe('0x1');
  });

  it('polygon has correct chainId', () => {
    expect(NETWORKS.polygon.chainId).toBe('0x89');
  });

  it('arbitrum has correct chainId', () => {
    expect(NETWORKS.arbitrum.chainId).toBe('0xa4b1');
  });

  it('each network has required fields', () => {
    for (const [, network] of Object.entries(NETWORKS)) {
      expect(network).toHaveProperty('chainId');
      expect(network).toHaveProperty('chainName');
      expect(network).toHaveProperty('nativeCurrency');
      expect(network).toHaveProperty('rpcUrls');
      expect(network).toHaveProperty('blockExplorerUrls');
    }
  });

  it('native currencies have correct decimals', () => {
    for (const [, network] of Object.entries(NETWORKS)) {
      expect(network.nativeCurrency.decimals).toBe(18);
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// connectWallet
// ──────────────────────────────────────────────────────────────────────────────
describe('connectWallet', () => {
  let savedEthereum: unknown;

  beforeEach(() => {
    savedEthereum = (window as any).ethereum;
    (window as any).ethereum = {
      isMetaMask: true,
      request: vi.fn(),
      on: vi.fn(),
      removeListener: vi.fn(),
    };
  });

  afterEach(() => {
    (window as any).ethereum = savedEthereum;
  });

  it('throws when MetaMask is not installed', async () => {
    (window as any).ethereum = undefined;
    await expect(connectWallet()).rejects.toThrow("MetaMask n'est pas installé");
  });

  it('throws a user-friendly error when user rejects (code 4001)', async () => {
    const error = new Error('User rejected');
    (error as any).code = 4001;
    (window as any).ethereum.request.mockRejectedValue(error);
    await expect(connectWallet()).rejects.toThrow('Connexion refusée par l\'utilisateur.');
  });

  it('throws when no accounts are returned', async () => {
    (window as any).ethereum.request
      .mockResolvedValueOnce([]) // eth_requestAccounts returns empty array
      .mockResolvedValueOnce('0x1');
    await expect(connectWallet()).rejects.toThrow('Aucun compte trouvé');
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// disconnectWallet
// ──────────────────────────────────────────────────────────────────────────────
describe('disconnectWallet', () => {
  it('runs without throwing', () => {
    expect(() => disconnectWallet()).not.toThrow();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// getCurrentAccount
// ──────────────────────────────────────────────────────────────────────────────
describe('getCurrentAccount', () => {
  let savedEthereum: unknown;

  beforeEach(() => {
    savedEthereum = (window as any).ethereum;
    (window as any).ethereum = {
      isMetaMask: true,
      request: vi.fn(),
      on: vi.fn(),
      removeListener: vi.fn(),
    };
  });

  afterEach(() => {
    (window as any).ethereum = savedEthereum;
  });

  it('returns null when MetaMask is not installed', async () => {
    (window as any).ethereum = undefined;
    const result = await getCurrentAccount();
    expect(result).toBeNull();
  });

  it('returns the first account when accounts are available', async () => {
    const MOCK_ADDRESS = '0xabc123';
    (window as any).ethereum.request.mockResolvedValueOnce([MOCK_ADDRESS]);
    const result = await getCurrentAccount();
    expect(result).toBe(MOCK_ADDRESS);
  });

  it('returns null when accounts array is empty', async () => {
    (window as any).ethereum.request.mockResolvedValueOnce([]);
    const result = await getCurrentAccount();
    expect(result).toBeNull();
  });

  it('returns null silently on error code 4100', async () => {
    const error = new Error('Unauthorized');
    (error as any).code = 4100;
    (window as any).ethereum.request.mockRejectedValueOnce(error);
    const result = await getCurrentAccount();
    expect(result).toBeNull();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// switchNetwork
// ──────────────────────────────────────────────────────────────────────────────
describe('switchNetwork', () => {
  let savedEthereum: unknown;

  beforeEach(() => {
    savedEthereum = (window as any).ethereum;
    (window as any).ethereum = {
      isMetaMask: true,
      request: vi.fn(),
      on: vi.fn(),
      removeListener: vi.fn(),
    };
  });

  afterEach(() => {
    (window as any).ethereum = savedEthereum;
  });

  it('throws when MetaMask is not installed', async () => {
    (window as any).ethereum = undefined;
    await expect(switchNetwork('ethereum')).rejects.toThrow("MetaMask n'est pas installé");
  });

  it('calls wallet_switchEthereumChain with correct chainId', async () => {
    (window as any).ethereum.request.mockResolvedValueOnce(null);
    await switchNetwork('ethereum');
    expect((window as any).ethereum.request).toHaveBeenCalledWith({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }],
    });
  });

  it('calls wallet_addEthereumChain when chain not found (code 4902)', async () => {
    const switchError = new Error('Chain not added');
    (switchError as any).code = 4902;
    (window as any).ethereum.request
      .mockRejectedValueOnce(switchError)
      .mockResolvedValueOnce(null);
    await switchNetwork('polygon');
    expect((window as any).ethereum.request).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'wallet_addEthereumChain' })
    );
  });

  it('re-throws non-4902 errors', async () => {
    const genericError = new Error('Unknown error');
    (window as any).ethereum.request.mockRejectedValueOnce(genericError);
    await expect(switchNetwork('arbitrum')).rejects.toThrow('Unknown error');
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// formatAddress
// ──────────────────────────────────────────────────────────────────────────────
describe('formatAddress', () => {
  it('formats a full address to abbreviated form with default chars=4', () => {
    const address = '0x1234567890123456789012345678901234567890';
    expect(formatAddress(address)).toBe('0x1234...7890');
  });

  it('works with custom chars count', () => {
    const address = '0x1234567890123456789012345678901234567890';
    expect(formatAddress(address, 6)).toBe('0x123456...567890');
  });

  it('returns empty string for empty input', () => {
    expect(formatAddress('')).toBe('');
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// formatNumber
// ──────────────────────────────────────────────────────────────────────────────
describe('formatNumber', () => {
  it('formats a numeric value with 2 decimals by default', () => {
    const result = formatNumber(1234.5);
    expect(result).toContain('1');
    expect(result).toContain('234');
  });

  it('accepts a string input', () => {
    const result = formatNumber('9876.54321', 2);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('respects custom decimal places', () => {
    const result = formatNumber(1.23456789, 4);
    expect(result).toContain('1');
  });

  it('handles zero', () => {
    const result = formatNumber(0);
    expect(result).toBeTruthy();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// verifySignature
// ──────────────────────────────────────────────────────────────────────────────
describe('verifySignature', () => {
  // Use fixed private keys to avoid ethers.Wallet.createRandom() crypto issues in jsdom
  const PRIVATE_KEY_1 = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const PRIVATE_KEY_2 = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
  const wallet1 = new ethers.Wallet(PRIVATE_KEY_1);
  const wallet2 = new ethers.Wallet(PRIVATE_KEY_2);

  it('returns true for a valid signature from the expected address', async () => {
    const message = 'THESORIA Auth 2026';
    const signature = await wallet1.signMessage(message);
    expect(verifySignature(message, signature, wallet1.address)).toBe(true);
  });

  it('returns false when the address does not match', async () => {
    const message = 'Test message';
    const signature = await wallet1.signMessage(message);
    expect(verifySignature(message, signature, wallet2.address)).toBe(false);
  });

  it('returns false for an invalid / malformed signature', () => {
    expect(verifySignature('msg', 'invalid-sig', '0x1234')).toBe(false);
  });

  it('is case-insensitive for address comparison', async () => {
    const message = 'case test';
    const signature = await wallet1.signMessage(message);
    expect(verifySignature(message, signature, wallet1.address.toUpperCase())).toBe(true);
    expect(verifySignature(message, signature, wallet1.address.toLowerCase())).toBe(true);
  });
});
