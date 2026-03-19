import { motion } from "motion/react";
import { useState } from "react";
import { Search, Globe, TrendingUp, Shield, Zap, CheckCircle2, X, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";

const blockchains = [
  { name: "Ethereum", symbol: "ETH", color: "#627EEA", available: 245000 },
  { name: "Polygon", symbol: "MATIC", color: "#8247E5", available: 180000 },
  { name: "BNB Chain", symbol: "BNB", color: "#F3BA2F", available: 320000 },
  { name: "Avalanche", symbol: "AVAX", color: "#E84142", available: 95000 },
  { name: "Arbitrum", symbol: "ARB", color: "#28A0F0", available: 125000 },
  { name: "Optimism", symbol: "OP", color: "#FF0420", available: 110000 },
  { name: "Solana", symbol: "SOL", color: "#14F195", available: 280000 },
  { name: "Polkadot", symbol: "DOT", color: "#E6007A", available: 75000 },
  { name: "Cardano", symbol: "ADA", color: "#0033AD", available: 165000 },
  { name: "Cosmos", symbol: "ATOM", color: "#2E3148", available: 88000 },
  { name: "Fantom", symbol: "FTM", color: "#1969FF", available: 92000 },
  { name: "Algorand", symbol: "ALGO", color: "#000000", available: 68000 },
  { name: "Near", symbol: "NEAR", color: "#000000", available: 105000 },
  { name: "Tezos", symbol: "XTZ", color: "#2C7DF7", available: 58000 },
  { name: "Hedera", symbol: "HBAR", color: "#000000", available: 45000 },
  { name: "Cronos", symbol: "CRO", color: "#002D74", available: 72000 },
  { name: "Aptos", symbol: "APT", color: "#000000", available: 38000 },
  { name: "Sui", symbol: "SUI", color: "#4DA2FF", available: 42000 },
  { name: "Injective", symbol: "INJ", color: "#00F2FE", available: 35000 },
  { name: "Sei", symbol: "SEI", color: "#000000", available: 28000 },
  { name: "Celestia", symbol: "TIA", color: "#7B2BF9", available: 22000 },
  { name: "Base", symbol: "BASE", color: "#0052FF", available: 95000 },
  { name: "zkSync", symbol: "ZK", color: "#8C8DFC", available: 68000 },
  { name: "Starknet", symbol: "STRK", color: "#EC796B", available: 55000 },
  { name: "Linea", symbol: "LINEA", color: "#000000", available: 48000 },
  { name: "Mantle", symbol: "MNT", color: "#000000", available: 52000 },
  { name: "Scroll", symbol: "SCR", color: "#FFEEDA", available: 38000 },
  { name: "Blast", symbol: "BLAST", color: "#FCFC03", available: 42000 },
  { name: "Manta", symbol: "MANTA", color: "#000000", available: 32000 },
  { name: "Metis", symbol: "METIS", color: "#00DACC", available: 28000 },
  { name: "ImmutableX", symbol: "IMX", color: "#000000", available: 45000 },
  { name: "Moonbeam", symbol: "GLMR", color: "#53CBC9", available: 38000 },
  { name: "Moonriver", symbol: "MOVR", color: "#F2B705", available: 32000 },
  { name: "Celo", symbol: "CELO", color: "#FBCC5C", available: 42000 },
  { name: "Kava", symbol: "KAVA", color: "#FF433E", available: 35000 },
  { name: "Harmony", symbol: "ONE", color: "#00ADE8", available: 48000 },
  { name: "Flow", symbol: "FLOW", color: "#00EF8B", available: 38000 },
  { name: "Zilliqa", symbol: "ZIL", color: "#49C1BF", available: 32000 },
  { name: "Elrond", symbol: "EGLD", color: "#000000", available: 28000 },
  { name: "Terra", symbol: "LUNA", color: "#FFD83D", available: 52000 },
  { name: "Osmosis", symbol: "OSMO", color: "#5E12A0", available: 35000 },
  { name: "Kujira", symbol: "KUJI", color: "#E64942", available: 22000 },
  { name: "Neutron", symbol: "NTRN", color: "#000000", available: 18000 },
  { name: "Berachain", symbol: "BERA", color: "#000000", available: 15000 },
  { name: "Movement", symbol: "MOVE", color: "#000000", available: 12000 },
  { name: "Monad", symbol: "MONAD", color: "#000000", available: 8000 },
  { name: "Eclipse", symbol: "ECLP", color: "#000000", available: 10000 },
  { name: "Fuel", symbol: "FUEL", color: "#00F58C", available: 14000 },
  { name: "Astar", symbol: "ASTR", color: "#0084FF", available: 28000 },
  { name: "Acala", symbol: "ACA", color: "#E40C5B", available: 22000 },
  { name: "Klaytn", symbol: "KLAY", color: "#000000", available: 38000 },
  { name: "IOTA", symbol: "IOTA", color: "#000000", available: 32000 },
  { name: "VeChain", symbol: "VET", color: "#15BDFF", available: 45000 },
  { name: "Theta", symbol: "THETA", color: "#2AB8E6", available: 28000 },
  { name: "ICON", symbol: "ICX", color: "#1FC5C9", available: 25000 },
  { name: "Waves", symbol: "WAVES", color: "#0155FF", available: 32000 },
  { name: "Ontology", symbol: "ONT", color: "#000000", available: 28000 },
  { name: "Qtum", symbol: "QTUM", color: "#2E9AD0", available: 22000 },
  { name: "Neo", symbol: "NEO", color: "#58BF00", available: 35000 },
  { name: "Conflux", symbol: "CFX", color: "#000000", available: 18000 },
  { name: "Nervos", symbol: "CKB", color: "#3CC68A", available: 15000 },
  { name: "Oasis", symbol: "ROSE", color: "#0092F6", available: 22000 },
  { name: "Secret", symbol: "SCRT", color: "#000000", available: 18000 },
  { name: "Axelar", symbol: "AXL", color: "#000000", available: 14000 },
  { name: "Wormhole", symbol: "W", color: "#000000", available: 12000 }
];

const features = [
  {
    icon: Shield,
    title: "Propriété Décentralisée",
    description: "Vos domaines sont enregistrés sur la blockchain, garantissant une propriété immuable et sécurisée"
  },
  {
    icon: Globe,
    title: "Multi-Chain Support",
    description: "Créez et gérez des domaines sur 65+ blockchains différentes avec une seule interface"
  },
  {
    icon: Zap,
    title: "Déploiement Instantané",
    description: "Enregistrez votre domaine en quelques secondes avec confirmation immédiate"
  },
  {
    icon: TrendingUp,
    title: "Marketplace Intégré",
    description: "Achetez, vendez et échangez vos domaines avec des millions d'utilisateurs"
  }
];

interface DomainResult {
  domain: string;
  available: boolean;
  price: number;
  chain: typeof blockchains[0];
}

export function DomainSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<DomainResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState<DomainResult[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdDomains, setCreatedDomains] = useState<string[]>([]);

  const handleSearch = () => {
    if (searchTerm) {
      setIsSearching(true);
      
      // Simulate search delay
      setTimeout(() => {
        const results = blockchains.map(chain => ({
          domain: `${searchTerm}.${chain.symbol.toLowerCase()}`,
          available: Math.random() > 0.3, // 70% available
          price: Math.floor(Math.random() * 100) + 10,
          chain: chain
        }));
        
        setSearchResults(results);
        setShowResults(true);
        setIsSearching(false);
      }, 1000);
    }
  };

  const toggleDomainSelection = (domain: DomainResult) => {
    if (!domain.available) return;
    
    setSelectedDomains(prev => {
      const exists = prev.find(d => d.domain === domain.domain);
      if (exists) {
        return prev.filter(d => d.domain !== domain.domain);
      }
      return [...prev, domain];
    });
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleCreateDomains = () => {
    setIsCreating(true);
    
    setTimeout(() => {
      const newDomains = selectedDomains.map(d => d.domain);
      setCreatedDomains(prev => [...prev, ...newDomains]);
      setIsCreating(false);
      setShowCheckout(false);
      setSelectedDomains([]);
      setShowResults(false);
      setSearchTerm("");
    }, 2000);
  };

  const totalPrice = selectedDomains.reduce((sum, d) => sum + d.price, 0);

  const filteredChains = selectedChain 
    ? blockchains.filter(chain => chain.name === selectedChain)
    : blockchains;

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a1a1a] to-black" />
        <motion.div
          animate={{
            opacity: [0.03, 0.06, 0.03],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#d4af37]/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            opacity: [0.02, 0.05, 0.02],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#d4af37]/15 rounded-full blur-[150px]"
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
                DOMAINES BLOCKCHAIN
              </span>
            </div>
          </motion.div>

          <h2 
            className="text-[3rem] md:text-[4rem] lg:text-[5rem] mb-6 text-[#d4af37] tracking-tight leading-[1.1]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
          >
            Votre Identité sur 65+ Blockchains
          </h2>
          
          <p 
            className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
          >
            Créez, gérez et échangez des noms de domaine décentralisés sur l'ensemble de l'écosystème blockchain
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="mb-20"
        >
          <div className="relative max-w-4xl mx-auto">
            {/* Glassmorphism Container */}
            <div className="relative rounded-3xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-8 shadow-2xl">
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
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]/40 w-5 h-5" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Recherchez votre domaine parfait..."
                      className="pl-12 h-14 bg-black/40 border-[#d4af37]/20 text-white placeholder:text-white/30 rounded-xl focus:border-[#d4af37]/40 transition-all"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    />
                  </div>
                  
                  <Button
                    onClick={handleSearch}
                    disabled={!searchTerm || isSearching}
                    className="h-14 px-8 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 rounded-xl"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
                  >
                    {isSearching ? "Recherche..." : "Rechercher"}
                  </Button>
                </div>

                {searchTerm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-sm text-white/60"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <CheckCircle2 className="inline w-4 h-4 text-[#d4af37] mr-2" />
                    {searchTerm}.blockchain est disponible sur {blockchains.length} réseaux
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="relative rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 h-full transition-all duration-500 hover:border-[#d4af37]/40 hover:bg-white/[0.04]">
                <motion.div
                  animate={{
                    opacity: [0, 0.1, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 via-transparent to-transparent"
                />
                
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  
                  <h3 
                    className="text-xl text-white mb-2"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
                  >
                    {feature.title}
                  </h3>
                  
                  <p 
                    className="text-white/60 text-sm leading-relaxed"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Blockchain Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h3 
              className="text-[2rem] md:text-[2.5rem] text-[#d4af37] mb-4"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
            >
              Marketplace Multi-Chain
            </h3>
            <p 
              className="text-white/60"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
            >
              {blockchains.length} blockchains • {blockchains.reduce((acc, chain) => acc + chain.available, 0).toLocaleString()} domaines disponibles
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredChains.map((chain, index) => (
              <motion.div
                key={chain.symbol}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.02 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group cursor-pointer"
              >
                <div className="relative rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-4 transition-all duration-300 hover:border-[#d4af37]/40 hover:bg-white/[0.04]">
                  <motion.div
                    animate={{
                      opacity: [0, 0.15, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      delay: index * 0.1,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#d4af37]/20 via-transparent to-transparent"
                  />
                  
                  <div className="relative text-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 flex items-center justify-center mx-auto mb-3">
                      <span className="text-[#d4af37] text-xs" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
                        {chain.symbol.slice(0, 2)}
                      </span>
                    </div>
                    
                    <h4 
                      className="text-white text-sm mb-1"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                    >
                      {chain.name}
                    </h4>
                    
                    <p 
                      className="text-[#d4af37]/60 text-xs"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
                    >
                      {chain.available.toLocaleString()} disponibles
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="mb-20"
          >
            <div className="relative max-w-4xl mx-auto">
              {/* Glassmorphism Container */}
              <div className="relative rounded-3xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-8 shadow-2xl">
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
                  <h3 
                    className="text-xl text-[#d4af37] mb-4"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
                  >
                    Résultats de la recherche
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={result.domain}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.02 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="relative group cursor-pointer"
                      >
                        <div className="relative rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-4 transition-all duration-300 hover:border-[#d4af37]/40 hover:bg-white/[0.04]">
                          <motion.div
                            animate={{
                              opacity: [0, 0.15, 0],
                            }}
                            transition={{
                              duration: 5,
                              repeat: Infinity,
                              delay: index * 0.1,
                              ease: "easeInOut"
                            }}
                            className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#d4af37]/20 via-transparent to-transparent"
                          />
                          
                          <div className="relative text-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 flex items-center justify-center mx-auto mb-3">
                              <span className="text-[#d4af37] text-xs" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
                                {result.chain.symbol.slice(0, 2)}
                              </span>
                            </div>
                            
                            <h4 
                              className="text-white text-sm mb-1"
                              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                            >
                              {result.domain}
                            </h4>
                            
                            <p 
                              className="text-[#d4af37]/60 text-xs"
                              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
                            >
                              {result.available ? `Disponible - ${result.price} USD` : "Indisponible"}
                            </p>
                            
                            {result.available && (
                              <Button
                                onClick={() => toggleDomainSelection(result)}
                                className="mt-2 h-8 px-4 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 rounded-xl text-xs"
                                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
                              >
                                {selectedDomains.find(d => d.domain === result.domain) ? "Désélectionner" : "Sélectionner"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {selectedDomains.length > 0 && (
                    <div className="mt-6">
                      <Button
                        onClick={handleCheckout}
                        className="h-10 px-6 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 rounded-xl"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
                      >
                        Passer à la caisse ({selectedDomains.length} domaines)
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Checkout Dialog */}
        {showCheckout && (
          <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
            <DialogContent className="relative max-w-4xl mx-auto">
              <DialogHeader>
                <DialogTitle className="text-[#d4af37] text-xl mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
                  Récapitulatif de la commande
                </DialogTitle>
                <DialogDescription className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}>
                  Veuillez vérifier les domaines sélectionnés avant de finaliser votre achat.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedDomains.map((domain, index) => (
                  <motion.div
                    key={domain.domain}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.02 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative group cursor-pointer"
                  >
                    <div className="relative rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-4 transition-all duration-300 hover:border-[#d4af37]/40 hover:bg-white/[0.04]">
                      <motion.div
                        animate={{
                          opacity: [0, 0.15, 0],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          delay: index * 0.1,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#d4af37]/20 via-transparent to-transparent"
                      />
                      
                      <div className="relative text-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 flex items-center justify-center mx-auto mb-3">
                          <span className="text-[#d4af37] text-xs" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
                            {domain.chain.symbol.slice(0, 2)}
                          </span>
                        </div>
                        
                        <h4 
                          className="text-white text-sm mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          {domain.domain}
                        </h4>
                        
                        <p 
                          className="text-[#d4af37]/60 text-xs"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
                        >
                          {domain.available ? `Disponible - ${domain.price} USD` : "Indisponible"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6">
                <p 
                  className="text-white/60 text-sm leading-relaxed"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
                >
                  Total: {totalPrice} USD
                </p>
                
                <Button
                  onClick={handleCreateDomains}
                  disabled={isCreating}
                  className="mt-2 h-10 px-6 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 rounded-xl"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
                >
                  {isCreating ? "Création..." : "Créer les domaines"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Created Domains */}
        {createdDomains.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="mb-20"
          >
            <div className="relative max-w-4xl mx-auto">
              {/* Glassmorphism Container */}
              <div className="relative rounded-3xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-8 shadow-2xl">
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
                  <h3 
                    className="text-xl text-[#d4af37] mb-4"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
                  >
                    Domaines créés
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {createdDomains.map((domain, index) => (
                      <motion.div
                        key={domain}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.02 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="relative group cursor-pointer"
                      >
                        <div className="relative rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-4 transition-all duration-300 hover:border-[#d4af37]/40 hover:bg-white/[0.04]">
                          <motion.div
                            animate={{
                              opacity: [0, 0.15, 0],
                            }}
                            transition={{
                              duration: 5,
                              repeat: Infinity,
                              delay: index * 0.1,
                              ease: "easeInOut"
                            }}
                            className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#d4af37]/20 via-transparent to-transparent"
                          />
                          
                          <div className="relative text-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 flex items-center justify-center mx-auto mb-3">
                              <span className="text-[#d4af37] text-xs" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
                                {domain.split('.')[1].toUpperCase().slice(0, 2)}
                              </span>
                            </div>
                            
                            <h4 
                              className="text-white text-sm mb-1"
                              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                            >
                              {domain}
                            </h4>
                            
                            <p 
                              className="text-[#d4af37]/60 text-xs"
                              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
                            >
                              Créé avec succès
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="text-center mt-20"
        >
          <Button
            className="h-14 px-12 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] transition-all duration-500 rounded-xl text-lg"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
          >
            Explorer le Marketplace
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default DomainSection;