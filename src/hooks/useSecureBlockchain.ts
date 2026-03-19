import { useState, useCallback, useEffect } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export interface KeyStatus {
  alchemy: boolean;
  infura: boolean;
}

export function useSecureBlockchain() {
  const [keyStatus, setKeyStatus] = useState<KeyStatus>({ alchemy: false, infura: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-cc38a303`;

  // Récupérer le statut des clés (sans les exposer)
  const fetchKeyStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await fetch(`${baseUrl}/keys/status`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`
        }
      });
      
      if (!res.ok) throw new Error("Erreur de connexion au serveur Supabase");
      
      const data = await res.json();
      setKeyStatus({
        alchemy: !!data.alchemy,
        infura: !!data.infura
      });
    } catch (err: any) {
      console.error("Erreur fetchKeyStatus:", err);
      setError(err.message || "Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  // Configurer une nouvelle clé de manière sécurisée
  const configureKey = async (provider: "alchemy" | "infura", apiKey: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await fetch(`${baseUrl}/keys/config`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ provider, apiKey })
      });
      
      if (!res.ok) throw new Error(`Erreur de configuration pour ${provider}`);
      
      await fetchKeyStatus(); // Refresh status
      return true;
    } catch (err: any) {
      console.error("Erreur configureKey:", err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Exécuter une requête RPC via le proxy sécurisé (multi-network)
  const proxyRpcCall = useCallback(async (provider: "alchemy" | "infura", method: string, params: any[] = [], network?: string) => {
    try {
      const networkParam = network ? `?network=${network}` : "";
      const res = await fetch(`${baseUrl}/rpc/proxy/${provider}${networkParam}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method,
          params
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Erreur RPC");
      }
      
      return await res.json();
    } catch (err: any) {
      // Only log non-auth errors to avoid console noise from expected auth failures
      if (!err?.message?.includes("401") && !err?.message?.includes("403") && !err?.message?.includes("authentification")) {
        console.error(`Erreur proxyRpcCall (${provider}):`, err);
      }
      throw err;
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchKeyStatus();
  }, [fetchKeyStatus]);

  // Test multi-network (6 réseaux Alchemy simultanément)
  const testMultiNetwork = useCallback(async () => {
    const networks = [
      { id: "eth-mainnet", name: "Ethereum Mainnet" },
      { id: "polygon-mainnet", name: "Polygon" },
      { id: "arb-mainnet", name: "Arbitrum" },
      { id: "opt-mainnet", name: "Optimism" },
      { id: "base-mainnet", name: "Base" },
      { id: "eth-sepolia", name: "Sepolia Testnet" }
    ];

    const results = await Promise.allSettled(
      networks.map(async (net) => {
        try {
          const startTime = performance.now();
          const res = await proxyRpcCall("alchemy", "eth_chainId", [], net.id);
          const latency = Math.round(performance.now() - startTime);
          
          if (res.error) {
            return {
              network: net.name,
              networkId: net.id,
              status: "error",
              error: res.error.message || "RPC error",
              latency
            };
          }
          
          return {
            network: net.name,
            networkId: net.id,
            status: "success",
            chainId: res.result,
            latency
          };
        } catch (err: any) {
          return {
            network: net.name,
            networkId: net.id,
            status: "error",
            error: err.message || "Network error",
            latency: 0
          };
        }
      })
    );

    return results.map((r, i) => {
      if (r.status === "fulfilled") return r.value;
      return {
        network: networks[i].name,
        networkId: networks[i].id,
        status: "error",
        error: r.reason?.message || "Promise rejected",
        latency: 0
      };
    });
  }, [proxyRpcCall]);

  return {
    keyStatus,
    isLoading,
    error,
    fetchKeyStatus,
    configureKey,
    proxyRpcCall,
    testMultiNetwork
  };
}