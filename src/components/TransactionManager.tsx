/**
 * Transaction Manager - Speedup / Cancel pending transactions
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Zap, X as XIcon, Loader2, AlertTriangle, TrendingUp } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { parseEther } from "ethers";

interface TransactionManagerProps {
  web3: any;
  fmtAddr: (addr: string) => string;
  GCard: any;
  STitle: any;
}

export default function TransactionManager({ web3, fmtAddr, GCard, STitle }: TransactionManagerProps) {
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  const speedUpTransaction = async () => {
    if (!txHash) {
      toast.error("Veuillez entrer un hash de transaction");
      return;
    }

    const confirmation = window.confirm(
      `⚠️ SPEEDUP TRANSACTION\n\n` +
      `Vous allez augmenter le gas de la transaction:\n${txHash}\n\n` +
      `Ceci enverra une NOUVELLE transaction avec un gas plus élevé et le même nonce.\n\n` +
      `Continuer ?`
    );

    if (!confirmation) {
      toast.info("Opération annulée");
      return;
    }

    setLoading(true);
    try {
      toast.loading("Speedup en cours...", { id: 'speedup' });

      // Get original transaction
      const originalTx = await web3.provider.getTransaction(txHash);
      
      if (!originalTx) {
        throw new Error("Transaction introuvable");
      }

      if (originalTx.blockNumber) {
        throw new Error("Transaction déjà confirmée");
      }

      // Increase gas price by 20%
      const newGasPrice = originalTx.gasPrice ? originalTx.gasPrice * 12n / 10n : undefined;
      const newMaxFeePerGas = originalTx.maxFeePerGas ? originalTx.maxFeePerGas * 12n / 10n : undefined;
      const newMaxPriorityFeePerGas = originalTx.maxPriorityFeePerGas ? originalTx.maxPriorityFeePerGas * 12n / 10n : undefined;

      // Send replacement transaction
      const tx = await web3.signer.sendTransaction({
        to: originalTx.to,
        value: originalTx.value,
        data: originalTx.data,
        nonce: originalTx.nonce,
        gasLimit: originalTx.gasLimit,
        gasPrice: newGasPrice,
        maxFeePerGas: newMaxFeePerGas,
        maxPriorityFeePerGas: newMaxPriorityFeePerGas,
      });

      toast.success(
        `✅ Speedup envoyé!\nNouveau hash: ${tx.hash.substring(0, 10)}...\nGas augmenté de 20%`,
        { id: 'speedup', duration: 10000 }
      );

      console.log('🚀 Speedup Transaction:', tx);

      setTxHash("");
    } catch (error: any) {
      console.error('❌ Erreur speedup:', error);
      toast.error(error.message || "Erreur lors du speedup", { id: 'speedup' });
    } finally {
      setLoading(false);
    }
  };

  const cancelTransaction = async () => {
    if (!txHash) {
      toast.error("Veuillez entrer un hash de transaction");
      return;
    }

    const confirmation = window.confirm(
      `⚠️ CANCEL TRANSACTION\n\n` +
      `Vous allez annuler la transaction:\n${txHash}\n\n` +
      `Ceci enverra une transaction de 0 ETH vers votre propre adresse avec le même nonce et un gas plus élevé.\n\n` +
      `Continuer ?`
    );

    if (!confirmation) {
      toast.info("Opération annulée");
      return;
    }

    setLoading(true);
    try {
      toast.loading("Annulation en cours...", { id: 'cancel' });

      // Get original transaction
      const originalTx = await web3.provider.getTransaction(txHash);
      
      if (!originalTx) {
        throw new Error("Transaction introuvable");
      }

      if (originalTx.blockNumber) {
        throw new Error("Transaction déjà confirmée");
      }

      // Increase gas price by 50% to ensure replacement
      const newGasPrice = originalTx.gasPrice ? originalTx.gasPrice * 15n / 10n : undefined;
      const newMaxFeePerGas = originalTx.maxFeePerGas ? originalTx.maxFeePerGas * 15n / 10n : undefined;
      const newMaxPriorityFeePerGas = originalTx.maxPriorityFeePerGas ? originalTx.maxPriorityFeePerGas * 15n / 10n : undefined;

      // Send 0 ETH to self with same nonce
      const tx = await web3.signer.sendTransaction({
        to: web3.address,
        value: 0n,
        nonce: originalTx.nonce,
        gasLimit: 21000n,
        gasPrice: newGasPrice,
        maxFeePerGas: newMaxFeePerGas,
        maxPriorityFeePerGas: newMaxPriorityFeePerGas,
      });

      toast.success(
        `✅ Transaction d'annulation envoyée!\nHash: ${tx.hash.substring(0, 10)}...\nGas augmenté de 50%`,
        { id: 'cancel', duration: 10000 }
      );

      console.log('❌ Cancel Transaction:', tx);

      setTxHash("");
    } catch (error: any) {
      console.error('❌ Erreur annulation:', error);
      toast.error(error.message || "Erreur lors de l'annulation", { id: 'cancel' });
    } finally {
      setLoading(false);
    }
  };

  if (!web3.isConnected) {
    return null;
  }

  return (
    <GCard>
      <STitle icon={Zap} title="TRANSACTION MANAGER" />
      
      <div className="space-y-4">
        {/* Info Banner */}
        <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-orange-200">
            <p className="font-semibold mb-1">Gestion des transactions pending</p>
            <p className="text-orange-300/70">
              Accélérez ou annulez des transactions en attente en envoyant une transaction de remplacement
              avec le même nonce mais un gas plus élevé.
            </p>
          </div>
        </div>

        {/* Transaction Hash Input */}
        <div>
          <label className="text-[10px] text-white/40 mb-2 block tracking-wider">
            HASH TRANSACTION (PENDING)
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-xs focus:outline-none focus:border-orange-500/50 font-mono"
          />
          <p className="text-[9px] text-white/30 mt-1">
            Entrez le hash d'une transaction pending pour la gérer
          </p>
        </div>

        {/* Recent Pending Transactions */}
        {web3.recentTransactions && web3.recentTransactions.filter((tx: any) => tx.status === 'pending').length > 0 && (
          <div>
            <div className="text-[10px] text-white/40 mb-2 tracking-wider">
              TRANSACTIONS PENDING RÉCENTES
            </div>
            <div className="space-y-1">
              {web3.recentTransactions
                .filter((tx: any) => tx.status === 'pending')
                .slice(0, 3)
                .map((tx: any) => (
                  <button
                    key={tx.hash}
                    onClick={() => setTxHash(tx.hash)}
                    className="w-full p-2 rounded bg-black/30 border border-white/5 hover:border-orange-500/30 transition-all text-left"
                  >
                    <div className="text-xs text-white font-mono">{fmtAddr(tx.hash)}</div>
                    <div className="text-[10px] text-white/40">{tx.value} ETH → {fmtAddr(tx.to)}</div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={speedUpTransaction}
            disabled={loading || !txHash}
            className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-sm hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2 text-xs"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                Speedup (+20% gas)
              </>
            )}
          </button>

          <button
            onClick={cancelTransaction}
            disabled={loading || !txHash}
            className="px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-sm hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2 text-xs"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <XIcon className="w-4 h-4" />
                Cancel (+50% gas)
              </>
            )}
          </button>
        </div>

        {/* How it works */}
        <div className="p-3 rounded-lg bg-black/20 border border-white/5">
          <div className="text-[10px] text-white/50 space-y-2">
            <div>
              <strong className="text-white/70">Speedup:</strong> Envoie la même transaction avec un gas +20% plus élevé.
              La transaction la plus rapide (gas le plus élevé) sera confirmée en premier.
            </div>
            <div>
              <strong className="text-white/70">Cancel:</strong> Envoie 0 ETH vers vous-même avec le même nonce et un gas +50% plus élevé.
              Ceci "remplace" la transaction originale et l'annule effectivement.
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
          <p className="text-[9px] text-red-300 leading-relaxed">
            <strong>⚠️ Important:</strong> Ces opérations consomment du gas. Si la transaction originale
            se confirme avant votre speedup/cancel, les deux transactions seront exécutées.
          </p>
        </div>
      </div>
    </GCard>
  );
}
