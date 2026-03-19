import { motion } from "motion/react";
import { useState } from "react";
import { Lock, TrendingUp, Zap, Trophy, Gift, Clock, Flame, Star, Coins, Sparkles, ChevronRight, Check, Info, Crown, Calendar, Percent } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface StakingPool {
  id: string;
  asset: string;
  icon: string;
  blockchain: string;
  apy: number;
  tvl: number;
  minStake: number;
  lockPeriod: string;
  rewards: string;
  totalStakers: number;
  gradient: string;
  verified: boolean;
  featured: boolean;
}

interface UserStake {
  id: string;
  asset: string;
  amount: number;
  apy: number;
  rewards: number;
  startDate: string;
  endDate: string;
  icon: string;
  blockchain: string;
  gradient: string;
  status: 'active' | 'locked' | 'unlocking';
}

interface Blockchain {
  name: string;
  icon: string;
  color: string;
  category: string;
  pools: number;
  totalStaked: number;
}

const blockchains: Blockchain[] = [
  { name: 'Ethereum', icon: '⟠', color: '#627EEA', category: 'Layer 1', pools: 12, totalStaked: 450000000 },
  { name: 'Bitcoin', icon: '₿', color: '#F7931A', category: 'Layer 1', pools: 5, totalStaked: 320000000 },
  { name: 'Binance Smart Chain', icon: '🔶', color: '#F3BA2F', category: 'Layer 1', pools: 15, totalStaked: 380000000 },
  { name: 'Solana', icon: '◎', color: '#14F195', category: 'Layer 1', pools: 18, totalStaked: 290000000 },
  { name: 'Polygon', icon: '🟣', color: '#8247E5', category: 'Layer 2', pools: 20, totalStaked: 180000000 },
  { name: 'Avalanche', icon: '🔺', color: '#E84142', category: 'Layer 1', pools: 14, totalStaked: 250000000 },
  { name: 'Cardano', icon: '₳', color: '#0033AD', category: 'Layer 1', pools: 16, totalStaked: 340000000 },
  { name: 'Polkadot', icon: '●', color: '#E6007A', category: 'Layer 0', pools: 13, totalStaked: 220000000 },
  { name: 'Arbitrum', icon: '🔵', color: '#28A0F0', category: 'Layer 2', pools: 11, totalStaked: 160000000 },
  { name: 'Optimism', icon: '🔴', color: '#FF0420', category: 'Layer 2', pools: 9, totalStaked: 140000000 },
  { name: 'Cosmos', icon: '⚛', color: '#2E3148', category: 'Layer 0', pools: 17, totalStaked: 200000000 },
  { name: 'Aptos', icon: '🌊', color: '#00D4AA', category: 'Layer 1', pools: 8, totalStaked: 95000000 },
  { name: 'Sui', icon: '💧', color: '#4DA2FF', category: 'Layer 1', pools: 7, totalStaked: 85000000 },
  { name: 'Near', icon: '◊', color: '#00C08B', category: 'Layer 1', pools: 10, totalStaked: 120000000 },
  { name: 'Fantom', icon: '👻', color: '#1969FF', category: 'Layer 1', pools: 12, totalStaked: 110000000 },
  { name: 'Harmony', icon: '⬢', color: '#00ADE8', category: 'Layer 1', pools: 6, totalStaked: 75000000 },
  { name: 'Algorand', icon: '▲', color: '#000000', category: 'Layer 1', pools: 9, totalStaked: 105000000 },
  { name: 'Tezos', icon: 'ꜩ', color: '#2C7DF7', category: 'Layer 1', pools: 8, totalStaked: 98000000 },
  { name: 'Cronos', icon: '💎', color: '#002D74', category: 'Layer 1', pools: 11, totalStaked: 130000000 },
  { name: 'Moonbeam', icon: '🌙', color: '#53CBC8', category: 'Layer 1', pools: 7, totalStaked: 88000000 },
  { name: 'zkSync', icon: '⚡', color: '#8C8DFC', category: 'Layer 2', pools: 5, totalStaked: 92000000 },
  { name: 'StarkNet', icon: '✦', color: '#EC796B', category: 'Layer 2', pools: 6, totalStaked: 78000000 },
  { name: 'Base', icon: '🔷', color: '#0052FF', category: 'Layer 2', pools: 10, totalStaked: 145000000 },
  { name: 'Linea', icon: '〰', color: '#121212', category: 'Layer 2', pools: 4, totalStaked: 62000000 },
  { name: 'Scroll', icon: '📜', color: '#FFEEDA', category: 'Layer 2', pools: 3, totalStaked: 55000000 },
  { name: 'Mantle', icon: '🔰', color: '#000000', category: 'Layer 2', pools: 5, totalStaked: 68000000 },
  { name: 'Hedera', icon: 'ℏ', color: '#000000', category: 'Layer 1', pools: 7, totalStaked: 82000000 },
  { name: 'Flow', icon: '🌊', color: '#00EF8B', category: 'Layer 1', pools: 6, totalStaked: 76000000 },
  { name: 'ImmutableX', icon: '✖', color: '#0B0E11', category: 'Layer 2', pools: 4, totalStaked: 58000000 },
  { name: 'Celo', icon: '🌐', color: '#FBCC5C', category: 'Layer 1', pools: 8, totalStaked: 94000000 },
  { name: 'Klaytn', icon: '🟠', color: '#FF5500', category: 'Layer 1', pools: 9, totalStaked: 102000000 },
  { name: 'Kava', icon: '🟥', color: '#FF433E', category: 'Layer 1', pools: 6, totalStaked: 71000000 },
  { name: 'Secret Network', icon: '🔐', color: '#000000', category: 'Layer 1', pools: 7, totalStaked: 79000000 },
  { name: 'Osmosis', icon: '🧪', color: '#5E12A0', category: 'Layer 1', pools: 15, totalStaked: 168000000 },
  { name: 'Injective', icon: '⚡', color: '#00D4FF', category: 'Layer 1', pools: 10, totalStaked: 125000000 },
  { name: 'Terra', icon: '🌍', color: '#FFD83D', category: 'Layer 1', pools: 8, totalStaked: 96000000 },
  { name: 'Kujira', icon: '🐋', color: '#E74C3C', category: 'Layer 1', pools: 6, totalStaked: 73000000 },
  { name: 'Sei', icon: '🔷', color: '#B91C1C', category: 'Layer 1', pools: 9, totalStaked: 108000000 },
  { name: 'Celestia', icon: '✨', color: '#7B2BF9', category: 'Modular', pools: 5, totalStaked: 89000000 },
  { name: 'Berachain', icon: '🐻', color: '#DD6B20', category: 'Layer 1', pools: 7, totalStaked: 91000000 },
  { name: 'EOS', icon: '◯', color: '#000000', category: 'Layer 1', pools: 5, totalStaked: 64000000 },
  { name: 'TRON', icon: '▲', color: '#EC0928', category: 'Layer 1', pools: 12, totalStaked: 152000000 },
  { name: 'VeChain', icon: 'V', color: '#15BDFF', category: 'Layer 1', pools: 8, totalStaked: 97000000 },
  { name: 'IOTA', icon: '⟡', color: '#131F37', category: 'DAG', pools: 4, totalStaked: 61000000 },
  { name: 'Elrond', icon: '⚡', color: '#000000', category: 'Layer 1', pools: 11, totalStaked: 134000000 },
  { name: 'Zilliqa', icon: '⬢', color: '#49C1BF', category: 'Layer 1', pools: 6, totalStaked: 74000000 },
  { name: 'Theta', icon: 'θ', color: '#2AB8E6', category: 'Layer 1', pools: 7, totalStaked: 86000000 },
  { name: 'Waves', icon: '〰', color: '#0155FF', category: 'Layer 1', pools: 5, totalStaked: 69000000 },
  { name: 'NEO', icon: '●', color: '#58BF00', category: 'Layer 1', pools: 6, totalStaked: 77000000 },
  { name: 'ICON', icon: '⬢', color: '#1FC5C9', category: 'Layer 1', pools: 7, totalStaked: 83000000 },
  { name: 'Ontology', icon: '◯', color: '#00DABA', category: 'Layer 1', pools: 5, totalStaked: 66000000 },
  { name: 'Qtum', icon: '◆', color: '#359BCE', category: 'Layer 1', pools: 4, totalStaked: 59000000 },
  { name: 'Aion', icon: '△', color: '#00BFEC', category: 'Layer 1', pools: 3, totalStaked: 52000000 },
  { name: 'Wanchain', icon: '⬣', color: '#136AAD', category: 'Layer 1', pools: 5, totalStaked: 67000000 },
  { name: 'Tomochain', icon: '⬢', color: '#6F3FF5', category: 'Layer 1', pools: 4, totalStaked: 60000000 },
  { name: 'NEM', icon: '◯', color: '#67B2E8', category: 'Layer 1', pools: 6, totalStaked: 75000000 },
  { name: 'Lisk', icon: '⬢', color: '#0D4EA0', category: 'Layer 1', pools: 4, totalStaked: 58000000 },
  { name: 'Stratis', icon: '◯', color: '#1387C9', category: 'Layer 1', pools: 3, totalStaked: 54000000 },
  { name: 'Ark', icon: '△', color: '#F70000', category: 'Layer 1', pools: 5, totalStaked: 63000000 },
  { name: 'Nuls', icon: '◯', color: '#81C13E', category: 'Layer 1', pools: 4, totalStaked: 57000000 },
  { name: 'Aeternity', icon: '◆', color: '#DE3F6B', category: 'Layer 1', pools: 3, totalStaked: 51000000 },
  { name: 'Syscoin', icon: '◯', color: '#0082C6', category: 'Layer 1', pools: 5, totalStaked: 65000000 },
  { name: 'Neblio', icon: '◯', color: '#50479D', category: 'Layer 1', pools: 3, totalStaked: 49000000 },
  { name: 'IoTeX', icon: '◯', color: '#00D4AA', category: 'Layer 1', pools: 6, totalStaked: 72000000 },
  { name: 'Metis', icon: '🔷', color: '#00DACC', category: 'Layer 2', pools: 5, totalStaked: 81000000 },
];

const stakingPools: StakingPool[] = [
  {
    id: '1',
    asset: 'ETH 2.0',
    icon: '⟠',
    blockchain: 'Ethereum',
    apy: 15.5,
    tvl: 450000000,
    minStake: 0.1,
    lockPeriod: 'Flexible',
    rewards: 'ETH',
    totalStakers: 45820,
    gradient: 'from-[#627EEA] to-[#8B9FFF]',
    verified: true,
    featured: true
  },
  {
    id: '2',
    asset: 'SOL',
    icon: '◎',
    blockchain: 'Solana',
    apy: 18.2,
    tvl: 290000000,
    minStake: 1,
    lockPeriod: '30 days',
    rewards: 'SOL',
    totalStakers: 38940,
    gradient: 'from-[#14F195] to-[#9945FF]',
    verified: true,
    featured: true
  },
  {
    id: '3',
    asset: 'BNB',
    icon: '🔶',
    blockchain: 'BSC',
    apy: 12.8,
    tvl: 380000000,
    minStake: 0.5,
    lockPeriod: 'Flexible',
    rewards: 'BNB',
    totalStakers: 52103,
    gradient: 'from-[#F3BA2F] to-[#FCD535]',
    verified: true,
    featured: true
  },
  {
    id: '4',
    asset: 'ADA',
    icon: '₳',
    blockchain: 'Cardano',
    apy: 14.3,
    tvl: 340000000,
    minStake: 10,
    lockPeriod: '60 days',
    rewards: 'ADA',
    totalStakers: 41256,
    gradient: 'from-[#0033AD] to-[#3057D5]',
    verified: true,
    featured: true
  },
  {
    id: '5',
    asset: 'MATIC',
    icon: '🟣',
    blockchain: 'Polygon',
    apy: 16.7,
    tvl: 180000000,
    minStake: 100,
    lockPeriod: '90 days',
    rewards: 'MATIC',
    totalStakers: 28934,
    gradient: 'from-[#8247E5] to-[#A669F0]',
    verified: true,
    featured: false
  },
  {
    id: '6',
    asset: 'AVAX',
    icon: '🔺',
    blockchain: 'Avalanche',
    apy: 13.9,
    tvl: 250000000,
    minStake: 5,
    lockPeriod: 'Flexible',
    rewards: 'AVAX',
    totalStakers: 32891,
    gradient: 'from-[#E84142] to-[#FF6B6B]',
    verified: true,
    featured: false
  },
  {
    id: '7',
    asset: 'DOT',
    icon: '●',
    blockchain: 'Polkadot',
    apy: 17.4,
    tvl: 220000000,
    minStake: 1,
    lockPeriod: '120 days',
    rewards: 'DOT',
    totalStakers: 26745,
    gradient: 'from-[#E6007A] to-[#FF1A8A]',
    verified: true,
    featured: false
  },
  {
    id: '8',
    asset: 'ATOM',
    icon: '⚛',
    blockchain: 'Cosmos',
    apy: 19.8,
    tvl: 200000000,
    minStake: 1,
    lockPeriod: '21 days',
    rewards: 'ATOM',
    totalStakers: 24589,
    gradient: 'from-[#2E3148] to-[#5865F2]',
    verified: true,
    featured: true
  },
  {
    id: '9',
    asset: 'APT',
    icon: '🌊',
    blockchain: 'Aptos',
    apy: 22.5,
    tvl: 95000000,
    minStake: 10,
    lockPeriod: '30 days',
    rewards: 'APT',
    totalStakers: 15234,
    gradient: 'from-[#00D4AA] to-[#00FFD1]',
    verified: true,
    featured: true
  },
  {
    id: '10',
    asset: 'ARB',
    icon: '🔵',
    blockchain: 'Arbitrum',
    apy: 11.2,
    tvl: 160000000,
    minStake: 100,
    lockPeriod: 'Flexible',
    rewards: 'ARB',
    totalStakers: 19876,
    gradient: 'from-[#28A0F0] to-[#5BC0FF]',
    verified: true,
    featured: false
  },
];

const userStakes: UserStake[] = [
  {
    id: '1',
    asset: 'ETH 2.0',
    amount: 5.5,
    apy: 15.5,
    rewards: 0.852,
    startDate: '30 days ago',
    endDate: 'Flexible',
    icon: '⟠',
    blockchain: 'Ethereum',
    gradient: 'from-[#627EEA] to-[#8B9FFF]',
    status: 'active'
  },
  {
    id: '2',
    asset: 'SOL',
    amount: 850,
    apy: 18.2,
    rewards: 38.46,
    startDate: '15 days ago',
    endDate: 'In 15 days',
    icon: '◎',
    blockchain: 'Solana',
    gradient: 'from-[#14F195] to-[#9945FF]',
    status: 'locked'
  },
  {
    id: '3',
    asset: 'ATOM',
    amount: 1250,
    apy: 19.8,
    rewards: 61.56,
    startDate: '45 days ago',
    endDate: 'Unlocking',
    icon: '⚛',
    blockchain: 'Cosmos',
    gradient: 'from-[#2E3148] to-[#5865F2]',
    status: 'unlocking'
  },
];

export function StakingSection() {
  const [activeTab, setActiveTab] = useState("pools");
  const [showStakeDialog, setShowStakeDialog] = useState(false);
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleStake = (pool: StakingPool) => {
    setSelectedPool(pool);
    setShowStakeDialog(true);
    setStakeAmount("");
  };

  const handleSubmitStake = () => {
    setIsStaking(true);
    setTimeout(() => {
      setIsStaking(false);
      setShowStakeDialog(false);
      setStakeAmount("");
    }, 2500);
  };

  const totalTVL = stakingPools.reduce((sum, pool) => sum + pool.tvl, 0);
  const avgAPY = stakingPools.reduce((sum, pool) => sum + pool.apy, 0) / stakingPools.length;
  const totalStakers = stakingPools.reduce((sum, pool) => sum + pool.totalStakers, 0);
  
  const myTotalStaked = userStakes.reduce((sum, stake) => sum + stake.amount, 0);
  const myTotalRewards = userStakes.reduce((sum, stake) => sum + stake.rewards, 0);

  const categories = ['all', ...Array.from(new Set(blockchains.map(b => b.category)))];

  const filteredBlockchains = blockchains.filter(blockchain => {
    const matchesSearch = blockchain.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || blockchain.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPools = stakingPools.filter(pool => pool.featured);

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a1a1a] to-black" />
        
        {/* Animated Orbs */}
        <motion.div
          animate={{
            opacity: [0.04, 0.12, 0.04],
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/3 w-[1000px] h-[1000px] bg-[#d4af37]/20 rounded-full blur-[220px]"
        />
        <motion.div
          animate={{
            opacity: [0.05, 0.1, 0.05],
            scale: [1.5, 1, 1.5],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/3 w-[900px] h-[900px] bg-[#f0e68c]/15 rounded-full blur-[220px]"
        />

        {/* Floating Stars */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Star className="w-5 h-5 text-[#d4af37]" />
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
                STAKING PREMIUM
              </span>
            </div>
          </motion.div>

          <h2 
            className="text-[3rem] md:text-[4rem] lg:text-[5rem] mb-6 text-[#d4af37] tracking-tight leading-[1.1]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
          >
            Stakez & Gagnez
          </h2>
          
          <p 
            className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
          >
            Stakez vos cryptos sur 65 blockchains. APY jusqu'à 22.5%. Récompenses automatiques. Sécurisé et transparent.
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
              ${(totalTVL / 1000000000).toFixed(2)}B
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Total Staké
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Percent className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {avgAPY.toFixed(1)}%
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              APY Moyen
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Trophy className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {(totalStakers / 1000).toFixed(0)}K
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Stakers
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Sparkles className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              65
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Blockchains
            </p>
          </div>
        </motion.div>

        {/* Featured Pools Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 
              className="text-2xl text-white flex items-center gap-3"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              <Crown className="w-6 h-6 text-[#d4af37]" />
              Pools Premium
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPools.map((pool, index) => (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="rounded-2xl border border-[#d4af37]/30 bg-white/[0.03] backdrop-blur-xl p-6 hover:border-[#d4af37]/60 transition-all group relative overflow-hidden"
              >
                {/* Glow Effect */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-br opacity-0 group-hover:opacity-30 blur-xl transition-opacity"
                  style={{ background: `linear-gradient(to bottom right, ${pool.gradient})` }}
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{pool.icon}</div>
                    <Badge className="bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30">
                      <Flame className="w-3 h-3 mr-1" />
                      Hot
                    </Badge>
                  </div>

                  <h4 
                    className="text-white text-xl mb-2"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                  >
                    {pool.asset}
                  </h4>

                  <p 
                    className={`text-5xl bg-gradient-to-r ${pool.gradient} bg-clip-text text-transparent mb-4`}
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                  >
                    {pool.apy}%
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        TVL
                      </span>
                      <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                        ${(pool.tvl / 1000000).toFixed(0)}M
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Lock
                      </span>
                      <span className="text-[#d4af37]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                        {pool.lockPeriod}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleStake(pool)}
                    className={`w-full bg-gradient-to-r ${pool.gradient} text-white hover:opacity-90 transition-opacity`}
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                  >
                    <Lock className="mr-2 w-4 h-4" />
                    Staker
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/[0.02] border border-[#d4af37]/20 rounded-2xl p-2 mb-8">
            <TabsTrigger 
              value="pools"
              className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <Coins className="w-4 h-4 mr-2" />
              Tous les Pools
            </TabsTrigger>
            <TabsTrigger 
              value="mystakes"
              className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <Gift className="w-4 h-4 mr-2" />
              Mes Stakes
            </TabsTrigger>
            <TabsTrigger 
              value="blockchains"
              className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Blockchains (65)
            </TabsTrigger>
          </TabsList>

          {/* All Pools Tab */}
          <TabsContent value="pools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stakingPools.map((pool, index) => (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 hover:border-[#d4af37]/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{pool.icon}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 
                            className="text-white text-lg"
                            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                          >
                            {pool.asset}
                          </h4>
                          {pool.verified && (
                            <div className="w-5 h-5 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                              <Check className="w-3 h-3 text-[#d4af37]" />
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs border-[#d4af37]/30 text-[#d4af37]">
                          {pool.blockchain}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right">
                      <p 
                        className={`text-3xl bg-gradient-to-r ${pool.gradient} bg-clip-text text-transparent`}
                        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                      >
                        {pool.apy}%
                      </p>
                      <p 
                        className="text-white/60 text-xs"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        APY
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p 
                        className="text-white/60 text-xs mb-1"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        Total Staké
                      </p>
                      <p 
                        className="text-white"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                      >
                        ${(pool.tvl / 1000000).toFixed(0)}M
                      </p>
                    </div>

                    <div>
                      <p 
                        className="text-white/60 text-xs mb-1"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        Stakers
                      </p>
                      <p 
                        className="text-white"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                      >
                        {pool.totalStakers.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p 
                        className="text-white/60 text-xs mb-1"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        Période
                      </p>
                      <p 
                        className="text-[#d4af37]"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                      >
                        {pool.lockPeriod}
                      </p>
                    </div>

                    <div>
                      <p 
                        className="text-white/60 text-xs mb-1"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        Min Stake
                      </p>
                      <p 
                        className="text-white"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                      >
                        {pool.minStake} {pool.asset.split(' ')[0]}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleStake(pool)}
                    className="w-full bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                  >
                    <Lock className="mr-2 w-4 h-4" />
                    Staker Maintenant
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* My Stakes Tab */}
          <TabsContent value="mystakes" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/5 backdrop-blur-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  <div>
                    <p 
                      className="text-white/60 text-sm"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Total Staké
                    </p>
                    <p 
                      className="text-2xl text-[#d4af37]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {myTotalStaked.toLocaleString()} Assets
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-green-500/20 bg-green-500/5 backdrop-blur-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p 
                      className="text-white/60 text-sm"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Récompenses
                    </p>
                    <p 
                      className="text-2xl text-green-400"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      +{myTotalRewards.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  <div>
                    <p 
                      className="text-white/60 text-sm"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Positions Actives
                    </p>
                    <p 
                      className="text-2xl text-white"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {userStakes.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stakes List */}
            <div className="space-y-4">
              {userStakes.map((stake, index) => (
                <motion.div
                  key={stake.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{stake.icon}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 
                            className="text-white text-lg"
                            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                          >
                            {stake.asset}
                          </h4>
                          <Badge 
                            variant="outline"
                            className={`text-xs ${
                              stake.status === 'active' ? 'border-green-500/30 text-green-400' :
                              stake.status === 'locked' ? 'border-[#d4af37]/30 text-[#d4af37]' :
                              'border-orange-500/30 text-orange-400'
                            }`}
                          >
                            {stake.status === 'active' ? 'Active' : stake.status === 'locked' ? 'Locked' : 'Unlocking'}
                          </Badge>
                        </div>
                        <p 
                          className="text-white/60 text-sm"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          {stake.blockchain} • Depuis {stake.startDate}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-8">
                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Staké
                        </p>
                        <p 
                          className="text-white text-lg"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          {stake.amount.toLocaleString()}
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
                          className={`text-lg bg-gradient-to-r ${stake.gradient} bg-clip-text text-transparent`}
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          {stake.apy}%
                        </p>
                      </div>

                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Récompenses
                        </p>
                        <p 
                          className="text-green-400 text-lg"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          +{stake.rewards.toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Fin
                        </p>
                        <p 
                          className="text-white text-lg"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          {stake.endDate}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="border-[#d4af37]/20 bg-white/[0.02] text-white hover:bg-white/[0.05]"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                    >
                      <Gift className="mr-2 w-4 h-4" />
                      Claim
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Blockchains Tab */}
          <TabsContent value="blockchains" className="space-y-6">
            {/* Category Filters */}
            <div className="flex gap-2 flex-wrap mb-6">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40'
                      : 'bg-white/[0.02] text-white/60 border border-[#d4af37]/10 hover:border-[#d4af37]/30'
                  }`}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {category === 'all' ? 'Toutes' : category}
                </button>
              ))}
            </div>

            {/* Blockchains Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredBlockchains.map((blockchain, index) => (
                <motion.div
                  key={blockchain.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.02 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 hover:border-[#d4af37]/40 transition-all group text-center"
                >
                  <div className="text-4xl mb-3">{blockchain.icon}</div>
                  <p 
                    className="text-white text-sm mb-2"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                  >
                    {blockchain.name}
                  </p>
                  <Badge variant="outline" className="text-xs border-[#d4af37]/30 text-[#d4af37] mb-2">
                    {blockchain.category}
                  </Badge>
                  <div className="text-xs text-white/60 mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {blockchain.pools} pools • ${(blockchain.totalStaked / 1000000).toFixed(0)}M
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Stake Dialog */}
      <Dialog open={showStakeDialog} onOpenChange={setShowStakeDialog}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-xl">
          <DialogHeader>
            <DialogTitle 
              className="text-3xl text-[#d4af37] flex items-center gap-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="text-4xl">{selectedPool?.icon}</span>
              Staker {selectedPool?.asset}
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
              <div className={`rounded-xl border border-[#d4af37]/20 bg-gradient-to-br ${selectedPool.gradient} bg-opacity-10 p-6 text-center`}>
                <p 
                  className="text-white/60 text-sm mb-2"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Rendement Annuel
                </p>
                <p 
                  className={`text-6xl bg-gradient-to-r ${selectedPool.gradient} bg-clip-text text-transparent`}
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                >
                  {selectedPool.apy}%
                </p>
                <p 
                  className="text-white/60 text-sm mt-2"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  APY
                </p>
              </div>

              {/* Pool Details */}
              <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] p-6">
                <h4 
                  className="text-white mb-4"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  Détails du Pool
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Période de lock:
                    </span>
                    <span className="text-[#d4af37]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      {selectedPool.lockPeriod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Minimum:
                    </span>
                    <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      {selectedPool.minStake} {selectedPool.asset.split(' ')[0]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Récompenses en:
                    </span>
                    <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      {selectedPool.rewards}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Stakers:
                    </span>
                    <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      {selectedPool.totalStakers.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label 
                  className="text-white mb-3 block"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  Montant à staker
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder={`Min: ${selectedPool.minStake}`}
                    className="h-14 text-xl bg-white/[0.02] border-[#d4af37]/20 text-white pr-24"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  />
                  <span 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                  >
                    {selectedPool.asset.split(' ')[0]}
                  </span>
                </div>

                {/* Quick Amounts */}
                <div className="flex gap-2 mt-3">
                  {['25%', '50%', '75%', '100%'].map(pct => (
                    <button
                      key={pct}
                      onClick={() => setStakeAmount((selectedPool.minStake * 10).toString())}
                      className="flex-1 px-3 py-2 rounded-lg text-sm border border-[#d4af37]/20 bg-white/[0.02] text-white hover:bg-white/[0.05] transition-all"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {pct}
                    </button>
                  ))}
                </div>
              </div>

              {/* Earnings Estimate */}
              {stakeAmount && parseFloat(stakeAmount) >= selectedPool.minStake && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-green-500/20 bg-green-500/5 p-6"
                >
                  <h4 
                    className="text-green-400 mb-4"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                  >
                    Gains Estimés
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Par jour:
                      </span>
                      <span className="text-green-400" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                        +{(parseFloat(stakeAmount) * selectedPool.apy / 100 / 365).toFixed(4)} {selectedPool.rewards}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Par mois:
                      </span>
                      <span className="text-green-400" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                        +{(parseFloat(stakeAmount) * selectedPool.apy / 100 / 12).toFixed(4)} {selectedPool.rewards}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Par an:
                      </span>
                      <span className="text-green-400 text-lg" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                        +{(parseFloat(stakeAmount) * selectedPool.apy / 100).toFixed(4)} {selectedPool.rewards}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmitStake}
                disabled={!stakeAmount || parseFloat(stakeAmount) < selectedPool.minStake || isStaking}
                className={`w-full h-14 bg-gradient-to-r ${selectedPool.gradient} text-white hover:opacity-90 transition-opacity disabled:opacity-50`}
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
              >
                {isStaking ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Staking en cours...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 w-5 h-5" />
                    Confirmer le Stake
                  </>
                )}
              </Button>

              {/* Info */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-[#d4af37]/10">
                <Info className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                <p 
                  className="text-white/60 text-sm leading-relaxed"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Vos tokens seront stakés pour {selectedPool.lockPeriod}. Les récompenses sont distribuées automatiquement chaque jour.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default StakingSection;