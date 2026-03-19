#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
🌌 THESORIA - WEBSOCKET SERVER - STREAMING TEMPS RÉEL
═══════════════════════════════════════════════════════════════════════════════

Serveur WebSocket pour communication temps réel entre :
• Backend (bot Python)
• Frontend (React)

DONNÉES STREAMÉES :
• Opportunités détectées (live)
• Trades exécutés (instant)
• Balances mises à jour (temps réel)
• Stats globales (5 secondes)
• Alertes & notifications (instant)

INNOVATION : Communication bidirectionnelle
• Frontend → Backend : Commandes (pause, resume, config)
• Backend → Frontend : Données temps réel
═══════════════════════════════════════════════════════════════════════════════
"""

import asyncio
import json
import websockets
from datetime import datetime
from typing import Set, Dict
import os
from dotenv import load_dotenv

load_dotenv()

class WebSocketServer:
    """Serveur WebSocket pour streaming temps réel"""
    
    def __init__(self):
        self.clients: Set[websockets.WebSocketServerProtocol] = set()
        self.bot_status = {
            "running": False,
            "mode": "simulation",
            "strategies_active": 10,
            "total_profit": 0.0,
            "total_trades": 0,
            "opportunities_found": 0
        }
        
    async def register(self, websocket):
        """Enregistrer nouveau client"""
        self.clients.add(websocket)
        print(f"✅ Client connecté. Total: {len(self.clients)}")
        
        # Envoyer état initial
        await self.send_to_client(websocket, {
            "type": "initial_state",
            "data": self.bot_status
        })
    
    async def unregister(self, websocket):
        """Désenregistrer client"""
        self.clients.remove(websocket)
        print(f"❌ Client déconnecté. Total: {len(self.clients)}")
    
    async def send_to_client(self, websocket, message: Dict):
        """Envoyer message à un client"""
        try:
            await websocket.send(json.dumps(message))
        except Exception as e:
            print(f"Erreur envoi: {e}")
    
    async def broadcast(self, message: Dict):
        """Broadcaster à tous les clients"""
        if self.clients:
            await asyncio.gather(
                *[self.send_to_client(client, message) for client in self.clients],
                return_exceptions=True
            )
    
    async def handle_client(self, websocket, path):
        """Gérer connexion client"""
        await self.register(websocket)
        
        try:
            async for message in websocket:
                # Recevoir commandes du frontend
                data = json.loads(message)
                await self.handle_command(data)
                
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            await self.unregister(websocket)
    
    async def handle_command(self, data: Dict):
        """Gérer commandes du frontend"""
        command = data.get("command")
        
        if command == "pause_bot":
            self.bot_status["running"] = False
            await self.broadcast({
                "type": "bot_status",
                "data": {"running": False, "message": "Bot mis en pause"}
            })
            
        elif command == "resume_bot":
            self.bot_status["running"] = True
            await self.broadcast({
                "type": "bot_status",
                "data": {"running": True, "message": "Bot repris"}
            })
            
        elif command == "switch_mode":
            mode = data.get("mode", "simulation")
            self.bot_status["mode"] = mode
            await self.broadcast({
                "type": "mode_changed",
                "data": {"mode": mode}
            })
            
        elif command == "get_stats":
            await self.broadcast({
                "type": "stats_update",
                "data": self.bot_status
            })
    
    async def stream_opportunity(self, opportunity: Dict):
        """Streamer nouvelle opportunité détectée"""
        await self.broadcast({
            "type": "opportunity_detected",
            "data": opportunity,
            "timestamp": datetime.now().isoformat()
        })
    
    async def stream_trade(self, trade: Dict):
        """Streamer trade exécuté"""
        self.bot_status["total_trades"] += 1
        self.bot_status["total_profit"] += trade.get("profit", 0)
        
        await self.broadcast({
            "type": "trade_executed",
            "data": trade,
            "timestamp": datetime.now().isoformat()
        })
    
    async def stream_balance(self, balances: Dict):
        """Streamer balances mises à jour"""
        await self.broadcast({
            "type": "balance_update",
            "data": balances,
            "timestamp": datetime.now().isoformat()
        })
    
    async def stream_alert(self, alert: Dict):
        """Streamer alerte"""
        await self.broadcast({
            "type": "alert",
            "data": alert,
            "timestamp": datetime.now().isoformat()
        })
    
    async def simulate_activity(self):
        """Simuler activité pour démo"""
        import random
        
        while True:
            await asyncio.sleep(10)
            
            # Simuler opportunité
            if random.random() < 0.3:
                await self.stream_opportunity({
                    "strategy": random.choice(["Flash Loan", "MEV", "Arbitrage"]),
                    "profit_estimate": random.uniform(100, 800),
                    "chain": random.choice(["ethereum", "polygon", "arbitrum"])
                })
            
            # Simuler trade
            if random.random() < 0.2:
                profit = random.uniform(100, 600)
                await self.stream_trade({
                    "strategy": random.choice(["Flash Loan", "MEV", "Arbitrage"]),
                    "profit": profit,
                    "chain": random.choice(["ethereum", "polygon", "arbitrum"]),
                    "status": "success"
                })
    
    async def run(self):
        """Démarrer serveur WebSocket"""
        
        # Démarrer simulation activité
        asyncio.create_task(self.simulate_activity())
        
        # Démarrer serveur
        async with websockets.serve(self.handle_client, "localhost", 8765):
            print("\n" + "═" * 80)
            print("🌌 WebSocket Server - Démarré")
            print("═" * 80)
            print(f"URL: ws://localhost:8765")
            print(f"Clients: 0")
            print("Status: 🟢 En attente de connexions...")
            print("═" * 80 + "\n")
            
            await asyncio.Future()  # Run forever


async def main():
    """Point d'entrée"""
    print("\n")
    print("╔" + "═" * 78 + "╗")
    print("║" + " " * 20 + "🌌 WEBSOCKET SERVER - NIVEAU INFINI" + " " * 23 + "║")
    print("║" + " " * 18 + "Communication Temps Réel Bot ↔ Frontend" + " " * 21 + "║")
    print("╚" + "═" * 78 + "╝")
    print("\n")
    
    server = WebSocketServer()
    await server.run()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n✅ WebSocket Server arrêté proprement.\n")
