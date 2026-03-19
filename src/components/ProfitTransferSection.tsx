import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  ArrowRight, 
  Wallet, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Filter,
  Search,
  RefreshCw,
  Loader2
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { useWeb3 } from "../contexts/Web3Context";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface ProfitBalance {
  total: number;
  available: number;
  pending: number;
  withdrawn: number;
}

interface TransferHistory {
  id: string;
  amount: number;
  to: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  type: string;
}

export default function ProfitTransferSection() {
  const { isConnected, address, balance } = useWeb3();
  const [profitBalance, setProfitBalance] = useState<ProfitBalance>({
    total: 0,
    available: 0,
    pending: 0,
    withdrawn: 0
  });
  const [transferAmount, setTransferAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferHistory, setTransferHistory] = useState<TransferHistory[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState("");

  // Charger le solde de profits
  const loadProfitBalance = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cc38a303/profit/balance/${address}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Erreur lors du chargement du solde');
      
      const data = await response.json();
      setProfitBalance(data.balance);
    } catch (error) {
      console.error('Erreur chargement solde:', error);
      toast.error('Impossible de charger le solde de profits');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger l'historique des transferts
  const loadTransferHistory = async () => {
    if (!address) return;
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cc38a303/profit/history/${address}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Erreur lors du chargement de l\'historique');
      
      const data = await response.json();
      setTransferHistory(data.history || []);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    }
  };

  // Transférer les profits
  const handleTransfer = async () => {
    if (!address || !transferAmount) {
      toast.error('Veuillez saisir un montant');
      return;
    }

    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Montant invalide');
      return;
    }

    if (amount > profitBalance.available) {
      toast.error('Solde insuffisant');
      return;
    }

    setIsTransferring(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cc38a303/profit/transfer`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: address,
            to: address,
            amount: amount
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors du transfert');
      }
      
      const data = await response.json();
      
      toast.success('Transfert initié avec succès!', {
        description: `Transaction: ${data.txHash?.substring(0, 10)}...`
      });
      
      setTransferAmount("");
      await loadProfitBalance();
      await loadTransferHistory();
    } catch (error) {
      console.error('Erreur transfert:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors du transfert');
    } finally {
      setIsTransferring(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      loadProfitBalance();
      loadTransferHistory();
    }
  }, [isConnected, address]);

  // Filtrer l'historique
  const filteredHistory = transferHistory.filter(tx => {
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      tx.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.txHash?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-500/10 text-green-500 border-green-500/20',
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      failed: 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    return variants[status as keyof typeof variants] || '';
  };

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background premium */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020002] via-[#0a0a0a] to-[#020002]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.03),transparent_70%)]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/5 backdrop-blur-sm mb-6">
            <TrendingUp className="w-4 h-4 text-[#d4af37]" />
            <span className="text-sm font-['Montserrat'] font-medium text-[#d4af37]">
              GESTION DES PROFITS
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-['Playfair_Display'] font-bold text-white mb-6">
            Transférez Vos <span className="text-[#d4af37]">Profits</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-['Montserrat']">
            Gérez et transférez vos profits générés vers votre wallet de connexion en toute sécurité
          </p>
        </motion.div>

        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-[#d4af37]/5 to-transparent border-[#d4af37]/20 backdrop-blur-xl p-12 text-center">
              <Wallet className="w-16 h-16 text-[#d4af37] mx-auto mb-6" />
              <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4">
                Connectez Votre Wallet
              </h3>
              <p className="text-gray-400 font-['Montserrat'] mb-8">
                Veuillez connecter votre wallet pour accéder à vos profits
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black font-['Montserrat'] font-bold hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
              >
                Connecter Wallet
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne gauche - Statistiques */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Total des profits */}
              <Card className="bg-gradient-to-br from-[#d4af37]/10 to-transparent border-[#d4af37]/20 backdrop-blur-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#d4af37]" />
                    <span className="text-sm font-['Montserrat'] text-gray-400">Total Profits</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={loadProfitBalance}
                    disabled={isLoading}
                    className="h-8 w-8 p-0 hover:bg-[#d4af37]/10"
                  >
                    <RefreshCw className={`w-4 h-4 text-[#d4af37] ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                <div className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
                  ) : (
                    `${profitBalance.total.toFixed(4)} ETH`
                  )}
                </div>
                <div className="text-sm text-gray-400 font-['Montserrat']">
                  ≈ ${(profitBalance.total * 3421.78).toFixed(2)} USD
                </div>
              </Card>

              {/* Disponible */}
              <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20 backdrop-blur-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-['Montserrat'] text-gray-400">Disponible</span>
                </div>
                <div className="text-2xl font-['Playfair_Display'] font-bold text-white">
                  {profitBalance.available.toFixed(4)} ETH
                </div>
              </Card>

              {/* En attente */}
              <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20 backdrop-blur-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-['Montserrat'] text-gray-400">En Attente</span>
                </div>
                <div className="text-2xl font-['Playfair_Display'] font-bold text-white">
                  {profitBalance.pending.toFixed(4)} ETH
                </div>
              </Card>

              {/* Retirés */}
              <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 backdrop-blur-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Download className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-['Montserrat'] text-gray-400">Retirés</span>
                </div>
                <div className="text-2xl font-['Playfair_Display'] font-bold text-white">
                  {profitBalance.withdrawn.toFixed(4)} ETH
                </div>
              </Card>
            </motion.div>

            {/* Colonne centrale - Formulaire de transfert */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-[#d4af37]/5 to-transparent border-[#d4af37]/20 backdrop-blur-xl p-8">
                <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
                  Transférer vers Mon Wallet
                </h3>

                {/* Wallet connecté */}
                <div className="mb-6">
                  <label className="text-sm font-['Montserrat'] text-gray-400 mb-2 block">
                    Wallet de destination
                  </label>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-[#d4af37]/5 border border-[#d4af37]/20">
                    <Wallet className="w-5 h-5 text-[#d4af37]" />
                    <span className="font-['Montserrat'] text-white font-mono text-sm">
                      {address?.substring(0, 6)}...{address?.substring(38)}
                    </span>
                    <Badge className="ml-auto bg-green-500/20 text-green-500 border-green-500/30">
                      Connecté
                    </Badge>
                  </div>
                </div>

                {/* Montant */}
                <div className="mb-6">
                  <label className="text-sm font-['Montserrat'] text-gray-400 mb-2 block">
                    Montant à transférer
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      step="0.0001"
                      min="0"
                      max={profitBalance.available}
                      className="bg-black/50 border-[#d4af37]/20 text-white font-['Montserrat'] text-lg h-14 pr-24"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-gray-400 font-['Montserrat'] text-sm">ETH</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setTransferAmount(profitBalance.available.toString())}
                        className="h-8 px-3 text-xs bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37]"
                      >
                        MAX
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm font-['Montserrat']">
                    <span className="text-gray-400">
                      Disponible: {profitBalance.available.toFixed(4)} ETH
                    </span>
                    <span className="text-gray-400">
                      ≈ ${(parseFloat(transferAmount || '0') * 3421.78).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Boutons rapides */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {[0.25, 0.5, 0.75, 1].map((percentage) => (
                    <Button
                      key={percentage}
                      size="sm"
                      variant="outline"
                      onClick={() => setTransferAmount((profitBalance.available * percentage).toFixed(4))}
                      className="border-[#d4af37]/20 hover:bg-[#d4af37]/10 hover:border-[#d4af37]/40 text-gray-400 hover:text-[#d4af37]"
                    >
                      {percentage * 100}%
                    </Button>
                  ))}
                </div>

                {/* Bouton de transfert */}
                <Button
                  onClick={handleTransfer}
                  disabled={isTransferring || !transferAmount || parseFloat(transferAmount) <= 0}
                  className="w-full h-14 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black font-['Montserrat'] font-bold text-lg hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isTransferring ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Transfert en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-5 h-5" />
                      Transférer vers Mon Wallet
                    </div>
                  )}
                </Button>

                {/* Informations */}
                <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <Activity className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-['Montserrat'] text-gray-300 mb-1">
                        <strong className="text-blue-500">Frais de gas estimés:</strong> ~0.001 ETH
                      </p>
                      <p className="text-xs font-['Montserrat'] text-gray-400">
                        Les transferts sont traités immédiatement sur le réseau Ethereum
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Colonne droite - Historique */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-[#d4af37]/5 to-transparent border-[#d4af37]/20 backdrop-blur-xl p-6">
                <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-6">
                  Historique des Transferts
                </h3>

                {/* Filtres */}
                <div className="space-y-3 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-black/50 border-[#d4af37]/20 text-white font-['Montserrat']"
                    />
                  </div>

                  <div className="flex gap-2">
                    {(['all', 'completed', 'pending', 'failed'] as const).map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={filterStatus === status ? 'default' : 'outline'}
                        onClick={() => setFilterStatus(status)}
                        className={filterStatus === status 
                          ? 'bg-[#d4af37] text-black hover:bg-[#d4af37]/90'
                          : 'border-[#d4af37]/20 hover:bg-[#d4af37]/10 text-gray-400'
                        }
                      >
                        {status === 'all' ? 'Tous' : status === 'completed' ? 'Complété' : status === 'pending' ? 'En cours' : 'Échoué'}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Liste des transactions */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 font-['Montserrat']">
                        Aucun transfert trouvé
                      </p>
                    </div>
                  ) : (
                    filteredHistory.map((tx) => (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg bg-black/30 border border-[#d4af37]/10 hover:border-[#d4af37]/30 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(tx.status)}
                            <span className="text-sm font-['Montserrat'] font-medium text-white">
                              {tx.amount.toFixed(4)} ETH
                            </span>
                          </div>
                          <Badge className={`${getStatusBadge(tx.status)} border`}>
                            {tx.status === 'completed' ? 'Complété' : tx.status === 'pending' ? 'En cours' : 'Échoué'}
                          </Badge>
                        </div>
                        
                        <div className="text-xs font-['Montserrat'] text-gray-400 space-y-1">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(tx.timestamp).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          {tx.txHash && (
                            <div className="flex items-center gap-1 font-mono">
                              <span className="truncate">
                                {tx.txHash.substring(0, 10)}...{tx.txHash.substring(tx.txHash.length - 8)}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </section>
  );
}

export { ProfitTransferSection };