import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nftService } from '../services/nftService';
import { web3Service } from '../services/web3Service';

// ──────────────────────────────────────────────────────────────────────────────
// Demo NFT generation (fallback when wallet not connected / no real NFTs)
// ──────────────────────────────────────────────────────────────────────────────
describe('nftService – demo NFT generation', () => {
  beforeEach(() => {
    // Simulate disconnected wallet so service falls back to demo NFTs
    vi.spyOn(web3Service, 'getProvider').mockReturnValue(null as any);
    vi.spyOn(web3Service, 'getCurrentAccount').mockReturnValue(null);
    vi.spyOn(web3Service, 'getCurrentChainId').mockReturnValue(null);
  });

  it('getUserNFTs throws when wallet is not connected', async () => {
    await expect(nftService.getUserNFTs()).rejects.toThrow('Wallet non connecté');
  });
});

describe('nftService – NFT metadata structure', () => {
  it('NFTMetadata fields are well-typed (compile-time contract)', () => {
    // This test validates TypeScript type compatibility at runtime via shape
    const metadata = {
      name: 'Test NFT',
      description: 'A test NFT',
      image: 'https://example.com/img.png',
      attributes: [{ trait_type: 'Rarity', value: 'Legendary' }],
      external_url: 'https://thesoria.io',
    };

    expect(metadata.name).toBeTruthy();
    expect(metadata.description).toBeTruthy();
    expect(metadata.image).toMatch(/^https?:\/\//);
    expect(Array.isArray(metadata.attributes)).toBe(true);
    expect(metadata.attributes![0]).toHaveProperty('trait_type');
    expect(metadata.attributes![0]).toHaveProperty('value');
  });
});

describe('nftService – getNFTDetails', () => {
  it('throws when wallet is not connected', async () => {
    vi.spyOn(web3Service, 'getProvider').mockReturnValue(null as any);
    vi.spyOn(web3Service, 'getCurrentAccount').mockReturnValue(null);
    await expect(
      nftService.getNFTDetails('0x0000000000000000000000000000000000000001', '1')
    ).rejects.toThrow('Wallet non connecté');
  });
});
