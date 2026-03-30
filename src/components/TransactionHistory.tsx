/**
 * Historique des transactions avec filtres et export (Inclut l'historique réel de la blockchain)
 */

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { History, Download, Filter, ExternalLink, Clock, CheckCircle2, XCircle, Search, RefreshCw, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface TransactionHistoryProps {
  web3: any;
  fmtAddr: (addr: string) => string;
  GCard: any;
  STitle: any;
}

type FilterType = 'all' | 'pending' | 'success' | 'failed';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-cc38a303`;

const getAlchemyNetwork = (chainId: number) => {
  switch(chainId) {
    case 1: return 'eth-mainnet';
    case 11155111: return 'eth-sepolia';
    case 5: return 'eth-goerli';
    case 137: return 'polygon-mainnet';
    case 80001: return 'polygon-mumbai';
    case 10: return 'opt-mainnet';
    case 42161: return 'arb-mainnet';
    default: return 'eth-mainnet';
  }
};

export default function TransactionHistory({ web3, fmtAddr, GCard, STitle }: TransactionHistoryProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [historicalTransfers, setHistoricalTransfers] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!web3.address || !web3.chainId) return;
    setIsLoadingHistory(true);
    try {
      const network = getAlchemyNetwork(web3.chainId);
      const res = await fetch(`${SERVER_URL}/alchemy/transfers/${web3.address}?network=${network}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${publicAnonKey}` }
      });
      const data = await res.json();
      
      if (data.success && data.transfers) {
        const formattedTxs = data.transfers.map((t: any) => ({
          hash: t.hash,
          from: t.from,
          to: t.to,
          value: t.value !== null && t.value !== undefined ? t.value.toString() : "0",
          status: 'success',
          asset: t.asset || "ETH",
          isHistorical: true
        }));
        
        // Remove duplicates if any (alchemy might return multiple transfers for same hash if it's complex, we'll keep them or filter unique hashes)
        const uniqueTxs = Array.from(new Map(formattedTxs.map((item: any) => [item.hash, item])).values());
        setHistoricalTransfers(uniqueTxs as any[]);
      }
    } catch (err: any) {
      if (err.message && err.message.includes("Failed to fetch")) {
        console.warn("Historique: Impossible de joindre le serveur");
      } else {
        console.warn("Erreur chargement historique:", err);
      }
    } finally {
      setIsLoadingHistory(false);
    }
  }, [web3.address, web3.chainId]);

  useEffect(() => {
    if (web3.isConnected) {
      fetchHistory();
    }
  }, [web3.isConnected, web3.address, web3.chainId, fetchHistory]);

  const transactions = useMemo(() => {
    const recent = web3.recentTransactions || [];
    // Combine recent and historical, avoiding duplicates by hash
    const recentHashes = new Set(recent.map((t: any) => t.hash.toLowerCase()));
    const filteredHistorical = historicalTransfers.filter(t => !recentHashes.has(t.hash.toLowerCase()));
    
    return [...recent, ...filteredHistorical];
  }, [web3.recentTransactions, historicalTransfers]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    let result = transactions;

    // Filter by status
    if (filter !== 'all') {
      result = result.filter((tx: any) => tx.status === filter);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((tx: any) =>
        (tx.hash && tx.hash.toLowerCase().includes(query)) ||
        (tx.to && tx.to.toLowerCase().includes(query)) ||
        (tx.from && tx.from.toLowerCase().includes(query))
      );
    }

    return result;
  }, [transactions, filter, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: transactions.length,
      pending: transactions.filter((tx: any) => tx.status === 'pending').length,
      success: transactions.filter((tx: any) => tx.status === 'success').length,
      failed: transactions.filter((tx: any) => tx.status === 'failed').length,
    };
  }, [transactions]);

  const exportToJSON = () => {
    const data = JSON.stringify(filteredTransactions, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thesoria-transactions-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Transactions exportées!");
  };

  const exportToCSV = () => {
    const headers = ['Hash', 'From', 'To', 'Value', 'Asset', 'Status', 'Type'];
    const rows = filteredTransactions.map((tx: any) => [
      tx.hash,
      tx.from,
      tx.to,
      tx.value,
      tx.asset || 'ETH',
      tx.status,
      tx.isHistorical ? 'Historical' : 'Session'
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thesoria-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Transactions exportées en CSV!");
  };

  const getEtherscanUrl = (hash: string) => {
    const baseUrl = web3.chainId === 1 
      ? 'https://etherscan.io'
      : web3.chainId === 11155111
      ? 'https://sepolia.etherscan.io'
      : web3.chainId === 137
      ? 'https://polygonscan.com'
      : 'https://etherscan.io';
    
    return `${baseUrl}/tx/${hash}`;
  };

  if (!web3.isConnected) {
    return null;
  }

  return (
    <GCard>
      <div className="flex items-center justify-between mb-4">
        <STitle icon={History} title="TRANSACTION HISTORY" />
        <button
          onClick={fetchHistory}
          disabled={isLoadingHistory}
          className="p-1.5 bg-white/5 text-white/70 border border-white/10 rounded-sm hover:bg-white/10 transition-all disabled:opacity-50"
          title="Actualiser l'historique depuis la blockchain"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHistory ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`p-2 rounded-lg border transition-all ${
              filter === 'all'
                ? 'bg-white/10 border-[#d4af37]'
                : 'bg-black/20 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="text-xs text-white/40 mb-1">Total</div>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              {stats.total}
              {isLoadingHistory && <Clock className="w-3 h-3 animate-spin text-white/40" />}
            </div>
          </button>

          <button
            onClick={() => setFilter('pending')}
            className={`p-2 rounded-lg border transition-all ${
              filter === 'pending'
                ? 'bg-yellow-500/20 border-yellow-500'
                : 'bg-black/20 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="text-xs text-white/40 mb-1">Pending</div>
            <div className="text-lg font-bold text-yellow-400">{stats.pending}</div>
          </button>

          <button
            onClick={() => setFilter('success')}
            className={`p-2 rounded-lg border transition-all ${
              filter === 'success'
                ? 'bg-green-500/20 border-green-500'
                : 'bg-black/20 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="text-xs text-white/40 mb-1">Success</div>
            <div className="text-lg font-bold text-green-400">{stats.success}</div>
          </button>

          <button
            onClick={() => setFilter('failed')}
            className={`p-2 rounded-lg border transition-all ${
              filter === 'failed'
                ? 'bg-red-500/20 border-red-500'
                : 'bg-black/20 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="text-xs text-white/40 mb-1">Failed</div>
            <div className="text-lg font-bold text-red-400">{stats.failed}</div>
          </button>
        </div>

        {/* Search & Export */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Rechercher par hash, adresse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-xs focus:outline-none focus:border-[#d4af37]/50"
            />
          </div>

          <button
            onClick={exportToJSON}
            disabled={filteredTransactions.length === 0}
            className="px-3 py-2 bg-white/5 text-white/70 border border-white/10 rounded-sm hover:bg-white/10 transition-all text-xs inline-flex items-center gap-2 disabled:opacity-30"
          >
            <Download className="w-3 h-3" />
            JSON
          </button>

          <button
            onClick={exportToCSV}
            disabled={filteredTransactions.length === 0}
            className="px-3 py-2 bg-white/5 text-white/70 border border-white/10 rounded-sm hover:bg-white/10 transition-all text-xs inline-flex items-center gap-2 disabled:opacity-30"
          >
            <Download className="w-3 h-3" />
            CSV
          </button>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-12 h-12 mx-auto mb-3 text-white/20" />
            <p className="text-sm text-white/50">
              {transactions.length === 0 
                ? (isLoadingHistory ? "Recherche des transferts..." : "Aucune transaction trouvée pour cette adresse")
                : "Aucune transaction ne correspond aux filtres"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {filteredTransactions.map((tx: any) => {
              const isInbound = tx.to?.toLowerCase() === web3.address?.toLowerCase();
              return (
                <motion.div
                  key={tx.hash}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-all relative overflow-hidden"
                >
                  {/* Decorative line for direction */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${isInbound ? 'bg-green-500/50' : 'bg-orange-500/50'}`} />
                  
                  <div className="flex items-start justify-between gap-3 pl-2">
                    <div className="flex-1 min-w-0">
                      {/* Hash & Direction */}
                      <div className="flex items-center gap-2 mb-2">
                        {isInbound ? (
                          <span className="flex items-center gap-1 text-[9px] font-bold tracking-wider text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded-sm">
                            <ArrowDownLeft className="w-3 h-3" /> REÇU
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[9px] font-bold tracking-wider text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded-sm">
                            <ArrowUpRight className="w-3 h-3" /> ENVOYÉ
                          </span>
                        )}
                        <code className="text-xs text-white font-mono">
                          {fmtAddr(tx.hash)}
                        </code>
                        {tx.status === "pending" && (
                          <Clock className="w-3 h-3 text-yellow-400 animate-spin flex-shrink-0" />
                        )}
                        {tx.status === "success" && (
                          <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                        )}
                        {tx.status === "failed" && (
                          <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="text-[10px] text-white/40 space-y-0.5">
                        <div>
                          From: <span className="text-white/60 font-mono">{fmtAddr(tx.from)}</span>
                        </div>
                        <div>
                          To: <span className="text-white/60 font-mono">{fmtAddr(tx.to)}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-xs">
                            <span className={isInbound ? 'text-green-400 font-medium' : 'text-white font-medium'}>
                              {isInbound ? '+' : '-'}{tx.value}
                            </span> <span className="text-[#d4af37]">{tx.asset || 'ETH'}</span>
                          </span>
                          {tx.gasUsed && (
                            <span className="text-[9px]">• Gas: <span className="text-white/60">{parseInt(tx.gasUsed).toLocaleString()}</span></span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Etherscan Link */}
                    <a
                      href={getEtherscanUrl(tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-white/10 rounded transition-all flex-shrink-0"
                      title="Voir sur l'explorateur"
                    >
                      <ExternalLink className="w-3 h-3 text-[#d4af37]" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </GCard>
  );
}
