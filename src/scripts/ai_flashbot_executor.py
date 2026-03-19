"""
Script Python pour l'IA Maître THESORIA
Exécute des Flash Loans automatiquement depuis l'analyse de marché

Usage:
    python ai_flashbot_executor.py --scan
    python ai_flashbot_executor.py --execute USDC 10000
"""

import json
import os
import time
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv
import requests

# Charger les variables d'environnement
load_dotenv()

# Configuration
POLYGON_RPC = os.getenv("POLYGON_RPC_URL", "https://polygon-rpc.com")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
CONTRACT_ADDRESS = os.getenv("FLASHBOT_CONTRACT_ADDRESS")

# Connexion Web3
w3 = Web3(Web3.HTTPProvider(POLYGON_RPC))
account = Account.from_key(PRIVATE_KEY)

# ABI du FlashBot (simplifié)
FLASHBOT_ABI = json.loads("""[
    {
        "inputs": [
            {"name": "_token", "type": "address"},
            {"name": "_amount", "type": "uint256"},
            {"name": "_params", "type": "bytes"}
        ],
        "name": "requestFlashLoan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"name": "_token", "type": "address"}],
        "name": "getBalance",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"name": "_tokenAddress", "type": "address"}],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]""")

# Adresses des tokens (Polygon Mainnet)
TOKENS = {
    "USDC": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    "USDT": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    "DAI": "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    "WETH": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    "WMATIC": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
}

# Initialiser le contrat
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=FLASHBOT_ABI)


class FlashBotAI:
    """Intelligence Artificielle pour le FlashBot"""
    
    def __init__(self):
        self.min_profit = 100  # $100 minimum
        self.max_amount = 1_000_000  # $1M maximum
        self.dex_apis = {
            "uniswap": "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
            "sushiswap": "https://api.thegraph.com/subgraphs/name/sushiswap/exchange",
        }
    
    def scan_opportunities(self):
        """Scanne les opportunités d'arbitrage sur tous les DEX"""
        print("🔍 Scan des opportunités en cours...")
        
        opportunities = []
        
        # Pour chaque paire de tokens
        for token1 in ["USDC", "USDT", "DAI"]:
            for token2 in ["WETH", "WMATIC"]:
                opportunity = self._check_arbitrage(token1, token2)
                if opportunity and opportunity["profit"] > self.min_profit:
                    opportunities.append(opportunity)
        
        # Trier par profit décroissant
        opportunities.sort(key=lambda x: x["profit"], reverse=True)
        
        return opportunities
    
    def _check_arbitrage(self, token_in, token_out):
        """Vérifie une opportunité d'arbitrage entre deux DEX"""
        try:
            # Simuler un check (en prod, interroger les vrais DEX)
            # Prix sur Uniswap
            price_uni = self._get_price("uniswap", token_in, token_out)
            
            # Prix sur SushiSwap
            price_sushi = self._get_price("sushiswap", token_in, token_out)
            
            # Calculer la différence
            if price_uni and price_sushi:
                diff = abs(price_uni - price_sushi)
                percent_diff = (diff / min(price_uni, price_sushi)) * 100
                
                # Si différence > 0.5%, c'est une opportunité
                if percent_diff > 0.5:
                    amount = 10000  # $10k par défaut
                    profit = amount * (percent_diff / 100) - (amount * 0.0009)  # Moins frais Aave
                    
                    return {
                        "token_in": token_in,
                        "token_out": token_out,
                        "buy_dex": "uniswap" if price_uni < price_sushi else "sushiswap",
                        "sell_dex": "sushiswap" if price_uni < price_sushi else "uniswap",
                        "price_diff": percent_diff,
                        "profit": profit,
                        "amount": amount,
                        "confidence": 95 if percent_diff > 1 else 85,
                    }
        except Exception as e:
            print(f"⚠️  Erreur check arbitrage {token_in}/{token_out}: {e}")
        
        return None
    
    def _get_price(self, dex, token_in, token_out):
        """Récupère le prix sur un DEX (simulation)"""
        # En production, interroger l'API du DEX ou les smart contracts
        # Pour la démo, on simule avec des prix aléatoires
        import random
        base_price = 1.0
        volatility = random.uniform(-0.02, 0.02)  # ±2% de variation
        return base_price * (1 + volatility)
    
    def execute_opportunity(self, opportunity):
        """Exécute un Flash Loan pour exploiter l'opportunité"""
        print(f"\n🚀 Exécution de l'opportunité:")
        print(f"   Paire: {opportunity['token_in']}/{opportunity['token_out']}")
        print(f"   Montant: ${opportunity['amount']}")
        print(f"   Profit estimé: ${opportunity['profit']:.2f}")
        print(f"   Confiance: {opportunity['confidence']}%")
        
        # Encoder les paramètres
        params = self._encode_params(opportunity)
        
        # Préparer la transaction
        token_address = TOKENS[opportunity["token_in"]]
        amount = w3.to_wei(opportunity["amount"], "mwei")  # 6 decimals pour USDC/USDT
        
        # Construire la transaction
        tx = contract.functions.requestFlashLoan(
            token_address,
            amount,
            params
        ).build_transaction({
            "from": account.address,
            "nonce": w3.eth.get_transaction_count(account.address),
            "gas": 500000,
            "gasPrice": w3.eth.gas_price,
        })
        
        # Signer
        signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        
        # Envoyer
        print(f"\n⏳ Envoi de la transaction...")
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        print(f"✅ Transaction envoyée!")
        print(f"   TX Hash: {tx_hash.hex()}")
        print(f"   Explorer: https://polygonscan.com/tx/{tx_hash.hex()}")
        
        # Attendre la confirmation
        print(f"\n⏳ Attente de confirmation...")
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        
        if receipt["status"] == 1:
            print(f"✅ Transaction confirmée!")
            print(f"   Gas utilisé: {receipt['gasUsed']}")
            print(f"   Block: {receipt['blockNumber']}")
            return True
        else:
            print(f"❌ Transaction échouée")
            return False
    
    def _encode_params(self, opportunity):
        """Encode les paramètres pour le smart contract"""
        # Créer les paths
        token_in = TOKENS[opportunity["token_in"]]
        token_out = TOKENS[opportunity["token_out"]]
        weth = TOKENS["WETH"]
        
        path1 = [token_in, weth, token_out]
        path2 = [token_out, weth, token_in]
        
        # DEX IDs (0=Uniswap, 1=Sushiswap)
        dex1 = 0 if opportunity["buy_dex"] == "uniswap" else 1
        dex2 = 1 if opportunity["sell_dex"] == "sushiswap" else 0
        
        min_profit = w3.to_wei(self.min_profit, "mwei")
        
        # Encoder avec ABI
        encoded = w3.codec.encode(
            ["address", "address", "address[]", "address[]", "uint256", "uint8", "uint8"],
            [token_in, token_out, path1, path2, min_profit, dex1, dex2]
        )
        
        return encoded
    
    def get_balance(self, token):
        """Récupère le solde d'un token dans le contrat"""
        token_address = TOKENS[token]
        balance = contract.functions.getBalance(token_address).call()
        # Convertir de wei (6 decimals pour USDC/USDT)
        return balance / 10**6
    
    def withdraw(self, token):
        """Retire les profits d'un token"""
        print(f"\n💰 Retrait de {token}...")
        
        token_address = TOKENS[token]
        
        tx = contract.functions.withdraw(token_address).build_transaction({
            "from": account.address,
            "nonce": w3.eth.get_transaction_count(account.address),
            "gas": 100000,
            "gasPrice": w3.eth.gas_price,
        })
        
        signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        print(f"✅ Retrait envoyé: {tx_hash.hex()}")
        
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt["status"] == 1


def main():
    """Fonction principale"""
    import argparse
    
    parser = argparse.ArgumentParser(description="FlashBot AI Executor")
    parser.add_argument("--scan", action="store_true", help="Scan des opportunités")
    parser.add_argument("--execute", nargs=2, metavar=("TOKEN", "AMOUNT"), help="Exécuter un flash loan")
    parser.add_argument("--balance", nargs=1, metavar="TOKEN", help="Vérifier le solde")
    parser.add_argument("--withdraw", nargs=1, metavar="TOKEN", help="Retirer les profits")
    parser.add_argument("--auto", action="store_true", help="Mode automatique (scan + execute)")
    
    args = parser.parse_args()
    
    # Initialiser l'IA
    ai = FlashBotAI()
    
    # Vérifier la connexion
    if not w3.is_connected():
        print("❌ Impossible de se connecter à Polygon RPC")
        return
    
    print(f"✅ Connecté à Polygon")
    print(f"📍 Wallet: {account.address}")
    print(f"📍 Contract: {CONTRACT_ADDRESS}\n")
    
    if args.scan:
        # Scanner les opportunités
        opportunities = ai.scan_opportunities()
        
        if opportunities:
            print(f"\n✅ {len(opportunities)} opportunités trouvées:\n")
            for i, opp in enumerate(opportunities, 1):
                print(f"{i}. {opp['token_in']}/{opp['token_out']}")
                print(f"   Profit: ${opp['profit']:.2f}")
                print(f"   Différence: {opp['price_diff']:.2f}%")
                print(f"   DEX: {opp['buy_dex']} → {opp['sell_dex']}")
                print(f"   Confiance: {opp['confidence']}%\n")
        else:
            print("ℹ️  Aucune opportunité trouvée pour le moment")
    
    elif args.execute:
        token, amount = args.execute
        
        # Créer une opportunité manuelle
        opportunity = {
            "token_in": token,
            "token_out": "WETH",
            "buy_dex": "uniswap",
            "sell_dex": "sushiswap",
            "price_diff": 1.5,
            "profit": float(amount) * 0.01,
            "amount": float(amount),
            "confidence": 90,
        }
        
        success = ai.execute_opportunity(opportunity)
        
        if success:
            print(f"\n🎉 Flash Loan exécuté avec succès!")
        else:
            print(f"\n❌ Échec de l'exécution")
    
    elif args.balance:
        token = args.balance[0]
        balance = ai.get_balance(token)
        print(f"💰 Solde {token}: {balance:.2f}")
    
    elif args.withdraw:
        token = args.withdraw[0]
        success = ai.withdraw(token)
        if success:
            print(f"✅ Retrait de {token} réussi!")
    
    elif args.auto:
        print("🤖 Mode automatique activé")
        print("⏰ Scan toutes les 30 secondes...\n")
        
        while True:
            opportunities = ai.scan_opportunities()
            
            if opportunities:
                # Prendre la meilleure opportunité
                best = opportunities[0]
                
                if best["confidence"] >= 90:
                    print(f"\n🎯 Opportunité détectée avec haute confiance!")
                    ai.execute_opportunity(best)
            
            # Attendre 30 secondes
            time.sleep(30)
    
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
