"""
📊 THESORIA - Instrumentation Prometheus
=========================================

Expose toutes les métriques critiques pour monitoring:
- Profit net cumulé (ETH & USD)
- Bundles success/fail
- Balance wallet
- Performance (latence, throughput)
- Sécurité (rejections, erreurs)

Endpoint: http://localhost:8000/metrics
"""

import time
from typing import Dict, Optional
from prometheus_client import (
    Counter,
    Gauge,
    Histogram,
    Summary,
    Info,
    start_http_server,
    REGISTRY
)
import logging

logger = logging.getLogger(__name__)


class PrometheusMetrics:
    """
    Système de métriques Prometheus ultra-complet
    
    Métriques exposées:
    - Profit (Counter, Gauge)
    - Bundles (Counter)
    - Balance (Gauge)
    - Performance (Histogram, Summary)
    - Sécurité (Counter)
    """
    
    def __init__(self, port: int = 8000):
        """
        Initialise les métriques Prometheus
        
        Args:
            port: Port pour l'endpoint /metrics
        """
        self.port = port
        
        # ============================================
        # PROFIT METRICS (CRITIQUES!)
        # ============================================
        
        # Profit total cumulé en ETH
        self.profit_total_eth = Counter(
            'mev_profit_total_eth',
            'Profit total cumulé en ETH',
            ['chain']
        )
        
        # Profit total cumulé en USD
        self.profit_total_usd = Counter(
            'mev_profit_total_usd',
            'Profit total cumulé en USD',
            ['chain']
        )
        
        # Profit net actuel (après gas)
        self.profit_net_current = Gauge(
            'mev_profit_net_current',
            'Profit net actuel en USD',
            ['chain']
        )
        
        # Gas payé total
        self.gas_paid_total = Counter(
            'mev_gas_paid_total_usd',
            'Gas total payé en USD',
            ['chain']
        )
        
        # ============================================
        # BUNDLE METRICS (FLASHBOTS)
        # ============================================
        
        # Bundles envoyés
        self.bundles_sent = Counter(
            'mev_bundles_sent_total',
            'Nombre total de bundles Flashbots envoyés',
            ['chain']
        )
        
        # Bundles inclus (SUCCESS)
        self.bundles_success = Counter(
            'mev_bundles_success_total',
            'Nombre de bundles Flashbots inclus',
            ['chain']
        )
        
        # Bundles échoués
        self.bundles_failed = Counter(
            'mev_bundles_failed_total',
            'Nombre de bundles Flashbots échoués',
            ['chain']
        )
        
        # Taux de succès actuel
        self.bundle_success_rate = Gauge(
            'mev_bundle_success_rate',
            'Taux de succès des bundles (0-100)',
            ['chain']
        )
        
        # ============================================
        # WALLET METRICS (SÉCURITÉ)
        # ============================================
        
        # Balance wallet ETH
        self.wallet_balance_eth = Gauge(
            'mev_wallet_balance_eth',
            'Balance du wallet en ETH',
            ['chain', 'address']
        )
        
        # Balance wallet USD équivalent
        self.wallet_balance_usd = Gauge(
            'mev_wallet_balance_usd',
            'Balance du wallet en USD',
            ['chain', 'address']
        )
        
        # ============================================
        # TRADING METRICS
        # ============================================
        
        # Opportunités détectées
        self.opportunities_detected = Counter(
            'mev_opportunities_detected_total',
            'Nombre d\'opportunités détectées',
            ['chain', 'dex_pair']
        )
        
        # Trades exécutés
        self.trades_executed = Counter(
            'mev_trades_executed_total',
            'Nombre de trades exécutés',
            ['chain', 'status']  # status: success, failed
        )
        
        # Profit par trade (distribution)
        self.profit_per_trade = Histogram(
            'mev_profit_per_trade_usd',
            'Distribution du profit par trade en USD',
            ['chain'],
            buckets=[10, 50, 100, 200, 500, 1000, 2000, 5000]
        )
        
        # ============================================
        # PERFORMANCE METRICS
        # ============================================
        
        # Latence scan DEX
        self.scan_latency = Histogram(
            'mev_scan_latency_seconds',
            'Latence du scan DEX en secondes',
            ['chain'],
            buckets=[0.01, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0]
        )
        
        # Latence RPC
        self.rpc_latency = Histogram(
            'mev_rpc_latency_seconds',
            'Latence RPC en secondes',
            ['chain', 'rpc_name'],
            buckets=[0.01, 0.02, 0.05, 0.1, 0.2, 0.5]
        )
        
        # Latence exécution totale
        self.execution_latency = Summary(
            'mev_execution_latency_seconds',
            'Latence d\'exécution totale (détection → inclusion)',
            ['chain']
        )
        
        # Scans par seconde
        self.scans_per_second = Gauge(
            'mev_scans_per_second',
            'Nombre de scans par seconde',
            ['chain']
        )
        
        # ============================================
        # SÉCURITÉ METRICS (ALGORITHME)
        # ============================================
        
        # Trades évalués par l'algorithme sécurité
        self.security_evaluated = Counter(
            'mev_security_evaluated_total',
            'Nombre de trades évalués par l\'algorithme',
            ['chain']
        )
        
        # Trades approuvés
        self.security_approved = Counter(
            'mev_security_approved_total',
            'Nombre de trades approuvés',
            ['chain']
        )
        
        # Trades rejetés (par raison)
        self.security_rejected = Counter(
            'mev_security_rejected_total',
            'Nombre de trades rejetés',
            ['chain', 'reason']  # reason: low_profit, high_gas, etc.
        )
        
        # ============================================
        # GAS METRICS
        # ============================================
        
        # Gas price actuel
        self.gas_price_current = Gauge(
            'mev_gas_price_current_gwei',
            'Gas price actuel en Gwei',
            ['chain']
        )
        
        # Gas utilisé par trade
        self.gas_used_per_trade = Histogram(
            'mev_gas_used_per_trade',
            'Gas utilisé par trade',
            ['chain'],
            buckets=[100000, 300000, 500000, 700000, 1000000, 2000000]
        )
        
        # ============================================
        # ERROR METRICS
        # ============================================
        
        # Erreurs totales
        self.errors_total = Counter(
            'mev_errors_total',
            'Nombre total d\'erreurs',
            ['chain', 'error_type']
        )
        
        # Connexions RPC perdues
        self.rpc_connection_lost = Counter(
            'mev_rpc_connection_lost_total',
            'Nombre de connexions RPC perdues',
            ['chain', 'rpc_name']
        )
        
        # ============================================
        # SYSTEM METRICS
        # ============================================
        
        # Uptime
        self.uptime_seconds = Gauge(
            'mev_uptime_seconds',
            'Temps de fonctionnement en secondes'
        )
        
        # Info système
        self.system_info = Info(
            'mev_system',
            'Informations système'
        )
        
        # Démarrage timestamp
        self.start_time = time.time()
        
        logger.info(f"📊 Métriques Prometheus initialisées")
    
    def start_server(self):
        """Démarre le serveur HTTP pour /metrics"""
        try:
            start_http_server(self.port)
            logger.info(f"✅ Serveur Prometheus démarré sur port {self.port}")
            logger.info(f"   Metrics: http://localhost:{self.port}/metrics")
        except Exception as e:
            logger.error(f"❌ Erreur démarrage serveur Prometheus: {e}")
    
    # ============================================
    # HELPER METHODS
    # ============================================
    
    def record_profit(
        self,
        chain: str,
        profit_usd: float,
        gas_cost_usd: float
    ):
        """
        Enregistre un profit
        
        Args:
            chain: Nom de la chain
            profit_usd: Profit brut en USD
            gas_cost_usd: Coût du gas en USD
        """
        # Profit net
        net_profit = profit_usd - gas_cost_usd
        
        # ETH equivalent (approximatif)
        eth_price = 2000.0  # TODO: Fetch real price
        profit_eth = profit_usd / eth_price
        
        # Update counters
        self.profit_total_usd.labels(chain=chain).inc(profit_usd)
        self.profit_total_eth.labels(chain=chain).inc(profit_eth)
        self.gas_paid_total.labels(chain=chain).inc(gas_cost_usd)
        
        # Update gauges
        self.profit_net_current.labels(chain=chain).set(net_profit)
        
        # Distribution
        self.profit_per_trade.labels(chain=chain).observe(profit_usd)
        
        logger.debug(f"📊 Profit enregistré: ${profit_usd:.2f} (net: ${net_profit:.2f})")
    
    def record_bundle_sent(self, chain: str):
        """Enregistre un bundle envoyé"""
        self.bundles_sent.labels(chain=chain).inc()
    
    def record_bundle_success(self, chain: str):
        """Enregistre un bundle réussi"""
        self.bundles_success.labels(chain=chain).inc()
        self._update_success_rate(chain)
    
    def record_bundle_failed(self, chain: str):
        """Enregistre un bundle échoué"""
        self.bundles_failed.labels(chain=chain).inc()
        self._update_success_rate(chain)
    
    def _update_success_rate(self, chain: str):
        """Met à jour le taux de succès"""
        # Get current values (approximatif car Prometheus ne permet pas de lire les Counter)
        # En production, utilisez un cache local
        pass
    
    def record_wallet_balance(
        self,
        chain: str,
        address: str,
        balance_eth: float,
        eth_price_usd: float
    ):
        """
        Enregistre la balance du wallet
        
        Args:
            chain: Nom de la chain
            address: Adresse du wallet
            balance_eth: Balance en ETH
            eth_price_usd: Prix ETH en USD
        """
        balance_usd = balance_eth * eth_price_usd
        
        self.wallet_balance_eth.labels(
            chain=chain,
            address=address
        ).set(balance_eth)
        
        self.wallet_balance_usd.labels(
            chain=chain,
            address=address
        ).set(balance_usd)
    
    def record_opportunity(
        self,
        chain: str,
        dex_pair: str
    ):
        """Enregistre une opportunité détectée"""
        self.opportunities_detected.labels(
            chain=chain,
            dex_pair=dex_pair
        ).inc()
    
    def record_trade(
        self,
        chain: str,
        success: bool
    ):
        """Enregistre un trade"""
        status = 'success' if success else 'failed'
        self.trades_executed.labels(
            chain=chain,
            status=status
        ).inc()
    
    def record_scan_latency(
        self,
        chain: str,
        latency_seconds: float
    ):
        """Enregistre la latence d'un scan"""
        self.scan_latency.labels(chain=chain).observe(latency_seconds)
    
    def record_rpc_latency(
        self,
        chain: str,
        rpc_name: str,
        latency_seconds: float
    ):
        """Enregistre la latence RPC"""
        self.rpc_latency.labels(
            chain=chain,
            rpc_name=rpc_name
        ).observe(latency_seconds)
    
    def record_execution_latency(
        self,
        chain: str,
        latency_seconds: float
    ):
        """Enregistre la latence d'exécution totale"""
        self.execution_latency.labels(chain=chain).observe(latency_seconds)
    
    def record_security_evaluation(
        self,
        chain: str,
        approved: bool,
        rejection_reason: Optional[str] = None
    ):
        """
        Enregistre une évaluation sécurité
        
        Args:
            chain: Nom de la chain
            approved: Trade approuvé ou non
            rejection_reason: Raison du rejet si applicable
        """
        self.security_evaluated.labels(chain=chain).inc()
        
        if approved:
            self.security_approved.labels(chain=chain).inc()
        else:
            reason = rejection_reason or 'unknown'
            self.security_rejected.labels(
                chain=chain,
                reason=reason
            ).inc()
    
    def record_gas_price(
        self,
        chain: str,
        gas_price_gwei: float
    ):
        """Enregistre le gas price actuel"""
        self.gas_price_current.labels(chain=chain).set(gas_price_gwei)
    
    def record_gas_used(
        self,
        chain: str,
        gas_used: int
    ):
        """Enregistre le gas utilisé"""
        self.gas_used_per_trade.labels(chain=chain).observe(gas_used)
    
    def record_error(
        self,
        chain: str,
        error_type: str
    ):
        """Enregistre une erreur"""
        self.errors_total.labels(
            chain=chain,
            error_type=error_type
        ).inc()
    
    def record_rpc_connection_lost(
        self,
        chain: str,
        rpc_name: str
    ):
        """Enregistre une connexion RPC perdue"""
        self.rpc_connection_lost.labels(
            chain=chain,
            rpc_name=rpc_name
        ).inc()
    
    def update_uptime(self):
        """Met à jour l'uptime"""
        uptime = time.time() - self.start_time
        self.uptime_seconds.set(uptime)
    
    def set_system_info(self, info: Dict[str, str]):
        """
        Configure les informations système
        
        Args:
            info: Dict avec clés version, chain, mode, etc.
        """
        self.system_info.info(info)


# ============================================
# SINGLETON GLOBAL
# ============================================

_metrics_instance: Optional[PrometheusMetrics] = None


def get_metrics() -> PrometheusMetrics:
    """Retourne l'instance singleton des métriques"""
    global _metrics_instance
    
    if _metrics_instance is None:
        _metrics_instance = PrometheusMetrics()
    
    return _metrics_instance


def init_metrics(port: int = 8000) -> PrometheusMetrics:
    """
    Initialise et démarre le serveur de métriques
    
    Args:
        port: Port pour l'endpoint /metrics
    
    Returns:
        Instance PrometheusMetrics
    """
    global _metrics_instance
    
    if _metrics_instance is None:
        _metrics_instance = PrometheusMetrics(port)
        _metrics_instance.start_server()
        
        # Set system info
        _metrics_instance.set_system_info({
            'version': '1.0.0',
            'mode': 'production',
            'name': 'THESORIA MEV Agent',
        })
    
    return _metrics_instance


# ============================================
# EXEMPLE D'UTILISATION
# ============================================

if __name__ == "__main__":
    import logging
    import random
    
    logging.basicConfig(level=logging.INFO)
    
    # Initialiser
    metrics = init_metrics(port=8000)
    
    print("\n" + "="*60)
    print("📊 Serveur Prometheus démarré!")
    print("="*60)
    print(f"Metrics endpoint: http://localhost:8000/metrics")
    print(f"\nSimulation de métriques en cours...")
    print(f"Arrêt avec Ctrl+C")
    print("="*60 + "\n")
    
    # Simuler des métriques
    try:
        iteration = 0
        while True:
            iteration += 1
            
            # Simuler profit
            if random.random() > 0.3:  # 70% de trades profitables
                profit = random.uniform(100, 500)
                gas_cost = random.uniform(20, 80)
                metrics.record_profit('polygon', profit, gas_cost)
                
                # Bundle success
                metrics.record_bundle_sent('polygon')
                metrics.record_bundle_success('polygon')
                metrics.record_trade('polygon', True)
                
                print(f"✅ Trade #{iteration}: Profit ${profit:.2f}, Gas ${gas_cost:.2f}")
            else:
                # Bundle failed
                metrics.record_bundle_sent('polygon')
                metrics.record_bundle_failed('polygon')
                metrics.record_trade('polygon', False)
                
                print(f"❌ Trade #{iteration}: Failed")
            
            # Balance wallet
            balance = 10.5 - (iteration * 0.001)
            metrics.record_wallet_balance('polygon', '0x123...', balance, 2000.0)
            
            # Performance
            metrics.record_scan_latency('polygon', random.uniform(0.05, 0.15))
            metrics.record_gas_price('polygon', random.uniform(20, 100))
            
            # Security
            if random.random() > 0.5:
                metrics.record_security_evaluation('polygon', True)
            else:
                reason = random.choice(['low_profit', 'high_gas', 'negative_roi'])
                metrics.record_security_evaluation('polygon', False, reason)
            
            # Uptime
            metrics.update_uptime()
            
            time.sleep(2)
            
    except KeyboardInterrupt:
        print("\n\n👋 Arrêt du serveur...")
