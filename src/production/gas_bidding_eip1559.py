"""
⚡ THESORIA - Bidding Gas Dynamique EIP-1559
============================================

Système de bidding ultra-agressif pour garantir l'inclusion:
- Calcul base fee du prochain bloc
- Priority fee dynamique selon congestion
- Ajustement en temps réel
- Retry avec augmentation

EIP-1559: maxFeePerGas = baseFee + maxPriorityFeePerGas

STRATÉGIE: Surpayer légèrement pour garantir inclusion immédiate
"""

import asyncio
import time
from typing import Dict, Tuple, Optional
from web3 import Web3
from decimal import Decimal, getcontext
import logging

logger = logging.getLogger(__name__)

# Précision décimale
getcontext().prec = 50


class GasBiddingEIP1559:
    """
    Système de bidding gas EIP-1559 ultra-optimisé
    
    Objectif: Inclusion dans le PROCHAIN bloc (100% garanti)
    """
    
    def __init__(
        self,
        w3: Web3,
        base_priority_fee_gwei: float = 2.0,
        max_priority_fee_gwei: float = 50.0,
        base_fee_multiplier: float = 1.2
    ):
        """
        Initialise le système de bidding
        
        Args:
            w3: Instance Web3
            base_priority_fee_gwei: Priority fee de base (Gwei)
            max_priority_fee_gwei: Priority fee maximum (Gwei)
            base_fee_multiplier: Multiplicateur pour base fee (1.2 = +20%)
        """
        self.w3 = w3
        self.base_priority_fee_gwei = Decimal(str(base_priority_fee_gwei))
        self.max_priority_fee_gwei = Decimal(str(max_priority_fee_gwei))
        self.base_fee_multiplier = Decimal(str(base_fee_multiplier))
        
        # Cache
        self._last_base_fee = None
        self._last_update = 0
        self._cache_duration = 2  # 2 secondes
        
        logger.info(f"⚡ Gas Bidding EIP-1559 initialisé")
        logger.info(f"   Base priority fee: {base_priority_fee_gwei} Gwei")
        logger.info(f"   Max priority fee: {max_priority_fee_gwei} Gwei")
        logger.info(f"   Base fee multiplier: {base_fee_multiplier}x")
    
    async def get_latest_base_fee(self) -> int:
        """
        Obtient le base fee du dernier bloc
        
        EIP-1559: Base fee est calculé automatiquement selon congestion
        
        Returns:
            Base fee en Wei
        """
        # Cache pour éviter trop de requêtes
        now = time.time()
        if self._last_base_fee and (now - self._last_update) < self._cache_duration:
            return self._last_base_fee
        
        try:
            # Obtenir le dernier bloc
            latest_block = self.w3.eth.get_block('latest')
            
            if 'baseFeePerGas' not in latest_block:
                # Fallback si pas EIP-1559
                logger.warning("⚠️  Base fee non disponible (pas EIP-1559?)")
                # Estimer depuis gas price
                gas_price = self.w3.eth.gas_price
                base_fee = int(gas_price * 0.9)  # 90% du gas price
            else:
                base_fee = latest_block['baseFeePerGas']
            
            # Cache
            self._last_base_fee = base_fee
            self._last_update = now
            
            base_fee_gwei = Decimal(base_fee) / Decimal(10**9)
            logger.debug(f"📊 Base fee actuel: {base_fee_gwei:.2f} Gwei")
            
            return base_fee
            
        except Exception as e:
            logger.error(f"❌ Erreur récupération base fee: {e}")
            # Fallback
            return self.w3.eth.gas_price
    
    async def predict_next_base_fee(self) -> int:
        """
        Prédit le base fee du PROCHAIN bloc
        
        Formule EIP-1559:
        - Si bloc plein (>50%): base fee augmente de 12.5%
        - Si bloc vide (<50%): base fee diminue de 12.5%
        
        Stratégie conservative: Assumer augmentation
        
        Returns:
            Base fee prédit en Wei
        """
        current_base_fee = await self.get_latest_base_fee()
        
        try:
            # Obtenir le dernier bloc
            latest_block = self.w3.eth.get_block('latest')
            
            gas_used = latest_block['gasUsed']
            gas_limit = latest_block['gasLimit']
            
            utilization = Decimal(gas_used) / Decimal(gas_limit)
            
            # Formule EIP-1559
            if utilization > Decimal('0.5'):
                # Bloc plein: base fee augmente
                increase_factor = Decimal('1.125')  # +12.5%
                predicted_base_fee = int(Decimal(current_base_fee) * increase_factor)
                
                logger.debug(f"📈 Bloc plein ({utilization*100:.1f}%), base fee augmente")
            else:
                # Bloc vide: base fee diminue (mais on reste prudent)
                predicted_base_fee = current_base_fee
                
                logger.debug(f"📉 Bloc peu utilisé ({utilization*100:.1f}%), base fee stable")
            
            return predicted_base_fee
            
        except Exception as e:
            logger.warning(f"⚠️  Erreur prédiction base fee: {e}")
            # Fallback: Assumer augmentation de 12.5%
            return int(Decimal(current_base_fee) * Decimal('1.125'))
    
    def calculate_priority_fee(
        self,
        network_congestion: float = 0.5,
        profit_expected_usd: float = 0.0
    ) -> int:
        """
        Calcule le priority fee selon la congestion et le profit
        
        Stratégie:
        - Congestion faible: Priority fee minimal
        - Congestion élevée: Priority fee agressif
        - Profit élevé: On peut payer plus
        
        Args:
            network_congestion: 0.0-1.0 (0=vide, 1=saturé)
            profit_expected_usd: Profit attendu en USD
        
        Returns:
            Priority fee en Wei
        """
        # Base priority fee
        priority_fee_gwei = self.base_priority_fee_gwei
        
        # Ajustement selon congestion
        congestion_multiplier = Decimal('1.0') + (Decimal(str(network_congestion)) * Decimal('2.0'))
        priority_fee_gwei = priority_fee_gwei * congestion_multiplier
        
        # Ajustement selon profit attendu
        # Si profit > $1000, on peut payer 2x plus
        if profit_expected_usd > 1000:
            profit_multiplier = Decimal('2.0')
        elif profit_expected_usd > 500:
            profit_multiplier = Decimal('1.5')
        elif profit_expected_usd > 200:
            profit_multiplier = Decimal('1.2')
        else:
            profit_multiplier = Decimal('1.0')
        
        priority_fee_gwei = priority_fee_gwei * profit_multiplier
        
        # Limiter au max
        priority_fee_gwei = min(priority_fee_gwei, self.max_priority_fee_gwei)
        
        # Convertir en Wei
        priority_fee_wei = int(priority_fee_gwei * Decimal(10**9))
        
        logger.debug(f"💰 Priority fee calculé: {priority_fee_gwei:.2f} Gwei")
        logger.debug(f"   Congestion: {network_congestion*100:.0f}%")
        logger.debug(f"   Profit attendu: ${profit_expected_usd:.2f}")
        
        return priority_fee_wei
    
    async def calculate_optimal_gas_params(
        self,
        profit_expected_usd: float = 0.0,
        urgency: str = 'normal'
    ) -> Dict:
        """
        Calcule les paramètres gas OPTIMAUX pour inclusion garantie
        
        Args:
            profit_expected_usd: Profit attendu
            urgency: 'low', 'normal', 'high', 'critical'
        
        Returns:
            {
                'maxFeePerGas': int,
                'maxPriorityFeePerGas': int,
                'baseFee': int,
                'nextBaseFee': int,
                'estimatedCostUSD': Decimal,
            }
        """
        logger.info(f"\n⚡ CALCUL GAS OPTIMAL")
        logger.info(f"   Profit attendu: ${profit_expected_usd:.2f}")
        logger.info(f"   Urgence: {urgency}")
        
        # 1. Base fee actuel et prédit
        current_base_fee = await self.get_latest_base_fee()
        next_base_fee = await self.predict_next_base_fee()
        
        # 2. Priority fee selon urgence
        urgency_multipliers = {
            'low': Decimal('0.5'),
            'normal': Decimal('1.0'),
            'high': Decimal('1.5'),
            'critical': Decimal('3.0'),
        }
        
        urgency_mult = urgency_multipliers.get(urgency, Decimal('1.0'))
        
        # Estimer congestion
        latest_block = self.w3.eth.get_block('latest')
        congestion = float(latest_block['gasUsed']) / float(latest_block['gasLimit'])
        
        # Priority fee de base
        base_priority_fee = self.calculate_priority_fee(congestion, profit_expected_usd)
        
        # Ajuster selon urgence
        priority_fee = int(Decimal(base_priority_fee) * urgency_mult)
        
        # Limiter
        priority_fee = min(priority_fee, int(self.max_priority_fee_gwei * 10**9))
        
        # 3. Max fee = next base fee * multiplier + priority fee
        max_base_fee = int(Decimal(next_base_fee) * self.base_fee_multiplier)
        max_fee = max_base_fee + priority_fee
        
        # 4. Estimer coût
        estimated_gas = 500_000  # Estimation moyenne
        estimated_cost_wei = estimated_gas * max_fee
        estimated_cost_eth = Decimal(estimated_cost_wei) / Decimal(10**18)
        eth_price_usd = Decimal('2000.0')  # TODO: fetch real
        estimated_cost_usd = estimated_cost_eth * eth_price_usd
        
        result = {
            'maxFeePerGas': max_fee,
            'maxPriorityFeePerGas': priority_fee,
            'baseFee': current_base_fee,
            'nextBaseFee': next_base_fee,
            'estimatedCostUSD': estimated_cost_usd,
        }
        
        # Log
        logger.info(f"\n📊 RÉSULTAT:")
        logger.info(f"   Base fee actuel: {current_base_fee/10**9:.2f} Gwei")
        logger.info(f"   Base fee prédit: {next_base_fee/10**9:.2f} Gwei")
        logger.info(f"   Priority fee: {priority_fee/10**9:.2f} Gwei")
        logger.info(f"   Max fee: {max_fee/10**9:.2f} Gwei")
        logger.info(f"   Coût estimé: ${estimated_cost_usd:.2f}")
        
        return result
    
    async def build_transaction_with_optimal_gas(
        self,
        contract_function,
        account_address: str,
        profit_expected_usd: float = 0.0,
        urgency: str = 'high',
        gas_limit: Optional[int] = None
    ) -> Dict:
        """
        Construit une transaction avec les paramètres gas OPTIMAUX
        
        Args:
            contract_function: Fonction du contrat à appeler
            account_address: Adresse du compte
            profit_expected_usd: Profit attendu
            urgency: Niveau d'urgence
            gas_limit: Limite de gas (None = estimation)
        
        Returns:
            Transaction prête à signer
        """
        logger.info(f"\n🔨 CONSTRUCTION TRANSACTION")
        
        # Calcul gas optimal
        gas_params = await self.calculate_optimal_gas_params(
            profit_expected_usd=profit_expected_usd,
            urgency=urgency
        )
        
        # Nonce
        nonce = self.w3.eth.get_transaction_count(account_address)
        
        # Gas limit
        if gas_limit is None:
            try:
                gas_limit = contract_function.estimate_gas({'from': account_address})
                gas_limit = int(gas_limit * 1.3)  # +30% marge
                logger.info(f"   Gas estimé: {gas_limit:,}")
            except Exception as e:
                logger.warning(f"   ⚠️  Estimation gas échouée: {e}")
                gas_limit = 800_000  # Fallback
        
        # Construire transaction
        tx = contract_function.build_transaction({
            'from': account_address,
            'nonce': nonce,
            'gas': gas_limit,
            'maxFeePerGas': gas_params['maxFeePerGas'],
            'maxPriorityFeePerGas': gas_params['maxPriorityFeePerGas'],
            'chainId': self.w3.eth.chain_id,
        })
        
        logger.info(f"✅ Transaction construite")
        logger.info(f"   Nonce: {nonce}")
        logger.info(f"   Gas limit: {gas_limit:,}")
        logger.info(f"   Max fee: {gas_params['maxFeePerGas']/10**9:.2f} Gwei")
        
        return tx
    
    async def retry_with_higher_gas(
        self,
        original_tx: Dict,
        bump_percent: float = 20.0
    ) -> Dict:
        """
        Retry une transaction avec gas plus élevé
        
        Args:
            original_tx: Transaction originale
            bump_percent: Pourcentage d'augmentation (20 = +20%)
        
        Returns:
            Transaction modifiée
        """
        bump_multiplier = Decimal('1.0') + (Decimal(str(bump_percent)) / Decimal('100'))
        
        new_max_fee = int(Decimal(original_tx['maxFeePerGas']) * bump_multiplier)
        new_priority_fee = int(Decimal(original_tx['maxPriorityFeePerGas']) * bump_multiplier)
        
        logger.info(f"\n🔄 RETRY avec gas +{bump_percent}%")
        logger.info(f"   Ancien max fee: {original_tx['maxFeePerGas']/10**9:.2f} Gwei")
        logger.info(f"   Nouveau max fee: {new_max_fee/10**9:.2f} Gwei")
        
        # Copier et modifier
        new_tx = original_tx.copy()
        new_tx['maxFeePerGas'] = new_max_fee
        new_tx['maxPriorityFeePerGas'] = new_priority_fee
        
        return new_tx


# ============================================
# EXEMPLE D'UTILISATION
# ============================================

async def example_usage():
    """Exemple d'utilisation du bidding gas"""
    from web3 import Web3
    
    # Setup
    rpc_url = 'https://polygon-rpc.com'
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    
    # Initialiser
    gas_bidding = GasBiddingEIP1559(
        w3=w3,
        base_priority_fee_gwei=2.0,
        max_priority_fee_gwei=50.0,
        base_fee_multiplier=1.2
    )
    
    print("\n" + "="*60)
    print("⚡ EXEMPLE: Bidding Gas EIP-1559")
    print("="*60)
    
    # Scénario 1: Trade normal ($200 profit)
    print("\n📊 SCÉNARIO 1: Trade normal ($200 profit)")
    params1 = await gas_bidding.calculate_optimal_gas_params(
        profit_expected_usd=200.0,
        urgency='normal'
    )
    
    # Scénario 2: Trade profitable ($1500 profit) - URGENT
    print("\n📊 SCÉNARIO 2: Gros profit ($1500) - URGENT")
    params2 = await gas_bidding.calculate_optimal_gas_params(
        profit_expected_usd=1500.0,
        urgency='critical'
    )
    
    # Comparaison
    print("\n" + "="*60)
    print("📊 COMPARAISON")
    print("="*60)
    print(f"Scénario 1 (normal):")
    print(f"  Max fee: {params1['maxFeePerGas']/10**9:.2f} Gwei")
    print(f"  Coût estimé: ${params1['estimatedCostUSD']:.2f}")
    print(f"\nScénario 2 (critical):")
    print(f"  Max fee: {params2['maxFeePerGas']/10**9:.2f} Gwei")
    print(f"  Coût estimé: ${params2['estimatedCostUSD']:.2f}")
    print(f"\n💡 Différence: {(params2['maxFeePerGas']/params1['maxFeePerGas']-1)*100:.1f}% plus cher")
    print("   → Justifié par le profit plus élevé!")
    print("="*60 + "\n")


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(message)s'
    )
    
    asyncio.run(example_usage())
