import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  blockchainMarketplace,
  fetchNFTsFromBlockchain,
  fetchCollectionsFromBlockchain,
  subscribeToMarketUpdates,
} from '../services/blockchainAPI';

// ──────────────────────────────────────────────────────────────────────────────
// fetchNFTsFromBlockchain
// ──────────────────────────────────────────────────────────────────────────────
describe('fetchNFTsFromBlockchain', () => {
  it('returns an array of NFT objects', async () => {
    const nfts = await fetchNFTsFromBlockchain();
    expect(Array.isArray(nfts)).toBe(true);
    expect(nfts.length).toBeGreaterThan(0);
  });

  it('each NFT has the required fields', async () => {
    const nfts = await fetchNFTsFromBlockchain('Ethereum');
    for (const nft of nfts) {
      expect(nft).toHaveProperty('id');
      expect(nft).toHaveProperty('name');
      expect(nft).toHaveProperty('price');
      expect(nft).toHaveProperty('currency');
      expect(nft).toHaveProperty('rarity');
      expect(nft).toHaveProperty('blockchain');
      expect(nft).toHaveProperty('verified');
    }
  });

  it('rarity values are within the allowed set', async () => {
    const nfts = await fetchNFTsFromBlockchain();
    const allowedRarities = ['Common', 'Rare', 'Epic', 'Legendary'];
    for (const nft of nfts) {
      expect(allowedRarities).toContain(nft.rarity);
    }
  });

  it('prices are positive numbers', async () => {
    const nfts = await fetchNFTsFromBlockchain();
    for (const nft of nfts) {
      expect(nft.price).toBeGreaterThan(0);
    }
  });

  it('returns empty array on internal error', async () => {
    const fetchNFTsSpy = vi.spyOn(blockchainMarketplace, 'fetchNFTs').mockRejectedValueOnce(
      new Error('RPC error')
    );
    const result = await fetchNFTsFromBlockchain();
    expect(result).toEqual([]);
    fetchNFTsSpy.mockRestore();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// fetchCollectionsFromBlockchain
// ──────────────────────────────────────────────────────────────────────────────
describe('fetchCollectionsFromBlockchain', () => {
  it('returns an array of collections', async () => {
    const collections = await fetchCollectionsFromBlockchain();
    expect(Array.isArray(collections)).toBe(true);
    expect(collections.length).toBeGreaterThan(0);
  });

  it('each collection has the required fields', async () => {
    const collections = await fetchCollectionsFromBlockchain();
    for (const col of collections) {
      expect(col).toHaveProperty('id');
      expect(col).toHaveProperty('name');
      expect(col).toHaveProperty('floor');
      expect(col).toHaveProperty('volume');
      expect(col).toHaveProperty('items');
      expect(col).toHaveProperty('owners');
      expect(col).toHaveProperty('change24h');
      expect(col).toHaveProperty('verified');
      expect(col).toHaveProperty('blockchain');
    }
  });

  it('floor prices are positive', async () => {
    const collections = await fetchCollectionsFromBlockchain();
    for (const col of collections) {
      expect(col.floor).toBeGreaterThan(0);
    }
  });

  it('returns empty array on error', async () => {
    const spy = vi.spyOn(blockchainMarketplace, 'fetchCollections').mockRejectedValueOnce(
      new Error('Network error')
    );
    const result = await fetchCollectionsFromBlockchain();
    expect(result).toEqual([]);
    spy.mockRestore();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// subscribeToMarketUpdates (real-time)
// ──────────────────────────────────────────────────────────────────────────────
describe('subscribeToMarketUpdates', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the callback with a PRICE_UPDATE event after 3 seconds', () => {
    const callback = vi.fn();
    const unsubscribe = subscribeToMarketUpdates(callback);

    vi.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(1);
    const update = callback.mock.calls[0][0];
    expect(update).toHaveProperty('type', 'PRICE_UPDATE');
    expect(update).toHaveProperty('timestamp');
    expect(update).toHaveProperty('changes');
    expect(Array.isArray(update.changes)).toBe(true);

    unsubscribe();
  });

  it('calls the callback multiple times with repeated intervals', () => {
    const callback = vi.fn();
    const unsubscribe = subscribeToMarketUpdates(callback);

    vi.advanceTimersByTime(9000);
    expect(callback).toHaveBeenCalledTimes(3);

    unsubscribe();
  });

  it('stops calling the callback after unsubscribe', () => {
    const callback = vi.fn();
    const unsubscribe = subscribeToMarketUpdates(callback);

    vi.advanceTimersByTime(3000);
    unsubscribe();
    vi.advanceTimersByTime(6000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
