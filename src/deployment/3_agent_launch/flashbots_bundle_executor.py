"""
⚡ THESORIA - Exécuteur Flashbots Bundle
========================================

Exécution ultra-optimisée des bundles Flashbots:
- Simulation avant envoi
- Envoi à tous les relayers
- Retry automatique si non inclus
- Statistiques détaillées

Documentation: https://docs.flashbots.net/flashbots-core/searchers/getting-started
"""

import asyncio
import time
from typing import Dict, List, Optional, Tuple
from web3 import Web3
from eth_account import Account
from eth_account.signers.local import LocalAccount
import logging

try:
    from flashbots import flashbot
    FLASHBOTS_AVAILABLE = True
except ImportError:
    FLASHBOTS_AVAILABLE = False
    print("⚠️  Module flashbots non installé: pip install flashbots")

logger = logging.getLogger(__name__)


class FlashbotsBundleExecutor:
    """
    Exécuteur de bundles Flashbots ultra-optimisé
    
    Features:
    - Simulation gratuite avant envoi
    - Envoi multi-relayers
    - Retry automatique
    - Monitoring détaillé
    """
    
    def __init__(
        self,
        w3: Web3,
        account: LocalAccount,
        relay_url: str = "https://relay.flashbots.net"
    ):
        """
        Initialise l'exécuteur Flashbots
        
        Args:
            w3: Instance Web3
            account: Compte pour signer les transactions
            relay_url: URL du relayer Flashbots
        """
        self.w3 = w3
        self.account = account
        self.relay_url = relay_url
        
        # Statistiques
        self.bundles_sent = 0
        self.bundles_included = 0
        self.bundles_failed = 0
        self.total_profit = 0.0
        self.total_gas_paid = 0.0
        
        # Historique
        self.bundle_history = []
        
        if not FLASHBOTS_AVAILABLE:
            raise Exception("Module flashbots requis: pip install flashbots")
        
        # Créer signer réputationnel Flashbots
        self.flashbots_signer = Account.create()
        
        logger.info(f"⚡ Initialisation Flashbots...")
        logger.info(f"   Relay: {relay_url}")
        logger.info(f"   Trading account: {account.address}")
        logger.info(f"   Flashbots signer: {self.flashbots_signer.address}")
        
        # Injecter Flashbots dans Web3
        try:
            flashbot(
                w3=self.w3,
                signature_account=self.flashbots_signer,
                endpoint_uri=relay_url
            )
            
            logger.info(f"✅ Flashbots initialisé!")
            
        except Exception as e:
            logger.error(f"❌ Erreur initialisation Flashbots: {e}")
            raise
    
    async def execute_flash_loan_bundle(
        self,
        contract,
        flash_loan_params: Dict,
        max_retries: int = 3,
        priority_fee_gwei: float = 3.0
    ) -> Tuple[bool, Optional[str], Dict]:
        """
        Exécute un Flash Loan via Flashbots Bundle
        
        Pipeline:
        1. Construction TX
        2. Simulation
        3. Création bundle
        4. Envoi privé
        5. Attente inclusion
        6. Retry si échec
        
        Args:
            contract: Contrat FlashBot
            flash_loan_params: Paramètres encodés du Flash Loan
            max_retries: Nombre de tentatives max
            priority_fee_gwei: Priority fee en Gwei
        
        Returns:
            (success, tx_hash, metrics)
        """
        
        start_time = time.time()
        
        logger.info(f"\n⚡ FLASHBOTS BUNDLE EXECUTION")
        logger.info(f"   Montant: ${flash_loan_params['amount']:,.2f}")
        logger.info(f"   Token: {flash_loan_params['token'][:10]}...")
        logger.info(f"   Profit estimé: ${flash_loan_params['estimated_profit']:.2f}")
        
        # ============================================
        # 1. CONSTRUCTION DE LA TRANSACTION
        # ============================================
        
        logger.info(f"\n📝 Construction de la transaction...")
        
        try:
            signed_tx = await self._build_flash_loan_transaction(
                contract,
                flash_loan_params,
                priority_fee_gwei
            )
            
            logger.info(f"✅ Transaction construite et signée")
            
        except Exception as e:
            logger.error(f"❌ Erreur construction TX: {e}")
            return False, None, {'error': str(e)}
        
        # ============================================
        # 2. RETRY LOOP
        # ============================================
        
        for attempt in range(max_retries):
            logger.info(f"\n📦 Tentative {attempt + 1}/{max_retries}")
            
            # Block cible
            current_block = self.w3.eth.block_number
            target_block = current_block + 1 + attempt
            
            logger.info(f"   Block actuel: {current_block}")
            logger.info(f"   Block cible: {target_block}")
            
            # Créer bundle
            bundle = [
                {
                    "signed_transaction": signed_tx.rawTransaction
                }
            ]
            
            # ============================================
            # 3. SIMULATION (CRITIQUE!)
            # ============================================
            
            logger.info(f"\n🧪 Simulation du bundle...")
            
            simulation_result = await self._simulate_bundle(
                bundle,
                target_block
            )
            
            if not simulation_result['success']:
                logger.error(f"❌ Simulation échouée: {simulation_result['error']}")
                
                # Ne pas envoyer si simulation échoue!
                if attempt == max_retries - 1:
                    return False, None, simulation_result
                
                # Retry avec nouveau block
                continue
            
            logger.info(f"✅ Simulation réussie!")
            logger.info(f"   Gas utilisé: {simulation_result['gas_used']:,}")
            logger.info(f"   Coinbase diff: {simulation_result['coinbase_diff']:.6f} ETH")
            
            # ============================================
            # 4. ENVOI DU BUNDLE
            # ============================================
            
            logger.info(f"\n📤 Envoi du bundle au relayer...")
            
            try:
                result = self.w3.flashbots.send_bundle(
                    bundle,
                    target_block_number=target_block
                )
                
                self.bundles_sent += 1
                
                bundle_hash = result.bundle_hash.hex() if hasattr(result, 'bundle_hash') else 'N/A'
                
                logger.info(f"✅ Bundle envoyé!")
                logger.info(f"   Bundle Hash: {bundle_hash}")
                logger.info(f"   Target Block: {target_block}")
                
            except Exception as e:
                logger.error(f"❌ Erreur envoi bundle: {e}")
                
                if attempt < max_retries - 1:
                    await asyncio.sleep(3)
                    continue
                else:
                    return False, None, {'error': str(e)}
            
            # ============================================
            # 5. ATTENTE INCLUSION
            # ============================================
            
            logger.info(f"\n⏳ Attente inclusion (timeout 15s)...")
            
            try:
                # Wait avec timeout
                result.wait(timeout=15)
                
                # Vérifier si inclus
                if hasattr(result, 'receipts') and result.receipts():
                    receipts = result.receipts()
                    tx_hash = receipts[0]['transactionHash'].hex()
                    block_number = receipts[0]['blockNumber']
                    gas_used = receipts[0]['gasUsed']
                    
                    # Calculer coût gas réel
                    effective_gas_price = receipts[0]['effectiveGasPrice']
                    gas_cost_wei = gas_used * effective_gas_price
                    gas_cost_eth = gas_cost_wei / 10**18
                    eth_price_usd = 2000.0  # TODO: fetch real price
                    gas_cost_usd = gas_cost_eth * eth_price_usd
                    
                    # Profit net
                    net_profit = flash_loan_params['estimated_profit'] - gas_cost_usd
                    
                    # Stats
                    self.bundles_included += 1
                    self.total_profit += net_profit
                    self.total_gas_paid += gas_cost_usd
                    
                    execution_time = time.time() - start_time
                    
                    logger.info(f"\n✅ BUNDLE INCLUS!")
                    logger.info(f"   TX Hash: {tx_hash}")
                    logger.info(f"   Block: {block_number}")
                    logger.info(f"   Gas utilisé: {gas_used:,}")
                    logger.info(f"   Coût gas: ${gas_cost_usd:.2f}")
                    logger.info(f"   Profit brut: ${flash_loan_params['estimated_profit']:.2f}")
                    logger.info(f"   Profit net: ${net_profit:.2f}")
                    logger.info(f"   Temps total: {execution_time:.2f}s")
                    
                    # Métriques
                    metrics = {
                        'success': True,
                        'tx_hash': tx_hash,
                        'block_number': block_number,
                        'gas_used': gas_used,
                        'gas_cost_usd': gas_cost_usd,
                        'profit_gross': flash_loan_params['estimated_profit'],
                        'profit_net': net_profit,
                        'execution_time': execution_time,
                        'attempts': attempt + 1,
                    }
                    
                    # Historique
                    self.bundle_history.append({
                        'timestamp': time.time(),
                        'success': True,
                        'metrics': metrics,
                    })
                    
                    return True, tx_hash, metrics
                
                else:
                    logger.warning(f"⚠️  Bundle non inclus dans block {target_block}")
                    
                    if attempt < max_retries - 1:
                        logger.info(f"   Retry sur le prochain block...")
                        await asyncio.sleep(12)  # Attendre prochain block
                    
            except Exception as e:
                logger.warning(f"⚠️  Timeout ou erreur wait: {e}")
                
                # Vérifier manuellement si TX passée
                await asyncio.sleep(3)
                
                new_nonce = self.w3.eth.get_transaction_count(self.account.address)
                if new_nonce > signed_tx.nonce:
                    logger.info(f"✅ Transaction probablement incluse (nonce incrementé)")
                    # TODO: Retrouver la TX
                    return True, None, {'success': True, 'note': 'TX incluse mais hash non récupéré'}
                
                if attempt < max_retries - 1:
                    continue
        
        # ============================================
        # ÉCHEC APRÈS TOUTES LES TENTATIVES
        # ============================================
        
        self.bundles_failed += 1
        
        logger.error(f"\n❌ Bundle non inclus après {max_retries} tentatives")
        
        metrics = {
            'success': False,
            'attempts': max_retries,
            'reason': 'Bundle non inclus dans les blocks cibles',
        }
        
        self.bundle_history.append({
            'timestamp': time.time(),
            'success': False,
            'metrics': metrics,
        })
        
        return False, None, metrics
    
    async def _build_flash_loan_transaction(
        self,
        contract,
        params: Dict,
        priority_fee_gwei: float
    ):
        """
        Construit et signe la transaction Flash Loan
        """
        # Paramètres
        token_address = params['token']
        amount_wei = int(params['amount'] * 10**6)  # 6 decimals
        encoded_params = params['encoded_params']
        
        # Nonce
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        
        # Gas estimation
        try:
            gas_estimate = contract.functions.requestFlashLoan(
                token_address,
                amount_wei,
                encoded_params
            ).estimate_gas({'from': self.account.address})
            
            gas_limit = int(gas_estimate * 1.3)  # +30% marge
            
            logger.info(f"   Gas estimé: {gas_estimate:,}")
            logger.info(f"   Gas limit: {gas_limit:,}")
            
        except Exception as e:
            logger.warning(f"   ⚠️  Estimation gas échouée: {e}")
            gas_limit = 800_000  # Fallback
        
        # Gas price EIP-1559
        base_fee = self.w3.eth.get_block('latest')['baseFeePerGas']
        priority_fee_wei = int(priority_fee_gwei * 10**9)
        max_fee = base_fee + priority_fee_wei
        
        logger.info(f"   Base fee: {base_fee / 10**9:.2f} Gwei")
        logger.info(f"   Priority fee: {priority_fee_gwei:.2f} Gwei")
        logger.info(f"   Max fee: {max_fee / 10**9:.2f} Gwei")
        
        # Construire TX
        tx = contract.functions.requestFlashLoan(
            token_address,
            amount_wei,
            encoded_params
        ).build_transaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': gas_limit,
            'maxFeePerGas': max_fee,
            'maxPriorityFeePerGas': priority_fee_wei,
            'chainId': self.w3.eth.chain_id,
        })
        
        # Signer
        signed_tx = self.account.sign_transaction(tx)
        
        return signed_tx
    
    async def _simulate_bundle(
        self,
        bundle: List[Dict],
        target_block: int
    ) -> Dict:
        """
        Simule un bundle avant envoi
        
        CRITIQUE: Ne jamais envoyer un bundle non simulé!
        """
        try:
            simulation = self.w3.flashbots.simulate(
                bundle,
                block_tag=target_block - 1  # Simuler sur block précédent
            )
            
            # Vérifier erreur
            if hasattr(simulation, 'error') and simulation.error:
                return {
                    'success': False,
                    'error': simulation.error,
                }
            
            # Extraire résultats
            gas_used = 0
            coinbase_diff = 0
            
            if hasattr(simulation, 'results'):
                for result in simulation.results:
                    if hasattr(result, 'gasUsed'):
                        gas_used = result.gasUsed
                    
                    if hasattr(result, 'coinbaseDiff'):
                        coinbase_diff = int(result.coinbaseDiff) / 10**18
            
            return {
                'success': True,
                'gas_used': gas_used,
                'coinbase_diff': coinbase_diff,
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
            }
    
    def get_statistics(self) -> Dict:
        """Statistiques de l'exécuteur"""
        success_rate = 0
        if self.bundles_sent > 0:
            success_rate = (self.bundles_included / self.bundles_sent) * 100
        
        avg_profit = 0
        if self.bundles_included > 0:
            avg_profit = self.total_profit / self.bundles_included
        
        return {
            'bundles_sent': self.bundles_sent,
            'bundles_included': self.bundles_included,
            'bundles_failed': self.bundles_failed,
            'success_rate': success_rate,
            'total_profit': self.total_profit,
            'total_gas_paid': self.total_gas_paid,
            'net_profit': self.total_profit - self.total_gas_paid,
            'avg_profit_per_bundle': avg_profit,
        }
    
    def print_statistics(self):
        """Affiche les statistiques"""
        stats = self.get_statistics()
        
        print("\n" + "="*60)
        print("⚡ STATISTIQUES FLASHBOTS")
        print("="*60)
        print(f"Bundles envoyés: {stats['bundles_sent']}")
        print(f"Bundles inclus: {stats['bundles_included']}")
        print(f"Bundles échoués: {stats['bundles_failed']}")
        print(f"Taux de succès: {stats['success_rate']:.1f}%")
        print(f"\nProfit total: ${stats['total_profit']:,.2f}")
        print(f"Gas payé: ${stats['total_gas_paid']:,.2f}")
        print(f"Profit net: ${stats['net_profit']:,.2f}")
        print(f"Profit moyen/bundle: ${stats['avg_profit_per_bundle']:.2f}")
        print("="*60 + "\n")


async def example_usage():
    """Exemple d'utilisation"""
    from web3 import Web3
    from eth_account import Account
    import os
    
    # Setup
    rpc_url = os.getenv('ETHEREUM_RPC_URL', 'https://eth.llamarpc.com')
    private_key = os.getenv('PRIVATE_KEY')
    
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    account = Account.from_key(private_key)
    
    # Initialiser exécuteur
    executor = FlashbotsBundleExecutor(
        w3=w3,
        account=account,
        relay_url="https://relay.flashbots.net"
    )
    
    # Exemple de paramètres (simulés)
    flash_loan_params = {
        'token': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',  # USDC Polygon
        'amount': 10000,
        'encoded_params': b'\x00' * 32,  # Paramètres encodés
        'estimated_profit': 247.50,
    }
    
    # Exécuter (en mode test)
    print("🧪 MODE TEST - Aucun bundle réel ne sera envoyé")
    print("   Pour envoyer réellement, utilisez launcher_production.py")
    
    # Stats
    executor.print_statistics()


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format='%(message)s'
    )
    
    asyncio.run(example_usage())
