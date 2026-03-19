#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
🛡️ THESORIA - RISK MANAGER
═══════════════════════════════════════════════════════════════════════════════

Gestionnaire de risque avancé pour protection capital

Fonctionnalités:
• Position sizing dynamique
• Stop-loss automatique
• Drawdown protection
• Exposure limits
• Circuit breakers
• Risk scoring
• Portfolio protection
• Emergency shutdown

Protections:
• Max daily loss
• Max consecutive losses
• Max drawdown
• Max position size
• Volatility adjustment
• Gas price protection

═══════════════════════════════════════════════════════════════════════════════
"""

from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import List, Optional
from enum import Enum

try:
    from colorama import Fore, Style, init
except ImportError:
    print("❌ Module requis: pip3 install colorama")
    exit(1)

init(autoreset=True)


class RiskLevel(Enum):
    """Niveaux de risque"""
    SAFE = "✅ Safe"
    MODERATE = "⚠️  Moderate"
    HIGH = "🔶 High"
    CRITICAL = "🔴 Critical"
    EMERGENCY = "🚨 Emergency"


@dataclass
class RiskMetrics:
    """Métriques de risque"""
    current_drawdown: float
    daily_loss: float
    consecutive_losses: int
    exposure_pct: float
    volatility_score: float
    gas_risk_score: float
    
    @property
    def risk_level(self) -> RiskLevel:
        """Niveau de risque global"""
        # Calculer score de risque (0-100)
        risk_score = 0
        
        # Drawdown (max 30 points)
        risk_score += min(self.current_drawdown, 30)
        
        # Daily loss (max 25 points)
        risk_score += min(abs(self.daily_loss) / 100, 1.0) * 25
        
        # Consecutive losses (max 20 points)
        risk_score += min(self.consecutive_losses / 5, 1.0) * 20
        
        # Exposure (max 15 points)
        risk_score += min(self.exposure_pct / 100, 1.0) * 15
        
        # Volatility (max 10 points)
        risk_score += self.volatility_score
        
        # Déterminer niveau
        if risk_score >= 80:
            return RiskLevel.EMERGENCY
        elif risk_score >= 60:
            return RiskLevel.CRITICAL
        elif risk_score >= 40:
            return RiskLevel.HIGH
        elif risk_score >= 20:
            return RiskLevel.MODERATE
        else:
            return RiskLevel.SAFE


class RiskManager:
    """Gestionnaire de risque"""
    
    def __init__(self, config: dict = None):
        self.config = config or {}
        
        # Limites configurables
        self.max_daily_loss = float(self.config.get('MAX_DAILY_LOSS', 1000))
        self.max_drawdown_pct = float(self.config.get('MAX_DRAWDOWN_PCT', 20))
        self.max_consecutive_losses = int(self.config.get('MAX_CONSECUTIVE_LOSSES', 5))
        self.max_position_size = float(self.config.get('MAX_POSITION_SIZE', 10000))
        self.max_gas_price = float(self.config.get('MAX_GAS_PRICE_GWEI', 100))
        
        # État actuel
        self.daily_pnl = 0.0
        self.peak_equity = 0.0
        self.current_equity = 0.0
        self.consecutive_losses = 0
        self.trades_today = []
        self.last_reset = datetime.now()
        
        # Circuit breakers
        self.trading_enabled = True
        self.shutdown_reason = None
    
    def reset_daily_stats(self):
        """Reset stats quotidiennes"""
        now = datetime.now()
        if (now - self.last_reset).days >= 1:
            self.daily_pnl = 0.0
            self.trades_today = []
            self.last_reset = now
    
    def can_trade(self, trade_size: float, gas_price: float) -> tuple[bool, str]:
        """
        Vérifier si on peut trader
        
        Returns:
            (can_trade, reason)
        """
        self.reset_daily_stats()
        
        # Check shutdown
        if not self.trading_enabled:
            return False, f"Trading disabled: {self.shutdown_reason}"
        
        # Check daily loss limit
        if self.daily_pnl <= -self.max_daily_loss:
            self.shutdown(f"Daily loss limit reached: ${abs(self.daily_pnl):.2f}")
            return False, "Daily loss limit exceeded"
        
        # Check consecutive losses
        if self.consecutive_losses >= self.max_consecutive_losses:
            self.shutdown(f"Too many consecutive losses: {self.consecutive_losses}")
            return False, "Consecutive loss limit exceeded"
        
        # Check drawdown
        if self.peak_equity > 0:
            current_dd = ((self.peak_equity - self.current_equity) / self.peak_equity) * 100
            if current_dd >= self.max_drawdown_pct:
                self.shutdown(f"Max drawdown exceeded: {current_dd:.1f}%")
                return False, "Drawdown limit exceeded"
        
        # Check position size
        if trade_size > self.max_position_size:
            return False, f"Trade size too large: ${trade_size:.2f} > ${self.max_position_size:.2f}"
        
        # Check gas price
        if gas_price > self.max_gas_price:
            return False, f"Gas too high: {gas_price:.1f} gwei > {self.max_gas_price:.1f} gwei"
        
        return True, "OK"
    
    def calculate_position_size(self, 
                               spread_pct: float,
                               gas_price: float,
                               volatility: float = 1.0) -> float:
        """
        Calculer taille de position optimale
        
        Args:
            spread_pct: Spread disponible
            gas_price: Prix du gas
            volatility: Score de volatilité (1.0 = normal)
        
        Returns:
            Position size recommandée
        """
        # Base size
        base_size = self.max_position_size
        
        # Ajustement spread (plus le spread est grand, plus on peut trader gros)
        spread_factor = min(spread_pct / 2.0, 1.5)  # Max 1.5x
        
        # Ajustement gas (gas élevé = position plus petite)
        gas_factor = max(0.5, 1 - (gas_price - 30) / 100)  # Min 0.5x
        
        # Ajustement volatilité
        volatility_factor = 1 / volatility
        
        # Ajustement drawdown actuel
        if self.peak_equity > 0:
            current_dd = ((self.peak_equity - self.current_equity) / self.peak_equity) * 100
            dd_factor = max(0.3, 1 - current_dd / 30)  # Réduire si drawdown
        else:
            dd_factor = 1.0
        
        # Ajustement daily loss
        if self.daily_pnl < 0:
            loss_factor = max(0.5, 1 + (self.daily_pnl / self.max_daily_loss))
        else:
            loss_factor = 1.0
        
        # Position finale
        position_size = base_size * spread_factor * gas_factor * volatility_factor * dd_factor * loss_factor
        
        return min(position_size, self.max_position_size)
    
    def record_trade(self, profit: float, success: bool = True):
        """Enregistrer un trade"""
        self.reset_daily_stats()
        
        # Update PnL
        self.daily_pnl += profit
        self.current_equity += profit
        
        # Update peak
        if self.current_equity > self.peak_equity:
            self.peak_equity = self.current_equity
        
        # Update consecutive losses
        if profit < 0:
            self.consecutive_losses += 1
        else:
            self.consecutive_losses = 0
        
        # Record trade
        self.trades_today.append({
            'timestamp': datetime.now(),
            'profit': profit,
            'success': success
        })
    
    def get_risk_metrics(self) -> RiskMetrics:
        """Obtenir métriques de risque actuelles"""
        self.reset_daily_stats()
        
        # Drawdown
        if self.peak_equity > 0:
            drawdown = ((self.peak_equity - self.current_equity) / self.peak_equity) * 100
        else:
            drawdown = 0
        
        # Exposure (simplifié)
        exposure = (abs(self.daily_pnl) / self.max_daily_loss) * 100 if self.max_daily_loss > 0 else 0
        
        # Volatility score (basé sur variance trades récents)
        if len(self.trades_today) >= 3:
            profits = [t['profit'] for t in self.trades_today[-10:]]
            avg = sum(profits) / len(profits)
            variance = sum((p - avg) ** 2 for p in profits) / len(profits)
            volatility = min((variance ** 0.5) / 50, 10)  # Max 10
        else:
            volatility = 5  # Default medium
        
        # Gas risk (à implémenter avec vraies données)
        gas_risk = 5  # Default medium
        
        return RiskMetrics(
            current_drawdown=drawdown,
            daily_loss=self.daily_pnl if self.daily_pnl < 0 else 0,
            consecutive_losses=self.consecutive_losses,
            exposure_pct=exposure,
            volatility_score=volatility,
            gas_risk_score=gas_risk
        )
    
    def shutdown(self, reason: str):
        """Arrêt d'urgence du trading"""
        self.trading_enabled = False
        self.shutdown_reason = reason
        
        print(f"\n{Fore.RED}{Style.BRIGHT}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.RED}{Style.BRIGHT}🚨 EMERGENCY SHUTDOWN{Style.RESET_ALL}")
        print(f"{Fore.RED}{Style.BRIGHT}{'═' * 70}{Style.RESET_ALL}\n")
        print(f"{Fore.RED}Reason: {reason}{Style.RESET_ALL}\n")
        print(f"Trading has been disabled.")
        print(f"Review logs and metrics before re-enabling.\n")
    
    def enable_trading(self):
        """Réactiver le trading (manual)"""
        self.trading_enabled = True
        self.shutdown_reason = None
        print(f"{Fore.GREEN}✓ Trading re-enabled{Style.RESET_ALL}")
    
    def print_dashboard(self):
        """Afficher dashboard de risque"""
        metrics = self.get_risk_metrics()
        risk_level = metrics.risk_level
        
        print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}🛡️  RISK DASHBOARD{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
        
        # Status
        status_color = Fore.GREEN if self.trading_enabled else Fore.RED
        print(f"Trading Status: {status_color}{'ENABLED' if self.trading_enabled else 'DISABLED'}{Style.RESET_ALL}")
        
        if not self.trading_enabled:
            print(f"Reason: {Fore.RED}{self.shutdown_reason}{Style.RESET_ALL}")
        
        print()
        
        # Risk Level
        if risk_level == RiskLevel.SAFE:
            level_color = Fore.GREEN
        elif risk_level == RiskLevel.MODERATE:
            level_color = Fore.YELLOW
        elif risk_level == RiskLevel.HIGH:
            level_color = Fore.MAGENTA
        elif risk_level == RiskLevel.CRITICAL:
            level_color = Fore.RED
        else:
            level_color = Fore.RED + Style.BRIGHT
        
        print(f"Risk Level: {level_color}{risk_level.value}{Style.RESET_ALL}\n")
        
        # Metrics
        print(f"{Fore.YELLOW}{'─' * 70}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Metrics{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}{'─' * 70}{Style.RESET_ALL}\n")
        
        print(f"Current Drawdown:       {metrics.current_drawdown:>6.2f}% (limit: {self.max_drawdown_pct}%)")
        print(f"Daily P&L:              ${self.daily_pnl:>8,.2f} (limit: ${-self.max_daily_loss:,.2f})")
        print(f"Consecutive Losses:     {self.consecutive_losses:>6} (limit: {self.max_consecutive_losses})")
        print(f"Trades Today:           {len(self.trades_today):>6}")
        print(f"Current Equity:         ${self.current_equity:>8,.2f}")
        print(f"Peak Equity:            ${self.peak_equity:>8,.2f}")
        
        print()
        
        # Recommendations
        print(f"{Fore.CYAN}{'─' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}Recommendations{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'─' * 70}{Style.RESET_ALL}\n")
        
        if risk_level == RiskLevel.SAFE:
            print(f"{Fore.GREEN}✓ Safe to trade normally{Style.RESET_ALL}")
            print(f"  • Position size: 100% of max")
            
        elif risk_level == RiskLevel.MODERATE:
            print(f"{Fore.YELLOW}⚠ Trade with caution{Style.RESET_ALL}")
            print(f"  • Reduce position size: 70% of max")
            print(f"  • Increase profit threshold")
            
        elif risk_level == RiskLevel.HIGH:
            print(f"{Fore.MAGENTA}🔶 High risk - reduce trading{Style.RESET_ALL}")
            print(f"  • Position size: 50% of max")
            print(f"  • Only best opportunities")
            print(f"  • Consider pausing trading")
            
        elif risk_level == RiskLevel.CRITICAL:
            print(f"{Fore.RED}🔴 Critical - stop trading{Style.RESET_ALL}")
            print(f"  • Position size: 25% of max")
            print(f"  • Emergency mode only")
            print(f"  • Review strategy")
            
        else:
            print(f"{Fore.RED}{Style.BRIGHT}🚨 EMERGENCY - trading disabled{Style.RESET_ALL}")
            print(f"  • Do not trade")
            print(f"  • Review all positions")
            print(f"  • Analyze what went wrong")
        
        print()


def demo_risk_manager():
    """Démo risk manager"""
    print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{Style.BRIGHT}🛡️  RISK MANAGER DEMO{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
    
    # Config
    config = {
        'MAX_DAILY_LOSS': 1000,
        'MAX_DRAWDOWN_PCT': 20,
        'MAX_CONSECUTIVE_LOSSES': 5,
        'MAX_POSITION_SIZE': 10000,
        'MAX_GAS_PRICE_GWEI': 100
    }
    
    rm = RiskManager(config)
    
    # Simuler trades
    print(f"{Fore.YELLOW}Simulation de trading...{Style.RESET_ALL}\n")
    
    import random
    
    scenarios = [
        ("Trade profitable", 150, True),
        ("Trade profitable", 200, True),
        ("Trade perte", -50, False),
        ("Trade profitable", 100, True),
        ("Trade perte", -80, False),
        ("Trade perte", -120, False),
        ("Trade perte", -90, False),
        ("Trade profitable", 180, True),
    ]
    
    for i, (desc, profit, success) in enumerate(scenarios, 1):
        print(f"Trade {i}: {desc} ({Fore.GREEN if profit > 0 else Fore.RED}${profit:+.2f}{Style.RESET_ALL})")
        
        # Check si on peut trader
        can_trade, reason = rm.can_trade(5000, 50)
        
        if can_trade:
            rm.record_trade(profit, success)
            print(f"  → Exécuté")
        else:
            print(f"  → {Fore.RED}Bloqué: {reason}{Style.RESET_ALL}")
            break
        
        # Position size pour prochain trade
        pos_size = rm.calculate_position_size(1.5, 50, 1.0)
        print(f"  → Position size recommandée: ${pos_size:,.0f}")
        
        print()
    
    # Dashboard final
    rm.print_dashboard()


if __name__ == "__main__":
    demo_risk_manager()
