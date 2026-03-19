"""
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║  THESORIA BACKEND - CONFIGURATION PRODUCTION                                 ║
║  Créer backend/.env avec vos vraies valeurs (NE JAMAIS COMMIT)              ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
"""

import os
from dotenv import load_dotenv

load_dotenv()

class ProductionConfig:
    """Configuration pour environnement production"""
    
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # WALLET & SECURITY (⚠️ CRITIQUE - JAMAIS EN DUR DANS LE CODE)
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    # ⚠️ À définir dans backend/.env UNIQUEMENT
    PRIVATE_KEY = os.getenv('WALLET_PRIVATE_KEY')  # 0xYOUR_PRIVATE_KEY
    
    if not PRIVATE_KEY:
        raise ValueError("⚠️ WALLET_PRIVATE_KEY must be set in backend/.env")
    
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # RPC ENDPOINTS
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    ETH_RPC = os.getenv('ETH_RPC_URL', 'https://eth.llamarpc.com')
    POLYGON_RPC = os.getenv('POLYGON_RPC_URL', 'https://polygon-rpc.com')
    ARBITRUM_RPC = os.getenv('ARBITRUM_RPC_URL', 'https://arb1.arbitrum.io/rpc')
    OPTIMISM_RPC = os.getenv('OPTIMISM_RPC_URL', 'https://mainnet.optimism.io')
    BSC_RPC = os.getenv('BSC_RPC_URL', 'https://bsc-dataseed.binance.org/')
    AVAX_RPC = os.getenv('AVAX_RPC_URL', 'https://api.avax.network/ext/bc/C/rpc')
    
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # TRADING PARAMETERS
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    # Maximum trade size (ETH)
    # 🔴 PRODUCTION: Commencer PETIT (0.1 ETH) puis augmenter progressivement
    MAX_TRADE_SIZE = float(os.getenv('MAX_TRADE_SIZE', '0.1'))
    
    # Minimum profit threshold (USD)
    # En dessous de ce seuil, le trade n'est pas exécuté
    MIN_PROFIT_USD = float(os.getenv('MIN_PROFIT_USD', '20'))
    
    # Maximum gas price willing to pay (Gwei)
    # Au-dessus, on attend que le gas baisse
    MAX_GAS_GWEI = int(os.getenv('MAX_GAS_GWEI', '80'))
    
    # Slippage tolerance (%)
    MAX_SLIPPAGE_PERCENT = float(os.getenv('MAX_SLIPPAGE_PCT', '1.0'))
    
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # RISK MANAGEMENT (🛡️ TRÈS IMPORTANT)
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    # Maximum daily loss (USD)
    # Si atteint, le bot s'arrête automatiquement
    MAX_DAILY_LOSS = float(os.getenv('MAX_DAILY_LOSS', '200'))
    
    # Stop-loss per trade (%)
    STOP_LOSS_PERCENT = float(os.getenv('STOP_LOSS_PCT', '5'))
    
    # Maximum consecutive losses before pause
    MAX_CONSECUTIVE_LOSSES = int(os.getenv('MAX_CONSECUTIVE_LOSSES', '5'))
    
    # Minimum wallet balance to keep (ETH)
    # Toujours garder un buffer pour le gas
    MIN_WALLET_BALANCE = float(os.getenv('MIN_WALLET_BALANCE', '0.05'))
    
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # PERFORMANCE TUNING
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    # Scan interval (seconds)
    SCAN_INTERVAL = float(os.getenv('SCAN_INTERVAL', '5'))
    
    # Price update interval (seconds)
    PRICE_UPDATE_INTERVAL = float(os.getenv('PRICE_UPDATE_INTERVAL', '3'))
    
    # Number of concurrent workers for scanning
    NUM_WORKERS = int(os.getenv('NUM_WORKERS', '10'))
    
    # Request timeout (seconds)
    REQUEST_TIMEOUT = int(os.getenv('REQUEST_TIMEOUT', '5'))
    
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # WEBSOCKET SERVER
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    WS_HOST = os.getenv('WS_HOST', '0.0.0.0')
    WS_PORT = int(os.getenv('WS_PORT', '8765'))
    
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # MONITORING & ALERTS
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    # Telegram Bot (pour les alertes)
    TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
    TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')
    
    # Discord Webhook (alternative)
    DISCORD_WEBHOOK_URL = os.getenv('DISCORD_WEBHOOK_URL')
    
    # Sentry (error tracking)
    SENTRY_DSN = os.getenv('SENTRY_DSN')
    
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # LOGGING
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_DIR = os.getenv('LOG_DIR', 'logs')
    LOG_FILE_MAX_BYTES = int(os.getenv('LOG_FILE_MAX_BYTES', '10485760'))  # 10MB
    LOG_FILE_BACKUP_COUNT = int(os.getenv('LOG_FILE_BACKUP_COUNT', '5'))
    
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # DEX & PROTOCOLS
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    # DEX à scanner (peut être désactivé individuellement)
    ENABLED_DEX = {
        'uniswap_v2': os.getenv('ENABLE_UNISWAP_V2', 'true').lower() == 'true',
        'uniswap_v3': os.getenv('ENABLE_UNISWAP_V3', 'true').lower() == 'true',
        'sushiswap': os.getenv('ENABLE_SUSHISWAP', 'true').lower() == 'true',
        'curve': os.getenv('ENABLE_CURVE', 'true').lower() == 'true',
        'balancer': os.getenv('ENABLE_BALANCER', 'true').lower() == 'true',
        'pancakeswap': os.getenv('ENABLE_PANCAKESWAP', 'true').lower() == 'true',
    }
    
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # FEATURES FLAGS
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    # Activer/désactiver certaines fonctionnalités
    ENABLE_AUTO_TRADING = os.getenv('ENABLE_AUTO_TRADING', 'true').lower() == 'true'
    ENABLE_FLASHBOTS = os.getenv('ENABLE_FLASHBOTS', 'false').lower() == 'true'
    ENABLE_MEV_PROTECTION = os.getenv('ENABLE_MEV_PROTECTION', 'true').lower() == 'true'
    ENABLE_GAS_OPTIMIZATION = os.getenv('ENABLE_GAS_OPTIMIZATION', 'true').lower() == 'true'
    
    # Mode simulation (ne pas exécuter de vraies transactions)
    SIMULATION_MODE = os.getenv('SIMULATION_MODE', 'false').lower() == 'true'
    
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # VALIDATION
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    @classmethod
    def validate(cls):
        """Valide la configuration avant le démarrage"""
        errors = []
        
        # Vérifier les paramètres critiques
        if not cls.PRIVATE_KEY:
            errors.append("❌ WALLET_PRIVATE_KEY manquant")
            
        if cls.MAX_TRADE_SIZE <= 0:
            errors.append("❌ MAX_TRADE_SIZE doit être > 0")
            
        if cls.MIN_PROFIT_USD < 0:
            errors.append("❌ MIN_PROFIT_USD doit être >= 0")
            
        if cls.MAX_DAILY_LOSS <= 0:
            errors.append("❌ MAX_DAILY_LOSS doit être > 0")
            
        # Avertissements
        warnings = []
        
        if cls.MAX_TRADE_SIZE > 2.0:
            warnings.append("⚠️  MAX_TRADE_SIZE très élevé (> 2 ETH)")
            
        if cls.MAX_GAS_GWEI > 150:
            warnings.append("⚠️  MAX_GAS_GWEI très élevé (> 150)")
            
        if not cls.TELEGRAM_BOT_TOKEN and not cls.DISCORD_WEBHOOK_URL:
            warnings.append("⚠️  Aucun système d'alertes configuré")
            
        if cls.SIMULATION_MODE:
            warnings.append("🔵 MODE SIMULATION activé (aucune vraie transaction)")
        
        # Afficher les résultats
        if errors:
            print("\n🔴 ERREURS DE CONFIGURATION:")
            for error in errors:
                print(f"  {error}")
            raise ValueError("Configuration invalide. Corrigez les erreurs ci-dessus.")
            
        if warnings:
            print("\n⚠️  AVERTISSEMENTS:")
            for warning in warnings:
                print(f"  {warning}")
                
        print("\n✅ Configuration validée avec succès!")
        
        # Afficher résumé
        print("\n📊 RÉSUMÉ CONFIGURATION:")
        print(f"  • Max Trade Size: {cls.MAX_TRADE_SIZE} ETH")
        print(f"  • Min Profit: ${cls.MIN_PROFIT_USD}")
        print(f"  • Max Gas: {cls.MAX_GAS_GWEI} Gwei")
        print(f"  • Max Daily Loss: ${cls.MAX_DAILY_LOSS}")
        print(f"  • Simulation Mode: {cls.SIMULATION_MODE}")
        print(f"  • Auto Trading: {cls.ENABLE_AUTO_TRADING}")
        print()


class DevelopmentConfig(ProductionConfig):
    """Configuration pour environnement développement"""
    
    # Override certains paramètres pour dev
    MAX_TRADE_SIZE = 0.01  # Très petit pour tester
    MIN_PROFIT_USD = 1
    MAX_DAILY_LOSS = 10
    SIMULATION_MODE = True  # Toujours en simulation en dev
    LOG_LEVEL = 'DEBUG'
    
    # Testnet RPC
    ETH_RPC = 'https://goerli.infura.io/v3/YOUR_INFURA_KEY'


class TestnetConfig(ProductionConfig):
    """Configuration pour testnet (Goerli, Sepolia)"""
    
    MAX_TRADE_SIZE = 0.1
    MIN_PROFIT_USD = 5
    MAX_DAILY_LOSS = 50
    SIMULATION_MODE = False  # Vraies transactions mais testnet
    
    # Goerli RPC
    ETH_RPC = 'https://goerli.infura.io/v3/YOUR_INFURA_KEY'


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SÉLECTION CONFIGURATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENV = os.getenv('ENVIRONMENT', 'development')

if ENV == 'production':
    Config = ProductionConfig
elif ENV == 'testnet':
    Config = TestnetConfig
else:
    Config = DevelopmentConfig

print(f"\n🔧 Configuration chargée: {ENV.upper()}")

# Valider la configuration au démarrage
Config.validate()
