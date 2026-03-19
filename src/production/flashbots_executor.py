"""
⚡ THESORIA - Exécuteur Flashbots PRODUCTION
============================================

Implémentation RÉELLE de l'exécution Flashbots avec:
- Bidding EIP-1559 dynamique (fee_history)
- Bundle privé atomique
- Retry automatique
- Protection front-running 100%

IMPORTANT: Requiert flashbots-py installé
pip install flashbots web3
"""

import time
import asyncio
from typing import Dict, List, Optional, Tuple
from web3 import Web3
from web3.types import TxParams
from eth_account import Account
from eth_account.signers.local import LocalAccount
import os
import logging

# Flashbots
from flashbots import flashbot
from flashbots.types import FlashbotsBundleTx, FlashbotsBundleRawTx

logger = logging.getLogger(__name__)


class FlashbotsExecutor:
    """
    Exécuteur Flashbots RÉEL pour production
    
    Fonctionnalités:
    - Bidding EIP-1559 dynamique avec fee_history
    - Construction et envoi de bundles
    - Simulation pré-envoi
    - Retry automatique
    - Métriques et logs
    """
    
    def __init__(
        self,
        w3: Web3,
        account: LocalAccount,
        flashbots_signer: Optional[LocalAccount] = None,
        relay_url: str = "https://relay.flashbots.net"
    ):
        """
        Initialise l'exécuteur Flashbots
        
        Args:
            w3: Instance Web3 connectée
            account: Compte pour exécuter les trades
            flashbots_signer: Compte pour signer les requêtes Flashbots (peut être le même)
            relay_url: URL du relay Flashbots
        """
        self.w3 = w3
        self.account = account
        
        # Flashbots signer (peut être différent du compte de trading)
        if flashbots_signer is None:
            flashbots_signer = account
        
        self.flashbots_signer = flashbots_signer
        
        # Initialiser Flashbots
        try:
            flashbot(self.w3, self.flashbots_signer, relay_url)
            logger.info(f"⚡ Flashbots initialisé")
            logger.info(f"   Relay: {relay_url}")
            logger.info(f"   Signer: {flashbots_signer.address}")
        except Exception as e:
            logger.error(f"❌ Erreur initialisation Flashbots: {e}")
            raise
        
        # Statistiques
        self.stats = {
            'bundles_sent': 0,
            'bundles_included': 0,
            'bundles_failed': 0,
        }
    
    def get_dynamic_eip1559_fees(
        self,
        percentile: int = 70,
        block_count: int = 20
    ) -> Tuple[int, int]:
        """
        Calcule les frais de gaz optimaux (maxFee et maxPriorityFee) selon EIP-1559
        
        Stratégie:
        - Analyse fee_history des N derniers blocs
        - Prend le percentile demandé (70 = agressif, 90 = très agressif)
        - Ajoute buffer pour garantir inclusion
        
        Args:
            percentile: Percentile pour priority fee (70-95)
            block_count: Nombre de blocs à analyser (10-50)
        
        Returns:
            (maxFeePerGas, maxPriorityFeePerGas) en Wei
        """
        try:
            logger.debug(f"📊 Calcul frais EIP-1559 (percentile={percentile})")
            
            # 1. Obtenir l'historique des frais
            fee_history = self.w3.eth.fee_history(
                block_count=block_count,
                newest_block='latest',
                reward_percentiles=[percentile]
            )
            
            # 2. Extraire le priority fee maximum observé
            # reward[0] car on a demandé un seul percentile
            priority_fee = max(reward[0] for reward in fee_history['reward'])
            
            # Ajouter un buffer de 10% pour être sûr
            priority_fee = int(priority_fee * 1.1)
            
            priority_fee_gwei = self.w3.from_wei(priority_fee, 'gwei')
            
            # 3. Obtenir le Base Fee actuel
            latest_block = self.w3.eth.get_block('latest')
            base_fee = latest_block['baseFeePerGas']
            
            # 4. Calculer Max Fee
            # Formule: maxFee = baseFee * 2 + priorityFee
            # Le facteur 2 permet de gérer une augmentation de base fee
            max_fee = (base_fee * 2) + priority_fee
            
            base_fee_gwei = self.w3.from_wei(base_fee, 'gwei')
            max_fee_gwei = self.w3.from_wei(max_fee, 'gwei')
            
            logger.info(f"⚡ FRAIS EIP-1559 CALCULÉS:")
            logger.info(f"   Base Fee actuel: {base_fee_gwei:.2f} Gwei")
            logger.info(f"   Max Priority Fee: {priority_fee_gwei:.2f} Gwei")
            logger.info(f"   Max Fee Total: {max_fee_gwei:.2f} Gwei")
            
            return max_fee, priority_fee
            
        except Exception as e:
            logger.error(f"❌ Erreur calcul frais EIP-1559: {e}")
            
            # Fallback: Valeurs sécuritaires
            base_fee = self.w3.eth.gas_price
            priority_fee = self.w3.to_wei(5, 'gwei')
            max_fee = base_fee + priority_fee
            
            logger.warning(f"⚠️  Utilisation valeurs fallback:")
            logger.warning(f"   Max Fee: {self.w3.from_wei(max_fee, 'gwei'):.2f} Gwei")
            
            return max_fee, priority_fee
    
    def build_flash_loan_transaction(
        self,
        contract_address: str,
        function_data: bytes,
        gas_limit: int = 800_000,
        percentile: int = 80
    ) -> TxParams:
        """
        Construit une transaction Flash Loan avec frais EIP-1559 optimaux
        
        Args:
            contract_address: Adresse du contrat FlashBot
            function_data: Data encodée de la fonction
            gas_limit: Limite de gas
            percentile: Agressivité du bidding (70-95)
        
        Returns:
            Transaction prête à signer
        """
        logger.info(f"\n🔨 CONSTRUCTION TRANSACTION FLASH LOAN")
        
        # 1. Frais EIP-1559
        max_fee, max_priority_fee = self.get_dynamic_eip1559_fees(percentile=percentile)
        
        # 2. Nonce
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        
        # 3. Construire transaction
        tx: TxParams = {
            'from': self.account.address,
            'to': contract_address,
            'value': 0,
            'nonce': nonce,
            'gas': gas_limit,
            'maxFeePerGas': max_fee,
            'maxPriorityFeePerGas': max_priority_fee,
            'data': function_data,
            'chainId': self.w3.eth.chain_id,
        }
        
        logger.info(f"✅ Transaction construite:")
        logger.info(f"   To: {contract_address}")
        logger.info(f"   Nonce: {nonce}")
        logger.info(f"   Gas limit: {gas_limit:,}")
        logger.info(f"   Max fee: {self.w3.from_wei(max_fee, 'gwei'):.2f} Gwei")
        
        return tx
    
    def sign_transaction(self, tx: TxParams) -> bytes:
        """
        Signe une transaction
        
        Args:
            tx: Transaction à signer
        
        Returns:
            Transaction signée (rawTransaction)
        """
        signed = self.account.sign_transaction(tx)
        return signed.rawTransaction
    
    async def simulate_bundle(
        self,
        bundle: List[FlashbotsBundleRawTx],
        target_block: int
    ) -> Dict:
        """
        Simule un bundle avant envoi
        
        Args:
            bundle: Bundle à simuler
            target_block: Bloc cible
        
        Returns:
            Résultat de la simulation
        """
        logger.info(f"🧪 SIMULATION BUNDLE (bloc {target_block})")
        
        try:
            # Simulation via Flashbots
            simulation = self.w3.flashbots.simulate(bundle, target_block)
            
            if 'error' in simulation:
                logger.error(f"❌ Simulation échouée: {simulation['error']}")
                return {
                    'success': False,
                    'error': simulation['error']
                }
            
            # Extraire résultats
            results = simulation.get('results', [])
            
            if not results:
                logger.warning(f"⚠️  Aucun résultat de simulation")
                return {
                    'success': False,
                    'error': 'No simulation results'
                }
            
            # Premier résultat (notre TX)
            result = results[0]
            
            gas_used = result.get('gasUsed', 0)
            gas_price = result.get('gasPrice', 0)
            value = result.get('value', 0)
            
            logger.info(f"✅ Simulation réussie:")
            logger.info(f"   Gas utilisé: {gas_used:,}")
            logger.info(f"   Gas price: {self.w3.from_wei(gas_price, 'gwei'):.2f} Gwei")
            logger.info(f"   Value: {value}")
            
            return {
                'success': True,
                'gas_used': gas_used,
                'gas_price': gas_price,
                'value': value,
            }
            
        except Exception as e:
            logger.error(f"❌ Erreur simulation: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    async def send_bundle(
        self,
        bundle: List[FlashbotsBundleRawTx],
        target_block: int,
        simulate_first: bool = True
    ) -> Dict:
        """
        Envoie un bundle au relay Flashbots
        
        Args:
            bundle: Bundle à envoyer
            target_block: Bloc cible
            simulate_first: Simuler avant envoi
        
        Returns:
            Résultat de l'envoi
        """
        logger.info(f"\n📤 ENVOI BUNDLE FLASHBOTS")
        logger.info(f"   Target block: {target_block}")
        logger.info(f"   Transactions: {len(bundle)}")
        
        # 1. Simulation optionnelle
        if simulate_first:
            sim_result = await self.simulate_bundle(bundle, target_block)
            
            if not sim_result['success']:
                logger.error(f"❌ Simulation échouée, abandon")
                return {
                    'success': False,
                    'error': 'Simulation failed',
                    'simulation': sim_result
                }
        
        # 2. Envoi du bundle
        try:
            submission = self.w3.flashbots.send_bundle(
                bundle,
                target_block_number=target_block
            )
            
            self.stats['bundles_sent'] += 1
            
            logger.info(f"✅ Bundle envoyé!")
            logger.info(f"   Bundle hash: {submission.bundle_hash().hex()}")
            
            return {
                'success': True,
                'submission': submission,
                'target_block': target_block
            }
            
        except Exception as e:
            logger.error(f"❌ Erreur envoi bundle: {e}")
            self.stats['bundles_failed'] += 1
            
            return {
                'success': False,
                'error': str(e)
            }
    
    async def wait_for_inclusion(
        self,
        submission,
        target_block: int,
        timeout_blocks: int = 3
    ) -> Dict:
        """
        Attend l'inclusion du bundle dans un bloc
        
        Args:
            submission: Résultat de send_bundle
            target_block: Bloc cible
            timeout_blocks: Nombre de blocs à attendre
        
        Returns:
            Résultat de l'inclusion
        """
        logger.info(f"\n⏳ ATTENTE INCLUSION...")
        logger.info(f"   Target block: {target_block}")
        logger.info(f"   Timeout: {timeout_blocks} blocs")
        
        start_time = time.time()
        current_block = self.w3.eth.block_number
        
        while current_block < target_block + timeout_blocks:
            # Attendre nouveau bloc
            await asyncio.sleep(2)
            
            new_block = self.w3.eth.block_number
            
            if new_block > current_block:
                current_block = new_block
                logger.info(f"   Bloc {current_block} miné...")
                
                # Vérifier inclusion
                try:
                    receipts = submission.receipts()
                    
                    if receipts:
                        elapsed = time.time() - start_time
                        
                        logger.info(f"\n🎉 BUNDLE INCLUS!")
                        logger.info(f"   Bloc: {current_block}")
                        logger.info(f"   Temps: {elapsed:.2f}s")
                        logger.info(f"   Receipts: {len(receipts)}")
                        
                        self.stats['bundles_included'] += 1
                        
                        return {
                            'success': True,
                            'included': True,
                            'block': current_block,
                            'receipts': receipts,
                            'elapsed': elapsed
                        }
                
                except Exception as e:
                    # Pas encore inclus
                    pass
        
        # Timeout
        logger.warning(f"\n⚠️  BUNDLE NON INCLUS (timeout)")
        logger.warning(f"   Target block: {target_block}")
        logger.warning(f"   Current block: {current_block}")
        
        self.stats['bundles_failed'] += 1
        
        return {
            'success': False,
            'included': False,
            'error': 'Timeout'
        }
    
    async def execute_flash_loan(
        self,
        contract_address: str,
        function_data: bytes,
        gas_limit: int = 800_000,
        percentile: int = 80,
        max_retries: int = 3
    ) -> Dict:
        """
        FONCTION PRINCIPALE: Exécute un Flash Loan via Flashbots
        
        Pipeline complet:
        1. Construction TX avec frais optimaux
        2. Signature
        3. Bundle
        4. Simulation
        5. Envoi
        6. Attente inclusion
        7. Retry si échec
        
        Args:
            contract_address: Adresse du contrat FlashBot
            function_data: Data de la fonction requestFlashLoan
            gas_limit: Limite de gas
            percentile: Agressivité (70-95)
            max_retries: Nombre de retry
        
        Returns:
            Résultat complet
        """
        logger.info(f"\n{'='*60}")
        logger.info(f"⚡ EXÉCUTION FLASH LOAN VIA FLASHBOTS")
        logger.info(f"{'='*60}")
        
        attempt = 0
        
        while attempt < max_retries:
            attempt += 1
            
            logger.info(f"\n🔄 TENTATIVE {attempt}/{max_retries}")
            
            try:
                # 1. Construire transaction
                tx = self.build_flash_loan_transaction(
                    contract_address=contract_address,
                    function_data=function_data,
                    gas_limit=gas_limit,
                    percentile=percentile + (attempt - 1) * 5  # Plus agressif à chaque retry
                )
                
                # 2. Signer
                signed_tx = self.sign_transaction(tx)
                
                # 3. Bundle
                bundle: List[FlashbotsBundleRawTx] = [
                    {'signed_transaction': signed_tx}
                ]
                
                # 4. Target block (prochain)
                target_block = self.w3.eth.block_number + 1
                
                # 5. Envoyer
                send_result = await self.send_bundle(
                    bundle=bundle,
                    target_block=target_block,
                    simulate_first=True
                )
                
                if not send_result['success']:
                    logger.error(f"❌ Envoi échoué: {send_result['error']}")
                    
                    # Retry si simulation failed
                    if 'simulation' in send_result['error'].lower():
                        logger.warning(f"⚠️  Retry à cause d'une erreur de simulation")
                        await asyncio.sleep(1)
                        continue
                    else:
                        return send_result
                
                # 6. Attendre inclusion
                inclusion_result = await self.wait_for_inclusion(
                    submission=send_result['submission'],
                    target_block=target_block,
                    timeout_blocks=3
                )
                
                if inclusion_result['included']:
                    # SUCCÈS!
                    logger.info(f"\n{'='*60}")
                    logger.info(f"✅ FLASH LOAN EXÉCUTÉ AVEC SUCCÈS!")
                    logger.info(f"{'='*60}")
                    
                    return {
                        'success': True,
                        'included': True,
                        'tx': tx,
                        'receipts': inclusion_result['receipts'],
                        'block': inclusion_result['block'],
                        'elapsed': inclusion_result['elapsed'],
                        'attempt': attempt,
                    }
                else:
                    # Non inclus, retry
                    logger.warning(f"⚠️  Non inclus, retry...")
                    await asyncio.sleep(1)
            
            except Exception as e:
                logger.error(f"❌ Erreur tentative {attempt}: {e}")
                await asyncio.sleep(2)
        
        # Toutes les tentatives échouées
        logger.error(f"\n{'='*60}")
        logger.error(f"❌ ÉCHEC APRÈS {max_retries} TENTATIVES")
        logger.error(f"{'='*60}")
        
        return {
            'success': False,
            'included': False,
            'error': f'Failed after {max_retries} attempts'
        }
    
    def get_statistics(self) -> Dict:
        """Retourne les statistiques"""
        success_rate = 0
        if self.stats['bundles_sent'] > 0:
            success_rate = (self.stats['bundles_included'] / self.stats['bundles_sent']) * 100
        
        return {
            'bundles_sent': self.stats['bundles_sent'],
            'bundles_included': self.stats['bundles_included'],
            'bundles_failed': self.stats['bundles_failed'],
            'success_rate': success_rate,
        }


# ============================================
# EXEMPLE D'UTILISATION
# ============================================

async def example_usage():
    """Exemple d'utilisation de FlashbotsExecutor"""
    from web3 import Web3
    from eth_account import Account
    
    # Setup
    rpc_url = os.getenv('ETH_RPC_URL', 'https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY')
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    
    if not w3.is_connected():
        print(f"❌ Impossible de se connecter au RPC")
        return
    
    print(f"✅ Connecté au RPC")
    print(f"   Block: {w3.eth.block_number}")
    print(f"   Chain ID: {w3.eth.chain_id}")
    
    # Account
    private_key = os.getenv('PRIVATE_KEY')
    if not private_key:
        print(f"❌ PRIVATE_KEY non défini")
        return
    
    account = Account.from_key(private_key)
    print(f"✅ Account: {account.address}")
    
    # Flashbots signer (peut être différent)
    flashbots_signer_key = os.getenv('FLASHBOTS_SIGNER_KEY', private_key)
    flashbots_signer = Account.from_key(flashbots_signer_key)
    
    # Initialiser executor
    executor = FlashbotsExecutor(
        w3=w3,
        account=account,
        flashbots_signer=flashbots_signer
    )
    
    print(f"\n📊 Test calcul frais EIP-1559...")
    
    # Test 1: Frais normaux
    max_fee_70, priority_fee_70 = executor.get_dynamic_eip1559_fees(percentile=70)
    
    # Test 2: Frais agressifs
    max_fee_90, priority_fee_90 = executor.get_dynamic_eip1559_fees(percentile=90)
    
    print(f"\n📊 COMPARAISON:")
    print(f"   Percentile 70 (normal):")
    print(f"     Max fee: {w3.from_wei(max_fee_70, 'gwei'):.2f} Gwei")
    print(f"   Percentile 90 (agressif):")
    print(f"     Max fee: {w3.from_wei(max_fee_90, 'gwei'):.2f} Gwei")
    print(f"   Différence: {((max_fee_90/max_fee_70)-1)*100:.1f}%")
    
    # Stats
    print(f"\n📊 Statistiques:")
    stats = executor.get_statistics()
    for key, value in stats.items():
        print(f"   {key}: {value}")


if __name__ == "__main__":
    import logging
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    
    asyncio.run(example_usage())
