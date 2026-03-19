import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Ticket, Crown, Sparkles, Clock, Users, 
  ChevronRight, ArrowRight, ShieldCheck, 
  ExternalLink, Hexagon, Trophy
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-cc38a303`;

export default function LotteryPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [ticketsSold, setTicketsSold] = useState(0);
  const [maxTickets, setMaxTickets] = useState(1000);
  const [ticketPrice] = useState(0.1);
  const [prizePool, setPrizePool] = useState(0);
  const [userTickets, setUserTickets] = useState(0);
  const [isBuying, setIsBuying] = useState(false);
  const [userAddress] = useState("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"); // Mock address
  const [lotteryId, setLotteryId] = useState<string | null>(null);
  const [winners, setWinners] = useState<any[]>([]);

  // Fetch lottery status
  useEffect(() => {
    const fetchLotteryStatus = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/lottery/status`);
        const data = await response.json();
        
        if (data.active && data.lottery) {
          setIsOpen(data.lottery.status === "open");
          setTicketsSold(data.lottery.ticketsSold || 0);
          setMaxTickets(data.lottery.maxTickets || 1000);
          setPrizePool((data.lottery.ticketsSold || 0) * ticketPrice);
          setLotteryId(data.lottery.id);
        } else {
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Error fetching lottery status:", error);
      }
    };

    fetchLotteryStatus();
    const interval = setInterval(fetchLotteryStatus, 3000);
    return () => clearInterval(interval);
  }, [ticketPrice]);

  // Fetch winners history
  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/lottery/history`);
        const data = await response.json();
        
        if (data.success && data.winners) {
          setWinners(data.winners.slice(0, 3).map((w: any) => ({
            address: w.value.winner,
            prize: w.value.prize,
            date: new Date(w.value.timestamp).toLocaleDateString('fr-FR'),
            hash: w.value.lotteryId.slice(-10)
          })));
        }
      } catch (error) {
        console.error("Error fetching winners:", error);
      }
    };

    fetchWinners();
  }, []);

  const handleBuyTicket = async () => {
    if (!isOpen) return;
    setIsBuying(true);
    
    try {
      const response = await fetch(`${SERVER_URL}/lottery/buy-ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          userAddress,
          txHash: `0x${Date.now().toString(16)}`
        })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);

      setUserTickets(prev => prev + 1);
      setTicketsSold(data.totalTickets);
      setPrizePool(prev => prev + ticketPrice);
      
      toast.success("Ticket Privilège Acquis", {
        description: `Votre ticket #${data.ticketNumber} a été enregistré sur la blockchain.`,
        style: { background: "#020202", border: "1px solid #d4af37", color: "#d4af37" }
      });
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'achat", {
        style: { background: "#3f0000", border: "1px solid #ff0000", color: "#ff8888" }
      });
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-24 pb-24 font-['Montserrat'] relative overflow-hidden">
      {/* Orbs de fond */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#d4af37]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Pattern grille */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* En-tête */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[#d4af37] text-xs font-semibold tracking-[0.2em] mb-6 uppercase"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Allocation Privilège</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl mb-6 text-white tracking-tight" 
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Lotterie <span className="text-[#d4af37] italic">On-Chain</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto font-light leading-relaxed text-lg"
          >
            Participez à la loterie la plus exclusive du Web3. Sécurisée par un oracle Midpoint, transparente, et sans friction. Remportez des allocations Ethereum ou des actifs immobiliers (ERC-3643).
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          {/* Main Lottery Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-8"
          >
            <div className="bg-black/60 border border-white/10 backdrop-blur-md p-8 relative overflow-hidden">
              {/* Status Badge */}
              <div className="absolute top-6 right-6">
                <div className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-2 ${
                  isOpen 
                    ? "bg-green-500/20 text-green-500 border border-green-500/50" 
                    : "bg-red-500/20 text-red-500 border border-red-500/50"
                }`}>
                  <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                  {isOpen ? "LOTERIE OUVERTE" : "LOTERIE FERMÉE"}
                </div>
              </div>

              <h2 className="text-3xl mb-8 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Session Actuelle
              </h2>

              {/* Prize Pool */}
              <div className="bg-gradient-to-r from-[#d4af37]/10 to-transparent p-6 border-l-4 border-[#d4af37] mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Cagnotte Totale</div>
                    <div className="text-5xl font-light text-[#d4af37]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {prizePool.toFixed(2)} <span className="text-2xl">ETH</span>
                    </div>
                  </div>
                  <Trophy className="w-16 h-16 text-[#d4af37]/30" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Tickets vendus</span>
                  <span className="text-white font-mono">{ticketsSold} / {maxTickets}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#d4af37] to-yellow-600 transition-all duration-500"
                    style={{ width: `${(ticketsSold / maxTickets) * 100}%` }}
                  />
                </div>
              </div>

              {/* User Tickets */}
              {userTickets > 0 && (
                <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 p-4 rounded-lg mb-8">
                  <div className="flex items-center gap-3">
                    <Ticket className="w-5 h-5 text-[#d4af37]" />
                    <span className="text-sm text-gray-300">
                      Vous possédez <span className="text-[#d4af37] font-bold">{userTickets} ticket{userTickets > 1 ? 's' : ''}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Buy Button */}
              <button 
                onClick={handleBuyTicket}
                disabled={!isOpen || isBuying}
                className={`w-full py-4 px-6 font-semibold uppercase tracking-widest text-sm transition-all relative overflow-hidden group ${
                  isOpen 
                    ? "bg-[#d4af37] hover:bg-[#c4a027] text-black" 
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isBuying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Achat en cours...
                    </>
                  ) : (
                    <>
                      <Ticket className="w-5 h-5" />
                      {isOpen ? `Acheter un ticket (${ticketPrice} ETH)` : "Loterie actuellement fermée"}
                    </>
                  )}
                </span>
              </button>

              <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4" />
                <span>Sécurisé par Midpoint Oracle VRF • Totalement transparent</span>
              </div>
            </div>
          </motion.div>

          {/* Sidebar Stats */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Countdown */}
            <div className="bg-black/60 border border-white/10 backdrop-blur-md p-6">
              <div className="flex items-center gap-2 text-[#d4af37] mb-4 uppercase tracking-wider text-xs">
                <Clock className="w-4 h-4" />
                <span>Tirage au sort</span>
              </div>
              <div className="text-2xl font-mono text-white">
                {isOpen ? "En attente..." : "Fermée"}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {isOpen ? "Le tirage aura lieu quand tous les tickets seront vendus" : "Nouvelle session bientôt"}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-black/60 border border-white/10 backdrop-blur-md p-6">
              <div className="flex items-center gap-2 text-[#d4af37] mb-4 uppercase tracking-wider text-xs">
                <Users className="w-4 h-4" />
                <span>Statistiques</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Prix du ticket</span>
                  <span className="text-white font-mono">{ticketPrice} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Participants</span>
                  <span className="text-white font-mono">{ticketsSold}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Vos tickets</span>
                  <span className="text-[#d4af37] font-mono font-bold">{userTickets}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Winners History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl mb-8 text-white text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Gagnants <span className="text-[#d4af37] italic">Précédents</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {winners.length > 0 ? winners.map((winner, idx) => (
              <div key={idx} className="bg-black/60 border border-white/10 backdrop-blur-md p-6 relative overflow-hidden group hover:border-[#d4af37]/50 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-3xl group-hover:bg-[#d4af37]/10 transition-all" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="w-5 h-5 text-[#d4af37]" />
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{winner.date}</span>
                  </div>
                  <div className="font-mono text-sm text-white mb-2">{winner.address}</div>
                  <div className="text-lg text-[#d4af37] font-semibold mb-4">{winner.prize}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ExternalLink className="w-3 h-3" />
                    <span className="font-mono">Hash: {winner.hash}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center text-gray-500 py-12">
                Aucun gagnant pour le moment. Soyez le premier !
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}