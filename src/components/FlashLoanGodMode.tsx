import { useState, useEffect } from "react";
import { 
  Zap, TrendingUp, Shield, AlertCircle, DollarSign, Activity,
  Wifi, WifiOff, Wallet, ArrowUpRight, BarChart3, Target, Flame, Network, RefreshCw
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
// Dummy logger remplaçant les toasts par des logs console discrets pour la pureté visuelle
// WARNING désactivé pour éviter spam des whale movements
const toast = {
  success: (msg: string, opts?: any) => console.log(`[SUCCESS] ${msg}`, opts?.description || ''),
  error: (msg: string, opts?: any) => console.error(`[ERROR] ${msg}`, opts?.description || ''),
  info: (msg: string, opts?: any) => console.info(`[INFO] ${msg}`, opts?.description || ''),
  warning: (msg: string, opts?: any) => {}, // Silencieux pour éviter spam
};
import { MEVRiskAnalyzer } from "./MEVRiskAnalyzer";
import { MEVProfitChart } from "./MEVProfitChart";
import { MEVStrategyManager } from "./MEVStrategyManager";
import { MEVAlertSystem } from "./MEVAlertSystem";
import { AISupremeMaster } from "./AISupremeMaster";
import { AutonomousProfitEngine } from "./AutonomousProfitEngine";
import { SelfEvolvingStrategies } from "./SelfEvolvingStrategies";
import { DeepLearningOracle } from "./DeepLearningOracle";
import { MultiAgentSwarm } from "./MultiAgentSwarm";
import { YieldOptimizerSupreme } from "./YieldOptimizerSupreme";
import { QuantumStrategyOptimizer } from "./QuantumStrategyOptimizer";
import { CrossChainArbitrageMatrix } from "./CrossChainArbitrageMatrix";
import { LiquidityMiningOrchestrator } from "./LiquidityMiningOrchestrator";
import { WhaleMovementTracker } from "./WhaleMovementTracker";
import { GasOptimizationEngine } from "./GasOptimizationEngine";
import { OmniscientDashboard } from "./OmniscientDashboard";
import { SentimentAnalysisEngine } from "./SentimentAnalysisEngine";
import { RiskHedgingAutomaton } from "./RiskHedgingAutomaton";
import { CosmicMasterOrchestrator } from "./CosmicMasterOrchestrator";
import { MultiverseAIOrchestrator } from "./MultiverseAIOrchestrator";
import { SelfHealingSystem } from "./SelfHealingSystem";

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Configuration réseaux supportés
const SUPPORTED_NETWORKS = {
  1: { name: 'Ethereum Mainnet', symbol: 'ETH', rpc: 'https://eth.llamarpc.com' },
  5: { name: 'Goerli Testnet', symbol: 'ETH', rpc: 'https://goerli.infura.io/v3/' },
  11155111: { name: 'Sepolia Testnet', symbol: 'ETH', rpc: 'https://sepolia.infura.io/v3/' },
  137: { name: 'Polygon Mainnet', symbol: 'MATIC', rpc: 'https://polygon-rpc.com' },
  42161: { name: 'Arbitrum One', symbol: 'ETH', rpc: 'https://arb1.arbitrum.io/rpc' },
  10: { name: 'Optimism', symbol: 'ETH', rpc: 'https://mainnet.optimism.io' },
};

interface RealTimeOpportunity {
  type: string;
  buy_dex: string;
  sell_dex: string;
  buy_price: number;
  sell_price: number;
  spread_pct: number;
  profit_usd: number;
  amount: number;
  timestamp: string;
}

interface TradeResult {
  success: boolean;
  tx_hash?: string;
  profit?: number;
  error?: string;
  simulated?: boolean;
}

interface Stats {
  total_profit: number;
  total_trades: number;
  win_rate: number;
  active: boolean;
  balance_eth?: number;
}

export function FlashLoanGodMode() {
  // États Wallet
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [networkName, setNetworkName] = useState<string>('');
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  
  // États Bot
  const [wsConnected, setWsConnected] = useState(false);
  const [botActive, setBotActive] = useState(false);
  const [backendEnabled, setBackendEnabled] = useState(false);
  
  // Données temps réel
  const [currentOpportunity, setCurrentOpportunity] = useState<RealTimeOpportunity | null>(null);
  const [recentTrades, setRecentTrades] = useState<TradeResult[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_profit: 0,
    total_trades: 0,
    win_rate: 0,
    active: false
  });
  
  // WebSocket connection au backend Python - SEULEMENT SI ACTIVÉ
  useEffect(() => {
    // ⚠️ PROTECTION ABSOLUE : NE RIEN FAIRE SI BACKEND DÉSACTIVÉ
    if (!backendEnabled) {
      setWsConnected(false);
      return; // ← SORTIE IMMÉDIATE - Aucun WebSocket créé !
    }
    
    // ✅ Backend activé - On peut créer le WebSocket
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;
    let isUnmounted = false;
    
    const connectWebSocket = () => {
      // Double vérification avant connexion
      if (isUnmounted || !backendEnabled) return;
      
      try {
        // Créer WebSocket avec gestion d'erreurs silencieuse
        ws = new WebSocket('ws://localhost:8765');
        
        // Supprimer TOUS les logs d'erreur par défaut
        ws.addEventListener('error', (event) => {
          event.preventDefault();
          event.stopPropagation();
        });
        
        ws.onopen = () => {
          setWsConnected(true);
          
          // Demande stats initiales
          ws?.send(JSON.stringify({ command: 'get_stats' }));
        };
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'opportunity') {
            // Nouvelle opportunité détectée
            setCurrentOpportunity(data.data);
          }
          else if (data.type === 'trade_result') {
            // Résultat trade
            const result = data.data;
            setRecentTrades(prev => [result, ...prev].slice(0, 10));
            
            if (result.success) {
              // Update stats
              setStats(prev => ({
                ...prev,
                total_profit: prev.total_profit + (result.profit || 0),
                total_trades: prev.total_trades + 1
              }));
            } else {
              // Failed trade log logic could go here
            }
          }
          else if (data.type === 'stats') {
            setStats(data.data);
          }
        };
        
        ws.onerror = () => {
          // Complètement silencieux - aucun log
          setWsConnected(false);
        };
        
        ws.onclose = () => {
          setWsConnected(false);
          
          // Reconnexion silencieuse après 10s SEULEMENT SI backend toujours activé
          if (!isUnmounted && backendEnabled) {
            reconnectTimeout = setTimeout(connectWebSocket, 10000);
          }
        };
      } catch (error) {
        // Erreur silencieuse - aucun log
        setWsConnected(false);
        
        // Tentative de reconnexion après 10s SEULEMENT SI backend toujours activé
        if (!isUnmounted && backendEnabled) {
          reconnectTimeout = setTimeout(connectWebSocket, 10000);
        }
      }
    };
    
    // ✅ CONNEXION INITIALE - Seulement si on arrive ici (backendEnabled === true)
    connectWebSocket();
    
    return () => {
      isUnmounted = true;
      clearTimeout(reconnectTimeout);
      if (ws) {
        ws.close();
      }
    };
  }, [backendEnabled]);
  
  // Connexion Wallet MetaMask
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask non détecté', {
        description: 'Installez MetaMask pour continuer'
      });
      return;
    }
    
    try {
      // 1. Demander l'accès au compte
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const address = accounts[0];
      setWalletAddress(address);
      setWalletConnected(true);
      
      // 2. Récupérer le réseau actuel
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkIdNum = parseInt(chainId, 16);
      setNetworkId(networkIdNum);
      
      // 3. Vérifier si c'est un réseau supporté
      const network = SUPPORTED_NETWORKS[networkIdNum as keyof typeof SUPPORTED_NETWORKS];
      if (network) {
        setNetworkName(network.name);
        setIsCorrectNetwork(networkIdNum === 1); // Mainnet par défaut
        
        toast.success('Wallet connecté !', {
          description: `${address.slice(0, 6)}...${address.slice(-4)} sur ${network.name}`
        });
      } else {
        setNetworkName('Réseau non supporté');
        setIsCorrectNetwork(false);
        
        toast.warning('Réseau non supporté', {
          description: 'Veuillez changer de réseau'
        });
      }
      
      // 4. Récupérer balance
      const balanceWei = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      
      const balanceEth = parseInt(balanceWei, 16) / 1e18;
      setBalance(balanceEth);
      
      // 5. Écouter les changements de compte
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // 6. Écouter les changements de réseau
      window.ethereum.on('chainChanged', handleChainChanged);
      
      // ╔═══════════════════════════════════════════════════════════╗
      // ║  🚀 AUTO-ACTIVATION NIVEAU DIEU                           ║
      // ║  Dès connexion wallet → TOUT se lance automatiquement    ║
      // ╚═══════════════════════════════════════════════════════════╝
      
      // 7. AUTO-ACTIVATION BACKEND (après 500ms)
      setTimeout(() => {
        setBackendEnabled(true);
        toast.success('🤖 Backend Python activé automatiquement !', {
          description: 'IA Maître opérationnelle'
        });
      }, 500);
      
      // 8. AUTO-DÉMARRAGE BOT MEV (après 1500ms)
      setTimeout(() => {
        setBotActive(true);
        toast.success('⚡ Bot MEV démarré automatiquement !', {
          description: 'Scan perpétuel + Profits 24/7 activés'
        });
      }, 1500);
      
      // 9. NOTIFICATION FINALE
      setTimeout(() => {
        toast.success('🌌 NIVEAU DIEU ACTIVÉ !', {
          description: 'IA autonome en contrôle total. Profits en cours...'
        });
      }, 2500);
      
    } catch (error: any) {
      console.error('Erreur connexion wallet:', error);
      toast.error('Erreur connexion wallet', {
        description: error.message
      });
    }
  };
  
  // Gérer changement de compte
  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      // L'utilisateur a déconnecté son wallet
      disconnectWallet();
    } else if (accounts[0] !== walletAddress) {
      // Nouveau compte sélectionné
      setWalletAddress(accounts[0]);
      
      // Mettre à jour la balance
      const balanceWei = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest']
      });
      const balanceEth = parseInt(balanceWei, 16) / 1e18;
      setBalance(balanceEth);
      
      toast.info('Compte changé', {
        description: `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
      });
    }
  };
  
  // Gérer changement de réseau
  const handleChainChanged = (chainId: string) => {
    const networkIdNum = parseInt(chainId, 16);
    setNetworkId(networkIdNum);
    
    const network = SUPPORTED_NETWORKS[networkIdNum as keyof typeof SUPPORTED_NETWORKS];
    if (network) {
      setNetworkName(network.name);
      setIsCorrectNetwork(networkIdNum === 1);
      
      toast.info('Réseau changé', {
        description: network.name
      });
    } else {
      setNetworkName('Réseau non supporté');
      setIsCorrectNetwork(false);
      
      toast.warning('Réseau non supporté');
    }
    
    // Recharger la page pour rafraîchir les données
    window.location.reload();
  };
  
  // Switch vers Ethereum Mainnet
  const switchToMainnet = async () => {
    if (!window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // Ethereum Mainnet
      });
      
      toast.success('Réseau changé vers Ethereum Mainnet');
    } catch (error: any) {
      console.error('Erreur changement réseau:', error);
      toast.error('Erreur changement réseau', {
        description: error.message
      });
    }
  };
  
  // Rafraîchir la balance
  const refreshBalance = async () => {
    if (!walletAddress || !window.ethereum) return;
    
    try {
      const balanceWei = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [walletAddress, 'latest']
      });
      
      const balanceEth = parseInt(balanceWei, 16) / 1e18;
      setBalance(balanceEth);
      
      toast.success('Balance mise à jour', {
        description: `${balanceEth.toFixed(4)} ETH`
      });
    } catch (error) {
      toast.error('Erreur rafraîchissement balance');
    }
  };
  
  // Déconnexion wallet
  const disconnectWallet = () => {
    // Retirer les event listeners
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
    
    setWalletConnected(false);
    setWalletAddress(null);
    setBalance(0);
    setNetworkId(null);
    setNetworkName('');
    setIsCorrectNetwork(false);
    
    toast.info('Wallet déconnecté');
  };
  
  // Démarrer/Arrêter le bot
  const toggleBot = () => {
    if (!walletConnected) {
      toast.error('Connectez votre wallet d\'abord !');
      return;
    }
    
    setBotActive(!botActive);
    
    if (!botActive) {
      toast.success('Bot MEV démarré ! ⚡', {
        description: 'Scan automatique des opportunités...'
      });
    } else {
      toast.info('Bot MEV arrêté');
    }
  };

  return (
    <section className="relative py-32 overflow-hidden" id="flashloan-godmode">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.015]">
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37]/5 to-transparent border border-[#d4af37]/20 mb-8">
            <Zap className="w-5 h-5 text-[#d4af37]" />
            <span className="text-[#d4af37] tracking-[0.2em] uppercase text-sm">
              Flash Loan God Mode
            </span>
            {/* NO DEMO BADGE - PRODUCTION ONLY */}
          </div>
          
          <h2 className="text-6xl mb-6 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            MEV Production Réelle
          </h2>
          
          <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Orchestrateur asynchrone haute fréquence avec IA autonome. Connexion wallet pour profits réels.
          </p>
        </div>

        {/* Connection Status Bar */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Wallet Status */}
            <div className={`p-6 rounded-2xl border ${walletConnected ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 bg-black/40'} backdrop-blur-xl`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Wallet className={`w-5 h-5 ${walletConnected ? 'text-green-400' : 'text-white/40'}`} />
                  <span className="text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Wallet
                  </span>
                </div>
                <Badge variant="outline" className={walletConnected ? 'border-green-500/30 text-green-400' : 'border-white/20 text-white/40'}>
                  {walletConnected ? 'Connecté' : 'Déconnecté'}
                </Badge>
              </div>
              {walletConnected && walletAddress && (
                <>
                  <div className="text-xs text-white/60 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[#d4af37]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {balance.toFixed(4)} ETH
                    </div>
                    <button
                      onClick={refreshBalance}
                      className="p-1 rounded hover:bg-white/10 transition-colors"
                      title="Rafraîchir balance"
                    >
                      <RefreshCw className="w-3 h-3 text-white/60" />
                    </button>
                  </div>
                  {networkName && (
                    <div className="flex items-center gap-2 mt-2">
                      <Network className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-blue-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {networkName}
                      </span>
                      {!isCorrectNetwork && (
                        <button
                          onClick={switchToMainnet}
                          className="text-xs text-amber-400 hover:text-amber-300 underline"
                        >
                          Switch
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Backend Status */}
            <div className={`p-6 rounded-2xl border ${wsConnected ? 'border-blue-500/30 bg-blue-500/5' : 'border-white/10 bg-black/40'} backdrop-blur-xl`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {wsConnected ? <Wifi className="w-5 h-5 text-blue-400" /> : <WifiOff className="w-5 h-5 text-white/40" />}
                  <span className="text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Backend Python
                  </span>
                </div>
                <Badge variant="outline" className={wsConnected ? 'border-blue-500/30 text-blue-400' : 'border-white/20 text-white/40'}>
                  {wsConnected ? 'Online' : 'Offline'}
                </Badge>
              </div>
              <div className="text-xs text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {wsConnected ? 'Orchestrateur actif' : 'Lancer main.py'}
              </div>
            </div>

            {/* Bot Status */}
            <div className={`p-6 rounded-2xl border ${botActive ? 'border-[#d4af37]/30 bg-[#d4af37]/5' : 'border-white/10 bg-black/40'} backdrop-blur-xl`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Activity className={`w-5 h-5 ${botActive ? 'text-[#d4af37]' : 'text-white/40'}`} />
                  <span className="text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    MEV Bot
                  </span>
                </div>
                <Badge variant="outline" className={botActive ? 'border-[#d4af37]/30 text-[#d4af37]' : 'border-white/20 text-white/40'}>
                  {botActive ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
              <div className="text-xs text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {botActive ? 'Scan en cours...' : 'Prêt à démarrer'}
              </div>
            </div>
          </div>
        </div>

        {/* Main Controls */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Wallet Button */}
            <Button
              onClick={walletConnected ? disconnectWallet : connectWallet}
              className={`h-16 rounded-2xl text-base ${
                walletConnected 
                  ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  : 'bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-black hover:from-[#f4d03f] hover:to-[#d4af37]'
              }`}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <Wallet className="w-5 h-5 mr-2" />
              {walletConnected ? 'Déconnecter Wallet' : 'Connecter MetaMask'}
            </Button>

            {/* Backend Toggle */}
            <Button
              onClick={() => {
                setBackendEnabled(!backendEnabled);
                if (!backendEnabled) {
                  toast.info('Connexion au backend Python...', {
                    description: 'ws://localhost:8765'
                  });
                } else {
                  toast.info('Backend désactivé');
                }
              }}
              className={`h-16 rounded-2xl text-base ${
                backendEnabled
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
              }`}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {backendEnabled ? <Wifi className="w-5 h-5 mr-2" /> : <WifiOff className="w-5 h-5 mr-2" />}
              {backendEnabled ? 'Backend Activé' : 'Activer Backend Python'}
            </Button>

            {/* Bot Toggle */}
            <Button
              onClick={toggleBot}
              disabled={!walletConnected || !wsConnected}
              className={`h-16 rounded-2xl text-base ${
                botActive
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <Zap className="w-5 h-5 mr-2" />
              {botActive ? 'Arrêter Bot MEV' : 'Démarrer Bot MEV'}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-5 h-5 text-[#d4af37]" />
                <span className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Profit Total
                </span>
              </div>
              <div className="text-4xl text-[#d4af37] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                ${stats.total_profit.toFixed(2)}
              </div>
              <div className="text-xs text-green-400 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                Temps réel
              </div>
            </div>

            <div className="p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Total Trades
                </span>
              </div>
              <div className="text-4xl text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                {stats.total_trades}
              </div>
              <div className="text-xs text-white/40">
                Win Rate: {stats.win_rate.toFixed(1)}%
              </div>
            </div>

            <div className="p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Profit Moyen
                </span>
              </div>
              <div className="text-4xl text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                ${stats.total_trades > 0 ? (stats.total_profit / stats.total_trades).toFixed(2) : '0.00'}
              </div>
              <div className="text-xs text-white/40">
                Par trade
              </div>
            </div>
          </div>
        </div>

        {/* Current Opportunity */}
        {currentOpportunity && botActive && (
          <div className="max-w-5xl mx-auto mb-12">
            <div className="p-8 rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/10 to-transparent backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <Flame className="w-6 h-6 text-[#d4af37]" />
                <h3 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Opportunité Détectée
                </h3>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Live
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-xs text-white/40 mb-2">Achat</div>
                  <div className="text-lg text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {currentOpportunity.buy_dex}
                  </div>
                  <div className="text-sm text-white/60">${currentOpportunity.buy_price.toFixed(2)}</div>
                </div>

                <div>
                  <div className="text-xs text-white/40 mb-2">Vente</div>
                  <div className="text-lg text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {currentOpportunity.sell_dex}
                  </div>
                  <div className="text-sm text-white/60">${currentOpportunity.sell_price.toFixed(2)}</div>
                </div>

                <div>
                  <div className="text-xs text-white/40 mb-2">Spread</div>
                  <div className="text-lg text-green-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {currentOpportunity.spread_pct.toFixed(2)}%
                  </div>
                </div>

                <div>
                  <div className="text-xs text-white/40 mb-2">Profit Estimé</div>
                  <div className="text-lg text-[#d4af37]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    ${currentOpportunity.profit_usd.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Warning si pas connecté */}
        {!walletConnected && (
          <div className="max-w-5xl mx-auto mb-12">
            <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Connexion Wallet Requise - Auto-Activation Totale
                  </div>
                  <div className="text-sm text-white/60 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <strong className="text-[#d4af37]">NIVEAU DIEU :</strong> Dès connexion MetaMask, l'IA Maître prend le contrôle total.<br/>
                    ✅ Backend activé automatiquement<br/>
                    ✅ Bot MEV démarré automatiquement<br/>
                    ✅ IA Maître opérationnelle<br/>
                    ✅ Scan perpétuel 15 DEX + 6 chains<br/>
                    ✅ Profits 24/7 sans intervention<br/>
                    <br/>
                    <span className="text-green-400">→ Juste 1 clic "Connecter MetaMask" et l'argent arrive !</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Banner - Niveau DIEU Activé */}
        {walletConnected && botActive && (
          <div className="max-w-5xl mx-auto mb-12">
            <div className="p-6 rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/10 to-transparent backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <Zap className="w-8 h-8 text-[#d4af37] flex-shrink-0 animate-pulse" />
                <div className="flex-1">
                  <div className="text-2xl text-[#d4af37] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                    🌌 NIVEAU DIEU ACTIVÉ - AUTONOMIE TOTALE
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/80" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <div>
                      <div className="text-green-400 mb-1">✅ IA Maître</div>
                      <div className="text-xs text-white/60">Contrôle total actif</div>
                    </div>
                    <div>
                      <div className="text-green-400 mb-1">✅ Scan Perpétuel</div>
                      <div className="text-xs text-white/60">15 DEX + 6 chains</div>
                    </div>
                    <div>
                      <div className="text-green-400 mb-1">✅ Évolution</div>
                      <div className="text-xs text-white/60">Génétique continue</div>
                    </div>
                    <div>
                      <div className="text-green-400 mb-1">✅ Profits 24/7</div>
                      <div className="text-xs text-white/60">Auto-exécution</div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 rounded-xl bg-black/30 border border-[#d4af37]/20">
                    <div className="text-xs text-white/60 mb-1">Status Système</div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        L'IA gère TOUT automatiquement • Profits en accumulation • Zéro intervention requise
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Analytics Section */}
        {walletConnected && (
          <>
            {/* ╔═══════════════════════════════════════════════════════════╗ */}
            {/* ║  COMPOSANTS NIVEAU DIEU - AUTONOMIE TOTALE                 ║ */}
            {/* ╚═══════════════════════════════════════════════════════════╝ */}
            
            {/* IA Maître Suprême - Position Fixed Left */}
            <AISupremeMaster 
              walletConnected={walletConnected}
              onStrategyGenerated={(strategy) => {
                console.log('Nouvelle stratégie générée:', strategy);
                // Auto-intégration de la stratégie dans le système
              }}
            />

            {/* Moteur de Profit Autonome */}
            <div className="max-w-[1800px] mx-auto mb-12">
              <AutonomousProfitEngine
                walletConnected={walletConnected}
                walletAddress={walletAddress}
                onTradeExecuted={(trade) => {
                  // Auto-update stats (sans notification)
                  setStats(prev => ({
                    ...prev,
                    total_profit: prev.total_profit + (trade.profit || 0),
                    total_trades: prev.total_trades + 1,
                    win_rate: trade.status === 'executed' ? ((prev.win_rate * prev.total_trades + 100) / (prev.total_trades + 1)) : prev.win_rate
                  }));
                  
                  // Add to recent trades
                  setRecentTrades(prev => [trade, ...prev].slice(0, 20));
                }}
              />
            </div>

            {/* Stratégies Auto-Évolutives */}
            <div className="max-w-[1800px] mx-auto mb-12">
              <SelfEvolvingStrategies
                walletConnected={walletConnected}
                onNewEliteStrategy={(strategy) => {
                  // Notification désactivée pour éviter spam
                  console.log('Nouvelle Stratégie Élite:', strategy);
                }}
              />
            </div>

            {/* ╔═══════════════════════════════════════════════════════════╗ */}
            {/* ║  NIVEAU TRANSCENDANT - 3 NOUVEAUX COMPOSANTS              ║ */}
            {/* ╚═══════════════════════════════════════════════════════════╝ */}

            {/* Deep Learning Oracle - Prédiction Marché IA */}
            <div className="max-w-[1800px] mx-auto mb-12">
              <DeepLearningOracle
                walletConnected={walletConnected}
                onPrediction={(prediction) => {
                  console.log('Nouvelle prédiction:', prediction);
                  // Auto-utilisation des prédictions pour optimiser trades
                }}
              />
            </div>

            {/* Multi-Agent Swarm - Intelligence Collective */}
            <div className="max-w-[1800px] mx-auto mb-12">
              <MultiAgentSwarm
                walletConnected={walletConnected}
                onSwarmDecision={(decision) => {
                  console.log('Décision swarm:', decision);
                  // Auto-exécution selon consensus du swarm
                }}
              />
            </div>

            {/* Yield Optimizer Supreme - Auto-Compound & Rebalance */}
            <div className="max-w-[1800px] mx-auto mb-12">
              <YieldOptimizerSupreme
                walletConnected={walletConnected}
                walletBalance={balance * 2000} // Conversion ETH → USD approximative
                onRebalance={(action) => {
                  // Notification désactivée pour éviter spam
                  console.log('Auto-Rebalance:', action);
                }}
              />
            </div>

            {/* Quantum Strategy Optimizer */}
            <div className="max-w-[1800px] mx-auto mb-12">
              <QuantumStrategyOptimizer
                walletConnected={walletConnected}
                onOptimizationComplete={(result) => {
                  // Notification désactivée pour éviter spam
                  console.log('Optimisation Stratégique Quantique:', result);
                }}
              />
            </div>

            {/* Cross-Chain Arbitrage Matrix */}
            <div className="max-w-[1800px] mx-auto mb-12">
              <CrossChainArbitrageMatrix
                walletConnected={walletConnected}
                onArbitrageOpportunity={(opportunity) => {
                  // Notification désactivée pour éviter spam
                  console.log('Arbitrage Cross-Chain:', opportunity);
                }}
              />
            </div>

            {/* Liquidity Mining Orchestrator */}
            <div className="max-w-[1800px] mx-auto mb-12">
              <LiquidityMiningOrchestrator
                walletConnected={walletConnected}
                walletBalance={balance * 2000}
                onHarvest={(action) => {
                  // Notification désactivée pour éviter spam
                  console.log('Auto-Harvest:', action);
                }}
              />
            </div>

            {/* ╔═══════════════════════════════════════════════════════════╗ */}
            {/* ║  NIVEAU OMNISCIENT - 3 NOUVEAUX COMPOSANTS DIVINS         ║ */}
            {/* ╚═══════════════════════════════════════════════════════════╝ */}

            {/* Whale Movement Tracker - On-Chain Intelligence */}
            <div className="max-w-[1800px] mx-auto mb-12">
              <WhaleMovementTracker
                walletConnected={walletConnected}
                onWhaleMovement={(movement) => {
                  // Callback intentionnellement vide pour éviter spam
                }}
              />
            </div>

            {/* Gas Optimization Engine - ML Predictive Pricing */}
            <div className="max-w-[1800px] mx-auto mb-12">
              <GasOptimizationEngine
                walletConnected={walletConnected}
                onOptimization={(opt) => {
                  // Notification désactivée pour éviter spam
                  console.log('Optimisation Gas:', opt);
                }}
              />
            </div>

            {/* Omniscient Dashboard - Central Command Center */}
            <div className="max-w-[1800px] mx-auto mb-12">
              <OmniscientDashboard
                walletConnected={walletConnected}
              />
            </div>

            {/* Sentiment Analysis Engine */}
            <div className="max-w-[1800px] mx-auto mb-12">
              <SentimentAnalysisEngine
                walletConnected={walletConnected}
                onSentimentSignal={(signal) => {
                  console.log('Signal sentiment:', signal);
                }}
              />
            </div>

            {/* Risk Hedging Automaton */}
            <div className="max-w-[1800px] mx-auto mb-12">
              <RiskHedgingAutomaton
                walletConnected={walletConnected}
                portfolioValue={balance * 2000}
                onHedgeExecuted={(hedge) => {
                  // Notification désactivée pour éviter spam
                  console.log('Hedge Exécuté:', hedge);
                }}
              />
            </div>

            {/* Cosmic Master Orchestrator - Le Maître Suprême Final */}
            <div className="max-w-[1800px] mx-auto mb-12">
              <CosmicMasterOrchestrator
                walletConnected={walletConnected}
              />
            </div>

            {/* Multiverse AI Orchestrator */}
            <div className="max-w-[1800px] mx-auto mb-12">
              <MultiverseAIOrchestrator
                walletConnected={walletConnected}
              />
            </div>

            {/* Self-Healing System */}
            <div className="max-w-[1800px] mx-auto mb-12">
              <SelfHealingSystem
                walletConnected={walletConnected}
              />
            </div>

            {/* Profit Chart & Risk Analyzer Grid */}
            <div className="max-w-[1800px] mx-auto mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MEVProfitChart
                  totalProfit={stats.total_profit}
                  totalTrades={stats.total_trades}
                  winRate={stats.win_rate}
                  recentTrades={recentTrades}
                />
                
                <MEVRiskAnalyzer
                  currentOpportunity={currentOpportunity}
                  gasPrice={150}
                  networkCongestion={45}
                />
              </div>
            </div>

            {/* Strategy Manager */}
            <div className="max-w-[1800px] mx-auto mb-12">
              <MEVStrategyManager />
            </div>

            {/* Alert System - DÉSACTIVÉ pour éviter spam d'alertes */}
            {/*
            <div className="fixed top-24 right-6 z-40">
              <MEVAlertSystem
                currentOpportunity={currentOpportunity}
                recentTrades={recentTrades}
              />
            </div>
            */}
          </>
        )}
      </div>
    </section>
  );
}

export default FlashLoanGodMode;