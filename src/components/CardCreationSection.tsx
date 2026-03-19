import { useState } from "react";
import { CreditCard, Plus, Eye, EyeOff, Copy, Check, Lock, Shield, Sparkles, Crown, Zap, Globe, Trash2, Settings, TrendingUp, DollarSign, Calendar, Download, RefreshCw, AlertCircle, ChevronRight, Award, Star, Gift } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Select } from "./ui/select";

interface BankCard {
  id: string;
  type: 'virtual' | 'physical';
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  tier: 'standard' | 'premium' | 'elite';
  status: 'active' | 'frozen' | 'pending';
  limit: number;
  spent: number;
  created: string;
  color: string;
}

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
  category: string;
}

export function CardCreationSection() {
  const [activeTab, setActiveTab] = useState("my-cards");
  const [cards, setCards] = useState<BankCard[]>([
    {
      id: '1',
      type: 'virtual',
      cardNumber: '4532 **** **** 8901',
      cardHolder: 'JOHN DOE',
      expiryDate: '12/28',
      cvv: '***',
      tier: 'elite',
      status: 'active',
      limit: 50000,
      spent: 12450,
      created: '2025-01-15',
      color: 'from-[#d4af37] to-amber-600'
    },
    {
      id: '2',
      type: 'physical',
      cardNumber: '5412 **** **** 3456',
      cardHolder: 'JOHN DOE',
      expiryDate: '09/27',
      cvv: '***',
      tier: 'premium',
      status: 'active',
      limit: 25000,
      spent: 8920,
      created: '2024-11-20',
      color: 'from-purple-600 to-purple-800'
    }
  ]);

  const [recentTransactions] = useState<Transaction[]>([
    { id: '1', merchant: 'Apple Store', amount: 1299, date: '2025-11-07', status: 'completed', category: 'shopping' },
    { id: '2', merchant: 'Amazon', amount: 89.99, date: '2025-11-06', status: 'completed', category: 'shopping' },
    { id: '3', merchant: 'Netflix', amount: 15.99, date: '2025-11-05', status: 'completed', category: 'subscription' },
    { id: '4', merchant: 'Restaurant Le Luxe', amount: 245, date: '2025-11-04', status: 'completed', category: 'dining' },
  ]);
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [selectedCard, setSelectedCard] = useState<BankCard | null>(null);
  const [showCVV, setShowCVV] = useState(false);
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [newCardType, setNewCardType] = useState<'virtual' | 'physical'>('virtual');
  const [newCardTier, setNewCardTier] = useState<'standard' | 'premium' | 'elite'>('standard');
  const [newCardHolder, setNewCardHolder] = useState('');
  const [newCardLimit, setNewCardLimit] = useState('10000');

  const tierDetails = {
    standard: {
      name: 'Standard',
      icon: CreditCard,
      color: 'from-slate-600 to-slate-800',
      limit: 10000,
      fee: 0,
      cashback: 1,
      features: ['Transactions mondiales', 'Cashback 1%', 'Support 24/7', 'Notifications en temps réel']
    },
    premium: {
      name: 'Premium',
      icon: Sparkles,
      color: 'from-purple-600 to-purple-800',
      limit: 25000,
      fee: 49,
      cashback: 2,
      features: ['Cashback 2%', 'Assurance voyage', 'Conciergerie', 'Sans frais à l\'étranger', 'Accès prioritaire']
    },
    elite: {
      name: 'Elite',
      icon: Crown,
      color: 'from-[#d4af37] to-amber-600',
      limit: 50000,
      fee: 199,
      cashback: 5,
      features: ['Cashback 5%', 'Accès salons VIP', 'Conciergerie privée', 'Assurance premium', 'Limites illimitées', 'Support dédié 24/7']
    }
  };

  const totalCashback = cards.reduce((sum, card) => {
    const tier = tierDetails[card.tier];
    return sum + (card.spent * tier.cashback / 100);
  }, 0);

  const handleCreateCard = async () => {
    setIsCreating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newCard: BankCard = {
      id: Date.now().toString(),
      type: newCardType,
      cardNumber: `${Math.floor(1000 + Math.random() * 9000)} **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
      cardHolder: newCardHolder.toUpperCase() || 'CARD HOLDER',
      expiryDate: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${String(new Date().getFullYear() + 3).slice(-2)}`,
      cvv: '***',
      tier: newCardTier,
      status: newCardType === 'physical' ? 'pending' : 'active',
      limit: parseInt(newCardLimit),
      spent: 0,
      created: new Date().toISOString().split('T')[0],
      color: tierDetails[newCardTier].color
    };
    
    setCards([...cards, newCard]);
    setIsCreating(false);
    setShowCreateDialog(false);
    setNewCardHolder('');
    setNewCardLimit('10000');
  };

  const handleCopyCardNumber = (cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteCard = (cardId: string) => {
    setCards(cards.filter(card => card.id !== cardId));
    setShowCardDetails(false);
  };

  const handleFreezeCard = (cardId: string) => {
    setCards(cards.map(card => 
      card.id === cardId 
        ? { ...card, status: card.status === 'frozen' ? 'active' : 'frozen' as 'active' | 'frozen' | 'pending' }
        : card
    ));
  };

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-black" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIxMjEyMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
      
      {/* Radial Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37]/10 to-amber-600/10 border border-[#d4af37]/30 backdrop-blur-xl mb-6">
            <CreditCard className="w-5 h-5 text-[#d4af37]" />
            <span className="text-[#d4af37]">Cartes Bancaires Premium</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-white via-[#d4af37] to-white bg-clip-text text-transparent" style={{ fontFamily: 'Playfair Display, serif' }}>
            Vos Cartes Blockchain
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Créez et gérez vos cartes bancaires virtuelles et physiques connectées à votre portefeuille blockchain.
            Dépensez vos crypto-actifs partout dans le monde avec un cashback exceptionnel.
          </p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { 
              label: 'Cartes Actives', 
              value: cards.filter(c => c.status === 'active').length, 
              icon: CreditCard, 
              trend: '+2 ce mois',
              color: 'from-[#d4af37]/20 to-amber-600/20',
              iconColor: 'text-[#d4af37]'
            },
            { 
              label: 'Limite Totale', 
              value: `${cards.reduce((sum, c) => sum + c.limit, 0).toLocaleString()}€`, 
              icon: Zap,
              trend: 'Disponible',
              color: 'from-purple-500/20 to-purple-600/20',
              iconColor: 'text-purple-400'
            },
            { 
              label: 'Dépensé ce mois', 
              value: `${cards.reduce((sum, c) => sum + c.spent, 0).toLocaleString()}€`, 
              icon: TrendingUp,
              trend: '+15% vs dernier mois',
              color: 'from-blue-500/20 to-blue-600/20',
              iconColor: 'text-blue-400'
            },
            { 
              label: 'Cashback Gagné', 
              value: `${totalCashback.toFixed(2)}€`, 
              icon: Gift,
              trend: 'Ce mois',
              color: 'from-green-500/20 to-green-600/20',
              iconColor: 'text-green-400'
            }
          ].map((stat, index) => (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-[#d4af37]/20 rounded-2xl p-6 hover:border-[#d4af37]/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <Badge className="bg-slate-800/50 text-gray-400 border-slate-700">
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-slate-900/50 backdrop-blur-xl border border-[#d4af37]/20 p-1 rounded-xl">
            <TabsTrigger value="my-cards" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#d4af37] data-[state=active]:to-amber-600 data-[state=active]:text-black rounded-lg transition-all duration-300">
              Mes Cartes
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#d4af37] data-[state=active]:to-amber-600 data-[state=active]:text-black rounded-lg transition-all duration-300">
              Créer une Carte
            </TabsTrigger>
          </TabsList>

          {/* My Cards Tab */}
          <TabsContent value="my-cards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <div 
                  key={card.id}
                  onClick={() => {
                    setSelectedCard(card);
                    setShowCardDetails(true);
                  }}
                  className="group cursor-pointer"
                >
                  {/* Enhanced Card Visual */}
                  <div className={`relative h-64 rounded-2xl bg-gradient-to-br ${card.color} p-6 shadow-2xl overflow-hidden mb-4 transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_60px_-15px_rgba(212,175,55,0.3)]`}>
                    {/* World Map Background */}
                    <div className="absolute inset-0 opacity-20">
                      <svg viewBox="0 0 400 250" className="w-full h-full">
                        <defs>
                          <pattern id={`worldmap-${card.id}`} x="0" y="0" width="400" height="250" patternUnits="userSpaceOnUse">
                            {/* Simplified world map dots pattern */}
                            <circle cx="50" cy="80" r="1" fill="currentColor" className="text-white" />
                            <circle cx="60" cy="75" r="1" fill="currentColor" className="text-white" />
                            <circle cx="70" cy="85" r="1" fill="currentColor" className="text-white" />
                            <circle cx="80" cy="70" r="1" fill="currentColor" className="text-white" />
                            <circle cx="90" cy="90" r="1" fill="currentColor" className="text-white" />
                            <circle cx="100" cy="85" r="1" fill="currentColor" className="text-white" />
                            <circle cx="110" cy="80" r="1" fill="currentColor" className="text-white" />
                            <circle cx="120" cy="95" r="1" fill="currentColor" className="text-white" />
                            <circle cx="130" cy="75" r="1" fill="currentColor" className="text-white" />
                            <circle cx="140" cy="85" r="1" fill="currentColor" className="text-white" />
                            <circle cx="150" cy="90" r="1" fill="currentColor" className="text-white" />
                            <circle cx="160" cy="80" r="1" fill="currentColor" className="text-white" />
                            <circle cx="170" cy="100" r="1" fill="currentColor" className="text-white" />
                            <circle cx="180" cy="85" r="1" fill="currentColor" className="text-white" />
                            <circle cx="190" cy="95" r="1" fill="currentColor" className="text-white" />
                            <circle cx="200" cy="80" r="1" fill="currentColor" className="text-white" />
                            <circle cx="210" cy="90" r="1" fill="currentColor" className="text-white" />
                            <circle cx="220" cy="85" r="1" fill="currentColor" className="text-white" />
                            <circle cx="230" cy="75" r="1" fill="currentColor" className="text-white" />
                            <circle cx="240" cy="95" r="1" fill="currentColor" className="text-white" />
                            <circle cx="250" cy="85" r="1" fill="currentColor" className="text-white" />
                            <circle cx="260" cy="80" r="1" fill="currentColor" className="text-white" />
                            <circle cx="270" cy="90" r="1" fill="currentColor" className="text-white" />
                            <circle cx="280" cy="100" r="1" fill="currentColor" className="text-white" />
                            <circle cx="290" cy="85" r="1" fill="currentColor" className="text-white" />
                            <circle cx="300" cy="95" r="1" fill="currentColor" className="text-white" />
                            <circle cx="310" cy="80" r="1" fill="currentColor" className="text-white" />
                            <circle cx="320" cy="90" r="1" fill="currentColor" className="text-white" />
                            <circle cx="330" cy="85" r="1" fill="currentColor" className="text-white" />
                            <circle cx="340" cy="100" r="1" fill="currentColor" className="text-white" />
                            <circle cx="350" cy="90" r="1" fill="currentColor" className="text-white" />
                            {/* Add more continents representation */}
                            <circle cx="55" cy="120" r="1" fill="currentColor" className="text-white" />
                            <circle cx="65" cy="125" r="1" fill="currentColor" className="text-white" />
                            <circle cx="75" cy="130" r="1" fill="currentColor" className="text-white" />
                            <circle cx="85" cy="135" r="1" fill="currentColor" className="text-white" />
                            <circle cx="95" cy="140" r="1" fill="currentColor" className="text-white" />
                            <circle cx="105" cy="130" r="1" fill="currentColor" className="text-white" />
                            <circle cx="115" cy="125" r="1" fill="currentColor" className="text-white" />
                            <circle cx="125" cy="135" r="1" fill="currentColor" className="text-white" />
                            <circle cx="135" cy="140" r="1" fill="currentColor" className="text-white" />
                            <circle cx="145" cy="130" r="1" fill="currentColor" className="text-white" />
                            <circle cx="155" cy="145" r="1" fill="currentColor" className="text-white" />
                            <circle cx="165" cy="135" r="1" fill="currentColor" className="text-white" />
                            <circle cx="175" cy="140" r="1" fill="currentColor" className="text-white" />
                            <circle cx="185" cy="130" r="1" fill="currentColor" className="text-white" />
                            <circle cx="195" cy="145" r="1" fill="currentColor" className="text-white" />
                            <circle cx="205" cy="135" r="1" fill="currentColor" className="text-white" />
                            <circle cx="215" cy="140" r="1" fill="currentColor" className="text-white" />
                            <circle cx="225" cy="130" r="1" fill="currentColor" className="text-white" />
                            <circle cx="235" cy="145" r="1" fill="currentColor" className="text-white" />
                            <circle cx="245" cy="135" r="1" fill="currentColor" className="text-white" />
                            <circle cx="255" cy="140" r="1" fill="currentColor" className="text-white" />
                            <circle cx="265" cy="150" r="1" fill="currentColor" className="text-white" />
                            <circle cx="275" cy="135" r="1" fill="currentColor" className="text-white" />
                            <circle cx="285" cy="145" r="1" fill="currentColor" className="text-white" />
                            <circle cx="295" cy="140" r="1" fill="currentColor" className="text-white" />
                            <circle cx="305" cy="130" r="1" fill="currentColor" className="text-white" />
                            <circle cx="315" cy="145" r="1" fill="currentColor" className="text-white" />
                            <circle cx="325" cy="135" r="1" fill="currentColor" className="text-white" />
                            <circle cx="335" cy="140" r="1" fill="currentColor" className="text-white" />
                          </pattern>
                        </defs>
                        <rect width="400" height="250" fill={`url(#worldmap-${card.id})`} />
                      </svg>
                    </div>
                    
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-black/10" />
                    
                    {/* Card Content */}
                    <div className="relative h-full flex flex-col justify-between">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/90 text-lg tracking-[0.2em] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>CREDIT CARD</p>
                          <p className="text-white/70 text-xs">BLOCKCHAIN BANKING</p>
                        </div>
                        <Badge className={`${card.status === 'active' ? 'bg-white/20 text-white border-white/30' : card.status === 'frozen' ? 'bg-blue-500/30 text-blue-200 border-blue-400/40' : 'bg-orange-500/30 text-orange-200 border-orange-400/40'} backdrop-blur-xl`}>
                          {card.status === 'active' ? 'Active' : card.status === 'frozen' ? 'Gelée' : 'En cours'}
                        </Badge>
                      </div>

                      {/* Chip */}
                      <div className="w-14 h-11 rounded-lg bg-gradient-to-br from-yellow-200/80 to-yellow-600/80 relative overflow-hidden shadow-lg">
                        <div className="absolute inset-1 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_25%,rgba(255,255,255,0.3)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.3)_75%)] bg-[length:6px_6px]" />
                        <div className="absolute inset-0 border border-yellow-700/20 rounded-lg" />
                      </div>

                      {/* Card Number & Details */}
                      <div>
                        <p className="text-white text-2xl tracking-[0.25em] mb-6 drop-shadow-lg" style={{ fontFamily: 'Courier New, monospace' }}>
                          {card.cardNumber}
                        </p>
                        
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-white/60 text-[10px] mb-1 tracking-widest" style={{ fontFamily: 'Montserrat, sans-serif' }}>CARD HOLDER</p>
                            <p className="text-white tracking-wider text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{card.cardHolder}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white/60 text-[10px] mb-1 tracking-widest" style={{ fontFamily: 'Montserrat, sans-serif' }}>VALID THRU</p>
                            <p className="text-white tracking-wider text-sm" style={{ fontFamily: 'Courier New, monospace' }}>{card.expiryDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* THESORIA Logo - Bottom Right */}
                    <div className="absolute bottom-6 right-6">
                      <p className="text-white/90 tracking-[0.3em]" style={{ fontFamily: 'Playfair Display, serif' }}>THESORIA</p>
                    </div>
                  </div>

                  {/* Enhanced Card Info */}
                  <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-[#d4af37]/20 rounded-xl p-5 hover:border-[#d4af37]/40 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.type === 'virtual' ? 'from-[#d4af37]/20 to-amber-600/20' : 'from-purple-500/20 to-purple-600/20'} flex items-center justify-center`}>
                          {card.type === 'virtual' ? (
                            <Zap className="w-5 h-5 text-[#d4af37]" />
                          ) : (
                            <CreditCard className="w-5 h-5 text-purple-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-white">
                            {card.type === 'virtual' ? 'Virtuelle' : 'Physique'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Créée le {new Date(card.created).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-[#d4af37]/20 to-amber-600/20 text-[#d4af37] border-[#d4af37]/30">
                        {tierDetails[card.tier].name}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Dépensé</span>
                          <span className="text-white">{card.spent.toLocaleString()}€ / {card.limit.toLocaleString()}€</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#d4af37] to-amber-600 transition-all duration-500"
                            style={{ width: `${(card.spent / card.limit) * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Star className="w-4 h-4 text-[#d4af37]" />
                          <span>Cashback {tierDetails[card.tier].cashback}%</span>
                        </div>
                        <button className="text-[#d4af37] hover:text-[#d4af37]/80 transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Enhanced Add New Card Button */}
              <div 
                onClick={() => setShowCreateDialog(true)}
                className="group cursor-pointer h-full min-h-[450px] flex items-center justify-center bg-gradient-to-br from-slate-900/30 to-slate-950/30 backdrop-blur-xl border-2 border-dashed border-[#d4af37]/30 rounded-2xl hover:border-[#d4af37]/60 hover:from-slate-900/50 hover:to-slate-950/50 transition-all duration-500 relative overflow-hidden"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="text-center relative z-10">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#d4af37]/20 to-amber-600/20 border-2 border-[#d4af37]/30 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:border-[#d4af37]/60 transition-all duration-500">
                    <Plus className="w-10 h-10 text-[#d4af37]" />
                  </div>
                  <p className="text-xl text-[#d4af37] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Créer une Nouvelle Carte
                  </p>
                  <p className="text-sm text-gray-500 mb-4">Virtuelle ou Physique</p>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Instantané</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Sécurisé</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions Section */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Transactions Récentes
                </h3>
                <Button variant="outline" className="border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10">
                  <Calendar className="w-4 h-4 mr-2" />
                  Voir tout
                </Button>
              </div>
              
              <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-xl border border-[#d4af37]/20 rounded-2xl overflow-hidden">
                {recentTransactions.map((transaction, index) => (
                  <div 
                    key={transaction.id} 
                    className={`flex items-center justify-between p-5 hover:bg-slate-800/30 transition-colors ${index !== recentTransactions.length - 1 ? 'border-b border-slate-800' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-amber-600/20 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-[#d4af37]" />
                      </div>
                      <div>
                        <p className="text-white">{transaction.merchant}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                          <Badge className="bg-slate-800/50 text-gray-400 border-slate-700 text-xs">
                            {transaction.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white">-{transaction.amount}€</p>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs mt-1">
                        +{(transaction.amount * 0.05).toFixed(2)}€ cashback
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Create Card Tab */}
          <TabsContent value="create" className="space-y-8">
            <div className="max-w-5xl mx-auto">
              {/* Card Type Selection */}
              <div className="mb-8">
                <Label className="text-white mb-4 block">Type de Carte</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setNewCardType('virtual')}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      newCardType === 'virtual' 
                        ? 'border-[#d4af37] bg-gradient-to-br from-[#d4af37]/10 to-amber-600/10' 
                        : 'border-slate-700 bg-slate-900/30 hover:border-slate-600'
                    }`}
                  >
                    <Zap className={`w-8 h-8 mb-3 ${newCardType === 'virtual' ? 'text-[#d4af37]' : 'text-gray-400'}`} />
                    <h3 className="text-xl text-white mb-2">Carte Virtuelle</h3>
                    <p className="text-sm text-gray-400">Instantanée, parfaite pour les achats en ligne</p>
                    <div className="mt-4 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Check className="w-3 h-3 text-green-400" />
                        <span>Activation immédiate</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Check className="w-3 h-3 text-green-400" />
                        <span>Sans frais de création</span>
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setNewCardType('physical')}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      newCardType === 'physical' 
                        ? 'border-[#d4af37] bg-gradient-to-br from-[#d4af37]/10 to-amber-600/10' 
                        : 'border-slate-700 bg-slate-900/30 hover:border-slate-600'
                    }`}
                  >
                    <CreditCard className={`w-8 h-8 mb-3 ${newCardType === 'physical' ? 'text-[#d4af37]' : 'text-gray-400'}`} />
                    <h3 className="text-xl text-white mb-2">Carte Physique</h3>
                    <p className="text-sm text-gray-400">Métal premium, livrée chez vous</p>
                    <div className="mt-4 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Check className="w-3 h-3 text-green-400" />
                        <span>Livraison 3-5 jours</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Check className="w-3 h-3 text-green-400" />
                        <span>Carte en métal premium</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tier Selection */}
              <div className="mb-8">
                <Label className="text-white mb-4 block">Niveau de Carte</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(tierDetails).map(([key, tier]) => {
                    const TierIcon = tier.icon;
                    return (
                      <div 
                        key={key}
                        onClick={() => setNewCardTier(key as 'standard' | 'premium' | 'elite')}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          newCardTier === key 
                            ? 'border-[#d4af37] bg-gradient-to-br from-[#d4af37]/10 to-amber-600/10' 
                            : 'border-slate-700 bg-slate-900/30 hover:border-slate-600'
                        }`}
                      >
                        <TierIcon className={`w-8 h-8 mb-3 ${newCardTier === key ? 'text-[#d4af37]' : 'text-gray-400'}`} />
                        <h3 className="text-xl text-white mb-1">{tier.name}</h3>
                        <p className="text-sm text-gray-400 mb-4">
                          {tier.fee === 0 ? 'Gratuit' : `${tier.fee}€/mois`}
                        </p>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-400">Limite: {tier.limit.toLocaleString()}€</p>
                          {tier.features.slice(0, 2).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                              <Check className="w-3 h-3 text-green-400" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Details Form */}
              <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-xl border border-[#d4af37]/20 rounded-2xl p-8 space-y-6">
                <h3 className="text-2xl text-white mb-6">Détails de la Carte</h3>
                
                <div>
                  <Label htmlFor="cardHolder" className="text-white mb-2 block">
                    Nom du Titulaire
                  </Label>
                  <Input
                    id="cardHolder"
                    value={newCardHolder}
                    onChange={(e) => setNewCardHolder(e.target.value)}
                    placeholder="VOTRE NOM"
                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <Label htmlFor="cardLimit" className="text-white mb-2 block">
                    Limite Mensuelle (€)
                  </Label>
                  <Input
                    id="cardLimit"
                    type="number"
                    value={newCardLimit}
                    onChange={(e) => setNewCardLimit(e.target.value)}
                    placeholder="10000"
                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-[#d4af37]"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Limite maximale pour {tierDetails[newCardTier].name}: {tierDetails[newCardTier].limit.toLocaleString()}€
                  </p>
                </div>

                {/* Features List */}
                <div className="border-t border-slate-700 pt-6">
                  <h4 className="text-white mb-4">Avantages Inclus</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tierDetails[newCardTier].features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-gray-400">
                        <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-[#d4af37]" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Create Button */}
                <Button
                  onClick={handleCreateCard}
                  disabled={isCreating || !newCardHolder}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-amber-600 hover:from-[#d4af37]/90 hover:to-amber-600/90 text-black py-6 text-lg"
                >
                  {isCreating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Créer la Carte {newCardType === 'physical' && '(Livraison 3-5 jours)'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Card Details Dialog */}
      <Dialog open={showCardDetails} onOpenChange={setShowCardDetails}>
        <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-950 border-[#d4af37]/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#d4af37]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Détails de la Carte
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Gérez votre carte et consultez les informations sensibles
            </DialogDescription>
          </DialogHeader>

          {selectedCard && (
            <div className="space-y-6">
              {/* Card Visual */}
              <div className={`relative h-56 rounded-2xl bg-gradient-to-br ${selectedCard.color} p-6 shadow-2xl overflow-hidden`}>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]" />
                </div>
                
                <div className="relative h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-6 h-6 text-white/90" />
                      <span className="text-white/90 text-sm">THESORIA</span>
                    </div>
                  </div>

                  <div className="w-12 h-10 rounded bg-gradient-to-br from-amber-200/30 to-amber-400/30 backdrop-blur-xl" />

                  <div>
                    <p className="text-white text-xl tracking-wider mb-4" style={{ fontFamily: 'monospace' }}>
                      {showFullNumber ? '4532 1234 5678 8901' : selectedCard.cardNumber}
                    </p>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white/70 text-xs mb-1">Titulaire</p>
                        <p className="text-white">{selectedCard.cardHolder}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/70 text-xs mb-1">Expire</p>
                        <p className="text-white">{selectedCard.expiryDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-gray-400">Numéro Complet</Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowFullNumber(!showFullNumber)}
                      className="text-[#d4af37] hover:text-[#d4af37]/80"
                    >
                      {showFullNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-white" style={{ fontFamily: 'monospace' }}>
                      {showFullNumber ? '4532 1234 5678 8901' : selectedCard.cardNumber}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyCardNumber(showFullNumber ? '4532123456788901' : selectedCard.cardNumber)}
                      className="text-[#d4af37] hover:text-[#d4af37]/80"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-gray-400">CVV</Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowCVV(!showCVV)}
                      className="text-[#d4af37] hover:text-[#d4af37]/80"
                    >
                      {showCVV ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-white text-xl" style={{ fontFamily: 'monospace' }}>
                    {showCVV ? '123' : '***'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleFreezeCard(selectedCard.id)}
                  variant="outline"
                  className={`${
                    selectedCard.status === 'frozen'
                      ? 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                      : 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10'
                  }`}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {selectedCard.status === 'frozen' ? 'Dégeler' : 'Geler'} la Carte
                </Button>

                <Button
                  onClick={() => handleDeleteCard(selectedCard.id)}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </div>

              {/* Usage Stats */}
              <div className="bg-slate-900/50 rounded-xl p-6 space-y-4">
                <h4 className="text-white">Utilisation</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Dépensé ce mois</span>
                    <span className="text-white">{selectedCard.spent.toLocaleString()}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Limite mensuelle</span>
                    <span className="text-white">{selectedCard.limit.toLocaleString()}€</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#d4af37] to-amber-600"
                      style={{ width: `${(selectedCard.spent / selectedCard.limit) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Restant</span>
                    <span className="text-[#d4af37]">{(selectedCard.limit - selectedCard.spent).toLocaleString()}€</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default CardCreationSection;