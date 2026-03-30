import { describe, it, expect } from 'vitest';
import { DEX_CONFIGS } from '../services/dexService';

// ──────────────────────────────────────────────────────────────────────────────
// DEX_CONFIGS
// ──────────────────────────────────────────────────────────────────────────────
describe('DEX_CONFIGS', () => {
  it('contains Ethereum (chainId 1)', () => {
    expect(DEX_CONFIGS[1]).toBeDefined();
    expect(DEX_CONFIGS[1].name).toBe('Uniswap V2');
  });

  it('contains BSC (chainId 56)', () => {
    expect(DEX_CONFIGS[56]).toBeDefined();
    expect(DEX_CONFIGS[56].name).toBe('PancakeSwap');
  });

  it('contains Polygon (chainId 137)', () => {
    expect(DEX_CONFIGS[137]).toBeDefined();
    expect(DEX_CONFIGS[137].name).toBe('QuickSwap');
  });

  it('contains Arbitrum (chainId 42161)', () => {
    expect(DEX_CONFIGS[42161]).toBeDefined();
    expect(DEX_CONFIGS[42161].name).toBe('Uniswap V3');
  });

  it('each config has a valid router address', () => {
    for (const config of Object.values(DEX_CONFIGS)) {
      expect(config.routerAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
    }
  });

  it('each config has a valid factory address', () => {
    for (const config of Object.values(DEX_CONFIGS)) {
      expect(config.factoryAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
    }
  });

  it('each config has a valid WETH address', () => {
    for (const config of Object.values(DEX_CONFIGS)) {
      expect(config.wethAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
    }
  });

  it('each config has a name and logo', () => {
    for (const config of Object.values(DEX_CONFIGS)) {
      expect(config.name).toBeTruthy();
      expect(config.logo).toBeTruthy();
    }
  });

  it('Ethereum router address matches Uniswap V2', () => {
    // Well-known Uniswap V2 router
    expect(DEX_CONFIGS[1].routerAddress).toBe(
      '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
    );
  });

  it('Ethereum WETH address matches known WETH contract', () => {
    expect(DEX_CONFIGS[1].wethAddress).toBe(
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    );
  });

  it('BSC router address matches PancakeSwap V2', () => {
    expect(DEX_CONFIGS[56].routerAddress).toBe(
      '0x10ED43C718714eb63d5aA57B78B54704E256024E'
    );
  });
});
