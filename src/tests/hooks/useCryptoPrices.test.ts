import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCryptoPrices } from '../../hooks/useCryptoPrices';

const CACHE_KEY = 'thesoria_crypto_prices_cache';
const FIVE_MINUTES = 5 * 60 * 1000;

const mockApiData = {
  ethereum: { usd: 3000, usd_24h_change: 1.5 },
  tether: { usd: 1, usd_24h_change: 0.01 },
  'usd-coin': { usd: 1, usd_24h_change: -0.01 },
  dai: { usd: 1, usd_24h_change: 0 },
  'wrapped-bitcoin': { usd: 60000, usd_24h_change: 2.5 },
  'matic-network': { usd: 0.8, usd_24h_change: -1 },
};

describe('useCryptoPrices', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(global, 'fetch');
    vi.spyOn(global, 'setInterval');
    vi.spyOn(global, 'clearInterval');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('starts with loading=true and prices=null', () => {
    // Don't resolve fetch yet – just check initial state synchronously
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useCryptoPrices());
    expect(result.current.loading).toBe(true);
    expect(result.current.prices).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('fetches prices from API and normalizes keys', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockApiData,
    } as Response);

    const { result } = renderHook(() => useCryptoPrices());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.prices?.ETH.usd).toBe(3000);
    expect(result.current.prices?.WETH.usd).toBe(3000);
    expect(result.current.prices?.USDT.usd).toBe(1);
    expect(result.current.prices?.WBTC.usd).toBe(60000);
    expect(result.current.prices?.MATIC.usd).toBe(0.8);
    expect(result.current.error).toBeNull();
  });

  it('saves fetched data to localStorage cache', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockApiData,
    } as Response);

    const { result } = renderHook(() => useCryptoPrices());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const cached = localStorage.getItem(CACHE_KEY);
    expect(cached).not.toBeNull();
    const { data } = JSON.parse(cached!);
    expect(data.ETH.usd).toBe(3000);
  });

  it('uses cached data when cache is fresh (< 5 minutes old)', async () => {
    const cachedPrices = {
      ETH: { usd: 9999, usd_24h_change: 0 },
      WETH: { usd: 9999, usd_24h_change: 0 },
      USDT: { usd: 1, usd_24h_change: 0 },
      USDC: { usd: 1, usd_24h_change: 0 },
      DAI: { usd: 1, usd_24h_change: 0 },
      WBTC: { usd: 50000, usd_24h_change: 0 },
      MATIC: { usd: 0.5, usd_24h_change: 0 },
    };

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), data: cachedPrices })
    );

    const { result } = renderHook(() => useCryptoPrices());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Should use cache, not fetch
    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.prices?.ETH.usd).toBe(9999);
  });

  it('ignores stale cache (> 5 minutes old) and re-fetches', async () => {
    const stalePrices = { ETH: { usd: 1111, usd_24h_change: 0 } };

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now() - FIVE_MINUTES - 1000,
        data: stalePrices,
      })
    );

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockApiData,
    } as Response);

    const { result } = renderHook(() => useCryptoPrices());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetch).toHaveBeenCalled();
    expect(result.current.prices?.ETH.usd).toBe(3000);
  });

  it('falls back to stale cache on API failure', async () => {
    const cachedPrices = {
      ETH: { usd: 2500, usd_24h_change: 0 },
      WETH: { usd: 2500, usd_24h_change: 0 },
      USDT: { usd: 1, usd_24h_change: 0 },
      USDC: { usd: 1, usd_24h_change: 0 },
      DAI: { usd: 1, usd_24h_change: 0 },
      WBTC: { usd: 50000, usd_24h_change: 0 },
      MATIC: { usd: 0.5, usd_24h_change: 0 },
    };

    // Stale cache
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now() - FIVE_MINUTES - 1000,
        data: cachedPrices,
      })
    );

    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useCryptoPrices());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Should use stale cache as fallback
    expect(result.current.prices?.ETH.usd).toBe(2500);
    expect(result.current.error).toBeTruthy();
  });

  it('uses hardcoded defaults when API fails and no cache exists', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useCryptoPrices());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.prices?.ETH.usd).toBe(2500);
    expect(result.current.prices?.WBTC.usd).toBe(50000);
    expect(result.current.prices?.MATIC.usd).toBe(0.5);
    expect(result.current.error).toBeTruthy();
  });

  it('sets error message when API returns non-ok status', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({}),
    } as Response);

    const { result } = renderHook(() => useCryptoPrices());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toMatch(/429/);
  });

  it('sets loading to false after fetch completes', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockApiData,
    } as Response);

    const { result } = renderHook(() => useCryptoPrices());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.loading).toBe(false);
  });

  it('exposes a refreshPrices function', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockApiData,
    } as Response);

    const { result } = renderHook(() => useCryptoPrices());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(typeof result.current.refreshPrices).toBe('function');
  });

  it('refreshPrices re-fetches and updates prices', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiData,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockApiData,
          ethereum: { usd: 4000, usd_24h_change: 5 },
        }),
      } as Response);

    const { result } = renderHook(() => useCryptoPrices());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.prices?.ETH.usd).toBe(3000);

    // Clear cache so refresh actually hits the API
    localStorage.clear();
    await result.current.refreshPrices();

    await waitFor(() => expect(result.current.prices?.ETH.usd).toBe(4000));
  });

  it('includes all expected token symbols', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockApiData,
    } as Response);

    const { result } = renderHook(() => useCryptoPrices());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const expectedSymbols = ['ETH', 'WETH', 'USDT', 'USDC', 'DAI', 'WBTC', 'MATIC'];
    expectedSymbols.forEach((sym) => {
      expect(result.current.prices).toHaveProperty(sym);
    });
  });

  it('sets up a refresh interval and clears it on unmount', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockApiData,
    } as Response);

    const { result, unmount } = renderHook(() => useCryptoPrices());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(setInterval).toHaveBeenCalled();
    unmount();
    expect(clearInterval).toHaveBeenCalled();
  });
});

