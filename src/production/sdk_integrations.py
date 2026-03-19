"""
🔗 THESORIA - INTÉGRATIONS SDKs PRODUCTION
==========================================

Intégrations directes avec:
- Aave V3 Core (Flash Loans)
- Uniswap V3 Periphery (DEX)
- Flashbots MEV-Boost
- Artemis (Rust blockchain scanner)
- Langchain (IA orchestration)

Zero latency, maximum profit!
"""

import os
import json
import asyncio
import subprocess
from typing import Dict, List, Optional, Tuple
from web3 import Web3
from web3.types import TxParams
from eth_account import Account
from eth_abi import encode
import aiohttp
import redis.asyncio as aioredis

from config_production import config, get_fastest_rpc, get_aave_pool

# =============================================
# 1. AAVE V3 CORE - FLASH LOANS
# =============================================

class AaveV3FlashLoan:
    """
    Interface avec Aave V3 Pool pour Flash Loans
    
    Repo: https://github.com/aave/aave-v3-core
    """
    
    # ABI du Pool (simplifié)
    POOL_ABI = [
        {
            "inputs": [
                {"name": "receiverAddress", "type": "address"},
                {"name": "assets", "type": "address[]"},
                {"name": "amounts", "type": "uint256[]"},
                {"name": "interestRateModes", "type": "uint256[]"},
                {"name": "onBehalfOf", "type": "address"},
                {"name": "params", "type": "bytes"},
                {"name": "referralCode", "type": "uint16"}
            ],
            "name": "flashLoan",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
    
    def __init__(self, w3: Web3, chain: str):
        self.w3 = w3
        self.chain = chain
        
        # Adresse du Pool Aave V3
        pool_address = get_aave_pool(chain)
        if not pool_address:
            raise ValueError(f"Aave V3 non disponible sur {chain}")
        
        self.pool_contract = w3.eth.contract(
            address=pool_address,
            abi=self.POOL_ABI
        )
        
        print(f"✅ Aave V3 Pool connecté: {pool_address}")
    
    def build_flash_loan_tx(
        self,
        receiver: str,
        token: str,
        amount: int,
        params: bytes,
        account_address: str
    ) -> TxParams:
        """
        Construit une transaction Flash Loan
        
        Args:
            receiver: Adresse du contrat qui reçoit le prêt
            token: Adresse du token à emprunter
            amount: Montant en wei
            params: Paramètres encodés pour le receiver
            account_address: Adresse du compte
        
        Returns:
            Transaction prête à être signée
        """
        
        # Paramètres Aave
        assets = [token]
        amounts = [amount]
        interest_rate_modes = [0]  # 0 = pas d'intérêt (Flash Loan)
        on_behalf_of = receiver
        referral_code = 0
        
        # Construire la transaction
        tx = self.pool_contract.functions.flashLoan(
            receiver,
            assets,
            amounts,
            interest_rate_modes,
            on_behalf_of,
            params,
            referral_code
        ).build_transaction({
            'from': account_address,
            'nonce': self.w3.eth.get_transaction_count(account_address),
            'gas': 0,  # Sera estimé
            'maxFeePerGas': 0,  # Sera calculé
            'maxPriorityFeePerGas': 0,  # Sera calculé
            'chainId': self.w3.eth.chain_id,
        })
        
        # Estimer le gas
        try:
            gas_estimate = self.pool_contract.functions.flashLoan(
                receiver, assets, amounts, interest_rate_modes,
                on_behalf_of, params, referral_code
            ).estimate_gas({'from': account_address})
            
            tx['gas'] = int(gas_estimate * 1.3)  # +30% marge
            
        except Exception as e:
            print(f"⚠️  Estimation gas échouée: {e}")
            tx['gas'] = 800_000  # Fallback
        
        # Gas price dynamique
        base_fee = self.w3.eth.get_block('latest')['baseFeePerGas']
        priority_fee = int(config.PRIORITY_FEE_MULTIPLIER * base_fee * 0.1)
        
        tx['maxFeePerGas'] = base_fee + priority_fee
        tx['maxPriorityFeePerGas'] = priority_fee
        
        return tx
    
    def calculate_flash_loan_fee(self, amount: int) -> int:
        """
        Calcule les frais Aave V3
        
        Aave V3: 0.05% du montant emprunté
        """
        return int(amount * 0.0005)  # 0.05%


# =============================================
# 2. UNISWAP V3 PERIPHERY - DEX SWAPS
# =============================================

class UniswapV3Router:
    """
    Interface avec Uniswap V3 Router
    
    Repo: https://github.com/Uniswap/v3-periphery
    """
    
    # ABI du Router (simplifié)
    ROUTER_ABI = [
        {
            "inputs": [
                {
                    "components": [
                        {"name": "tokenIn", "type": "address"},
                        {"name": "tokenOut", "type": "address"},
                        {"name": "fee", "type": "uint24"},
                        {"name": "recipient", "type": "address"},
                        {"name": "deadline", "type": "uint256"},
                        {"name": "amountIn", "type": "uint256"},
                        {"name": "amountOutMinimum", "type": "uint256"},
                        {"name": "sqrtPriceLimitX96", "type": "uint160"}
                    ],
                    "name": "params",
                    "type": "tuple"
                }
            ],
            "name": "exactInputSingle",
            "outputs": [{"name": "amountOut", "type": "uint256"}],
            "stateMutability": "payable",
            "type": "function"
        }
    ]
    
    # Fee tiers Uniswap V3
    FEE_TIERS = {
        'lowest': 100,    # 0.01%
        'low': 500,       # 0.05%
        'medium': 3000,   # 0.3%
        'high': 10000,    # 1%
    }
    
    def __init__(self, w3: Web3, chain: str):
        self.w3 = w3
        self.chain = chain
        
        # Adresse du Router
        router_address = config.UNISWAP_V3_ROUTER_ADDRESSES.get(chain)
        if not router_address:
            raise ValueError(f"Uniswap V3 non disponible sur {chain}")
        
        self.router_contract = w3.eth.contract(
            address=router_address,
            abi=self.ROUTER_ABI
        )
        
        print(f"✅ Uniswap V3 Router connecté: {router_address}")
    
    def encode_swap_params(
        self,
        token_in: str,
        token_out: str,
        amount_in: int,
        amount_out_min: int,
        recipient: str,
        fee_tier: str = 'medium',
        deadline: int = None
    ) -> Tuple:
        """
        Encode les paramètres pour exactInputSingle
        """
        import time
        
        if deadline is None:
            deadline = int(time.time()) + 300  # 5 minutes
        
        fee = self.FEE_TIERS.get(fee_tier, 3000)
        
        params = (
            token_in,
            token_out,
            fee,
            recipient,
            deadline,
            amount_in,
            amount_out_min,
            0  # sqrtPriceLimitX96 = 0 (pas de limite)
        )
        
        return params
    
    async def get_quote(
        self,
        token_in: str,
        token_out: str,
        amount_in: int,
        fee_tier: str = 'medium'
    ) -> int:
        """
        Obtient un quote pour un swap
        
        Note: En production, utiliser Quoter V2 pour plus de précision
        """
        # TODO: Implémenter appel au Quoter V2
        # Pour l'instant, estimation simple
        return int(amount_in * 0.997)  # -0.3% fee


# =============================================
# 3. FLASHBOTS MEV-BOOST
# =============================================

class FlashbotsMEVBoost:
    """
    Interface avec Flashbots MEV-Boost
    
    Repo: https://github.com/flashbots/mev-boost
    """
    
    def __init__(self, w3: Web3, account: Account):
        self.w3 = w3
        self.account = account
        
        # Initialiser Flashbots
        try:
            from flashbots import flashbot
            
            # Créer signer réputationnel
            self.flashbots_signer = Account.create()
            
            # Injecter dans Web3
            flashbot(
                w3=self.w3,
                signature_account=self.flashbots_signer,
                endpoint_uri=config.FLASHBOTS_RELAYS.get('mainnet')
            )
            
            self.enabled = True
            print(f"✅ Flashbots MEV-Boost connecté")
            print(f"   Signer: {self.flashbots_signer.address}")
            
        except ImportError:
            print(f"⚠️  Module flashbots non installé")
            self.enabled = False
        except Exception as e:
            print(f"⚠️  Erreur Flashbots: {e}")
            self.enabled = False
    
    async def send_bundle_with_relays(
        self,
        signed_tx,
        target_block: int,
        use_all_relays: bool = True
    ) -> Dict:
        """
        Envoie un bundle à tous les relayers MEV-Boost
        
        Avantage: Maximise les chances d'inclusion
        """
        if not self.enabled:
            raise Exception("Flashbots non disponible")
        
        bundle = [{"signed_transaction": signed_tx.rawTransaction}]
        
        # Envoyer au relayer principal
        result = self.w3.flashbots.send_bundle(
            bundle,
            target_block_number=target_block
        )
        
        # Si activé, envoyer aussi aux autres relayers
        if use_all_relays:
            await self._broadcast_to_all_relays(bundle, target_block)
        
        return {
            'bundle_hash': result.bundle_hash.hex() if hasattr(result, 'bundle_hash') else None,
            'target_block': target_block,
        }
    
    async def _broadcast_to_all_relays(self, bundle: List, target_block: int):
        """Broadcast le bundle à tous les relayers MEV-Boost"""
        
        async with aiohttp.ClientSession() as session:
            tasks = []
            
            for relay_url in config.MEV_BOOST_RELAYS:
                task = self._send_to_relay(session, relay_url, bundle, target_block)
                tasks.append(task)
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            success_count = sum(1 for r in results if not isinstance(r, Exception))
            print(f"📡 Bundle envoyé à {success_count}/{len(tasks)} relayers")
    
    async def _send_to_relay(
        self,
        session: aiohttp.ClientSession,
        relay_url: str,
        bundle: List,
        target_block: int
    ):
        """Envoie un bundle à un relayer spécifique"""
        try:
            # Format MEV-Boost
            payload = {
                "jsonrpc": "2.0",
                "method": "eth_sendBundle",
                "params": [
                    {
                        "txs": [tx['signed_transaction'].hex() for tx in bundle],
                        "blockNumber": hex(target_block),
                    }
                ],
                "id": 1
            }
            
            async with session.post(relay_url, json=payload, timeout=5) as resp:
                return await resp.json()
                
        except Exception as e:
            print(f"⚠️  Erreur relay {relay_url[:50]}...: {e}")
            raise


# =============================================
# 4. ARTEMIS - RUST BLOCKCHAIN SCANNER
# =============================================

class ArtemisScanner:
    """
    Interface avec Artemis (Rust blockchain agent)
    
    Repo: https://github.com/paradigmxyz/artemis
    
    Artemis est un framework Rust ultra-rapide pour:
    - Scanner le mempool en temps réel
    - Détecter les opportunités MEV
    - Exécuter des stratégies automatiquement
    """
    
    def __init__(self):
        self.artemis_bin = config.ARTEMIS_BIN
        self.artemis_config = config.ARTEMIS_CONFIG
        self.process = None
        
        # Vérifier si Artemis est installé
        if not os.path.exists(self.artemis_bin):
            print(f"⚠️  Artemis non trouvé: {self.artemis_bin}")
            print(f"   Installation: cargo install artemis-core")
            self.available = False
        else:
            print(f"✅ Artemis trouvé: {self.artemis_bin}")
            self.available = True
    
    async def start_scanner(self, strategies: List[str] = None):
        """
        Démarre Artemis en mode scanner
        
        Args:
            strategies: Liste des stratégies à activer
                - sandwich: Détecte les opportunités sandwich
                - jit: Just-In-Time liquidity
                - liquidation: Liquidations de positions
                - cex-dex-arbitrage: Arbitrage CEX/DEX
        """
        if not self.available:
            print(f"⚠️  Artemis non disponible, scan ignoré")
            return
        
        strategies = strategies or config.ARTEMIS_STRATEGIES
        
        # Validate strategy names (whitelist)
        allowed_strategies = {'sandwich', 'jit', 'liquidation', 'cex-dex-arbitrage'}
        validated_strategies = [s for s in strategies if s in allowed_strategies]
        
        if not validated_strategies:
            print(f"⚠️  Aucune stratégie valide fournie")
            return
        
        print(f"🦀 Démarrage Artemis Scanner...")
        print(f"   Stratégies: {', '.join(validated_strategies)}")
        
        # Construire la commande - paths are validated in __init__
        cmd = [
            self.artemis_bin,
            'run',
            '--config', self.artemis_config,
        ]
        
        for strategy in validated_strategies:
            cmd.extend(['--strategy', strategy])
        
        try:
            # Lancer Artemis en subprocess - shell=False for security
            self.process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                shell=False  # Explicitly disable shell to prevent command injection
            )
            
            print(f"✅ Artemis démarré (PID: {self.process.pid})")
            
        except Exception as e:
            print(f"❌ Erreur démarrage Artemis: {e}")
    
    def stop_scanner(self):
        """Arrête Artemis"""
        if self.process:
            self.process.terminate()
            self.process.wait()
            print(f"🛑 Artemis arrêté")
    
    async def get_opportunities(self) -> List[Dict]:
        """
        Récupère les opportunités détectées par Artemis
        
        Note: Artemis communique via IPC ou Redis
        """
        # TODO: Implémenter lecture depuis Redis/IPC
        return []


# =============================================
# 5. LANGCHAIN - IA ORCHESTRATION
# =============================================

class LangchainOrchestrator:
    """
    Orchestrateur IA avec Langchain
    
    Repo: https://github.com/langchain-ai/langchain
    
    Utilise Langchain pour:
    - Analyser les opportunités
    - Prendre des décisions
    - Optimiser les paramètres
    - Apprendre des résultats
    """
    
    def __init__(self):
        # Vérifier si Langchain est disponible
        try:
            from langchain.llms import OpenAI
            from langchain.chains import LLMChain
            from langchain.prompts import PromptTemplate
            
            self.available = True
            
            # Initialiser OpenAI
            self.llm = OpenAI(
                api_key=config.OPENAI_API_KEY,
                model_name=config.OPENAI_MODEL,
                temperature=config.OPENAI_TEMPERATURE,
                max_tokens=config.OPENAI_MAX_TOKENS,
            )
            
            # Template de prompt pour l'analyse
            self.analysis_template = PromptTemplate(
                input_variables=["opportunity", "context"],
                template="""
Analysez cette opportunité de trading MEV:

Opportunité: {opportunity}

Contexte du marché: {context}

Répondez avec un JSON contenant:
- score: note de 0 à 100
- confidence: confiance de 0 à 1
- recommended_amount: montant recommandé en USD
- recommended_slippage: slippage recommandé (0.005 = 0.5%)
- risk_level: 'low', 'medium', 'high'
- reason: explication courte

Format: {{"score": ..., "confidence": ..., ...}}
"""
            )
            
            self.chain = LLMChain(llm=self.llm, prompt=self.analysis_template)
            
            print(f"✅ Langchain initialisé avec {config.OPENAI_MODEL}")
            
        except ImportError:
            print(f"⚠️  Langchain non installé")
            self.available = False
        except Exception as e:
            print(f"⚠️  Erreur Langchain: {e}")
            self.available = False
    
    async def analyze_opportunity(
        self,
        opportunity: Dict,
        context: Dict
    ) -> Dict:
        """
        Analyse une opportunité avec l'IA
        
        Returns:
            {
                'score': 85,
                'confidence': 0.92,
                'recommended_amount': 10000,
                'recommended_slippage': 0.01,
                'risk_level': 'medium',
                'reason': 'Spread élevé avec liquidité suffisante'
            }
        """
        if not self.available:
            # Fallback vers heuristique simple
            return self._heuristic_analysis(opportunity, context)
        
        try:
            # Formater les données
            opp_str = json.dumps(opportunity, indent=2)
            ctx_str = json.dumps(context, indent=2)
            
            # Appeler l'IA
            result = await asyncio.to_thread(
                self.chain.run,
                opportunity=opp_str,
                context=ctx_str
            )
            
            # Parser la réponse JSON
            analysis = json.loads(result)
            
            return analysis
            
        except Exception as e:
            print(f"⚠️  Erreur analyse IA: {e}")
            return self._heuristic_analysis(opportunity, context)
    
    def _heuristic_analysis(self, opportunity: Dict, context: Dict) -> Dict:
        """Analyse heuristique si l'IA n'est pas disponible"""
        
        spread = opportunity.get('spread', 0)
        profit = opportunity.get('estimated_profit', 0)
        
        # Score simple basé sur spread et profit
        score = min(100, int((spread * 1000) + (profit / 10)))
        confidence = min(1.0, spread / 0.02)  # Max confidence à 2%
        
        # Montant recommandé basé sur le profit
        if profit > 500:
            amount = 100_000
        elif profit > 200:
            amount = 50_000
        else:
            amount = 10_000
        
        # Slippage basé sur la liquidité
        liquidity = context.get('liquidity', 0)
        if liquidity > 5_000_000:
            slippage = 0.005  # 0.5%
        elif liquidity > 1_000_000:
            slippage = 0.01   # 1%
        else:
            slippage = 0.02   # 2%
        
        # Risque
        if confidence > 0.8:
            risk = 'low'
        elif confidence > 0.5:
            risk = 'medium'
        else:
            risk = 'high'
        
        return {
            'score': score,
            'confidence': confidence,
            'recommended_amount': amount,
            'recommended_slippage': slippage,
            'risk_level': risk,
            'reason': f"Heuristic: spread {spread*100:.2f}%, profit ${profit:.2f}"
        }


# =============================================
# 6. REDIS CACHE - ULTRA-RAPIDE
# =============================================

class RedisCache:
    """Cache Redis pour mémoriser les opportunités et prix"""
    
    def __init__(self):
        self.redis = None
    
    async def connect(self):
        """Connexion au Redis"""
        try:
            self.redis = await aioredis.from_url(
                f"redis://{config.REDIS_HOST}:{config.REDIS_PORT}/{config.REDIS_DB}",
                encoding="utf-8",
                decode_responses=True
            )
            
            await self.redis.ping()
            print(f"✅ Redis connecté: {config.REDIS_HOST}:{config.REDIS_PORT}")
            
        except Exception as e:
            print(f"⚠️  Redis non disponible: {e}")
            self.redis = None
    
    async def cache_price(self, pair: str, price: float, ttl: int = None):
        """Cache un prix"""
        if not self.redis:
            return
        
        ttl = ttl or config.CACHE_TTL_SECONDS
        await self.redis.setex(f"price:{pair}", ttl, str(price))
    
    async def get_cached_price(self, pair: str) -> Optional[float]:
        """Récupère un prix du cache"""
        if not self.redis:
            return None
        
        cached = await self.redis.get(f"price:{pair}")
        return float(cached) if cached else None


# =============================================
# TESTING
# =============================================

async def test_integrations():
    """Test de toutes les intégrations"""
    
    print("\n" + "="*80)
    print("🧪 TEST DES INTÉGRATIONS SDKs")
    print("="*80 + "\n")
    
    # Setup Web3
    rpc = get_fastest_rpc('polygon')
    w3 = Web3(Web3.HTTPProvider(rpc.url))
    account = Account.from_key(os.getenv('PRIVATE_KEY', '0x' + '1'*64))
    
    # Test Aave V3
    print("1️⃣  Test Aave V3...")
    try:
        aave = AaveV3FlashLoan(w3, 'polygon')
        print(f"   ✅ Aave V3 OK\n")
    except Exception as e:
        print(f"   ❌ Aave V3 Error: {e}\n")
    
    # Test Uniswap V3
    print("2️⃣  Test Uniswap V3...")
    try:
        uniswap = UniswapV3Router(w3, 'polygon')
        print(f"   ✅ Uniswap V3 OK\n")
    except Exception as e:
        print(f"   ❌ Uniswap V3 Error: {e}\n")
    
    # Test Flashbots
    print("3️⃣  Test Flashbots...")
    try:
        flashbots = FlashbotsMEVBoost(w3, account)
        print(f"   ✅ Flashbots OK\n")
    except Exception as e:
        print(f"   ❌ Flashbots Error: {e}\n")
    
    # Test Artemis
    print("4️⃣  Test Artemis...")
    artemis = ArtemisScanner()
    print(f"   {'✅' if artemis.available else '⚠️ '} Artemis {'OK' if artemis.available else 'Non disponible'}\n")
    
    # Test Langchain
    print("5️⃣  Test Langchain...")
    langchain = LangchainOrchestrator()
    print(f"   {'✅' if langchain.available else '⚠️ '} Langchain {'OK' if langchain.available else 'Non disponible'}\n")
    
    # Test Redis
    print("6️⃣  Test Redis...")
    redis_cache = RedisCache()
    await redis_cache.connect()
    print(f"   {'✅' if redis_cache.redis else '⚠️ '} Redis {'OK' if redis_cache.redis else 'Non disponible'}\n")
    
    print("="*80 + "\n")


if __name__ == "__main__":
    asyncio.run(test_integrations())