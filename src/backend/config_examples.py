#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
⚙️  THESORIA - EXEMPLES CONFIGURATIONS
═══════════════════════════════════════════════════════════════════════════════

Configurations prédéfinies pour différents scénarios

═══════════════════════════════════════════════════════════════════════════════
"""

CONFIGURATIONS = {
    
    # =========================================================================
    # DÉBUTANT - Premier lancement
    # =========================================================================
    "beginner_demo": {
        "name": "Débutant - Mode Démo",
        "description": "Configuration sécurisée pour apprendre sans risque",
        "settings": {
            "TESTNET_MODE": "false",
            "DEMO_MODE": "true",
            "AUTO_EXECUTE": "false",
            "MIN_ARBITRAGE_PROFIT": "100",
            "MAX_TRADE_SIZE": "1000",
            "MAX_DAILY_TRADES": "10",
            "MAX_DAILY_LOSS": "0",
            "MAX_GAS_PRICE_GWEI": "50",
            "SLIPPAGE_TOLERANCE": "2.0",
            "SCAN_INTERVAL": "60",
        },
        "notes": [
            "Simulation complète",
            "Aucun risque financier",
            "Parfait pour comprendre le système",
            "Pas de wallet requis"
        ]
    },
    
    # =========================================================================
    # TESTNET - Tests réels
    # =========================================================================
    "testnet_testing": {
        "name": "Testnet - Tests Réels",
        "description": "Tests avec vraies transactions sur testnet",
        "settings": {
            "TESTNET_MODE": "true",
            "DEMO_MODE": "false",
            "AUTO_EXECUTE": "false",
            "MIN_ARBITRAGE_PROFIT": "10",
            "MAX_TRADE_SIZE": "5000",
            "MAX_DAILY_TRADES": "50",
            "MAX_DAILY_LOSS": "100",
            "MAX_GAS_PRICE_GWEI": "100",
            "SLIPPAGE_TOLERANCE": "1.5",
            "SCAN_INTERVAL": "30",
        },
        "notes": [
            "Transactions testnet réelles",
            "ETH testnet requis (faucets gratuits)",
            "Tester stratégies sans risque",
            "Valider smart contract"
        ]
    },
    
    # =========================================================================
    # PRODUCTION CONSERVATEUR - Faible risque
    # =========================================================================
    "production_conservative": {
        "name": "Production - Conservateur",
        "description": "Configuration sécurisée pour production",
        "settings": {
            "TESTNET_MODE": "false",
            "DEMO_MODE": "false",
            "AUTO_EXECUTE": "false",  # Surveillance d'abord!
            "MIN_ARBITRAGE_PROFIT": "100",
            "MAX_TRADE_SIZE": "2000",
            "MAX_DAILY_TRADES": "20",
            "MAX_DAILY_LOSS": "500",
            "MAX_GAS_PRICE_GWEI": "50",
            "SLIPPAGE_TOLERANCE": "1.0",
            "SCAN_INTERVAL": "30",
            "CONFIRMATIONS_REQUIRED": "2",
        },
        "notes": [
            "Mode surveillance (pas d'auto-execute)",
            "Limites strictes",
            "Gas max 50 gwei (économique)",
            "Profit minimum élevé",
            "Recommandé pour débuter production"
        ],
        "capital_recommended": "$1,000-3,000"
    },
    
    # =========================================================================
    # PRODUCTION ÉQUILIBRÉ - Risque moyen
    # =========================================================================
    "production_balanced": {
        "name": "Production - Équilibré",
        "description": "Configuration équilibrée risque/rendement",
        "settings": {
            "TESTNET_MODE": "false",
            "DEMO_MODE": "false",
            "AUTO_EXECUTE": "true",  # ⚠️ Auto-execute activé
            "MIN_ARBITRAGE_PROFIT": "50",
            "MAX_TRADE_SIZE": "5000",
            "MAX_DAILY_TRADES": "50",
            "MAX_DAILY_LOSS": "1000",
            "MAX_GAS_PRICE_GWEI": "75",
            "SLIPPAGE_TOLERANCE": "1.5",
            "SCAN_INTERVAL": "20",
            "CONFIRMATIONS_REQUIRED": "1",
        },
        "notes": [
            "Auto-execute ACTIVÉ",
            "Limites moyennes",
            "Plus d'opportunités captées",
            "Nécessite surveillance",
            "Capital moyen requis"
        ],
        "capital_recommended": "$3,000-10,000"
    },
    
    # =========================================================================
    # PRODUCTION AGRESSIF - Risque élevé
    # =========================================================================
    "production_aggressive": {
        "name": "Production - Agressif",
        "description": "Configuration agressive pour profits maximums",
        "settings": {
            "TESTNET_MODE": "false",
            "DEMO_MODE": "false",
            "AUTO_EXECUTE": "true",
            "MIN_ARBITRAGE_PROFIT": "30",
            "MAX_TRADE_SIZE": "20000",
            "MAX_DAILY_TRADES": "100",
            "MAX_DAILY_LOSS": "3000",
            "MAX_GAS_PRICE_GWEI": "150",
            "SLIPPAGE_TOLERANCE": "2.5",
            "SCAN_INTERVAL": "10",
            "CONFIRMATIONS_REQUIRED": "1",
        },
        "notes": [
            "⚠️ RISQUE ÉLEVÉ",
            "Limites très permissives",
            "Gas élevé accepté",
            "Beaucoup d'opportunités",
            "Perte possible importante",
            "UNIQUEMENT si expérimenté"
        ],
        "capital_recommended": "$10,000+",
        "warning": "Peut perdre plusieurs milliers en une journée!"
    },
    
    # =========================================================================
    # BAS GAS UNIQUEMENT - Économique
    # =========================================================================
    "low_gas_only": {
        "name": "Bas Gas Uniquement",
        "description": "Trade uniquement quand gas très bas",
        "settings": {
            "TESTNET_MODE": "false",
            "DEMO_MODE": "false",
            "AUTO_EXECUTE": "true",
            "MIN_ARBITRAGE_PROFIT": "75",
            "MAX_TRADE_SIZE": "5000",
            "MAX_DAILY_TRADES": "30",
            "MAX_DAILY_LOSS": "1000",
            "MAX_GAS_PRICE_GWEI": "25",  # Très bas!
            "SLIPPAGE_TOLERANCE": "1.0",
            "SCAN_INTERVAL": "30",
        },
        "notes": [
            "Trade uniquement si gas < 25 gwei",
            "Opportunités rares mais profitables",
            "Économise sur gas fees",
            "Patient mais rentable",
            "Idéal pour L1 Ethereum"
        ],
        "capital_recommended": "$2,000-5,000"
    },
    
    # =========================================================================
    # HAUTE FRÉQUENCE - Maximum opportunités
    # =========================================================================
    "high_frequency": {
        "name": "Haute Fréquence",
        "description": "Capter maximum d'opportunités rapidement",
        "settings": {
            "TESTNET_MODE": "false",
            "DEMO_MODE": "false",
            "AUTO_EXECUTE": "true",
            "MIN_ARBITRAGE_PROFIT": "25",
            "MAX_TRADE_SIZE": "10000",
            "MAX_DAILY_TRADES": "200",
            "MAX_DAILY_LOSS": "2000",
            "MAX_GAS_PRICE_GWEI": "100",
            "SLIPPAGE_TOLERANCE": "2.0",
            "SCAN_INTERVAL": "5",  # 5 secondes!
            "CONFIRMATIONS_REQUIRED": "1",
        },
        "notes": [
            "Scan toutes les 5 secondes",
            "Beaucoup de trades",
            "RPC rapide REQUIS (Alchemy Pro)",
            "Compétition avec MEV bots",
            "Nécessite infrastructure pro"
        ],
        "capital_recommended": "$10,000+",
        "requirements": [
            "RPC ultra-rapide (< 50ms)",
            "Serveur dédié ou VPS",
            "Monitoring 24/7"
        ]
    },
    
    # =========================================================================
    # POLYGON / L2 - Gas bas
    # =========================================================================
    "polygon_l2": {
        "name": "Polygon / L2",
        "description": "Configuration optimisée pour Polygon (gas très bas)",
        "settings": {
            "TESTNET_MODE": "false",
            "DEMO_MODE": "false",
            "AUTO_EXECUTE": "true",
            "MIN_ARBITRAGE_PROFIT": "5",  # Bas car gas faible
            "MAX_TRADE_SIZE": "10000",
            "MAX_DAILY_TRADES": "100",
            "MAX_DAILY_LOSS": "500",
            "MAX_GAS_PRICE_GWEI": "500",  # Polygon: gwei moins cher
            "SLIPPAGE_TOLERANCE": "1.5",
            "SCAN_INTERVAL": "15",
        },
        "notes": [
            "Gas 100x moins cher que Ethereum",
            "Profit minimum peut être bas",
            "Plus d'opportunités rentables",
            "Confirmations rapides (2s)",
            "Nécessite adaptation RPC et contrats"
        ],
        "capital_recommended": "$500-2,000",
        "rpc_url": "https://polygon-rpc.com"
    },
    
    # =========================================================================
    # SURVEILLANCE PURE - Monitoring only
    # =========================================================================
    "monitoring_only": {
        "name": "Surveillance Pure",
        "description": "Détection opportunités sans exécution",
        "settings": {
            "TESTNET_MODE": "false",
            "DEMO_MODE": "false",
            "AUTO_EXECUTE": "false",  # Jamais exécuter
            "MIN_ARBITRAGE_PROFIT": "10",
            "MAX_TRADE_SIZE": "100000",
            "MAX_DAILY_TRADES": "0",
            "MAX_DAILY_LOSS": "0",
            "MAX_GAS_PRICE_GWEI": "1000",
            "SLIPPAGE_TOLERANCE": "5.0",
            "SCAN_INTERVAL": "30",
        },
        "notes": [
            "AUCUNE exécution automatique",
            "Détecte toutes opportunités",
            "Analyse marché",
            "Sécurisé (read-only)",
            "Parfait pour étudier patterns"
        ],
        "capital_recommended": "$0"
    },
}


def print_configuration(config_name):
    """Afficher configuration détaillée"""
    if config_name not in CONFIGURATIONS:
        print(f"❌ Configuration '{config_name}' inconnue")
        return
    
    config = CONFIGURATIONS[config_name]
    
    print("\n" + "═" * 80)
    print(f"⚙️  {config['name']}")
    print("═" * 80)
    print(f"\n📝 {config['description']}\n")
    
    print("Settings:")
    for key, value in config['settings'].items():
        print(f"  {key}={value}")
    
    print("\n📋 Notes:")
    for note in config['notes']:
        print(f"  • {note}")
    
    if 'capital_recommended' in config:
        print(f"\n💰 Capital recommandé: {config['capital_recommended']}")
    
    if 'warning' in config:
        print(f"\n⚠️  WARNING: {config['warning']}")
    
    if 'requirements' in config:
        print(f"\n✅ Prérequis:")
        for req in config['requirements']:
            print(f"  • {req}")
    
    if 'rpc_url' in config:
        print(f"\n🌐 RPC suggéré: {config['rpc_url']}")
    
    print("\n" + "═" * 80 + "\n")


def generate_env_file(config_name, output_file=".env.generated"):
    """Générer fichier .env depuis configuration"""
    if config_name not in CONFIGURATIONS:
        print(f"❌ Configuration '{config_name}' inconnue")
        return
    
    config = CONFIGURATIONS[config_name]
    
    with open(output_file, 'w') as f:
        f.write(f"# Configuration: {config['name']}\n")
        f.write(f"# {config['description']}\n")
        f.write(f"# Généré le: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("\n")
        
        for key, value in config['settings'].items():
            f.write(f"{key}={value}\n")
        
        f.write("\n")
        f.write("# Notes:\n")
        for note in config['notes']:
            f.write(f"# • {note}\n")
    
    print(f"✅ Configuration générée: {output_file}")
    print(f"\nPour utiliser:")
    print(f"  cp {output_file} backend/.env")


def list_configurations():
    """Lister toutes les configurations disponibles"""
    print("\n" + "═" * 80)
    print("📚 CONFIGURATIONS DISPONIBLES")
    print("═" * 80 + "\n")
    
    for key, config in CONFIGURATIONS.items():
        print(f"{key:25} - {config['name']}")
        print(f"{'':25}   {config['description']}")
        
        if 'capital_recommended' in config:
            print(f"{'':25}   💰 {config['capital_recommended']}")
        
        print()


if __name__ == "__main__":
    import sys
    from datetime import datetime
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 config_examples.py list")
        print("  python3 config_examples.py show <config_name>")
        print("  python3 config_examples.py generate <config_name> [output_file]")
        print()
        list_configurations()
    
    elif sys.argv[1] == "list":
        list_configurations()
    
    elif sys.argv[1] == "show":
        if len(sys.argv) < 3:
            print("❌ Spécifier nom configuration")
            list_configurations()
        else:
            print_configuration(sys.argv[2])
    
    elif sys.argv[1] == "generate":
        if len(sys.argv) < 3:
            print("❌ Spécifier nom configuration")
            list_configurations()
        else:
            output = sys.argv[3] if len(sys.argv) > 3 else ".env.generated"
            generate_env_file(sys.argv[2], output)
    
    else:
        print(f"❌ Commande inconnue: {sys.argv[1]}")
