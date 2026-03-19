#!/usr/bin/env python3
"""
Vérifie la balance du wallet configuré
"""

from web3 import Web3
import os
from dotenv import load_dotenv

load_dotenv()

WALLET_ADDRESS = os.getenv('WALLET_ADDRESS')
ETH_RPC = os.getenv('ETH_RPC_URL', 'https://eth.llamarpc.com')

if not WALLET_ADDRESS:
    print("❌ ERREUR: Wallet non configuré dans backend/.env")
    print("   Lancer: python generate_wallet.py")
    exit(1)

print("\n" + "=" * 70)
print("💰 VÉRIFICATION BALANCE WALLET")
print("=" * 70)
print(f"\nWallet: {WALLET_ADDRESS}")
print(f"RPC: {ETH_RPC[:50]}...")

try:
    w3 = Web3(Web3.HTTPProvider(ETH_RPC))
    
    if not w3.is_connected():
        print("\n❌ Erreur connexion RPC")
        print("   Vérifier ETH_RPC_URL dans backend/.env")
        exit(1)
    
    # Balance en Wei
    balance_wei = w3.eth.get_balance(WALLET_ADDRESS)
    
    # Convertir en ETH
    balance_eth = balance_wei / 1e18
    
    # Convertir en USD (approximatif)
    eth_price = 3000  # Approximation
    balance_usd = balance_eth * eth_price
    
    print("\n" + "=" * 70)
    print("BALANCE:")
    print("=" * 70)
    print(f"ETH:  {balance_eth:.6f} ETH")
    print(f"USD:  ${balance_usd:.2f} (approximatif)")
    print("=" * 70)
    
    # Analyse
    if balance_eth == 0:
        print("\n⚠️  BALANCE ZÉRO")
        print(f"\n💰 PROCHAINE ÉTAPE: Envoyer $10 en ETH à:")
        print(f"   {WALLET_ADDRESS}")
        print(f"\n   Options:")
        print(f"   • Coinbase: Acheter ETH puis retirer")
        print(f"   • Binance: Acheter ETH puis retirer")
        print(f"   • MetaMask: Buy directement")
        print(f"   • Ami: Demander $10")
        
    elif balance_eth < 0.003:
        print("\n⚠️  BALANCE FAIBLE")
        print(f"   Recommandé: > 0.003 ETH (~$10)")
        print(f"   Il vous manque: ~${(0.003 - balance_eth) * eth_price:.2f}")
        
    elif balance_eth < 0.01:
        print("\n✅ BALANCE SUFFISANTE pour démarrer")
        print(f"   Vous pouvez lancer le bot!")
        print(f"\n   Durée estimée avec cette balance:")
        print(f"   • ~{int(balance_eth / 0.0001)} transactions")
        print(f"   • ~{int(balance_eth / 0.001)} heures d'opération")
        print(f"\n   💡 TIP: Les profits paieront pour le gas après 1-2 jours")
        
    else:
        print("\n✅ BALANCE EXCELLENTE")
        print(f"   Vous êtes prêt pour le long terme!")
        print(f"\n   Durée estimée:")
        print(f"   • ~{int(balance_eth / 0.0001)} transactions")
        print(f"   • ~{int(balance_eth / 0.001)} heures d'opération")
    
    print("\n" + "=" * 70)
    print("🔗 LIENS UTILES:")
    print("=" * 70)
    print(f"Etherscan: https://etherscan.io/address/{WALLET_ADDRESS}")
    print(f"Alchemy Dashboard: https://dashboard.alchemy.com")
    print("=" * 70 + "\n")

except Exception as e:
    print(f"\n❌ Erreur: {e}")
    print("\nVérifier:")
    print("  • ETH_RPC_URL configuré dans backend/.env")
    print("  • Connexion internet active")
    exit(1)
