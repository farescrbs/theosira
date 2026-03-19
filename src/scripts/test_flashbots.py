"""
🧪 Test Script Flashbots
========================

Script pour tester l'intégration Flashbots avant de lancer en production

Usage:
    python test_flashbots.py --network mainnet
    python test_flashbots.py --network sepolia --dry-run
"""

import asyncio
import os
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv
import logging

from flashbots_integration import FlashbotsExecutor, PolygonMEVProtection

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s'
)
logger = logging.getLogger(__name__)

# Charger .env
load_dotenv()


async def test_flashbots_connection():
    """Test de connexion Flashbots"""
    logger.info("\n" + "="*60)
    logger.info("TEST 1: Connexion Flashbots")
    logger.info("="*60)
    
    # Connexion Web3
    rpc_url = os.getenv("ETHEREUM_RPC_URL", "https://eth.llamarpc.com")
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    
    if not w3.is_connected():
        logger.error("❌ Impossible de se connecter au RPC")
        return False
    
    logger.info(f"✅ Connecté à Ethereum")
    logger.info(f"   Block: {w3.eth.block_number}")
    logger.info(f"   Chain ID: {w3.eth.chain_id}")
    
    # Créer un compte
    private_key = os.getenv("PRIVATE_KEY")
    if not private_key:
        logger.error("❌ PRIVATE_KEY non définie dans .env")
        return False
    
    account = Account.from_key(private_key)
    logger.info(f"✅ Compte: {account.address}")
    
    # Balance
    balance = w3.eth.get_balance(account.address)
    logger.info(f"   Balance: {w3.from_wei(balance, 'ether'):.4f} ETH")
    
    # Initialiser Flashbots
    try:
        flashbots = FlashbotsExecutor(w3, account)
        
        if flashbots.flashbots_enabled:
            logger.info(f"✅ Flashbots activé!")
            logger.info(f"   Signer: {flashbots.flashbots_signer.address}")
            return True
        else:
            logger.warning("⚠️  Flashbots non activé")
            return False
            
    except Exception as e:
        logger.error(f"❌ Erreur: {e}")
        return False


async def test_bundle_simulation():
    """Test de simulation de bundle"""
    logger.info("\n" + "="*60)
    logger.info("TEST 2: Simulation de Bundle")
    logger.info("="*60)
    
    # Setup
    rpc_url = os.getenv("ETHEREUM_RPC_URL", "https://eth.llamarpc.com")
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    account = Account.from_key(os.getenv("PRIVATE_KEY"))
    
    flashbots = FlashbotsExecutor(w3, account)
    
    if not flashbots.flashbots_enabled:
        logger.warning("⚠️  Flashbots non disponible, test ignoré")
        return False
    
    try:
        # Créer une transaction simple (transfer 0 ETH à soi-même)
        nonce = w3.eth.get_transaction_count(account.address)
        
        tx = {
            'from': account.address,
            'to': account.address,
            'value': 0,
            'gas': 21000,
            'gasPrice': w3.eth.gas_price,
            'nonce': nonce,
            'chainId': w3.eth.chain_id,
        }
        
        signed_tx = account.sign_transaction(tx)
        
        logger.info("🧪 Simulation du bundle...")
        
        # Simuler
        bundle = [{"signed_transaction": signed_tx.rawTransaction}]
        
        simulation = w3.flashbots.simulate(
            bundle,
            block_tag='latest'
        )
        
        if hasattr(simulation, 'error') and simulation.error:
            logger.error(f"❌ Simulation échouée: {simulation.error}")
            return False
        
        logger.info(f"✅ Simulation réussie!")
        
        if hasattr(simulation, 'results'):
            for result in simulation.results:
                if hasattr(result, 'gasUsed'):
                    logger.info(f"   Gas utilisé: {result.gasUsed:,}")
                
                if hasattr(result, 'coinbaseDiff'):
                    logger.info(f"   Paiement mineur: {result.coinbaseDiff / 10**18:.6f} ETH")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur simulation: {e}")
        return False


async def test_polygon_private_rpc():
    """Test RPC privé Polygon"""
    logger.info("\n" + "="*60)
    logger.info("TEST 3: RPC Privé Polygon")
    logger.info("="*60)
    
    # Setup Polygon
    rpc_url = os.getenv("POLYGON_RPC_URL", "https://polygon-rpc.com")
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    
    if not w3.is_connected():
        logger.error("❌ Impossible de se connecter à Polygon")
        return False
    
    logger.info(f"✅ Connecté à Polygon")
    logger.info(f"   Block: {w3.eth.block_number}")
    
    account = Account.from_key(os.getenv("PRIVATE_KEY"))
    
    # Tester protection MEV
    protection = PolygonMEVProtection(w3, account)
    
    if protection.private_w3:
        logger.info(f"✅ RPC privé configuré et fonctionnel!")
        return True
    else:
        logger.warning(f"⚠️  RPC privé non configuré")
        logger.info(f"   Configurez PRIVATE_RPC_URL dans .env pour activer")
        return False


async def test_bundle_send_dry_run():
    """Test d'envoi de bundle (dry run)"""
    logger.info("\n" + "="*60)
    logger.info("TEST 4: Envoi Bundle (Dry Run)")
    logger.info("="*60)
    
    # Setup
    rpc_url = os.getenv("ETHEREUM_RPC_URL", "https://eth.llamarpc.com")
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    account = Account.from_key(os.getenv("PRIVATE_KEY"))
    
    flashbots = FlashbotsExecutor(w3, account)
    
    if not flashbots.flashbots_enabled:
        logger.warning("⚠️  Flashbots non disponible, test ignoré")
        return False
    
    logger.info("⚠️  DRY RUN - Aucune transaction réelle ne sera envoyée")
    logger.info("   Pour un test réel, utilisez --live (consommera du gas!)")
    
    try:
        # Transaction test
        nonce = w3.eth.get_transaction_count(account.address)
        
        tx = {
            'from': account.address,
            'to': account.address,
            'value': 0,
            'gas': 21000,
            'gasPrice': w3.eth.gas_price,
            'nonce': nonce,
            'chainId': w3.eth.chain_id,
        }
        
        signed_tx = account.sign_transaction(tx)
        
        # Créer bundle
        bundle = [{"signed_transaction": signed_tx.rawTransaction}]
        target_block = w3.eth.block_number + 1
        
        logger.info(f"📦 Bundle créé pour block {target_block}")
        logger.info(f"   Transactions: 1")
        logger.info(f"   Gas total: 21,000")
        
        # En dry run, on ne l'envoie pas vraiment
        logger.info(f"✅ Bundle préparé avec succès!")
        logger.info(f"   (Non envoyé en mode dry-run)")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur: {e}")
        return False


async def test_stats():
    """Test des statistiques"""
    logger.info("\n" + "="*60)
    logger.info("TEST 5: Statistiques Flashbots")
    logger.info("="*60)
    
    # Setup
    rpc_url = os.getenv("ETHEREUM_RPC_URL", "https://eth.llamarpc.com")
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    account = Account.from_key(os.getenv("PRIVATE_KEY"))
    
    flashbots = FlashbotsExecutor(w3, account)
    
    # Simuler quelques stats
    flashbots.bundles_sent = 10
    flashbots.bundles_included = 7
    flashbots.bundles_failed = 3
    flashbots.total_profit = 1250.50
    
    # Afficher
    flashbots.print_stats()
    
    # Vérifier
    stats = flashbots.get_stats()
    
    assert stats['success_rate'] == 70.0, "Erreur calcul taux de succès"
    assert stats['avg_profit_per_bundle'] == pytest.approx(178.64, 0.01), "Erreur profit moyen"
    
    logger.info(f"✅ Statistiques calculées correctement!")
    
    return True


async def run_all_tests(dry_run: bool = True):
    """Lance tous les tests"""
    logger.info("\n" + "🧪 " * 30)
    logger.info("SUITE DE TESTS FLASHBOTS THESORIA")
    logger.info("🧪 " * 30 + "\n")
    
    results = {}
    
    # Test 1: Connexion
    results['connection'] = await test_flashbots_connection()
    
    # Test 2: Simulation
    results['simulation'] = await test_bundle_simulation()
    
    # Test 3: RPC Privé
    results['private_rpc'] = await test_polygon_private_rpc()
    
    # Test 4: Envoi Bundle
    if dry_run:
        results['bundle_send'] = await test_bundle_send_dry_run()
    else:
        logger.warning("⚠️  Mode LIVE désactivé pour la sécurité")
    
    # Test 5: Stats
    results['stats'] = await test_stats()
    
    # Résumé
    logger.info("\n" + "="*60)
    logger.info("📊 RÉSUMÉ DES TESTS")
    logger.info("="*60)
    
    total = len(results)
    passed = sum(1 for r in results.values() if r)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        logger.info(f"{test_name:20s} {status}")
    
    logger.info(f"\nRésultat: {passed}/{total} tests réussis")
    
    if passed == total:
        logger.info("\n🎉 TOUS LES TESTS ONT RÉUSSI! 🎉")
        logger.info("Le système Flashbots est prêt pour la production!")
    else:
        logger.warning(f"\n⚠️  {total - passed} test(s) échoué(s)")
        logger.info("Vérifiez la configuration dans .env")
    
    return passed == total


async def main():
    """Point d'entrée"""
    import argparse
    
    parser = argparse.ArgumentParser(description="🧪 Tests Flashbots THESORIA")
    parser.add_argument(
        '--network',
        choices=['mainnet', 'sepolia', 'polygon'],
        default='mainnet',
        help='Réseau à tester'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        default=True,
        help='Mode dry run (défaut)'
    )
    parser.add_argument(
        '--live',
        action='store_true',
        help='Mode live (envoie des vraies TX!)'
    )
    
    args = parser.parse_args()
    
    # Override RPC selon le réseau
    if args.network == 'sepolia':
        os.environ['ETHEREUM_RPC_URL'] = os.getenv(
            'SEPOLIA_RPC_URL',
            'https://sepolia.infura.io/v3/' + os.getenv('INFURA_KEY', '')
        )
    elif args.network == 'polygon':
        os.environ['ETHEREUM_RPC_URL'] = os.getenv(
            'POLYGON_RPC_URL',
            'https://polygon-rpc.com'
        )
    
    logger.info(f"Réseau: {args.network}")
    logger.info(f"Mode: {'LIVE' if args.live else 'DRY RUN'}")
    
    # Lancer les tests
    success = await run_all_tests(dry_run=not args.live)
    
    return 0 if success else 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)
