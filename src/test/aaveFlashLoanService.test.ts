import { describe, it, expect } from 'vitest';
import {
  AAVE_V3_ADDRESSES,
  FLASH_LOAN_CONFIG,
  FLASH_LOAN_STRATEGIES,
  SUPPORTED_FLASH_LOAN_TOKENS,
  InterestRateMode,
  calculateFlashLoanFee,
  calculateTotalRepayment,
  isFlashLoanProfitable,
  prepareFlashLoanParams,
  prepareFlashLoanSimpleParams,
} from '../services/aaveFlashLoanService';

// ──────────────────────────────────────────────────────────────────────────────
// Contract address sanity checks
// ──────────────────────────────────────────────────────────────────────────────
describe('AAVE_V3_ADDRESSES', () => {
  it('POOL address starts with 0x and is 42 chars', () => {
    expect(AAVE_V3_ADDRESSES.POOL).toMatch(/^0x[0-9a-fA-F]{40}$/);
  });

  it('all addresses are valid hex strings', () => {
    for (const addr of Object.values(AAVE_V3_ADDRESSES)) {
      expect(addr).toMatch(/^0x[0-9a-fA-F]{40}$/);
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// FLASH_LOAN_CONFIG
// ──────────────────────────────────────────────────────────────────────────────
describe('FLASH_LOAN_CONFIG', () => {
  it('PREMIUM_TOTAL is 9 (0.09%)', () => {
    expect(FLASH_LOAN_CONFIG.PREMIUM_TOTAL).toBe(9);
  });

  it('MAX_UINT is the correct uint256 max', () => {
    expect(FLASH_LOAN_CONFIG.MAX_UINT).toBe(
      '115792089237316195423570985008687907853269984665640564039457584007913129639935'
    );
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// InterestRateMode enum
// ──────────────────────────────────────────────────────────────────────────────
describe('InterestRateMode', () => {
  it('NONE = 0', () => expect(InterestRateMode.NONE).toBe(0));
  it('STABLE = 1', () => expect(InterestRateMode.STABLE).toBe(1));
  it('VARIABLE = 2', () => expect(InterestRateMode.VARIABLE).toBe(2));
});

// ──────────────────────────────────────────────────────────────────────────────
// calculateFlashLoanFee
// ──────────────────────────────────────────────────────────────────────────────
describe('calculateFlashLoanFee', () => {
  it('returns 0 fee for amount 0', () => {
    expect(calculateFlashLoanFee('0')).toBe('0');
  });

  it('computes 0.09% fee for 10 000 units', () => {
    // 10000 * 9 / 10000 = 9
    expect(calculateFlashLoanFee('10000')).toBe('9');
  });

  it('computes 0.09% fee for 1 000 000 units', () => {
    // 1000000 * 9 / 10000 = 900
    expect(calculateFlashLoanFee('1000000')).toBe('900');
  });

  it('rounds down for non-divisible amounts', () => {
    // 100 * 9 / 10000 = 0 (BigInt integer division)
    expect(calculateFlashLoanFee('100')).toBe('0');
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// calculateTotalRepayment
// ──────────────────────────────────────────────────────────────────────────────
describe('calculateTotalRepayment', () => {
  it('returns amount + fee', () => {
    // amount = 10000, fee = 9 → total = 10009
    expect(calculateTotalRepayment('10000')).toBe('10009');
  });

  it('returns original amount when fee rounds to zero', () => {
    expect(calculateTotalRepayment('100')).toBe('100');
  });

  it('handles large amounts correctly', () => {
    const amount = '1000000000000000000'; // 1 ETH in wei
    const fee = calculateFlashLoanFee(amount);
    const expectedTotal = (BigInt(amount) + BigInt(fee)).toString();
    expect(calculateTotalRepayment(amount)).toBe(expectedTotal);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// isFlashLoanProfitable
// ──────────────────────────────────────────────────────────────────────────────
describe('isFlashLoanProfitable', () => {
  it('returns true when profit greatly exceeds cost', () => {
    // amount = 1 000 000, fee = 900, gasEstimate = 200000, gasPrice = 1
    // gasCost = 200000, totalCost = 900 + 200000 = 200900, profit = 1000000
    expect(isFlashLoanProfitable('1000000', '1000000', 200000, '1')).toBe(true);
  });

  it('returns false when profit is less than total cost', () => {
    // amount = 10000, fee = 9, gasCost = 200 * 50 = 10000, totalCost = 10009
    // profit = 100 → not profitable
    expect(isFlashLoanProfitable('10000', '100', 200, '50')).toBe(false);
  });

  it('returns false when profit equals total cost (must be strictly greater)', () => {
    // amount = 10000, fee = 9, gasEstimate = 1, gasPrice = 0 → totalCost = 9, profit = 9
    expect(isFlashLoanProfitable('10000', '9', 0, '0')).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// prepareFlashLoanParams
// ──────────────────────────────────────────────────────────────────────────────
describe('prepareFlashLoanParams', () => {
  const RECEIVER = '0xReceiverAddress';
  const ASSETS = ['0xToken1', '0xToken2'];
  const AMOUNTS = ['1000', '2000'];

  it('returns a valid FlashLoanParams object', () => {
    const params = prepareFlashLoanParams(RECEIVER, ASSETS, AMOUNTS);
    expect(params.receiverAddress).toBe(RECEIVER);
    expect(params.assets).toEqual(ASSETS);
    expect(params.amounts).toEqual(AMOUNTS);
    expect(params.referralCode).toBe(0);
    expect(params.params).toBe('0x');
  });

  it('defaults onBehalfOf to receiverAddress when not provided', () => {
    const params = prepareFlashLoanParams(RECEIVER, ASSETS, AMOUNTS);
    expect(params.onBehalfOf).toBe(RECEIVER);
  });

  it('defaults interestRateModes to NONE for each asset', () => {
    const params = prepareFlashLoanParams(RECEIVER, ASSETS, AMOUNTS);
    expect(params.interestRateModes).toEqual([
      InterestRateMode.NONE,
      InterestRateMode.NONE,
    ]);
  });

  it('accepts custom interest rate modes', () => {
    const modes = [InterestRateMode.STABLE, InterestRateMode.VARIABLE];
    const params = prepareFlashLoanParams(RECEIVER, ASSETS, AMOUNTS, modes);
    expect(params.interestRateModes).toEqual(modes);
  });

  it('accepts custom params string', () => {
    const customParams = '0xdeadbeef';
    const params = prepareFlashLoanParams(RECEIVER, ASSETS, AMOUNTS, [], undefined, customParams);
    expect(params.params).toBe(customParams);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// prepareFlashLoanSimpleParams
// ──────────────────────────────────────────────────────────────────────────────
describe('prepareFlashLoanSimpleParams', () => {
  it('returns correct FlashLoanSimpleParams', () => {
    const params = prepareFlashLoanSimpleParams(
      '0xReceiver',
      '0xAsset',
      '5000'
    );
    expect(params.receiverAddress).toBe('0xReceiver');
    expect(params.asset).toBe('0xAsset');
    expect(params.amount).toBe('5000');
    expect(params.params).toBe('0x');
    expect(params.referralCode).toBe(0);
  });

  it('accepts a custom params string', () => {
    const params = prepareFlashLoanSimpleParams('0xR', '0xA', '100', '0xcafe');
    expect(params.params).toBe('0xcafe');
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// FLASH_LOAN_STRATEGIES
// ──────────────────────────────────────────────────────────────────────────────
describe('FLASH_LOAN_STRATEGIES', () => {
  it('has at least one strategy', () => {
    expect(FLASH_LOAN_STRATEGIES.length).toBeGreaterThan(0);
  });

  it('each strategy has required fields', () => {
    for (const s of FLASH_LOAN_STRATEGIES) {
      expect(s).toHaveProperty('id');
      expect(s).toHaveProperty('name');
      expect(s).toHaveProperty('description');
      expect(['low', 'medium', 'high']).toContain(s.riskLevel);
      expect(typeof s.minProfit).toBe('number');
      expect(typeof s.maxRisk).toBe('number');
      expect(typeof s.enabled).toBe('boolean');
    }
  });

  it('strategy ids are unique', () => {
    const ids = FLASH_LOAN_STRATEGIES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// SUPPORTED_FLASH_LOAN_TOKENS
// ──────────────────────────────────────────────────────────────────────────────
describe('SUPPORTED_FLASH_LOAN_TOKENS', () => {
  it('includes USDT, USDC, and DAI at minimum', () => {
    const symbols = SUPPORTED_FLASH_LOAN_TOKENS.map((t) => t.symbol);
    expect(symbols).toContain('USDT');
    expect(symbols).toContain('USDC');
    expect(symbols).toContain('DAI');
  });

  it('each token has a valid address', () => {
    for (const token of SUPPORTED_FLASH_LOAN_TOKENS) {
      expect(token.address).toMatch(/^0x[0-9a-fA-F]{40}$/);
    }
  });

  it('each token has decimals > 0', () => {
    for (const token of SUPPORTED_FLASH_LOAN_TOKENS) {
      expect(token.decimals).toBeGreaterThan(0);
    }
  });
});
