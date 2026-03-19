import { useState } from "react";
import { Cpu, Zap, TrendingUp, Activity, Server, DollarSign, Thermometer, Gauge, Shield, CheckCircle2, Clock, Star, Crown, Sparkles, ChevronRight, Play, Pause, Settings, Trash2, Plus, Search, Download, Hash, Bitcoin, Coins, Award, Flame, Wind, BarChart3, ArrowUpRight } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface MiningRig {
  id: string;
  name: string;
  algorithm: string;
  hashrate: number;
  hashUnit: string;
  power: number;
  temperature: number;
  efficiency: number;
  status: 'active' | 'paused' | 'maintenance';
  coin: string;
  dailyRevenue: number;
  monthlyCost: number;
  roi: number;
  uptime: number;
}

interface MiningContract {
  id: string;
  name: string;
  provider: string;
  algorithm: string;
  hashrate: number;
  hashUnit: string;
  coin: string;
  duration: number;
  price: number;
  dailyReturn: number;
  roi: number;
  tier: 'starter' | 'pro' | 'enterprise';
  rating: number;
  miners: number;
  features: string[];
}

export function MiningSection() {
  const [activeTab, setActiveTab] = useState("my-rigs");
  const [searchQuery, setSearchQuery] = useState("");

  const [myRigs] = useState<MiningRig[]>([
    {
      id: '1',
      name: 'Bitcoin Mining Pro',
      algorithm: 'SHA-256',
      hashrate: 110,
      hashUnit: 'TH/s',
      power: 3250,
      temperature: 68,
      efficiency: 95.8,
      status: 'active',
      coin: 'BTC',
      dailyRevenue: 42.50,
      monthlyCost: 780,
      roi: 8.2,
      uptime: 99.7
    },
    {
      id: '2',
      name: 'Ethereum Rig Elite',
      algorithm: 'Ethash',
      hashrate: 2400,
      hashUnit: 'MH/s',
      power: 1850,
      temperature: 62,
      efficiency: 92.4,
      status: 'active',
      coin: 'ETH',
      dailyRevenue: 38.20,
      monthlyCost: 550,
      roi: 9.5,
      uptime: 98.9
    },
    {
      id: '3',
      name: 'Multi-Algo Miner',
      algorithm: 'Scrypt',
      hashrate: 9500,
      hashUnit: 'MH/s',
      power: 2100,
      temperature: 71,
      efficiency: 88.6,
      status: 'paused',
      coin: 'LTC',
      dailyRevenue: 28.40,
      monthlyCost: 630,
      roi: 7.8,
      uptime: 97.2
    }
  ]);

  const [marketplaceContracts] = useState<MiningContract[]>([
    {
      id: 'c1',
      name: 'Bitcoin Cloud Mining Premium',
      provider: 'THESORIA Mining',
      algorithm: 'SHA-256',
      hashrate: 100,
      hashUnit: 'TH/s',
      coin: 'BTC',
      duration: 12,
      price: 8500,
      dailyReturn: 38.50,
      roi: 6.2,
      tier: 'enterprise',
      rating: 4.9,
      miners: 1847,
      features: ['Maintenance incluse', 'Électricité gratuite', 'ROI garanti', 'Support 24/7', 'Dashboard temps réel', 'Paiements quotidiens']
    },
    {
      id: 'c2',
      name: 'Ethereum Mining Contract',
      provider: 'CloudHash Pro',
      algorithm: 'Ethash',
      hashrate: 2000,
      hashUnit: 'MH/s',
      coin: 'ETH',
      duration: 12,
      price: 6200,
      dailyReturn: 32.80,
      roi: 7.1,
      tier: 'pro',
      rating: 4.8,
      miners: 2491,
      features: ['Auto-switching pools', 'Overclocking inclus', 'Paiements flexibles', 'Analytics avancés', 'API REST complète']
    },
    {
      id: 'c3',
      name: 'Multi-Currency Mining',
      provider: 'CryptoMine Elite',
      algorithm: 'Multi-Algo',
      hashrate: 5000,
      hashUnit: 'MH/s',
      coin: 'Multi',
      duration: 24,
      price: 9800,
      dailyReturn: 45.20,
      roi: 5.8,
      tier: 'enterprise',
      rating: 4.9,
      miners: 1256,
      features: ['10 cryptos supportées', 'Auto profit-switching', 'Double hashrate boost', 'Assurance pertes', 'Consultant dédié']
    },
    {
      id: 'c4',
      name: 'Litecoin Cloud Miner',
      provider: 'ScryptHash',
      algorithm: 'Scrypt',
      hashrate: 8000,
      hashUnit: 'MH/s',
      coin: 'LTC',
      duration: 12,
      price: 4800,
      dailyReturn: 26.50,
      roi: 7.8,
      tier: 'pro',
      rating: 4.7,
      miners: 3120,
      features: ['Pool personnel', 'Statistiques live', 'Withdrawals rapides', 'Support technique']
    },
    {
      id: 'c5',
      name: 'Kaspa Mining Elite',
      provider: 'THESORIA Mining',
      algorithm: 'kHeavyHash',
      hashrate: 15000,
      hashUnit: 'GH/s',
      coin: 'KAS',
      duration: 6,
      price: 3200,
      dailyReturn: 28.90,
      roi: 9.2,
      tier: 'pro',
      rating: 4.8,
      miners: 1680,
      features: ['Dernière génération', 'Efficacité maximale', 'Low fees', 'Démarrage rapide']
    },
    {
      id: 'c6',
      name: 'Bitcoin Starter Pack',
      provider: 'HashPower Now',
      algorithm: 'SHA-256',
      hashrate: 10,
      hashUnit: 'TH/s',
      coin: 'BTC',
      duration: 6,
      price: 850,
      dailyReturn: 4.20,
      roi: 6.8,
      tier: 'starter',
      rating: 4.5,
      miners: 5240,
      features: ['Entrée de gamme', 'Sans engagement', 'Idéal débutants', 'Formation incluse']
    }
  ]);

  const algorithms = [
    { name: 'SHA-256', coins: ['BTC', 'BCH'], color: 'text-[#d4af37]' },
    { name: 'Ethash', coins: ['ETH', 'ETC'], color: 'text-purple-400' },
    { name: 'Scrypt', coins: ['LTC', 'DOGE'], color: 'text-blue-400' },
    { name: 'kHeavyHash', coins: ['KAS'], color: 'text-green-400' },
    { name: 'Equihash', coins: ['ZEC', 'BTG'], color: 'text-yellow-400' },
    { name: 'X11', coins: ['DASH'], color: 'text-cyan-400' },
    { name: 'RandomX', coins: ['XMR'], color: 'text-orange-400' },
    { name: 'Multi-Algo', coins: ['Multiple'], color: 'text-pink-400' }
  ];

  const totalHashrate = myRigs.reduce((sum, rig) => sum + rig.hashrate, 0);
  const totalRevenue = myRigs.reduce((sum, rig) => sum + rig.dailyRevenue, 0);
  const totalCost = myRigs.reduce((sum, rig) => sum + rig.monthlyCost, 0);
  const avgEfficiency = myRigs.reduce((sum, rig) => sum + rig.efficiency, 0) / myRigs.length;

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Minimal Background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
      }} />
      
      <div className="container mx-auto px-8 relative z-10 max-w-[1600px]">
        {/* Premium Header */}
        <div className="mb-24">
          {/* Reference Number */}
          <div className="flex items-center justify-between mb-12 pb-6 border-b border-white/[0.03]">
            <div className="flex items-center gap-6">
              <div className="w-1 h-12 bg-[#d4af37]" />
              <div>
                <p className="text-[10px] text-gray-700 uppercase tracking-[0.3em] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Infrastructure de Minage
                </p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Courier New, monospace' }}>
                  THESORIA-MINE-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 9999)).padStart(4, '0')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-[#d4af37]" />
              <p className="text-[10px] text-gray-700 uppercase tracking-[0.3em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Cloud Mining Premium
              </p>
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[0.5px] w-16 bg-gradient-to-r from-transparent to-[#d4af37]" />
              <p className="text-[#d4af37] text-[10px] tracking-[0.4em] uppercase" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
                Mining as a Service
              </p>
              <div className="h-[0.5px] w-16 bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h2 className="text-5xl mb-8 text-white tracking-tight leading-tight" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 300 }}>
              Plateforme de Minage
            </h2>
            
            <p className="text-[13px] text-gray-600 leading-relaxed tracking-wide max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
              Infrastructure de minage professionnelle avec contrats cloud mining premium.<br/>
              Bitcoin · Ethereum · Multi-algorithmes · ROI optimisé · Support 24/7
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-24 grid grid-cols-4 gap-[1px] bg-white/[0.05]">
          {[
            { label: 'Puissance Totale', value: `${totalHashrate.toFixed(0)}`, sublabel: 'TH/s Combinés', icon: Zap },
            { label: 'Revenus Quotidiens', value: `${totalRevenue.toFixed(2)}`, sublabel: 'EUR/jour', icon: DollarSign },
            { label: 'Efficacité Moyenne', value: `${avgEfficiency.toFixed(1)}%`, sublabel: 'Performance', icon: Gauge },
            { label: 'Coûts Mensuels', value: `${totalCost.toLocaleString()}`, sublabel: 'EUR/mois', icon: Activity }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-black p-10 text-center hover:bg-white/[0.01] transition-all duration-500">
                <Icon className="w-5 h-5 text-[#d4af37] mx-auto mb-4" />
                <p className="text-[9px] text-gray-700 uppercase tracking-[0.3em] mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {stat.label}
                </p>
                <p className="text-3xl text-white mb-2 tabular-nums" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 300 }}>
                  {stat.value}
                </p>
                <p className="text-[9px] text-gray-600 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                  {stat.sublabel}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-16">
          <div className="flex justify-center gap-16">
            {['my-rigs', 'marketplace', 'algorithms'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`group pb-3 text-[11px] tracking-[0.25em] uppercase transition-all duration-300 relative ${
                  activeTab === tab ? 'text-white' : 'text-gray-700 hover:text-gray-500'
                }`}
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}
              >
                {tab === 'my-rigs' && 'Mes Installations'}
                {tab === 'marketplace' && 'Marketplace'}
                {tab === 'algorithms' && 'Algorithmes'}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#d4af37]" />
                )}
              </button>
            ))}
          </div>

          {/* My Rigs Tab */}
          <TabsContent value="my-rigs" className="space-y-12">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl text-white tracking-tight mb-2" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 300 }}>
                  Mes Installations
                </h3>
                <p className="text-[10px] text-gray-700 uppercase tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {myRigs.length} Rigs Actifs
                </p>
              </div>
              <button className="h-12 px-8 bg-[#d4af37] hover:bg-[#d4af37]/90 transition-all flex items-center gap-3">
                <Plus className="w-4 h-4 text-black" />
                <span className="text-[10px] text-black uppercase tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
                  Nouveau Contrat
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-[1px] bg-white/[0.05] border border-white/[0.05]">
              {myRigs.map((rig) => (
                <div key={rig.id} className="bg-black p-8 hover:bg-white/[0.01] transition-all">
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div className="w-16 h-16 border border-white/[0.08] flex items-center justify-center flex-shrink-0 bg-black/50">
                      <Server className="w-7 h-7 text-[#d4af37]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-[15px] text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                              {rig.name}
                            </h4>
                            <div className={`w-2 h-2 ${rig.status === 'active' ? 'bg-[#d4af37]' : rig.status === 'paused' ? 'bg-gray-600' : 'bg-blue-400'}`} />
                          </div>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <Hash className="w-3.5 h-3.5 text-gray-700" />
                              <span className="text-[10px] text-gray-700 tracking-wide" style={{ fontFamily: 'Courier New, monospace' }}>
                                {rig.algorithm}
                              </span>
                            </div>
                            <div className="w-1 h-1 bg-gray-800" />
                            <div className="flex items-center gap-2">
                              <Bitcoin className="w-3.5 h-3.5 text-gray-700" />
                              <span className="text-[10px] text-gray-700 tracking-wide" style={{ fontFamily: 'Courier New, monospace' }}>
                                {rig.coin}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button className="w-9 h-9 border border-white/[0.08] flex items-center justify-center hover:border-[#d4af37]/30 transition-all">
                            {rig.status === 'active' ? (
                              <Pause className="w-4 h-4 text-gray-600" />
                            ) : (
                              <Play className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                          <button className="w-9 h-9 border border-white/[0.08] flex items-center justify-center hover:border-[#d4af37]/30 transition-all">
                            <Settings className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="w-9 h-9 border border-white/[0.08] flex items-center justify-center hover:border-red-500/30 transition-all">
                            <Trash2 className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-5 gap-6 mb-6 p-5 border border-white/[0.05] bg-black/50">
                        <div>
                          <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Hashrate
                          </p>
                          <p className="text-[13px] text-[#d4af37] tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                            {rig.hashrate} {rig.hashUnit}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Température
                          </p>
                          <div className="flex items-center gap-2">
                            <Thermometer className="w-3 h-3 text-gray-600" />
                            <p className="text-[13px] text-white tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                              {rig.temperature}°C
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Puissance
                          </p>
                          <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-gray-600" />
                            <p className="text-[13px] text-white tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                              {rig.power}W
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Efficacité
                          </p>
                          <p className="text-[13px] text-white tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                            {rig.efficiency}%
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Uptime
                          </p>
                          <p className="text-[13px] text-[#d4af37] tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                            {rig.uptime}%
                          </p>
                        </div>
                      </div>

                      {/* Revenue Stats */}
                      <div className="grid grid-cols-4 gap-8 pt-6 border-t border-white/[0.05]">
                        <div>
                          <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Revenus/jour
                          </p>
                          <p className="text-lg text-white tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                            {rig.dailyRevenue.toFixed(2)} EUR
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Coûts/mois
                          </p>
                          <p className="text-lg text-gray-600 tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                            {rig.monthlyCost} EUR
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            ROI Estimé
                          </p>
                          <p className="text-lg text-[#d4af37] tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                            {rig.roi} mois
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Statut
                          </p>
                          <p className="text-[11px] text-white uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                            {rig.status === 'active' ? 'Actif' : rig.status === 'paused' ? 'En pause' : 'Maintenance'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-12">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl text-white tracking-tight mb-2" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 300 }}>
                  Marketplace Cloud Mining
                </h3>
                <p className="text-[10px] text-gray-700 uppercase tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {marketplaceContracts.length} Contrats Disponibles
                </p>
              </div>
              <div className="relative w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un contrat..."
                  className="pl-12 bg-black/50 border-white/[0.08] text-white placeholder:text-gray-800 focus:border-[#d4af37] h-12 text-[12px]"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-[1px] bg-white/[0.05] border border-white/[0.05]">
              {marketplaceContracts.map((contract) => (
                <div key={contract.id} className="bg-black p-8 hover:bg-white/[0.01] transition-all group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-[15px] text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                          {contract.name}
                        </h4>
                        {contract.tier === 'enterprise' && <Crown className="w-4 h-4 text-[#d4af37]" />}
                        {contract.tier === 'pro' && <Star className="w-4 h-4 text-purple-400" />}
                      </div>
                      <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Par {contract.provider}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
                        <span className="text-[11px] text-white tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                          {contract.rating}
                        </span>
                      </div>
                      <p className="text-[9px] text-gray-700 tracking-wide" style={{ fontFamily: 'Courier New, monospace' }}>
                        {contract.miners.toLocaleString()} mineurs
                      </p>
                    </div>
                  </div>

                  {/* Contract Details */}
                  <div className="mb-6 p-5 border border-white/[0.05] bg-black/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hash className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span className="text-[10px] text-gray-700 uppercase tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {contract.algorithm}
                        </span>
                      </div>
                      <span className="text-[12px] text-white tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                        {contract.hashrate} {contract.hashUnit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bitcoin className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span className="text-[10px] text-gray-700 uppercase tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Crypto
                        </span>
                      </div>
                      <span className="text-[12px] text-white" style={{ fontFamily: 'Courier New, monospace' }}>
                        {contract.coin}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span className="text-[10px] text-gray-700 uppercase tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Durée
                        </span>
                      </div>
                      <span className="text-[12px] text-white tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                        {contract.duration} mois
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6 space-y-2">
                    {contract.features.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-[#d4af37] flex-shrink-0" />
                        <span className="text-[10px] text-gray-600 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* ROI Info */}
                  <div className="mb-6 p-4 border border-[#d4af37]/20 bg-[#d4af37]/5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Retour quotidien
                      </p>
                      <p className="text-[13px] text-[#d4af37] tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                        {contract.dailyReturn} EUR/jour
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        ROI Estimé
                      </p>
                      <p className="text-[13px] text-white tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                        {contract.roi} mois
                      </p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/[0.05]">
                    <div>
                      <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Prix du Contrat
                      </p>
                      <p className="text-xl text-white tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                        {contract.price.toLocaleString()} EUR
                      </p>
                    </div>
                    <button className="h-11 px-6 bg-[#d4af37] hover:bg-[#d4af37]/90 transition-all flex items-center gap-2">
                      <span className="text-[10px] text-black uppercase tracking-[0.2em]" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
                        Acheter
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-black" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Algorithms Tab */}
          <TabsContent value="algorithms" className="space-y-12">
            <div>
              <h3 className="text-2xl text-white tracking-tight mb-2" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 300 }}>
                Algorithmes de Minage
              </h3>
              <p className="text-[10px] text-gray-700 uppercase tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {algorithms.length} Algorithmes Supportés
              </p>
            </div>

            <div className="grid grid-cols-2 gap-[1px] bg-white/[0.05] border border-white/[0.05]">
              {algorithms.map((algo, index) => (
                <div key={index} className="bg-black p-10 hover:bg-white/[0.01] transition-all group">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-14 h-14 border border-white/[0.08] flex items-center justify-center bg-black/50">
                      <Hash className="w-6 h-6 text-[#d4af37]" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-[17px] mb-2 ${algo.color}`} style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                        {algo.name}
                      </h4>
                      <p className="text-[10px] text-gray-700 uppercase tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Algorithme de Consensus
                      </p>
                    </div>
                  </div>

                  <div className="p-5 border border-white/[0.05] bg-black/50">
                    <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Cryptomonnaies Supportées
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {algo.coins.map((coin, idx) => (
                        <div key={idx} className="px-3 py-1.5 border border-white/[0.08] bg-black">
                          <span className="text-[10px] text-white tracking-wide" style={{ fontFamily: 'Courier New, monospace' }}>
                            {coin}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-gray-700" />
                      <span className="text-[10px] text-gray-700 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                        {Math.floor(Math.random() * 1000) + 500} mineurs actifs
                      </span>
                    </div>
                    <button className="text-[10px] text-[#d4af37] uppercase tracking-[0.2em] hover:text-[#d4af37]/80 transition-colors flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Détails
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mining Info */}
            <div className="mt-16 p-10 border border-[#d4af37]/20 bg-[#d4af37]/5">
              <div className="flex items-start gap-5">
                <Server className="w-7 h-7 text-[#d4af37] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-[12px] text-white uppercase tracking-[0.25em] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Infrastructure de Minage Professionnelle
                  </p>
                  <p className="text-[13px] text-gray-600 leading-relaxed mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                    Nos installations de minage utilisent les derniers ASIC et GPU pour une efficacité maximale. 
                    Hébergement dans des datacenters certifiés ISO avec énergie renouvelable à 100%. 
                    Surveillance 24/7, refroidissement optimal et maintenance préventive assurée.
                  </p>
                  <div className="grid grid-cols-3 gap-8">
                    <div className="flex items-center gap-3">
                      <Wind className="w-5 h-5 text-[#d4af37]" />
                      <div>
                        <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Refroidissement
                        </p>
                        <p className="text-[11px] text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                          Immersion cooling
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-[#d4af37]" />
                      <div>
                        <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Énergie
                        </p>
                        <p className="text-[11px] text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                          100% Renouvelable
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-[#d4af37]" />
                      <div>
                        <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Sécurité
                        </p>
                        <p className="text-[11px] text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                          Certifié ISO 27001
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default MiningSection;