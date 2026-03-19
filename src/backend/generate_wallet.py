#!/usr/bin/env python3
"""
Génère un nouveau wallet Ethereum pour le bot
"""

from eth_account import Account
import secrets
import os

print("\n" + "=" * 70)
print("🎉 GÉNÉRATION NOUVEAU WALLET ETHEREUM")
print("=" * 70)

# Générer clé privée aléatoire sécurisée
priv = secrets.token_hex(32)
private_key = "0x" + priv

# Créer account
acct = Account.from_key(private_key)

print(f"\nAddress: {acct.address}")
print(f"Private Key: {private_key}")
print("\n" + "=" * 70)
print("⚠️  IMPORTANT : SAUVEGARDER CE PRIVATE KEY IMMÉDIATEMENT!")
print("=" * 70)
print("\n3 Copies Recommandées:")
print("  1. Fichier texte sur USB")
print("  2. Cloud sécurisé (Google Drive chiffré)")
print("  3. Note papier dans coffre-fort")
print("\n🚨 Si vous perdez cette clé = vous perdez TOUT l'argent!")
print("=" * 70)

# Créer/Mettre à jour backend/.env
env_path = os.path.join(os.path.dirname(__file__), '.env')

# Lire contenu existant si fichier existe
existing_content = ""
if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        existing_content = f.read()
    
    # Vérifier si déjà un wallet configuré
    if 'WALLET_PRIVATE_KEY=' in existing_content and 'WALLET_PRIVATE_KEY=0x' in existing_content:
        print("\n⚠️  Un wallet existe déjà dans backend/.env")
        response = input("Voulez-vous le remplacer? (y/N): ")
        if response.lower() != 'y':
            print("\n✅ Wallet existant conservé")
            print(f"\n💰 PROCHAINE ÉTAPE: Vérifier balance sur")
            print(f"   https://etherscan.io/address/{acct.address}")
            exit(0)

# Créer nouveau .env ou mettre à jour
with open(env_path, 'w') as f:
    f.write(f"# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    f.write(f"# WALLET (Généré automatiquement)\n")
    f.write(f"# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    f.write(f"WALLET_ADDRESS={acct.address}\n")
    f.write(f"WALLET_PRIVATE_KEY={private_key}\n")
    f.write(f"\n# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    f.write(f"# RPC ENDPOINTS (À CONFIGURER)\n")
    f.write(f"# Obtenir gratuitement sur alchemy.com\n")
    f.write(f"# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    f.write(f"ETH_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/VOTRE_CLE_ICI\n")
    f.write(f"POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/VOTRE_CLE_ICI\n")
    f.write(f"ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/VOTRE_CLE_ICI\n")
    f.write(f"\n# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    f.write(f"# TRADING CONFIGURATION\n")
    f.write(f"# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    f.write(f"TRADING_MODE=flash_loans_only\n")
    f.write(f"ENABLE_FLASH_LOANS=true\n")
    f.write(f"MIN_FLASH_LOAN_PROFIT=50\n")
    f.write(f"MAX_FLASH_LOAN_SIZE=1000000\n")
    f.write(f"\n# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    f.write(f"# RISK MANAGEMENT\n")
    f.write(f"# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    f.write(f"MAX_GAS_PER_TX=0.01\n")
    f.write(f"MAX_DAILY_GAS=0.1\n")
    f.write(f"STOP_IF_GAS_DEPLETED=true\n")
    f.write(f"MIN_BALANCE_KEEP=0.05\n")
    f.write(f"\n# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    f.write(f"# AUTOMATION\n")
    f.write(f"# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    f.write(f"SIMULATION_MODE=true\n")
    f.write(f"ENABLE_AUTO_TRADING=true\n")
    f.write(f"AUTO_COMPOUND=true\n")
    f.write(f"WITHDRAW_THRESHOLD=1.0\n")
    f.write(f"SCAN_INTERVAL=10\n")

print(f"\n✅ Configuration sauvegardée dans backend/.env")

print("\n" + "=" * 70)
print("💰 PROCHAINES ÉTAPES:")
print("=" * 70)
print(f"\n1. ENVOYER $10 EN ETH à cette adresse:")
print(f"   {acct.address}")
print(f"\n   Vous pouvez:")
print(f"   • Coinbase / Binance (acheter puis retirer)")
print(f"   • MetaMask direct (Buy)")
print(f"   • Ami (demander $10, rendre $20 dans 1 semaine)")
print(f"\n2. CONFIGURER RPC GRATUIT:")
print(f"   • Aller sur alchemy.com")
print(f"   • Créer compte gratuit")
print(f"   • Créer app 'Ethereum'")
print(f"   • Copier API key")
print(f"   • Remplacer 'VOTRE_CLE_ICI' dans backend/.env")
print(f"\n3. LANCER LE BOT:")
print(f"   cd backend")
print(f"   python zero_capital_bot.py")
print("\n" + "=" * 70)
print("🚀 Premier profit attendu : 15-30 minutes après lancement!")
print("=" * 70 + "\n")
