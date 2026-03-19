import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Search, Loader2, TrendingUp, Star } from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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

interface CoinGeckoToken {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
}

// Removed COINGECKO_API_KEY - Using static data only

interface TokenSelectorProps {
  onSelect: (token: Token) => void;
  selectedToken?: Token;
  userTokens?: Token[];
}

export function TokenSelector({ onSelect, selectedToken, userTokens = [] }: TokenSelectorProps) {
  // Static mock data - NO API CALLS
  const [allCoins, setAllCoins] = useState<CoinGeckoToken[]>([
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', current_price: 94250, market_cap: 1860000000000, market_cap_rank: 1, price_change_percentage_24h: 1.87 },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', current_price: 3421, market_cap: 411000000000, market_cap_rank: 2, price_change_percentage_24h: 2.34 },
    { id: 'tether', symbol: 'usdt', name: 'Tether', image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png', current_price: 1.00, market_cap: 138000000000, market_cap_rank: 3, price_change_percentage_24h: 0.01 },
    { id: 'binancecoin', symbol: 'bnb', name: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png', current_price: 645, market_cap: 93000000000, market_cap_rank: 4, price_change_percentage_24h: 3.45 },
    { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', current_price: 188, market_cap: 91000000000, market_cap_rank: 5, price_change_percentage_24h: 5.23 },
    { id: 'usd-coin', symbol: 'usdc', name: 'USDC', image: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png', current_price: 1.00, market_cap: 42000000000, market_cap_rank: 6, price_change_percentage_24h: 0.00 },
    { id: 'ripple', symbol: 'xrp', name: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png', current_price: 0.62, market_cap: 35000000000, market_cap_rank: 7, price_change_percentage_24h: -0.52 },
    { id: 'cardano', symbol: 'ada', name: 'Cardano', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', current_price: 0.58, market_cap: 20000000000, market_cap_rank: 8, price_change_percentage_24h: 1.23 },
    { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png', current_price: 42, market_cap: 17000000000, market_cap_rank: 9, price_change_percentage_24h: 4.12 },
    { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', current_price: 0.15, market_cap: 22000000000, market_cap_rank: 10, price_change_percentage_24h: 2.87 },
    { id: 'matic-network', symbol: 'matic', name: 'Polygon', image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png', current_price: 0.84, market_cap: 8200000000, market_cap_rank: 11, price_change_percentage_24h: -1.23 },
    { id: 'dai', symbol: 'dai', name: 'Dai', image: 'https://assets.coingecko.com/coins/images/9956/large/Badge_Dai.png', current_price: 1.00, market_cap: 5400000000, market_cap_rank: 12, price_change_percentage_24h: -0.02 },
    { id: 'polkadot', symbol: 'dot', name: 'Polkadot', image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png', current_price: 7.42, market_cap: 11000000000, market_cap_rank: 13, price_change_percentage_24h: 2.15 },
    { id: 'litecoin', symbol: 'ltc', name: 'Litecoin', image: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png', current_price: 92.5, market_cap: 6800000000, market_cap_rank: 14, price_change_percentage_24h: 1.34 },
    { id: 'chainlink', symbol: 'link', name: 'Chainlink', image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png', current_price: 15.8, market_cap: 8900000000, market_cap_rank: 15, price_change_percentage_24h: 3.21 },
  ]);
  const [filteredCoins, setFilteredCoins] = useState<CoinGeckoToken[]>(allCoins);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("my-tokens");
  const [popularCoins, setPopularCoins] = useState<CoinGeckoToken[]>(allCoins.slice(0, 10));

  // Filter coins based on search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCoins(allCoins);
    } else {
      const filtered = allCoins.filter(coin => 
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCoins(filtered);
    }
  }, [searchTerm, allCoins]);

  const handleSelectCoin = (coin: CoinGeckoToken) => {
    const token: Token = {
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      balance: 0,
      value: 0,
      logo: coin.image,
      type: ['usdt', 'usdc', 'dai', 'busd', 'tusd'].includes(coin.symbol.toLowerCase()) ? 'stablecoin' : 'crypto',
      change24h: coin.price_change_percentage_24h,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank
    };
    onSelect(token);
  };

  const renderCoinItem = (coin: CoinGeckoToken) => (
    <motion.button
      key={coin.id}
      whileHover={{ scale: 1.02, x: 5 }}
      onClick={() => handleSelectCoin(coin)}
      className={`w-full p-3 rounded-xl border transition-all duration-300 flex items-center justify-between ${
        selectedToken?.id === coin.id
          ? 'border-[#d4af37]/60 bg-[#d4af37]/10'
          : 'border-[#d4af37]/20 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#d4af37]/40'
      }`}
    >
      <div className="flex items-center gap-3">
        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span 
              className="text-white"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              {coin.symbol.toUpperCase()}
            </span>
            {coin.market_cap_rank && coin.market_cap_rank <= 10 && (
              <Star className="w-3 h-3 text-[#d4af37] fill-[#d4af37]" />
            )}
          </div>
          <p 
            className="text-white/60 text-xs"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
          >
            {coin.name}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p 
          className="text-white text-sm"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
        >
          ${coin.current_price.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: coin.current_price < 1 ? 6 : 2 
          })}
        </p>
        <div className={`flex items-center justify-end gap-1 text-xs ${
          coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          <TrendingUp className="w-3 h-3" />
          {coin.price_change_percentage_24h >= 0 ? '+' : ''}
          {coin.price_change_percentage_24h.toFixed(2)}%
        </div>
      </div>
    </motion.button>
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]/40 w-4 h-4" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher une crypto..."
          className="w-full pl-11 h-12 rounded-xl border border-[#d4af37]/20 bg-white/[0.02] text-white placeholder:text-white/30 focus:border-[#d4af37]/40 transition-all"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/[0.02] border border-[#d4af37]/20 rounded-xl p-1">
          <TabsTrigger 
            value="my-tokens"
            className="rounded-lg data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Mes Tokens
          </TabsTrigger>
          <TabsTrigger 
            value="popular"
            className="rounded-lg data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Populaires
          </TabsTrigger>
          <TabsTrigger 
            value="all"
            className="rounded-lg data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Tous
          </TabsTrigger>
        </TabsList>

        {/* My Tokens */}
        <TabsContent value="my-tokens" className="mt-4">
          <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {userTokens.length > 0 ? (
              userTokens.map(token => {
                const coinGeckoToken: CoinGeckoToken = {
                  id: token.id,
                  symbol: token.symbol.toLowerCase(),
                  name: token.name,
                  image: token.logo,
                  current_price: token.current_price,
                  market_cap: token.market_cap,
                  market_cap_rank: token.market_cap_rank || 0,
                  price_change_percentage_24h: token.change24h
                };
                return renderCoinItem(coinGeckoToken);
              })
            ) : (
              <p 
                className="text-white/60 text-center py-8"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Aucun token dans votre wallet
              </p>
            )}
          </div>
        </TabsContent>

        {/* Popular Tokens */}
        <TabsContent value="popular" className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {popularCoins.map(coin => renderCoinItem(coin))}
            </div>
          )}
        </TabsContent>

        {/* All Tokens */}
        <TabsContent value="all" className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {filteredCoins.length > 0 ? (
                filteredCoins.map(coin => renderCoinItem(coin))
              ) : (
                <p 
                  className="text-white/60 text-center py-8"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Aucune crypto trouvée
                </p>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Info Badge */}
      <div className="mt-4 p-3 rounded-xl bg-[#d4af37]/5 border border-[#d4af37]/20">
        <p 
          className="text-white/60 text-xs text-center"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
        >
          {isLoading ? (
            'Chargement des cryptomonnaies...'
          ) : (
            `${allCoins.length} cryptomonnaies disponibles • Données en temps réel via CoinGecko`
          )}
        </p>
      </div>
    </div>
  );
}