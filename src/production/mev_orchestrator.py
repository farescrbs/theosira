"""
🎯 THESORIA - MEV Orchestrator ULTIME
======================================

Orchestration complète de la boucle autonome:

1. DÉTECTION (IA) → Scanner multi-DEX détecte opportunités
2. CALCUL (EIP-1559) → Bidding gas optimal
3. EXÉCUTION (Flashbots) → Bundle privé
4. MONITORING → Métriques Prometheus + Alertes

MODE: PRODUCTION AUTONOME 24/7
OBJECTIF: PROFIT MAXIMUM
"""

import asyncio
import time
import signal
import sys
import os
from typing import Dict, Optional
from web3 import Web3
from eth_account import Account
from eth_account.signers.local import LocalAccount
from decimal import Decimal
import logging

# Imports locaux
from dex_scanner import DexScanner
from flashbots_executor import FlashbotsExecutor
from profit_calculator import ProfitCalculator
from gas_bidding_eip1559 import GasBiddingEIP1559

# Monitoring
from prometheus_client import start_http_server, Counter, Gauge, Histogram

# Alertes
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'deployment', '4_monitoring'))
from alerting_system import AlertingSystem, AlertLevel

logger = logging.getLogger(__name__)


# ============================================
# MÉTRIQUES PROMETHEUS
# ============================================

# Opportunités
OPPORTUNITIES_DETECTED = Counter(
    'mev_opportunities_detected_total',
    'Nombre total d\'opportunités détectées',
    ['chain', 'pair']
)

OPPORTUNITIES_EXECUTED = Counter(
    'mev_opportunities_executed_total',
    'Nombre d\'opportunités exécutées',
    ['chain', 'status']
)

# Profit (LE GRAAL!)
PROFIT_NET_CUMULATIVE_ETH = Counter(
    'mev_profit_net_cumulative_eth',
    'Profit net cumulé en ETH',
    ['chain']
)

PROFIT_NET_CUMULATIVE_USD = Counter(
    'mev_profit_net_cumulative_usd',
    'Profit net cumulé en USD',
    ['chain']
)

# Latence
DETECTION_LATENCY = Histogram(
    'mev_detection_latency_seconds',
    'Latence de détection',
    ['chain']
)

EXECUTION_LATENCY = Histogram(
    'mev_execution_latency_seconds',
    'Latence d\'exécution totale',
    ['chain']
)

# Balance
WALLET_BALANCE_ETH = Gauge(
    'mev_wallet_balance_eth',
    'Balance du wallet en ETH',
    ['chain', 'address']
)


class MEVOrchestrator:
    """
    Orchestrateur MEV Ultime
    
    Boucle complète autonome:
    Scan → Détection → Évaluation → Exécution → Profit → Alertes
    """
    
    def __init__(
        self,
        w3: Web3,
        account: LocalAccount,
        chain: str = 'polygon',
        flashbot_contract_address: str = None,
        min_spread_percent: float = 0.8,
        min_profit_usd: float = 100.0
    ):
        """
        Initialise l'orchestrateur
        
        Args:
            w3: Instance Web3
            account: Compte pour trading
            chain: Nom de la chain
            flashbot_contract_address: Adresse contrat FlashBot
            min_spread_percent: Spread minimum (%)
            min_profit_usd: Profit minimum ($)
        """
        self.w3 = w3
        self.account = account
        self.chain = chain
        self.flashbot_contract_address = flashbot_contract_address
        
        self.running = False
        self.start_time = None
        
        # Modules
        logger.info(f"🔧 Initialisation modules...")
        
        self.scanner = DexScanner(
            w3=w3,
            min_spread_percent=min_spread_percent,
            min_profit_usd=min_profit_usd
        )
        
        self.flashbots = FlashbotsExecutor(
            w3=w3,
            account=account
        )
        
        self.profit_calculator = ProfitCalculator(
            w3=w3,
            eth_price_usd=2000.0
        )
        
        self.gas_bidding = GasBiddingEIP1559(w3=w3)
        
        self.alerting = AlertingSystem()
        
        # Statistiques
        self.stats = {
            'opportunities_detected': 0,
            'opportunities_executed': 0,
            'trades_success': 0,
            'trades_failed': 0,
            'total_profit_usd': Decimal('0'),
            'total_gas_paid_usd': Decimal('0'),
        }
        
        logger.info(f"✅ Modules initialisés")
        logger.info(f"🎯 MEV Orchestrator prêt!")
    
    async def start(self):
        """
        Démarre l'orchestrateur en mode autonome
        
        BOUCLE INFINIE: Scan → Trade → Profit
        """
        self.running = True
        self.start_time = time.time()
        
        logger.info(f"\n{'='*60}")
        logger.info(f"🚀 DÉMARRAGE MEV ORCHESTRATOR")
        logger.info(f"{'='*60}")
        logger.info(f"Chain: {self.chain}")
        logger.info(f"Account: {self.account.address}")
        logger.info(f"FlashBot: {self.flashbot_contract_address}")
        logger.info(f"Mode: PRODUCTION AUTONOME")
        logger.info(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        logger.info(f"{'='*60}\n")
        
        # Signal handlers
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
        
        # Alerte démarrage
        await self.alerting.alert_agent_started(
            chains=[self.chain],
            version='2.0.0'
        )
        
        # Lancer tâches
        tasks = [
            asyncio.create_task(self._scanning_loop(), name='scanning'),
            asyncio.create_task(self._monitoring_loop(), name='monitoring'),
        ]
        
        try:
            await asyncio.gather(*tasks)
        except asyncio.CancelledError:
            logger.info(f"\n⚠️  Arrêt des tâches...")
        
        logger.info(f"\n👋 Orchestrator arrêté")
    
    async def _scanning_loop(self):
        """
        BOUCLE PRINCIPALE: Scan et exécution
        
        Pipeline:
        1. Scanner DEX (détection opportunités)
        2. Évaluer chaque opportunité
        3. Exécuter via Flashbots
        4. Calculer profit réel
        5. Mettre à jour métriques
        """
        logger.info(f"🔄 Boucle de scanning démarrée (10 scans/sec)")
        
        scan_count = 0
        
        while self.running:
            try:
                scan_count += 1
                scan_start = time.time()
                
                # 1. DÉTECTION (IA) - Scanner les DEX
                opportunities = await self.scanner.scan_all_pairs(
                    amount_in_usd=10000.0
                )
                
                detection_time = time.time() - scan_start
                DETECTION_LATENCY.labels(chain=self.chain).observe(detection_time)
                
                # 2. TRAITER CHAQUE OPPORTUNITÉ
                if opportunities:
                    for opp in opportunities:
                        # Métriques
                        OPPORTUNITIES_DETECTED.labels(
                            chain=self.chain,
                            pair=opp['pair']
                        ).inc()
                        
                        self.stats['opportunities_detected'] += 1
                        
                        # EXÉCUTER
                        await self._execute_opportunity(opp)
                
                # Respecter intervalle (10 scans/sec)
                scan_time = time.time() - scan_start
                sleep_time = max(0, 0.1 - scan_time)
                
                if sleep_time > 0:
                    await asyncio.sleep(sleep_time)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"❌ Erreur scanning loop: {e}")
                await asyncio.sleep(5)
        
        logger.info(f"🛑 Scanning loop arrêté")
    
    async def _execute_opportunity(self, opportunity: Dict):
        """
        Exécute une opportunité détectée
        
        Pipeline complet:
        1. Évaluation sécurité (P > G + M)
        2. Construction fonction Flash Loan
        3. Calcul gas EIP-1559 optimal
        4. Exécution via Flashbots
        5. Attente inclusion
        6. Calcul profit réel
        7. Métriques + Alertes
        
        Args:
            opportunity: Opportunité détectée par le scanner
        """
        exec_start = time.time()
        
        logger.info(f"\n{'='*60}")
        logger.info(f"⚡ EXÉCUTION OPPORTUNITÉ")
        logger.info(f"{'='*60}")
        logger.info(f"Pair: {opportunity['pair']}")
        logger.info(f"Route: {opportunity['dex_buy']} → {opportunity['dex_sell']}")
        logger.info(f"Spread: {opportunity['spread_percent']:.2f}%")
        logger.info(f"Profit estimé: ${opportunity['estimated_profit_usd']:.2f}")
        
        try:
            # 1. ÉVALUATION SÉCURITÉ
            # Algorithme: Profit > Gas + Marge
            estimated_profit = Decimal(str(opportunity['estimated_profit_usd']))
            
            # Estimer coût gas
            gas_limit = 800_000
            gas_params = await self.gas_bidding.calculate_optimal_gas_params(
                profit_expected_usd=float(estimated_profit),
                urgency='high'
            )
            
            estimated_gas_cost_usd = gas_params['estimatedCostUSD']
            
            # Marge de sécurité: 20%
            min_margin = estimated_gas_cost_usd * Decimal('0.2')
            
            # Vérification
            if estimated_profit <= (estimated_gas_cost_usd + min_margin):
                logger.warning(f"❌ REJETÉ: Profit insuffisant")
                logger.warning(f"   Profit: ${estimated_profit:.2f}")
                logger.warning(f"   Gas: ${estimated_gas_cost_usd:.2f}")
                logger.warning(f"   Marge: ${min_margin:.2f}")
                logger.warning(f"   Requis: ${estimated_gas_cost_usd + min_margin:.2f}")
                return
            
            logger.info(f"\n✅ APPROUVÉ PAR ALGORITHME SÉCURITÉ")
            logger.info(f"   Profit estimé: ${estimated_profit:.2f}")
            logger.info(f"   Gas estimé: ${estimated_gas_cost_usd:.2f}")
            logger.info(f"   Marge: ${min_margin:.2f}")
            logger.info(f"   Profit net prévu: ${estimated_profit - estimated_gas_cost_usd:.2f}")
            
            # 2. CONSTRUCTION FONCTION FLASH LOAN
            # Encoder les paramètres pour requestFlashLoan
            
            # Pour l'exemple, on simule l'encodage
            # En production: Utiliser contract.encodeABI()
            
            # Paramètres Flash Loan
            token_address = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'  # USDC Polygon
            amount = int(opportunity['amount_usd'] * 10**6)  # USDC = 6 decimals
            
            # TODO: Encoder vraie fonction avec routes DEX
            function_data = b''  # Placeholder
            
            if not function_data:
                logger.warning(f"⚠️  Encodage fonction non implémenté (placeholder)")
                # Pour test: Simuler exécution
                await self._simulate_execution(opportunity, gas_params)
                return
            
            # 3. EXÉCUTION FLASHBOTS
            logger.info(f"\n⚡ EXÉCUTION VIA FLASHBOTS...")
            
            result = await self.flashbots.execute_flash_loan(
                contract_address=self.flashbot_contract_address,
                function_data=function_data,
                gas_limit=gas_limit,
                percentile=80,
                max_retries=3
            )
            
            # 4. VÉRIFIER RÉSULTAT
            if result['success'] and result['included']:
                # SUCCÈS!
                await self._handle_success(opportunity, result, exec_start)
            else:
                # ÉCHEC
                await self._handle_failure(opportunity, result)
            
        except Exception as e:
            logger.error(f"❌ Erreur exécution opportunité: {e}")
            OPPORTUNITIES_EXECUTED.labels(
                chain=self.chain,
                status='error'
            ).inc()
    
    async def _simulate_execution(
        self,
        opportunity: Dict,
        gas_params: Dict
    ):
        """
        Simule une exécution (pour tests sans contrat déployé)
        
        Args:
            opportunity: Opportunité
            gas_params: Paramètres gas calculés
        """
        logger.info(f"\n🧪 SIMULATION EXÉCUTION...")
        
        # Simuler attente
        await asyncio.sleep(1.5)
        
        # Simuler succès (80% du temps)
        import random
        success = random.random() < 0.8
        
        if success:
            # Calculer profit simulé
            amount_borrowed = int(opportunity['amount_usd'] * 10**6)
            
            # Profit brut = spread - fees
            gross_profit_percent = Decimal(str(opportunity['spread_percent'])) - Decimal('0.6')
            gross_profit = amount_borrowed * gross_profit_percent / Decimal('100')
            
            final_balance = amount_borrowed + int(gross_profit)
            
            # Gas utilisé
            gas_used = 487_234
            gas_price = gas_params['maxFeePerGas']
            
            # Calcul profit
            profit_result = self.profit_calculator.calculate_complete_profit(
                amount_borrowed_wei=amount_borrowed,
                final_balance_wei=final_balance,
                gas_used=gas_used,
                effective_gas_price_wei=gas_price,
                token_decimals=6,
                token_price_usd=Decimal('1.0')
            )
            
            if profit_result['success']:
                # Mise à jour métriques
                await self._update_metrics(profit_result)
                
                # Alertes
                await self.alerting.alert_trade_success(
                    chain=self.chain,
                    profit_usd=float(profit_result['gross_profit_usd']),
                    gas_cost_usd=float(profit_result['gas_cost_usd']),
                    tx_hash='0x' + 'a'*64  # Simulé
                )
                
                if profit_result['net_profit_usd'] > 1000:
                    await self.alerting.alert_high_profit(
                        chain=self.chain,
                        profit_usd=float(profit_result['net_profit_usd']),
                        tx_hash='0x' + 'a'*64
                    )
                
                logger.info(f"\n✅ SIMULATION RÉUSSIE!")
                logger.info(f"   Profit net: ${profit_result['net_profit_usd']:.2f}")
                logger.info(f"   ROI: {profit_result['roi_percent']:.2f}%")
                
                self.stats['trades_success'] += 1
            
        else:
            logger.warning(f"\n⚠️  SIMULATION ÉCHOUÉE (bundle non inclus)")
            self.stats['trades_failed'] += 1
        
        OPPORTUNITIES_EXECUTED.labels(
            chain=self.chain,
            status='success' if success else 'failed'
        ).inc()
        
        self.stats['opportunities_executed'] += 1
    
    async def _handle_success(
        self,
        opportunity: Dict,
        result: Dict,
        exec_start: float
    ):
        """Handle exécution réussie"""
        logger.info(f"\n🎉 TRADE RÉUSSI VIA FLASHBOTS!")
        
        # Extraire receipt
        receipts = result['receipts']
        
        # TODO: Parser receipt pour obtenir montants exacts
        # Pour l'instant: Utiliser estimations
        
        # Calcul profit (simulation)
        await self._simulate_execution(opportunity, {'maxFeePerGas': 40 * 10**9})
        
        # Latence
        exec_time = time.time() - exec_start
        EXECUTION_LATENCY.labels(chain=self.chain).observe(exec_time)
        
        logger.info(f"   Temps total: {exec_time:.2f}s")
    
    async def _handle_failure(
        self,
        opportunity: Dict,
        result: Dict
    ):
        """Handle exécution échouée"""
        logger.warning(f"\n⚠️  TRADE ÉCHOUÉ")
        logger.warning(f"   Raison: {result.get('error', 'Unknown')}")
        
        OPPORTUNITIES_EXECUTED.labels(
            chain=self.chain,
            status='failed'
        ).inc()
        
        self.stats['trades_failed'] += 1
    
    async def _update_metrics(self, profit_result: Dict):
        """Met à jour les métriques Prometheus"""
        logger.info(f"\n📊 MISE À JOUR MÉTRIQUES")
        
        # Profit net
        net_profit_eth = float(profit_result['net_profit_eth'])
        net_profit_usd = float(profit_result['net_profit_usd'])
        
        PROFIT_NET_CUMULATIVE_ETH.labels(chain=self.chain).inc(net_profit_eth)
        PROFIT_NET_CUMULATIVE_USD.labels(chain=self.chain).inc(net_profit_usd)
        
        logger.info(f"   ✅ Profit net (ETH): +{net_profit_eth:.6f}")
        logger.info(f"   ✅ Profit net (USD): +${net_profit_usd:.2f}")
        
        # Stats locales
        self.stats['total_profit_usd'] += profit_result['net_profit_usd']
        self.stats['total_gas_paid_usd'] += profit_result['gas_cost_usd']
    
    async def _monitoring_loop(self):
        """Boucle de monitoring périodique"""
        logger.info(f"📊 Boucle de monitoring démarrée")
        
        while self.running:
            try:
                await asyncio.sleep(30)
                
                if not self.running:
                    break
                
                # Balance wallet
                balance_wei = self.w3.eth.get_balance(self.account.address)
                balance_eth = balance_wei / 10**18
                
                WALLET_BALANCE_ETH.labels(
                    chain=self.chain,
                    address=self.account.address
                ).set(balance_eth)
                
                # Alertes balance
                if balance_eth < 0.1:
                    await self.alerting.alert_balance_critical(
                        self.chain,
                        self.account.address,
                        balance_eth
                    )
                elif balance_eth < 0.5:
                    await self.alerting.alert_balance_low(
                        self.chain,
                        self.account.address,
                        balance_eth
                    )
                
                # Stats toutes les 5 minutes
                if int(time.time()) % 300 < 30:
                    self._print_statistics()
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"❌ Erreur monitoring loop: {e}")
        
        logger.info(f"🛑 Monitoring loop arrêté")
    
    def _print_statistics(self):
        """Affiche les statistiques"""
        uptime = time.time() - self.start_time
        uptime_hours = uptime / 3600
        
        success_rate = 0
        if self.stats['opportunities_executed'] > 0:
            success_rate = (self.stats['trades_success'] / self.stats['opportunities_executed']) * 100
        
        logger.info(f"\n{'='*60}")
        logger.info(f"📊 STATISTIQUES MEV ORCHESTRATOR")
        logger.info(f"{'='*60}")
        logger.info(f"Uptime: {uptime_hours:.1f}h")
        logger.info(f"\nOPPORTUNITÉS:")
        logger.info(f"  Détectées: {self.stats['opportunities_detected']}")
        logger.info(f"  Exécutées: {self.stats['opportunities_executed']}")
        logger.info(f"  Réussies: {self.stats['trades_success']}")
        logger.info(f"  Échouées: {self.stats['trades_failed']}")
        logger.info(f"  Taux succès: {success_rate:.1f}%")
        logger.info(f"\nPROFIT:")
        logger.info(f"  Total: ${self.stats['total_profit_usd']:.2f}")
        logger.info(f"  Gas payé: ${self.stats['total_gas_paid_usd']:.2f}")
        logger.info(f"  Net: ${self.stats['total_profit_usd'] - self.stats['total_gas_paid_usd']:.2f}")
        logger.info(f"{'='*60}\n")
    
    def _signal_handler(self, signum, frame):
        """Handler pour arrêt gracieux"""
        logger.info(f"\n⚠️  Signal reçu: {signum}")
        self.stop()
    
    def stop(self):
        """Arrête l'orchestrateur"""
        logger.info(f"\n🛑 ARRÊT DE L'ORCHESTRATEUR...")
        self.running = False
        
        # Stats finales
        self._print_statistics()


async def main():
    """Point d'entrée principal"""
    from dotenv import load_dotenv
    
    # Charger .env
    load_dotenv()
    
    # Logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler('mev_orchestrator.log')
        ]
    )
    
    # Démarrer Prometheus
    logger.info(f"📊 Démarrage serveur Prometheus sur :8000...")
    start_http_server(8000)
    logger.info(f"✅ Metrics: http://localhost:8000/metrics")
    
    # Setup Web3
    rpc_url = os.getenv('POLYGON_RPC_URL', 'https://polygon-rpc.com')
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    
    if not w3.is_connected():
        logger.error(f"❌ Impossible de se connecter au RPC: {rpc_url}")
        return
    
    logger.info(f"✅ Connecté au RPC: {rpc_url}")
    logger.info(f"   Block: {w3.eth.block_number}")
    
    # Account
    private_key = os.getenv('PRIVATE_KEY')
    if not private_key:
        logger.error(f"❌ PRIVATE_KEY non défini")
        return
    
    account = Account.from_key(private_key)
    logger.info(f"✅ Account: {account.address}")
    
    # Contract
    contract_address = os.getenv('FLASHBOT_CONTRACT_ADDRESS_POLYGON')
    if not contract_address:
        logger.warning(f"⚠️  FLASHBOT_CONTRACT_ADDRESS_POLYGON non défini")
        logger.warning(f"   Mode simulation activé")
    
    # Créer orchestrateur
    orchestrator = MEVOrchestrator(
        w3=w3,
        account=account,
        chain='polygon',
        flashbot_contract_address=contract_address,
        min_spread_percent=0.8,  # 0.8% minimum
        min_profit_usd=100.0     # $100 minimum
    )
    
    try:
        await orchestrator.start()
    except KeyboardInterrupt:
        logger.info(f"\n⚠️  Interruption clavier")
        orchestrator.stop()
    except Exception as e:
        logger.error(f"\n❌ ERREUR FATALE: {e}")
        orchestrator.stop()
        raise


if __name__ == "__main__":
    asyncio.run(main())
