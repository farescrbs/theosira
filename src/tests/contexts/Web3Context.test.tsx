import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { Web3Provider, useWeb3 } from '../../contexts/Web3Context';

// ─── Mock dependencies ─────────────────────────────────────
vi.mock('sonner@2.0.3', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('../../utils/web3', () => ({
  connectWallet: vi.fn(),
  disconnectWallet: vi.fn(),
  getCurrentAccount: vi.fn(),
  getBalance: vi.fn(),
  onAccountsChanged: vi.fn(() => () => {}),
  onChainChanged: vi.fn(() => () => {}),
  isMetaMaskInstalled: vi.fn(),
  switchNetwork: vi.fn(),
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
      nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
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

import {
  connectWallet,
  disconnectWallet,
  getCurrentAccount,
  getBalance,
  isMetaMaskInstalled,
  switchNetwork,
} from '../../utils/web3';

// ─── Helpers ───────────────────────────────────────────────
const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Web3Provider, null, children);

describe('useWeb3 – outside provider', () => {
  it('throws when used outside Web3Provider', () => {
    // Suppress the error output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useWeb3())).toThrow(
      'useWeb3 must be used within Web3Provider'
    );
    consoleSpy.mockRestore();
  });
});

describe('Web3Provider – initial state', () => {
  beforeEach(() => {
    vi.mocked(getCurrentAccount).mockResolvedValue(null);
    vi.mocked(isMetaMaskInstalled).mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('starts with isConnected=false', async () => {
    const { result } = renderHook(() => useWeb3(), { wrapper });
    await waitFor(() => expect(vi.mocked(getCurrentAccount)).toHaveBeenCalled());
    expect(result.current.isConnected).toBe(false);
  });

  it('starts with address=null', async () => {
    const { result } = renderHook(() => useWeb3(), { wrapper });
    await waitFor(() => expect(vi.mocked(getCurrentAccount)).toHaveBeenCalled());
    expect(result.current.address).toBeNull();
  });

  it('starts with balance=null', async () => {
    const { result } = renderHook(() => useWeb3(), { wrapper });
    await waitFor(() => expect(vi.mocked(getCurrentAccount)).toHaveBeenCalled());
    expect(result.current.balance).toBeNull();
  });

  it('starts with isLoading=false', async () => {
    const { result } = renderHook(() => useWeb3(), { wrapper });
    await waitFor(() => expect(vi.mocked(getCurrentAccount)).toHaveBeenCalled());
    expect(result.current.isLoading).toBe(false);
  });

  it('checks connection on mount via getCurrentAccount', async () => {
    renderHook(() => useWeb3(), { wrapper });
    await waitFor(() => expect(vi.mocked(getCurrentAccount)).toHaveBeenCalledOnce());
  });
});

describe('Web3Provider – auto-connect on mount', () => {
  const mockAddress = '0xAbCdEfAbCdEfAbCdEfAbCdEfAbCdEfAbCdEfAbCd';

  beforeEach(() => {
    vi.mocked(getCurrentAccount).mockResolvedValue(mockAddress);
    vi.mocked(getBalance).mockResolvedValue('1.5');
    vi.mocked(isMetaMaskInstalled).mockReturnValue(true);
    (window as any).ethereum = {
      isMetaMask: true,
      request: vi.fn().mockResolvedValue('0x1'),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
    (window as any).ethereum = undefined;
  });

  it('sets address when already connected', async () => {
    const { result } = renderHook(() => useWeb3(), { wrapper });
    await waitFor(() => expect(result.current.address).toBe(mockAddress));
  });

  it('sets balance when already connected', async () => {
    const { result } = renderHook(() => useWeb3(), { wrapper });
    await waitFor(() => expect(result.current.balance).toBe('1.5'));
  });

  it('sets isConnected=true when already connected', async () => {
    const { result } = renderHook(() => useWeb3(), { wrapper });
    await waitFor(() => expect(result.current.isConnected).toBe(true));
  });
});

describe('Web3Provider – connect()', () => {
  afterEach(() => {
    vi.clearAllMocks();
    (window as any).ethereum = undefined;
  });

  it('opens MetaMask download page when MetaMask is not installed', async () => {
    vi.mocked(getCurrentAccount).mockResolvedValue(null);
    vi.mocked(isMetaMaskInstalled).mockReturnValue(false);
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    const { result } = renderHook(() => useWeb3(), { wrapper });
    await act(async () => { await result.current.connect(); });

    expect(openSpy).toHaveBeenCalledWith('https://metamask.io/download/', '_blank');
    openSpy.mockRestore();
  });

  it('sets isConnected=true on successful connect', async () => {
    vi.mocked(getCurrentAccount).mockResolvedValue(null);
    vi.mocked(isMetaMaskInstalled).mockReturnValue(true);
    vi.mocked(connectWallet).mockResolvedValue({
      address: '0x1234',
      balance: '2.0',
      chainId: 1,
    });

    const { result } = renderHook(() => useWeb3(), { wrapper });
    await act(async () => { await result.current.connect(); });

    expect(result.current.isConnected).toBe(true);
    expect(result.current.address).toBe('0x1234');
    expect(result.current.balance).toBe('2.0');
  });

  it('sets isLoading=false after connection attempt', async () => {
    vi.mocked(getCurrentAccount).mockResolvedValue(null);
    vi.mocked(isMetaMaskInstalled).mockReturnValue(true);
    vi.mocked(connectWallet).mockResolvedValue({
      address: '0x1234',
      balance: '0',
      chainId: 1,
    });

    const { result } = renderHook(() => useWeb3(), { wrapper });
    await act(async () => { await result.current.connect(); });

    expect(result.current.isLoading).toBe(false);
  });

  it('does not throw on connect failure (handles internally)', async () => {
    vi.mocked(getCurrentAccount).mockResolvedValue(null);
    vi.mocked(isMetaMaskInstalled).mockReturnValue(true);
    vi.mocked(connectWallet).mockRejectedValue(new Error('User rejected'));

    const { result } = renderHook(() => useWeb3(), { wrapper });

    await expect(
      act(async () => { await result.current.connect(); })
    ).resolves.not.toThrow();
  });
});

describe('Web3Provider – disconnect()', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sets isConnected=false after disconnect', async () => {
    vi.mocked(getCurrentAccount).mockResolvedValue(null);
    vi.mocked(isMetaMaskInstalled).mockReturnValue(true);
    vi.mocked(connectWallet).mockResolvedValue({
      address: '0xabc',
      balance: '1',
      chainId: 1,
    });
    vi.mocked(disconnectWallet).mockReturnValue(undefined);

    const { result } = renderHook(() => useWeb3(), { wrapper });

    await act(async () => { await result.current.connect(); });
    expect(result.current.isConnected).toBe(true);

    act(() => { result.current.disconnect(); });
    expect(result.current.isConnected).toBe(false);
    expect(result.current.address).toBeNull();
    expect(result.current.balance).toBeNull();
  });

  it('calls disconnectWallet utility', async () => {
    vi.mocked(getCurrentAccount).mockResolvedValue(null);
    vi.mocked(isMetaMaskInstalled).mockReturnValue(true);
    vi.mocked(connectWallet).mockResolvedValue({
      address: '0xabc',
      balance: '1',
      chainId: 1,
    });
    vi.mocked(disconnectWallet).mockReturnValue(undefined);

    const { result } = renderHook(() => useWeb3(), { wrapper });

    await act(async () => { await result.current.connect(); });
    act(() => { result.current.disconnect(); });

    expect(disconnectWallet).toHaveBeenCalled();
  });
});

describe('Web3Provider – switchToNetwork()', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls switchNetwork with the provided network key', async () => {
    vi.mocked(getCurrentAccount).mockResolvedValue(null);
    vi.mocked(switchNetwork).mockResolvedValue(undefined);

    const { result } = renderHook(() => useWeb3(), { wrapper });
    await act(async () => { await result.current.switchToNetwork('polygon'); });

    expect(switchNetwork).toHaveBeenCalledWith('polygon');
  });

  it('sets isLoading=false after network switch', async () => {
    vi.mocked(getCurrentAccount).mockResolvedValue(null);
    vi.mocked(switchNetwork).mockResolvedValue(undefined);

    const { result } = renderHook(() => useWeb3(), { wrapper });
    await act(async () => { await result.current.switchToNetwork('ethereum'); });

    expect(result.current.isLoading).toBe(false);
  });
});
