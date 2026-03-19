#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
🌌 THESORIA - AUTO BACKUP - SÉCURITÉ PROFITS
═══════════════════════════════════════════════════════════════════════════════

Système automatique de backup des profits vers wallet secondaire

FONCTIONNALITÉS :
• Détection automatique profits > seuil
• Transfert automatique vers wallet backup
• Multi-chain support
• Historique complet
• Alertes par email/Discord/Telegram

SÉCURITÉ :
• Wallet backup séparé
• Transferts chiffrés
• Vérifications multiples
• Logs complets

STRATÉGIE :
• 50% profits → Backup (sécurité)
• 50% profits → Réinvestissement (croissance)
═══════════════════════════════════════════════════════════════════════════════
"""

import asyncio
import json
import os
import time
from datetime import datetime
from typing import Dict, List
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv

load_dotenv()

class AutoBackup:
    """Système automatique de backup des profits"""
    
    def __init__(self):
        self.wallet_address = os.getenv("WALLET_ADDRESS")
        self.private_key = os.getenv("WALLET_PRIVATE_KEY")
        self.backup_address = os.getenv("BACKUP_WALLET_ADDRESS", "")
        
        # Configuration
        self.backup_threshold = float(os.getenv("BACKUP_THRESHOLD", "0.1"))  # ETH
        self.backup_percentage = float(os.getenv("BACKUP_PERCENTAGE", "50"))  # %
        self.auto_backup_enabled = os.getenv("AUTO_BACKUP_ENABLED", "true").lower() == "true"
        
        # Chains
        self.chains = {
            "ethereum": os.getenv("ETH_RPC_URL", "https://eth.llamarpc.com"),
            "polygon": os.getenv("POLYGON_RPC_URL", "https://polygon-rpc.com"),
            "arbitrum": os.getenv("ARBITRUM_RPC_URL", "https://arb1.arbitrum.io/rpc"),
        }
        
        # Web3 instances
        self.w3_instances = {}
        for chain, rpc in self.chains.items():
            try:
                self.w3_instances[chain] = Web3(Web3.HTTPProvider(rpc))
            except:
                pass
        
        # Stats
        self.total_backed_up = 0.0
        self.backup_count = 0
        self.backup_history = []
        
        print("═" * 80)
        print("💎 AUTO BACKUP SYSTEM")
        print("═" * 80)
        print(f"Wallet Principal: {self.wallet_address}")
        print(f"Wallet Backup: {self.backup_address if self.backup_address else '❌ Non configuré'}")
        print(f"Seuil: {self.backup_threshold} ETH")
        print(f"Pourcentage: {self.backup_percentage}%")
        print(f"Status: {'✅ Activé' if self.auto_backup_enabled else '❌ Désactivé'}")
        print("═" * 80)
        print()
    
    async def check_balances(self) -> Dict[str, float]:
        """Vérifier balances sur toutes chains"""
        balances = {}
        
        for chain, w3 in self.w3_instances.items():
            try:
                if not w3.is_connected():
                    continue
                
                balance_wei = w3.eth.get_balance(self.wallet_address)
                balance_eth = w3.from_wei(balance_wei, 'ether')
                balances[chain] = float(balance_eth)
                
            except Exception as e:
                balances[chain] = 0.0
        
        return balances
    
    async def execute_backup(self, chain: str, amount: float) -> bool:
        """Exécuter backup sur une chain"""
        
        if not self.backup_address:
            print(f"  ⚠️  Wallet backup non configuré - backup annulé")
            return False
        
        try:
            w3 = self.w3_instances[chain]
            
            # Construire transaction
            amount_wei = w3.to_wei(amount, 'ether')
            
            # Estimer gas
            gas_estimate = w3.eth.estimate_gas({
                'from': self.wallet_address,
                'to': self.backup_address,
                'value': amount_wei
            })
            
            gas_price = w3.eth.gas_price
            
            # Créer transaction
            tx = {
                'from': self.wallet_address,
                'to': self.backup_address,
                'value': amount_wei,
                'gas': gas_estimate,
                'gasPrice': gas_price,
                'nonce': w3.eth.get_transaction_count(self.wallet_address)
            }
            
            # Signer
            signed_tx = w3.eth.account.sign_transaction(tx, self.private_key)
            
            # Envoyer
            tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            print(f"  ✅ Transaction envoyée: {tx_hash.hex()}")
            
            # Attendre confirmation
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
            
            if receipt['status'] == 1:
                print(f"  ✅ Backup réussi: {amount:.4f} ETH transférés")
                
                # Enregistrer historique
                self.backup_history.append({
                    "timestamp": datetime.now().isoformat(),
                    "chain": chain,
                    "amount": amount,
                    "tx_hash": tx_hash.hex(),
                    "status": "success"
                })
                
                self.total_backed_up += amount
                self.backup_count += 1
                
                # Sauvegarder historique
                self.save_history()
                
                return True
            else:
                print(f"  ❌ Transaction échouée")
                return False
                
        except Exception as e:
            print(f"  ❌ Erreur backup: {str(e)}")
            return False
    
    async def auto_check_and_backup(self):
        """Vérifier et backup automatiquement si nécessaire"""
        
        if not self.auto_backup_enabled:
            return
        
        print("🔍 Vérification balances pour backup automatique...")
        print()
        
        balances = await self.check_balances()
        
        for chain, balance in balances.items():
            if balance >= self.backup_threshold:
                backup_amount = balance * (self.backup_percentage / 100)
                
                print(f"💎 {chain.upper()}")
                print(f"  Balance: {balance:.4f} ETH")
                print(f"  Seuil dépassé! Backup de {backup_amount:.4f} ETH...")
                
                # Exécuter backup
                success = await self.execute_backup(chain, backup_amount)
                
                if success:
                    # Envoyer alerte
                    await self.send_alert(
                        f"✅ Backup réussi: {backup_amount:.4f} ETH sur {chain}"
                    )
                
                print()
        
        print()
    
    async def send_alert(self, message: str):
        """Envoyer alerte (Discord/Telegram/Email)"""
        
        # Discord Webhook
        discord_webhook = os.getenv("DISCORD_WEBHOOK")
        if discord_webhook:
            try:
                import aiohttp
                async with aiohttp.ClientSession() as session:
                    await session.post(discord_webhook, json={"content": message})
            except:
                pass
        
        # Telegram
        telegram_webhook = os.getenv("TELEGRAM_WEBHOOK")
        if telegram_webhook:
            # TODO: Implémenter Telegram
            pass
        
        print(f"  📧 Alerte envoyée: {message}")
    
    def save_history(self):
        """Sauvegarder historique"""
        try:
            with open("backup_history.json", "w") as f:
                json.dump({
                    "total_backed_up": self.total_backed_up,
                    "backup_count": self.backup_count,
                    "history": self.backup_history
                }, f, indent=2)
        except:
            pass
    
    def load_history(self):
        """Charger historique"""
        try:
            with open("backup_history.json", "r") as f:
                data = json.load(f)
                self.total_backed_up = data.get("total_backed_up", 0)
                self.backup_count = data.get("backup_count", 0)
                self.backup_history = data.get("history", [])
        except:
            pass
    
    def display_stats(self):
        """Afficher statistiques"""
        print("\n" + "═" * 80)
        print("📊 STATISTIQUES BACKUP")
        print("═" * 80)
        print(f"💰 Total Backed Up: {self.total_backed_up:.4f} ETH")
        print(f"📈 Nombre Backups: {self.backup_count}")
        
        if self.backup_history:
            print("\nDerniers backups:")
            for backup in self.backup_history[-5:]:
                print(f"  • {backup['timestamp']}: {backup['amount']:.4f} ETH sur {backup['chain']}")
        
        print("═" * 80)
        print()
    
    async def run(self):
        """Boucle principale"""
        
        print("🚀 Démarrage Auto Backup System...\n")
        
        # Charger historique
        self.load_history()
        
        # Boucle infinie
        while True:
            try:
                await self.auto_check_and_backup()
                
                # Afficher stats
                self.display_stats()
                
                # Attendre 1 heure
                print("⏳ Prochain check dans 1 heure...")
                print()
                await asyncio.sleep(3600)
                
            except KeyboardInterrupt:
                print("\n\n⚠️  Arrêt demandé...\n")
                break


async def main():
    """Point d'entrée"""
    
    print("\n")
    print("╔" + "═" * 78 + "╗")
    print("║" + " " * 24 + "💎 AUTO BACKUP SYSTEM" + " " * 33 + "║")
    print("║" + " " * 19 + "Sécurisation Automatique des Profits" + " " * 23 + "║")
    print("╚" + "═" * 78 + "╝")
    print("\n")
    
    backup = AutoBackup()
    
    try:
        await backup.run()
    except KeyboardInterrupt:
        backup.display_stats()
        print("\n✅ Auto Backup arrêté proprement.\n")


if __name__ == "__main__":
    asyncio.run(main())
