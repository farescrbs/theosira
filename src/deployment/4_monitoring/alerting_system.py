"""
🚨 THESORIA - Système d'Alertes
================================

Envoie des alertes en temps réel vers:
- Discord (webhooks)
- Telegram (bot)

Alertes pour:
- Trades exécutés (profit > seuil)
- Erreurs critiques
- Balance faible
- Gas price élevé
- Taux de succès faible
"""

import asyncio
import aiohttp
import os
from typing import Dict, Optional, List
from datetime import datetime
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class AlertLevel(Enum):
    """Niveaux d'alerte"""
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"
    SUCCESS = "success"


class AlertingSystem:
    """
    Système d'alertes multi-canal
    
    Supporte:
    - Discord webhooks
    - Telegram bot
    """
    
    def __init__(
        self,
        discord_webhook_url: Optional[str] = None,
        telegram_bot_token: Optional[str] = None,
        telegram_chat_id: Optional[str] = None
    ):
        """
        Initialise le système d'alertes
        
        Args:
            discord_webhook_url: URL du webhook Discord
            telegram_bot_token: Token du bot Telegram
            telegram_chat_id: ID du chat Telegram
        """
        self.discord_webhook_url = discord_webhook_url or os.getenv('DISCORD_WEBHOOK_URL')
        self.telegram_bot_token = telegram_bot_token or os.getenv('TELEGRAM_BOT_TOKEN')
        self.telegram_chat_id = telegram_chat_id or os.getenv('TELEGRAM_CHAT_ID')
        
        self.discord_enabled = bool(self.discord_webhook_url)
        self.telegram_enabled = bool(self.telegram_bot_token and self.telegram_chat_id)
        
        # Statistiques
        self.alerts_sent = 0
        self.alerts_failed = 0
        
        logger.info(f"🚨 Système d'alertes initialisé")
        logger.info(f"   Discord: {'✅' if self.discord_enabled else '❌'}")
        logger.info(f"   Telegram: {'✅' if self.telegram_enabled else '❌'}")
    
    async def send_alert(
        self,
        title: str,
        message: str,
        level: AlertLevel = AlertLevel.INFO,
        fields: Optional[Dict[str, str]] = None
    ):
        """
        Envoie une alerte sur tous les canaux activés
        
        Args:
            title: Titre de l'alerte
            message: Message principal
            level: Niveau d'alerte
            fields: Champs additionnels (dict)
        """
        tasks = []
        
        if self.discord_enabled:
            tasks.append(self._send_discord(title, message, level, fields))
        
        if self.telegram_enabled:
            tasks.append(self._send_telegram(title, message, level, fields))
        
        if tasks:
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            success_count = sum(1 for r in results if not isinstance(r, Exception))
            self.alerts_sent += success_count
            self.alerts_failed += len(results) - success_count
    
    async def _send_discord(
        self,
        title: str,
        message: str,
        level: AlertLevel,
        fields: Optional[Dict[str, str]] = None
    ):
        """Envoie alerte Discord via webhook"""
        
        # Couleurs selon niveau
        colors = {
            AlertLevel.INFO: 0x3498db,      # Bleu
            AlertLevel.WARNING: 0xf39c12,   # Orange
            AlertLevel.CRITICAL: 0xe74c3c,  # Rouge
            AlertLevel.SUCCESS: 0x2ecc71,   # Vert
        }
        
        # Emojis
        emojis = {
            AlertLevel.INFO: "ℹ️",
            AlertLevel.WARNING: "⚠️",
            AlertLevel.CRITICAL: "🚨",
            AlertLevel.SUCCESS: "✅",
        }
        
        # Construire embed
        embed = {
            "title": f"{emojis[level]} {title}",
            "description": message,
            "color": colors[level],
            "timestamp": datetime.utcnow().isoformat(),
            "footer": {
                "text": "THESORIA MEV Agent"
            }
        }
        
        # Ajouter champs
        if fields:
            embed["fields"] = [
                {"name": k, "value": str(v), "inline": True}
                for k, v in fields.items()
            ]
        
        payload = {
            "embeds": [embed],
            "username": "THESORIA MEV",
            "avatar_url": "https://i.imgur.com/your-logo.png"  # TODO: Logo URL
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    self.discord_webhook_url,
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as resp:
                    if resp.status == 204:
                        logger.debug(f"✅ Alerte Discord envoyée: {title}")
                    else:
                        logger.warning(f"⚠️ Discord erreur {resp.status}: {await resp.text()}")
                        raise Exception(f"Discord error {resp.status}")
        
        except Exception as e:
            logger.error(f"❌ Erreur envoi Discord: {e}")
            raise
    
    async def _send_telegram(
        self,
        title: str,
        message: str,
        level: AlertLevel,
        fields: Optional[Dict[str, str]] = None
    ):
        """Envoie alerte Telegram via bot"""
        
        # Emojis
        emojis = {
            AlertLevel.INFO: "ℹ️",
            AlertLevel.WARNING: "⚠️",
            AlertLevel.CRITICAL: "🚨",
            AlertLevel.SUCCESS: "✅",
        }
        
        # Construire message Markdown
        text = f"{emojis[level]} *{title}*\n\n{message}"
        
        if fields:
            text += "\n\n"
            for k, v in fields.items():
                text += f"• *{k}*: `{v}`\n"
        
        text += f"\n_THESORIA MEV Agent - {datetime.now().strftime('%H:%M:%S')}_"
        
        url = f"https://api.telegram.org/bot{self.telegram_bot_token}/sendMessage"
        
        payload = {
            "chat_id": self.telegram_chat_id,
            "text": text,
            "parse_mode": "Markdown"
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    url,
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as resp:
                    if resp.status == 200:
                        logger.debug(f"✅ Alerte Telegram envoyée: {title}")
                    else:
                        logger.warning(f"⚠️ Telegram erreur {resp.status}: {await resp.text()}")
                        raise Exception(f"Telegram error {resp.status}")
        
        except Exception as e:
            logger.error(f"❌ Erreur envoi Telegram: {e}")
            raise
    
    # ============================================
    # ALERTES PRÉ-DÉFINIES
    # ============================================
    
    async def alert_trade_success(
        self,
        chain: str,
        profit_usd: float,
        gas_cost_usd: float,
        tx_hash: str
    ):
        """Alerte pour un trade réussi"""
        net_profit = profit_usd - gas_cost_usd
        
        await self.send_alert(
            title=f"Trade Réussi sur {chain.upper()}",
            message=f"Un trade profitable a été exécuté avec succès!",
            level=AlertLevel.SUCCESS,
            fields={
                "Chain": chain,
                "Profit Brut": f"${profit_usd:.2f}",
                "Coût Gas": f"${gas_cost_usd:.2f}",
                "Profit Net": f"${net_profit:.2f}",
                "TX Hash": f"{tx_hash[:10]}...{tx_hash[-8:]}",
            }
        )
    
    async def alert_high_profit(
        self,
        chain: str,
        profit_usd: float,
        tx_hash: str
    ):
        """Alerte pour un profit élevé (> $1000)"""
        await self.send_alert(
            title=f"🎉 GROS PROFIT sur {chain.upper()}!",
            message=f"Un trade exceptionnellement profitable a été exécuté!",
            level=AlertLevel.SUCCESS,
            fields={
                "Chain": chain,
                "Profit": f"${profit_usd:.2f}",
                "TX Hash": f"{tx_hash[:10]}...{tx_hash[-8:]}",
            }
        )
    
    async def alert_balance_low(
        self,
        chain: str,
        address: str,
        balance_eth: float
    ):
        """Alerte balance faible"""
        await self.send_alert(
            title=f"Balance Faible sur {chain.upper()}",
            message=f"La balance du wallet est en dessous du seuil de sécurité.",
            level=AlertLevel.WARNING,
            fields={
                "Chain": chain,
                "Adresse": f"{address[:10]}...{address[-8:]}",
                "Balance": f"{balance_eth:.4f} ETH",
                "Seuil": "0.5 ETH",
            }
        )
    
    async def alert_balance_critical(
        self,
        chain: str,
        address: str,
        balance_eth: float
    ):
        """Alerte balance critique"""
        await self.send_alert(
            title=f"⚠️ BALANCE CRITIQUE sur {chain.upper()}",
            message=f"La balance du wallet est dangereusement basse! Rechargez immédiatement.",
            level=AlertLevel.CRITICAL,
            fields={
                "Chain": chain,
                "Adresse": f"{address[:10]}...{address[-8:]}",
                "Balance": f"{balance_eth:.4f} ETH",
                "Seuil critique": "0.1 ETH",
            }
        )
    
    async def alert_high_gas_price(
        self,
        chain: str,
        gas_price_gwei: float
    ):
        """Alerte gas price élevé"""
        await self.send_alert(
            title=f"Gas Price Élevé sur {chain.upper()}",
            message=f"Le gas price est anormalement élevé. Rentabilité réduite.",
            level=AlertLevel.WARNING,
            fields={
                "Chain": chain,
                "Gas Price": f"{gas_price_gwei:.2f} Gwei",
                "Seuil normal": "< 100 Gwei",
            }
        )
    
    async def alert_low_success_rate(
        self,
        chain: str,
        success_rate: float,
        bundles_sent: int,
        bundles_success: int
    ):
        """Alerte taux de succès faible"""
        await self.send_alert(
            title=f"Taux de Succès Faible sur {chain.upper()}",
            message=f"Le taux de succès des bundles Flashbots est en dessous du seuil.",
            level=AlertLevel.WARNING,
            fields={
                "Chain": chain,
                "Taux de succès": f"{success_rate:.1f}%",
                "Bundles envoyés": str(bundles_sent),
                "Bundles réussis": str(bundles_success),
                "Seuil normal": "> 70%",
            }
        )
    
    async def alert_critical_error(
        self,
        chain: str,
        error_type: str,
        error_message: str
    ):
        """Alerte erreur critique"""
        await self.send_alert(
            title=f"🚨 ERREUR CRITIQUE sur {chain.upper()}",
            message=f"Une erreur critique s'est produite. Vérifiez immédiatement!",
            level=AlertLevel.CRITICAL,
            fields={
                "Chain": chain,
                "Type": error_type,
                "Message": error_message[:100],
            }
        )
    
    async def alert_agent_started(
        self,
        chains: List[str],
        version: str
    ):
        """Alerte démarrage agent"""
        await self.send_alert(
            title="Agent MEV Démarré",
            message=f"L'agent MEV a démarré avec succès en mode production.",
            level=AlertLevel.INFO,
            fields={
                "Version": version,
                "Chains": ", ".join(chains),
                "Timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            }
        )
    
    async def alert_agent_stopped(
        self,
        uptime_seconds: int,
        total_profit: float
    ):
        """Alerte arrêt agent"""
        uptime_hours = uptime_seconds / 3600
        
        await self.send_alert(
            title="Agent MEV Arrêté",
            message=f"L'agent MEV s'est arrêté.",
            level=AlertLevel.INFO,
            fields={
                "Uptime": f"{uptime_hours:.1f} heures",
                "Profit Total": f"${total_profit:.2f}",
                "Timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            }
        )
    
    async def alert_daily_summary(
        self,
        profit_total: float,
        gas_paid: float,
        trades_executed: int,
        trades_success: int
    ):
        """Alerte résumé journalier"""
        net_profit = profit_total - gas_paid
        success_rate = (trades_success / trades_executed * 100) if trades_executed > 0 else 0
        
        await self.send_alert(
            title="📊 Résumé Journalier",
            message=f"Voici les performances des dernières 24 heures.",
            level=AlertLevel.INFO,
            fields={
                "Trades exécutés": str(trades_executed),
                "Trades réussis": f"{trades_success} ({success_rate:.1f}%)",
                "Profit brut": f"${profit_total:.2f}",
                "Gas payé": f"${gas_paid:.2f}",
                "Profit net": f"${net_profit:.2f}",
            }
        )
    
    def get_statistics(self) -> Dict:
        """Retourne les statistiques"""
        return {
            'alerts_sent': self.alerts_sent,
            'alerts_failed': self.alerts_failed,
            'discord_enabled': self.discord_enabled,
            'telegram_enabled': self.telegram_enabled,
        }


# ============================================
# EXEMPLE D'UTILISATION
# ============================================

async def example_usage():
    """Exemple d'utilisation du système d'alertes"""
    
    # Initialiser (utilise variables d'environnement)
    alerting = AlertingSystem()
    
    if not (alerting.discord_enabled or alerting.telegram_enabled):
        print("⚠️  Aucun canal d'alerte configuré!")
        print("   Configurez DISCORD_WEBHOOK_URL ou TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID")
        return
    
    print("\n🚨 Test du système d'alertes...\n")
    
    # Test 1: Trade success
    print("1️⃣  Envoi alerte trade success...")
    await alerting.alert_trade_success(
        chain='polygon',
        profit_usd=247.50,
        gas_cost_usd=62.30,
        tx_hash='0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    )
    await asyncio.sleep(2)
    
    # Test 2: High profit
    print("2️⃣  Envoi alerte high profit...")
    await alerting.alert_high_profit(
        chain='ethereum',
        profit_usd=1523.75,
        tx_hash='0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    )
    await asyncio.sleep(2)
    
    # Test 3: Balance low
    print("3️⃣  Envoi alerte balance low...")
    await alerting.alert_balance_low(
        chain='polygon',
        address='0x1234567890abcdef1234567890abcdef12345678',
        balance_eth=0.45
    )
    await asyncio.sleep(2)
    
    # Test 4: Critical error
    print("4️⃣  Envoi alerte critical error...")
    await alerting.alert_critical_error(
        chain='arbitrum',
        error_type='RPC_CONNECTION_LOST',
        error_message='Connection to RPC failed after 3 retries'
    )
    
    print("\n✅ Tests terminés!")
    print(f"   Alertes envoyées: {alerting.alerts_sent}")
    print(f"   Alertes échouées: {alerting.alerts_failed}")


if __name__ == "__main__":
    import logging
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(message)s'
    )
    
    asyncio.run(example_usage())
