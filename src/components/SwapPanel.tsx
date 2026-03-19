/**
 * Panel de Swap Uniswap V3 - Intégration DEX
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Repeat, Loader2, TrendingUp, Info, ArrowDown } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Contract, parseEther, formatEther } from "ethers";
import { useCryptoPrices } from "../hooks/useCryptoPrices";

interface SwapPanelProps {
  web3: any;
  fmtAddr: (addr: string) => string;
  GCard: any;
  STitle: any;
}

// Uniswap V3 SwapRouter (Mainnet)
const SWAP_ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const SWAP_ROUTER_ABI = [
  "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)",
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function balanceOf(address account) view returns (uint256)",
];

// Common tokens (Mainnet)
const COMMON_TOKENS: Record<string, { address: string; symbol: string; decimals: number }> = {
  ETH: { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18 },
  WETH: { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH', decimals: 18 },
  USDC: { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', decimals: 6 },
  USDT: { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', decimals: 6 },
  DAI: { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI', decimals: 18 },
  WBTC: { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC', decimals: 8 },
};

export default function SwapPanel({ web3, fmtAddr, GCard, STitle }: SwapPanelProps) {
  const [tokenIn, setTokenIn] = useState("WETH");
  const [tokenOut, setTokenOut] = useState("USDC");
  const [amountIn, setAmountIn] = useState("");
  const [amountOutEstimated, setAmountOutEstimated] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [loading, setLoading] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const { prices } = useCryptoPrices();

  // Price estimation based on real live market data
  const estimateOutput = async () => {
    if (!amountIn || parseFloat(amountIn) <= 0) {
      setAmountOutEstimated("");
      return;
    }

    setLoading(true);
    try {
      // Small simulated delay to mimic API call and avoid jitter
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const priceIn = prices?.[tokenIn]?.usd || 1;
      const priceOut = prices?.[tokenOut]?.usd || 1;
      
      // Calculate rate based on USD values
      const rate = priceIn / priceOut;
      
      const estimated = (parseFloat(amountIn) * rate).toFixed(6);
      setAmountOutEstimated(estimated);
    } catch (error) {
      console.error('Erreur estimation:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(estimateOutput, 500);
    return () => clearTimeout(timer);
  }, [amountIn, tokenIn, tokenOut]);

  const handleSwap = async () => {
    if (!amountIn || !amountOutEstimated) {
      toast.error("Veuillez entrer un montant valide");
      return;
    }

    if (web3.chainId !== 1) {
      toast.error("Uniswap V3 n'est disponible que sur Ethereum Mainnet");
      return;
    }

    const confirmation = window.confirm(
      `⚠️ SWAP RÉEL (Uniswap V3)\n\n` +
      `Vous échangez:\n` +
      `${amountIn} ${tokenIn} → ~${amountOutEstimated} ${tokenOut}\n\n` +
      `Slippage: ${slippage}%\n\n` +
      `Cette transaction est RÉELLE.\n\n` +
      `Continuer ?`
    );

    if (!confirmation) {
      toast.info("Swap annulé");
      return;
    }

    setSwapping(true);
    try {
      const tokenInData = COMMON_TOKENS[tokenIn];
      const tokenOutData = COMMON_TOKENS[tokenOut];

      // Step 1: Approve token
      if (tokenIn !== 'ETH') {
        toast.loading("Approbation du token...", { id: 'swap' });
        const tokenContract = new Contract(tokenInData.address, ERC20_ABI, web3.signer);
        const allowance = await tokenContract.allowance(web3.address, SWAP_ROUTER_ADDRESS);
        const amountInWei = parseEther(amountIn);

        if (allowance < amountInWei) {
          const approveTx = await tokenContract.approve(SWAP_ROUTER_ADDRESS, amountInWei);
          await approveTx.wait();
          toast.success("Token approuvé", { id: 'swap' });
        }
      }

      // Step 2: Execute swap
      toast.loading("Swap en cours...", { id: 'swap' });
      
      const router = new Contract(SWAP_ROUTER_ADDRESS, SWAP_ROUTER_ABI, web3.signer);
      
      const amountInWei = parseEther(amountIn);
      const minAmountOut = parseEther(
        (parseFloat(amountOutEstimated) * (1 - parseFloat(slippage) / 100)).toString()
      );

      const params = {
        tokenIn: tokenInData.address,
        tokenOut: tokenOutData.address,
        fee: 3000, // 0.3% pool
        recipient: web3.address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 min
        amountIn: amountInWei,
        amountOutMinimum: minAmountOut,
        sqrtPriceLimitX96: 0,
      };

      const tx = await router.exactInputSingle(params, {
        value: tokenIn === 'ETH' ? amountInWei : 0,
      });

      const receipt = await tx.wait();

      toast.success(
        `✅ Swap confirmé!\n${amountIn} ${tokenIn} → ${tokenOut}\nHash: ${tx.hash.substring(0, 10)}...`,
        { id: 'swap', duration: 10000 }
      );

      console.log('🎉 Swap Success:', receipt);

      // Reset
      setAmountIn("");
      setAmountOutEstimated("");
    } catch (error: any) {
      console.error('❌ Erreur swap:', error);
      toast.error(error.message || "Erreur lors du swap", { id: 'swap' });
    } finally {
      setSwapping(false);
    }
  };

  const switchTokens = () => {
    const temp = tokenIn;
    setTokenIn(tokenOut);
    setTokenOut(temp);
  };

  if (!web3.isConnected) {
    return null;
  }

  return (
    <GCard>
      <STitle icon={Repeat} title="DEX SWAP (Uniswap V3)" />
      
      <div className="space-y-4">
        {/* Info Banner */}
        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-start gap-2">
          <Info className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-purple-200">
            <p className="font-semibold mb-1">Uniswap V3 Integration</p>
            <p className="text-purple-300/70">
              Échangez des tokens directement depuis le God Mode.
              Disponible uniquement sur <strong>Ethereum Mainnet</strong>.
            </p>
          </div>
        </div>

        {web3.chainId !== 1 && (
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-center">
            <p className="text-xs text-yellow-400">
              ⚠️ Passez sur Ethereum Mainnet pour utiliser Uniswap
            </p>
          </div>
        )}

        {/* Token In */}
        <div>
          <label className="text-[10px] text-white/40 mb-2 block tracking-wider">
            VOUS ENVOYEZ
          </label>
          <div className="flex gap-2">
            <select
              value={tokenIn}
              onChange={(e) => setTokenIn(e.target.value)}
              className="px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-sm focus:outline-none focus:border-purple-500/50"
            >
              {Object.keys(COMMON_TOKENS).map(symbol => (
                <option key={symbol} value={symbol}>{symbol}</option>
              ))}
            </select>
            <input
              type="number"
              step="0.000001"
              placeholder="0.0"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-sm focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <p className="text-[9px] text-white/30 mt-1">
            Balance: {parseFloat(web3.ethBalance).toFixed(4)} ETH
          </p>
        </div>

        {/* Switch Button */}
        <div className="flex justify-center">
          <button
            onClick={switchTokens}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10"
          >
            <ArrowDown className="w-4 h-4 text-purple-400" />
          </button>
        </div>

        {/* Token Out */}
        <div>
          <label className="text-[10px] text-white/40 mb-2 block tracking-wider">
            VOUS RECEVEZ (ESTIMÉ)
          </label>
          <div className="flex gap-2">
            <select
              value={tokenOut}
              onChange={(e) => setTokenOut(e.target.value)}
              className="px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-sm focus:outline-none focus:border-purple-500/50"
            >
              {Object.keys(COMMON_TOKENS).map(symbol => (
                <option key={symbol} value={symbol}>{symbol}</option>
              ))}
            </select>
            <div className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-sm flex items-center">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white/30" />
              ) : (
                amountOutEstimated || '0.0'
              )}
            </div>
          </div>
        </div>

        {/* Slippage */}
        <div>
          <label className="text-[10px] text-white/40 mb-2 block tracking-wider">
            SLIPPAGE TOLÉRANCE (%)
          </label>
          <div className="flex gap-2">
            {['0.1', '0.5', '1.0'].map((val) => (
              <button
                key={val}
                onClick={() => setSlippage(val)}
                className={`flex-1 px-3 py-2 rounded-sm text-xs transition-all ${
                  slippage === val
                    ? 'bg-purple-500/20 border border-purple-500 text-purple-400'
                    : 'bg-black/30 border border-white/10 text-white/70 hover:border-white/20'
                }`}
              >
                {val}%
              </button>
            ))}
            <input
              type="number"
              step="0.1"
              placeholder="Custom"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              className="w-20 px-2 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-xs focus:outline-none focus:border-purple-500/50 text-center"
            />
          </div>
        </div>

        {/* Price Impact */}
        {amountOutEstimated && (
          <div className="p-3 rounded-lg bg-black/20 border border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/50">Taux de change:</span>
              <span className="text-white">
                1 {tokenIn} ≈ {(parseFloat(amountOutEstimated) / parseFloat(amountIn || '1')).toFixed(4)} {tokenOut}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-white/50">Min. reçu:</span>
              <span className="text-white">
                {(parseFloat(amountOutEstimated) * (1 - parseFloat(slippage) / 100)).toFixed(6)} {tokenOut}
              </span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={swapping || !amountIn || !amountOutEstimated || web3.chainId !== 1}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-sm hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          {swapping ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Swap en cours...
            </>
          ) : (
            <>
              <Repeat className="w-5 h-5" />
              Swap {tokenIn} → {tokenOut}
            </>
          )}
        </button>

        {/* Warning */}
        <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
          <p className="text-[9px] text-red-300 leading-relaxed">
            <strong>⚠️ Note:</strong> Ceci est une intégration DEX réelle. Les swaps consomment du gas et sont soumis au slippage.
            Vérifiez toujours le montant minimum reçu avant de confirmer.
          </p>
        </div>
      </div>
    </GCard>
  );
}
