/**
 * useAutonomousAI — React hook for the Autonomous AI Flash Loan Engine
 *
 * Manages engine lifecycle, syncs state to React, exposes controls to the UI.
 */

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import {
  autonomousAIEngine,
  EngineState,
  EngineEventType,
  Opportunity,
} from "../services/autonomousAIEngine";

export interface UseAutonomousAIReturn {
  engineState: EngineState;
  isConnected: boolean;
  walletAddress: string | null;
  walletBalance: string | null;
  connectWallet: () => Promise<void>;
  startEngine: () => Promise<void>;
  stopEngine: () => void;
  executeNow: () => Promise<{ success: boolean; txHash?: string; profitETH?: number; error?: string }>;
  bestOpportunity: Opportunity | null;
  lastEvent: { type: EngineEventType; data: any } | null;
}

export function useAutonomousAI(): UseAutonomousAIReturn {
  const [engineState, setEngineState] = useState<EngineState>(
    autonomousAIEngine.getState()
  );
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [lastEvent, setLastEvent] = useState<{ type: EngineEventType; data: any } | null>(null);

  // Subscribe to engine events
  useEffect(() => {
    const unsubscribe = autonomousAIEngine.subscribe((type, data) => {
      setEngineState({ ...autonomousAIEngine.getState() });
      setLastEvent({ type, data });
    });
    return unsubscribe;
  }, []);

  // Check if wallet already connected on mount
  useEffect(() => {
    const check = async () => {
      const ethereum = (window as any)?.ethereum;
      if (!ethereum) return;
      try {
        const accounts: string[] = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          await initProvider(accounts[0]);
        }
      } catch {}
    };
    check();
  }, []);

  async function initProvider(address: string) {
    const ethereum = (window as any).ethereum;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const balanceWei = await provider.getBalance(address);
    const balance = parseFloat(ethers.formatEther(balanceWei)).toFixed(4);

    setIsConnected(true);
    setWalletAddress(address);
    setWalletBalance(balance);

    autonomousAIEngine.setProvider(provider, signer, address);
  }

  const connectWallet = useCallback(async () => {
    const ethereum = (window as any)?.ethereum;
    if (!ethereum) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    const accounts: string[] = await ethereum.request({
      method: "eth_requestAccounts",
    });
    if (accounts.length > 0) {
      await initProvider(accounts[0]);
    }
  }, []);

  const startEngine = useCallback(async () => {
    await autonomousAIEngine.start();
  }, []);

  const stopEngine = useCallback(() => {
    autonomousAIEngine.stop();
    setEngineState({ ...autonomousAIEngine.getState() });
  }, []);

  const executeNow = useCallback(async () => {
    return autonomousAIEngine.executeBestOpportunity();
  }, []);

  const bestOpportunity = autonomousAIEngine.getBestOpportunity();

  return {
    engineState,
    isConnected,
    walletAddress,
    walletBalance,
    connectWallet,
    startEngine,
    stopEngine,
    executeNow,
    bestOpportunity,
    lastEvent,
  };
}
