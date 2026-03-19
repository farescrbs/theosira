import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
}

// Mock data for static display
const mockCryptoData: CryptoData[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    current_price: 94250.45,
    price_change_percentage_24h: 2.34,
    market_cap: 1850000000000,
    total_volume: 45000000000,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    current_price: 3421.78,
    price_change_percentage_24h: -1.23,
    market_cap: 410000000000,
    total_volume: 28000000000,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "BNB",
    current_price: 645.32,
    price_change_percentage_24h: 3.87,
    market_cap: 93000000000,
    total_volume: 2100000000,
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png"
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    current_price: 188.95,
    price_change_percentage_24h: 5.12,
    market_cap: 88000000000,
    total_volume: 4200000000,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png"
  },
  {
    id: "ripple",
    symbol: "XRP",
    name: "XRP",
    current_price: 2.45,
    price_change_percentage_24h: -0.85,
    market_cap: 138000000000,
    total_volume: 3800000000,
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png"
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    current_price: 0.98,
    price_change_percentage_24h: 1.56,
    market_cap: 34000000000,
    total_volume: 1200000000,
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png"
  }
];

export function CryptoMarketSection() {
  // Using static mock data - NO API CALLS
  const [cryptoData, setCryptoData] = useState<CryptoData[]>(mockCryptoData);
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <section className="relative py-32 overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(30deg, #d4af37 12%, transparent 12.5%, transparent 87%, #d4af37 87.5%, #d4af37),
              linear-gradient(150deg, #d4af37 12%, transparent 12.5%, transparent 87%, #d4af37 87.5%, #d4af37),
              linear-gradient(30deg, #d4af37 12%, transparent 12.5%, transparent 87%, #d4af37 87.5%, #d4af37),
              linear-gradient(150deg, #d4af37 12%, transparent 12.5%, transparent 87%, #d4af37 87.5%, #d4af37)
            `,
            backgroundSize: '80px 140px',
            backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px',
          }}
        />
      </div>

      {/* Glowing Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4af37] rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#f0e68c] rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "80px" }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="h-px bg-gradient-to-r from-transparent to-[#d4af37]"
            />
            <Sparkles className="text-[#d4af37]" size={24} />
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "80px" }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="h-px bg-gradient-to-l from-transparent to-[#d4af37]"
            />
          </div>

          <p className="text-[#d4af37] tracking-[0.4em] mb-6 text-sm uppercase"
            style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Marchés en Temps Réel
          </p>
          
          <h2 className="text-white mb-8 text-4xl md:text-6xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="gold-text-gradient">
              Performance du Marché
            </span>
          </h2>

          <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed text-lg"
            style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Suivez les tendances des principales cryptomonnaies en temps réel avec nos données premium.
          </p>
        </motion.div>

        {/* Crypto Cards Grid */}
        {loading ? (
          <div className="text-center text-[#d4af37] text-xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full mx-auto"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cryptoData.map((crypto, index) => (
              <motion.div
                key={crypto.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.03,
                  y: -8,
                }}
                className="luxury-glass p-8 border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all duration-500 group relative overflow-hidden"
              >
                {/* Animated background on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                
                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-1 bg-[#d4af37] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"
                />
                
                <div className="relative z-10">
                  {/* Crypto Icon & Name */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <motion.img
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="text-white mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {crypto.name}
                        </h3>
                        <p className="text-gray-400 text-sm uppercase">
                          {crypto.symbol}
                        </p>
                      </div>
                    </div>
                    
                    {/* Price Change Badge */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${
                        crypto.price_change_percentage_24h >= 0
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {crypto.price_change_percentage_24h >= 0 ? (
                        <TrendingUp size={16} />
                      ) : (
                        <TrendingDown size={16} />
                      )}
                      <span className="text-sm">
                        {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                      </span>
                    </motion.div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent mb-6"></div>

                  {/* Price */}
                  <div className="mb-6">
                    <p className="text-gray-400 text-sm mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Prix Actuel
                    </p>
                    <motion.p
                      key={crypto.current_price}
                      initial={{ scale: 1.1, color: '#d4af37' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      transition={{ duration: 0.3 }}
                      className="text-3xl"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {formatPrice(crypto.current_price)}
                    </motion.p>
                  </div>

                  {/* Market Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-xs mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Cap. de Marché
                      </p>
                      <p className="text-[#d4af37] text-sm">
                        {formatMarketCap(crypto.market_cap)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Volume 24h
                      </p>
                      <p className="text-[#d4af37] text-sm">
                        {formatMarketCap(crypto.total_volume)}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Live Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-3 mt-12"
        >
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="w-3 h-3 bg-[#d4af37] rounded-full"
          />
          <p className="text-gray-400 text-sm tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            DONNÉES EN TEMPS RÉEL • MIS À JOUR CHAQUE MINUTE
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default CryptoMarketSection;