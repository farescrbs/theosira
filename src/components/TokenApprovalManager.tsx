/**
 * Token Approval Manager - Gérer les allowances ERC-20
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Trash2, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Contract, formatUnits, MaxUint256 } from "ethers";

interface TokenApprovalManagerProps {
  web3: any;
  fmtAddr: (addr: string) => string;
  GCard: any;
  STitle: any;
}

interface Approval {
  tokenAddress: string;
  tokenSymbol: string;
  spenderAddress: string;
  spenderName: string;
  allowance: string;
  isUnlimited: boolean;
}

const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

// Common spender addresses
const COMMON_SPENDERS: Record<string, string> = {
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D': 'Uniswap V2 Router',
  '0xE592427A0AEce92De3Edee1F18E0157C05861564': 'Uniswap V3 Router',
  '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45': 'Uniswap Universal Router',
  '0x1111111254EEB25477B68fb85Ed929f73A960582': '1inch Router',
  '0xdef1c0ded9bec7f1a1670819833240f027b25eff': '0x Protocol',
};

export default function TokenApprovalManager({ web3, fmtAddr, GCard, STitle }: TokenApprovalManagerProps) {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  const scanApprovals = async () => {
    if (!web3.address || !web3.provider) {
      toast.error("Connectez votre wallet");
      return;
    }

    setLoading(true);
    const found: Approval[] = [];

    try {
      toast.loading("Scan des approvals en cours...", { id: 'scan-approvals' });

      // Common tokens to check
      const tokensToCheck = [
        { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT' },
        { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC' },
        { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI' },
        { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH' },
      ];

      for (const token of tokensToCheck) {
        const contract = new Contract(token.address, ERC20_ABI, web3.provider);

        for (const [spenderAddress, spenderName] of Object.entries(COMMON_SPENDERS)) {
          try {
            const allowance = await contract.allowance(web3.address, spenderAddress);
            
            if (allowance > 0n) {
              found.push({
                tokenAddress: token.address,
                tokenSymbol: token.symbol,
                spenderAddress,
                spenderName,
                allowance: formatUnits(allowance, 18),
                isUnlimited: allowance >= MaxUint256 / 2n,
              });
            }
          } catch (error) {
            console.log(`No approval for ${token.symbol} on ${spenderName}`);
          }
        }
      }

      setApprovals(found);
      
      if (found.length === 0) {
        toast.success("Aucune approval trouvée (c'est une bonne chose!)", { id: 'scan-approvals' });
      } else {
        toast.warning(`${found.length} approval(s) active(s) trouvée(s)`, { id: 'scan-approvals' });
      }
    } catch (error: any) {
      console.error('❌ Erreur scan approvals:', error);
      toast.error("Erreur lors du scan", { id: 'scan-approvals' });
    } finally {
      setLoading(false);
    }
  };

  const revokeApproval = async (approval: Approval) => {
    const confirmation = window.confirm(
      `⚠️ RÉVOCATION APPROVAL\n\n` +
      `Token: ${approval.tokenSymbol}\n` +
      `Spender: ${approval.spenderName}\n` +
      `Allowance: ${approval.isUnlimited ? 'UNLIMITED' : approval.allowance}\n\n` +
      `Ceci mettra l'allowance à 0.\n\n` +
      `Continuer ?`
    );

    if (!confirmation) {
      toast.info("Révocation annulée");
      return;
    }

    setRevoking(`${approval.tokenAddress}-${approval.spenderAddress}`);
    try {
      toast.loading("Révocation en cours...", { id: 'revoke' });

      const contract = new Contract(approval.tokenAddress, ERC20_ABI, web3.signer);
      const tx = await contract.approve(approval.spenderAddress, 0n);
      
      await tx.wait();

      toast.success(
        `✅ Approval révoquée!\n${approval.tokenSymbol} sur ${approval.spenderName}`,
        { id: 'revoke', duration: 5000 }
      );

      // Remove from list
      setApprovals(prev => prev.filter(a => 
        a.tokenAddress !== approval.tokenAddress || a.spenderAddress !== approval.spenderAddress
      ));
    } catch (error: any) {
      console.error('❌ Erreur révocation:', error);
      toast.error(error.message || "Erreur lors de la révocation", { id: 'revoke' });
    } finally {
      setRevoking(null);
    }
  };

  useEffect(() => {
    if (web3.isConnected) {
      scanApprovals();
    }
  }, [web3.isConnected]);

  if (!web3.isConnected) {
    return null;
  }

  return (
    <GCard>
      <div className="flex items-center justify-between mb-4">
        <STitle icon={ShieldCheck} title="TOKEN APPROVAL MANAGER" />
        <button
          onClick={scanApprovals}
          disabled={loading}
          className="px-3 py-1.5 bg-white/5 text-white/70 border border-white/10 rounded-sm hover:bg-white/10 transition-all text-[10px] inline-flex items-center gap-1 disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Re-scan
        </button>
      </div>

      <div className="space-y-4">
        {/* Info Banner */}
        <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-orange-200">
            <p className="font-semibold mb-1">Gestion des Approvals</p>
            <p className="text-orange-300/70">
              Les approvals permettent aux smart contracts de dépenser vos tokens.
              Révoquez celles qui ne sont plus nécessaires pour sécuriser vos fonds.
            </p>
          </div>
        </div>

        {/* Approvals List */}
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 mx-auto mb-3 text-white/30 animate-spin" />
            <p className="text-sm text-white/50">Scan des approvals...</p>
          </div>
        ) : approvals.length === 0 ? (
          <div className="text-center py-8">
            <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-green-400" />
            <p className="text-sm text-white/70">Aucune approval trouvée</p>
            <p className="text-xs text-white/40 mt-1">Vos tokens sont sécurisés ✓</p>
          </div>
        ) : (
          <div className="space-y-2">
            {approvals.map((approval, index) => (
              <motion.div
                key={`${approval.tokenAddress}-${approval.spenderAddress}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg border transition-all ${
                  approval.isUnlimited
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-black/30 border-white/5'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {/* Token */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-white">
                        {approval.tokenSymbol}
                      </span>
                      {approval.isUnlimited && (
                        <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/40 rounded text-[9px] text-red-400 font-medium">
                          UNLIMITED ⚠️
                        </span>
                      )}
                    </div>

                    {/* Spender */}
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="text-white/40">Spender: </span>
                        <span className="text-white/70">{approval.spenderName}</span>
                      </div>
                      <div>
                        <span className="text-white/40">Adresse: </span>
                        <code className="text-white/60 font-mono text-[10px]">
                          {fmtAddr(approval.spenderAddress)}
                        </code>
                      </div>
                      <div>
                        <span className="text-white/40">Allowance: </span>
                        <span className={approval.isUnlimited ? 'text-red-400' : 'text-white/70'}>
                          {approval.isUnlimited 
                            ? '∞ UNLIMITED' 
                            : parseFloat(approval.allowance).toLocaleString()
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Revoke Button */}
                  <button
                    onClick={() => revokeApproval(approval)}
                    disabled={revoking === `${approval.tokenAddress}-${approval.spenderAddress}`}
                    className="px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-sm hover:bg-red-500/30 transition-all text-xs inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    {revoking === `${approval.tokenAddress}-${approval.spenderAddress}` ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Révocation...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3 h-3" />
                        Révoquer
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats */}
        {approvals.length > 0 && (
          <div className="p-3 rounded-lg bg-black/20 border border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/50">Total approvals:</span>
              <span className="text-white font-semibold">{approvals.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-white/50">Unlimited:</span>
              <span className="text-red-400 font-semibold">
                {approvals.filter(a => a.isUnlimited).length}
              </span>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
          <p className="text-[9px] text-red-300 leading-relaxed">
            <strong>⚠️ Sécurité:</strong> Les approvals "UNLIMITED" permettent aux contrats
            de dépenser une quantité illimitée de vos tokens. Révoquez celles que vous n'utilisez plus.
          </p>
        </div>
      </div>
    </GCard>
  );
}
