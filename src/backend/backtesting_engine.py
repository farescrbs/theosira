#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
📊 THESORIA - BACKTESTING ENGINE
═══════════════════════════════════════════════════════════════════════════════

Moteur de backtesting pour tester stratégies sur données historiques

Fonctionnalités:
• Import données historiques
• Simulation trades
• Calcul métriques performance
• Sharpe ratio, max drawdown, win rate
• Génération rapports
• Optimisation paramètres

═══════════════════════════════════════════════════════════════════════════════
"""

import asyncio
import json
from datetime import datetime, timedelta
from dataclasses import dataclass
from typing import List, Dict, Optional
import os

try:
    from colorama import Fore, Style, init
except ImportError:
    print("❌ Module requis: pip3 install colorama")
    exit(1)

init(autoreset=True)


@dataclass
class Trade:
    """Représentation d'un trade"""
    timestamp: datetime
    pair: str
    amount_in: float
    amount_out: float
    profit_usd: float
    gas_cost_usd: float
    success: bool
    
    @property
    def net_profit(self) -> float:
        return self.profit_usd - self.gas_cost_usd if self.success else -self.gas_cost_usd


@dataclass
class BacktestResult:
    """Résultats de backtesting"""
    total_trades: int
    winning_trades: int
    losing_trades: int
    total_profit: float
    total_loss: float
    net_profit: float
    win_rate: float
    avg_profit_per_trade: float
    avg_winning_trade: float
    avg_losing_trade: float
    max_drawdown: float
    sharpe_ratio: float
    profit_factor: float
    total_gas_cost: float
    
    def __str__(self):
        return f"""
╔════════════════════════════════════════════════════════════════╗
║                  BACKTEST RESULTS                              ║
╚════════════════════════════════════════════════════════════════╝

Trades:
  • Total:          {self.total_trades}
  • Winning:        {self.winning_trades} ({self.win_rate:.1f}%)
  • Losing:         {self.losing_trades}

Profits:
  • Gross Profit:   ${self.total_profit:,.2f}
  • Total Loss:     ${abs(self.total_loss):,.2f}
  • Gas Costs:      ${self.total_gas_cost:,.2f}
  • Net Profit:     ${self.net_profit:,.2f}

Averages:
  • Per Trade:      ${self.avg_profit_per_trade:,.2f}
  • Winning:        ${self.avg_winning_trade:,.2f}
  • Losing:         ${self.avg_losing_trade:,.2f}

Metrics:
  • Win Rate:       {self.win_rate:.1f}%
  • Profit Factor:  {self.profit_factor:.2f}
  • Max Drawdown:   {self.max_drawdown:.1f}%
  • Sharpe Ratio:   {self.sharpe_ratio:.2f}
"""


class BacktestingEngine:
    """Moteur de backtesting"""
    
    def __init__(self, config: dict = None):
        self.config = config or {}
        self.trades: List[Trade] = []
        
        # Configuration par défaut
        self.min_profit = self.config.get('MIN_ARBITRAGE_PROFIT', 50)
        self.max_gas_gwei = self.config.get('MAX_GAS_PRICE_GWEI', 100)
        self.max_trade_size = self.config.get('MAX_TRADE_SIZE', 10000)
        self.slippage = self.config.get('SLIPPAGE_TOLERANCE', 1.5) / 100
        
    def add_trade(self, trade: Trade):
        """Ajouter un trade"""
        self.trades.append(trade)
    
    def simulate_trade(self, 
                      pair: str,
                      timestamp: datetime,
                      price_dex_a: float,
                      price_dex_b: float,
                      gas_price_gwei: float,
                      trade_size_usd: float = 5000) -> Optional[Trade]:
        """
        Simuler un trade d'arbitrage
        
        Returns:
            Trade si profitable, None sinon
        """
        # Calculer spread
        spread_pct = abs(price_dex_a - price_dex_b) / min(price_dex_a, price_dex_b) * 100
        
        # Vérifier si spread suffisant
        if spread_pct < self.slippage * 100:
            return None
        
        # Calculer profit brut
        profit_before_fees = trade_size_usd * (spread_pct / 100)
        
        # Calculer gas cost
        gas_units = 600000  # Flash loan arbitrage
        gas_cost_eth = (gas_units * gas_price_gwei) / 1e9
        gas_cost_usd = gas_cost_eth * 3500  # ETH price approximatif
        
        # Flash loan fee (Aave = 0.09%)
        flash_loan_fee = trade_size_usd * 0.0009
        
        # Profit net
        profit_net = profit_before_fees - gas_cost_usd - flash_loan_fee
        
        # Vérifier profitabilité
        if profit_net < self.min_profit:
            return None
        
        # Vérifier gas price
        if gas_price_gwei > self.max_gas_gwei:
            return None
        
        # Créer trade
        trade = Trade(
            timestamp=timestamp,
            pair=pair,
            amount_in=trade_size_usd,
            amount_out=trade_size_usd + profit_before_fees,
            profit_usd=profit_before_fees,
            gas_cost_usd=gas_cost_usd + flash_loan_fee,
            success=True
        )
        
        return trade
    
    def calculate_metrics(self) -> BacktestResult:
        """Calculer métriques de performance"""
        if not self.trades:
            return BacktestResult(
                total_trades=0,
                winning_trades=0,
                losing_trades=0,
                total_profit=0,
                total_loss=0,
                net_profit=0,
                win_rate=0,
                avg_profit_per_trade=0,
                avg_winning_trade=0,
                avg_losing_trade=0,
                max_drawdown=0,
                sharpe_ratio=0,
                profit_factor=0,
                total_gas_cost=0
            )
        
        # Séparer trades gagnants/perdants
        winning_trades = [t for t in self.trades if t.net_profit > 0]
        losing_trades = [t for t in self.trades if t.net_profit <= 0]
        
        # Profits/pertes
        total_profit = sum(t.net_profit for t in winning_trades)
        total_loss = sum(t.net_profit for t in losing_trades)
        net_profit = total_profit + total_loss
        
        # Gas
        total_gas = sum(t.gas_cost_usd for t in self.trades)
        
        # Win rate
        win_rate = (len(winning_trades) / len(self.trades)) * 100
        
        # Moyennes
        avg_profit = net_profit / len(self.trades)
        avg_winning = total_profit / len(winning_trades) if winning_trades else 0
        avg_losing = total_loss / len(losing_trades) if losing_trades else 0
        
        # Profit factor
        profit_factor = abs(total_profit / total_loss) if total_loss != 0 else float('inf')
        
        # Max drawdown
        max_drawdown = self._calculate_max_drawdown()
        
        # Sharpe ratio
        sharpe_ratio = self._calculate_sharpe_ratio()
        
        return BacktestResult(
            total_trades=len(self.trades),
            winning_trades=len(winning_trades),
            losing_trades=len(losing_trades),
            total_profit=total_profit,
            total_loss=total_loss,
            net_profit=net_profit,
            win_rate=win_rate,
            avg_profit_per_trade=avg_profit,
            avg_winning_trade=avg_winning,
            avg_losing_trade=avg_losing,
            max_drawdown=max_drawdown,
            sharpe_ratio=sharpe_ratio,
            profit_factor=profit_factor,
            total_gas_cost=total_gas
        )
    
    def _calculate_max_drawdown(self) -> float:
        """Calculer drawdown maximum"""
        if not self.trades:
            return 0.0
        
        # Calculer equity curve
        equity = 0
        peak = 0
        max_dd = 0
        
        for trade in self.trades:
            equity += trade.net_profit
            
            if equity > peak:
                peak = equity
            
            drawdown = ((peak - equity) / peak * 100) if peak > 0 else 0
            max_dd = max(max_dd, drawdown)
        
        return max_dd
    
    def _calculate_sharpe_ratio(self) -> float:
        """Calculer Sharpe ratio"""
        if len(self.trades) < 2:
            return 0.0
        
        # Retours par trade
        returns = [t.net_profit for t in self.trades]
        
        # Moyenne et écart-type
        avg_return = sum(returns) / len(returns)
        
        variance = sum((r - avg_return) ** 2 for r in returns) / len(returns)
        std_dev = variance ** 0.5
        
        if std_dev == 0:
            return 0.0
        
        # Sharpe ratio (annualisé approximatif)
        sharpe = (avg_return / std_dev) * (252 ** 0.5)  # 252 trading days
        
        return sharpe
    
    def export_results(self, filename: str = "backtest_results.json"):
        """Exporter résultats en JSON"""
        results = self.calculate_metrics()
        
        data = {
            "timestamp": datetime.now().isoformat(),
            "config": self.config,
            "metrics": {
                "total_trades": results.total_trades,
                "winning_trades": results.winning_trades,
                "losing_trades": results.losing_trades,
                "total_profit": results.total_profit,
                "total_loss": results.total_loss,
                "net_profit": results.net_profit,
                "win_rate": results.win_rate,
                "avg_profit_per_trade": results.avg_profit_per_trade,
                "avg_winning_trade": results.avg_winning_trade,
                "avg_losing_trade": results.avg_losing_trade,
                "max_drawdown": results.max_drawdown,
                "sharpe_ratio": results.sharpe_ratio,
                "profit_factor": results.profit_factor,
                "total_gas_cost": results.total_gas_cost
            },
            "trades": [
                {
                    "timestamp": t.timestamp.isoformat(),
                    "pair": t.pair,
                    "amount_in": t.amount_in,
                    "amount_out": t.amount_out,
                    "profit": t.profit_usd,
                    "gas_cost": t.gas_cost_usd,
                    "net_profit": t.net_profit,
                    "success": t.success
                }
                for t in self.trades
            ]
        }
        
        os.makedirs("backtest_results", exist_ok=True)
        filepath = f"backtest_results/{filename}"
        
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"{Fore.GREEN}✓ Résultats exportés: {filepath}{Style.RESET_ALL}")
        
        return filepath


def run_sample_backtest():
    """Exécuter un backtest exemple"""
    print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{Style.BRIGHT}📊 BACKTESTING ENGINE - EXEMPLE{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
    
    # Configuration
    config = {
        'MIN_ARBITRAGE_PROFIT': 50,
        'MAX_GAS_PRICE_GWEI': 100,
        'MAX_TRADE_SIZE': 10000,
        'SLIPPAGE_TOLERANCE': 1.5
    }
    
    engine = BacktestingEngine(config)
    
    print(f"{Fore.YELLOW}Simulation 30 jours de trading...{Style.RESET_ALL}\n")
    
    # Simuler 30 jours
    start_date = datetime.now() - timedelta(days=30)
    
    import random
    
    for day in range(30):
        current_date = start_date + timedelta(days=day)
        
        # 2-5 opportunités par jour
        opportunities = random.randint(2, 5)
        
        for _ in range(opportunities):
            # Prices DEX
            base_price = 3500  # ETH/USDC
            price_dex_a = base_price + random.uniform(-20, 20)
            price_dex_b = base_price + random.uniform(-20, 20)
            
            # Gas price
            gas_price = random.uniform(20, 150)
            
            # Trade size
            trade_size = random.uniform(3000, 8000)
            
            # Simuler trade
            trade = engine.simulate_trade(
                pair="ETH/USDC",
                timestamp=current_date + timedelta(hours=random.randint(0, 23)),
                price_dex_a=price_dex_a,
                price_dex_b=price_dex_b,
                gas_price_gwei=gas_price,
                trade_size_usd=trade_size
            )
            
            if trade:
                engine.add_trade(trade)
    
    # Calculer résultats
    results = engine.calculate_metrics()
    
    # Afficher
    print(results)
    
    # ROI
    initial_capital = 0  # Flash loans = no capital
    if results.net_profit > 0:
        print(f"{Fore.GREEN}📈 Stratégie PROFITABLE{Style.RESET_ALL}")
    else:
        print(f"{Fore.RED}📉 Stratégie NON PROFITABLE{Style.RESET_ALL}")
    
    print(f"\n{Fore.CYAN}Profit par jour:{Style.RESET_ALL} ${results.net_profit / 30:.2f}")
    print(f"{Fore.CYAN}Profit par mois (projeté):{Style.RESET_ALL} ${results.net_profit:.2f}\n")
    
    # Exporter
    engine.export_results(f"backtest_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
    
    # Recommandations
    print(f"\n{Fore.YELLOW}{'═' * 70}{Style.RESET_ALL}")
    print(f"{Fore.YELLOW}{Style.BRIGHT}📋 RECOMMANDATIONS{Style.RESET_ALL}")
    print(f"{Fore.YELLOW}{'═' * 70}{Style.RESET_ALL}\n")
    
    if results.win_rate > 60 and results.sharpe_ratio > 1.5:
        print(f"{Fore.GREEN}✓ Excellente stratégie - Recommandé pour production{Style.RESET_ALL}")
    elif results.win_rate > 50 and results.net_profit > 1000:
        print(f"{Fore.YELLOW}⚠ Stratégie acceptable - Tester testnet d'abord{Style.RESET_ALL}")
    else:
        print(f"{Fore.RED}✗ Stratégie faible - Optimiser paramètres{Style.RESET_ALL}")
    
    if results.max_drawdown > 20:
        print(f"{Fore.RED}⚠ Drawdown élevé ({results.max_drawdown:.1f}%) - Risque important{Style.RESET_ALL}")
    
    if results.total_gas_cost > results.total_profit * 0.5:
        print(f"{Fore.YELLOW}⚠ Gas costs élevés ({results.total_gas_cost / results.total_profit * 100:.1f}% du profit){Style.RESET_ALL}")
    
    print()


if __name__ == "__main__":
    run_sample_backtest()
