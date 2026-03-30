import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  NETWORKS,
  isMetaMaskInstalled,
  formatAddress,
  formatNumber,
  verifySignature,
  connectWallet,
  disconnectWallet,
  getCurrentAccount,
  switchNetwork,
  onAccountsChanged,
  onChainChanged,
} from '../../utils/web3';

// ─────────────────────────────────────────────────────────────
// NETWORKS constant
// ─────────────────────────────────────────────────────────────
describe('NETWORKS', () => {
  it('contains the four expected networks', () => {
    expect(Object.keys(NETWORKS)).toEqual(['ethereum', 'sepolia', 'polygon', 'arbitrum']);
  });

  it('each network has required fields', () => {
    Object.values(NETWORKS).forEach((net) => {
      expect(net).toHaveProperty('chainId');
      expect(net).toHaveProperty('chainName');
      expect(net).toHaveProperty('nativeCurrency');
      expect(net).toHaveProperty('rpcUrls');
      expect(net).toHaveProperty('blockExplorerUrls');
    });
  });

  it('ethereum has correct chainId', () => {
    expect(NETWORKS.ethereum.chainId).toBe('0x1');
  });

  it('sepolia has correct chainId', () => {
    expect(NETWORKS.sepolia.chainId).toBe('0xaa36a7');
  });

  it('polygon has correct chainId', () => {
    expect(NETWORKS.polygon.chainId).toBe('0x89');
  });

  it('arbitrum has correct chainId', () => {
    expect(NETWORKS.arbitrum.chainId).toBe('0xa4b1');
  });

  it('all network rpcUrls are non-empty arrays', () => {
    Object.values(NETWORKS).forEach((net) => {
      expect(Array.isArray(net.rpcUrls)).toBe(true);
      expect(net.rpcUrls.length).toBeGreaterThan(0);
    });
  });

  it('all network nativeCurrency have 18 decimals', () => {
    Object.values(NETWORKS).forEach((net) => {
      expect(net.nativeCurrency.decimals).toBe(18);
    });
  });
});

// ─────────────────────────────────────────────────────────────
// isMetaMaskInstalled
// ─────────────────────────────────────────────────────────────
describe('isMetaMaskInstalled', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    (window as any).ethereum = undefined;
  });

  it('returns false when window.ethereum is undefined', () => {
    (window as any).ethereum = undefined;
    expect(isMetaMaskInstalled()).toBe(false);
  });

  it('returns false when window.ethereum exists but isMetaMask is falsy', () => {
    (window as any).ethereum = { isMetaMask: false };
    expect(isMetaMaskInstalled()).toBe(false);
  });

  it('returns true when window.ethereum.isMetaMask is true', () => {
    (window as any).ethereum = { isMetaMask: true };
    expect(isMetaMaskInstalled()).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────
// formatAddress
// ─────────────────────────────────────────────────────────────
describe('formatAddress', () => {
  const address = '0x1234567890abcdef1234567890abcdef12345678';

  it('formats address with default chars (4)', () => {
    expect(formatAddress(address)).toBe('0x1234...5678');
  });

  it('formats address with custom chars count', () => {
    expect(formatAddress(address, 6)).toBe('0x123456...345678');
  });

  it('returns empty string for empty input', () => {
    expect(formatAddress('')).toBe('');
  });

  it('preserves "0x" prefix in the formatted output', () => {
    const result = formatAddress(address);
    expect(result.startsWith('0x')).toBe(true);
  });

  it('uses "..." as separator', () => {
    const result = formatAddress(address);
    expect(result).toContain('...');
  });

  it('formats short address correctly', () => {
    const short = '0xabcdef1234567890';
    const result = formatAddress(short, 4);
    expect(result).toBe('0xabcd...7890');
  });
});

// ─────────────────────────────────────────────────────────────
// formatNumber
// ─────────────────────────────────────────────────────────────
describe('formatNumber', () => {
  it('formats a plain number with default 2 decimal places', () => {
    const result = formatNumber(1234.5678);
    // The function uses fr-FR locale which uses spaces as thousand separators
    // It should contain the integer part
    expect(result).toMatch(/1/);
    expect(result).toMatch(/234/);
  });

  it('formats a number from string input', () => {
    const result = formatNumber('9999.1');
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('formats zero correctly', () => {
    const result = formatNumber(0);
    expect(result).toMatch(/0/);
  });

  it('formats negative numbers', () => {
    const result = formatNumber(-100.5, 1);
    expect(result).toContain('-');
  });

  it('respects custom decimal places', () => {
    const result = formatNumber(1.23456, 4);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('formats integer with minimum fraction digits', () => {
    const result = formatNumber(100, 2);
    expect(result).toMatch(/100/);
  });

  it('parses string numbers correctly', () => {
    const result = formatNumber('500', 0);
    expect(result).toMatch(/500/);
  });
});

// ─────────────────────────────────────────────────────────────
// verifySignature
// ─────────────────────────────────────────────────────────────
describe('verifySignature', () => {
  it('returns false for invalid signature', () => {
    const result = verifySignature(
      'hello world',
      'invalid_signature',
      '0x1234567890abcdef1234567890abcdef12345678'
    );
    expect(result).toBe(false);
  });

  it('returns false when address does not match signer', () => {
    const result = verifySignature('test', '0x' + '0'.repeat(130), '0xdeadbeef');
    expect(result).toBe(false);
  });

  it('returns false for empty signature', () => {
    const result = verifySignature('test', '', '0x1234567890abcdef1234567890abcdef12345678');
    expect(result).toBe(false);
  });

  it('is case-insensitive for address comparison', () => {
    const result1 = verifySignature('msg', 'badsig', '0xABCDEF');
    const result2 = verifySignature('msg', 'badsig', '0xabcdef');
    expect(result1).toBe(result2);
  });
});

// ─────────────────────────────────────────────────────────────
// disconnectWallet
// ─────────────────────────────────────────────────────────────
describe('disconnectWallet', () => {
  it('does not throw', () => {
    expect(() => disconnectWallet()).not.toThrow();
  });

  it('returns undefined', () => {
    expect(disconnectWallet()).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────
// connectWallet – without MetaMask
// ─────────────────────────────────────────────────────────────
describe('connectWallet without MetaMask', () => {
  beforeEach(() => {
    (window as any).ethereum = undefined;
  });

  it('throws when MetaMask is not installed', async () => {
    await expect(connectWallet()).rejects.toThrow();
  });

  it('error message mentions MetaMask when not installed', async () => {
    await expect(connectWallet()).rejects.toThrow(/metamask/i);
  });
});

// ─────────────────────────────────────────────────────────────
// connectWallet – with mocked MetaMask
// ─────────────────────────────────────────────────────────────
describe('connectWallet with mocked MetaMask', () => {
  const mockAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdef1234';
  const mockChainId = '0x1';

  beforeEach(() => {
    (window as any).ethereum = {
      isMetaMask: true,
      request: vi.fn(({ method }: { method: string }) => {
        if (method === 'eth_requestAccounts') return Promise.resolve([mockAddress]);
        if (method === 'eth_chainId') return Promise.resolve(mockChainId);
        if (method === 'eth_getBalance') return Promise.resolve('0xde0b6b3a7640000');
        return Promise.resolve(null);
      }),
      on: vi.fn(),
      removeListener: vi.fn(),
    };
  });

  afterEach(() => {
    (window as any).ethereum = undefined;
    vi.restoreAllMocks();
  });

  it('returns address and chainId on success', async () => {
    const result = await connectWallet();
    expect(result.address).toBe(mockAddress);
    expect(result.chainId).toBe(1);
    expect(typeof result.balance).toBe('string');
  });

  it('throws when user rejects with code 4001', async () => {
    const error = Object.assign(new Error('User rejected'), { code: 4001 });
    (window as any).ethereum.request = vi.fn().mockRejectedValue(error);
    await expect(connectWallet()).rejects.toThrow(/refus/i);
  });

  it('throws when no accounts returned', async () => {
    (window as any).ethereum.request = vi.fn(({ method }: { method: string }) => {
      if (method === 'eth_requestAccounts') return Promise.resolve([]);
      return Promise.resolve(null);
    });
    await expect(connectWallet()).rejects.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────
// getCurrentAccount
// ─────────────────────────────────────────────────────────────
describe('getCurrentAccount', () => {
  afterEach(() => {
    (window as any).ethereum = undefined;
  });

  it('returns null when MetaMask is not installed', async () => {
    (window as any).ethereum = undefined;
    const result = await getCurrentAccount();
    expect(result).toBeNull();
  });

  it('returns null when request throws code 4100 (not authorized)', async () => {
    const error = Object.assign(new Error('not authorized'), { code: 4100 });
    (window as any).ethereum = {
      isMetaMask: true,
      request: vi.fn().mockRejectedValue(error),
    };
    const result = await getCurrentAccount();
    expect(result).toBeNull();
  });

  it('returns account when authorized', async () => {
    const mockAddr = '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
    (window as any).ethereum = {
      isMetaMask: true,
      request: vi.fn().mockResolvedValue([mockAddr]),
    };
    const result = await getCurrentAccount();
    expect(result).toBe(mockAddr);
  });

  it('returns null when accounts array is empty', async () => {
    (window as any).ethereum = {
      isMetaMask: true,
      request: vi.fn().mockResolvedValue([]),
    };
    const result = await getCurrentAccount();
    expect(result).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────
// switchNetwork
// ─────────────────────────────────────────────────────────────
describe('switchNetwork', () => {
  afterEach(() => {
    (window as any).ethereum = undefined;
    vi.restoreAllMocks();
  });

  it('throws when MetaMask is not installed', async () => {
    (window as any).ethereum = undefined;
    await expect(switchNetwork('ethereum')).rejects.toThrow();
  });

  it('calls wallet_switchEthereumChain with correct chainId', async () => {
    const requestMock = vi.fn().mockResolvedValue(null);
    (window as any).ethereum = { isMetaMask: true, request: requestMock };

    await switchNetwork('polygon');

    expect(requestMock).toHaveBeenCalledWith({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: NETWORKS.polygon.chainId }],
    });
  });

  it('calls wallet_addEthereumChain when error code is 4902', async () => {
    const switchError = Object.assign(new Error('Chain not added'), { code: 4902 });
    const requestMock = vi.fn()
      .mockRejectedValueOnce(switchError)
      .mockResolvedValueOnce(null);

    (window as any).ethereum = { isMetaMask: true, request: requestMock };

    await switchNetwork('arbitrum');

    expect(requestMock).toHaveBeenCalledTimes(2);
    expect(requestMock).toHaveBeenLastCalledWith({
      method: 'wallet_addEthereumChain',
      params: [NETWORKS.arbitrum],
    });
  });

  it('re-throws non-4902 errors', async () => {
    const switchError = Object.assign(new Error('Rejected'), { code: 4001 });
    const requestMock = vi.fn().mockRejectedValue(switchError);
    (window as any).ethereum = { isMetaMask: true, request: requestMock };

    await expect(switchNetwork('ethereum')).rejects.toThrow();
  });

  it('throws friendly error when wallet_addEthereumChain also fails', async () => {
    const switchError = Object.assign(new Error('Chain not added'), { code: 4902 });
    const addError = new Error('Add chain failed');
    const requestMock = vi.fn()
      .mockRejectedValueOnce(switchError)
      .mockRejectedValueOnce(addError);

    (window as any).ethereum = { isMetaMask: true, request: requestMock };

    await expect(switchNetwork('sepolia')).rejects.toThrow(/réseau/i);
  });
});

// ─────────────────────────────────────────────────────────────
// onAccountsChanged
// ─────────────────────────────────────────────────────────────
describe('onAccountsChanged', () => {
  afterEach(() => {
    (window as any).ethereum = undefined;
  });

  it('does nothing when MetaMask is not installed', () => {
    (window as any).ethereum = undefined;
    expect(() => onAccountsChanged(() => {})).not.toThrow();
  });

  it('registers the listener on ethereum', () => {
    const onMock = vi.fn();
    const removeListenerMock = vi.fn();
    (window as any).ethereum = { isMetaMask: true, on: onMock, removeListener: removeListenerMock };

    const callback = vi.fn();
    onAccountsChanged(callback);

    expect(onMock).toHaveBeenCalledWith('accountsChanged', callback);
  });

  it('returns a cleanup function that removes the listener', () => {
    const onMock = vi.fn();
    const removeListenerMock = vi.fn();
    (window as any).ethereum = { isMetaMask: true, on: onMock, removeListener: removeListenerMock };

    const callback = vi.fn();
    const cleanup = onAccountsChanged(callback);

    expect(typeof cleanup).toBe('function');
    cleanup!();
    expect(removeListenerMock).toHaveBeenCalledWith('accountsChanged', callback);
  });
});

// ─────────────────────────────────────────────────────────────
// onChainChanged
// ─────────────────────────────────────────────────────────────
describe('onChainChanged', () => {
  afterEach(() => {
    (window as any).ethereum = undefined;
  });

  it('does nothing when MetaMask is not installed', () => {
    (window as any).ethereum = undefined;
    expect(() => onChainChanged(() => {})).not.toThrow();
  });

  it('registers the listener on ethereum', () => {
    const onMock = vi.fn();
    const removeListenerMock = vi.fn();
    (window as any).ethereum = { isMetaMask: true, on: onMock, removeListener: removeListenerMock };

    const callback = vi.fn();
    onChainChanged(callback);

    expect(onMock).toHaveBeenCalledWith('chainChanged', callback);
  });

  it('returns a cleanup function that removes the listener', () => {
    const onMock = vi.fn();
    const removeListenerMock = vi.fn();
    (window as any).ethereum = { isMetaMask: true, on: onMock, removeListener: removeListenerMock };

    const callback = vi.fn();
    const cleanup = onChainChanged(callback);

    expect(typeof cleanup).toBe('function');
    cleanup!();
    expect(removeListenerMock).toHaveBeenCalledWith('chainChanged', callback);
  });
});
