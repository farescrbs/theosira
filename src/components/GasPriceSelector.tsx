/**
 * Sélecteur de prix du gas avec estimation temps et coût
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Fuel, Zap, Clock, DollarSign, TrendingUp } from "lucide-react";
import { formatEther } from "ethers";
import { useCryptoPrices } from "../hooks/useCryptoPrices";

interface GasPriceSelectorProps {
  web3: any;
  onGasPriceChange?: (gasPrice: bigint) => void;
  GCard?: any;
  STitle?: any;
}

interface GasOption {
  id: 'slow' | 'standard' | 'fast' | 'instant';
  label: string;
  icon: any;
  multiplier: number;
  estimatedTime: string;
  color: string;
}

const GAS_OPTIONS: GasOption[] = [
  { id: 'slow', label: 'Lent', icon: Clock, multiplier: 0.8, estimatedTime: '~5 min', color: '#6b7280' },
  { id: 'standard', label: 'Standard', icon: Zap, multiplier: 1, estimatedTime: '~2 min', color: '#3b82f6' },
  { id: 'fast', label: 'Rapide', icon: TrendingUp, multiplier: 1.2, estimatedTime: '~30 sec', color: '#f59e0b' },
  { id: 'instant', label: 'Instant', icon: Fuel, multiplier: 1.5, estimatedTime: '~15 sec', color: '#ef4444' },
];

export default function GasPriceSelector({ web3, onGasPriceChange, GCard, STitle }: GasPriceSelectorProps) {
  const [selectedOption, setSelectedOption] = useState<'slow' | 'standard' | 'fast' | 'instant'>('standard');
  const [baseGasPrice, setBaseGasPrice] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(true);
  const { prices } = useCryptoPrices();

  useEffect(() => {
    loadGasPrice();
    const interval = setInterval(loadGasPrice, 15000); // Refresh toutes les 15s
    return () => clearInterval(interval);
  }, [web3.isConnected]);

  const loadGasPrice = async () => {
    if (!web3.isConnected || !web3.provider) {
      setLoading(false);
      return;
    }

    try {
      const feeData = await web3.provider.getFeeData();
      const gasPrice = feeData.gasPrice || 0n;
      setBaseGasPrice(gasPrice);
      
      // Notify parent component
      if (onGasPriceChange) {
        const option = GAS_OPTIONS.find(o => o.id === selectedOption)!;
        const adjustedPrice = BigInt(Math.floor(Number(gasPrice) * option.multiplier));
        onGasPriceChange(adjustedPrice);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement gas price:', error);
      setLoading(false);
    }
  };

  const handleSelectOption = (optionId: 'slow' | 'standard' | 'fast' | 'instant') => {
    setSelectedOption(optionId);
    
    if (baseGasPrice && onGasPriceChange) {
      const option = GAS_OPTIONS.find(o => o.id === optionId)!;
      const adjustedPrice = BigInt(Math.floor(Number(baseGasPrice) * option.multiplier));
      onGasPriceChange(adjustedPrice);
    }
  };

  const calculateCost = (option: GasOption) => {
    if (!baseGasPrice) return '...';
    
    const gasLimit = 21000n; // ETH transfer standard
    const adjustedPrice = BigInt(Math.floor(Number(baseGasPrice) * option.multiplier));
    const totalCost = adjustedPrice * gasLimit;
    const ethCost = formatEther(totalCost);
    const ethPrice = prices?.ETH?.usd || 2500;
    const usdCost = (parseFloat(ethCost) * ethPrice).toFixed(2);
    
    return `$${usdCost}`;
  };

  const getGwei = (option: GasOption) => {
    if (!baseGasPrice) return '...';
    const adjustedPrice = BigInt(Math.floor(Number(baseGasPrice) * option.multiplier));
    return (Number(adjustedPrice) / 1e9).toFixed(1);
  };

  if (!web3.isConnected) {
    return null;
  }

  const CardWrapper = GCard || 'div';
  const TitleWrapper = STitle || (({ icon: Icon, title }: any) => (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-5 h-5 text-[#d4af37]" />
      <h3 className="text-sm font-bold text-white tracking-wider">{title}</h3>
    </div>
  ));

  return (
    <CardWrapper>
      <TitleWrapper icon={Fuel} title="GAS PRICE SELECTOR" />
      
      <div className="space-y-3">
        {/* Current Network Gas */}
        <div className="p-3 rounded-lg bg-black/20 border border-white/5">
          <div className="text-[10px] text-white/40 mb-1 tracking-wider">
            GAS DE BASE ({web3.networkName})
          </div>
          {loading ? (
            <div className="text-xs text-white/50">Chargement...</div>
          ) : baseGasPrice ? (
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">
                {(Number(baseGasPrice) / 1e9).toFixed(1)}
              </span>
              <span className="text-xs text-white/50">Gwei</span>
            </div>
          ) : (
            <div className="text-xs text-red-400">Indisponible</div>
          )}
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-2">
          {GAS_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedOption === option.id;
            
            return (
              <motion.button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-white/10 border-[#d4af37]'
                    : 'bg-black/20 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4" style={{ color: option.color }} />
                    <span className="text-xs font-semibold text-white">
                      {option.label}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
                  )}
                </div>

                <div className="space-y-1 text-left">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-white">
                      {getGwei(option)}
                    </span>
                    <span className="text-[9px] text-white/40">Gwei</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-[9px] text-white/50">
                    <Clock className="w-3 h-3" />
                    {option.estimatedTime}
                  </div>

                  <div className="flex items-center gap-1 text-[9px]" style={{ color: option.color }}>
                    <DollarSign className="w-3 h-3" />
                    {calculateCost(option)}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Info */}
        <div className="p-2 rounded bg-blue-500/5 border border-blue-500/20">
          <p className="text-[9px] text-blue-300/70 leading-relaxed">
            <strong className="text-blue-400">Note:</strong> Le gas price affecte la vitesse de confirmation.
            Prix calculés pour un transfert ETH standard (21000 gas).
          </p>
        </div>
      </div>
    </CardWrapper>
  );
}
