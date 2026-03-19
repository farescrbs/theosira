// ═══════════════════════════════════════════════════════════════════════════
// 💸 DIALOG D'ENVOI DE TRANSACTIONS - ULTRA LUXUEUX
// Interface premium pour envoyer crypto et tokens
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion } from "motion/react";
import { Send, ArrowRight, Check, AlertCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useWeb3 } from "../hooks/useWeb3";
import { toast } from "sonner@2.0.3";
import { formatAddress, formatBalance, getExplorerUrl } from "../services/web3Service";

interface SendTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SendTransactionDialog({ open, onOpenChange }: SendTransactionDialogProps) {
  const { isConnected, chainId, currentChain, balance, sendTransaction, refreshBalance } = useWeb3();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!isConnected) {
      toast.error('Wallet non connecté');
      return;
    }

    if (!recipient || !amount) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    // Validation de l'adresse
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      setError('Adresse invalide');
      return;
    }

    // Validation du montant
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Montant invalide');
      return;
    }

    if (balance && parseFloat(balance) < amountNum) {
      setError('Solde insuffisant');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const hash = await sendTransaction(recipient, amount);
      setTxHash(hash);
      
      toast.success('Transaction envoyée ! 🎉', {
        description: `Hash: ${formatAddress(hash)}`,
        action: {
          label: 'Voir sur Explorer',
          onClick: () => window.open(getExplorerUrl(chainId!, hash, 'tx'), '_blank'),
        },
      });

      // Rafraîchir le solde après 3 secondes
      setTimeout(() => {
        refreshBalance();
      }, 3000);

      // Réinitialiser le formulaire
      setTimeout(() => {
        setRecipient('');
        setAmount('');
        setTxHash(null);
        onOpenChange(false);
      }, 5000);

    } catch (err: any) {
      console.error('Erreur lors de l\'envoi:', err);
      setError(err.message || 'Erreur lors de l\'envoi de la transaction');
      toast.error('Erreur', {
        description: err.message || 'Transaction échouée',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleMaxAmount = () => {
    if (balance) {
      // Garder un peu pour les frais de gas
      const maxAmount = Math.max(0, parseFloat(balance) - 0.001);
      setAmount(maxAmount.toString());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-lg backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#d4af37] flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            <Send className="w-6 h-6" />
            Envoyer {currentChain?.symbol}
          </DialogTitle>
        </DialogHeader>

        {txHash ? (
          // État de succès
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            
            <h3 className="text-white text-xl mb-2" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
              Transaction Envoyée !
            </h3>
            
            <p className="text-white/60 text-sm mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Votre transaction a été diffusée sur le réseau
            </p>

            <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] p-4 mb-4">
              <p className="text-white/50 text-xs mb-1">Hash de Transaction</p>
              <p className="text-[#d4af37] font-mono text-sm break-all">{txHash}</p>
            </div>

            <Button
              onClick={() => window.open(getExplorerUrl(chainId!, txHash, 'tx'), '_blank')}
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
            >
              Voir sur Explorer
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        ) : (
          // Formulaire d'envoi
          <div className="space-y-6 mt-4">
            {/* Solde disponible */}
            <div className="rounded-xl border border-[#d4af37]/20 bg-gradient-to-br from-[#d4af37]/10 to-transparent p-4">
              <p className="text-white/60 text-sm mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Solde Disponible
              </p>
              <p className="text-[#d4af37] text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                {balance ? formatBalance(balance, 6) : '0'} {currentChain?.symbol}
              </p>
            </div>

            {/* Destinataire */}
            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Adresse du Destinataire
              </Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => {
                  setRecipient(e.target.value);
                  setError(null);
                }}
                className="bg-white/[0.05] border-[#d4af37]/20 text-white placeholder:text-white/40 font-mono"
                disabled={isSending}
              />
            </div>

            {/* Montant */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount" className="text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Montant
                </Label>
                <button
                  onClick={handleMaxAmount}
                  disabled={isSending}
                  className="text-[#d4af37] text-sm hover:underline"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  MAX
                </button>
              </div>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  step="0.000001"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError(null);
                  }}
                  className="bg-white/[0.05] border-[#d4af37]/20 text-white placeholder:text-white/40 pr-20"
                  disabled={isSending}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 text-sm">
                  {currentChain?.symbol}
                </div>
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-400 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {error}
                </p>
              </motion.div>
            )}

            {/* Estimation des frais */}
            <div className="rounded-lg border border-[#d4af37]/10 bg-white/[0.02] p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Frais de Gas (estimation)
                </span>
                <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  ~0.001 {currentChain?.symbol}
                </span>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-3">
              <Button
                onClick={() => onOpenChange(false)}
                disabled={isSending}
                variant="outline"
                className="flex-1 border-[#d4af37]/30 text-white hover:bg-white/[0.05]"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSend}
                disabled={isSending || !recipient || !amount}
                className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 disabled:opacity-50"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 w-4 h-4" />
                    Envoyer
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
