import { motion } from "motion/react";
import { useState } from "react";
import { TrendingUp, TrendingDown, Lock, Unlock, DollarSign, Percent, Shield, AlertCircle, ChevronRight, Coins, Wallet, PiggyBank, CreditCard, ArrowUpRight, ArrowDownRight, Check, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface LendingPool {
  id: string;
  asset: string;
  icon: string;
  color: string;
  totalSupply: number;
  totalBorrowed: number;
  supplyAPY: number;
  borrowAPY: number;
  collateralFactor: number;
  utilizationRate: number;
  blockchain: string;
  price: number;
}

interface UserPosition {
  id: string;
  type: 'lend' | 'borrow';
  asset: string;
  amount: number;
  apy: number;
  value: number;
  startDate: string;
  icon: string;
  color: string;
}

const lendingPools: LendingPool[] = [
  {
    id: '1',
    asset: 'USDT',
    icon: '💵',
    color: '#26A17B',
    totalSupply: 250000000,
    totalBorrowed: 187500000,
    supplyAPY: 8.5,
    borrowAPY: 12.3,
    collateralFactor: 85,
    utilizationRate: 75,
    blockchain: 'Ethereum',
    price: 1.00
  },
  {
    id: '2',
    asset: 'ETH',
    icon: '⟠',
    color: '#627EEA',
    totalSupply: 85000,
    totalBorrowed: 59500,
    supplyAPY: 5.2,
    borrowAPY: 8.7,
    collateralFactor: 80,
    utilizationRate: 70,
    blockchain: 'Ethereum',
    price: 3450.00
  },
  {
    id: '3',
    asset: 'BTC',
    icon: '₿',
    color: '#F7931A',
    totalSupply: 1250,
    totalBorrowed: 875,
    supplyAPY: 4.8,
    borrowAPY: 7.9,
    collateralFactor: 75,
    utilizationRate: 70,
    blockchain: 'Bitcoin',
    price: 68500.00
  },
  {
    id: '4',
    asset: 'USDC',
    icon: '💰',
    color: '#2775CA',
    totalSupply: 180000000,
    totalBorrowed: 126000000,
    supplyAPY: 9.2,
    borrowAPY: 13.5,
    collateralFactor: 85,
    utilizationRate: 70,
    blockchain: 'Polygon',
    price: 1.00
  },
  {
    id: '5',
    asset: 'DAI',
    icon: '◈',
    color: '#F5AC37',
    totalSupply: 120000000,
    totalBorrowed: 84000000,
    supplyAPY: 7.8,
    borrowAPY: 11.2,
    collateralFactor: 85,
    utilizationRate: 70,
    blockchain: 'Ethereum',
    price: 1.00
  },
  {
    id: '6',
    asset: 'SOL',
    icon: '◎',
    color: '#14F195',
    totalSupply: 2500000,
    totalBorrowed: 1500000,
    supplyAPY: 6.5,
    borrowAPY: 10.8,
    collateralFactor: 70,
    utilizationRate: 60,
    blockchain: 'Solana',
    price: 145.00
  },
  {
    id: '7',
    asset: 'BNB',
    icon: '🔶',
    color: '#F3BA2F',
    totalSupply: 850000,
    totalBorrowed: 510000,
    supplyAPY: 5.8,
    borrowAPY: 9.5,
    collateralFactor: 75,
    utilizationRate: 60,
    blockchain: 'BSC',
    price: 590.00
  },
  {
    id: '8',
    asset: 'MATIC',
    icon: '🟣',
    color: '#8247E5',
    totalSupply: 45000000,
    totalBorrowed: 27000000,
    supplyAPY: 7.2,
    borrowAPY: 11.8,
    collateralFactor: 70,
    utilizationRate: 60,
    blockchain: 'Polygon',
    price: 0.85
  },
];

const mockUserPositions: UserPosition[] = [
  {
    id: '1',
    type: 'lend',
    asset: 'USDT',
    amount: 50000,
    apy: 8.5,
    value: 50000,
    startDate: '15 days ago',
    icon: '💵',
    color: '#26A17B'
  },
  {
    id: '2',
    type: 'lend',
    asset: 'ETH',
    amount: 10,
    apy: 5.2,
    value: 34500,
    startDate: '30 days ago',
    icon: '⟠',
    color: '#627EEA'
  },
  {
    id: '3',
    type: 'borrow',
    asset: 'USDC',
    amount: 25000,
    apy: 13.5,
    value: 25000,
    startDate: '7 days ago',
    icon: '💰',
    color: '#2775CA'
  },
];

export function LendingSection() {
  const [activeTab, setActiveTab] = useState("lend");
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [selectedPool, setSelectedPool] = useState<LendingPool | null>(null);
  const [actionType, setActionType] = useState<'lend' | 'borrow'>('lend');
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = (pool: LendingPool, type: 'lend' | 'borrow') => {
    setSelectedPool(pool);
    setActionType(type);
    setShowActionDialog(true);
    setAmount("");
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowActionDialog(false);
      setAmount("");
    }, 2000);
  };

  const totalValueLocked = lendingPools.reduce((sum, pool) => {
    return sum + (pool.totalSupply * pool.price);
  }, 0);

  const totalBorrowed = lendingPools.reduce((sum, pool) => {
    return sum + (pool.totalBorrowed * pool.price);
  }, 0);

  const avgSupplyAPY = lendingPools.reduce((sum, pool) => sum + pool.supplyAPY, 0) / lendingPools.length;

  const myTotalLent = mockUserPositions
    .filter(p => p.type === 'lend')
    .reduce((sum, p) => sum + p.value, 0);

  const myTotalBorrowed = mockUserPositions
    .filter(p => p.type === 'borrow')
    .reduce((sum, p) => sum + p.value, 0);

  const myEarnings = mockUserPositions
    .filter(p => p.type === 'lend')
    .reduce((sum, p) => sum + (p.value * p.apy / 100 / 12), 0);

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a1a1a] to-black" />
        <motion.div
          animate={{
            opacity: [0.03, 0.09, 0.03],
            scale: [1, 1.35, 1],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 left-1/4 w-[850px] h-[850px] bg-[#d4af37]/25 rounded-full blur-[190px]"
        />
        <motion.div
          animate={{
            opacity: [0.04, 0.08, 0.04],
            scale: [1.35, 1, 1.35],
          }}
          transition={{
            duration: 29,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/3 right-1/4 w-[750px] h-[750px] bg-[#f0e68c]/18 rounded-full blur-[190px]"
        />
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
                MARKETPLACE DE PRÊT
              </span>
            </div>
          </motion.div>

          <h2 
            className="text-[3rem] md:text-[4rem] lg:text-[5rem] mb-6 text-[#d4af37] tracking-tight leading-[1.1]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
          >
            Prêtez & Empruntez
          </h2>
          
          <p 
            className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
          >
            Gagnez des intérêts sur vos actifs ou empruntez contre vos cryptos. Sécurisé, transparent, décentralisé.
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
            <Lock className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              ${(totalValueLocked / 1000000000).toFixed(2)}B
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Total Value Locked
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {avgSupplyAPY.toFixed(2)}%
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              APY Moyen
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <CreditCard className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              ${(totalBorrowed / 1000000000).toFixed(2)}B
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Total Emprunté
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Coins className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {lendingPools.length}
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Pools Disponibles
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/[0.02] border border-[#d4af37]/20 rounded-2xl p-2 mb-8">
            <TabsTrigger 
              value="lend"
              className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <PiggyBank className="w-4 h-4 mr-2" />
              Prêter
            </TabsTrigger>
            <TabsTrigger 
              value="borrow"
              className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <Wallet className="w-4 h-4 mr-2" />
              Emprunter
            </TabsTrigger>
            <TabsTrigger 
              value="positions"
              className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <Shield className="w-4 h-4 mr-2" />
              Mes Positions
            </TabsTrigger>
          </TabsList>

          {/* Lend Tab */}
          <TabsContent value="lend" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {lendingPools.map((pool, index) => (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                  className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 hover:border-[#d4af37]/40 transition-all group"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Asset Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-5xl">{pool.icon}</div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 
                            className="text-white text-xl"
                            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                          >
                            {pool.asset}
                          </h3>
                          <Badge variant="outline" className="text-xs border-[#d4af37]/30 text-[#d4af37]">
                            {pool.blockchain}
                          </Badge>
                        </div>
                        <p 
                          className="text-white/60 text-sm"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          ${pool.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          APY Prêt
                        </p>
                        <p 
                          className="text-green-400 text-lg flex items-center gap-1"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                          {pool.supplyAPY}%
                        </p>
                      </div>

                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Total Déposé
                        </p>
                        <p 
                          className="text-white text-lg"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          ${(pool.totalSupply * pool.price / 1000000).toFixed(2)}M
                        </p>
                      </div>

                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Utilisation
                        </p>
                        <p 
                          className="text-[#d4af37] text-lg"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          {pool.utilizationRate}%
                        </p>
                      </div>

                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Collateral
                        </p>
                        <p 
                          className="text-white text-lg"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          {pool.collateralFactor}%
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleAction(pool, 'lend')}
                      className="bg-gradient-to-r from-green-500 to-emerald-400 text-white hover:opacity-90 transition-opacity"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                    >
                      <ArrowUpRight className="mr-2 w-4 h-4" />
                      Prêter
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-white/60 mb-2">
                      <span style={{ fontFamily: "'Montserrat', sans-serif" }}>Taux d'utilisation</span>
                      <span style={{ fontFamily: "'Montserrat', sans-serif" }}>{pool.utilizationRate}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pool.utilizationRate}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-[#d4af37] to-[#f0e68c] rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Borrow Tab */}
          <TabsContent value="borrow" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {lendingPools.map((pool, index) => (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                  className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 hover:border-[#d4af37]/40 transition-all group"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Asset Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-5xl">{pool.icon}</div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 
                            className="text-white text-xl"
                            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                          >
                            {pool.asset}
                          </h3>
                          <Badge variant="outline" className="text-xs border-[#d4af37]/30 text-[#d4af37]">
                            {pool.blockchain}
                          </Badge>
                        </div>
                        <p 
                          className="text-white/60 text-sm"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          ${pool.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          APY Emprunt
                        </p>
                        <p 
                          className="text-red-400 text-lg flex items-center gap-1"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          <ArrowDownRight className="w-4 h-4" />
                          {pool.borrowAPY}%
                        </p>
                      </div>

                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Disponible
                        </p>
                        <p 
                          className="text-white text-lg"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          ${((pool.totalSupply - pool.totalBorrowed) * pool.price / 1000000).toFixed(2)}M
                        </p>
                      </div>

                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Collateral Min
                        </p>
                        <p 
                          className="text-[#d4af37] text-lg"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          {pool.collateralFactor}%
                        </p>
                      </div>

                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Liquidation
                        </p>
                        <p 
                          className="text-white text-lg"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          {pool.collateralFactor + 10}%
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleAction(pool, 'borrow')}
                      className="bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                    >
                      <ArrowDownRight className="mr-2 w-4 h-4" />
                      Emprunter
                    </Button>
                  </div>

                  {/* Availability Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-white/60 mb-2">
                      <span style={{ fontFamily: "'Montserrat', sans-serif" }}>Disponibilité</span>
                      <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {((pool.totalSupply - pool.totalBorrowed) / pool.totalSupply * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(pool.totalSupply - pool.totalBorrowed) / pool.totalSupply * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* My Positions Tab */}
          <TabsContent value="positions" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="rounded-2xl border border-green-500/20 bg-green-500/5 backdrop-blur-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <PiggyBank className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p 
                      className="text-white/60 text-sm"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Total Prêté
                    </p>
                    <p 
                      className="text-2xl text-green-400"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      ${myTotalLent.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/5 backdrop-blur-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  <div>
                    <p 
                      className="text-white/60 text-sm"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Gains Mensuels
                    </p>
                    <p 
                      className="text-2xl text-[#d4af37]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      +${myEarnings.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <p 
                      className="text-white/60 text-sm"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Total Emprunté
                    </p>
                    <p 
                      className="text-2xl text-red-400"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      ${myTotalBorrowed.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Positions List */}
            <div className="space-y-4">
              <h3 
                className="text-2xl text-white mb-4"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                Positions Actives
              </h3>

              {mockUserPositions.map((position, index) => (
                <motion.div
                  key={position.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`rounded-2xl border p-6 ${
                    position.type === 'lend' 
                      ? 'border-green-500/20 bg-green-500/5' 
                      : 'border-red-500/20 bg-red-500/5'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{position.icon}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 
                            className="text-white text-lg"
                            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                          >
                            {position.asset}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              position.type === 'lend' 
                                ? 'border-green-500/30 text-green-400' 
                                : 'border-red-500/30 text-red-400'
                            }`}
                          >
                            {position.type === 'lend' ? 'Prêt' : 'Emprunt'}
                          </Badge>
                        </div>
                        <p 
                          className="text-white/60 text-sm"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Depuis {position.startDate}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Montant
                        </p>
                        <p 
                          className="text-white text-lg"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          {position.amount.toLocaleString()} {position.asset}
                        </p>
                      </div>

                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          APY
                        </p>
                        <p 
                          className={`text-lg ${position.type === 'lend' ? 'text-green-400' : 'text-red-400'}`}
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          {position.type === 'lend' ? '+' : '-'}{position.apy}%
                        </p>
                      </div>

                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Valeur
                        </p>
                        <p 
                          className="text-white text-lg"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          ${position.value.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="border-[#d4af37]/20 bg-white/[0.02] text-white hover:bg-white/[0.05]"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                    >
                      {position.type === 'lend' ? 'Retirer' : 'Rembourser'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-xl">
          <DialogHeader>
            <DialogTitle 
              className="text-3xl text-[#d4af37] flex items-center gap-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="text-4xl">{selectedPool?.icon}</span>
              {actionType === 'lend' ? 'Prêter' : 'Emprunter'} {selectedPool?.asset}
            </DialogTitle>
            <DialogDescription 
              className="text-white/60"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {selectedPool?.blockchain}
            </DialogDescription>
          </DialogHeader>

          {selectedPool && (
            <div className="space-y-6 mt-6">
              {/* APY Display */}
              <div className={`rounded-xl border p-6 text-center ${
                actionType === 'lend' 
                  ? 'border-green-500/20 bg-green-500/5' 
                  : 'border-red-500/20 bg-red-500/5'
              }`}>
                <p 
                  className="text-white/60 text-sm mb-2"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {actionType === 'lend' ? 'Taux de rendement' : "Taux d'emprunt"}
                </p>
                <p 
                  className={`text-5xl ${actionType === 'lend' ? 'text-green-400' : 'text-red-400'}`}
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                >
                  {actionType === 'lend' ? '+' : '-'}{actionType === 'lend' ? selectedPool.supplyAPY : selectedPool.borrowAPY}%
                </p>
                <p 
                  className="text-white/60 text-sm mt-2"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  APY
                </p>
              </div>

              {/* Amount Input */}
              <div>
                <label 
                  className="text-white mb-3 block"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  Montant
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="h-14 text-xl bg-white/[0.02] border-[#d4af37]/20 text-white pr-20"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  />
                  <span 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                  >
                    {selectedPool.asset}
                  </span>
                </div>

                {/* Quick Amounts */}
                <div className="flex gap-2 mt-3">
                  {['25%', '50%', '75%', '100%'].map(pct => (
                    <button
                      key={pct}
                      onClick={() => setAmount('1000')}
                      className="flex-1 px-3 py-2 rounded-lg text-sm border border-[#d4af37]/20 bg-white/[0.02] text-white hover:bg-white/[0.05] transition-all"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {pct}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Card */}
              {actionType === 'borrow' && (
                <div className="rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/5 p-6">
                  <h4 
                    className="text-[#d4af37] mb-4"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                  >
                    Collateral Requis
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Ratio minimum:
                      </span>
                      <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                        {selectedPool.collateralFactor}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Liquidation:
                      </span>
                      <span className="text-red-400" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                        {selectedPool.collateralFactor + 10}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              {amount && (
                <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Montant:
                      </span>
                      <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                        {amount} {selectedPool.asset}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Valeur:
                      </span>
                      <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                        ${(parseFloat(amount) * selectedPool.price).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {actionType === 'lend' ? 'Gains annuels estimés:' : 'Intérêts annuels:'}
                      </span>
                      <span className={actionType === 'lend' ? 'text-green-400' : 'text-red-400'} style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                        {actionType === 'lend' ? '+' : '-'}${(parseFloat(amount) * selectedPool.price * (actionType === 'lend' ? selectedPool.supplyAPY : selectedPool.borrowAPY) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!amount || isProcessing}
                className={`w-full h-14 ${
                  actionType === 'lend'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                    : 'bg-gradient-to-r from-[#d4af37] to-[#f0e68c]'
                } text-${actionType === 'lend' ? 'white' : 'black'} hover:opacity-90 transition-opacity disabled:opacity-50`}
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
              >
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className={`w-5 h-5 border-2 border-${actionType === 'lend' ? 'white' : 'black'} border-t-transparent rounded-full mr-2`}
                    />
                    Transaction en cours...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 w-5 h-5" />
                    Confirmer {actionType === 'lend' ? 'le prêt' : "l'emprunt"}
                  </>
                )}
              </Button>

              {/* Warning */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-[#d4af37]/10">
                <Info className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                <p 
                  className="text-white/60 text-sm leading-relaxed"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {actionType === 'lend' 
                    ? "Vos fonds seront déposés dans un smart contract sécurisé. Vous pouvez les retirer à tout moment."
                    : "Assurez-vous d'avoir suffisamment de collateral. Une baisse du prix peut entraîner une liquidation."
                  }
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default LendingSection;