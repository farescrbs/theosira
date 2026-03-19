import { motion } from "motion/react";
import { useState } from "react";
import { Wallet, ArrowDownUp, TrendingUp, Shield, Zap, Copy, ExternalLink, ChevronDown, Search, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TokenSelector } from "./TokenSelector";

interface Token {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  value: number;
  logo: string;
  type: 'crypto' | 'stablecoin';
  change24h: number;
  current_price: number;
  market_cap: number;
  market_cap_rank?: number;
}

const initialTokens: Token[] = [
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', balance: 2.5, value: 8554.45, logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', type: 'crypto', change24h: 2.34, current_price: 3421.78, market_cap: 411000000000 },
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', balance: 0.125, value: 11781.31, logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', type: 'crypto', change24h: 1.87, current_price: 94250.48, market_cap: 1860000000000 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', balance: 45.8, value: 8654.10, logo: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', type: 'crypto', change24h: 5.23, current_price: 188.93, market_cap: 91000000000 },
  { id: 'tether', symbol: 'USDT', name: 'Tether', balance: 15000, value: 15000, logo: 'https://assets.coingecko.com/coins/images/325/large/Tether.png', type: 'stablecoin', change24h: 0.01, current_price: 1.00, market_cap: 138000000000 },
  { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin', balance: 8500, value: 8500, logo: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png', type: 'stablecoin', change24h: 0.00, current_price: 1.00, market_cap: 42000000000 },
  { id: 'dai', symbol: 'DAI', name: 'Dai', balance: 5200, value: 5200, logo: 'https://assets.coingecko.com/coins/images/9956/large/Badge_Dai.png', type: 'stablecoin', change24h: -0.02, current_price: 1.00, market_cap: 5400000000 },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', balance: 12.3, value: 7937.46, logo: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png', type: 'crypto', change24h: 3.45, current_price: 645.52, market_cap: 93000000000 },
  { id: 'matic-network', symbol: 'MATIC', name: 'Polygon', balance: 3200, value: 2688.00, logo: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png', type: 'crypto', change24h: -1.23, current_price: 0.84, market_cap: 8200000000 },
];

const walletProviders = [
  { name: 'MetaMask', icon: '🦊', color: '#F6851B', category: 'Browser' },
  { name: 'WalletConnect', icon: '🔗', color: '#3B99FC', category: 'Multi-Chain' },
  { name: 'Coinbase Wallet', icon: '💼', color: '#0052FF', category: 'Exchange' },
  { name: 'Trust Wallet', icon: '🛡️', color: '#3375BB', category: 'Mobile' },
  { name: 'Ledger', icon: '🔐', color: '#000000', category: 'Hardware' },
  { name: 'Trezor', icon: '🔒', color: '#01B757', category: 'Hardware' },
  { name: 'Phantom', icon: '👻', color: '#AB9FF2', category: 'Solana' },
  { name: 'Rainbow', icon: '🌈', color: '#FF6B6B', category: 'Browser' },
  { name: 'Rabby', icon: '🐰', color: '#8697FF', category: 'Browser' },
  { name: 'Argent', icon: '💎', color: '#FF875B', category: 'Smart' },
  { name: 'Safe (Gnosis)', icon: '🏦', color: '#12FF80', category: 'Multi-Sig' },
  { name: 'Zerion', icon: '⚡', color: '#2962EF', category: 'Portfolio' },
  { name: 'Exodus', icon: '🚀', color: '#0B46F9', category: 'Desktop' },
  { name: 'Brave Wallet', icon: '🦁', color: '#FB542B', category: 'Browser' },
  { name: 'OKX Wallet', icon: '⭕', color: '#000000', category: 'Exchange' },
];

export default function WalletSection() {
  const [isConnected, setIsConnected] = useState(false);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [showSwapDialog, setShowSwapDialog] = useState(false);
  const [selectedFromToken, setSelectedFromToken] = useState<Token>(initialTokens[0]);
  const [selectedToToken, setSelectedToToken] = useState<Token>(initialTokens[3]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [walletAddress] = useState("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
  const [showFromTokens, setShowFromTokens] = useState(false);
  const [showToTokens, setShowToTokens] = useState(false);
  const [walletSearchTerm, setWalletSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ['all', ...Array.from(new Set(walletProviders.map(w => w.category)))];
  
  const filteredWallets = walletProviders.filter(wallet => {
    const matchesSearch = wallet.name.toLowerCase().includes(walletSearchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || wallet.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalBalance = initialTokens.reduce((sum, token) => sum + token.value, 0);
  const cryptoBalance = initialTokens.filter(t => t.type === 'crypto').reduce((sum, token) => sum + token.value, 0);
  const stablecoinBalance = initialTokens.filter(t => t.type === 'stablecoin').reduce((sum, token) => sum + token.value, 0);

  const handleConnect = (provider: string) => {
    setIsConnected(true);
    setShowConnectDialog(false);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (value && !isNaN(parseFloat(value))) {
      const rate = selectedToToken.current_price / selectedFromToken.current_price;
      setToAmount((parseFloat(value) * rate).toFixed(6));
    } else {
      setToAmount("");
    }
  };

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      setShowSwapDialog(false);
      setFromAmount("");
      setToAmount("");
    }, 2000);
  };

  const swapTokens = () => {
    const temp = selectedFromToken;
    setSelectedFromToken(selectedToToken);
    setSelectedToToken(temp);
    setFromAmount("");
    setToAmount("");
  };

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a1a1a] to-black" />
        <motion.div
          animate={{
            opacity: [0.03, 0.06, 0.03],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-[#d4af37]/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            opacity: [0.02, 0.05, 0.02],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/3 left-1/4 w-[600px] h-[600px] bg-[#d4af37]/15 rounded-full blur-[150px]"
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
                WALLET & ÉCHANGE
              </span>
            </div>
          </motion.div>

          <h2 
            className="text-[3rem] md:text-[4rem] lg:text-[5rem] mb-6 text-[#d4af37] tracking-tight leading-[1.1]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
          >
            Votre Wallet Premium
          </h2>
          
          <p 
            className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
          >
            Gérez vos cryptomonnaies et stablecoins avec élégance. Échangez instantanément avec les meilleurs taux.
          </p>
        </motion.div>

        {/* Connect Wallet or Dashboard */}
        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative rounded-3xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-12 text-center">
              <motion.div
                animate={{
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#d4af37]/5"
              />
              
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 flex items-center justify-center mx-auto mb-6">
                  <Wallet className="w-10 h-10 text-[#d4af37]" />
                </div>

                <h3 
                  className="text-2xl md:text-3xl text-white mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                >
                  Connectez Votre Wallet
                </h3>

                <p 
                  className="text-white/60 mb-8"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
                >
                  Accédez à votre portefeuille et commencez à échanger
                </p>

                <Button
                  onClick={() => setShowConnectDialog(true)}
                  className="bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity px-8 py-6 text-base"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  <Wallet className="mr-2" />
                  Connecter Wallet
                </Button>

                <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      100% Sécurisé
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Instantané
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Portfolio Summary */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="rounded-3xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-8"
              >
                <h3 
                  className="text-white/60 text-sm mb-2"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
                >
                  Balance Totale
                </h3>
                <p 
                  className="text-4xl text-[#d4af37] mb-6"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
                >
                  ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Cryptos
                    </span>
                    <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      ${cryptoBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Stablecoins
                    </span>
                    <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      ${stablecoinBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#d4af37]/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Adresse:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                      </span>
                      <button className="text-[#d4af37] hover:text-[#f0e68c] transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setShowSwapDialog(true)}
                  className="w-full mt-6 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  <ArrowDownUp className="mr-2 w-4 h-4" />
                  Échanger
                </Button>
              </motion.div>
            </div>

            {/* Token List */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="rounded-3xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-8"
              >
                <h3 
                  className="text-xl text-white mb-6"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                >
                  Mes Tokens
                </h3>

                <div className="space-y-3">
                  {initialTokens.map((token, index) => (
                    <motion.div
                      key={token.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-4 rounded-xl border border-[#d4af37]/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-[#d4af37]/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <img src={token.logo} alt={token.symbol} className="w-10 h-10 rounded-full" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span 
                              className="text-white"
                              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                            >
                              {token.symbol}
                            </span>
                            <Badge variant="outline" className="text-xs border-[#d4af37]/30 text-[#d4af37]">
                              {token.type}
                            </Badge>
                          </div>
                          <span 
                            className="text-white/60 text-sm"
                            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
                          >
                            {token.name}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p 
                          className="text-white"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          {token.balance.toLocaleString()} {token.symbol}
                        </p>
                        <div className="flex items-center gap-2 justify-end">
                          <span 
                            className="text-white/60 text-sm"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            ${token.value.toLocaleString()}
                          </span>
                          <span className={`text-xs flex items-center gap-1 ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            <TrendingUp className="w-3 h-3" />
                            {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Connect Wallet Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle 
              className="text-2xl text-[#d4af37]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Choisissez Votre Wallet
            </DialogTitle>
            <DialogDescription 
              className="text-white/60"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Connectez-vous avec l'un de nos {walletProviders.length} wallets supportés
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Search & Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/40 w-4 h-4" />
                <Input
                  type="text"
                  value={walletSearchTerm}
                  onChange={(e) => setWalletSearchTerm(e.target.value)}
                  placeholder="Rechercher un wallet..."
                  className="pl-10 bg-white/[0.02] border-[#d4af37]/20 text-white"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              {/* Categories */}
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40'
                        : 'bg-white/[0.02] text-white/60 border border-[#d4af37]/10 hover:border-[#d4af37]/30'
                    }`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {cat === 'all' ? 'Tous' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Wallet List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
              {filteredWallets.map((wallet) => (
                <motion.button
                  key={wallet.name}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleConnect(wallet.name)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-[#d4af37]/20 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#d4af37]/40 transition-all text-left"
                >
                  <div className="text-3xl">{wallet.icon}</div>
                  <div className="flex-1">
                    <p 
                      className="text-white"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                    >
                      {wallet.name}
                    </p>
                    <p 
                      className="text-white/60 text-xs"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {wallet.category}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Swap Dialog */}
      <Dialog open={showSwapDialog} onOpenChange={setShowSwapDialog}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle 
              className="text-2xl text-[#d4af37]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Échanger des Tokens
            </DialogTitle>
            <DialogDescription 
              className="text-white/60"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Échangez instantanément vos cryptomonnaies
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* From Token */}
            <div className="relative rounded-xl border border-[#d4af37]/20 bg-white/[0.02] p-4">
              <label 
                className="text-white/60 text-sm mb-2 block"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
              >
                De
              </label>
              {showFromTokens ? (
                <TokenSelector
                  onSelect={(token) => {
                    setSelectedFromToken(token);
                    setShowFromTokens(false);
                    setFromAmount("");
                    setToAmount("");
                  }}
                  selectedToken={selectedFromToken}
                  userTokens={initialTokens}
                />
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowFromTokens(true)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#d4af37]/10 hover:bg-[#d4af37]/20 transition-colors"
                    >
                      <img src={selectedFromToken.logo} alt={selectedFromToken.symbol} className="w-6 h-6 rounded-full" />
                      <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                        {selectedFromToken.symbol}
                      </span>
                      <ChevronDown className="w-4 h-4 text-white/60" />
                    </button>
                    <Input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => handleFromAmountChange(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 bg-transparent border-none text-white text-xl focus:ring-0"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    />
                  </div>
                  <p className="text-white/40 text-xs mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Balance: {selectedFromToken.balance.toLocaleString()} {selectedFromToken.symbol}
                  </p>
                </>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                onClick={swapTokens}
                className="w-10 h-10 rounded-full bg-[#d4af37]/20 hover:bg-[#d4af37]/30 flex items-center justify-center transition-colors"
              >
                <ArrowDownUp className="w-5 h-5 text-[#d4af37]" />
              </motion.button>
            </div>

            {/* To Token */}
            <div className="relative rounded-xl border border-[#d4af37]/20 bg-white/[0.02] p-4">
              <label 
                className="text-white/60 text-sm mb-2 block"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
              >
                Vers
              </label>
              {showToTokens ? (
                <TokenSelector
                  onSelect={(token) => {
                    setSelectedToToken(token);
                    setShowToTokens(false);
                    setFromAmount("");
                    setToAmount("");
                  }}
                  selectedToken={selectedToToken}
                  userTokens={initialTokens}
                />
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowToTokens(true)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#d4af37]/10 hover:bg-[#d4af37]/20 transition-colors"
                    >
                      <img src={selectedToToken.logo} alt={selectedToToken.symbol} className="w-6 h-6 rounded-full" />
                      <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                        {selectedToToken.symbol}
                      </span>
                      <ChevronDown className="w-4 h-4 text-white/60" />
                    </button>
                    <Input
                      type="number"
                      value={toAmount}
                      readOnly
                      placeholder="0.00"
                      className="flex-1 bg-transparent border-none text-white text-xl focus:ring-0"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    />
                  </div>
                  <p className="text-white/40 text-xs mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Balance: {selectedToToken.balance.toLocaleString()} {selectedToToken.symbol}
                  </p>
                </>
              )}
            </div>

            {/* Exchange Rate */}
            {fromAmount && toAmount && (
              <div className="p-4 rounded-xl bg-[#d4af37]/5 border border-[#d4af37]/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Taux d'échange
                  </span>
                  <span className="text-[#d4af37]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                    1 {selectedFromToken.symbol} ≈ {(selectedToToken.current_price / selectedFromToken.current_price).toFixed(6)} {selectedToToken.symbol}
                  </span>
                </div>
              </div>
            )}

            {/* Swap Action */}
            <Button
              onClick={handleSwap}
              disabled={!fromAmount || !toAmount || isSwapping}
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              {isSwapping ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Échange en cours...
                </>
              ) : (
                <>
                  <ArrowDownUp className="mr-2 w-4 h-4" />
                  Échanger
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}