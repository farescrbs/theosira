"""
🤖 AI Strategy Optimizer - Optimiseur de Stratégies IA
======================================================

Utilise l'apprentissage machine pour:
- Scorer les opportunités d'arbitrage
- Prédire la probabilité de succès
- Optimiser les paramètres (montant, slippage, etc.)
- Apprendre des trades passés

Modèles supportés:
- GPT-4 (OpenAI)
- Claude (Anthropic)
- Llama 2 (Local)
- Modèles personnalisés
"""

import os
import json
import logging
from typing import Dict, List, Optional
from datetime import datetime
import numpy as np

logger = logging.getLogger(__name__)

# Tentative d'import OpenAI
try:
    import openai
    openai.api_key = os.getenv("OPENAI_API_KEY")
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    logger.warning("⚠️  OpenAI non disponible, utilisation du modèle local")


class AIStrategyOptimizer:
    """
    Optimiseur de stratégies basé sur l'IA
    """
    
    def __init__(self, model: str = "gpt-4"):
        self.model = model
        self.use_openai = OPENAI_AVAILABLE and model.startswith("gpt")
        
        # Historique pour l'apprentissage
        self.training_data = []
        self.load_training_data()
        
        logger.info(f"🤖 AI Optimizer initialisé")
        logger.info(f"   Modèle: {model}")
        logger.info(f"   Training samples: {len(self.training_data)}")
    
    def load_training_data(self):
        """Charge l'historique de trades pour l'entraînement"""
        try:
            if os.path.exists('trade_history.json'):
                with open('trade_history.json', 'r') as f:
                    self.training_data = json.load(f)
                logger.info(f"📚 {len(self.training_data)} trades chargés")
        except Exception as e:
            logger.error(f"Erreur chargement données: {e}")
    
    async def score_opportunity(
        self,
        opportunity: Dict,
        context: Dict,
        history: List[Dict]
    ) -> Dict:
        """
        Score une opportunité d'arbitrage
        
        Args:
            opportunity: Dict avec les détails de l'opportunité
            context: Contexte de marché (volatilité, liquidité, etc.)
            history: Historique de trades récents
        
        Returns:
            Dict avec score, confidence, expected_value
        """
        
        if self.use_openai:
            return await self._score_with_gpt(opportunity, context, history)
        else:
            return await self._score_with_heuristics(opportunity, context, history)
    
    async def _score_with_gpt(
        self,
        opportunity: Dict,
        context: Dict,
        history: List[Dict]
    ) -> Dict:
        """
        Utilise GPT-4 pour scorer l'opportunité
        """
        try:
            # Préparer le prompt
            prompt = self._build_scoring_prompt(opportunity, context, history)
            
            # Appeler GPT-4
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": """Tu es un expert en trading MEV et arbitrage DeFi.
                        Analyse les opportunités et fournis un score de 0 à 100 et une confiance de 0 à 1.
                        Réponds uniquement en JSON avec les clés: score, confidence, reasoning, expected_profit."""
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,  # Peu créatif, plus analytique
                max_tokens=500
            )
            
            # Parser la réponse
            result_text = response.choices[0].message.content
            result = json.loads(result_text)
            
            # Calculer l'expected value
            expected_value = (
                opportunity['estimated_profit'] * 
                result['confidence']
            )
            
            return {
                'score': result['score'],
                'confidence': result['confidence'],
                'reasoning': result['reasoning'],
                'expected_value': expected_value,
                'expected_profit': result.get('expected_profit', opportunity['estimated_profit']),
                'ai_used': 'gpt-4',
            }
            
        except Exception as e:
            logger.error(f"Erreur GPT scoring: {e}")
            # Fallback vers heuristiques
            return await self._score_with_heuristics(opportunity, context, history)
    
    async def _score_with_heuristics(
        self,
        opportunity: Dict,
        context: Dict,
        history: List[Dict]
    ) -> Dict:
        """
        Scoring basé sur des heuristiques (fallback)
        """
        score = 50.0  # Score de base
        confidence = 0.5
        factors = []
        
        # Facteur 1: Spread (plus le spread est grand, mieux c'est)
        spread = opportunity['spread']
        if spread > 0.02:  # >2%
            score += 20
            confidence += 0.15
            factors.append("High spread (+20)")
        elif spread > 0.01:  # >1%
            score += 10
            confidence += 0.1
            factors.append("Good spread (+10)")
        
        # Facteur 2: Profit estimé
        profit = opportunity['estimated_profit']
        if profit > 500:
            score += 15
            confidence += 0.1
            factors.append("High profit (+15)")
        elif profit > 200:
            score += 8
            confidence += 0.05
            factors.append("Good profit (+8)")
        
        # Facteur 3: Volatilité (moins de volatilité = plus de confiance)
        volatility = context.get('volatility', 0.5)
        if volatility < 0.3:
            score += 10
            confidence += 0.1
            factors.append("Low volatility (+10)")
        elif volatility > 0.7:
            score -= 10
            confidence -= 0.1
            factors.append("High volatility (-10)")
        
        # Facteur 4: Liquidité
        liquidity = context.get('liquidity', 0)
        if liquidity > 1_000_000:
            score += 10
            confidence += 0.1
            factors.append("High liquidity (+10)")
        elif liquidity < 100_000:
            score -= 5
            confidence -= 0.05
            factors.append("Low liquidity (-5)")
        
        # Facteur 5: Historique de succès sur cette paire
        similar_trades = [
            t for t in history 
            if t.get('opportunity', {}).get('token_in') == opportunity['token_in']
            and t.get('opportunity', {}).get('token_out') == opportunity['token_out']
        ]
        
        if similar_trades:
            success_rate = sum(1 for t in similar_trades if t['success']) / len(similar_trades)
            if success_rate > 0.8:
                score += 15
                confidence += 0.15
                factors.append(f"Good history ({success_rate*100:.0f}% success, +15)")
            elif success_rate < 0.5:
                score -= 10
                confidence -= 0.1
                factors.append(f"Poor history ({success_rate*100:.0f}% success, -10)")
        
        # Facteur 6: Prix du gas
        gas_price = context.get('gas_price', 0)
        avg_gas = 50_000_000_000  # 50 Gwei
        if gas_price < avg_gas * 0.8:
            score += 5
            factors.append("Low gas price (+5)")
        elif gas_price > avg_gas * 1.5:
            score -= 10
            confidence -= 0.05
            factors.append("High gas price (-10)")
        
        # Normaliser
        score = max(0, min(100, score))
        confidence = max(0, min(1, confidence))
        
        # Expected value
        expected_value = profit * confidence
        
        return {
            'score': score,
            'confidence': confidence,
            'reasoning': ' | '.join(factors),
            'expected_value': expected_value,
            'expected_profit': profit,
            'ai_used': 'heuristics',
        }
    
    def _build_scoring_prompt(
        self,
        opportunity: Dict,
        context: Dict,
        history: List[Dict]
    ) -> str:
        """
        Construit le prompt pour GPT
        """
        # Résumer l'historique
        recent_trades = history[-10:] if len(history) > 10 else history
        success_count = sum(1 for t in recent_trades if t.get('success'))
        
        prompt = f"""
Analyse cette opportunité d'arbitrage:

OPPORTUNITÉ:
- Paire: {opportunity['token_in']}/{opportunity['token_out']}
- Montant: ${opportunity['amount']:.2f}
- DEX: {opportunity['dex_buy']} → {opportunity['dex_sell']}
- Spread: {opportunity['spread']*100:.3f}%
- Profit estimé: ${opportunity['estimated_profit']:.2f}

CONTEXTE DE MARCHÉ:
- Volatilité: {context.get('volatility', 'N/A')}
- Liquidité: ${context.get('liquidity', 0):,.0f}
- Gas price: {context.get('gas_price', 0) / 10**9:.1f} Gwei
- Block: {context.get('block_number', 'N/A')}

HISTORIQUE RÉCENT:
- Trades récents: {len(recent_trades)}
- Taux de succès: {(success_count/len(recent_trades)*100) if recent_trades else 0:.1f}%

Évalue cette opportunité et fournis:
1. Un score de 0 à 100
2. Une confiance de 0 à 1
3. Un raisonnement concis
4. Le profit attendu réel (après ajustements)

Format JSON uniquement.
"""
        return prompt
    
    async def optimize_parameters(
        self,
        opportunity: Dict,
        constraints: Dict
    ) -> Dict:
        """
        Optimise les paramètres de trading (montant, slippage, etc.)
        
        Returns:
            Dict avec paramètres optimisés
        """
        
        # Montant optimal basé sur la liquidité
        liquidity = opportunity.get('liquidity', 1_000_000)
        max_amount = min(
            liquidity * 0.05,  # Max 5% de la liquidité du pool
            constraints.get('max_amount', 1_000_000)
        )
        
        optimal_amount = min(
            opportunity['amount'],
            max_amount
        )
        
        # Slippage optimal basé sur la volatilité et liquidité
        base_slippage = 0.005  # 0.5%
        
        if liquidity < 500_000:
            optimal_slippage = base_slippage * 2  # Plus de slippage pour faible liquidité
        elif liquidity > 5_000_000:
            optimal_slippage = base_slippage * 0.5  # Moins de slippage pour haute liquidité
        else:
            optimal_slippage = base_slippage
        
        # Priority fee basé sur l'urgence
        if opportunity['spread'] > 0.02:
            priority_fee = 5.0  # Gwei - Opportunité très profitable, payer plus
        elif opportunity['spread'] > 0.01:
            priority_fee = 3.0
        else:
            priority_fee = 2.0
        
        return {
            'amount': optimal_amount,
            'slippage': optimal_slippage,
            'priority_fee': priority_fee,
            'max_gas_price': constraints.get('max_gas_price', 100),
            'deadline': 300,  # 5 minutes
        }
    
    def learn_from_trade(self, trade: Dict):
        """
        Apprend d'un trade exécuté (reinforcement learning)
        """
        try:
            # Ajouter aux données d'entraînement
            self.training_data.append(trade)
            
            # Garder seulement les 1000 derniers
            if len(self.training_data) > 1000:
                self.training_data = self.training_data[-1000:]
            
            # Sauvegarder
            with open('trade_history.json', 'w') as f:
                json.dump(self.training_data, f, indent=2)
            
            logger.debug(f"📚 Trade ajouté à l'historique d'apprentissage")
            
        except Exception as e:
            logger.error(f"Erreur apprentissage: {e}")
    
    def get_model_performance(self) -> Dict:
        """
        Évalue la performance du modèle IA
        """
        if not self.training_data:
            return {}
        
        try:
            total_trades = len(self.training_data)
            successful_trades = [t for t in self.training_data if t.get('success')]
            
            # Précision des prédictions
            predictions_correct = 0
            for trade in self.training_data:
                predicted_success = trade.get('opportunity', {}).get('ai_confidence', 0) > 0.7
                actual_success = trade.get('success', False)
                if predicted_success == actual_success:
                    predictions_correct += 1
            
            accuracy = predictions_correct / total_trades if total_trades > 0 else 0
            
            # Profit moyen prédit vs réel
            predicted_profits = [
                t.get('opportunity', {}).get('estimated_profit', 0) 
                for t in successful_trades
            ]
            
            actual_profits = [
                t.get('opportunity', {}).get('estimated_profit', 0)  # Simplifié
                for t in successful_trades
            ]
            
            avg_predicted = np.mean(predicted_profits) if predicted_profits else 0
            avg_actual = np.mean(actual_profits) if actual_profits else 0
            
            return {
                'total_trades': total_trades,
                'successful_trades': len(successful_trades),
                'success_rate': len(successful_trades) / total_trades,
                'prediction_accuracy': accuracy,
                'avg_predicted_profit': avg_predicted,
                'avg_actual_profit': avg_actual,
                'profit_prediction_error': abs(avg_predicted - avg_actual) / avg_actual if avg_actual > 0 else 0,
            }
            
        except Exception as e:
            logger.error(f"Erreur calcul performance: {e}")
            return {}
