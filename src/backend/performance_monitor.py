#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
🚀 THESORIA - PERFORMANCE MONITOR
═══════════════════════════════════════════════════════════════════════════════

Moniteur de performance système en temps réel:
• Vitesse RPC
• Latence réseau
• Temps de réponse DEX
• Gas tracker
• Opportunités rate
• Success rate
• Profit tracking

═══════════════════════════════════════════════════════════════════════════════
"""

import asyncio
import time
import json
from datetime import datetime, timedelta
from collections import deque
from pathlib import Path
import os
from dotenv import load_dotenv

try:
    from web3 import Web3
    import aiohttp
    from colorama import Fore, Style, init
except ImportError:
    print("❌ Modules requis: pip3 install web3 aiohttp colorama")
    exit(1)

init(autoreset=True)
load_dotenv()


class PerformanceMonitor:
    """Moniteur de performance système"""
    
    def __init__(self):
        self.rpc_url = os.getenv("ETH_RPC_URL")
        self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
        
        # Métriques
        self.metrics = {
            "rpc_latency": deque(maxlen=100),
            "gas_prices": deque(maxlen=100),
            "block_times": deque(maxlen=50),
            "opportunities_detected": 0,
            "opportunities_executed": 0,
            "total_profit_usd": 0.0,
            "total_gas_cost_usd": 0.0,
            "success_rate": 0.0,
            "uptime_start": datetime.now(),
            "errors": deque(maxlen=50),
        }
        
        # Stats par heure
        self.hourly_stats = {
            "opportunities": 0,
            "executions": 0,
            "profit": 0.0,
            "last_reset": datetime.now()
        }
        
        self.running = True
    
    def clear_screen(self):
        """Nettoyer écran"""
        os.system('clear' if os.name != 'nt' else 'cls')
    
    async def measure_rpc_latency(self):
        """Mesurer latence RPC"""
        try:
            start = time.time()
            self.w3.eth.block_number
            latency = (time.time() - start) * 1000  # ms
            self.metrics["rpc_latency"].append(latency)
            return latency
        except Exception as e:
            self.metrics["errors"].append(str(e))
            return None
    
    async def measure_gas_price(self):
        """Mesurer gas price"""
        try:
            gas_wei = self.w3.eth.gas_price
            gas_gwei = self.w3.from_wei(gas_wei, 'gwei')
            self.metrics["gas_prices"].append(gas_gwei)
            return gas_gwei
        except Exception as e:
            self.metrics["errors"].append(str(e))
            return None
    
    async def measure_block_time(self):
        """Mesurer temps entre blocs"""
        try:
            latest_block = self.w3.eth.get_block('latest')
            prev_block = self.w3.eth.get_block(latest_block['number'] - 1)
            
            block_time = latest_block['timestamp'] - prev_block['timestamp']
            self.metrics["block_times"].append(block_time)
            return block_time
        except Exception as e:
            self.metrics["errors"].append(str(e))
            return None
    
    def get_avg_metric(self, metric_name):
        """Obtenir moyenne d'une métrique"""
        data = self.metrics.get(metric_name, [])
        if not data:
            return 0
        return sum(data) / len(data)
    
    def get_uptime(self):
        """Obtenir uptime"""
        delta = datetime.now() - self.metrics["uptime_start"]
        hours = delta.total_seconds() / 3600
        return hours
    
    def calculate_success_rate(self):
        """Calculer taux de succès"""
        detected = self.metrics["opportunities_detected"]
        executed = self.metrics["opportunities_executed"]
        
        if detected == 0:
            return 0.0
        
        return (executed / detected) * 100
    
    def calculate_net_profit(self):
        """Calculer profit net"""
        return self.metrics["total_profit_usd"] - self.metrics["total_gas_cost_usd"]
    
    def reset_hourly_stats(self):
        """Reset stats horaires"""
        now = datetime.now()
        if (now - self.hourly_stats["last_reset"]).total_seconds() >= 3600:
            self.hourly_stats = {
                "opportunities": 0,
                "executions": 0,
                "profit": 0.0,
                "last_reset": now
            }
    
    def format_metric(self, value, metric_type="latency"):
        """Formater métrique avec couleur"""
        if metric_type == "latency":
            if value < 200:
                return f"{Fore.GREEN}{value:.0f}ms{Style.RESET_ALL}"
            elif value < 500:
                return f"{Fore.YELLOW}{value:.0f}ms{Style.RESET_ALL}"
            else:
                return f"{Fore.RED}{value:.0f}ms{Style.RESET_ALL}"
        
        elif metric_type == "gas":
            if value < 30:
                return f"{Fore.GREEN}{value:.1f} gwei{Style.RESET_ALL}"
            elif value < 100:
                return f"{Fore.YELLOW}{value:.1f} gwei{Style.RESET_ALL}"
            else:
                return f"{Fore.RED}{value:.1f} gwei{Style.RESET_ALL}"
        
        elif metric_type == "profit":
            if value > 0:
                return f"{Fore.GREEN}${value:,.2f}{Style.RESET_ALL}"
            elif value == 0:
                return f"{Fore.YELLOW}${value:,.2f}{Style.RESET_ALL}"
            else:
                return f"{Fore.RED}${value:,.2f}{Style.RESET_ALL}"
        
        return str(value)
    
    def display_dashboard(self):
        """Afficher dashboard"""
        self.clear_screen()
        
        # Header
        print("╔" + "═" * 78 + "╗")
        print("║" + f"{Fore.CYAN}{Style.BRIGHT} THESORIA - PERFORMANCE MONITOR ".center(88) + f"{Style.RESET_ALL}║")
        print("╚" + "═" * 78 + "╝")
        print()
        
        # Uptime
        uptime = self.get_uptime()
        print(f"⏱️  Uptime: {Fore.CYAN}{uptime:.2f}h{Style.RESET_ALL} | " + 
              f"Started: {self.metrics['uptime_start'].strftime('%H:%M:%S')}")
        print()
        
        # ════════════════════════════════════════════════════════════════
        # NETWORK PERFORMANCE
        # ════════════════════════════════════════════════════════════════
        print(f"{Fore.YELLOW}{'═' * 80}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}{Style.BRIGHT}🌐 NETWORK PERFORMANCE{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}{'═' * 80}{Style.RESET_ALL}")
        print()
        
        # RPC Latency
        avg_latency = self.get_avg_metric("rpc_latency")
        min_latency = min(self.metrics["rpc_latency"]) if self.metrics["rpc_latency"] else 0
        max_latency = max(self.metrics["rpc_latency"]) if self.metrics["rpc_latency"] else 0
        
        print(f"RPC Latency:")
        print(f"  • Current:  {self.format_metric(self.metrics['rpc_latency'][-1] if self.metrics['rpc_latency'] else 0, 'latency')}")
        print(f"  • Average:  {self.format_metric(avg_latency, 'latency')}")
        print(f"  • Min/Max:  {min_latency:.0f}ms / {max_latency:.0f}ms")
        print()
        
        # Gas Prices
        avg_gas = self.get_avg_metric("gas_prices")
        min_gas = min(self.metrics["gas_prices"]) if self.metrics["gas_prices"] else 0
        max_gas = max(self.metrics["gas_prices"]) if self.metrics["gas_prices"] else 0
        
        print(f"Gas Prices:")
        print(f"  • Current:  {self.format_metric(self.metrics['gas_prices'][-1] if self.metrics['gas_prices'] else 0, 'gas')}")
        print(f"  • Average:  {self.format_metric(avg_gas, 'gas')}")
        print(f"  • Min/Max:  {min_gas:.1f} / {max_gas:.1f} gwei")
        print()
        
        # Block Time
        avg_block_time = self.get_avg_metric("block_times")
        print(f"Block Time:")
        print(f"  • Average:  {Fore.CYAN}{avg_block_time:.1f}s{Style.RESET_ALL}")
        print()
        
        # ════════════════════════════════════════════════════════════════
        # TRADING PERFORMANCE
        # ════════════════════════════════════════════════════════════════
        print(f"{Fore.GREEN}{'═' * 80}{Style.RESET_ALL}")
        print(f"{Fore.GREEN}{Style.BRIGHT}📊 TRADING PERFORMANCE{Style.RESET_ALL}")
        print(f"{Fore.GREEN}{'═' * 80}{Style.RESET_ALL}")
        print()
        
        # Opportunities
        success_rate = self.calculate_success_rate()
        print(f"Opportunities:")
        print(f"  • Detected:  {Fore.CYAN}{self.metrics['opportunities_detected']}{Style.RESET_ALL}")
        print(f"  • Executed:  {Fore.GREEN}{self.metrics['opportunities_executed']}{Style.RESET_ALL}")
        print(f"  • Success:   {Fore.YELLOW}{success_rate:.1f}%{Style.RESET_ALL}")
        print()
        
        # Profit/Loss
        net_profit = self.calculate_net_profit()
        print(f"Profit/Loss:")
        print(f"  • Gross:     {self.format_metric(self.metrics['total_profit_usd'], 'profit')}")
        print(f"  • Gas Cost:  {Fore.RED}${self.metrics['total_gas_cost_usd']:,.2f}{Style.RESET_ALL}")
        print(f"  • Net:       {self.format_metric(net_profit, 'profit')}")
        print()
        
        # Hourly Stats
        self.reset_hourly_stats()
        print(f"This Hour:")
        print(f"  • Opportunities: {self.hourly_stats['opportunities']}")
        print(f"  • Executions:    {self.hourly_stats['executions']}")
        print(f"  • Profit:        ${self.hourly_stats['profit']:,.2f}")
        print()
        
        # ════════════════════════════════════════════════════════════════
        # SYSTEM HEALTH
        # ════════════════════════════════════════════════════════════════
        print(f"{Fore.MAGENTA}{'═' * 80}{Style.RESET_ALL}")
        print(f"{Fore.MAGENTA}{Style.BRIGHT}🔧 SYSTEM HEALTH{Style.RESET_ALL}")
        print(f"{Fore.MAGENTA}{'═' * 80}{Style.RESET_ALL}")
        print()
        
        # Status
        rpc_ok = avg_latency < 500 if avg_latency else False
        gas_ok = avg_gas < 100 if avg_gas else False
        
        print(f"Status:")
        print(f"  • RPC:       {Fore.GREEN}✓ Operational{Style.RESET_ALL}" if rpc_ok else f"  • RPC:       {Fore.RED}✗ Slow{Style.RESET_ALL}")
        print(f"  • Gas:       {Fore.GREEN}✓ Acceptable{Style.RESET_ALL}" if gas_ok else f"  • Gas:       {Fore.RED}✗ High{Style.RESET_ALL}")
        print(f"  • Errors:    {len(self.metrics['errors'])} in buffer")
        print()
        
        # Recent Errors
        if self.metrics["errors"]:
            print(f"Recent Errors (last 3):")
            for error in list(self.metrics["errors"])[-3:]:
                print(f"  • {Fore.RED}{error[:60]}...{Style.RESET_ALL}")
        else:
            print(f"{Fore.GREEN}✓ No recent errors{Style.RESET_ALL}")
        
        print()
        print("═" * 80)
        print(f"{Fore.CYAN}Press CTRL+C to exit{Style.RESET_ALL}")
    
    async def monitor_loop(self):
        """Boucle principale de monitoring"""
        print(f"{Fore.CYAN}Starting Performance Monitor...{Style.RESET_ALL}\n")
        
        while self.running:
            try:
                # Mesurer métriques
                await self.measure_rpc_latency()
                await self.measure_gas_price()
                
                # Block time moins fréquent
                if len(self.metrics["block_times"]) < 10:
                    await self.measure_block_time()
                
                # Afficher dashboard
                self.display_dashboard()
                
                # Attendre avant prochain refresh
                await asyncio.sleep(5)
                
            except KeyboardInterrupt:
                self.running = False
                break
            except Exception as e:
                self.metrics["errors"].append(str(e))
                await asyncio.sleep(5)
        
        print(f"\n{Fore.YELLOW}Monitor stopped.{Style.RESET_ALL}\n")
    
    async def run(self):
        """Lancer monitoring"""
        await self.monitor_loop()


async def main():
    """Point d'entrée"""
    monitor = PerformanceMonitor()
    await monitor.run()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n⚠️  Monitor arrêté.\n")
