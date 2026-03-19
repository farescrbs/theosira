// ═══════════════════════════════════════════════════════════════════════════
// 🔄 SERVICE DEX (DECENTRALIZED EXCHANGE) - THESORIA
// Swap de tokens via Uniswap V2/V3, PancakeSwap, etc.
// ═══════════════════════════════════════════════════════════════════════════

import { ethers } from 'ethers';
import { web3Service } from './web3Service';

// ═══════════════════════════════════════════════════════════════════════════
// ABI UNISWAP V2 ROUTER
// ═══════════════════════════════════════════════════════════════════════════

const UNISWAP_V2_ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
];

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function allowance(address owner, address spender) public view returns (uint256)',
  'function balanceOf(address account) public view returns (uint256)',
  'function decimals() public view returns (uint8)',
  'function symbol() public view returns (string)',
  'function name() public view returns (string)',
];

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATIONS DEX PAR RÉSEAU
// ═══════════════════════════════════════════════════════════════════════════

interface DEXConfig {
  name: string;
  routerAddress: string;
  factoryAddress: string;
  wethAddress: string;
  logo: string;
}

export const DEX_CONFIGS: Record<number, DEXConfig> = {
  1: { // Ethereum
    name: 'Uniswap V2',
    routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    factoryAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    wethAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    logo: '🦄',
  },
  56: { // BSC
    name: 'PancakeSwap',
    routerAddress: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    factoryAddress: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    wethAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    logo: '🥞',
  },
  137: { // Polygon
    name: 'QuickSwap',
    routerAddress: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    factoryAddress: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
    wethAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    logo: '⚡',
  },
  42161: { // Arbitrum
    name: 'Uniswap V3',
    routerAddress: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    wethAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    logo: '🔷',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SwapQuote {
  amountIn: string;
  amountOut: string;
  amountOutMin: string;
  path: string[];
  priceImpact: number;
  fee: string;
  gasEstimate: string;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
}

export interface SwapResult {
  hash: string;
  amountIn: string;
  amountOut: string;
  status: 'pending' | 'success' | 'failed';
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVICE DEX
// ═══════════════════════════════════════════════════════════════════════════

class DEXService {
  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENIR UN QUOTE POUR UN SWAP
  // ═══════════════════════════════════════════════════════════════════════════

  async getSwapQuote(
    tokenInAddress: string,
    tokenOutAddress: string,
    amountIn: string,
    slippageTolerance: number = 0.5 // 0.5%
  ): Promise<SwapQuote> {
    const provider = web3Service.getProvider();
    const chainId = web3Service.getCurrentChainId();
    
    if (!provider || !chainId) {
      throw new Error('Wallet non connecté');
    }

    const dexConfig = DEX_CONFIGS[chainId];
    if (!dexConfig) {
      throw new Error('DEX non supporté sur ce réseau');
    }

    // Router contract
    const router = new ethers.Contract(
      dexConfig.routerAddress,
      UNISWAP_V2_ROUTER_ABI,
      provider
    );

    // Construire le path
    const isTokenInNative = tokenInAddress === 'native';
    const isTokenOutNative = tokenOutAddress === 'native';
    
    let path: string[];
    if (isTokenInNative) {
      path = [dexConfig.wethAddress, tokenOutAddress];
    } else if (isTokenOutNative) {
      path = [tokenInAddress, dexConfig.wethAddress];
    } else {
      // Pour token à token, passer par WETH
      path = [tokenInAddress, dexConfig.wethAddress, tokenOutAddress];
    }

    // Obtenir les decimals du token in
    let decimalsIn = 18;
    if (!isTokenInNative) {
      const tokenInContract = new ethers.Contract(tokenInAddress, ERC20_ABI, provider);
      decimalsIn = await tokenInContract.decimals();
    }

    // Convertir le montant en wei
    const amountInWei = ethers.parseUnits(amountIn, decimalsIn);

    // Obtenir le quote
    const amounts = await router.getAmountsOut(amountInWei, path);
    const amountOutWei = amounts[amounts.length - 1];

    // Obtenir les decimals du token out
    let decimalsOut = 18;
    if (!isTokenOutNative) {
      const tokenOutContract = new ethers.Contract(tokenOutAddress, ERC20_ABI, provider);
      decimalsOut = await tokenOutContract.decimals();
    }

    const amountOut = ethers.formatUnits(amountOutWei, decimalsOut);

    // Calculer le minimum avec slippage
    const slippageMultiplier = 1 - (slippageTolerance / 100);
    const amountOutMinWei = (amountOutWei * BigInt(Math.floor(slippageMultiplier * 10000))) / BigInt(10000);
    const amountOutMin = ethers.formatUnits(amountOutMinWei, decimalsOut);

    // Calculer le price impact (simplifié)
    const priceImpact = Math.random() * 0.5; // En production, calculer réellement

    // Estimer les frais de gas
    const gasEstimate = '0.002'; // Simulé

    return {
      amountIn,
      amountOut,
      amountOutMin,
      path,
      priceImpact,
      fee: '0.3', // 0.3% pour Uniswap V2
      gasEstimate,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // VÉRIFIER ET APPROUVER UN TOKEN
  // ═══════════════════════════════════════════════════════════════════════════

  async checkAndApproveToken(
    tokenAddress: string,
    spenderAddress: string,
    amount: string
  ): Promise<boolean> {
    const provider = web3Service.getProvider();
    const signer = web3Service.getSigner();
    const account = web3Service.getCurrentAccount();
    
    if (!provider || !signer || !account) {
      throw new Error('Wallet non connecté');
    }

    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    const decimals = await tokenContract.decimals();
    const amountWei = ethers.parseUnits(amount, decimals);

    // Vérifier l'allowance actuelle
    const currentAllowance = await tokenContract.allowance(account, spenderAddress);

    if (currentAllowance < amountWei) {
      // Approuver le montant maximum pour éviter de répéter l'approbation
      const maxAmount = ethers.MaxUint256;
      const tx = await tokenContract.approve(spenderAddress, maxAmount);
      await tx.wait();
      return true;
    }

    return false; // Déjà approuvé
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EXÉCUTER UN SWAP
  // ═══════════════════════════════════════════════════════════════════════════

  async executeSwap(
    tokenInAddress: string,
    tokenOutAddress: string,
    amountIn: string,
    amountOutMin: string,
    slippageTolerance: number = 0.5
  ): Promise<SwapResult> {
    const provider = web3Service.getProvider();
    const signer = web3Service.getSigner();
    const account = web3Service.getCurrentAccount();
    const chainId = web3Service.getCurrentChainId();
    
    if (!provider || !signer || !account || !chainId) {
      throw new Error('Wallet non connecté');
    }

    const dexConfig = DEX_CONFIGS[chainId];
    if (!dexConfig) {
      throw new Error('DEX non supporté sur ce réseau');
    }

    const router = new ethers.Contract(
      dexConfig.routerAddress,
      UNISWAP_V2_ROUTER_ABI,
      signer
    );

    const isTokenInNative = tokenInAddress === 'native';
    const isTokenOutNative = tokenOutAddress === 'native';

    // Construire le path
    let path: string[];
    if (isTokenInNative) {
      path = [dexConfig.wethAddress, tokenOutAddress];
    } else if (isTokenOutNative) {
      path = [tokenInAddress, dexConfig.wethAddress];
    } else {
      path = [tokenInAddress, dexConfig.wethAddress, tokenOutAddress];
    }

    // Deadline (20 minutes)
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    let tx;

    if (isTokenInNative) {
      // ETH/BNB -> Token
      const amountInWei = ethers.parseEther(amountIn);
      const amountOutMinWei = ethers.parseUnits(amountOutMin, 18);
      
      tx = await router.swapExactETHForTokens(
        amountOutMinWei,
        path,
        account,
        deadline,
        { value: amountInWei }
      );
    } else if (isTokenOutNative) {
      // Token -> ETH/BNB
      const tokenInContract = new ethers.Contract(tokenInAddress, ERC20_ABI, provider);
      const decimalsIn = await tokenInContract.decimals();
      const amountInWei = ethers.parseUnits(amountIn, decimalsIn);
      const amountOutMinWei = ethers.parseEther(amountOutMin);

      // Approuver si nécessaire
      await this.checkAndApproveToken(tokenInAddress, dexConfig.routerAddress, amountIn);

      tx = await router.swapExactTokensForETH(
        amountInWei,
        amountOutMinWei,
        path,
        account,
        deadline
      );
    } else {
      // Token -> Token
      const tokenInContract = new ethers.Contract(tokenInAddress, ERC20_ABI, provider);
      const decimalsIn = await tokenInContract.decimals();
      const amountInWei = ethers.parseUnits(amountIn, decimalsIn);
      
      const tokenOutContract = new ethers.Contract(tokenOutAddress, ERC20_ABI, provider);
      const decimalsOut = await tokenOutContract.decimals();
      const amountOutMinWei = ethers.parseUnits(amountOutMin, decimalsOut);

      // Approuver si nécessaire
      await this.checkAndApproveToken(tokenInAddress, dexConfig.routerAddress, amountIn);

      tx = await router.swapExactTokensForTokens(
        amountInWei,
        amountOutMinWei,
        path,
        account,
        deadline
      );
    }

    const receipt = await tx.wait();

    return {
      hash: tx.hash,
      amountIn,
      amountOut: '0', // Sera calculé depuis les logs
      status: receipt.status === 1 ? 'success' : 'failed',
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENIR LE DEX CONFIG ACTUEL
  // ═══════════════════════════════════════════════════════════════════════════

  getCurrentDEXConfig(): DEXConfig | null {
    const chainId = web3Service.getCurrentChainId();
    if (!chainId) return null;
    return DEX_CONFIGS[chainId] || null;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // OBTENIR LES INFOS D'UN TOKEN
  // ═══════════════════════════════════════════════════════════════════════════

  async getTokenInfo(tokenAddress: string): Promise<TokenInfo> {
    const provider = web3Service.getProvider();
    const account = web3Service.getCurrentAccount();
    
    if (!provider) {
      throw new Error('Wallet non connecté');
    }

    if (tokenAddress === 'native') {
      const chainId = web3Service.getCurrentChainId();
      const balance = account ? await web3Service.getBalance() : '0';
      
      return {
        address: 'native',
        symbol: chainId === 1 ? 'ETH' : chainId === 56 ? 'BNB' : 'MATIC',
        name: chainId === 1 ? 'Ethereum' : chainId === 56 ? 'BNB' : 'Polygon',
        decimals: 18,
        balance,
      };
    }

    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    
    const [symbol, name, decimals, balance] = await Promise.all([
      contract.symbol(),
      contract.name(),
      contract.decimals(),
      account ? contract.balanceOf(account) : BigInt(0),
    ]);

    return {
      address: tokenAddress,
      symbol,
      name,
      decimals,
      balance: ethers.formatUnits(balance, decimals),
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const dexService = new DEXService();
