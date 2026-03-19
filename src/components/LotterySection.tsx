import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Sparkles, Trophy, Ticket, Clock, TrendingUp, Users, Coins, ChevronRight, Star, Zap, Gift, Crown, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface LotteryDraw {
  id: string;
  name: string;
  jackpot: number;
  ticketPrice: number;
  currency: string;
  nextDraw: Date;
  participants: number;
  odds: string;
  icon: string;
  gradient: string;
  winnerPrizes: number[];
  maxTickets: number;
  blockchain: string;
}

interface Winner {
  id: string;
  address: string;
  amount: number;
  lottery: string;
  date: string;
  verified: boolean;
}

const lotteryDraws: LotteryDraw[] = [
  {
    id: '1',
    name: 'Mega Jackpot Premium',
    jackpot: 50000000,
    ticketPrice: 100,
    currency: 'USDT',
    nextDraw: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    participants: 125420,
    odds: '1:1,000,000',
    icon: '👑',
    gradient: 'from-[#d4af37] to-[#f0e68c]',
    winnerPrizes: [50000000, 5000000, 1000000, 500000, 100000],
    maxTickets: 1000000,
    blockchain: 'Ethereum'
  },
  {
    id: '2',
    name: 'Luxury Diamond Draw',
    jackpot: 25000000,
    ticketPrice: 50,
    currency: 'ETH',
    nextDraw: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    participants: 89234,
    odds: '1:500,000',
    icon: '💎',
    gradient: 'from-blue-400 to-cyan-300',
    winnerPrizes: [25000000, 2500000, 500000, 250000, 50000],
    maxTickets: 500000,
    blockchain: 'Polygon'
  },
  {
    id: '3',
    name: 'Golden Fortune',
    jackpot: 10000000,
    ticketPrice: 25,
    currency: 'BNB',
    nextDraw: new Date(Date.now() + 12 * 60 * 60 * 1000),
    participants: 54891,
    odds: '1:250,000',
    icon: '🏆',
    gradient: 'from-amber-400 to-yellow-300',
    winnerPrizes: [10000000, 1000000, 250000, 100000, 25000],
    maxTickets: 250000,
    blockchain: 'BSC'
  },
  {
    id: '4',
    name: 'Elite Crypto Lottery',
    jackpot: 5000000,
    ticketPrice: 10,
    currency: 'SOL',
    nextDraw: new Date(Date.now() + 6 * 60 * 60 * 1000),
    participants: 31245,
    odds: '1:100,000',
    icon: '⚡',
    gradient: 'from-purple-400 to-pink-300',
    winnerPrizes: [5000000, 500000, 100000, 50000, 10000],
    maxTickets: 100000,
    blockchain: 'Solana'
  },
  {
    id: '5',
    name: 'Prestige Weekly',
    jackpot: 2500000,
    ticketPrice: 5,
    currency: 'MATIC',
    nextDraw: new Date(Date.now() + 3 * 60 * 60 * 1000),
    participants: 18567,
    odds: '1:50,000',
    icon: '🌟',
    gradient: 'from-indigo-400 to-purple-300',
    winnerPrizes: [2500000, 250000, 50000, 25000, 5000],
    maxTickets: 50000,
    blockchain: 'Polygon'
  },
  {
    id: '6',
    name: 'Daily Flash Prize',
    jackpot: 500000,
    ticketPrice: 1,
    currency: 'USDC',
    nextDraw: new Date(Date.now() + 2 * 60 * 60 * 1000),
    participants: 9845,
    odds: '1:10,000',
    icon: '⚡',
    gradient: 'from-green-400 to-emerald-300',
    winnerPrizes: [500000, 50000, 10000, 5000, 1000],
    maxTickets: 10000,
    blockchain: 'Arbitrum'
  },
];

const recentWinners: Winner[] = [
  {
    id: '1',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    amount: 50000000,
    lottery: 'Mega Jackpot Premium',
    date: '2 hours ago',
    verified: true
  },
  {
    id: '2',
    address: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
    amount: 25000000,
    lottery: 'Luxury Diamond Draw',
    date: '5 hours ago',
    verified: true
  },
  {
    id: '3',
    address: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
    amount: 10000000,
    lottery: 'Golden Fortune',
    date: '1 day ago',
    verified: true
  },
  {
    id: '4',
    address: '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c',
    amount: 5000000,
    lottery: 'Elite Crypto Lottery',
    date: '2 days ago',
    verified: true
  },
  {
    id: '5',
    address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
    amount: 2500000,
    lottery: 'Prestige Weekly',
    date: '3 days ago',
    verified: false
  },
];

export function LotterySection() {
  const [selectedLottery, setSelectedLottery] = useState<LotteryDraw | null>(null);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [myTickets, setMyTickets] = useState(0);

  const formatTimeRemaining = (targetDate: Date) => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) return `${days}j ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m ${seconds}s`;
  };

  const [timeRemaining, setTimeRemaining] = useState<Record<string, string>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining: Record<string, string> = {};
      lotteryDraws.forEach(draw => {
        newTimeRemaining[draw.id] = formatTimeRemaining(draw.nextDraw);
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleBuyTickets = (lottery: LotteryDraw) => {
    setSelectedLottery(lottery);
    setShowBuyDialog(true);
    setTicketQuantity(1);
  };

  const handlePurchase = () => {
    setIsPurchasing(true);
    setTimeout(() => {
      setIsPurchasing(false);
      setShowBuyDialog(false);
      setMyTickets(prev => prev + ticketQuantity);
      setTicketQuantity(1);
    }, 2000);
  };

  const totalJackpot = lotteryDraws.reduce((sum, draw) => sum + draw.jackpot, 0);
  const totalParticipants = lotteryDraws.reduce((sum, draw) => sum + draw.participants, 0);
  const totalWinners = recentWinners.length;

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a1a1a] to-black" />
        
        {/* Animated Orbs */}
        <motion.div
          animate={{
            opacity: [0.05, 0.15, 0.05],
            scale: [1, 1.4, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 right-1/4 w-[900px] h-[900px] bg-[#d4af37]/30 rounded-full blur-[200px]"
        />
        <motion.div
          animate={{
            opacity: [0.04, 0.12, 0.04],
            scale: [1.3, 1, 1.3],
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 left-1/4 w-[800px] h-[800px] bg-[#f0e68c]/20 rounded-full blur-[200px]"
        />

        {/* Floating Sparkles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [0, -100],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut"
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="inline-block mb-6"
          >
            <div className="px-6 py-2 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/5 backdrop-blur-sm">
              <span className="text-[#d4af37] tracking-[0.3em] text-xs" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                LOTERIE PREMIUM
              </span>
            </div>
          </motion.div>

          <h2 
            className="text-[3rem] md:text-[4rem] lg:text-[5rem] mb-6 text-[#d4af37] tracking-tight leading-[1.1]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
          >
            Gagnez des Millions
          </h2>
          
          <p 
            className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
          >
            Participez aux tirages premium sur blockchain. Transparence totale, gains instantanés, jackpots exceptionnels.
          </p>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Trophy className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              ${(totalJackpot / 1000000).toFixed(0)}M
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Jackpots Totaux
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Users className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {(totalParticipants / 1000).toFixed(0)}K
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Participants
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Star className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {totalWinners}
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Gagnants Récents
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Ticket className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {myTickets}
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Mes Tickets
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/[0.02] border border-[#d4af37]/20 rounded-2xl p-2 mb-8">
            <TabsTrigger 
              value="active"
              className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Tirages Actifs
            </TabsTrigger>
            <TabsTrigger 
              value="winners"
              className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <Crown className="w-4 h-4 mr-2" />
              Gagnants Récents
            </TabsTrigger>
          </TabsList>

          {/* Active Lotteries Tab */}
          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lotteryDraws.map((lottery, index) => (
                <motion.div
                  key={lottery.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 hover:border-[#d4af37]/40 transition-all group relative overflow-hidden"
                >
                  {/* Animated Gradient Background */}
                  <motion.div
                    animate={{
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`absolute inset-0 bg-gradient-to-br ${lottery.gradient} opacity-10`}
                  />

                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="text-5xl">{lottery.icon}</div>
                        <div>
                          <h3 
                            className="text-white text-lg"
                            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                          >
                            {lottery.name}
                          </h3>
                          <Badge variant="outline" className="text-xs border-[#d4af37]/30 text-[#d4af37] mt-1">
                            {lottery.blockchain}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Jackpot */}
                    <div className="mb-6">
                      <p 
                        className="text-white/60 text-sm mb-2"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        Jackpot
                      </p>
                      <p 
                        className={`text-4xl bg-gradient-to-r ${lottery.gradient} bg-clip-text text-transparent mb-1`}
                        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                      >
                        ${lottery.jackpot.toLocaleString()}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent mb-4" />

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Prix du ticket
                        </p>
                        <p 
                          className="text-white"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          {lottery.ticketPrice} {lottery.currency}
                        </p>
                      </div>
                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Participants
                        </p>
                        <p 
                          className="text-white"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          {lottery.participants.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Chances
                        </p>
                        <p 
                          className="text-white"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          {lottery.odds}
                        </p>
                      </div>
                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Prochain tirage
                        </p>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#d4af37]" />
                          <p 
                            className="text-[#d4af37]"
                            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                          >
                            {timeRemaining[lottery.id] || 'Calcul...'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-xs text-white/60 mb-2">
                        <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {lottery.participants.toLocaleString()} / {lottery.maxTickets.toLocaleString()} tickets
                        </span>
                        <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {((lottery.participants / lottery.maxTickets) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(lottery.participants / lottery.maxTickets) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-full bg-gradient-to-r ${lottery.gradient} rounded-full`}
                        />
                      </div>
                    </div>

                    {/* Buy Button */}
                    <Button
                      onClick={() => handleBuyTickets(lottery)}
                      className={`w-full bg-gradient-to-r ${lottery.gradient} text-black hover:opacity-90 transition-opacity`}
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                    >
                      <Ticket className="mr-2 w-4 h-4" />
                      Acheter des Tickets
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Recent Winners Tab */}
          <TabsContent value="winners" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-8"
            >
              <h3 
                className="text-2xl text-white mb-6"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                Derniers Gagnants
              </h3>

              <div className="space-y-4">
                {recentWinners.map((winner, index) => (
                  <motion.div
                    key={winner.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl border border-[#d4af37]/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-[#d4af37]/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 flex items-center justify-center">
                        <Crown className="w-6 h-6 text-[#d4af37]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p 
                            className="text-white"
                            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                          >
                            {winner.address.substring(0, 10)}...{winner.address.substring(winner.address.length - 8)}
                          </p>
                          {winner.verified && (
                            <div className="w-5 h-5 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                              <Check className="w-3 h-3 text-[#d4af37]" />
                            </div>
                          )}
                        </div>
                        <p 
                          className="text-white/60 text-sm"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
                        >
                          {winner.lottery}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p 
                        className="text-[#d4af37] text-lg"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                      >
                        ${winner.amount.toLocaleString()}
                      </p>
                      <p 
                        className="text-white/60 text-sm"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        {winner.date}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Buy Tickets Dialog */}
      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-xl">
          <DialogHeader>
            <DialogTitle 
              className="text-3xl text-[#d4af37] flex items-center gap-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="text-4xl">{selectedLottery?.icon}</span>
              Acheter des Tickets
            </DialogTitle>
            <DialogDescription 
              className="text-white/60"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {selectedLottery?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedLottery && (
            <div className="space-y-6 mt-6">
              {/* Jackpot Display */}
              <div className="rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/5 p-6 text-center">
                <p 
                  className="text-white/60 text-sm mb-2"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Jackpot
                </p>
                <p 
                  className={`text-5xl bg-gradient-to-r ${selectedLottery.gradient} bg-clip-text text-transparent`}
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                >
                  ${selectedLottery.jackpot.toLocaleString()}
                </p>
              </div>

              {/* Prize Breakdown */}
              <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] p-6">
                <h4 
                  className="text-white mb-4"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  Répartition des Prix
                </h4>
                <div className="space-y-2">
                  {selectedLottery.winnerPrizes.map((prize, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span 
                        className="text-white/60 text-sm"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        {index === 0 ? '🥇 1er Prix' : index === 1 ? '🥈 2ème Prix' : index === 2 ? '🥉 3ème Prix' : `#${index + 1}`}
                      </span>
                      <span 
                        className="text-[#d4af37]"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                      >
                        ${prize.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label 
                  className="text-white mb-3 block"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  Nombre de tickets
                </label>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                    variant="outline"
                    className="h-12 w-12 border-[#d4af37]/20 bg-white/[0.02] text-white hover:bg-white/[0.05]"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={ticketQuantity}
                    onChange={(e) => setTicketQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="h-12 text-center text-xl bg-white/[0.02] border-[#d4af37]/20 text-white"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                    min={1}
                  />
                  <Button
                    onClick={() => setTicketQuantity(ticketQuantity + 1)}
                    variant="outline"
                    className="h-12 w-12 border-[#d4af37]/20 bg-white/[0.02] text-white hover:bg-white/[0.05]"
                  >
                    +
                  </Button>
                </div>

                {/* Quick Select */}
                <div className="flex gap-2 mt-3">
                  {[5, 10, 25, 50].map(qty => (
                    <button
                      key={qty}
                      onClick={() => setTicketQuantity(qty)}
                      className="flex-1 px-3 py-2 rounded-lg text-sm border border-[#d4af37]/20 bg-white/[0.02] text-white hover:bg-white/[0.05] transition-all"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {qty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Cost */}
              <div className="rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/5 p-6">
                <div className="flex justify-between items-center mb-3">
                  <span 
                    className="text-white"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                  >
                    Prix unitaire
                  </span>
                  <span 
                    className="text-white"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                  >
                    {selectedLottery.ticketPrice} {selectedLottery.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span 
                    className="text-white"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                  >
                    Quantité
                  </span>
                  <span 
                    className="text-white"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                  >
                    {ticketQuantity}
                  </span>
                </div>
                <div className="w-full h-px bg-[#d4af37]/30 my-3" />
                <div className="flex justify-between items-center">
                  <span 
                    className="text-[#d4af37] text-lg"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                  >
                    Total
                  </span>
                  <span 
                    className="text-[#d4af37] text-2xl"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                  >
                    {selectedLottery.ticketPrice * ticketQuantity} {selectedLottery.currency}
                  </span>
                </div>
              </div>

              {/* Purchase Button */}
              <Button
                onClick={handlePurchase}
                disabled={isPurchasing}
                className={`w-full h-14 bg-gradient-to-r ${selectedLottery.gradient} text-black hover:opacity-90 transition-opacity disabled:opacity-50`}
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
              >
                {isPurchasing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"
                    />
                    Achat en cours...
                  </>
                ) : (
                  <>
                    <Gift className="mr-2 w-5 h-5" />
                    Acheter {ticketQuantity} Ticket{ticketQuantity > 1 ? 's' : ''}
                  </>
                )}
              </Button>

              {/* Info */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-[#d4af37]/10">
                <Sparkles className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                <p 
                  className="text-white/60 text-sm leading-relaxed"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Tirage dans {timeRemaining[selectedLottery.id]}. Vos numéros seront générés automatiquement. Bonne chance !
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default LotterySection;