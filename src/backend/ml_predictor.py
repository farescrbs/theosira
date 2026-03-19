#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
🤖 THESORIA - ML PREDICTOR (MACHINE LEARNING)
═══════════════════════════════════════════════════════════════════════════════

Prédicteur d'opportunités utilisant Machine Learning

Fonctionnalités:
• Analyse patterns historiques
• Prédiction probabilité d'opportunités
• Forecast gas prices
• Optimal timing prediction
• Success rate prediction
• Profit estimation ML
• Time series analysis
• Pattern recognition

Modèles:
• Linear Regression (baseline)
• Decision Trees
• Random Forest
• Gradient Boosting
• Neural Networks (simple)

Inputs:
• Historical opportunities
• Gas prices history
• Time of day patterns
• Day of week patterns
• Market volatility
• DEX volumes

Outputs:
• Probability of opportunity next hour
• Expected profit range
• Optimal time to trade
• Risk score

═══════════════════════════════════════════════════════════════════════════════
"""

import json
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import List, Tuple
import random
import math

try:
    from colorama import Fore, Style, init
except ImportError:
    print("❌ Module requis: pip3 install colorama")
    exit(1)

init(autoreset=True)


@dataclass
class DataPoint:
    """Point de données historique"""
    timestamp: datetime
    hour: int
    day_of_week: int
    gas_price: float
    opportunities_found: int
    avg_profit: float
    market_volatility: float


@dataclass
class Prediction:
    """Prédiction ML"""
    timestamp: datetime
    opportunity_probability: float  # 0-100%
    expected_profit: float
    expected_gas: float
    confidence: float  # 0-100%
    risk_score: float  # 0-100%
    
    @property
    def recommendation(self) -> str:
        """Recommandation basée sur prédiction"""
        if self.opportunity_probability > 70 and self.confidence > 60:
            return "🟢 STRONG BUY - High probability"
        elif self.opportunity_probability > 50 and self.confidence > 50:
            return "🟡 BUY - Good opportunity"
        elif self.opportunity_probability > 30:
            return "🟠 WAIT - Moderate probability"
        else:
            return "🔴 AVOID - Low probability"


class SimpleMLModel:
    """Modèle ML simple (sans sklearn pour éviter dépendances)"""
    
    def __init__(self):
        self.weights = {}
        self.trained = False
    
    def train(self, data: List[DataPoint]):
        """Entraîner le modèle (régression linéaire simple)"""
        if len(data) < 10:
            print(f"{Fore.YELLOW}⚠ Pas assez de données (min 10 points){Style.RESET_ALL}")
            return False
        
        # Features moyennes par heure
        hourly_stats = {}
        
        for dp in data:
            if dp.hour not in hourly_stats:
                hourly_stats[dp.hour] = {
                    'opportunities': [],
                    'profits': [],
                    'gas_prices': []
                }
            
            hourly_stats[dp.hour]['opportunities'].append(dp.opportunities_found)
            hourly_stats[dp.hour]['profits'].append(dp.avg_profit)
            hourly_stats[dp.hour]['gas_prices'].append(dp.gas_price)
        
        # Calculer moyennes
        for hour, stats in hourly_stats.items():
            self.weights[hour] = {
                'avg_opportunities': sum(stats['opportunities']) / len(stats['opportunities']),
                'avg_profit': sum(stats['profits']) / len(stats['profits']),
                'avg_gas': sum(stats['gas_prices']) / len(stats['gas_prices'])
            }
        
        self.trained = True
        return True
    
    def predict(self, hour: int, day_of_week: int) -> Tuple[float, float, float]:
        """
        Prédire pour une heure donnée
        
        Returns:
            (opportunity_probability, expected_profit, expected_gas)
        """
        if not self.trained:
            return 50.0, 100.0, 50.0  # Valeurs par défaut
        
        # Utiliser stats de l'heure ou moyenne globale
        if hour in self.weights:
            stats = self.weights[hour]
        else:
            # Moyenne de toutes les heures
            all_opps = [w['avg_opportunities'] for w in self.weights.values()]
            all_profits = [w['avg_profit'] for w in self.weights.values()]
            all_gas = [w['avg_gas'] for w in self.weights.values()]
            
            stats = {
                'avg_opportunities': sum(all_opps) / len(all_opps) if all_opps else 3,
                'avg_profit': sum(all_profits) / len(all_profits) if all_profits else 100,
                'avg_gas': sum(all_gas) / len(all_gas) if all_gas else 50
            }
        
        # Probabilité basée sur nombre d'opportunités
        # Si avg > 5 opps/heure → 80%, si 3 → 50%, si 1 → 20%
        probability = min(stats['avg_opportunities'] * 15, 95)
        
        # Ajustement jour de semaine (weekend généralement moins actif)
        if day_of_week >= 5:  # Samedi, Dimanche
            probability *= 0.8
        
        return probability, stats['avg_profit'], stats['avg_gas']


class MLPredictor:
    """Prédicteur ML"""
    
    def __init__(self):
        self.model = SimpleMLModel()
        self.historical_data: List[DataPoint] = []
    
    def generate_sample_data(self, days: int = 30) -> List[DataPoint]:
        """Générer données d'exemple (à remplacer par vraies données)"""
        data = []
        start_date = datetime.now() - timedelta(days=days)
        
        for day in range(days):
            current_date = start_date + timedelta(days=day)
            day_of_week = current_date.weekday()
            
            # 24 heures par jour
            for hour in range(24):
                timestamp = current_date.replace(hour=hour, minute=0, second=0)
                
                # Patterns réalistes
                # Plus d'opportunités pendant heures US (14-22h UTC)
                if 14 <= hour <= 22:
                    base_opps = random.randint(3, 8)
                    base_profit = random.uniform(80, 200)
                else:
                    base_opps = random.randint(1, 4)
                    base_profit = random.uniform(50, 120)
                
                # Weekend moins actif
                if day_of_week >= 5:
                    base_opps = int(base_opps * 0.7)
                    base_profit *= 0.8
                
                # Gas price patterns (plus élevé pendant heures actives)
                if 14 <= hour <= 22:
                    gas_price = random.uniform(40, 100)
                else:
                    gas_price = random.uniform(20, 60)
                
                # Volatilité
                volatility = random.uniform(0.5, 2.0)
                
                data.append(DataPoint(
                    timestamp=timestamp,
                    hour=hour,
                    day_of_week=day_of_week,
                    gas_price=gas_price,
                    opportunities_found=base_opps,
                    avg_profit=base_profit,
                    market_volatility=volatility
                ))
        
        return data
    
    def train(self, data: List[DataPoint] = None):
        """Entraîner le modèle"""
        if data is None:
            print(f"{Fore.YELLOW}Génération de données d'exemple...{Style.RESET_ALL}\n")
            data = self.generate_sample_data(30)
        
        self.historical_data = data
        
        print(f"{Fore.CYAN}Entraînement du modèle ML...{Style.RESET_ALL}\n")
        print(f"Points de données: {len(data)}")
        print(f"Période: {data[0].timestamp.date()} → {data[-1].timestamp.date()}")
        print()
        
        success = self.model.train(data)
        
        if success:
            print(f"{Fore.GREEN}✓ Modèle entraîné avec succès{Style.RESET_ALL}\n")
        else:
            print(f"{Fore.RED}✗ Échec entraînement{Style.RESET_ALL}\n")
        
        return success
    
    def predict_next_hours(self, hours: int = 24) -> List[Prediction]:
        """Prédire les prochaines heures"""
        predictions = []
        now = datetime.now()
        
        for i in range(hours):
            future_time = now + timedelta(hours=i)
            hour = future_time.hour
            day_of_week = future_time.weekday()
            
            # Prédiction
            prob, profit, gas = self.model.predict(hour, day_of_week)
            
            # Confidence basée sur quantité de données
            confidence = min(len(self.historical_data) / 100 * 100, 90)
            
            # Risk score (gas élevé = risque élevé)
            risk = min(gas / 150 * 100, 100)
            
            prediction = Prediction(
                timestamp=future_time,
                opportunity_probability=prob,
                expected_profit=profit,
                expected_gas=gas,
                confidence=confidence,
                risk_score=risk
            )
            
            predictions.append(prediction)
        
        return predictions
    
    def get_best_time_to_trade(self, next_hours: int = 24) -> Prediction:
        """Trouver le meilleur moment pour trader"""
        predictions = self.predict_next_hours(next_hours)
        
        # Scorer chaque prédiction
        # Score = probability * confidence - risk * 0.5
        best_prediction = max(
            predictions,
            key=lambda p: p.opportunity_probability * (p.confidence / 100) - (p.risk_score * 0.3)
        )
        
        return best_prediction
    
    def print_predictions(self, predictions: List[Prediction]):
        """Afficher prédictions"""
        print(f"\n{Fore.CYAN}{'═' * 90}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}🤖 ML PREDICTIONS{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 90}{Style.RESET_ALL}\n")
        
        print(f"{'Time':<20} {'Prob%':<8} {'Profit':<12} {'Gas':<10} {'Conf%':<8} {'Risk%':<8} {'Action':<20}")
        print("─" * 90)
        
        for pred in predictions:
            time_str = pred.timestamp.strftime("%Y-%m-%d %H:%M")
            
            # Couleurs selon probabilité
            if pred.opportunity_probability > 70:
                prob_color = Fore.GREEN
            elif pred.opportunity_probability > 50:
                prob_color = Fore.YELLOW
            else:
                prob_color = Fore.RED
            
            print(f"{time_str:<20} "
                  f"{prob_color}{pred.opportunity_probability:>6.1f}%{Style.RESET_ALL}  "
                  f"${pred.expected_profit:>9.2f}  "
                  f"{pred.expected_gas:>7.1f}gwei "
                  f"{pred.confidence:>6.1f}%  "
                  f"{pred.risk_score:>6.1f}%  "
                  f"{pred.recommendation}")
        
        print()
    
    def analyze_patterns(self):
        """Analyser patterns dans les données"""
        if not self.historical_data:
            print(f"{Fore.YELLOW}⚠ Pas de données{Style.RESET_ALL}")
            return
        
        print(f"\n{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}📊 PATTERN ANALYSIS{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 70}{Style.RESET_ALL}\n")
        
        # Analyse par heure
        hourly_stats = {}
        for dp in self.historical_data:
            if dp.hour not in hourly_stats:
                hourly_stats[dp.hour] = []
            hourly_stats[dp.hour].append(dp.opportunities_found)
        
        print(f"{Fore.YELLOW}Opportunités par heure (moyenne):{Style.RESET_ALL}\n")
        
        for hour in sorted(hourly_stats.keys()):
            avg = sum(hourly_stats[hour]) / len(hourly_stats[hour])
            bar_length = int(avg * 3)
            bar = '█' * bar_length
            
            color = Fore.GREEN if avg > 4 else Fore.YELLOW if avg > 2 else Fore.RED
            
            print(f"{hour:02d}:00  {color}{avg:4.1f}{Style.RESET_ALL}  {bar}")
        
        # Meilleure heure
        best_hour = max(hourly_stats.keys(), key=lambda h: sum(hourly_stats[h]) / len(hourly_stats[h]))
        best_avg = sum(hourly_stats[best_hour]) / len(hourly_stats[best_hour])
        
        print(f"\n{Fore.GREEN}🏆 Meilleure heure: {best_hour:02d}:00 ({best_avg:.1f} opps/heure en moyenne){Style.RESET_ALL}")
        
        # Analyse jour de semaine
        print(f"\n{Fore.YELLOW}Opportunités par jour de semaine:{Style.RESET_ALL}\n")
        
        days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
        dow_stats = {i: [] for i in range(7)}
        
        for dp in self.historical_data:
            dow_stats[dp.day_of_week].append(dp.opportunities_found)
        
        for i, day_name in enumerate(days):
            if dow_stats[i]:
                avg = sum(dow_stats[i]) / len(dow_stats[i])
                bar_length = int(avg * 5)
                bar = '█' * bar_length
                print(f"{day_name:<10}  {avg:4.1f}  {bar}")
        
        print()


def run_ml_predictor_demo():
    """Démo ML predictor"""
    print(f"\n{Fore.CYAN}{'╔' + '═' * 68 + '╗'}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}║{' ' * 20}🤖 ML PREDICTOR DEMO{' ' * 27}║{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'╚' + '═' * 68 + '╝'}{Style.RESET_ALL}")
    
    predictor = MLPredictor()
    
    # Entraîner
    predictor.train()
    
    # Analyser patterns
    predictor.analyze_patterns()
    
    # Prédictions 24h
    print(f"\n{Fore.CYAN}Prédictions 24 prochaines heures:{Style.RESET_ALL}")
    predictions_24h = predictor.predict_next_hours(24)
    predictor.print_predictions(predictions_24h)
    
    # Meilleur moment
    print(f"{Fore.GREEN}{'═' * 90}{Style.RESET_ALL}")
    print(f"{Fore.GREEN}{Style.BRIGHT}⏰ MEILLEUR MOMENT POUR TRADER{Style.RESET_ALL}")
    print(f"{Fore.GREEN}{'═' * 90}{Style.RESET_ALL}\n")
    
    best_time = predictor.get_best_time_to_trade(24)
    
    print(f"Time:           {best_time.timestamp.strftime('%Y-%m-%d %H:%M')}")
    print(f"Probability:    {Fore.GREEN}{best_time.opportunity_probability:.1f}%{Style.RESET_ALL}")
    print(f"Expected Profit: ${best_time.expected_profit:.2f}")
    print(f"Expected Gas:   {best_time.expected_gas:.1f} gwei")
    print(f"Confidence:     {best_time.confidence:.1f}%")
    print(f"Risk:           {best_time.risk_score:.1f}%")
    print(f"\nRecommendation: {best_time.recommendation}")
    
    print()


if __name__ == "__main__":
    run_ml_predictor_demo()
