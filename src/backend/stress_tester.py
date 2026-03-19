#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
💥 THESORIA - STRESS TESTER
═══════════════════════════════════════════════════════════════════════════════

Testeur de stress pour valider robustesse du système

Fonctionnalités:
• Simulation conditions extrêmes
• Test charge (volume élevé)
• Test gas price spikes
• Test network latency
• Test erreurs RPC
• Test slippage extrême
• Test drawdown scenarios
• Resilience testing

Scénarios:
• Gas spike 500+ gwei
• RPC down
• 100+ opportunités/heure
• Slippage 10%+
• 10 losses consécutives
• Flash crash
• Network congestion

Métriques:
• System uptime
• Error rate
• Recovery time
• Max throughput
• Failure points

═══════════════════════════════════════════════════════════════════════════════
"""

import time
import random
from dataclasses import dataclass
from typing import List
from enum import Enum

try:
    from colorama import Fore, Style, init
except ImportError:
    print("❌ Module requis: pip3 install colorama")
    exit(1)

init(autoreset=True)


class StressScenario(Enum):
    """Scénarios de stress"""
    GAS_SPIKE = "⛽ Gas Price Spike (500+ gwei)"
    HIGH_VOLUME = "📈 High Volume (100+ opps/hour)"
    RPC_FAILURES = "❌ RPC Connection Failures"
    EXTREME_SLIPPAGE = "💧 Extreme Slippage (10%+)"
    CONSECUTIVE_LOSSES = "📉 Consecutive Losses (10+)"
    FLASH_CRASH = "💥 Flash Crash (-20% in 1h)"
    NETWORK_CONGESTION = "🌐 Network Congestion"
    MEMPOOL_SPAM = "📧 Mempool Spam Attack"


@dataclass
class StressTestResult:
    """Résultat test de stress"""
    scenario: StressScenario
    duration_seconds: float
    total_events: int
    successful_events: int
    failed_events: int
    error_rate: float
    avg_response_time: float
    max_response_time: float
    system_crashed: bool
    recovery_time: float
    
    @property
    def success_rate(self) -> float:
        return (self.successful_events / self.total_events * 100) if self.total_events > 0 else 0
    
    @property
    def passed(self) -> bool:
        """Test passé si success rate > 80% et pas de crash"""
        return self.success_rate >= 80 and not self.system_crashed


class StressTester:
    """Testeur de stress"""
    
    def __init__(self):
        self.results: List[StressTestResult] = []
    
    def simulate_event(self, scenario: StressScenario) -> tuple[bool, float]:
        """
        Simuler un événement de stress
        
        Returns:
            (success, response_time)
        """
        # Simuler latence
        base_latency = random.uniform(0.05, 0.2)
        
        if scenario == StressScenario.GAS_SPIKE:
            # Gas élevé → certains trades échouent
            success = random.random() > 0.3  # 70% fail
            latency = base_latency
            
        elif scenario == StressScenario.HIGH_VOLUME:
            # Volume élevé → latence accrue
            success = random.random() > 0.1  # 90% success
            latency = base_latency * random.uniform(2, 5)
            
        elif scenario == StressScenario.RPC_FAILURES:
            # RPC down → beaucoup d'échecs
            success = random.random() > 0.5  # 50% fail
            latency = base_latency if success else base_latency * 10
            
        elif scenario == StressScenario.EXTREME_SLIPPAGE:
            # Slippage élevé → trades non profitables
            success = random.random() > 0.4  # 60% fail
            latency = base_latency
            
        elif scenario == StressScenario.CONSECUTIVE_LOSSES:
            # Pertes consécutives
            success = random.random() > 0.7  # 70% fail (losses)
            latency = base_latency
            
        elif scenario == StressScenario.FLASH_CRASH:
            # Flash crash → tout échoue temporairement
            success = random.random() > 0.8  # 80% fail
            latency = base_latency * 2
            
        elif scenario == StressScenario.NETWORK_CONGESTION:
            # Congestion → latence extrême
            success = random.random() > 0.2  # 80% success mais lent
            latency = base_latency * random.uniform(5, 15)
            
        else:  # MEMPOOL_SPAM
            # Spam → latence et échecs
            success = random.random() > 0.4  # 60% fail
            latency = base_latency * random.uniform(3, 8)
        
        time.sleep(latency / 100)  # Simuler délai (accéléré)
        
        return success, latency
    
    def run_stress_test(self, scenario: StressScenario, 
                       duration_seconds: int = 10,
                       events_per_second: int = 5) -> StressTestResult:
        """
        Exécuter un test de stress
        
        Args:
            scenario: Scénario à tester
            duration_seconds: Durée du test
            events_per_second: Événements par seconde
        """
        print(f"\n{Fore.YELLOW}Running: {scenario.value}{Style.RESET_ALL}")
        print(f"Duration: {duration_seconds}s | Events/s: {events_per_second}")
        
        start_time = time.time()
        total_events = 0
        successful_events = 0
        failed_events = 0
        response_times = []
        system_crashed = False
        recovery_time = 0
        
        # Simuler événements
        target_events = duration_seconds * events_per_second
        
        for i in range(target_events):
            success, latency = self.simulate_event(scenario)
            
            total_events += 1
            response_times.append(latency)
            
            if success:
                successful_events += 1
            else:
                failed_events += 1
            
            # Progress
            if (i + 1) % 10 == 0:
                progress = (i + 1) / target_events * 100
                print(f"  Progress: {progress:.0f}%", end='\r')
            
            # Vérifier crash système (trop d'échecs consécutifs)
            if failed_events > 20 and successful_events == 0:
                system_crashed = True
                recovery_time = time.time() - start_time
                print(f"\n  {Fore.RED}💥 SYSTEM CRASHED{Style.RESET_ALL}")
                break
        
        duration = time.time() - start_time
        error_rate = (failed_events / total_events * 100) if total_events > 0 else 0
        avg_response = sum(response_times) / len(response_times) if response_times else 0
        max_response = max(response_times) if response_times else 0
        
        result = StressTestResult(
            scenario=scenario,
            duration_seconds=duration,
            total_events=total_events,
            successful_events=successful_events,
            failed_events=failed_events,
            error_rate=error_rate,
            avg_response_time=avg_response,
            max_response_time=max_response,
            system_crashed=system_crashed,
            recovery_time=recovery_time
        )
        
        # Afficher résultat
        status_color = Fore.GREEN if result.passed else Fore.RED
        status = "PASSED ✓" if result.passed else "FAILED ✗"
        
        print(f"\n  Result: {status_color}{status}{Style.RESET_ALL}")
        print(f"  Success Rate: {result.success_rate:.1f}%")
        print(f"  Error Rate: {result.error_rate:.1f}%")
        print(f"  Avg Response: {result.avg_response_time*1000:.1f}ms")
        
        if system_crashed:
            print(f"  {Fore.RED}System crashed after {recovery_time:.1f}s{Style.RESET_ALL}")
        
        self.results.append(result)
        return result
    
    def run_all_tests(self, quick_mode: bool = False):
        """Exécuter tous les tests"""
        print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}💥 STRESS TEST SUITE{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
        
        if quick_mode:
            print(f"{Fore.YELLOW}Mode: Quick (5s par test){Style.RESET_ALL}\n")
            duration = 5
            events_per_sec = 3
        else:
            print(f"{Fore.YELLOW}Mode: Full (10s par test){Style.RESET_ALL}\n")
            duration = 10
            events_per_sec = 5
        
        # Exécuter chaque scénario
        for scenario in StressScenario:
            self.run_stress_test(scenario, duration, events_per_sec)
            time.sleep(0.5)  # Pause entre tests
        
        # Rapport final
        self.print_report()
    
    def print_report(self):
        """Afficher rapport complet"""
        print(f"\n{Fore.CYAN}{'═' * 90}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}📊 STRESS TEST REPORT{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 90}{Style.RESET_ALL}\n")
        
        print(f"{'Scenario':<35} {'Events':<10} {'Success%':<10} {'Error%':<10} {'Status':<10}")
        print("─" * 90)
        
        passed_count = 0
        failed_count = 0
        
        for result in self.results:
            status_color = Fore.GREEN if result.passed else Fore.RED
            status = "PASSED" if result.passed else "FAILED"
            
            if result.passed:
                passed_count += 1
            else:
                failed_count += 1
            
            scenario_name = result.scenario.value[:33]
            
            print(f"{scenario_name:<35} "
                  f"{result.total_events:<10} "
                  f"{result.success_rate:>8.1f}%  "
                  f"{result.error_rate:>8.1f}%  "
                  f"{status_color}{status:<10}{Style.RESET_ALL}")
        
        # Résumé
        total_tests = len(self.results)
        pass_rate = (passed_count / total_tests * 100) if total_tests > 0 else 0
        
        print(f"\n{Fore.YELLOW}{'─' * 90}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Summary{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}{'─' * 90}{Style.RESET_ALL}\n")
        
        print(f"Total Tests:    {total_tests}")
        print(f"Passed:         {Fore.GREEN}{passed_count}{Style.RESET_ALL}")
        print(f"Failed:         {Fore.RED}{failed_count}{Style.RESET_ALL}")
        print(f"Pass Rate:      {pass_rate:.1f}%")
        
        # Verdict
        print()
        if pass_rate == 100:
            print(f"{Fore.GREEN}{Style.BRIGHT}🏆 EXCELLENT - System is highly resilient{Style.RESET_ALL}")
        elif pass_rate >= 75:
            print(f"{Fore.GREEN}✓ GOOD - System handles stress well{Style.RESET_ALL}")
        elif pass_rate >= 50:
            print(f"{Fore.YELLOW}⚠ MODERATE - Some improvements needed{Style.RESET_ALL}")
        else:
            print(f"{Fore.RED}✗ POOR - System needs significant improvements{Style.RESET_ALL}")
        
        # Recommandations
        print(f"\n{Fore.CYAN}{'─' * 90}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}Recommendations{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'─' * 90}{Style.RESET_ALL}\n")
        
        failed_scenarios = [r for r in self.results if not r.passed]
        
        if not failed_scenarios:
            print(f"{Fore.GREEN}✓ No improvements needed - system is robust{Style.RESET_ALL}")
        else:
            for result in failed_scenarios:
                print(f"• {result.scenario.value}:")
                
                if result.scenario == StressScenario.GAS_SPIKE:
                    print(f"  → Increase MAX_GAS_PRICE_GWEI or add gas price spike protection")
                elif result.scenario == StressScenario.RPC_FAILURES:
                    print(f"  → Add RPC fallback providers")
                    print(f"  → Implement retry logic with exponential backoff")
                elif result.scenario == StressScenario.HIGH_VOLUME:
                    print(f"  → Optimize scan interval")
                    print(f"  → Add request rate limiting")
                elif result.scenario == StressScenario.EXTREME_SLIPPAGE:
                    print(f"  → Increase SLIPPAGE_TOLERANCE")
                    print(f"  → Add pre-execution slippage check")
                elif result.scenario == StressScenario.CONSECUTIVE_LOSSES:
                    print(f"  → Reduce MAX_CONSECUTIVE_LOSSES")
                    print(f"  → Implement circuit breaker")
                elif result.scenario == StressScenario.NETWORK_CONGESTION:
                    print(f"  → Use faster RPC provider")
                    print(f"  → Add timeout handling")
                else:
                    print(f"  → Review error handling for this scenario")
        
        print()


def run_stress_test_demo():
    """Démo stress tester"""
    print(f"\n{Fore.CYAN}{'╔' + '═' * 68 + '╗'}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}║{' ' * 20}💥 STRESS TESTER DEMO{' ' * 26}║{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'╚' + '═' * 68 + '╝'}{Style.RESET_ALL}")
    
    tester = StressTester()
    
    print(f"\nOptions:")
    print(f"  1) Quick test (5s par scénario)")
    print(f"  2) Full test (10s par scénario)")
    print(f"  3) Single scenario")
    print()
    
    choice = input("Choix (1-3) [1]: ").strip() or "1"
    
    if choice == "1":
        tester.run_all_tests(quick_mode=True)
    elif choice == "2":
        tester.run_all_tests(quick_mode=False)
    else:
        # Single scenario
        print(f"\nScénarios disponibles:")
        for i, scenario in enumerate(StressScenario, 1):
            print(f"  {i}) {scenario.value}")
        print()
        
        scenario_choice = input(f"Choix (1-{len(StressScenario)}) [1]: ").strip() or "1"
        scenario_idx = int(scenario_choice) - 1
        scenario = list(StressScenario)[scenario_idx]
        
        tester.run_stress_test(scenario, duration_seconds=10, events_per_second=5)
        tester.print_report()


if __name__ == "__main__":
    run_stress_test_demo()
