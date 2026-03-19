import { useEffect } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { NETWORKS } from "../utils/web3";
import { toast } from "sonner@2.0.3";

/**
 * Hook pour s'assurer que l'utilisateur est sur le bon réseau
 * 
 * @param requiredNetwork - Le réseau requis (ex: "ethereum", "sepolia")
 * @param autoSwitch - Si true, propose automatiquement de changer de réseau
 * @returns true si l'utilisateur est sur le bon réseau
 * 
 * @example
 * const isCorrectNetwork = useRequireNetwork("ethereum", true);
 * 
 * if (!isCorrectNetwork) {
 *   return <div>Veuillez changer de réseau vers Ethereum</div>;
 * }
 */
export function useRequireNetwork(
  requiredNetwork: keyof typeof NETWORKS,
  autoSwitch: boolean = false
): boolean {
  const { chainId, isConnected, switchToNetwork } = useWeb3();
  
  const requiredChainId = parseInt(NETWORKS[requiredNetwork].chainId, 16);
  const isCorrectNetwork = chainId === requiredChainId;

  useEffect(() => {
    if (isConnected && !isCorrectNetwork && autoSwitch) {
      const networkName = NETWORKS[requiredNetwork].chainName;
      
      toast.info("Réseau incorrect", {
        description: `Cette fonctionnalité nécessite ${networkName}`,
        action: {
          label: "Changer",
          onClick: () => switchToNetwork(requiredNetwork)
        },
        duration: 5000,
        style: { background: "#020202", border: "1px solid #d4af37", color: "#d4af37" }
      });
    }
  }, [isConnected, isCorrectNetwork, requiredNetwork, autoSwitch, switchToNetwork]);

  return isCorrectNetwork;
}
