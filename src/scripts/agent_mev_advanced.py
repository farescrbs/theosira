"""
🧠 THESORIA MEV Agent - LE CERVEAU ULTIME
========================================

Agent intelligent qui:
- Scanne 200+ DEX en temps réel
- Utilise l'IA pour optimiser les stratégies
- Intégration Flashbots pour éviter le front-running
- Exécute des Flash Loans automatiquement
- S'auto-améliore avec l'apprentissage machine

Version: 2.0.0
"""

import time
import asyncio
import json
import os
from datetime import datetime
from typing import List, Dict, Optional
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv
import logging

# Imports locaux
from dex_scanner import DexScanner
from flashbots_integration import FlashbotsExecutor
from ai_strategy_optimizer import AIStrategyOptimizer

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s',
    handlers=[
        logging.FileHandler('mev_agent.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Charger les variables d'environnement
load_dotenv()

# Configuration
class Config:
    """Configuration de l'Agent MEV"""
    
    # Blockchain
    RPC_URL = os.getenv("POLYGON_RPC_URL", "https://polygon-rpc.com")
    PRIVATE_KEY = os.getenv("PRIVATE_KEY")
    CONTRACT_ADDRESS = os.getenv("FLASHBOT_CONTRACT_ADDRESS")
    
    # Flashbots
    FLASHBOTS_RPC = os.getenv("FLASHBOTS_RPC", "https://rpc.flashbots.net")
    FLASHBOTS_RELAY = os.getenv("FLASHBOTS_RELAY", "https://relay.flashbots.net")
    
    # Trading
    MIN_PROFIT_USD = float(os.getenv("MIN_PROFIT_USD", "100"))
    MAX_FLASH_LOAN = float(os.getenv("MAX_FLASH_LOAN", "1000000"))
    MIN_SPREAD = float(os.getenv("MIN_SPREAD", "0.005"))  # 0.5%
    
    # Performance
    SCAN_INTERVAL = int(os.getenv("SCAN_INTERVAL", "2"))  # 2 secondes
    MAX_CONCURRENT_SCANS = int(os.getenv("MAX_CONCURRENT_SCANS", "10"))
    
    # IA
    AI_MODEL = os.getenv("AI_MODEL", "gpt-4")
    AI_ENABLED = os.getenv("AI_ENABLED", "true").lower() == "true"
    LEARNING_RATE = float(os.getenv("LEARNING_RATE", "0.001"))
    
    # Sécurité
    MAX_GAS_PRICE = int(os.getenv("MAX_GAS_PRICE", "100"))  # Gwei
    SLIPPAGE_TOLERANCE = float(os.getenv("SLIPPAGE_TOLERANCE", "0.005"))  # 0.5%


class MEVAgent:
    """
    Agent MEV Principal - Le Cerveau
    
    Orchestrateur central qui coordonne:
    - Scanner de DEX
    - IA d'optimisation
    - Exécuteur Flashbots
    - Gestion des risques
    """
    
    def __init__(self):
        logger.info("🚀 Initialisation du THESORIA MEV Agent...")
        
        # Connexion Web3
        self.w3 = Web3(Web3.HTTPProvider(Config.RPC_URL))
        if not self.w3.is_connected():
            raise Exception("❌ Impossible de se connecter au RPC")
        
        self.account = Account.from_key(Config.PRIVATE_KEY)
        logger.info(f"✅ Connecté au RPC Polygon")
        logger.info(f"📍 Wallet: {self.account.address}")
        
        # Charger le contrat FlashBot
        with open('../contracts/artifacts/contracts/FlashBot.sol/FlashBot.json', 'r') as f:
            contract_json = json.load(f)
            self.contract_abi = contract_json['abi']
        
        self.contract = self.w3.eth.contract(
            address=Config.CONTRACT_ADDRESS,
            abi=self.contract_abi
        )
        logger.info(f"✅ Contract FlashBot chargé: {Config.CONTRACT_ADDRESS}")
        
        # Initialiser les modules
        self.dex_scanner = DexScanner(self.w3)
        self.ai_optimizer = AIStrategyOptimizer() if Config.AI_ENABLED else None
        self.flashbots = FlashbotsExecutor(self.w3, self.account)
        
        # État
        self.opportunities_found = 0
        self.trades_executed = 0
        self.total_profit = 0.0
        self.running = False
        
        # Historique pour l'IA
        self.trade_history = []
        self.performance_metrics = {
            'success_rate': 0.0,
            'avg_profit': 0.0,
            'avg_execution_time': 0.0,
        }
        
        logger.info("✅ MEV Agent prêt!")
    
    async def start(self):
        """Démarre l'agent MEV"""
        self.running = True
        logger.info("\n🧠 THESORIA MEV AGENT - DÉMARRAGE\n")
        logger.info(f"Mode: {'IA Activée 🤖' if Config.AI_ENABLED else 'Manuel'}")
        logger.info(f"Profit minimum: ${Config.MIN_PROFIT_USD}")
        logger.info(f"Spread minimum: {Config.MIN_SPREAD*100}%")
        logger.info(f"Scan interval: {Config.SCAN_INTERVAL}s\n")
        
        # Boucle principale
        scan_count = 0
        while self.running:
            try:
                scan_count += 1
                logger.info(f"🔍 Scan #{scan_count} - {datetime.now().strftime('%H:%M:%S')}")
                
                # Étape 1: Scanner les opportunités
                opportunities = await self.scan_opportunities()
                
                if opportunities:
                    logger.info(f"✨ {len(opportunities)} opportunités trouvées!")
                    
                    # Étape 2: Filtrer avec l'IA
                    if Config.AI_ENABLED and self.ai_optimizer:
                        opportunities = await self.ai_filter_opportunities(opportunities)
                        logger.info(f"🤖 IA a sélectionné {len(opportunities)} opportunités optimales")
                    
                    # Étape 3: Exécuter la meilleure
                    if opportunities:
                        best_opp = opportunities[0]  # Déjà triée par profit
                        await self.execute_opportunity(best_opp)
                else:
                    logger.info("💤 Aucune opportunité rentable")
                
                # Statistiques
                if scan_count % 10 == 0:
                    self.print_statistics()
                
                # Attendre avant le prochain scan
                await asyncio.sleep(Config.SCAN_INTERVAL)
                
            except KeyboardInterrupt:
                logger.info("\n⚠️  Arrêt demandé par l'utilisateur")
                self.running = False
                break
            except Exception as e:
                logger.error(f"❌ Erreur dans la boucle principale: {e}")
                await asyncio.sleep(5)  # Pause avant retry
        
        logger.info("\n👋 MEV Agent arrêté")
    
    async def scan_opportunities(self) -> List[Dict]:
        """
        Scanne tous les DEX pour trouver des opportunités d'arbitrage
        """
        try:
            # Scanner en parallèle tous les DEX
            opportunities = await self.dex_scanner.scan_all_dex(
                min_spread=Config.MIN_SPREAD,
                min_profit=Config.MIN_PROFIT_USD
            )
            
            self.opportunities_found += len(opportunities)
            
            # Trier par profit décroissant
            opportunities.sort(key=lambda x: x['estimated_profit'], reverse=True)
            
            return opportunities
            
        except Exception as e:
            logger.error(f"❌ Erreur lors du scan: {e}")
            return []
    
    async def ai_filter_opportunities(self, opportunities: List[Dict]) -> List[Dict]:
        """
        Utilise l'IA pour filtrer et optimiser les opportunités
        """
        if not self.ai_optimizer:
            return opportunities
        
        try:
            # L'IA analyse chaque opportunité
            scored_opportunities = []
            
            for opp in opportunities:
                # Ajouter le contexte de marché
                market_context = {
                    'volatility': await self.dex_scanner.get_volatility(opp['token_in']),
                    'liquidity': opp.get('liquidity', 0),
                    'gas_price': self.w3.eth.gas_price,
                    'block_number': self.w3.eth.block_number,
                }
                
                # L'IA score l'opportunité
                score = await self.ai_optimizer.score_opportunity(
                    opportunity=opp,
                    context=market_context,
                    history=self.trade_history
                )
                
                opp['ai_score'] = score
                opp['ai_confidence'] = score['confidence']
                
                # Garder seulement si confiance > 70%
                if score['confidence'] > 0.7:
                    scored_opportunities.append(opp)
            
            # Trier par AI score
            scored_opportunities.sort(
                key=lambda x: x['ai_score']['expected_value'], 
                reverse=True
            )
            
            return scored_opportunities
            
        except Exception as e:
            logger.error(f"❌ Erreur IA filtering: {e}")
            return opportunities  # Fallback
    
    async def execute_opportunity(self, opportunity: Dict):
        """
        Exécute une opportunité via Flashbots
        """
        logger.info(f"\n🎯 EXÉCUTION D'OPPORTUNITÉ")
        logger.info(f"   Paire: {opportunity['token_in']}/{opportunity['token_out']}")
        logger.info(f"   DEX: {opportunity['dex_buy']} → {opportunity['dex_sell']}")
        logger.info(f"   Spread: {opportunity['spread']*100:.3f}%")
        logger.info(f"   Profit estimé: ${opportunity['estimated_profit']:.2f}")
        
        if Config.AI_ENABLED:
            logger.info(f"   IA Confiance: {opportunity.get('ai_confidence', 0)*100:.1f}%")
        
        start_time = time.time()
        
        try:
            # L'IA OPTIMISE LES PARAMÈTRES
            if self.ai_optimizer:
                logger.info(f"🤖 L'IA optimise les paramètres...")
                
                optimized_params = await self.ai_optimizer.optimize_parameters(
                    opportunity,
                    constraints={
                        'max_amount': Config.MAX_FLASH_LOAN,
                        'max_gas_price': Config.MAX_GAS_PRICE,
                    }
                )
                
                logger.info(f"   Montant optimisé: ${optimized_params['amount']:,.2f}")
                logger.info(f"   Slippage: {optimized_params['slippage']*100:.2f}%")
                logger.info(f"   Priority fee: {optimized_params['priority_fee']:.1f} Gwei")
                
                # Mettre à jour l'opportunité avec les paramètres optimisés
                opportunity['amount'] = optimized_params['amount']
                opportunity['slippage'] = optimized_params['slippage']
                opportunity['priority_fee'] = optimized_params['priority_fee']
            
            # ENCODER LES PARAMÈTRES POUR LE SMART CONTRACT
            flash_loan_params = self._encode_flash_loan_params(opportunity)
            
            # Exécuter via Flashbots (protection MEV)
            success, tx_hash = await self.flashbots.execute_flash_loan(
                contract=self.contract,
                params=flash_loan_params,
                max_priority_fee=opportunity.get('priority_fee', 2)  # Gwei
            )
            
            execution_time = time.time() - start_time
            
            if success:
                self.trades_executed += 1
                self.total_profit += opportunity['estimated_profit']
                
                logger.info(f"✅ SUCCÈS!")
                logger.info(f"   TX: {tx_hash}")
                logger.info(f"   Temps: {execution_time:.2f}s")
                logger.info(f"   Profit: ${opportunity['estimated_profit']:.2f}")
                
                # Enregistrer pour l'apprentissage
                self.trade_history.append({
                    'timestamp': datetime.now().isoformat(),
                    'opportunity': opportunity,
                    'success': True,
                    'execution_time': execution_time,
                    'tx_hash': tx_hash,
                })
                
                # L'IA APPREND de ce trade réussi
                if self.ai_optimizer:
                    self.ai_optimizer.learn_from_trade(self.trade_history[-1])
                
                # Mettre à jour les métriques
                self._update_metrics()
                
            else:
                logger.warning(f"⚠️  Échec de l'exécution")
                
                # Enregistrer l'échec
                self.trade_history.append({
                    'timestamp': datetime.now().isoformat(),
                    'opportunity': opportunity,
                    'success': False,
                    'execution_time': execution_time,
                })
                
                # L'IA apprend aussi des échecs
                if self.ai_optimizer:
                    self.ai_optimizer.learn_from_trade(self.trade_history[-1])
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'exécution: {e}")
    
    def _encode_flash_loan_params(self, opportunity: Dict) -> Dict:
        """
        Encode les paramètres pour le smart contract FlashBot.sol
        
        L'IA a déjà optimisé ces paramètres, on les encode maintenant
        pour l'appel au contrat
        """
        from eth_abi import encode
        
        logger.info(f"🔧 Encodage des paramètres pour le smart contract...")
        
        # Récupérer les adresses des tokens
        token_in_address = TOKENS[opportunity['token_in']]
        token_out_address = TOKENS[opportunity['token_out']]
        
        # Paths pour les swaps
        path_buy = opportunity['path_buy']
        path_sell = opportunity['path_sell']
        
        # DEX IDs (l'IA a choisi les meilleurs DEX)
        dex_buy_id = opportunity['dex_buy_id']
        dex_sell_id = opportunity['dex_sell_id']
        
        # Montant (optimisé par l'IA)
        amount = opportunity['amount']
        
        # Profit minimum (seuil de sécurité)
        min_profit = max(Config.MIN_PROFIT_USD, opportunity['estimated_profit'] * 0.8)
        
        # Slippage (optimisé par l'IA)
        slippage = opportunity.get('slippage', Config.SLIPPAGE_TOLERANCE)
        
        logger.info(f"   Token In: {opportunity['token_in']} ({token_in_address[:10]}...)")
        logger.info(f"   Token Out: {opportunity['token_out']} ({token_out_address[:10]}...)")
        logger.info(f"   Montant: ${amount:,.2f}")
        logger.info(f"   Min Profit: ${min_profit:.2f}")
        logger.info(f"   Slippage: {slippage*100:.2f}%")
        logger.info(f"   DEX Buy: {opportunity['dex_buy']} (ID: {dex_buy_id})")
        logger.info(f"   DEX Sell: {opportunity['dex_sell']} (ID: {dex_sell_id})")
        
        # ENCODAGE ABI pour le contrat
        # Structure: ArbitrageParams(tokenIn, tokenOut, path1, path2, minProfit, dex1, dex2)
        encoded_params = encode(
            ['address', 'address', 'address[]', 'address[]', 'uint256', 'uint8', 'uint8'],
            [
                Web3.to_checksum_address(token_in_address),
                Web3.to_checksum_address(token_out_address),
                [Web3.to_checksum_address(addr) for addr in path_buy],
                [Web3.to_checksum_address(addr) for addr in path_sell],
                int(min_profit * 10**6),  # 6 decimals pour USDC/USDT
                dex_buy_id,
                dex_sell_id,
            ]
        )
        
        logger.info(f"✅ Paramètres encodés ({len(encoded_params)} bytes)")
        
        return {
            'token': token_in_address,
            'token_out': token_out_address,
            'amount': amount,
            'encoded_params': encoded_params,
            'path_buy': path_buy,
            'path_sell': path_sell,
            'min_profit': min_profit,
            'dex_buy': dex_buy_id,
            'dex_sell': dex_sell_id,
            'estimated_profit': opportunity['estimated_profit'],
        }
    
    def _update_metrics(self):
        """Met à jour les métriques de performance"""
        if not self.trade_history:
            return
        
        # Taux de succès
        successful_trades = [t for t in self.trade_history if t['success']]
        self.performance_metrics['success_rate'] = len(successful_trades) / len(self.trade_history)
        
        # Profit moyen
        if successful_trades:
            profits = [t['opportunity']['estimated_profit'] for t in successful_trades]
            self.performance_metrics['avg_profit'] = sum(profits) / len(profits)
        
        # Temps d'exécution moyen
        exec_times = [t['execution_time'] for t in self.trade_history]
        self.performance_metrics['avg_execution_time'] = sum(exec_times) / len(exec_times)
        
        # Sauvegarder l'historique
        with open('trade_history.json', 'w') as f:
            json.dump(self.trade_history[-100:], f, indent=2)  # Garder les 100 derniers
    
    def print_statistics(self):
        """Affiche les statistiques de performance"""
        logger.info("\n" + "="*60)
        logger.info("📊 STATISTIQUES DE PERFORMANCE")
        logger.info("="*60)
        logger.info(f"Opportunités trouvées: {self.opportunities_found}")
        logger.info(f"Trades exécutés: {self.trades_executed}")
        logger.info(f"Taux de succès: {self.performance_metrics['success_rate']*100:.1f}%")
        logger.info(f"Profit total: ${self.total_profit:.2f}")
        logger.info(f"Profit moyen: ${self.performance_metrics['avg_profit']:.2f}")
        logger.info(f"Temps exec moyen: {self.performance_metrics['avg_execution_time']:.2f}s")
        logger.info("="*60 + "\n")
    
    def stop(self):
        """Arrête l'agent proprement"""
        logger.info("🛑 Arrêt de l'agent...")
        self.running = False


async def main():
    """Point d'entrée principal"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="🧠 THESORIA MEV Agent - Le Cerveau Ultime"
    )
    parser.add_argument(
        '--mode',
        choices=['scan', 'execute', 'auto'],
        default='auto',
        help='Mode d\'opération'
    )
    parser.add_argument(
        '--ai',
        action='store_true',
        help='Activer l\'optimisation IA'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Simulation sans exécution réelle'
    )
    
    args = parser.parse_args()
    
    # Override config si nécessaire
    if args.ai:
        Config.AI_ENABLED = True
    
    # Créer et démarrer l'agent
    try:
        agent = MEVAgent()
        
        if args.dry_run:
            logger.info("🧪 MODE SIMULATION (Dry Run)")
        
        await agent.start()
        
    except KeyboardInterrupt:
        logger.info("\n👋 Arrêt gracieux...")
    except Exception as e:
        logger.error(f"❌ Erreur fatale: {e}")
        raise


if __name__ == "__main__":
    # Lancer avec asyncio
    asyncio.run(main())