"""
⚡ Flashbots Integration - Protection MEV
==========================================

Intégration avec Flashbots pour:
- Éviter le front-running
- Exécution garantie au meilleur prix
- Protection contre le sandwich attacks
- Bundle transactions
- Retry automatique si bundle non inclus

Documentation: https://docs.flashbots.net/
"""

import os
import logging
import time
from typing import Dict, Tuple, Optional, List
from web3 import Web3
from eth_account import Account
from eth_account.signers.local import LocalAccount

# Import Flashbots
try:
    from flashbots import flashbot
    from flashbots.flashbots import FlashbotsBundleProvider
    FLASHBOTS_AVAILABLE = True
except ImportError:
    FLASHBOTS_AVAILABLE = False
    logging.warning("⚠️  Module flashbots non installé. Exécution: pip install flashbots")

logger = logging.getLogger(__name__)


class FlashbotsExecutor:
    """
    Exécuteur Flashbots pour les transactions MEV
    
    Protection maximale contre:
    - Front-running
    - Sandwich attacks
    - MEV extraction par d'autres bots
    """
    
    def __init__(self, w3: Web3, account: LocalAccount):
        self.w3 = w3
        self.account = account
        
        # Statistiques
        self.bundles_sent = 0
        self.bundles_included = 0
        self.bundles_failed = 0
        self.total_profit = 0.0
        
        if not FLASHBOTS_AVAILABLE:
            logger.warning("⚠️  Flashbots non disponible, mode standard uniquement")
            self.flashbots_enabled = False
            return
        
        # Créer une identité réputationnelle pour Flashbots
        # IMPORTANT: Cette clé est différente de la clé de trading
        # Elle sert uniquement à signer les bundles pour la réputation
        self.flashbots_signer = Account.create()
        
        logger.info(f"🔐 Flashbots Signer créé: {self.flashbots_signer.address}")
        logger.info(f"   Cette clé ne nécessite aucun fonds (réputation uniquement)")
        
        # Initialiser Flashbots sur le provider Web3
        try:
            # Injecter Flashbots dans w3
            flashbot(
                w3=self.w3,
                signature_account=self.flashbots_signer,
                endpoint_uri=os.getenv(
                    "FLASHBOTS_RELAY", 
                    "https://relay.flashbots.net"
                )
            )
            
            self.flashbots_enabled = True
            logger.info(f"✅ Flashbots initialisé")
            logger.info(f"   Relay: {os.getenv('FLASHBOTS_RELAY', 'https://relay.flashbots.net')}")
            
        except Exception as e:
            logger.error(f"❌ Erreur initialisation Flashbots: {e}")
            self.flashbots_enabled = False
    
    async def execute_flash_loan(
        self,
        contract,
        params: Dict,
        max_priority_fee: float = 2.0,
        max_retries: int = 3
    ) -> Tuple[bool, Optional[str]]:
        """
        Exécute un Flash Loan via Flashbots avec retry automatique
        
        Args:
            contract: Contrat FlashBot
            params: Paramètres du Flash Loan
            max_priority_fee: Priority fee maximum (Gwei)
            max_retries: Nombre de tentatives maximum
        
        Returns:
            (success, tx_hash)
        """
        
        if not self.flashbots_enabled:
            logger.warning("⚠️  Flashbots désactivé, exécution standard")
            return await self._execute_standard(contract, params)
        
        try:
            logger.info("⚡ FLASHBOTS - Préparation du bundle privé...")
            
            # Construire la transaction Flash Loan
            signed_tx = await self._build_flash_loan_transaction(
                contract,
                params,
                max_priority_fee
            )
            
            # Envoyer le bundle avec retry
            for attempt in range(max_retries):
                logger.info(f"📦 Tentative {attempt + 1}/{max_retries}")
                
                success, tx_hash = await self._send_private_bundle(
                    signed_tx,
                    attempt
                )
                
                if success:
                    self.bundles_included += 1
                    self.total_profit += params.get('estimated_profit', 0)
                    
                    logger.info(f"✅ BUNDLE INCLUS!")
                    logger.info(f"   TX Hash: {tx_hash}")
                    logger.info(f"   Stats: {self.bundles_included}/{self.bundles_sent} inclus ({self.get_success_rate():.1f}%)")
                    
                    return True, tx_hash
                else:
                    logger.warning(f"⚠️  Bundle non inclus (tentative {attempt + 1})")
                    
                    if attempt < max_retries - 1:
                        # Attendre le prochain block avant retry
                        await self._wait_next_block()
            
            # Toutes les tentatives ont échoué
            self.bundles_failed += 1
            logger.error(f"❌ Bundle non inclus après {max_retries} tentatives")
            
            # Option: Fallback vers exécution standard
            if os.getenv("FALLBACK_TO_STANDARD", "true").lower() == "true":
                logger.info("🔄 Fallback vers exécution standard...")
                return await self._execute_standard(contract, params)
            
            return False, None
            
        except Exception as e:
            logger.error(f"❌ Erreur Flashbots: {e}")
            self.bundles_failed += 1
            
            # Fallback
            return await self._execute_standard(contract, params)
    
    async def _build_flash_loan_transaction(
        self,
        contract,
        params: Dict,
        max_priority_fee: float
    ):
        """
        Construit et signe la transaction Flash Loan
        """
        # Encoder les paramètres
        encoded_params = self._encode_params(params)
        
        # Adresses et montants
        token_address = params['token']
        amount = int(params['amount'] * 10**6)  # 6 decimals pour stablecoins
        
        # Obtenir le nonce actuel
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        
        # Gas estimation
        try:
            gas_estimate = contract.functions.requestFlashLoan(
                token_address,
                amount,
                encoded_params
            ).estimate_gas({'from': self.account.address})
            
            gas_limit = int(gas_estimate * 1.2)  # +20% de marge
            logger.info(f"⛽ Gas estimé: {gas_estimate:,} (limite: {gas_limit:,})")
            
        except Exception as e:
            logger.warning(f"⚠️  Impossible d'estimer le gas: {e}")
            gas_limit = 500_000  # Fallback
        
        # Gas price avec EIP-1559
        base_fee = self.w3.eth.get_block('latest')['baseFeePerGas']
        priority_fee = int(max_priority_fee * 10**9)  # Gwei → Wei
        max_fee = base_fee + priority_fee
        
        logger.info(f"⛽ Base fee: {base_fee / 10**9:.2f} Gwei")
        logger.info(f"⛽ Priority fee: {priority_fee / 10**9:.2f} Gwei")
        logger.info(f"⛽ Max fee: {max_fee / 10**9:.2f} Gwei")
        
        # Construire la transaction
        tx = contract.functions.requestFlashLoan(
            token_address,
            amount,
            encoded_params
        ).build_transaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': gas_limit,
            'maxFeePerGas': max_fee,
            'maxPriorityFeePerGas': priority_fee,
            'chainId': self.w3.eth.chain_id,
        })
        
        # Signer la transaction
        signed_tx = self.account.sign_transaction(tx)
        
        logger.info(f"✍️  Transaction signée")
        logger.info(f"   Nonce: {nonce}")
        logger.info(f"   Gas limit: {gas_limit:,}")
        
        return signed_tx
    
    async def _send_private_bundle(
        self,
        signed_tx,
        attempt: int = 0
    ) -> Tuple[bool, Optional[str]]:
        """
        Envoie un bundle privé via Flashbots
        
        IMPORTANT: Le bundle n'est visible que par les mineurs
        = Aucun front-running possible!
        """
        
        # Block cible
        current_block = self.w3.eth.block_number
        target_block = current_block + 1 + attempt  # +1 pour retry
        
        logger.info(f"🎯 Block actuel: {current_block}")
        logger.info(f"🎯 Block cible: {target_block}")
        
        # Créer le bundle
        bundle = [
            {
                "signed_transaction": signed_tx.rawTransaction
            }
        ]
        
        try:
            # SIMULATION D'ABORD (très important!)
            logger.info(f"🧪 Simulation du bundle...")
            
            simulation = self.w3.flashbots.simulate(
                bundle,
                block_tag=current_block
            )
            
            # Vérifier le résultat de la simulation
            if hasattr(simulation, 'error') and simulation.error:
                logger.error(f"❌ Simulation échouée: {simulation.error}")
                return False, None
            
            # Calculer le profit effectif
            if hasattr(simulation, 'results'):
                for result in simulation.results:
                    if hasattr(result, 'coinbaseDiff'):
                        miner_payment = int(result.coinbaseDiff)
                        logger.info(f"💰 Paiement mineur: {miner_payment / 10**18:.6f} ETH")
                    
                    if hasattr(result, 'gasUsed'):
                        gas_used = result.gasUsed
                        logger.info(f"⛽ Gas utilisé: {gas_used:,}")
            
            logger.info(f"✅ Simulation réussie!")
            
        except Exception as e:
            logger.warning(f"⚠️  Simulation échouée: {e}")
            # Continuer quand même (la simulation n'est pas obligatoire)
        
        # ENVOI DU BUNDLE
        logger.info(f"📤 Envoi du bundle au relayer Flashbots...")
        
        try:
            # Envoyer le bundle
            result = self.w3.flashbots.send_bundle(
                bundle,
                target_block_number=target_block
            )
            
            self.bundles_sent += 1
            
            logger.info(f"📦 Bundle envoyé!")
            logger.info(f"   Bundle Hash: {result.bundle_hash.hex() if hasattr(result, 'bundle_hash') else 'N/A'}")
            logger.info(f"   Target Block: {target_block}")
            
            # ATTENDRE L'INCLUSION
            logger.info(f"⏳ Attente de l'inclusion (timeout 15s)...")
            
            # Wait avec timeout
            try:
                result.wait(timeout=15)
                
                # Vérifier si inclus
                if hasattr(result, 'receipts') and result.receipts():
                    receipts = result.receipts()
                    tx_hash = receipts[0]['transactionHash'].hex()
                    
                    logger.info(f"✅ Bundle inclus dans le block {target_block}!")
                    
                    return True, tx_hash
                else:
                    logger.warning(f"⚠️  Bundle non inclus dans le block {target_block}")
                    return False, None
                    
            except Exception as wait_error:
                logger.warning(f"⚠️  Timeout ou erreur wait: {wait_error}")
                
                # Vérifier manuellement si la TX a été incluse
                time.sleep(3)  # Attendre un peu
                
                # Récupérer le nonce actuel pour voir si la TX est passée
                new_nonce = self.w3.eth.get_transaction_count(self.account.address)
                old_nonce = signed_tx.nonce
                
                if new_nonce > old_nonce:
                    logger.info(f"✅ Transaction probablement incluse (nonce incrementé)")
                    # Essayer de retrouver la TX
                    return True, None
                else:
                    return False, None
            
        except Exception as e:
            logger.error(f"❌ Erreur envoi bundle: {e}")
            return False, None
    
    async def _execute_standard(
        self,
        contract,
        params: Dict
    ) -> Tuple[bool, Optional[str]]:
        """
        Exécution standard (fallback si Flashbots indisponible)
        
        ⚠️ ATTENTION: Vulnérable au front-running!
        """
        logger.warning("⚠️  EXÉCUTION STANDARD (VULNÉRABLE AU MEV)")
        
        try:
            # Encoder les paramètres
            encoded_params = self._encode_params(params)
            
            # Construire la transaction
            token_address = params['token']
            amount = int(params['amount'] * 10**6)
            
            tx = contract.functions.requestFlashLoan(
                token_address,
                amount,
                encoded_params
            ).build_transaction({
                'from': self.account.address,
                'nonce': self.w3.eth.get_transaction_count(self.account.address),
                'gas': 500_000,
                'gasPrice': self.w3.eth.gas_price,
            })
            
            # Signer
            signed_tx = self.account.sign_transaction(tx)
            
            # Envoyer (DANGEREUX - public mempool!)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            logger.info(f"📤 Transaction envoyée (standard): {tx_hash.hex()}")
            logger.warning(f"⚠️  Vulnérable au front-running!")
            
            # Attendre
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
            
            if receipt['status'] == 1:
                logger.info(f"✅ Transaction confirmée!")
                return True, tx_hash.hex()
            else:
                logger.error(f"❌ Transaction échouée")
                return False, None
            
        except Exception as e:
            logger.error(f"❌ Erreur exécution standard: {e}")
            return False, None
    
    async def _wait_next_block(self):
        """Attend le prochain block"""
        current_block = self.w3.eth.block_number
        logger.info(f"⏳ Attente du block {current_block + 1}...")
        
        while self.w3.eth.block_number <= current_block:
            time.sleep(1)
        
        logger.info(f"✅ Nouveau block: {self.w3.eth.block_number}")
    
    def _encode_params(self, params: Dict) -> bytes:
        """
        Encode les paramètres pour le smart contract
        """
        from eth_abi import encode
        
        # Paramètres: (tokenIn, tokenOut, path1, path2, minProfit, dex1, dex2)
        return encode(
            ['address', 'address', 'address[]', 'address[]', 'uint256', 'uint8', 'uint8'],
            [
                Web3.to_checksum_address(params['token']),
                Web3.to_checksum_address(params['token_out']),
                [Web3.to_checksum_address(addr) for addr in params['path_buy']],
                [Web3.to_checksum_address(addr) for addr in params['path_sell']],
                int(params['min_profit'] * 10**6),
                params['dex_buy'],
                params['dex_sell'],
            ]
        )
    
    async def send_multi_transaction_bundle(
        self,
        transactions: List[Dict],
        target_block: Optional[int] = None
    ) -> Tuple[bool, Optional[str]]:
        """
        Envoie un bundle avec plusieurs transactions
        
        Utile pour:
        - Atomic arbitrage multi-étapes
        - Sandwich attacks (si on est du côté attaquant)
        - Flash Loans complexes
        
        Args:
            transactions: Liste de dicts avec 'to', 'data', 'value', 'gas'
            target_block: Block cible (None = prochain)
        
        Returns:
            (success, bundle_hash)
        """
        if not self.flashbots_enabled:
            logger.error("❌ Flashbots requis pour les bundles multi-TX")
            return False, None
        
        try:
            # Signer toutes les transactions
            signed_txs = []
            nonce = self.w3.eth.get_transaction_count(self.account.address)
            
            for i, tx_params in enumerate(transactions):
                tx = {
                    'from': self.account.address,
                    'to': tx_params['to'],
                    'data': tx_params.get('data', '0x'),
                    'value': tx_params.get('value', 0),
                    'gas': tx_params.get('gas', 100_000),
                    'nonce': nonce + i,
                    'gasPrice': self.w3.eth.gas_price,
                    'chainId': self.w3.eth.chain_id,
                }
                
                signed_tx = self.account.sign_transaction(tx)
                signed_txs.append({
                    "signed_transaction": signed_tx.rawTransaction
                })
            
            # Block cible
            if target_block is None:
                target_block = self.w3.eth.block_number + 1
            
            logger.info(f"📦 Envoi bundle multi-TX ({len(signed_txs)} transactions)")
            logger.info(f"🎯 Block cible: {target_block}")
            
            # Envoyer
            result = self.w3.flashbots.send_bundle(
                signed_txs,
                target_block_number=target_block
            )
            
            self.bundles_sent += 1
            
            # Attendre
            result.wait()
            
            if result.receipts():
                self.bundles_included += 1
                logger.info(f"✅ Bundle multi-TX inclus!")
                return True, result.bundle_hash.hex()
            else:
                self.bundles_failed += 1
                return False, None
            
        except Exception as e:
            logger.error(f"❌ Erreur bundle multi-TX: {e}")
            self.bundles_failed += 1
            return False, None
    
    def get_success_rate(self) -> float:
        """Calcule le taux de succès des bundles"""
        if self.bundles_sent == 0:
            return 0.0
        return (self.bundles_included / self.bundles_sent) * 100
    
    def get_stats(self) -> Dict:
        """Retourne les statistiques Flashbots"""
        return {
            'bundles_sent': self.bundles_sent,
            'bundles_included': self.bundles_included,
            'bundles_failed': self.bundles_failed,
            'success_rate': self.get_success_rate(),
            'total_profit': self.total_profit,
            'avg_profit_per_bundle': self.total_profit / max(self.bundles_included, 1),
        }
    
    def print_stats(self):
        """Affiche les statistiques"""
        stats = self.get_stats()
        
        logger.info("\n" + "="*60)
        logger.info("⚡ STATISTIQUES FLASHBOTS")
        logger.info("="*60)
        logger.info(f"Bundles envoyés: {stats['bundles_sent']}")
        logger.info(f"Bundles inclus: {stats['bundles_included']}")
        logger.info(f"Bundles échoués: {stats['bundles_failed']}")
        logger.info(f"Taux de succès: {stats['success_rate']:.1f}%")
        logger.info(f"Profit total: ${stats['total_profit']:.2f}")
        logger.info(f"Profit moyen/bundle: ${stats['avg_profit_per_bundle']:.2f}")
        logger.info("="*60 + "\n")


class PolygonMEVProtection:
    """
    Protection MEV pour Polygon (alternative à Flashbots)
    
    Sur Polygon, Flashbots n'est pas disponible nativement.
    Alternatives:
    - Eden Network
    - Bloxroute BDN
    - RPC privé
    """
    
    def __init__(self, w3: Web3, account: LocalAccount):
        self.w3 = w3
        self.account = account
        
        # Configuration RPC privé
        self.private_rpc = os.getenv("PRIVATE_RPC_URL")
        self.private_w3 = None
        
        if self.private_rpc:
            try:
                self.private_w3 = Web3(Web3.HTTPProvider(self.private_rpc))
                if self.private_w3.is_connected():
                    logger.info("✅ RPC privé Polygon connecté")
                    logger.info(f"   Endpoint: {self.private_rpc[:30]}...")
                else:
                    logger.warning("⚠️  RPC privé non disponible")
                    self.private_w3 = None
            except Exception as e:
                logger.error(f"❌ Erreur connexion RPC privé: {e}")
                self.private_w3 = None
        else:
            logger.warning("⚠️  Aucun RPC privé configuré pour Polygon")
            logger.info("   Configurez PRIVATE_RPC_URL dans .env pour la protection MEV")
    
    async def send_private_transaction(self, signed_tx) -> str:
        """
        Envoie une transaction via un RPC privé
        
        Avantages:
        - Pas de mempool public
        - Transaction directe au validateur
        - Protection contre front-running
        """
        if not self.private_w3:
            logger.warning("⚠️  Pas de RPC privé, envoi standard")
            return self.w3.eth.send_raw_transaction(signed_tx.rawTransaction).hex()
        
        try:
            logger.info("🔒 Envoi via RPC privé...")
            
            # Envoyer via le RPC privé
            tx_hash = self.private_w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            logger.info(f"✅ TX envoyée via RPC privé: {tx_hash.hex()}")
            
            # Attendre la confirmation sur le RPC principal
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
            
            if receipt['status'] == 1:
                logger.info(f"✅ Transaction confirmée!")
            
            return tx_hash.hex()
            
        except Exception as e:
            logger.error(f"❌ Erreur envoi privé: {e}")
            # Fallback vers envoi standard
            logger.warning("🔄 Fallback vers RPC public...")
            return self.w3.eth.send_raw_transaction(signed_tx.rawTransaction).hex()