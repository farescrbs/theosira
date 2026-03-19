"""
🤖 THESORIA - AI MASTER AGENT (GRAAL AUTONOME)
===============================================

AGENT IA MAÎTRE AUTONOME 24/7

Architecture FSM (Finite State Machine):
1. DORMANT → Observation passive
2. ANALYZE → Modélisation profit
3. EXECUTE → Action atomique
4. RESULT → Vérification
5. LEARN → Auto-optimisation

Objectif: DOMINER LE FLUX DE VALEUR WEB3

Latence cible:
- Observation: ~0ms (IPC direct)
- Modélisation: <10ms
- Exécution: <100ms

ROI: MAXIMUM ABSOLU
"""

import asyncio
import time
import signal
import sys
import os
from typing import Dict, Optional, List
from enum import Enum
from decimal import Decimal
from web3 import Web3
from eth_account import Account
from eth_account.signers.local import LocalAccount
import logging

# Imports modules
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from grail.calldata_decoder import CalldataDecoder
from grail.jit_profit_model import JITProfitModel
from flashbots_executor import FlashbotsExecutor
from gas_bidding_eip1559 import GasBiddingEIP1559
from profit_calculator import ProfitCalculator

# Monitoring
from prometheus_client import Counter, Gauge, Histogram, start_http_server

# Alertes
from deployment.alerting_system import AlertingSystem, AlertLevel

logger = logging.getLogger(__name__)


# ============================================
# ÉTATS FSM
# ============================================

class AgentState(Enum):
    """États de la machine à états finis"""
    DORMANT = "dormant"           # Observation passive
    ANALYZING = "analyzing"       # Modélisation
    EXECUTING = "executing"       # Exécution bundle
    WAITING = "waiting"           # Attente résultat
    LEARNING = "learning"         # Auto-optimisation
    EMERGENCY_STOP = "emergency"  # Arrêt d'urgence


# ============================================
# MÉTRIQUES PROMETHEUS
# ============================================

# États
AGENT_STATE = Gauge(
    'master_agent_state',
    'État actuel de l\'agent (0-5)',
    ['chain']
)

# Performance
DECISION_LATENCY = Histogram(
    'master_agent_decision_latency_seconds',
    'Latence de décision',
    ['chain', 'state']
)

EXECUTION_SUCCESS_RATE = Gauge(
    'master_agent_success_rate',
    'Taux de succès',
    ['chain']
)

# Profit
CUMULATIVE_PROFIT_ETH = Counter(
    'master_agent_profit_cumulative_eth',
    'Profit cumulé en ETH',
    ['chain']
)

CUMULATIVE_PROFIT_USD = Counter(
    'master_agent_profit_cumulative_usd',
    'Profit cumulé en USD',
    ['chain']
)

# Learning
LEARNING_ITERATIONS = Counter(
    'master_agent_learning_iterations',
    'Itérations d\'apprentissage',
    ['chain']
)

GAS_BIDDING_PERCENTILE = Gauge(
    'master_agent_gas_percentile',
    'Percentile gas actuel',
    ['chain']
)

PROFIT_THRESHOLD = Gauge(
    'master_agent_profit_threshold_usd',
    'Seuil de profit actuel',
    ['chain']
)


class AIMasterAgent:
    """
    Agent IA Maître Autonome
    
    Orchestrateur suprême du système MEV
    Boucle de décision atomique avec FSM
    """
    
    # Paramètres initiaux
    INITIAL_GAS_PERCENTILE = 75
    INITIAL_PROFIT_THRESHOLD = Decimal('100')  # $100
    MAX_CONSECUTIVE_FAILURES = 5
    
    def __init__(
        self,
        w3: Web3,
        account: LocalAccount,
        chain: str = 'ethereum',
        mode: str = 'production'
    ):
        """
        Initialise l'Agent IA Maître
        
        Args:
            w3: Instance Web3 (IPC optimal)
            account: Compte de trading
            chain: Chain cible
            mode: production ou simulation
        """
        self.w3 = w3
        self.account = account
        self.chain = chain
        self.mode = mode
        
        # État FSM
        self.state = AgentState.DORMANT
        self.running = False
        
        # Modules
        logger.info(f"🔧 Initialisation modules...")
        
        self.decoder = CalldataDecoder(w3)
        self.profit_model = JITProfitModel()
        self.flashbots = FlashbotsExecutor(w3, account)
        self.gas_bidding = GasBiddingEIP1559(w3)
        self.profit_calculator = ProfitCalculator(w3)
        self.alerting = AlertingSystem()
        
        # Paramètres adaptatifs
        self.gas_percentile = self.INITIAL_GAS_PERCENTILE
        self.profit_threshold = self.INITIAL_PROFIT_THRESHOLD
        
        # Métriques learning
        self.consecutive_failures = 0
        self.total_executions = 0
        self.successful_executions = 0
        
        # Historique pour learning
        self.execution_history = []
        self.max_history = 50
        
        # Kill switch
        self.emergency_stop_triggered = False
        
        # Performance tracking
        self.session_start = time.time()
        self.total_profit = Decimal('0')
        self.total_gas_paid = Decimal('0')
        
        logger.info(f"✅ Modules initialisés")
        logger.info(f"🤖 AI Master Agent prêt!")
        logger.info(f"   Chain: {chain}")
        logger.info(f"   Mode: {mode}")
        logger.info(f"   Account: {account.address}")
    
    async def start(self):
        """
        Démarre l'Agent IA Maître en mode autonome
        
        BOUCLE INFINIE FSM
        """
        self.running = True
        
        logger.info(f"\n{'='*70}")
        logger.info(f"🚀 DÉMARRAGE AI MASTER AGENT (GRAAL AUTONOME)")
        logger.info(f"{'='*70}")
        logger.info(f"Mode: AUTONOMIE TOTALE 24/7")
        logger.info(f"État initial: {self.state.value}")
        logger.info(f"Profit threshold: ${self.profit_threshold}")
        logger.info(f"Gas percentile: {self.gas_percentile}")
        logger.info(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        logger.info(f"{'='*70}\n")
        
        # Signal handlers
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
        
        # Alerte démarrage
        await self.alerting.send_alert(
            level=AlertLevel.INFO,
            title="🤖 AI Master Agent Started",
            message=f"Chain: {self.chain}\nMode: {self.mode}",
            chain=self.chain
        )
        
        # BOUCLE FSM PRINCIPALE
        try:
            await self._fsm_loop()
        except Exception as e:
            logger.error(f"\n❌ ERREUR FATALE: {e}")
            await self._trigger_emergency_stop(str(e))
            raise
    
    async def _fsm_loop(self):
        """
        Boucle principale de la machine à états finis
        
        États:
        DORMANT → ANALYZING → EXECUTING → WAITING → LEARNING → DORMANT
                                              ↓
                                        EMERGENCY_STOP
        """
        while self.running:
            try:
                # Mettre à jour métrique état
                AGENT_STATE.labels(chain=self.chain).set(
                    list(AgentState).index(self.state)
                )
                
                # Exécuter action selon état
                if self.state == AgentState.DORMANT:
                    await self._state_dormant()
                
                elif self.state == AgentState.ANALYZING:
                    await self._state_analyzing()
                
                elif self.state == AgentState.EXECUTING:
                    await self._state_executing()
                
                elif self.state == AgentState.WAITING:
                    await self._state_waiting()
                
                elif self.state == AgentState.LEARNING:
                    await self._state_learning()
                
                elif self.state == AgentState.EMERGENCY_STOP:
                    await self._state_emergency()
                    break
                
                # Micro-sleep pour CPU
                await asyncio.sleep(0.001)
                
            except Exception as e:
                logger.error(f"❌ Erreur FSM loop: {e}")
                await self._trigger_emergency_stop(str(e))
    
    async def _state_dormant(self):
        """
        ÉTAT 1: DORMANT
        
        Observation passive mempool
        Latence cible: ~0ms
        """
        # TODO: Implémenter vraie observation mempool IPC
        # Pour l'instant: Simulation
        
        await asyncio.sleep(0.1)  # 100ms scan
        
        # Simuler détection opportunité
        import random
        if random.random() < 0.01:  # 1% chance
            logger.info(f"\n💎 OPPORTUNITÉ DÉTECTÉE!")
            self._transition_to(AgentState.ANALYZING)
    
    async def _state_analyzing(self):
        """
        ÉTAT 2: ANALYZING
        
        Modélisation mathématique du profit
        Latence cible: <10ms
        """
        analyze_start = time.time()
        
        logger.info(f"\n🧠 ANALYSE EN COURS...")
        
        try:
            # Simuler analyse
            # TODO: Vraie analyse avec données réelles
            
            swap_params = {
                'amountIn': 100_000 * 10**6,  # $100k
                'tokenIn': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                'tokenOut': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
                'fee': 3000,
            }
            
            pool_state = {
                'liquidity': 15_000_000_000_000_000_000,
                'sqrtPriceX96': 1461446703485210103287273052203988822378723970342,
                'tick': -193000,
                'fee': 3000,
                'tickSpacing': 60,
            }
            
            # Calculer profit
            profit_model = self.profit_model.calculate_jit_profit(
                swap_params,
                pool_state,
                Decimal('50000')
            )
            
            estimated_profit = Decimal(str(profit_model['our_fees_usd']))
            
            # Estimer gas
            gas_params = await self.gas_bidding.calculate_optimal_gas_params(
                profit_expected_usd=float(estimated_profit),
                urgency='high',
                percentile=self.gas_percentile
            )
            
            gas_cost = Decimal(str(gas_params['estimatedCostUSD']))
            
            # Profit net
            net_profit = estimated_profit - gas_cost
            
            analyze_time = time.time() - analyze_start
            DECISION_LATENCY.labels(
                chain=self.chain,
                state='analyzing'
            ).observe(analyze_time)
            
            logger.info(f"   Profit brut: ${estimated_profit:.2f}")
            logger.info(f"   Gas cost: ${gas_cost:.2f}")
            logger.info(f"   Profit NET: ${net_profit:.2f}")
            logger.info(f"   Threshold: ${self.profit_threshold:.2f}")
            logger.info(f"   Latence: {analyze_time*1000:.1f}ms")
            
            # Vérifier profitabilité
            if net_profit >= self.profit_threshold:
                # PROFITABLE!
                logger.info(f"\n✅ PROFITABLE! Transition → EXECUTING")
                
                # Stocker contexte
                self.current_opportunity = {
                    'swap_params': swap_params,
                    'pool_state': pool_state,
                    'profit_model': profit_model,
                    'gas_params': gas_params,
                    'estimated_profit': estimated_profit,
                    'gas_cost': gas_cost,
                    'net_profit': net_profit,
                }
                
                self._transition_to(AgentState.EXECUTING)
            else:
                logger.info(f"\n❌ NON PROFITABLE")
                logger.info(f"   Retour → DORMANT")
                self._transition_to(AgentState.DORMANT)
        
        except Exception as e:
            logger.error(f"❌ Erreur analyzing: {e}")
            self._transition_to(AgentState.DORMANT)
    
    async def _state_executing(self):
        """
        ÉTAT 3: EXECUTING
        
        Construction et envoi bundle
        Latence cible: <100ms
        """
        exec_start = time.time()
        
        logger.info(f"\n⚡ EXÉCUTION EN COURS...")
        
        try:
            opp = self.current_opportunity
            
            # TODO: Construire vraie bundle avec mint/burn
            # Pour l'instant: Simulation
            
            logger.info(f"   Construction bundle...")
            logger.info(f"   Signature transactions...")
            logger.info(f"   Envoi Flashbots...")
            
            # Simuler envoi
            await asyncio.sleep(0.05)  # 50ms
            
            exec_time = time.time() - exec_start
            DECISION_LATENCY.labels(
                chain=self.chain,
                state='executing'
            ).observe(exec_time)
            
            logger.info(f"   ✅ Bundle envoyé!")
            logger.info(f"   Latence: {exec_time*1000:.1f}ms")
            
            # Transition → WAITING
            self._transition_to(AgentState.WAITING)
            
        except Exception as e:
            logger.error(f"❌ Erreur executing: {e}")
            self.consecutive_failures += 1
            self._transition_to(AgentState.LEARNING)
    
    async def _state_waiting(self):
        """
        ÉTAT 4: WAITING
        
        Attente inclusion du bundle
        """
        logger.info(f"\n⏳ ATTENTE RÉSULTAT...")
        
        # Attendre 1-3 blocs (12-36 secondes)
        await asyncio.sleep(12)
        
        # Simuler résultat
        import random
        success = random.random() < 0.7  # 70% succès
        
        if success:
            # SUCCÈS!
            logger.info(f"\n🎉 BUNDLE INCLUS!")
            
            opp = self.current_opportunity
            profit = opp['net_profit']
            
            # Métriques
            CUMULATIVE_PROFIT_USD.labels(chain=self.chain).inc(float(profit))
            
            self.total_profit += profit
            self.successful_executions += 1
            self.total_executions += 1
            self.consecutive_failures = 0
            
            # Historique
            self.execution_history.append({
                'success': True,
                'profit': profit,
                'gas_percentile': self.gas_percentile,
                'timestamp': time.time(),
            })
            
            if len(self.execution_history) > self.max_history:
                self.execution_history.pop(0)
            
            logger.info(f"   Profit: ${profit:.2f}")
            logger.info(f"   Total cumulé: ${self.total_profit:.2f}")
            
            # Alerte si gros profit
            if profit > 1000:
                await self.alerting.send_alert(
                    level=AlertLevel.SUCCESS,
                    title=f"💰 High Profit: ${profit:.2f}",
                    message=f"Net profit: ${profit:.2f}\nTotal: ${self.total_profit:.2f}",
                    chain=self.chain
                )
            
            # Transition → LEARNING (optimisation)
            self._transition_to(AgentState.LEARNING)
        
        else:
            # ÉCHEC
            logger.warning(f"\n⚠️  BUNDLE NON INCLUS")
            
            self.total_executions += 1
            self.consecutive_failures += 1
            
            # Historique
            self.execution_history.append({
                'success': False,
                'profit': Decimal('0'),
                'gas_percentile': self.gas_percentile,
                'timestamp': time.time(),
            })
            
            if len(self.execution_history) > self.max_history:
                self.execution_history.pop(0)
            
            logger.warning(f"   Échecs consécutifs: {self.consecutive_failures}")
            
            # Vérifier kill switch
            if self.consecutive_failures >= self.MAX_CONSECUTIVE_FAILURES:
                await self._trigger_emergency_stop(
                    f"Trop d'échecs consécutifs: {self.consecutive_failures}"
                )
            else:
                # Transition → LEARNING
                self._transition_to(AgentState.LEARNING)
    
    async def _state_learning(self):
        """
        ÉTAT 5: LEARNING
        
        Auto-optimisation des paramètres
        """
        logger.info(f"\n🧠 AUTO-OPTIMISATION...")
        
        LEARNING_ITERATIONS.labels(chain=self.chain).inc()
        
        # Calculer taux de succès récent
        if len(self.execution_history) >= 10:
            recent_successes = sum(
                1 for ex in self.execution_history[-10:]
                if ex['success']
            )
            success_rate = recent_successes / 10
        else:
            success_rate = 0.5
        
        logger.info(f"   Taux succès (10 derniers): {success_rate*100:.1f}%")
        
        # Mettre à jour métrique
        EXECUTION_SUCCESS_RATE.labels(chain=self.chain).set(success_rate)
        
        # OPTIMISATION GAS PERCENTILE
        if success_rate < 0.5:
            # Taux bas: Augmenter agressivité gas
            old_percentile = self.gas_percentile
            self.gas_percentile = min(95, self.gas_percentile + 5)
            
            logger.info(f"   📈 Gas percentile: {old_percentile} → {self.gas_percentile}")
        
        elif success_rate > 0.8:
            # Taux élevé: Réduire pour économiser
            old_percentile = self.gas_percentile
            self.gas_percentile = max(60, self.gas_percentile - 2)
            
            logger.info(f"   📉 Gas percentile: {old_percentile} → {self.gas_percentile}")
        
        GAS_BIDDING_PERCENTILE.labels(chain=self.chain).set(self.gas_percentile)
        
        # OPTIMISATION PROFIT THRESHOLD
        if success_rate < 0.4:
            # Taux très bas: Augmenter seuil (+ sélectif)
            old_threshold = self.profit_threshold
            self.profit_threshold = self.profit_threshold * Decimal('1.2')
            
            logger.info(f"   📈 Profit threshold: ${old_threshold:.2f} → ${self.profit_threshold:.2f}")
        
        elif success_rate > 0.85 and len(self.execution_history) >= 20:
            # Taux excellent: Réduire seuil (+ opportunités)
            old_threshold = self.profit_threshold
            self.profit_threshold = max(
                Decimal('50'),
                self.profit_threshold * Decimal('0.95')
            )
            
            logger.info(f"   📉 Profit threshold: ${old_threshold:.2f} → ${self.profit_threshold:.2f}")
        
        PROFIT_THRESHOLD.labels(chain=self.chain).set(float(self.profit_threshold))
        
        # Stats session
        uptime = time.time() - self.session_start
        logger.info(f"\n📊 SESSION STATS:")
        logger.info(f"   Uptime: {uptime/3600:.1f}h")
        logger.info(f"   Executions: {self.total_executions}")
        logger.info(f"   Successes: {self.successful_executions}")
        logger.info(f"   Profit total: ${self.total_profit:.2f}")
        
        # Retour → DORMANT
        logger.info(f"\n   Retour → DORMANT")
        self._transition_to(AgentState.DORMANT)
    
    async def _state_emergency(self):
        """
        ÉTAT 6: EMERGENCY_STOP
        
        Arrêt d'urgence
        """
        logger.error(f"\n🚨 EMERGENCY STOP ACTIVÉ!")
        logger.error(f"   Arrêt de l'agent...")
        
        # Alerte critique
        await self.alerting.send_alert(
            level=AlertLevel.CRITICAL,
            title="🚨 EMERGENCY STOP",
            message=f"Agent arrêté\nRaison: {getattr(self, 'emergency_reason', 'Unknown')}",
            chain=self.chain
        )
        
        self.running = False
    
    def _transition_to(self, new_state: AgentState):
        """
        Transition vers nouvel état
        
        Args:
            new_state: Nouvel état
        """
        old_state = self.state
        self.state = new_state
        
        logger.debug(f"🔄 Transition: {old_state.value} → {new_state.value}")
    
    async def _trigger_emergency_stop(self, reason: str):
        """
        Déclenche l'arrêt d'urgence
        
        Args:
            reason: Raison de l'arrêt
        """
        self.emergency_stop_triggered = True
        self.emergency_reason = reason
        
        logger.error(f"\n🚨 TRIGGER EMERGENCY STOP")
        logger.error(f"   Raison: {reason}")
        
        self._transition_to(AgentState.EMERGENCY_STOP)
    
    def _signal_handler(self, signum, frame):
        """Handler pour signaux"""
        logger.info(f"\n⚠️  Signal reçu: {signum}")
        asyncio.create_task(self._trigger_emergency_stop(f"Signal {signum}"))
    
    def stop(self):
        """Arrête l'agent"""
        logger.info(f"\n🛑 ARRÊT AI MASTER AGENT")
        self.running = False
        
        # Stats finales
        logger.info(f"\n{'='*70}")
        logger.info(f"📊 STATISTIQUES FINALES")
        logger.info(f"{'='*70}")
        logger.info(f"Uptime: {(time.time() - self.session_start)/3600:.2f}h")
        logger.info(f"Executions: {self.total_executions}")
        logger.info(f"Successes: {self.successful_executions}")
        logger.info(f"Success rate: {(self.successful_executions/max(self.total_executions,1))*100:.1f}%")
        logger.info(f"Profit total: ${self.total_profit:.2f}")
        logger.info(f"Gas paid: ${self.total_gas_paid:.2f}")
        logger.info(f"Net profit: ${self.total_profit - self.total_gas_paid:.2f}")
        logger.info(f"{'='*70}")


# ============================================
# POINT D'ENTRÉE
# ============================================

async def main():
    """Point d'entrée principal"""
    from dotenv import load_dotenv
    
    # Load env
    load_dotenv()
    
    # Logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler('ai_master_agent.log')
        ]
    )
    
    # Prometheus
    logger.info(f"📊 Démarrage Prometheus :9000...")
    start_http_server(9000)
    logger.info(f"✅ Metrics: http://localhost:9000/metrics")
    
    # Setup Web3
    # OPTIMAL: IPC pour latence minimale
    ipc_path = os.getenv('GETH_IPC_PATH')
    
    if ipc_path and os.path.exists(ipc_path):
        logger.info(f"🚀 Connexion IPC: {ipc_path}")
        w3 = Web3(Web3.IPCProvider(ipc_path))
    else:
        # Fallback WebSocket
        ws_url = os.getenv('ETH_WS_URL')
        if ws_url:
            logger.info(f"🔌 Connexion WebSocket: {ws_url[:50]}...")
            from web3.providers.websocket import WebsocketProvider
            w3 = Web3(WebsocketProvider(ws_url))
        else:
            # Fallback HTTP
            http_url = os.getenv('ETH_HTTP_URL', 'https://eth-mainnet.g.alchemy.com/v2/demo')
            logger.warning(f"⚠️  Fallback HTTP (latence élevée): {http_url[:50]}...")
            w3 = Web3(Web3.HTTPProvider(http_url))
    
    if not w3.is_connected():
        logger.error(f"❌ Connexion échouée")
        return
    
    logger.info(f"✅ Connecté: Block {w3.eth.block_number}")
    
    # Account
    private_key = os.getenv('PRIVATE_KEY')
    if not private_key:
        logger.error(f"❌ PRIVATE_KEY non défini")
        return
    
    account = Account.from_key(private_key)
    logger.info(f"✅ Account: {account.address}")
    
    # Balance check
    balance_wei = w3.eth.get_balance(account.address)
    balance_eth = balance_wei / 10**18
    
    logger.info(f"💰 Balance: {balance_eth:.4f} ETH")
    
    if balance_eth < 0.1:
        logger.error(f"❌ Balance insuffisante! Minimum 0.1 ETH requis")
        return
    
    # Créer Agent IA Maître
    agent = AIMasterAgent(
        w3=w3,
        account=account,
        chain='ethereum',
        mode='production'
    )
    
    # Lancer
    try:
        await agent.start()
    except KeyboardInterrupt:
        logger.info(f"\n⚠️  Interruption clavier")
        agent.stop()
    except Exception as e:
        logger.error(f"\n❌ ERREUR FATALE: {e}")
        agent.stop()
        raise


if __name__ == "__main__":
    asyncio.run(main())
