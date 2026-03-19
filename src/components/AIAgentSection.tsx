import { useState } from "react";
import { Brain, Cpu, Zap, TrendingUp, Shield, MessageSquare, BarChart3, Briefcase, Code, Search, Plus, Settings, Play, Pause, Trash2, Eye, Download, Upload, ChevronRight, Check, Star, Crown, Sparkles, BotMessageSquare, LineChart, FileSearch, Headphones, Lock, Globe, DollarSign, Users, Activity, ArrowUpRight, Copy, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface AIAgent {
  id: string;
  name: string;
  category: 'finance' | 'trading' | 'analysis' | 'support' | 'research' | 'security';
  description: string;
  model: string;
  status: 'active' | 'paused' | 'training';
  requests: number;
  accuracy: number;
  created: string;
  pricing: 'free' | 'pro' | 'enterprise';
  features: string[];
}

interface MarketplaceAgent {
  id: string;
  name: string;
  category: string;
  description: string;
  model: string;
  rating: number;
  downloads: number;
  price: number;
  tier: 'free' | 'pro' | 'enterprise';
  features: string[];
  creator: string;
}

export function AIAgentSection() {
  const [activeTab, setActiveTab] = useState("my-agents");
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [myAgents] = useState<AIAgent[]>([
    {
      id: '1',
      name: 'Portfolio Analyzer Pro',
      category: 'finance',
      description: "Analyse approfondie de portefeuilles crypto et prédictions basées sur l'IA",
      model: 'LLaMA 3.1 70B',
      status: 'active',
      requests: 15420,
      accuracy: 94.5,
      created: '2025-01-15',
      pricing: 'enterprise',
      features: ['Analyse temps réel', 'Prédictions ML', 'Alertes personnalisées', 'API REST']
    },
    {
      id: '2',
      name: 'Smart Trading Assistant',
      category: 'trading',
      description: 'Assistant de trading automatisé avec stratégies d\'IA avancées',
      model: 'Mistral Large',
      status: 'active',
      requests: 28910,
      accuracy: 91.2,
      created: '2024-12-01',
      pricing: 'pro',
      features: ['Trading automatique', 'Stop-loss intelligent', 'Backtesting', 'Multi-exchange']
    },
    {
      id: '3',
      name: 'Sentiment Analyzer',
      category: 'analysis',
      description: 'Analyse de sentiment des marchés crypto via NLP avancé',
      model: 'GPT-J 6B',
      status: 'paused',
      requests: 8340,
      accuracy: 88.7,
      created: '2024-11-10',
      pricing: 'pro',
      features: ['NLP avancé', 'Social media tracking', 'Rapports quotidiens']
    }
  ]);

  const [marketplaceAgents] = useState<MarketplaceAgent[]>([
    {
      id: 'm1',
      name: 'DeFi Yield Optimizer',
      category: 'Finance DeFi',
      description: 'Optimisation automatique des rendements DeFi sur 50+ protocoles',
      model: 'LLaMA 3.1 70B',
      rating: 4.9,
      downloads: 1247,
      price: 299,
      tier: 'enterprise',
      features: ['Auto-compounding', 'Gas optimization', 'Risk assessment', 'Multi-chain'],
      creator: 'THESORIA Labs'
    },
    {
      id: 'm2',
      name: 'Market Predictor AI',
      category: 'Trading',
      description: 'Prédictions de marché basées sur analyse technique et fondamentale IA',
      model: 'Mixtral 8x7B',
      rating: 4.8,
      downloads: 2891,
      price: 199,
      tier: 'pro',
      features: ['Technical analysis', 'Pattern recognition', 'Price targets', 'Confidence scores'],
      creator: 'CryptoAI Inc'
    },
    {
      id: 'm3',
      name: 'Risk Management Bot',
      category: 'Sécurité',
      description: 'Gestion des risques et protection du portefeuille en temps réel',
      model: 'Falcon 40B',
      rating: 4.7,
      downloads: 1650,
      price: 149,
      tier: 'pro',
      features: ['Risk scoring', 'Portfolio rebalancing', 'Loss prevention', 'Diversification'],
      creator: 'SecureChain'
    },
    {
      id: 'm4',
      name: 'NFT Trend Analyzer',
      category: 'Analyse NFT',
      description: 'Détection de tendances NFT et évaluation de projets',
      model: 'Vicuna 13B',
      rating: 4.6,
      downloads: 980,
      price: 99,
      tier: 'pro',
      features: ['Trend detection', 'Rarity analysis', 'Floor price prediction', 'Collection scoring'],
      creator: 'NFT Analytics'
    },
    {
      id: 'm5',
      name: 'Blockchain Data Scientist',
      category: 'Recherche',
      description: 'Analyse de données blockchain complexes et génération de rapports',
      model: 'CodeLLaMA 34B',
      rating: 4.8,
      downloads: 745,
      price: 249,
      tier: 'enterprise',
      features: ['On-chain analysis', 'SQL queries', 'Custom reports', 'Data visualization'],
      creator: 'DataChain Labs'
    },
    {
      id: 'm6',
      name: 'Customer Support AI',
      category: 'Support Client',
      description: 'Assistant de support client 24/7 spécialisé crypto',
      model: 'Mistral 7B',
      rating: 4.5,
      downloads: 1530,
      price: 79,
      tier: 'pro',
      features: ['24/7 availability', 'Multi-language', 'Ticket management', 'Knowledge base'],
      creator: 'SupportAI'
    }
  ]);

  const pricingTiers = [
    {
      name: 'Starter',
      price: 0,
      tier: 'free',
      icon: Sparkles,
      features: [
        '1 agent IA actif',
        '1,000 requêtes/mois',
        'Modèles open source basiques',
        'Support communautaire',
        'API limitée',
        'Marketplace accès lecture'
      ],
      limits: {
        agents: 1,
        requests: 1000,
        models: 'Basiques'
      }
    },
    {
      name: 'Professional',
      price: 199,
      tier: 'pro',
      icon: Star,
      popular: true,
      features: [
        '10 agents IA actifs',
        '100,000 requêtes/mois',
        'Tous modèles open source',
        'Support prioritaire 24/7',
        'API complète avec webhooks',
        'Marketplace achats illimités',
        'Fine-tuning personnalisé',
        'Analytics avancés'
      ],
      limits: {
        agents: 10,
        requests: 100000,
        models: 'Tous'
      }
    },
    {
      name: 'Enterprise',
      price: 999,
      tier: 'enterprise',
      icon: Crown,
      features: [
        'Agents IA illimités',
        'Requêtes illimitées',
        'Modèles propriétaires exclusifs',
        'Support dédié & SLA',
        'Infrastructure dédiée',
        'Marketplace vente d\'agents',
        'Formation personnalisée',
        'White-label disponible',
        'Conformité RGPD garantie',
        'Intégration sur mesure'
      ],
      limits: {
        agents: 'Illimité',
        requests: 'Illimité',
        models: 'Tous + Propriétaires'
      }
    }
  ];

  const openSourceModels = [
    { name: 'LLaMA 3.1 70B', provider: 'Meta', params: '70B', description: 'Modèle le plus puissant pour tâches complexes', tier: 'pro' },
    { name: 'Mixtral 8x7B', provider: 'Mistral AI', params: '47B', description: 'Excellent rapport performance/coût', tier: 'pro' },
    { name: 'Mistral Large', provider: 'Mistral AI', params: '123B', description: 'Performance niveau GPT-4', tier: 'enterprise' },
    { name: 'Falcon 40B', provider: 'TII', params: '40B', description: 'Optimisé pour finance et analyse', tier: 'pro' },
    { name: 'CodeLLaMA 34B', provider: 'Meta', params: '34B', description: 'Spécialisé code et data science', tier: 'pro' },
    { name: 'Vicuna 13B', provider: 'LMSYS', params: '13B', description: 'Polyvalent et rapide', tier: 'free' },
    { name: 'GPT-J 6B', provider: 'EleutherAI', params: '6B', description: 'Modèle gratuit performant', tier: 'free' },
    { name: 'Mistral 7B', provider: 'Mistral AI', params: '7B', description: 'Léger et efficace', tier: 'free' }
  ];

  const categoryIcons: Record<string, any> = {
    finance: TrendingUp,
    trading: LineChart,
    analysis: FileSearch,
    support: Headphones,
    research: Search,
    security: Shield
  };

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
                  Intelligence Artificielle
                </p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Courier New, monospace' }}>
                  THESORIA-AI-{new Date().getFullYear()}-PLATFORM
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Brain className="w-4 h-4 text-[#d4af37]" />
              <p className="text-[10px] text-gray-700 uppercase tracking-[0.3em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Open Source Models
              </p>
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[0.5px] w-16 bg-gradient-to-r from-transparent to-[#d4af37]" />
              <p className="text-[#d4af37] text-[10px] tracking-[0.4em] uppercase" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
                Agents IA Personnalisés
              </p>
              <div className="h-[0.5px] w-16 bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h2 className="text-5xl mb-8 text-white tracking-tight leading-tight" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 300 }}>
              Plateforme d'Agents IA
            </h2>
            
            <p className="text-[13px] text-gray-600 leading-relaxed tracking-wide max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
              Créez, déployez et gérez vos agents IA personnalisés avec les meilleurs modèles open source.<br/>
              LLaMA · Mistral · Falcon · Fine-tuning · Marketplace premium
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-24 grid grid-cols-4 gap-[1px] bg-white/[0.05]">
          {[
            { label: 'Agents Déployés', value: myAgents.length.toString(), sublabel: 'Actifs' },
            { label: 'Requêtes Totales', value: myAgents.reduce((sum, a) => sum + a.requests, 0).toLocaleString(), sublabel: 'Ce mois' },
            { label: 'Précision Moyenne', value: `${(myAgents.reduce((sum, a) => sum + a.accuracy, 0) / myAgents.length).toFixed(1)}%`, sublabel: 'Performance' },
            { label: 'Modèles Disponibles', value: openSourceModels.length.toString(), sublabel: 'Open Source' }
          ].map((stat, index) => (
            <div key={index} className="bg-black p-10 text-center hover:bg-white/[0.01] transition-all duration-500">
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
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-16">
          <div className="flex justify-center gap-16">
            {['my-agents', 'marketplace', 'pricing', 'models'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`group pb-3 text-[11px] tracking-[0.25em] uppercase transition-all duration-300 relative ${
                  activeTab === tab ? 'text-white' : 'text-gray-700 hover:text-gray-500'
                }`}
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}
              >
                {tab === 'my-agents' && 'Mes Agents'}
                {tab === 'marketplace' && 'Marketplace'}
                {tab === 'pricing' && 'Tarifs'}
                {tab === 'models' && 'Modèles IA'}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#d4af37]" />
                )}
              </button>
            ))}
          </div>

          {/* My Agents Tab */}
          <TabsContent value="my-agents" className="space-y-12">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl text-white tracking-tight mb-2" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 300 }}>
                  Mes Agents IA
                </h3>
                <p className="text-[10px] text-gray-700 uppercase tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {myAgents.length} Agents Configurés
                </p>
              </div>
              <button className="h-12 px-8 bg-[#d4af37] hover:bg-[#d4af37]/90 transition-all flex items-center gap-3">
                <Plus className="w-4 h-4 text-black" />
                <span className="text-[10px] text-black uppercase tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
                  Créer un Agent
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-[1px] bg-white/[0.05] border border-white/[0.05]">
              {myAgents.map((agent) => {
                const CategoryIcon = categoryIcons[agent.category];
                return (
                  <div key={agent.id} className="bg-black p-8 hover:bg-white/[0.01] transition-all">
                    <div className="flex items-start gap-6">
                      {/* Icon */}
                      <div className="w-16 h-16 border border-white/[0.08] flex items-center justify-center flex-shrink-0 bg-black/50">
                        <CategoryIcon className="w-7 h-7 text-[#d4af37]" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-[15px] text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                                {agent.name}
                              </h4>
                              <div className={`w-2 h-2 ${agent.status === 'active' ? 'bg-[#d4af37]' : agent.status === 'paused' ? 'bg-gray-600' : 'bg-blue-400'}`} />
                            </div>
                            <p className="text-[11px] text-gray-600 mb-3 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                              {agent.description}
                            </p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Brain className="w-3.5 h-3.5 text-gray-700" />
                                <span className="text-[10px] text-gray-700 tracking-wide" style={{ fontFamily: 'Courier New, monospace' }}>
                                  {agent.model}
                                </span>
                              </div>
                              <div className="w-1 h-1 bg-gray-800" />
                              <span className="text-[10px] text-gray-700 tracking-wide" style={{ fontFamily: 'Courier New, monospace' }}>
                                Créé le {new Date(agent.created).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <button className="w-9 h-9 border border-white/[0.08] flex items-center justify-center hover:border-[#d4af37]/30 transition-all">
                              {agent.status === 'active' ? (
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

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 pt-6 border-t border-white/[0.05]">
                          <div>
                            <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              Requêtes
                            </p>
                            <p className="text-lg text-white tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                              {agent.requests.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              Précision
                            </p>
                            <p className="text-lg text-[#d4af37] tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                              {agent.accuracy}%
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              Statut
                            </p>
                            <p className="text-[11px] text-white uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                              {agent.status === 'active' ? 'Actif' : agent.status === 'paused' ? 'En pause' : 'Formation'}
                            </p>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="mt-6 flex flex-wrap gap-2">
                          {agent.features.map((feature, idx) => (
                            <div key={idx} className="px-3 py-1.5 border border-white/[0.08] bg-black/50">
                              <span className="text-[9px] text-gray-600 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-12">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl text-white tracking-tight mb-2" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 300 }}>
                  Marketplace d'Agents IA
                </h3>
                <p className="text-[10px] text-gray-700 uppercase tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {marketplaceAgents.length} Agents Disponibles
                </p>
              </div>
              <div className="relative w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un agent..."
                  className="pl-12 bg-black/50 border-white/[0.08] text-white placeholder:text-gray-800 focus:border-[#d4af37] h-12 text-[12px]"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-[1px] bg-white/[0.05] border border-white/[0.05]">
              {marketplaceAgents.map((agent) => (
                <div key={agent.id} className="bg-black p-8 hover:bg-white/[0.01] transition-all group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-[15px] text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                          {agent.name}
                        </h4>
                        {agent.tier === 'enterprise' && <Crown className="w-4 h-4 text-[#d4af37]" />}
                      </div>
                      <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {agent.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
                        <span className="text-[11px] text-white tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                          {agent.rating}
                        </span>
                      </div>
                      <p className="text-[9px] text-gray-700 tracking-wide" style={{ fontFamily: 'Courier New, monospace' }}>
                        {agent.downloads.toLocaleString()} DL
                      </p>
                    </div>
                  </div>

                  <p className="text-[12px] text-gray-600 mb-6 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                    {agent.description}
                  </p>

                  <div className="mb-6 p-4 border border-white/[0.05] bg-black/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span className="text-[10px] text-white tracking-wide" style={{ fontFamily: 'Courier New, monospace' }}>
                        {agent.model}
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-700 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                      Par {agent.creator}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mb-6 space-y-2">
                    {agent.features.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-[#d4af37] flex-shrink-0" />
                        <span className="text-[10px] text-gray-600 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/[0.05]">
                    <div>
                      <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Prix
                      </p>
                      <p className="text-xl text-white tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                        {agent.price} EUR<span className="text-[11px] text-gray-700">/mois</span>
                      </p>
                    </div>
                    <button className="h-11 px-6 bg-[#d4af37] hover:bg-[#d4af37]/90 transition-all flex items-center gap-2">
                      <span className="text-[10px] text-black uppercase tracking-[0.2em]" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
                        Installer
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-black" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-12">
            <div className="text-center mb-16">
              <h3 className="text-3xl text-white tracking-tight mb-4" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 300 }}>
                Tarifs & Abonnements
              </h3>
              <p className="text-[12px] text-gray-600 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                Choisissez le plan adapté à vos besoins en IA
              </p>
            </div>

            <div className="grid grid-cols-3 gap-[1px] bg-white/[0.05]">
              {pricingTiers.map((tier, index) => {
                const TierIcon = tier.icon;
                return (
                  <div 
                    key={index} 
                    className={`bg-black p-10 relative ${tier.popular ? 'border-2 border-[#d4af37]' : ''}`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#d4af37]">
                        <span className="text-[9px] text-black uppercase tracking-[0.3em]" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
                          Populaire
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-10">
                      <div className="w-14 h-14 border border-white/[0.08] flex items-center justify-center mx-auto mb-6 bg-black/50">
                        <TierIcon className="w-6 h-6 text-[#d4af37]" />
                      </div>
                      <p className="text-[11px] text-gray-700 uppercase tracking-[0.3em] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {tier.name}
                      </p>
                      <div className="mb-6">
                        <span className="text-5xl text-white tabular-nums" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 300 }}>
                          {tier.price === 0 ? 'Gratuit' : `${tier.price}`}
                        </span>
                        {tier.price > 0 && (
                          <span className="text-[13px] text-gray-700 ml-2" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                            EUR/mois
                          </span>
                        )}
                      </div>
                      <div className="h-[1px] w-12 bg-[#d4af37] mx-auto" />
                    </div>

                    {/* Limits */}
                    <div className="mb-8 p-5 border border-white/[0.05] bg-black/50">
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>Agents</span>
                          <span className="text-white tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>{tier.limits.agents}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>Requêtes</span>
                          <span className="text-white tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>{tier.limits.requests}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>Modèles</span>
                          <span className="text-white" style={{ fontFamily: 'Courier New, monospace' }}>{tier.limits.models}</span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-10 space-y-3">
                      {tier.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                          <span className="text-[11px] text-gray-600 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <button className={`w-full h-12 transition-all ${
                      tier.popular 
                        ? 'bg-[#d4af37] hover:bg-[#d4af37]/90 text-black' 
                        : 'border border-white/[0.08] hover:border-[#d4af37]/30 text-white'
                    }`}>
                      <span className="text-[10px] uppercase tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
                        {tier.price === 0 ? 'Commencer' : 'S\'abonner'}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Additional Info */}
            <div className="mt-16 p-8 border border-white/[0.05] bg-black/30">
              <div className="text-center">
                <p className="text-[11px] text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                  Tous les plans incluent : Cryptage E2E · Conformité RGPD · Support multi-langues · Documentation complète · Mises à jour gratuites
                </p>
                <p className="text-[9px] text-gray-700 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                  Annulation possible à tout moment · Facturation mensuelle ou annuelle (2 mois offerts)
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-12">
            <div>
              <h3 className="text-2xl text-white tracking-tight mb-2" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 300 }}>
                Modèles IA Open Source
              </h3>
              <p className="text-[10px] text-gray-700 uppercase tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {openSourceModels.length} Modèles Disponibles
              </p>
            </div>

            <div className="grid grid-cols-1 gap-[1px] bg-white/[0.05] border border-white/[0.05]">
              {openSourceModels.map((model, index) => (
                <div key={index} className="bg-black p-8 hover:bg-white/[0.01] transition-all">
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 border border-white/[0.08] flex items-center justify-center flex-shrink-0 bg-black/50">
                      <Cpu className="w-7 h-7 text-[#d4af37]" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <h4 className="text-[15px] text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                            {model.name}
                          </h4>
                          {model.tier === 'enterprise' && <Crown className="w-4 h-4 text-[#d4af37]" />}
                          {model.tier === 'pro' && <Star className="w-4 h-4 text-purple-400" />}
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              Paramètres
                            </p>
                            <p className="text-[12px] text-white tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                              {model.params}
                            </p>
                          </div>
                          <div className={`px-3 py-1.5 border ${
                            model.tier === 'enterprise' 
                              ? 'border-[#d4af37]/20 bg-[#d4af37]/5' 
                              : model.tier === 'pro'
                              ? 'border-purple-500/20 bg-purple-500/5'
                              : 'border-white/[0.08]'
                          }`}>
                            <span className={`text-[9px] uppercase tracking-[0.25em] ${
                              model.tier === 'enterprise' 
                                ? 'text-[#d4af37]' 
                                : model.tier === 'pro'
                                ? 'text-purple-400'
                                : 'text-gray-600'
                            }`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {model.tier}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[12px] text-gray-600 mb-4 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                        {model.description}
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-gray-700" />
                          <span className="text-[10px] text-gray-700 tracking-wide" style={{ fontFamily: 'Courier New, monospace' }}>
                            {model.provider}
                          </span>
                        </div>
                        <div className="w-1 h-1 bg-gray-800" />
                        <span className="text-[10px] text-gray-700 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                          Open Source
                        </span>
                      </div>
                    </div>

                    <button className="h-11 px-6 border border-white/[0.08] hover:border-[#d4af37]/30 transition-all flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-white uppercase tracking-[0.2em]" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                        Déployer
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Model Info */}
            <div className="mt-12 p-8 border border-[#d4af37]/20 bg-[#d4af37]/5">
              <div className="flex items-start gap-4">
                <Brain className="w-6 h-6 text-[#d4af37] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-[11px] text-white uppercase tracking-[0.25em] mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Infrastructure de Pointe
                  </p>
                  <p className="text-[12px] text-gray-600 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                    Tous les modèles sont hébergés sur notre infrastructure GPU haute performance (NVIDIA A100 & H100). 
                    Fine-tuning disponible pour personnaliser les modèles selon vos besoins métier. 
                    Temps de réponse garantis sous 200ms. Conformité RGPD et souveraineté des données assurée.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default AIAgentSection;