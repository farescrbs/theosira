import { motion } from "motion/react";
import { useState } from "react";
import { Coins, Plus, TrendingUp, Shield, Zap, Search, Filter, ChevronDown, Globe, Sparkles, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface TokenItem {
  id: string;
  name: string;
  symbol: string;
  blockchain: string;
  supply: string;
  price: number;
  marketCap: number;
  holders: number;
  change24h: number;
  logo: string;
  creator: string;
  verified: boolean;
}

interface Blockchain {
  name: string;
  icon: string;
  color: string;
  category: string;
}

const blockchains: Blockchain[] = [
  { name: 'Ethereum', icon: '⟠', color: '#627EEA', category: 'Layer 1' },
  { name: 'Bitcoin', icon: '₿', color: '#F7931A', category: 'Layer 1' },
  { name: 'Binance Smart Chain', icon: '🔶', color: '#F3BA2F', category: 'Layer 1' },
  { name: 'Solana', icon: '◎', color: '#14F195', category: 'Layer 1' },
  { name: 'Polygon', icon: '🟣', color: '#8247E5', category: 'Layer 2' },
  { name: 'Avalanche', icon: '🔺', color: '#E84142', category: 'Layer 1' },
  { name: 'Cardano', icon: '₳', color: '#0033AD', category: 'Layer 1' },
  { name: 'Polkadot', icon: '●', color: '#E6007A', category: 'Layer 0' },
  { name: 'Arbitrum', icon: '🔵', color: '#28A0F0', category: 'Layer 2' },
  { name: 'Optimism', icon: '🔴', color: '#FF0420', category: 'Layer 2' },
  { name: 'Cosmos', icon: '⚛', color: '#2E3148', category: 'Layer 0' },
  { name: 'Aptos', icon: '🌊', color: '#00D4AA', category: 'Layer 1' },
  { name: 'Sui', icon: '💧', color: '#4DA2FF', category: 'Layer 1' },
  { name: 'Near', icon: '◊', color: '#00C08B', category: 'Layer 1' },
  { name: 'Fantom', icon: '👻', color: '#1969FF', category: 'Layer 1' },
  { name: 'Harmony', icon: '⬢', color: '#00ADE8', category: 'Layer 1' },
  { name: 'Algorand', icon: '▲', color: '#000000', category: 'Layer 1' },
  { name: 'Tezos', icon: 'ꜩ', color: '#2C7DF7', category: 'Layer 1' },
  { name: 'Cronos', icon: '💎', color: '#002D74', category: 'Layer 1' },
  { name: 'Moonbeam', icon: '🌙', color: '#53CBC8', category: 'Layer 1' },
  { name: 'zkSync', icon: '⚡', color: '#8C8DFC', category: 'Layer 2' },
  { name: 'StarkNet', icon: '✦', color: '#EC796B', category: 'Layer 2' },
  { name: 'Base', icon: '🔷', color: '#0052FF', category: 'Layer 2' },
  { name: 'Linea', icon: '〰', color: '#121212', category: 'Layer 2' },
  { name: 'Scroll', icon: '📜', color: '#FFEEDA', category: 'Layer 2' },
  { name: 'Mantle', icon: '🔰', color: '#000000', category: 'Layer 2' },
  { name: 'Hedera', icon: 'ℏ', color: '#000000', category: 'Layer 1' },
  { name: 'Flow', icon: '🌊', color: '#00EF8B', category: 'Layer 1' },
  { name: 'ImmutableX', icon: '✖', color: '#0B0E11', category: 'Layer 2' },
  { name: 'Celo', icon: '🌐', color: '#FBCC5C', category: 'Layer 1' },
  { name: 'Klaytn', icon: '🟠', color: '#FF5500', category: 'Layer 1' },
  { name: 'Kava', icon: '🟥', color: '#FF433E', category: 'Layer 1' },
  { name: 'Secret Network', icon: '🔐', color: '#000000', category: 'Layer 1' },
  { name: 'Osmosis', icon: '🧪', color: '#5E12A0', category: 'Layer 1' },
  { name: 'Injective', icon: '⚡', color: '#00D4FF', category: 'Layer 1' },
  { name: 'Terra', icon: '🌍', color: '#FFD83D', category: 'Layer 1' },
  { name: 'Kujira', icon: '🐋', color: '#E74C3C', category: 'Layer 1' },
  { name: 'Sei', icon: '🔷', color: '#B91C1C', category: 'Layer 1' },
  { name: 'Celestia', icon: '✨', color: '#7B2BF9', category: 'Modular' },
  { name: 'Berachain', icon: '🐻', color: '#DD6B20', category: 'Layer 1' },
  { name: 'EOS', icon: '◯', color: '#000000', category: 'Layer 1' },
  { name: 'TRON', icon: '▲', color: '#EC0928', category: 'Layer 1' },
  { name: 'VeChain', icon: 'V', color: '#15BDFF', category: 'Layer 1' },
  { name: 'IOTA', icon: '⟡', color: '#131F37', category: 'DAG' },
  { name: 'Elrond', icon: '⚡', color: '#000000', category: 'Layer 1' },
  { name: 'Zilliqa', icon: '⬢', color: '#49C1BF', category: 'Layer 1' },
  { name: 'Theta', icon: 'θ', color: '#2AB8E6', category: 'Layer 1' },
  { name: 'Waves', icon: '〰', color: '#0155FF', category: 'Layer 1' },
  { name: 'NEO', icon: '●', color: '#58BF00', category: 'Layer 1' },
  { name: 'ICON', icon: '⬢', color: '#1FC5C9', category: 'Layer 1' },
  { name: 'Ontology', icon: '◯', color: '#00DABA', category: 'Layer 1' },
  { name: 'Qtum', icon: '◆', color: '#359BCE', category: 'Layer 1' },
  { name: 'Aion', icon: '△', color: '#00BFEC', category: 'Layer 1' },
  { name: 'Wanchain', icon: '⬣', color: '#136AAD', category: 'Layer 1' },
  { name: 'Tomochain', icon: '⬢', color: '#6F3FF5', category: 'Layer 1' },
  { name: 'NEM', icon: '◯', color: '#67B2E8', category: 'Layer 1' },
  { name: 'Lisk', icon: '⬢', color: '#0D4EA0', category: 'Layer 1' },
  { name: 'Stratis', icon: '◯', color: '#1387C9', category: 'Layer 1' },
  { name: 'Ark', icon: '△', color: '#F70000', category: 'Layer 1' },
  { name: 'Nuls', icon: '◯', color: '#81C13E', category: 'Layer 1' },
  { name: 'Aeternity', icon: '◆', color: '#DE3F6B', category: 'Layer 1' },
  { name: 'Syscoin', icon: '◯', color: '#0082C6', category: 'Layer 1' },
  { name: 'Neblio', icon: '◯', color: '#50479D', category: 'Layer 1' },
  { name: 'IoTeX', icon: '◯', color: '#00D4AA', category: 'Layer 1' },
  { name: 'Metis', icon: '🔷', color: '#00DACC', category: 'Layer 2' },
];

const mockTokens: TokenItem[] = [
  {
    id: '1',
    name: 'Luxury Yacht Token',
    symbol: 'LYT',
    blockchain: 'Ethereum',
    supply: '10,000,000',
    price: 125.50,
    marketCap: 1255000000,
    holders: 15420,
    change24h: 12.5,
    logo: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=100&h=100&fit=crop',
    creator: '0x742d...0bEb',
    verified: true
  },
  {
    id: '2',
    name: 'Premium Estate',
    symbol: 'PEST',
    blockchain: 'Polygon',
    supply: '5,000,000',
    price: 89.99,
    marketCap: 449950000,
    holders: 8934,
    change24h: -2.3,
    logo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100&h=100&fit=crop',
    creator: '0x123a...4def',
    verified: true
  },
  {
    id: '3',
    name: 'Gold Reserve Token',
    symbol: 'GRT',
    blockchain: 'Binance Smart Chain',
    supply: '1,000,000',
    price: 1840.00,
    marketCap: 1840000000,
    holders: 25601,
    change24h: 5.7,
    logo: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=100&h=100&fit=crop',
    creator: '0xabc1...9xyz',
    verified: true
  },
  {
    id: '4',
    name: 'Diamond Asset',
    symbol: 'DIAM',
    blockchain: 'Solana',
    supply: '500,000',
    price: 3250.00,
    marketCap: 1625000000,
    holders: 12045,
    change24h: 18.9,
    logo: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop',
    creator: '0x456b...1abc',
    verified: true
  },
  {
    id: '5',
    name: 'Art Collection NFT',
    symbol: 'ACNFT',
    blockchain: 'Arbitrum',
    supply: '100,000',
    price: 450.00,
    marketCap: 45000000,
    holders: 5420,
    change24h: -1.2,
    logo: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=100&h=100&fit=crop',
    creator: '0x789c...5def',
    verified: false
  },
  {
    id: '6',
    name: 'Prestige Membership',
    symbol: 'PREM',
    blockchain: 'Avalanche',
    supply: '250,000',
    price: 890.00,
    marketCap: 222500000,
    holders: 3201,
    change24h: 7.8,
    logo: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=100&h=100&fit=crop',
    creator: '0xdef2...8ghi',
    verified: true
  },
];

export function TokenizationSection() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlockchain, setSelectedBlockchain] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("marketplace");
  const [showFilters, setShowFilters] = useState(false);
  
  // Create Token Form State
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenSupply, setTokenSupply] = useState("");
  const [tokenBlockchain, setTokenBlockchain] = useState("Ethereum");
  const [tokenDescription, setTokenDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const categories = ['all', ...Array.from(new Set(blockchains.map(b => b.category)))];

  const filteredBlockchains = blockchains.filter(blockchain => {
    const matchesSearch = blockchain.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || blockchain.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredTokens = mockTokens.filter(token => {
    const matchesSearch = 
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlockchain = selectedBlockchain === 'all' || token.blockchain === selectedBlockchain;
    return matchesSearch && matchesBlockchain;
  });

  const handleCreateToken = () => {
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      setShowCreateDialog(false);
      setTokenName("");
      setTokenSymbol("");
      setTokenSupply("");
      setTokenDescription("");
    }, 2500);
  };

  const totalMarketCap = mockTokens.reduce((sum, token) => sum + token.marketCap, 0);
  const totalTokens = mockTokens.length;
  const totalHolders = mockTokens.reduce((sum, token) => sum + token.holders, 0);

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a1a1a] to-black" />
        <motion.div
          animate={{
            opacity: [0.03, 0.08, 0.03],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/3 w-[800px] h-[800px] bg-[#d4af37]/20 rounded-full blur-[180px]"
        />
        <motion.div
          animate={{
            opacity: [0.04, 0.07, 0.04],
            scale: [1.3, 1, 1.3],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/3 w-[700px] h-[700px] bg-[#f0e68c]/15 rounded-full blur-[180px]"
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
                TOKENISATION & MARKETPLACE
              </span>
            </div>
          </motion.div>

          <h2 
            className="text-[3rem] md:text-[4rem] lg:text-[5rem] mb-6 text-[#d4af37] tracking-tight leading-[1.1]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
          >
            Créez Vos Tokens
          </h2>
          
          <p 
            className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
          >
            Tokenisez vos actifs sur 65 blockchains différentes. Marketplace premium pour créer, échanger et gérer vos tokens.
          </p>

          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity px-8 py-6 text-base"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
          >
            <Plus className="mr-2" />
            Créer un Token
          </Button>
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
            <Coins className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {totalTokens}
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Tokens Créés
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              ${(totalMarketCap / 1000000000).toFixed(2)}B
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Market Cap Total
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Shield className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {totalHolders.toLocaleString()}
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Détenteurs
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Globe className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/[0.02] border border-[#d4af37]/20 rounded-2xl p-2 mb-8">
            <TabsTrigger 
              value="marketplace"
              className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger 
              value="blockchains"
              className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <Globe className="w-4 h-4 mr-2" />
              Blockchains (65)
            </TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]/40 w-5 h-5" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un token..."
                  className="pl-12 h-14 rounded-xl border border-[#d4af37]/20 bg-white/[0.02] text-white placeholder:text-white/30 focus:border-[#d4af37]/40"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="h-14 px-6 border-[#d4af37]/20 bg-white/[0.02] text-white hover:bg-white/[0.05]"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtres
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Filters Dropdown */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6"
              >
                <h4 
                  className="text-white mb-4"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  Filtrer par blockchain
                </h4>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedBlockchain('all')}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      selectedBlockchain === 'all'
                        ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40'
                        : 'bg-white/[0.02] text-white/60 border border-[#d4af37]/10 hover:border-[#d4af37]/30'
                    }`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Toutes
                  </button>
                  {Array.from(new Set(mockTokens.map(t => t.blockchain))).map(blockchain => (
                    <button
                      key={blockchain}
                      onClick={() => setSelectedBlockchain(blockchain)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        selectedBlockchain === blockchain
                          ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40'
                          : 'bg-white/[0.02] text-white/60 border border-[#d4af37]/10 hover:border-[#d4af37]/30'
                      }`}
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {blockchain}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tokens Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTokens.map((token, index) => (
                <motion.div
                  key={token.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 hover:border-[#d4af37]/40 transition-all group relative overflow-hidden"
                >
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute -inset-1 bg-[#d4af37] opacity-0 group-hover:opacity-20 blur-xl transition-opacity"
                  />

                  <div className="relative">
                    {/* Token Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={token.logo} 
                          alt={token.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#d4af37]/20"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 
                              className="text-white"
                              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                            >
                              {token.symbol}
                            </h3>
                            {token.verified && (
                              <div className="w-5 h-5 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                                <Check className="w-3 h-3 text-[#d4af37]" />
                              </div>
                            )}
                          </div>
                          <p 
                            className="text-white/60 text-sm"
                            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
                          >
                            {token.name}
                          </p>
                        </div>
                      </div>

                      <Badge 
                        variant="outline" 
                        className="text-xs border-[#d4af37]/30 text-[#d4af37]"
                      >
                        {token.blockchain}
                      </Badge>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent mb-4" />

                    {/* Token Stats */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span 
                          className="text-white/60 text-sm"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Prix
                        </span>
                        <span 
                          className="text-white"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          ${token.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span 
                          className="text-white/60 text-sm"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Market Cap
                        </span>
                        <span 
                          className="text-white"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          ${(token.marketCap / 1000000).toFixed(2)}M
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span 
                          className="text-white/60 text-sm"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Détenteurs
                        </span>
                        <span 
                          className="text-white"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          {token.holders.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span 
                          className="text-white/60 text-sm"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          24h
                        </span>
                        <span 
                          className={`flex items-center gap-1 ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          <TrendingUp className="w-4 h-4" />
                          {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                        </span>
                      </div>
                    </div>

                    {/* Creator */}
                    <div className="pt-4 border-t border-[#d4af37]/10">
                      <p 
                        className="text-white/40 text-xs mb-1"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        Créateur
                      </p>
                      <p 
                        className="text-[#d4af37] text-sm"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                      >
                        {token.creator}
                      </p>
                    </div>

                    {/* Trade Button */}
                    <Button
                      className="w-full mt-4 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                    >
                      <Zap className="mr-2 w-4 h-4" />
                      Trader
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Blockchains Tab */}
          <TabsContent value="blockchains" className="space-y-6">
            {/* Search & Category Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]/40 w-5 h-5" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher une blockchain..."
                  className="pl-12 h-14 rounded-xl border border-[#d4af37]/20 bg-white/[0.02] text-white placeholder:text-white/30 focus:border-[#d4af37]/40"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 flex-wrap">
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredBlockchains.map((blockchain, index) => (
                <motion.button
                  key={blockchain.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.02 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => {
                    setTokenBlockchain(blockchain.name);
                    setShowCreateDialog(true);
                  }}
                  className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 hover:border-[#d4af37]/40 transition-all group"
                >
                  <div className="text-4xl mb-3">{blockchain.icon}</div>
                  <p 
                    className="text-white text-sm mb-1"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                  >
                    {blockchain.name}
                  </p>
                  <Badge 
                    variant="outline" 
                    className="text-xs border-[#d4af37]/30 text-[#d4af37]"
                  >
                    {blockchain.category}
                  </Badge>
                </motion.button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Token Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle 
              className="text-3xl text-[#d4af37]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Créer Votre Token
            </DialogTitle>
            <DialogDescription 
              className="text-white/60"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Tokenisez vos actifs sur la blockchain de votre choix
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Token Name */}
            <div>
              <label 
                className="text-white mb-2 block"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
              >
                Nom du Token
              </label>
              <Input
                type="text"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                placeholder="ex: Luxury Yacht Token"
                className="h-12 bg-white/[0.02] border-[#d4af37]/20 text-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>

            {/* Token Symbol */}
            <div>
              <label 
                className="text-white mb-2 block"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
              >
                Symbole
              </label>
              <Input
                type="text"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                placeholder="ex: LYT"
                maxLength={10}
                className="h-12 bg-white/[0.02] border-[#d4af37]/20 text-white uppercase"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>

            {/* Supply */}
            <div>
              <label 
                className="text-white mb-2 block"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
              >
                Supply Total
              </label>
              <Input
                type="number"
                value={tokenSupply}
                onChange={(e) => setTokenSupply(e.target.value)}
                placeholder="ex: 1000000"
                className="h-12 bg-white/[0.02] border-[#d4af37]/20 text-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>

            {/* Blockchain Selection */}
            <div>
              <label 
                className="text-white mb-2 block"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
              >
                Blockchain
              </label>
              <div className="grid grid-cols-3 gap-3 max-h-[200px] overflow-y-auto pr-2 p-4 rounded-xl border border-[#d4af37]/20 bg-white/[0.02]">
                {blockchains.slice(0, 15).map((blockchain) => (
                  <button
                    key={blockchain.name}
                    onClick={() => setTokenBlockchain(blockchain.name)}
                    className={`p-3 rounded-lg border transition-all ${
                      tokenBlockchain === blockchain.name
                        ? 'border-[#d4af37]/60 bg-[#d4af37]/10'
                        : 'border-[#d4af37]/20 bg-white/[0.02] hover:border-[#d4af37]/40'
                    }`}
                  >
                    <div className="text-2xl mb-1">{blockchain.icon}</div>
                    <p 
                      className="text-white text-xs"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {blockchain.name.length > 12 ? blockchain.name.substring(0, 12) + '...' : blockchain.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label 
                className="text-white mb-2 block"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
              >
                Description (optionnel)
              </label>
              <textarea
                value={tokenDescription}
                onChange={(e) => setTokenDescription(e.target.value)}
                placeholder="Décrivez votre token..."
                rows={4}
                className="w-full p-4 rounded-xl border border-[#d4af37]/20 bg-white/[0.02] text-white placeholder:text-white/30 focus:border-[#d4af37]/40 focus:outline-none resize-none"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>

            {/* Summary */}
            {tokenName && tokenSymbol && tokenSupply && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/5 p-6"
              >
                <h4 
                  className="text-[#d4af37] mb-4"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  Résumé de votre Token
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Nom:
                    </span>
                    <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      {tokenName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Symbole:
                    </span>
                    <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      {tokenSymbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Supply:
                    </span>
                    <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      {parseInt(tokenSupply).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Blockchain:
                    </span>
                    <span className="text-[#d4af37]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      {tokenBlockchain}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Create Button */}
            <Button
              onClick={handleCreateToken}
              disabled={!tokenName || !tokenSymbol || !tokenSupply || isCreating}
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity disabled:opacity-50 h-14"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              {isCreating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"
                  />
                  Création en cours...
                </>
              ) : (
                <>
                  <Coins className="mr-2 w-5 h-5" />
                  Créer le Token
                </>
              )}
            </Button>

            {/* Info */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-[#d4af37]/10">
              <Shield className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
              <p 
                className="text-white/60 text-sm leading-relaxed"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Votre token sera créé sur la blockchain {tokenBlockchain}. Des frais de gas seront appliqués lors du déploiement du smart contract.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default TokenizationSection;