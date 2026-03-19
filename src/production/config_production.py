"""
⚡ THESORIA - CONFIGURATION PRODUCTION ULTIME
=============================================

Configuration optimisée pour:
- Latence minimale (< 50ms)
- Haute disponibilité (99.99%)
- Débit maximum (1000+ scans/sec)
- Protection MEV totale

Infrastructure:
- RPC privés ultra-rapides
- Nodes dédiés
- Connexions directes validateurs
- Cache Redis distribué
- Load balancing
"""

import os
from typing import List, Dict
from dataclasses import dataclass

@dataclass
class RPCEndpoint:
    """Configuration d'un endpoint RPC"""
    name: str
    url: str
    latency_ms: float
    priority: int
    is_private: bool = False
    max_retries: int = 3

@dataclass
class ProductionConfig:
    """Configuration production complète"""
    
    # =============================================
    # ENDPOINTS RPC ULTRA-RAPIDES
    # =============================================
    
    # Ethereum Mainnet (Flashbots requis)
    ETHEREUM_RPCS: List[RPCEndpoint] = None
    
    # Polygon (RPC privés recommandés)
    POLYGON_RPCS: List[RPCEndpoint] = None
    
    # Arbitrum (L2 ultra-rapide)
    ARBITRUM_RPCS: List[RPCEndpoint] = None
    
    # Optimism
    OPTIMISM_RPCS: List[RPCEndpoint] = None
    
    # Base (nouveau L2 Coinbase)
    BASE_RPCS: List[RPCEndpoint] = None
    
    # =============================================
    # SDKs INTÉGRATIONS
    # =============================================
    
    # Aave V3 Core (Flash Loans)
    AAVE_V3_POOL_ADDRESSES = {
        'ethereum': '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
        'polygon': '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
        'arbitrum': '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
        'optimism': '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
    }
    
    # Uniswap V3 Router
    UNISWAP_V3_ROUTER_ADDRESSES = {
        'ethereum': '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        'polygon': '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        'arbitrum': '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        'optimism': '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        'base': '0x2626664c2603336E57B271c5C0b26F421741e481',
    }
    
    # DEX Routers (Multi-chain)
    DEX_ROUTERS = {
        'ethereum': {
            'uniswap_v2': '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
            'sushiswap': '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
            'curve': '0x8e764bE4288B842791989DB5b8ec067279829809',
        },
        'polygon': {
            'quickswap': '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
            'sushiswap': '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
            'apeswap': '0xC0788A3aD43d79aa53B09c2EaCc313A787d1d607',
        },
        'arbitrum': {
            'uniswap_v3': '0xE592427A0AEce92De3Edee1F18E0157C05861564',
            'sushiswap': '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
            'camelot': '0xc873fEcbd354f5A56E00E710B90EF4201db2448d',
        },
    }
    
    # =============================================
    # FLASHBOTS & MEV-BOOST
    # =============================================
    
    # Relayers Flashbots
    FLASHBOTS_RELAYS = {
        'mainnet': 'https://relay.flashbots.net',
        'goerli': 'https://relay-goerli.flashbots.net',
        'sepolia': 'https://relay-sepolia.flashbots.net',
    }
    
    # MEV-Boost (Alternative pour autres chains)
    MEV_BOOST_RELAYS = [
        'https://0xac6e77dfe25ecd6110b8e780608cce0dab71fdd5ebea22a16c0205200f2f8e2e3ad3b71d3499c54ad14d6c21b41a37ae@boost-relay.flashbots.net',
        'https://0x8b5d2e73e2a3a55c6c87b8b6eb92e0149a125c852751db1422fa951e42a09b82c142c3ea98d0d9930b056a3bc9896b8f@bloxroute.max-profit.blxrbdn.com',
        'https://0xb0b07cd0abef743db4260b0ed50619cf6ad4d82064cb4fbec9d3ec530f7c5e6793d9f286c4e082c0244ffb9f2658fe88@bloxroute.regulated.blxrbdn.com',
    ]
    
    # =============================================
    # PERFORMANCE & LATENCE
    # =============================================
    
    # Scan ultra-rapide
    SCAN_INTERVAL_MS = 100  # 100ms = 10 scans/sec
    PARALLEL_SCANS = 50     # 50 scans simultanés
    MAX_WORKERS = 16        # 16 threads
    
    # Timeouts agressifs
    RPC_TIMEOUT_MS = 500    # 500ms max
    TX_CONFIRMATION_TIMEOUT = 15  # 15 secondes
    BUNDLE_WAIT_TIMEOUT = 12  # 12 secondes (1 block)
    
    # Connection pooling
    CONNECTION_POOL_SIZE = 100
    MAX_CONNECTIONS_PER_HOST = 20
    
    # Cache Redis
    REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
    REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
    REDIS_DB = 0
    CACHE_TTL_SECONDS = 5  # Cache très court
    
    # =============================================
    # TRADING PARAMÈTRES
    # =============================================
    
    # Profits
    MIN_PROFIT_USD = 50.0  # Plus agressif en prod
    MIN_SPREAD = 0.003     # 0.3% minimum
    MIN_ROI = 0.05         # 5% ROI minimum
    
    # Capital
    MAX_FLASH_LOAN = 10_000_000  # $10M max
    DEFAULT_AMOUNT = 100_000      # $100k par défaut
    
    # Gas
    MAX_GAS_PRICE_GWEI = 150     # 150 Gwei max
    PRIORITY_FEE_MULTIPLIER = 1.5  # 150% du base
    
    # Slippage
    SLIPPAGE_TOLERANCE = 0.005   # 0.5%
    MAX_SLIPPAGE = 0.02          # 2% max
    
    # =============================================
    # SÉCURITÉ
    # =============================================
    
    # Rate limiting
    MAX_TRADES_PER_HOUR = 100
    MAX_TRADES_PER_DAY = 1000
    
    # Circuit breakers
    MAX_CONSECUTIVE_LOSSES = 5
    PAUSE_AFTER_LOSS_STREAK = True
    PAUSE_DURATION_MINUTES = 10
    
    # Profit tracking
    STOP_LOSS_DAILY = -5000  # -$5k max perte journalière
    TAKE_PROFIT_DAILY = 50000  # +$50k take profit
    
    # =============================================
    # MONITORING & ALERTES
    # =============================================
    
    # Logging
    LOG_LEVEL = 'INFO'
    LOG_TO_FILE = True
    LOG_TO_CONSOLE = True
    LOG_TO_DISCORD = os.getenv('DISCORD_WEBHOOK_URL') is not None
    LOG_TO_TELEGRAM = os.getenv('TELEGRAM_BOT_TOKEN') is not None
    
    # Métriques
    ENABLE_PROMETHEUS = True
    PROMETHEUS_PORT = 9090
    
    # Health checks
    HEALTH_CHECK_INTERVAL = 60  # 60 secondes
    
    # Alertes critiques
    ALERT_ON_LOW_BALANCE = True
    MIN_BALANCE_ALERT = 0.1  # 0.1 ETH
    
    ALERT_ON_HIGH_GAS = True
    MAX_GAS_ALERT = 200  # 200 Gwei
    
    ALERT_ON_LOW_SUCCESS_RATE = True
    MIN_SUCCESS_RATE_ALERT = 0.5  # 50%
    
    # =============================================
    # IA & ML
    # =============================================
    
    # OpenAI
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    OPENAI_MODEL = 'gpt-4-turbo-preview'
    OPENAI_TEMPERATURE = 0.3
    OPENAI_MAX_TOKENS = 1000
    
    # Langchain
    LANGCHAIN_API_KEY = os.getenv('LANGCHAIN_API_KEY')
    LANGCHAIN_PROJECT = 'thesoria-mev'
    LANGCHAIN_TRACING = True
    
    # ML Models (local)
    USE_LOCAL_ML = True
    ML_MODEL_PATH = './models/arbitrage_predictor.pkl'
    
    # Training
    CONTINUOUS_LEARNING = True
    RETRAIN_INTERVAL_HOURS = 24
    MIN_SAMPLES_FOR_TRAINING = 100
    
    # =============================================
    # ARTEMIS (Rust Agent Integration)
    # =============================================
    
    # Artemis binary path
    ARTEMIS_BIN = os.getenv('ARTEMIS_BIN', './bin/artemis')
    ARTEMIS_CONFIG = './config/artemis.toml'
    
    # Artemis strategies
    ARTEMIS_STRATEGIES = [
        'sandwich',
        'jit',
        'liquidation',
        'cex-dex-arbitrage',
    ]
    
    def __post_init__(self):
        """Initialiser les endpoints après création"""
        
        # ETHEREUM - RPC ultra-rapides
        self.ETHEREUM_RPCS = [
            RPCEndpoint(
                name='Alchemy Private',
                url=f"https://eth-mainnet.g.alchemy.com/v2/{os.getenv('ALCHEMY_API_KEY')}",
                latency_ms=20,
                priority=1,
                is_private=True,
            ),
            RPCEndpoint(
                name='QuickNode',
                url=os.getenv('QUICKNODE_ETH_URL', ''),
                latency_ms=25,
                priority=2,
                is_private=True,
            ),
            RPCEndpoint(
                name='Infura',
                url=f"https://mainnet.infura.io/v3/{os.getenv('INFURA_API_KEY')}",
                latency_ms=35,
                priority=3,
            ),
            RPCEndpoint(
                name='Ankr',
                url='https://rpc.ankr.com/eth',
                latency_ms=40,
                priority=4,
            ),
        ]
        
        # POLYGON - RPC ultra-rapides
        self.POLYGON_RPCS = [
            RPCEndpoint(
                name='Alchemy Private',
                url=f"https://polygon-mainnet.g.alchemy.com/v2/{os.getenv('ALCHEMY_API_KEY')}",
                latency_ms=15,
                priority=1,
                is_private=True,
            ),
            RPCEndpoint(
                name='QuickNode',
                url=os.getenv('QUICKNODE_POLYGON_URL', ''),
                latency_ms=18,
                priority=2,
                is_private=True,
            ),
            RPCEndpoint(
                name='Polygon Official',
                url='https://polygon-rpc.com',
                latency_ms=30,
                priority=3,
            ),
            RPCEndpoint(
                name='Ankr',
                url='https://rpc.ankr.com/polygon',
                latency_ms=35,
                priority=4,
            ),
        ]
        
        # ARBITRUM - L2 ultra-rapide
        self.ARBITRUM_RPCS = [
            RPCEndpoint(
                name='Alchemy Private',
                url=f"https://arb-mainnet.g.alchemy.com/v2/{os.getenv('ALCHEMY_API_KEY')}",
                latency_ms=12,
                priority=1,
                is_private=True,
            ),
            RPCEndpoint(
                name='Arbitrum Official',
                url='https://arb1.arbitrum.io/rpc',
                latency_ms=20,
                priority=2,
            ),
        ]
        
        # OPTIMISM
        self.OPTIMISM_RPCS = [
            RPCEndpoint(
                name='Alchemy Private',
                url=f"https://opt-mainnet.g.alchemy.com/v2/{os.getenv('ALCHEMY_API_KEY')}",
                latency_ms=15,
                priority=1,
                is_private=True,
            ),
            RPCEndpoint(
                name='Optimism Official',
                url='https://mainnet.optimism.io',
                latency_ms=22,
                priority=2,
            ),
        ]
        
        # BASE
        self.BASE_RPCS = [
            RPCEndpoint(
                name='Base Official',
                url='https://mainnet.base.org',
                latency_ms=18,
                priority=1,
            ),
            RPCEndpoint(
                name='Alchemy',
                url=f"https://base-mainnet.g.alchemy.com/v2/{os.getenv('ALCHEMY_API_KEY')}",
                latency_ms=20,
                priority=2,
                is_private=True,
            ),
        ]


# Instance globale
config = ProductionConfig()


# =============================================
# HELPER FUNCTIONS
# =============================================

def get_fastest_rpc(chain: str) -> RPCEndpoint:
    """Retourne le RPC le plus rapide pour une chain"""
    rpcs = {
        'ethereum': config.ETHEREUM_RPCS,
        'polygon': config.POLYGON_RPCS,
        'arbitrum': config.ARBITRUM_RPCS,
        'optimism': config.OPTIMISM_RPCS,
        'base': config.BASE_RPCS,
    }
    
    chain_rpcs = rpcs.get(chain, [])
    if not chain_rpcs:
        raise ValueError(f"Chain {chain} non supportée")
    
    # Filtrer les RPCs avec URL valide
    valid_rpcs = [rpc for rpc in chain_rpcs if rpc.url]
    
    if not valid_rpcs:
        raise ValueError(f"Aucun RPC configuré pour {chain}")
    
    # Trier par priorité puis latence
    valid_rpcs.sort(key=lambda x: (x.priority, x.latency_ms))
    
    return valid_rpcs[0]


def get_all_rpcs_sorted(chain: str) -> List[RPCEndpoint]:
    """Retourne tous les RPCs triés par performance"""
    rpcs = {
        'ethereum': config.ETHEREUM_RPCS,
        'polygon': config.POLYGON_RPCS,
        'arbitrum': config.ARBITRUM_RPCS,
        'optimism': config.OPTIMISM_RPCS,
        'base': config.BASE_RPCS,
    }
    
    chain_rpcs = rpcs.get(chain, [])
    valid_rpcs = [rpc for rpc in chain_rpcs if rpc.url]
    valid_rpcs.sort(key=lambda x: (x.priority, x.latency_ms))
    
    return valid_rpcs


def get_dex_router(chain: str, dex: str) -> str:
    """Retourne l'adresse du router d'un DEX"""
    return config.DEX_ROUTERS.get(chain, {}).get(dex)


def get_aave_pool(chain: str) -> str:
    """Retourne l'adresse du pool Aave V3"""
    return config.AAVE_V3_POOL_ADDRESSES.get(chain)


def print_config_summary():
    """Affiche un résumé de la configuration production"""
    print("\n" + "="*80)
    print("⚡ THESORIA PRODUCTION CONFIGURATION")
    print("="*80)
    
    print(f"\n📡 RPC ENDPOINTS:")
    for chain in ['ethereum', 'polygon', 'arbitrum', 'optimism', 'base']:
        try:
            fastest = get_fastest_rpc(chain)
            print(f"   {chain.upper():12s} → {fastest.name:20s} ({fastest.latency_ms}ms)")
        except:
            print(f"   {chain.upper():12s} → Non configuré")
    
    print(f"\n⚡ PERFORMANCE:")
    print(f"   Scan interval: {config.SCAN_INTERVAL_MS}ms")
    print(f"   Parallel scans: {config.PARALLEL_SCANS}")
    print(f"   Max workers: {config.MAX_WORKERS}")
    print(f"   RPC timeout: {config.RPC_TIMEOUT_MS}ms")
    
    print(f"\n💰 TRADING:")
    print(f"   Min profit: ${config.MIN_PROFIT_USD}")
    print(f"   Min spread: {config.MIN_SPREAD*100:.2f}%")
    print(f"   Max flash loan: ${config.MAX_FLASH_LOAN:,.0f}")
    print(f"   Max gas: {config.MAX_GAS_PRICE_GWEI} Gwei")
    
    print(f"\n🛡️ SÉCURITÉ:")
    print(f"   Max trades/hour: {config.MAX_TRADES_PER_HOUR}")
    print(f"   Stop loss daily: ${config.STOP_LOSS_DAILY:,.0f}")
    print(f"   Take profit daily: ${config.TAKE_PROFIT_DAILY:,.0f}")
    
    print(f"\n🤖 IA:")
    print(f"   OpenAI: {'✅' if config.OPENAI_API_KEY else '❌'}")
    print(f"   Model: {config.OPENAI_MODEL}")
    print(f"   Langchain: {'✅' if config.LANGCHAIN_API_KEY else '❌'}")
    print(f"   Local ML: {'✅' if config.USE_LOCAL_ML else '❌'}")
    
    print(f"\n📊 MONITORING:")
    print(f"   Prometheus: {'✅' if config.ENABLE_PROMETHEUS else '❌'}")
    print(f"   Discord: {'✅' if config.LOG_TO_DISCORD else '❌'}")
    print(f"   Telegram: {'✅' if config.LOG_TO_TELEGRAM else '❌'}")
    
    print("\n" + "="*80 + "\n")


if __name__ == "__main__":
    print_config_summary()
