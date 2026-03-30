import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { web3Service, SUPPORTED_CHAINS, POPULAR_TOKENS } from '../services/web3Service';

// ──────────────────────────────────────────────────────────────────────────────
// SUPPORTED_CHAINS configuration
// ──────────────────────────────────────────────────────────────────────────────
describe('SUPPORTED_CHAINS', () => {
  it('includes at least 5 major networks', () => {
    expect(Object.keys(SUPPORTED_CHAINS).length).toBeGreaterThanOrEqual(5);
  });

  it('contains Ethereum (1)', () => {
    expect(SUPPORTED_CHAINS[1]).toBeDefined();
    expect(SUPPORTED_CHAINS[1].symbol).toBe('ETH');
    expect(SUPPORTED_CHAINS[1].chainIdHex).toBe('0x1');
  });

  it('contains Polygon (137)', () => {
    expect(SUPPORTED_CHAINS[137]).toBeDefined();
    expect(SUPPORTED_CHAINS[137].symbol).toBe('MATIC');
  });

  it('contains Arbitrum (42161)', () => {
    expect(SUPPORTED_CHAINS[42161]).toBeDefined();
    expect(SUPPORTED_CHAINS[42161].name).toBe('Arbitrum One');
  });

  it('contains BSC (56)', () => {
    expect(SUPPORTED_CHAINS[56]).toBeDefined();
    expect(SUPPORTED_CHAINS[56].symbol).toBe('BNB');
  });

  it('each chain has a valid explorer URL', () => {
    for (const chain of Object.values(SUPPORTED_CHAINS)) {
      expect(chain.explorerUrl).toMatch(/^https?:\/\//);
    }
  });

  it('each chain has a valid RPC URL', () => {
    for (const chain of Object.values(SUPPORTED_CHAINS)) {
      expect(chain.rpcUrl).toMatch(/^https?:\/\//);
    }
  });

  it('chainId in config matches its key', () => {
    for (const [key, chain] of Object.entries(SUPPORTED_CHAINS)) {
      expect(chain.chainId).toBe(Number(key));
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// POPULAR_TOKENS configuration
// ──────────────────────────────────────────────────────────────────────────────
describe('POPULAR_TOKENS', () => {
  it('has entries for Ethereum (1)', () => {
    expect(POPULAR_TOKENS[1]).toBeDefined();
    expect(POPULAR_TOKENS[1].length).toBeGreaterThan(0);
  });

  it('Ethereum tokens include USDT, USDC, DAI', () => {
    const symbols = POPULAR_TOKENS[1].map((t) => t.symbol);
    expect(symbols).toContain('USDT');
    expect(symbols).toContain('USDC');
    expect(symbols).toContain('DAI');
  });

  it('each token has a valid contract address', () => {
    for (const tokens of Object.values(POPULAR_TOKENS)) {
      for (const token of tokens) {
        expect(token.address).toMatch(/^0x[0-9a-fA-F]{40}$/);
      }
    }
  });

  it('each token has decimals > 0', () => {
    for (const tokens of Object.values(POPULAR_TOKENS)) {
      for (const token of tokens) {
        expect(token.decimals).toBeGreaterThan(0);
      }
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// web3Service instance methods
// ──────────────────────────────────────────────────────────────────────────────
describe('web3Service', () => {
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

  describe('isWalletInstalled', () => {
    it('returns true when window.ethereum exists', () => {
      expect(web3Service.isWalletInstalled()).toBe(true);
    });

    it('returns false when window.ethereum is absent', () => {
      (window as any).ethereum = undefined;
      expect(web3Service.isWalletInstalled()).toBe(false);
    });
  });

  describe('detectAvailableWallets', () => {
    it('returns an array', () => {
      expect(Array.isArray(web3Service.detectAvailableWallets())).toBe(true);
    });

    it('detects MetaMask', () => {
      (window as any).ethereum = { isMetaMask: true };
      expect(web3Service.detectAvailableWallets()).toContain('metamask');
    });

    it('returns empty array when no wallet is present', () => {
      (window as any).ethereum = undefined;
      expect(web3Service.detectAvailableWallets()).toEqual([]);
    });
  });

  describe('getProvider / getSigner / getCurrentAccount / getCurrentChainId', () => {
    it('getProvider returns null before connection', () => {
      expect(web3Service.getProvider()).toBeNull();
    });

    it('getSigner returns null before connection', () => {
      expect(web3Service.getSigner()).toBeNull();
    });

    it('getCurrentAccount returns null before connection', () => {
      expect(web3Service.getCurrentAccount()).toBeNull();
    });

    it('getCurrentChainId returns null before connection', () => {
      expect(web3Service.getCurrentChainId()).toBeNull();
    });
  });

  describe('connect', () => {
    it('throws when no wallet is installed', async () => {
      (window as any).ethereum = undefined;
      await expect(web3Service.connect()).rejects.toThrow('Aucun wallet détecté');
    });
  });

  describe('disconnect', () => {
    it('runs without throwing', () => {
      expect(() => web3Service.disconnect()).not.toThrow();
    });

    it('clears current account after disconnect', () => {
      web3Service.disconnect();
      expect(web3Service.getCurrentAccount()).toBeNull();
    });

    it('clears current chain after disconnect', () => {
      web3Service.disconnect();
      expect(web3Service.getCurrentChainId()).toBeNull();
    });
  });
});
