import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRequireNetwork } from '../../hooks/useRequireNetwork';

// ─── Mock dependencies ─────────────────────────────────────
const mockSwitchToNetwork = vi.fn();

vi.mock('sonner@2.0.3', () => ({
  toast: {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../contexts/Web3Context', () => ({
  useWeb3: vi.fn(),
}));

vi.mock('../../utils/web3', () => ({
  NETWORKS: {
    ethereum: {
      chainId: '0x1',
      chainName: 'Ethereum Mainnet',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: ['https://eth-mainnet.g.alchemy.com/v2/demo'],
      blockExplorerUrls: ['https://etherscan.io'],
    },
    sepolia: {
      chainId: '0xaa36a7',
      chainName: 'Sepolia Testnet',
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/demo'],
      blockExplorerUrls: ['https://sepolia.etherscan.io'],
    },
    polygon: {
      chainId: '0x89',
      chainName: 'Polygon Mainnet',
      nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
      rpcUrls: ['https://polygon-rpc.com'],
      blockExplorerUrls: ['https://polygonscan.com'],
    },
    arbitrum: {
      chainId: '0xa4b1',
      chainName: 'Arbitrum One',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: ['https://arb1.arbitrum.io/rpc'],
      blockExplorerUrls: ['https://arbiscan.io'],
    },
  },
}));

import { useWeb3 } from '../../contexts/Web3Context';
import { toast } from 'sonner@2.0.3';

// ─── Helpers ───────────────────────────────────────────────
function mockWeb3(chainId: number | null, isConnected = true) {
  vi.mocked(useWeb3).mockReturnValue({
    chainId,
    isConnected,
    switchToNetwork: mockSwitchToNetwork,
    address: null,
    balance: null,
    isLoading: false,
    connect: vi.fn(),
    disconnect: vi.fn(),
  });
}

describe('useRequireNetwork', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Ethereum mainnet = chainId 1 (0x1)
  it('returns true when chainId matches the required network (ethereum)', () => {
    mockWeb3(1);
    const { result } = renderHook(() => useRequireNetwork('ethereum'));
    expect(result.current).toBe(true);
  });

  it('returns false when chainId does not match (wrong network)', () => {
    mockWeb3(137); // Polygon
    const { result } = renderHook(() => useRequireNetwork('ethereum'));
    expect(result.current).toBe(false);
  });

  it('returns false when chainId is null (not connected)', () => {
    mockWeb3(null, false);
    const { result } = renderHook(() => useRequireNetwork('ethereum'));
    expect(result.current).toBe(false);
  });

  it('returns true for polygon when chainId=137 (0x89)', () => {
    mockWeb3(137);
    const { result } = renderHook(() => useRequireNetwork('polygon'));
    expect(result.current).toBe(true);
  });

  it('returns true for sepolia when chainId matches 0xaa36a7', () => {
    const sepoliaChainId = parseInt('0xaa36a7', 16); // 11155111
    mockWeb3(sepoliaChainId);
    const { result } = renderHook(() => useRequireNetwork('sepolia'));
    expect(result.current).toBe(true);
  });

  it('returns true for arbitrum when chainId=42161 (0xa4b1)', () => {
    mockWeb3(42161);
    const { result } = renderHook(() => useRequireNetwork('arbitrum'));
    expect(result.current).toBe(true);
  });

  describe('autoSwitch=true', () => {
    it('shows toast.info when connected but on wrong network', async () => {
      mockWeb3(137, true); // connected to Polygon, need Ethereum
      renderHook(() => useRequireNetwork('ethereum', true));

      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith(
          'Réseau incorrect',
          expect.objectContaining({
            description: expect.stringContaining('Ethereum Mainnet'),
          })
        );
      });
    });

    it('toast action "Changer" calls switchToNetwork', async () => {
      mockWeb3(1, true); // On wrong chain (need polygon)
      renderHook(() => useRequireNetwork('polygon', true));

      await waitFor(() => expect(toast.info).toHaveBeenCalled());

      const toastCall = vi.mocked(toast.info).mock.calls[0];
      const options = toastCall[1] as any;
      act(() => options.action.onClick());

      expect(mockSwitchToNetwork).toHaveBeenCalledWith('polygon');
    });

    it('does not show toast when not connected', () => {
      mockWeb3(null, false);
      renderHook(() => useRequireNetwork('ethereum', true));
      expect(toast.info).not.toHaveBeenCalled();
    });

    it('does not show toast when already on correct network', () => {
      mockWeb3(1, true);
      renderHook(() => useRequireNetwork('ethereum', true));
      expect(toast.info).not.toHaveBeenCalled();
    });
  });

  describe('autoSwitch=false (default)', () => {
    it('does not show toast when autoSwitch is false and on wrong network', () => {
      mockWeb3(137, true);
      renderHook(() => useRequireNetwork('ethereum', false));
      expect(toast.info).not.toHaveBeenCalled();
    });

    it('does not show toast when autoSwitch is omitted', () => {
      mockWeb3(137, true);
      renderHook(() => useRequireNetwork('ethereum'));
      expect(toast.info).not.toHaveBeenCalled();
    });
  });
});
