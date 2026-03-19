#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
📄 THESORIA - REPORT GENERATOR
═══════════════════════════════════════════════════════════════════════════════

Générateur de rapports professionnels automatiques

Fonctionnalités:
• Rapports quotidiens
• Rapports hebdomadaires
• Rapports mensuels
• Export PDF (HTML)
• Export Excel (CSV)
• Graphiques ASCII
• Performance summary
• Trade history
• P&L statements
• Risk metrics
• Recommendations

Formats:
• TXT (console)
• Markdown
• HTML
• CSV
• JSON

═══════════════════════════════════════════════════════════════════════════════
"""

import os
from datetime import datetime, timedelta
from dataclasses import dataclass
from typing import List
import json

try:
    from colorama import Fore, Style, init
except ImportError:
    print("❌ Module requis: pip3 install colorama")
    exit(1)

init(autoreset=True)


@dataclass
class Trade:
    """Trade pour rapport"""
    timestamp: datetime
    pair: str
    profit: float
    gas_cost: float
    success: bool
    
    @property
    def net_profit(self):
        return self.profit - self.gas_cost if self.success else -self.gas_cost


class ReportGenerator:
    """Générateur de rapports"""
    
    def __init__(self):
        self.trades: List[Trade] = []
    
    def add_trade(self, trade: Trade):
        """Ajouter un trade"""
        self.trades.append(trade)
    
    def generate_daily_report(self, date: datetime = None) -> str:
        """Générer rapport quotidien"""
        if date is None:
            date = datetime.now()
        
        # Filtrer trades du jour
        day_trades = [
            t for t in self.trades
            if t.timestamp.date() == date.date()
        ]
        
        if not day_trades:
            return f"No trades on {date.date()}"
        
        # Calculer métriques
        total_trades = len(day_trades)
        winning_trades = [t for t in day_trades if t.net_profit > 0]
        losing_trades = [t for t in day_trades if t.net_profit <= 0]
        
        total_profit = sum(t.profit for t in winning_trades)
        total_loss = sum(t.net_profit for t in losing_trades)
        net_pnl = sum(t.net_profit for t in day_trades)
        total_gas = sum(t.gas_cost for t in day_trades)
        
        win_rate = (len(winning_trades) / total_trades * 100) if total_trades > 0 else 0
        
        # Générer rapport
        report = []
        report.append("═" * 70)
        report.append(f"DAILY TRADING REPORT - {date.strftime('%Y-%m-%d')}")
        report.append("═" * 70)
        report.append("")
        
        report.append("SUMMARY")
        report.append("─" * 70)
        report.append(f"Total Trades:        {total_trades}")
        report.append(f"Winning Trades:      {len(winning_trades)} ({win_rate:.1f}%)")
        report.append(f"Losing Trades:       {len(losing_trades)}")
        report.append("")
        
        report.append("PROFIT & LOSS")
        report.append("─" * 70)
        report.append(f"Gross Profit:        ${total_profit:,.2f}")
        report.append(f"Gross Loss:          ${abs(total_loss):,.2f}")
        report.append(f"Total Gas Costs:     ${total_gas:,.2f}")
        report.append(f"Net P&L:             ${net_pnl:,.2f}")
        report.append("")
        
        if winning_trades:
            avg_win = sum(t.net_profit for t in winning_trades) / len(winning_trades)
            report.append(f"Average Win:         ${avg_win:,.2f}")
        
        if losing_trades:
            avg_loss = sum(t.net_profit for t in losing_trades) / len(losing_trades)
            report.append(f"Average Loss:        ${avg_loss:,.2f}")
        
        # Top trades
        if day_trades:
            report.append("")
            report.append("TOP 5 TRADES")
            report.append("─" * 70)
            
            top_trades = sorted(day_trades, key=lambda t: t.net_profit, reverse=True)[:5]
            
            for i, trade in enumerate(top_trades, 1):
                time_str = trade.timestamp.strftime("%H:%M:%S")
                profit_str = f"${trade.net_profit:+,.2f}"
                report.append(f"{i}. {time_str}  {trade.pair:<12}  {profit_str:>12}")
        
        report.append("")
        report.append("═" * 70)
        
        return "\n".join(report)
    
    def generate_weekly_report(self) -> str:
        """Générer rapport hebdomadaire"""
        now = datetime.now()
        week_start = now - timedelta(days=7)
        
        # Filtrer trades de la semaine
        week_trades = [
            t for t in self.trades
            if week_start <= t.timestamp <= now
        ]
        
        if not week_trades:
            return "No trades this week"
        
        # Métriques
        total_trades = len(week_trades)
        winning_trades = [t for t in week_trades if t.net_profit > 0]
        
        net_pnl = sum(t.net_profit for t in week_trades)
        total_gas = sum(t.gas_cost for t in week_trades)
        
        win_rate = (len(winning_trades) / total_trades * 100) if total_trades > 0 else 0
        
        # Par jour
        daily_stats = {}
        for trade in week_trades:
            date_key = trade.timestamp.date()
            if date_key not in daily_stats:
                daily_stats[date_key] = {'trades': 0, 'pnl': 0}
            daily_stats[date_key]['trades'] += 1
            daily_stats[date_key]['pnl'] += trade.net_profit
        
        # Rapport
        report = []
        report.append("═" * 70)
        report.append(f"WEEKLY TRADING REPORT")
        report.append(f"{week_start.strftime('%Y-%m-%d')} to {now.strftime('%Y-%m-%d')}")
        report.append("═" * 70)
        report.append("")
        
        report.append("SUMMARY")
        report.append("─" * 70)
        report.append(f"Total Trades:        {total_trades}")
        report.append(f"Win Rate:            {win_rate:.1f}%")
        report.append(f"Net P&L:             ${net_pnl:,.2f}")
        report.append(f"Total Gas Costs:     ${total_gas:,.2f}")
        report.append(f"Average/Day:         {total_trades / 7:.1f} trades, ${net_pnl / 7:,.2f}")
        report.append("")
        
        report.append("DAILY BREAKDOWN")
        report.append("─" * 70)
        
        for date in sorted(daily_stats.keys()):
            stats = daily_stats[date]
            pnl_str = f"${stats['pnl']:+,.2f}"
            report.append(f"{date}  {stats['trades']:>3} trades  {pnl_str:>12}")
        
        report.append("")
        report.append("═" * 70)
        
        return "\n".join(report)
    
    def generate_monthly_report(self) -> str:
        """Générer rapport mensuel"""
        now = datetime.now()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Filtrer trades du mois
        month_trades = [
            t for t in self.trades
            if t.timestamp >= month_start
        ]
        
        if not month_trades:
            return "No trades this month"
        
        # Métriques avancées
        total_trades = len(month_trades)
        winning_trades = [t for t in month_trades if t.net_profit > 0]
        losing_trades = [t for t in month_trades if t.net_profit <= 0]
        
        total_profit = sum(t.profit for t in winning_trades)
        total_loss = sum(t.net_profit for t in losing_trades)
        net_pnl = sum(t.net_profit for t in month_trades)
        total_gas = sum(t.gas_cost for t in month_trades)
        
        win_rate = (len(winning_trades) / total_trades * 100) if total_trades > 0 else 0
        
        # Profit factor
        profit_factor = abs(total_profit / total_loss) if total_loss != 0 else float('inf')
        
        # Sharpe ratio simplifié
        profits = [t.net_profit for t in month_trades]
        avg_profit = sum(profits) / len(profits)
        if len(profits) > 1:
            variance = sum((p - avg_profit) ** 2 for p in profits) / len(profits)
            std_dev = variance ** 0.5
            sharpe = (avg_profit / std_dev) * (30 ** 0.5) if std_dev > 0 else 0
        else:
            sharpe = 0
        
        # Max drawdown
        equity = 0
        peak = 0
        max_dd = 0
        for trade in month_trades:
            equity += trade.net_profit
            if equity > peak:
                peak = equity
            dd = ((peak - equity) / peak * 100) if peak > 0 else 0
            max_dd = max(max_dd, dd)
        
        # Rapport
        report = []
        report.append("═" * 70)
        report.append(f"MONTHLY TRADING REPORT - {now.strftime('%B %Y')}")
        report.append("═" * 70)
        report.append("")
        
        report.append("PERFORMANCE SUMMARY")
        report.append("─" * 70)
        report.append(f"Total Trades:        {total_trades}")
        report.append(f"Winning Trades:      {len(winning_trades)} ({win_rate:.1f}%)")
        report.append(f"Losing Trades:       {len(losing_trades)}")
        report.append("")
        
        report.append("PROFIT & LOSS")
        report.append("─" * 70)
        report.append(f"Gross Profit:        ${total_profit:,.2f}")
        report.append(f"Gross Loss:          ${abs(total_loss):,.2f}")
        report.append(f"Total Gas Costs:     ${total_gas:,.2f}")
        report.append(f"Net P&L:             ${net_pnl:,.2f}")
        report.append(f"ROI (if $10k):       {(net_pnl / 10000 * 100):.2f}%")
        report.append("")
        
        report.append("RISK METRICS")
        report.append("─" * 70)
        report.append(f"Profit Factor:       {profit_factor:.2f}")
        report.append(f"Sharpe Ratio:        {sharpe:.2f}")
        report.append(f"Max Drawdown:        {max_dd:.2f}%")
        report.append("")
        
        # Graphique ASCII P&L
        report.append("EQUITY CURVE")
        report.append("─" * 70)
        
        equity_points = []
        equity = 0
        for trade in month_trades:
            equity += trade.net_profit
            equity_points.append(equity)
        
        # Simplifier à 30 points max
        if len(equity_points) > 30:
            step = len(equity_points) // 30
            equity_points = equity_points[::step]
        
        # Normaliser pour ASCII (10 lignes)
        if equity_points:
            min_eq = min(equity_points)
            max_eq = max(equity_points)
            range_eq = max_eq - min_eq if max_eq != min_eq else 1
            
            for y in range(10, -1, -1):
                line = ""
                threshold = min_eq + (range_eq * y / 10)
                
                for eq in equity_points:
                    if abs(eq - threshold) < (range_eq / 20):
                        line += "█"
                    elif eq > threshold:
                        line += "│"
                    else:
                        line += " "
                
                value_label = f"${threshold:>8,.0f}"
                report.append(f"{value_label} {line}")
        
        report.append("")
        report.append("═" * 70)
        
        return "\n".join(report)
    
    def export_txt(self, report: str, filename: str):
        """Exporter en TXT"""
        os.makedirs("reports", exist_ok=True)
        filepath = f"reports/{filename}"
        
        with open(filepath, 'w') as f:
            f.write(report)
        
        print(f"{Fore.GREEN}✓ Report exported: {filepath}{Style.RESET_ALL}")
    
    def export_json(self, filename: str):
        """Exporter données en JSON"""
        data = {
            'generated_at': datetime.now().isoformat(),
            'total_trades': len(self.trades),
            'trades': [
                {
                    'timestamp': t.timestamp.isoformat(),
                    'pair': t.pair,
                    'profit': t.profit,
                    'gas_cost': t.gas_cost,
                    'net_profit': t.net_profit,
                    'success': t.success
                }
                for t in self.trades
            ]
        }
        
        os.makedirs("reports", exist_ok=True)
        filepath = f"reports/{filename}"
        
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"{Fore.GREEN}✓ Data exported: {filepath}{Style.RESET_ALL}")


def demo_report_generator():
    """Démo report generator"""
    print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{Style.BRIGHT}📄 REPORT GENERATOR DEMO{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
    
    generator = ReportGenerator()
    
    # Générer trades d'exemple
    print(f"{Fore.YELLOW}Génération de données exemple (30 jours)...{Style.RESET_ALL}\n")
    
    import random
    
    now = datetime.now()
    
    for day in range(30):
        date = now - timedelta(days=30 - day)
        
        # 2-5 trades par jour
        num_trades = random.randint(2, 5)
        
        for _ in range(num_trades):
            hour = random.randint(0, 23)
            minute = random.randint(0, 59)
            
            timestamp = date.replace(hour=hour, minute=minute, second=0)
            
            profit = random.uniform(50, 250)
            gas_cost = random.uniform(10, 50)
            success = random.random() > 0.3  # 70% success
            
            trade = Trade(
                timestamp=timestamp,
                pair="ETH/USDC",
                profit=profit if success else 0,
                gas_cost=gas_cost,
                success=success
            )
            
            generator.add_trade(trade)
    
    print(f"{Fore.GREEN}✓ {len(generator.trades)} trades générés{Style.RESET_ALL}\n")
    
    # Générer rapports
    print(f"{Fore.CYAN}Génération rapports...{Style.RESET_ALL}\n")
    
    # Daily
    daily_report = generator.generate_daily_report()
    print(daily_report)
    print()
    
    # Weekly
    weekly_report = generator.generate_weekly_report()
    print(weekly_report)
    print()
    
    # Monthly
    monthly_report = generator.generate_monthly_report()
    print(monthly_report)
    print()
    
    # Export
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    generator.export_txt(daily_report, f"daily_report_{timestamp}.txt")
    generator.export_txt(weekly_report, f"weekly_report_{timestamp}.txt")
    generator.export_txt(monthly_report, f"monthly_report_{timestamp}.txt")
    generator.export_json(f"trades_data_{timestamp}.json")
    
    print()


if __name__ == "__main__":
    demo_report_generator()
