/**
 * Panel de transfert de tokens ERC-20 - Transactions RÉELLES
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Send, Loader2, Plus, X, AlertCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface TokenTransferPanelProps {
  web3: any;
  fmtAddr: (addr: string) => string;
  GCard: any;
  STitle: any;
}

interface TokenTransfer {
  tokenAddress: string;
  recipientAddress: string;
  amount: string;
}

export default function TokenTransferPanel({ web3, fmtAddr, GCard, STitle }: TokenTransferPanelProps) {
  const [transfers, setTransfers] = useState<TokenTransfer[]>([
    { tokenAddress: "", recipientAddress: "", amount: "" }
  ]);
  const [sending, setSending] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<Record<string, any>>({});

  const addTransfer = () => {
    setTransfers([...transfers, { tokenAddress: "", recipientAddress: "", amount: "" }]);
  };

  const removeTransfer = (index: number) => {
    setTransfers(transfers.filter((_, i) => i !== index));
  };

  const updateTransfer = (index: number, field: keyof TokenTransfer, value: string) => {
    const updated = [...transfers];
    updated[index][field] = value;
    setTransfers(updated);
  };

  const loadTokenInfo = async (address: string, index: number) => {
    if (!address || address.length !== 42) return;
    
    try {
      const info = await web3.getContractInfo(address);
      setTokenInfo(prev => ({ ...prev, [index]: info }));
      toast.success(`Token chargé: ${info.name} (${info.symbol})`);
    } catch (error: any) {
      toast.error("Impossible de charger le token");
      setTokenInfo(prev => ({ ...prev, [index]: null }));
    }
  };

  const handleSendBatch = async () => {
    // Validation
    const valid = transfers.every(t => t.tokenAddress && t.recipientAddress && t.amount);
    if (!valid) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    // Confirmation
    const confirmation = window.confirm(
      `⚠️ BATCH TRANSACTION RÉELLE\n\n` +
      `Vous allez envoyer ${transfers.length} transaction(s) de tokens.\n\n` +
      `Cette opération est IRRÉVERSIBLE.\n\n` +
      `Continuer ?`
    );

    if (!confirmation) {
      toast.info("Opération annulée");
      return;
    }

    setSending(true);
    let successCount = 0;

    for (let i = 0; i < transfers.length; i++) {
      const t = transfers[i];
      try {
        toast.loading(`Transaction ${i + 1}/${transfers.length} en cours...`, { id: `batch-${i}` });
        
        const tx = await web3.transferToken(t.tokenAddress, t.recipientAddress, t.amount);
        
        toast.success(
          `✅ Transaction ${i + 1} confirmée!\nHash: ${tx.hash.substring(0, 10)}...`,
          { id: `batch-${i}`, duration: 5000 }
        );
        
        successCount++;
      } catch (error: any) {
        console.error(`❌ Erreur transaction ${i + 1}:`, error);
        toast.error(`❌ Transaction ${i + 1} échouée: ${error.message}`, { id: `batch-${i}` });
      }
    }

    setSending(false);
    
    if (successCount === transfers.length) {
      toast.success(`🎉 Toutes les transactions ont réussi! (${successCount}/${transfers.length})`);
      // Reset
      setTransfers([{ tokenAddress: "", recipientAddress: "", amount: "" }]);
      setTokenInfo({});
    } else {
      toast.warning(`⚠️ ${successCount}/${transfers.length} transactions réussies`);
    }
  };

  if (!web3.isConnected) {
    return null;
  }

  return (
    <GCard>
      <STitle icon={Send} title="TOKEN TRANSFER (ERC-20)" />
      
      <div className="space-y-4">
        {/* Info Banner */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-200">
            <p className="font-semibold mb-1">Transfert de tokens ERC-20</p>
            <p className="text-blue-300/70">
              Vous pouvez envoyer plusieurs tokens différents en une seule opération (batch).
              Chaque transaction sera exécutée séquentiellement.
            </p>
          </div>
        </div>

        {/* Transfers */}
        <div className="space-y-3">
          {transfers.map((transfer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-black/20 border border-white/5 space-y-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-white/40 tracking-wider">
                  TRANSFER #{index + 1}
                </div>
                {transfers.length > 1 && (
                  <button
                    onClick={() => removeTransfer(index)}
                    className="p-1 hover:bg-red-500/20 rounded text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Token Address */}
              <div>
                <label className="text-[10px] text-white/40 mb-1 block tracking-wider">
                  ADRESSE TOKEN (ERC-20)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="0x..."
                    value={transfer.tokenAddress}
                    onChange={(e) => updateTransfer(index, "tokenAddress", e.target.value)}
                    onBlur={() => loadTokenInfo(transfer.tokenAddress, index)}
                    className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-xs focus:outline-none focus:border-[#d4af37]/50 font-mono"
                  />
                </div>
                {tokenInfo[index] && (
                  <div className="mt-1 text-[10px] text-green-400">
                    ✓ {tokenInfo[index].name} ({tokenInfo[index].symbol})
                  </div>
                )}
              </div>

              {/* Recipient */}
              <div>
                <label className="text-[10px] text-white/40 mb-1 block tracking-wider">
                  DESTINATAIRE
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={transfer.recipientAddress}
                  onChange={(e) => updateTransfer(index, "recipientAddress", e.target.value)}
                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-xs focus:outline-none focus:border-[#d4af37]/50 font-mono"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="text-[10px] text-white/40 mb-1 block tracking-wider">
                  MONTANT
                </label>
                <input
                  type="number"
                  step="0.000001"
                  placeholder="0.0"
                  value={transfer.amount}
                  onChange={(e) => updateTransfer(index, "amount", e.target.value)}
                  className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-xs focus:outline-none focus:border-[#d4af37]/50"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={addTransfer}
            disabled={transfers.length >= 5}
            className="px-4 py-2 bg-white/5 text-white/70 border border-white/10 rounded-sm hover:bg-white/10 transition-all text-xs inline-flex items-center gap-2 disabled:opacity-30"
          >
            <Plus className="w-4 h-4" />
            Ajouter un transfert
          </button>

          <button
            onClick={handleSendBatch}
            disabled={sending || transfers.length === 0}
            className="flex-1 px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black font-bold rounded-sm hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2 text-xs"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Envoyer {transfers.length > 1 ? `${transfers.length} Tokens` : "Token"}
              </>
            )}
          </button>
        </div>

        {transfers.length >= 5 && (
          <p className="text-[9px] text-yellow-400 text-center">
            Maximum 5 transferts par batch
          </p>
        )}
      </div>
    </GCard>
  );
}
