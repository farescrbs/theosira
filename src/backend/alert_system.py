#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
🔔 THESORIA - ALERT SYSTEM
═══════════════════════════════════════════════════════════════════════════════

Système d'alertes multi-canal:
• Discord Webhooks
• Telegram Bot
• Email SMTP
• Logs fichiers
• Alertes critiques

Types d'alertes:
• Opportunité détectée
• Trade exécuté
• Profit réalisé
• Erreur critique
• Gas trop élevé
• Balance faible

═══════════════════════════════════════════════════════════════════════════════
"""

import asyncio
import os
from datetime import datetime
from enum import Enum
from dotenv import load_dotenv

try:
    import aiohttp
    from colorama import Fore, Style, init
except ImportError:
    print("❌ Modules requis: pip3 install aiohttp colorama")
    exit(1)

init(autoreset=True)
load_dotenv()


class AlertLevel(Enum):
    """Niveaux d'alerte"""
    INFO = "ℹ️"
    SUCCESS = "✅"
    WARNING = "⚠️"
    ERROR = "❌"
    CRITICAL = "🔥"
    PROFIT = "💰"


class AlertSystem:
    """Système d'alertes multi-canal"""
    
    def __init__(self):
        # Configuration Discord
        self.discord_webhook = os.getenv("DISCORD_WEBHOOK_URL")
        
        # Configuration Telegram
        self.telegram_token = os.getenv("TELEGRAM_BOT_TOKEN")
        self.telegram_chat_id = os.getenv("TELEGRAM_CHAT_ID")
        
        # Configuration Email (optionnel)
        self.smtp_host = os.getenv("SMTP_HOST")
        self.smtp_port = os.getenv("SMTP_PORT")
        self.smtp_user = os.getenv("SMTP_USER")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.alert_email = os.getenv("ALERT_EMAIL")
        
        # Logs
        self.log_enabled = os.getenv("SAVE_LOGS", "true").lower() == "true"
        self.log_dir = os.getenv("LOG_DIRECTORY", "../logs")
        
        # Rate limiting (éviter spam)
        self.last_alert_time = {}
        self.min_interval_seconds = 60  # 1 minute entre alertes similaires
    
    def should_send_alert(self, alert_key):
        """Vérifier si on peut envoyer l'alerte (rate limiting)"""
        now = datetime.now()
        
        if alert_key in self.last_alert_time:
            time_since_last = (now - self.last_alert_time[alert_key]).total_seconds()
            if time_since_last < self.min_interval_seconds:
                return False
        
        self.last_alert_time[alert_key] = now
        return True
    
    async def send_discord(self, message, level=AlertLevel.INFO, title=None):
        """Envoyer alerte Discord"""
        if not self.discord_webhook:
            return False
        
        try:
            # Couleurs Discord
            colors = {
                AlertLevel.INFO: 3447003,      # Bleu
                AlertLevel.SUCCESS: 5763719,   # Vert
                AlertLevel.WARNING: 16776960,  # Jaune
                AlertLevel.ERROR: 15548997,    # Rouge
                AlertLevel.CRITICAL: 10038562, # Rouge foncé
                AlertLevel.PROFIT: 3066993,    # Vert foncé
            }
            
            embed = {
                "title": f"{level.value} {title or 'THESORIA Alert'}",
                "description": message,
                "color": colors.get(level, 3447003),
                "timestamp": datetime.utcnow().isoformat(),
                "footer": {
                    "text": "THESORIA Trading Bot"
                }
            }
            
            payload = {
                "embeds": [embed]
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(self.discord_webhook, json=payload) as resp:
                    if resp.status == 204:
                        return True
                    else:
                        print(f"Discord error: {resp.status}")
                        return False
                        
        except Exception as e:
            print(f"Discord alert failed: {e}")
            return False
    
    async def send_telegram(self, message, level=AlertLevel.INFO):
        """Envoyer alerte Telegram"""
        if not self.telegram_token or not self.telegram_chat_id:
            return False
        
        try:
            url = f"https://api.telegram.org/bot{self.telegram_token}/sendMessage"
            
            # Formater message avec emoji
            formatted_message = f"{level.value} *THESORIA*\n\n{message}"
            
            payload = {
                "chat_id": self.telegram_chat_id,
                "text": formatted_message,
                "parse_mode": "Markdown"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload) as resp:
                    if resp.status == 200:
                        return True
                    else:
                        print(f"Telegram error: {resp.status}")
                        return False
                        
        except Exception as e:
            print(f"Telegram alert failed: {e}")
            return False
    
    def send_log(self, message, level=AlertLevel.INFO):
        """Écrire dans fichier log"""
        if not self.log_enabled:
            return
        
        try:
            log_file = os.path.join(self.log_dir, "alerts.log")
            os.makedirs(self.log_dir, exist_ok=True)
            
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            log_line = f"[{timestamp}] {level.name} - {message}\n"
            
            with open(log_file, "a", encoding="utf-8") as f:
                f.write(log_line)
                
        except Exception as e:
            print(f"Log write failed: {e}")
    
    def print_console(self, message, level=AlertLevel.INFO):
        """Afficher dans console avec couleurs"""
        colors = {
            AlertLevel.INFO: Fore.BLUE,
            AlertLevel.SUCCESS: Fore.GREEN,
            AlertLevel.WARNING: Fore.YELLOW,
            AlertLevel.ERROR: Fore.RED,
            AlertLevel.CRITICAL: Fore.RED + Style.BRIGHT,
            AlertLevel.PROFIT: Fore.GREEN + Style.BRIGHT,
        }
        
        color = colors.get(level, Fore.WHITE)
        timestamp = datetime.now().strftime("%H:%M:%S")
        
        print(f"{color}[{timestamp}] {level.value} {message}{Style.RESET_ALL}")
    
    async def alert(self, message, level=AlertLevel.INFO, title=None, 
                   channels=["console", "log", "discord", "telegram"]):
        """
        Envoyer alerte sur tous les canaux configurés
        
        Args:
            message: Message d'alerte
            level: Niveau d'alerte (AlertLevel)
            title: Titre pour Discord
            channels: Liste des canaux à utiliser
        """
        # Rate limiting
        alert_key = f"{level.name}_{message[:50]}"
        if not self.should_send_alert(alert_key) and level not in [AlertLevel.CRITICAL, AlertLevel.PROFIT]:
            return
        
        # Console
        if "console" in channels:
            self.print_console(message, level)
        
        # Log fichier
        if "log" in channels:
            self.send_log(message, level)
        
        # Discord (async)
        if "discord" in channels:
            await self.send_discord(message, level, title)
        
        # Telegram (async)
        if "telegram" in channels:
            await self.send_telegram(message, level)
    
    # =========================================================================
    # ALERTES PRÉDÉFINIES
    # =========================================================================
    
    async def alert_opportunity_found(self, pair, profit_usd, spread_pct):
        """Alerte opportunité détectée"""
        message = f"💡 Opportunité détectée!\n\n"
        message += f"Paire: {pair}\n"
        message += f"Spread: {spread_pct:.2f}%\n"
        message += f"Profit estimé: ${profit_usd:.2f}"
        
        await self.alert(
            message,
            level=AlertLevel.INFO,
            title="Opportunité Détectée",
            channels=["console", "log"]
        )
    
    async def alert_trade_executed(self, pair, profit_usd, gas_cost_usd, tx_hash):
        """Alerte trade exécuté"""
        net_profit = profit_usd - gas_cost_usd
        
        message = f"🚀 Trade exécuté!\n\n"
        message += f"Paire: {pair}\n"
        message += f"Profit brut: ${profit_usd:.2f}\n"
        message += f"Gas cost: ${gas_cost_usd:.2f}\n"
        message += f"Profit net: ${net_profit:.2f}\n"
        message += f"TX: {tx_hash[:10]}...{tx_hash[-8:]}"
        
        await self.alert(
            message,
            level=AlertLevel.SUCCESS,
            title="Trade Exécuté",
            channels=["console", "log", "discord", "telegram"]
        )
    
    async def alert_profit_milestone(self, total_profit_usd):
        """Alerte milestone de profit atteint"""
        message = f"🎯 Milestone atteint!\n\n"
        message += f"Profit total: ${total_profit_usd:,.2f}\n"
        message += f"Félicitations! 🎉"
        
        await self.alert(
            message,
            level=AlertLevel.PROFIT,
            title="Profit Milestone",
            channels=["console", "log", "discord", "telegram"]
        )
    
    async def alert_high_gas(self, gas_gwei, threshold_gwei):
        """Alerte gas trop élevé"""
        message = f"⛽ Gas élevé!\n\n"
        message += f"Gas actuel: {gas_gwei:.1f} gwei\n"
        message += f"Seuil: {threshold_gwei:.1f} gwei\n"
        message += f"Trading suspendu temporairement"
        
        await self.alert(
            message,
            level=AlertLevel.WARNING,
            title="Gas Élevé",
            channels=["console", "log"]
        )
    
    async def alert_low_balance(self, balance_eth, min_balance_eth):
        """Alerte balance faible"""
        message = f"💸 Balance faible!\n\n"
        message += f"Balance: {balance_eth:.4f} ETH\n"
        message += f"Minimum: {min_balance_eth:.4f} ETH\n"
        message += f"⚠️  Recharger le wallet!"
        
        await self.alert(
            message,
            level=AlertLevel.WARNING,
            title="Balance Faible",
            channels=["console", "log", "discord", "telegram"]
        )
    
    async def alert_error(self, error_message, context=""):
        """Alerte erreur"""
        message = f"❌ Erreur détectée!\n\n"
        if context:
            message += f"Contexte: {context}\n"
        message += f"Erreur: {error_message}"
        
        await self.alert(
            message,
            level=AlertLevel.ERROR,
            title="Erreur",
            channels=["console", "log"]
        )
    
    async def alert_critical(self, message, context=""):
        """Alerte critique"""
        full_message = f"🔥 ALERTE CRITIQUE!\n\n"
        if context:
            full_message += f"Contexte: {context}\n"
        full_message += message
        
        await self.alert(
            full_message,
            level=AlertLevel.CRITICAL,
            title="⚠️ CRITIQUE",
            channels=["console", "log", "discord", "telegram"]
        )
    
    async def alert_system_start(self):
        """Alerte démarrage système"""
        message = f"🚀 Système démarré!\n\n"
        message += f"Mode: {os.getenv('DEMO_MODE', 'false') == 'true' and 'DÉMO' or 'PRODUCTION'}\n"
        message += f"Testnet: {os.getenv('TESTNET_MODE', 'false')}\n"
        message += f"Auto-execute: {os.getenv('AUTO_EXECUTE', 'false')}\n"
        message += f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        await self.alert(
            message,
            level=AlertLevel.INFO,
            title="Système Démarré",
            channels=["console", "log", "discord"]
        )
    
    async def alert_system_stop(self, reason=""):
        """Alerte arrêt système"""
        message = f"🛑 Système arrêté\n\n"
        if reason:
            message += f"Raison: {reason}\n"
        message += f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        await self.alert(
            message,
            level=AlertLevel.WARNING,
            title="Système Arrêté",
            channels=["console", "log", "discord"]
        )


# ═════════════════════════════════════════════════════════════════════════════
# TESTS
# ═════════════════════════════════════════════════════════════════════════════

async def test_alerts():
    """Tester système d'alertes"""
    print(f"\n{Fore.CYAN}Test Système d'Alertes{Style.RESET_ALL}\n")
    
    alerter = AlertSystem()
    
    # Test démarrage
    await alerter.alert_system_start()
    await asyncio.sleep(1)
    
    # Test opportunité
    await alerter.alert_opportunity_found("ETH/USDC", 125.50, 1.5)
    await asyncio.sleep(1)
    
    # Test trade exécuté
    await alerter.alert_trade_executed(
        "ETH/USDC",
        150.00,
        35.50,
        "0x1234567890abcdef1234567890abcdef12345678"
    )
    await asyncio.sleep(1)
    
    # Test profit milestone
    await alerter.alert_profit_milestone(1000.00)
    await asyncio.sleep(1)
    
    # Test warning gas
    await alerter.alert_high_gas(150.5, 100.0)
    await asyncio.sleep(1)
    
    # Test balance faible
    await alerter.alert_low_balance(0.05, 0.1)
    await asyncio.sleep(1)
    
    # Test erreur
    await alerter.alert_error("Connection timeout", "RPC call")
    await asyncio.sleep(1)
    
    # Test critique
    await alerter.alert_critical("Smart contract exploit detected!", "Security scan")
    await asyncio.sleep(1)
    
    # Test arrêt
    await alerter.alert_system_stop("Manual shutdown")
    
    print(f"\n{Fore.GREEN}✓ Tests terminés!{Style.RESET_ALL}\n")


if __name__ == "__main__":
    asyncio.run(test_alerts())
