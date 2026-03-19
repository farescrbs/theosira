import { useState, useEffect, useMemo } from "react";
import { ethers } from "npm:ethers@6.13.0";
import { useWeb3 } from "../contexts/Web3Context";

/**
 * Hook pour interagir avec un smart contract
 * 
 * @param address - Adresse du contrat
 * @param abi - ABI du contrat
 * @returns Contract instance (readonly ou avec signer)
 * 
 * @example
 * const lotteryABI = [...];
 * const contract = useContract("0x123...", lotteryABI);
 * 
 * // Lecture (view functions)
 * const winner = await contract.getWinner();
 * 
 * // Écriture (transactions)
 * const tx = await contract.buyTicket({ value: ethers.parseEther("0.1") });
 * await tx.wait();
 */
export function useContract(address: string | null, abi: any[]) {
  const { isConnected } = useWeb3();
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (!address || !isConnected || typeof window === "undefined") {
      setContract(null);
      return;
    }

    try {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        setContract(null);
        return;
      }

      const provider = new ethers.BrowserProvider(ethereum);
      
      // Create contract instance (readonly first)
      const readonlyContract = new ethers.Contract(address, abi, provider);
      
      // Try to get signer for write operations
      provider.getSigner().then(signer => {
        const writableContract = new ethers.Contract(address, abi, signer);
        setContract(writableContract);
      }).catch(() => {
        // If no signer available, use readonly
        setContract(readonlyContract);
      });
      
    } catch (error) {
      console.error("Error creating contract instance:", error);
      setContract(null);
    }
  }, [address, abi, isConnected]);

  return contract;
}

/**
 * Hook pour lire une valeur d'un contrat (view function)
 * 
 * @param contract - Instance du contrat
 * @param method - Nom de la méthode à appeler
 * @param args - Arguments de la méthode
 * @param refreshInterval - Intervalle de rafraîchissement en ms (optionnel)
 * @returns { data, loading, error, refetch }
 * 
 * @example
 * const contract = useContract(address, abi);
 * const { data: winner, loading, error } = useContractRead(
 *   contract, 
 *   "getWinner", 
 *   []
 * );
 */
export function useContractRead<T = any>(
  contract: ethers.Contract | null,
  method: string,
  args: any[] = [],
  refreshInterval?: number
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!contract) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await contract[method](...args);
      setData(result);
    } catch (err: any) {
      console.error(`Error calling ${method}:`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (refreshInterval) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [contract, method, JSON.stringify(args), refreshInterval]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook pour écrire dans un contrat (transaction)
 * 
 * @param contract - Instance du contrat
 * @param method - Nom de la méthode à appeler
 * @returns { write, loading, error, txHash }
 * 
 * @example
 * const contract = useContract(address, abi);
 * const { write: buyTicket, loading, txHash } = useContractWrite(
 *   contract,
 *   "buyTicket"
 * );
 * 
 * // Appeler la fonction
 * await buyTicket({ value: ethers.parseEther("0.1") });
 */
export function useContractWrite(
  contract: ethers.Contract | null,
  method: string
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const write = async (...args: any[]) => {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    try {
      setLoading(true);
      setError(null);
      setTxHash(null);

      // Last argument might be transaction options (value, gasLimit, etc.)
      const tx = await contract[method](...args);
      setTxHash(tx.hash);

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return receipt;
    } catch (err: any) {
      console.error(`Error calling ${method}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { write, loading, error, txHash };
}
