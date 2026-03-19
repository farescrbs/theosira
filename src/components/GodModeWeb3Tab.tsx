/**
 * Onglet Web3 pour le God Mode
 * Intégration blockchain réelle
 */

import { motion } from "motion/react";
import {
  Wallet, Power, RefreshCw, Copy, Eye, ExternalLink,
  Clock, CheckCircle2, XCircle, Loader2, Send, Zap
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useState } from "react";
import RealTransactionWarning from "./RealTransactionWarning";
import TokenTransferPanel from "./TokenTransferPanel";
import GasPriceSelector from "./GasPriceSelector";
import MessageSignature from "./MessageSignature";
import TransactionHistory from "./TransactionHistory";
import NFTTransferPanel from "./NFTTransferPanel";
import SwapPanel from "./SwapPanel";
import AddressBook from "./AddressBook";
import TransactionManager from "./TransactionManager";
import ContractDeployer from "./ContractDeployer";
import ENSResolver from "./ENSResolver";
import TokenApprovalManager from "./TokenApprovalManager";
import PortfolioTracker from "./PortfolioTracker";
import MultiSigManager from "./MultiSigManager";
import NotificationCenter from "./NotificationCenter";
import MetaMaskInstallPrompt from "./MetaMaskInstallPrompt";
import { useCryptoPrices } from "../hooks/useCryptoPrices";
import GodModeApiTests from "./GodModeApiTests";

interface Web3TabProps {
  web3: any;
  fmtAddr: (addr: string) => string;
  GCard: any;
  STitle: any;
}

export default function GodModeWeb3Tab({ web3, fmtAddr, GCard, STitle }: Web3TabProps) {
  const [contractAddress, setContractAddress] = useState("");
  const [contractInfo, setContractInfo] = useState<any>(null);
  const [inspecting, setInspecting] = useState(false);
  const { prices } = useCryptoPrices();

  const [sendToAddress, setSendToAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sending, setSending] = useState(false);

  const handleInspectContract = async () => {
    if (!contractAddress) {
      toast.error("Veuillez entrer une adresse de contrat");
      return;
    }

    setInspecting(true);
    try {
      const info = await web3.getContractInfo(contractAddress);
      setContractInfo(info);
      toast.success(`Contrat ${info.type} trouvé: ${info.name} (${info.symbol})`);
      console.log("✅ Contract Info:", info);
    } catch (error: any) {
      toast.error(error.message || "Erreur inspection contrat");
      setContractInfo(null);
    } finally {
      setInspecting(false);
    }
  };

  const handleSendETH = async () => {
    if (!sendToAddress || !sendAmount) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (parseFloat(sendAmount) > parseFloat(web3.ethBalance)) {
      toast.error("Solde insuffisant");
      return;
    }

    // Confirmation utilisateur
    const confirmation = window.confirm(
      `⚠️ TRANSACTION RÉELLE\n\n` +
      `Vous allez envoyer ${sendAmount} ETH vers:\n${sendToAddress}\n\n` +
      `Cette transaction sera exécutée sur ${web3.networkName}.\n\n` +
      `Êtes-vous absolument certain ?`
    );

    if (!confirmation) {
      toast.info("Transaction annulée");
      return;
    }

    setSending(true);
    try {
      toast.loading(`Envoi de ${sendAmount} ETH en cours...`, { id: 'tx-sending' });
      
      const tx = await web3.sendETH(sendToAddress, sendAmount);
      
      toast.success(
        `✅ Transaction confirmée!\nHash: ${tx.hash.substring(0, 10)}...\nGas utilisé: ${tx.gasUsed || 'N/A'}`,
        { id: 'tx-sending', duration: 10000 }
      );
      
      console.log("🎉 Transaction réussie:", tx);
      
      setSendToAddress("");
      setSendAmount("");
    } catch (error: any) {
      console.error("❌ Erreur transaction:", error);
      toast.error(error.message || "Erreur envoi transaction", { id: 'tx-sending' });
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      key="web3"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-5"
    >
      {/* WARNING BANNER - Transactions Réelles */}
      {web3.isConnected && (
        <RealTransactionWarning network={web3.networkName} />
      )}

      {/* API Connections Tester */}
      <GodModeApiTests web3={web3} GCard={GCard} STitle={STitle} />

      {/* Connection Status */}
      <GCard>
        <STitle icon={Wallet} title="WEB3 CONNECTION" />

        {!web3.isConnected ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center">
              <Wallet className="w-10 h-10 text-[#d4af37]" />
            </div>
            <h3
              className="text-xl mb-3 text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Connexion Wallet Requise
            </h3>
            <p className="text-sm text-white/50 mb-6 max-w-md mx-auto">
              Connectez votre wallet MetaMask pour activer les fonctionnalités
              Web3 avancées du God Mode
            </p>
            
            {/* Error Message */}
            {web3.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 max-w-md mx-auto"
              >
                <p className="text-sm text-red-400">{web3.error}</p>
              </motion.div>
            )}
            
            <button
              onClick={() => web3.connectWallet()}
              disabled={web3.isLoading}
              className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black font-bold rounded-sm hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all disabled:opacity-50 inline-flex items-center gap-2"
            >
              {web3.isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  Connecter MetaMask
                </>
              )}
            </button>
            
            {/* Help Text */}
            <div className="mt-6 text-xs text-white/30">
              <p>MetaMask non installé ?</p>
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#d4af37] hover:text-yellow-300 underline"
              >
                Télécharger MetaMask ↗
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Wallet Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-black/30 border border-white/5">
                <div className="text-[10px] text-white/40 mb-2 tracking-wider">
                  ADRESSE
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white font-mono">
                    {fmtAddr(web3.address!)}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(web3.address!);
                      toast.success("Adresse copiée");
                    }}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <Copy className="w-3 h-3 text-white/50" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-black/30 border border-white/5">
                <div className="text-[10px] text-white/40 mb-2 tracking-wider">
                  RÉSEAU
                </div>
                <div className="text-sm text-white">{web3.networkName}</div>
                <div className="text-xs text-white/30">
                  Chain ID: {web3.chainId}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-black/30 border border-white/5">
                <div className="text-[10px] text-white/40 mb-2 tracking-wider">
                  BALANCE
                </div>
                <div className="text-sm text-white">
                  {parseFloat(web3.ethBalance).toFixed(4)} ETH
                </div>
                <div className="text-xs text-white/30">
                  ${(parseFloat(web3.ethBalance) * (prices?.ETH?.usd || 2500)).toFixed(2)} USD
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => web3.disconnectWallet()}
                className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-sm hover:bg-red-500/30 transition-all text-sm inline-flex items-center gap-2"
              >
                <Power className="w-4 h-4" />
                Déconnecter
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white/5 text-white/70 border border-white/10 rounded-sm hover:bg-white/10 transition-all text-sm inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Rafraîchir
              </button>
            </div>

            {/* Recent Transactions */}
            {web3.recentTransactions && web3.recentTransactions.length > 0 && (
              <div>
                <div className="text-[10px] text-white/40 mb-3 tracking-wider">
                  TRANSACTIONS RÉCENTES
                </div>
                <div className="space-y-2">
                  {web3.recentTransactions.map((tx: any) => (
                    <div
                      key={tx.hash}
                      className="p-3 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="text-xs text-white mb-1 font-mono">
                          {fmtAddr(tx.hash)}
                        </div>
                        <div className="text-[10px] text-white/40">
                          {fmtAddr(tx.from)} → {fmtAddr(tx.to)} • {tx.value} ETH
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {tx.status === "pending" && (
                          <Clock className="w-4 h-4 text-yellow-400 animate-spin" />
                        )}
                        {tx.status === "success" && (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        )}
                        {tx.status === "failed" && (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <a
                          href={`https://etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#d4af37] hover:text-yellow-300"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </GCard>

      {/* Contract Inspector (only if connected) */}
      {web3.isConnected && (
        <GCard>
          <STitle icon={Eye} title="CONTRACT INSPECTOR" />
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-white/40 mb-2 block tracking-wider">
                ADRESSE CONTRAT
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="0x..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="flex-1 px-4 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-sm focus:outline-none focus:border-[#d4af37]/50"
                />
                <button
                  onClick={handleInspectContract}
                  disabled={inspecting}
                  className="px-4 py-2 bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 rounded-sm hover:bg-[#d4af37]/30 transition-all text-sm inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {inspecting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  Inspecter
                </button>
              </div>
              <p className="text-[9px] text-white/30 mt-2">
                Supporte ERC-20 et ERC-3643
              </p>
            </div>

            {contractInfo && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-[10px] text-white/40 mb-1">NOM</div>
                    <div className="text-white">{contractInfo.name}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 mb-1">SYMBOLE</div>
                    <div className="text-white">{contractInfo.symbol}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 mb-1">TYPE</div>
                    <div className="text-green-400">{contractInfo.type}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 mb-1">DECIMALS</div>
                    <div className="text-white">{contractInfo.decimals}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[10px] text-white/40 mb-1">
                      TOTAL SUPPLY
                    </div>
                    <div className="text-white font-mono">
                      {parseFloat(contractInfo.totalSupply).toLocaleString()}
                    </div>
                  </div>
                  {contractInfo.paused !== undefined && (
                    <div className="col-span-2">
                      <div className="text-[10px] text-white/40 mb-1">STATUS</div>
                      <div
                        className={`text-sm ${
                          contractInfo.paused ? "text-red-400" : "text-green-400"
                        }`}
                      >
                        {contractInfo.paused ? "⏸️ PAUSED" : "✅ ACTIVE"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </GCard>
      )}

      {/* Send ETH (only if connected) */}
      {web3.isConnected && (
        <GCard>
          <STitle icon={Send} title="SEND TRANSACTION" />
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-white/40 mb-2 block tracking-wider">
                DESTINATAIRE
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={sendToAddress}
                onChange={(e) => setSendToAddress(e.target.value)}
                className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-sm focus:outline-none focus:border-[#d4af37]/50"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/40 mb-2 block tracking-wider">
                MONTANT (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                placeholder="0.1"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-sm focus:outline-none focus:border-[#d4af37]/50"
              />
              <p className="text-[9px] text-white/30 mt-1">
                Disponible: {parseFloat(web3.ethBalance).toFixed(4)} ETH
              </p>
            </div>

            <button
              onClick={handleSendETH}
              disabled={sending || !sendToAddress || !sendAmount}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black font-bold rounded-sm hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Envoyer Transaction
                </>
              )}
            </button>
          </div>
        </GCard>
      )}

      {/* Token Transfer Panel (only if connected) */}
      {web3.isConnected && (
        <TokenTransferPanel web3={web3} fmtAddr={fmtAddr} GCard={GCard} STitle={STitle} />
      )}

      {/* Gas Price Selector (only if connected) */}
      {web3.isConnected && (
        <GasPriceSelector web3={web3} GCard={GCard} STitle={STitle} />
      )}

      {/* Message Signature (only if connected) */}
      {web3.isConnected && (
        <MessageSignature web3={web3} fmtAddr={fmtAddr} GCard={GCard} STitle={STitle} />
      )}

      {/* Transaction History (only if connected) */}
      {web3.isConnected && (
        <TransactionHistory web3={web3} fmtAddr={fmtAddr} GCard={GCard} STitle={STitle} />
      )}

      {/* NFT Transfer Panel (only if connected) */}
      {web3.isConnected && (
        <NFTTransferPanel web3={web3} fmtAddr={fmtAddr} GCard={GCard} STitle={STitle} />
      )}

      {/* Swap Panel (only if connected) */}
      {web3.isConnected && (
        <SwapPanel web3={web3} fmtAddr={fmtAddr} GCard={GCard} STitle={STitle} />
      )}

      {/* Address Book (only if connected) */}
      {web3.isConnected && (
        <AddressBook web3={web3} fmtAddr={fmtAddr} GCard={GCard} STitle={STitle} />
      )}

      {/* Transaction Manager (only if connected) */}
      {web3.isConnected && (
        <TransactionManager web3={web3} fmtAddr={fmtAddr} GCard={GCard} STitle={STitle} />
      )}

      {/* Contract Deployer (only if connected) */}
      {web3.isConnected && (
        <ContractDeployer web3={web3} fmtAddr={fmtAddr} GCard={GCard} STitle={STitle} />
      )}

      {/* ENS Resolver (only if connected) */}
      {web3.isConnected && (
        <ENSResolver web3={web3} fmtAddr={fmtAddr} GCard={GCard} STitle={STitle} />
      )}

      {/* Token Approval Manager (only if connected) */}
      {web3.isConnected && (
        <TokenApprovalManager web3={web3} fmtAddr={fmtAddr} GCard={GCard} STitle={STitle} />
      )}

      {/* Portfolio Tracker (only if connected) */}
      {web3.isConnected && (
        <PortfolioTracker web3={web3} fmtAddr={fmtAddr} GCard={GCard} STitle={STitle} />
      )}

      {/* MultiSig Manager (only if connected) */}
      {web3.isConnected && (
        <MultiSigManager web3={web3} fmtAddr={fmtAddr} GCard={GCard} STitle={STitle} />
      )}

      {/* Notification Center (only if connected) */}
      {web3.isConnected && (
        <NotificationCenter web3={web3} fmtAddr={fmtAddr} GCard={GCard} STitle={STitle} />
      )}
    </motion.div>
  );
}