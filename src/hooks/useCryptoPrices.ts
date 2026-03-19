import { useState, useEffect } from 'react';

// Cache to avoid hitting rate limits
const CACHE_KEY = 'thesoria_crypto_prices_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface CryptoPrices {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

export function useCryptoPrices() {
  const [prices, setPrices] = useState<CryptoPrices | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      
      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setPrices(data);
          setLoading(false);
          return;
        }
      }

      // Fetch from CoinGecko API (Open Source, Free Tier, No Key Required for low volume)
      const ids = 'ethereum,tether,usd-coin,dai,wrapped-bitcoin,matic-network';
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Normalize keys to symbols for easier usage
      const normalizedData: CryptoPrices = {
        ETH: data['ethereum'] || { usd: 2500, usd_24h_change: 0 },
        WETH: data['ethereum'] || { usd: 2500, usd_24h_change: 0 },
        USDT: data['tether'] || { usd: 1, usd_24h_change: 0 },
        USDC: data['usd-coin'] || { usd: 1, usd_24h_change: 0 },
        DAI: data['dai'] || { usd: 1, usd_24h_change: 0 },
        WBTC: data['wrapped-bitcoin'] || { usd: 50000, usd_24h_change: 0 },
        MATIC: data['matic-network'] || { usd: 0.5, usd_24h_change: 0 },
      };

      setPrices(normalizedData);
      setError(null);
      
      // Update cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: normalizedData
      }));
    } catch (err: any) {
      console.error('❌ Erreur lors de la récupération des prix crypto:', err);
      // Fallback to cached data or defaults
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        setPrices(JSON.parse(cachedData).data);
      } else {
        setPrices({
          ETH: { usd: 2500, usd_24h_change: 0 },
          WETH: { usd: 2500, usd_24h_change: 0 },
          USDT: { usd: 1, usd_24h_change: 0 },
          USDC: { usd: 1, usd_24h_change: 0 },
          DAI: { usd: 1, usd_24h_change: 0 },
          WBTC: { usd: 50000, usd_24h_change: 0 },
          MATIC: { usd: 0.5, usd_24h_change: 0 },
        });
      }
      setError(err.message || 'Erreur API Prices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    // Refresh prices every 5 minutes
    const interval = setInterval(fetchPrices, CACHE_DURATION);
    return () => clearInterval(interval);
  }, []);

  return { prices, loading, error, refreshPrices: fetchPrices };
}
