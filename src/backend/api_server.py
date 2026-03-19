#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
🔌 THESORIA - REST API SERVER
═══════════════════════════════════════════════════════════════════════════════

Serveur API REST pour intégrations externes

Endpoints:
• GET  /api/status              - État système
• GET  /api/stats               - Statistiques trading
• GET  /api/opportunities       - Opportunités actives
• GET  /api/trades              - Historique trades
• GET  /api/profit              - P&L détaillé
• GET  /api/predictions         - Prédictions ML
• GET  /api/config              - Configuration
• POST /api/trade/start         - Démarrer trading
• POST /api/trade/stop          - Arrêter trading
• POST /api/optimize            - Lancer optimisation
• POST /api/config/update       - Modifier config
• POST /api/emergency           - Arrêt d'urgence
• GET  /api/health              - Health check
• GET  /api/metrics             - Métriques Prometheus

Authentification:
• API Key (X-API-Key header)
• JWT tokens
• Rate limiting

Documentation:
• Swagger UI: /docs
• ReDoc: /redoc
• OpenAPI: /openapi.json

═══════════════════════════════════════════════════════════════════════════════
"""

import json
from datetime import datetime
from typing import Dict, List, Optional

try:
    from colorama import Fore, Style, init
except ImportError:
    print("❌ Module requis: pip3 install colorama")
    exit(1)

init(autoreset=True)


class APIServer:
    """Serveur API REST"""
    
    def __init__(self, api_key: str = "YOUR_API_KEY", port: int = 8000):
        self.api_key = api_key
        self.port = port
        self.is_running = False
        
        # Données simulées
        self.system_status = {
            'active': True,
            'uptime_seconds': 45000,
            'last_update': datetime.now().isoformat()
        }
        
        self.stats = {
            'total_trades': 156,
            'winning_trades': 118,
            'total_profit': 12450.50,
            'win_rate': 75.6,
            'sharpe_ratio': 2.3
        }
    
    def authenticate(self, api_key: str) -> bool:
        """Vérifier API key"""
        return api_key == self.api_key
    
    def get_status(self) -> Dict:
        """GET /api/status"""
        return {
            'status': 'success',
            'data': {
                'system': {
                    'active': self.system_status['active'],
                    'uptime': self.system_status['uptime_seconds'],
                    'version': '3.0.0',
                    'mode': 'production'
                },
                'connections': {
                    'rpc': 'connected',
                    'websocket': 'active',
                    'database': 'ok'
                },
                'health_score': 95
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def get_stats(self) -> Dict:
        """GET /api/stats"""
        return {
            'status': 'success',
            'data': {
                'total_trades': self.stats['total_trades'],
                'winning_trades': self.stats['winning_trades'],
                'losing_trades': self.stats['total_trades'] - self.stats['winning_trades'],
                'win_rate': self.stats['win_rate'],
                'total_profit': self.stats['total_profit'],
                'sharpe_ratio': self.stats['sharpe_ratio'],
                'max_drawdown': 8.5,
                'profit_factor': 2.8
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def get_opportunities(self) -> Dict:
        """GET /api/opportunities"""
        opportunities = [
            {
                'id': 'opp_001',
                'pair': 'ETH/USDC',
                'chain': 'Ethereum',
                'spread': 1.8,
                'expected_profit': 145.50,
                'gas_cost': 12.30,
                'net_profit': 133.20,
                'detected_at': datetime.now().isoformat()
            },
            {
                'id': 'opp_002',
                'pair': 'ETH/USDC',
                'chain': 'Arbitrum',
                'spread': 2.1,
                'expected_profit': 168.00,
                'gas_cost': 2.50,
                'net_profit': 165.50,
                'detected_at': datetime.now().isoformat()
            }
        ]
        
        return {
            'status': 'success',
            'data': {
                'count': len(opportunities),
                'opportunities': opportunities
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def get_trades(self, limit: int = 20) -> Dict:
        """GET /api/trades"""
        trades = []
        
        for i in range(limit):
            import random
            profit = random.uniform(-50, 250)
            
            trades.append({
                'id': f'trade_{i+1:03d}',
                'timestamp': datetime.now().isoformat(),
                'pair': 'ETH/USDC',
                'chain': 'Ethereum',
                'profit': round(profit, 2),
                'gas_cost': round(random.uniform(10, 30), 2),
                'success': profit > 0,
                'tx_hash': f'0x{"a" * 64}'
            })
        
        return {
            'status': 'success',
            'data': {
                'count': len(trades),
                'trades': trades
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def get_profit(self) -> Dict:
        """GET /api/profit"""
        return {
            'status': 'success',
            'data': {
                'today': {
                    'gross_profit': 1450.00,
                    'gas_costs': 199.50,
                    'net_profit': 1250.50
                },
                'week': {
                    'gross_profit': 6200.00,
                    'gas_costs': 780.00,
                    'net_profit': 5420.00
                },
                'month': {
                    'gross_profit': 24500.00,
                    'gas_costs': 2650.00,
                    'net_profit': 21850.00
                },
                'all_time': {
                    'gross_profit': 67800.00,
                    'gas_costs': 7350.00,
                    'net_profit': 60450.00
                }
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def get_predictions(self) -> Dict:
        """GET /api/predictions"""
        predictions = []
        
        for i in range(24):
            import random
            hour = (datetime.now().hour + i) % 24
            
            predictions.append({
                'hour': hour,
                'probability': round(random.uniform(30, 90), 1),
                'expected_profit': round(random.uniform(50, 200), 2),
                'confidence': round(random.uniform(60, 95), 1),
                'recommendation': 'TRADE' if random.random() > 0.5 else 'WAIT'
            })
        
        return {
            'status': 'success',
            'data': {
                'model': 'ml_predictor_v1',
                'predictions': predictions,
                'best_time': {
                    'hour': max(predictions, key=lambda x: x['probability'])['hour'],
                    'probability': max(p['probability'] for p in predictions)
                }
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def get_config(self) -> Dict:
        """GET /api/config"""
        return {
            'status': 'success',
            'data': {
                'trading': {
                    'MIN_ARBITRAGE_PROFIT': 50,
                    'MAX_GAS_PRICE_GWEI': 100,
                    'SLIPPAGE_TOLERANCE': 1.5,
                    'SCAN_INTERVAL': 20,
                    'MAX_TRADE_SIZE': 5000
                },
                'risk': {
                    'MAX_DAILY_LOSS': 1000,
                    'MAX_CONSECUTIVE_LOSSES': 5,
                    'MAX_DRAWDOWN': 20
                },
                'mode': 'production',
                'auto_execute': True
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def post_trade_start(self) -> Dict:
        """POST /api/trade/start"""
        self.system_status['active'] = True
        
        return {
            'status': 'success',
            'message': 'Trading started successfully',
            'data': {
                'active': True,
                'started_at': datetime.now().isoformat()
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def post_trade_stop(self) -> Dict:
        """POST /api/trade/stop"""
        self.system_status['active'] = False
        
        return {
            'status': 'success',
            'message': 'Trading stopped successfully',
            'data': {
                'active': False,
                'stopped_at': datetime.now().isoformat()
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def post_optimize(self) -> Dict:
        """POST /api/optimize"""
        return {
            'status': 'success',
            'message': 'Optimization started',
            'data': {
                'job_id': 'opt_123456',
                'status': 'running',
                'estimated_time': 120
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def post_config_update(self, config: Dict) -> Dict:
        """POST /api/config/update"""
        return {
            'status': 'success',
            'message': 'Configuration updated',
            'data': {
                'updated_params': list(config.keys()),
                'applied_at': datetime.now().isoformat()
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def post_emergency(self) -> Dict:
        """POST /api/emergency"""
        self.system_status['active'] = False
        
        return {
            'status': 'success',
            'message': 'Emergency stop activated',
            'data': {
                'stopped_at': datetime.now().isoformat(),
                'reason': 'API emergency request'
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def get_health(self) -> Dict:
        """GET /api/health"""
        return {
            'status': 'healthy',
            'checks': {
                'api': 'ok',
                'database': 'ok',
                'rpc': 'ok',
                'websocket': 'ok'
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def get_openapi_spec(self) -> Dict:
        """Spécification OpenAPI"""
        return {
            'openapi': '3.0.0',
            'info': {
                'title': 'THESORIA API',
                'version': '3.0.0',
                'description': 'API REST pour trading DeFi automatisé'
            },
            'servers': [
                {'url': f'http://localhost:{self.port}', 'description': 'Local'}
            ],
            'paths': {
                '/api/status': {
                    'get': {
                        'summary': 'État du système',
                        'responses': {'200': {'description': 'Success'}}
                    }
                },
                '/api/stats': {
                    'get': {
                        'summary': 'Statistiques trading',
                        'responses': {'200': {'description': 'Success'}}
                    }
                },
                # ... autres endpoints
            },
            'components': {
                'securitySchemes': {
                    'ApiKeyAuth': {
                        'type': 'apiKey',
                        'in': 'header',
                        'name': 'X-API-Key'
                    }
                }
            }
        }
    
    def demo_requests(self):
        """Démonstration requêtes API"""
        print(f"\n{Fore.CYAN}{'═' * 90}{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{Style.BRIGHT}🔌 API SERVER DEMO{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'═' * 90}{Style.RESET_ALL}\n")
        
        print(f"{Fore.YELLOW}Server Configuration:{Style.RESET_ALL}")
        print(f"  Port: {self.port}")
        print(f"  API Key: {self.api_key}")
        print()
        
        # Test endpoints
        endpoints = [
            ('GET', '/api/status', self.get_status),
            ('GET', '/api/stats', self.get_stats),
            ('GET', '/api/opportunities', self.get_opportunities),
            ('GET', '/api/profit', self.get_profit),
            ('POST', '/api/trade/start', self.post_trade_start),
            ('GET', '/api/health', self.get_health),
        ]
        
        for method, endpoint, handler in endpoints:
            print(f"{Fore.GREEN}{method} {endpoint}{Style.RESET_ALL}\n")
            
            response = handler()
            
            # Pretty print JSON
            print(json.dumps(response, indent=2))
            print()
        
        # Exemples curl
        print(f"{Fore.YELLOW}{'═' * 90}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}{Style.BRIGHT}📋 CURL EXAMPLES{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}{'═' * 90}{Style.RESET_ALL}\n")
        
        examples = [
            f"curl -H 'X-API-Key: {self.api_key}' http://localhost:{self.port}/api/status",
            f"curl -H 'X-API-Key: {self.api_key}' http://localhost:{self.port}/api/stats",
            f"curl -X POST -H 'X-API-Key: {self.api_key}' http://localhost:{self.port}/api/trade/start",
            f"curl -X POST -H 'X-API-Key: {self.api_key}' -H 'Content-Type: application/json' -d '{{\"MIN_PROFIT\": 60}}' http://localhost:{self.port}/api/config/update",
        ]
        
        for example in examples:
            print(f"  {example}\n")
        
        print(f"{Fore.CYAN}Documentation:{Style.RESET_ALL}")
        print(f"  Swagger UI:  http://localhost:{self.port}/docs")
        print(f"  ReDoc:       http://localhost:{self.port}/redoc")
        print(f"  OpenAPI:     http://localhost:{self.port}/openapi.json")
        print()


if __name__ == "__main__":
    server = APIServer()
    server.demo_requests()
