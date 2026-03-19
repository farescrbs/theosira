import { useState, useEffect } from 'react';
import {
  CreditCard, Plus, Eye, EyeOff, Copy, Check, Lock, Unlock,
  Snowflake, Trash2, ArrowUpCircle, ExternalLink, Shield, Zap,
  Globe, Wallet, RefreshCw, ChevronDown, ChevronRight, X,
  Smartphone, Crown, Star, TrendingUp, AlertCircle, CheckCircle2,
  Banknote, CircleDollarSign, Loader2
} from 'lucide-react';
import {
  cardixAPI,
  CARDIX_TIER_DETAILS,
  CARDIX_FEES,
  CARDIX_LIMITS,
  SUPPORTED_CRYPTOS,
  type CardixCard,
  type CardixTransaction,
  type CardixCardRequest,
} from '../services/cardixAPI';

// ─── Sub-Components ──────────────────────────────────────────────────────────

function CardVisual({ card, showDetails, onToggleDetails }: {
  card: CardixCard;
  showDetails: boolean;
  onToggleDetails: () => void;
}) {
  const tier = CARDIX_TIER_DETAILS[card.tier];
  const isBlack = card.tier === 'black';

  return (
    <div className={`relative h-56 rounded-2xl bg-gradient-to-br ${tier.color} p-5 shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(212,175,55,0.3)]`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full" />
        <div className="absolute top-8 right-8 w-24 h-24 border border-white/15 rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32" />
      </div>

      {isBlack && (
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDIwIEwgMjAgMCBMIDQwIDIwIEwgMjAgNDBaIiBmaWxsPSJub25lIiBzdHJva2U9IiNkNGFmMzciIHN0cm9rZS13aWR0aD0iMC4zIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+')] opacity-20" />
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-black/20" />

      <div className="relative h-full flex flex-col justify-between">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/80 text-[10px] tracking-[0.3em] mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              CARDIX x THESORIA
            </p>
            <p className="text-white/50 text-[9px] tracking-widest" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {card.type === 'virtual' ? 'VIRTUAL' : 'PHYSICAL'} {tier.name.toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              card.status === 'active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' :
              card.status === 'frozen' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' :
              'bg-orange-500/20 text-orange-300 border border-orange-400/30'
            }`}>
              {card.status === 'active' ? 'ACTIVE' : card.status === 'frozen' ? 'FROZEN' : 'PENDING'}
            </span>
            {card.network === 'visa' ? (
              <span className="text-white/90 text-xs tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>VISA</span>
            ) : (
              <span className="text-white/90 text-xs tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>MC</span>
            )}
          </div>
        </div>

        {/* Chip */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-8 rounded-md bg-gradient-to-br from-yellow-200/80 to-yellow-600/60 relative overflow-hidden shadow-md">
            <div className="absolute inset-0.5 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_25%,rgba(255,255,255,0.3)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.3)_75%)] bg-[length:5px_5px]" />
          </div>
          {card.contactless && (
            <svg className="w-5 h-5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8.5 16.5a5 5 0 0 1 0-9" /><path d="M12 19a8 8 0 0 0 0-14" /><path d="M15.5 21.5A11 11 0 0 0 15.5 2.5" />
            </svg>
          )}
        </div>

        {/* Card number */}
        <div>
          <p className="text-white text-lg tracking-[0.25em] mb-3 drop-shadow-lg" style={{ fontFamily: 'Courier New, monospace' }}>
            {showDetails ? card.maskedPan.replace(/\*/g, String(Math.floor(Math.random() * 10))) : card.maskedPan}
          </p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/50 text-[8px] tracking-[0.2em] mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>CARD HOLDER</p>
              <p className="text-white/90 text-xs tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>{card.holderName}</p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-[8px] tracking-[0.2em] mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>VALID THRU</p>
              <p className="text-white/90 text-xs tracking-wider" style={{ fontFamily: 'Courier New, monospace' }}>{card.expiryMonth}/{card.expiryYear}</p>
            </div>
            <button onClick={onToggleDetails} className="text-white/50 hover:text-white/90 transition-colors">
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TransactionRow({ tx }: { tx: CardixTransaction }) {
  const categoryIcons: Record<string, string> = {
    'Technologie': '💻', 'Shopping': '🛍️', 'Transport': '🚗', 'Retrait': '🏧',
    'Recharge': '⚡', 'Abonnement': '📺', 'Restaurant': '🍽️', 'Voyage': '✈️',
    'Remboursement': '↩️',
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-white/[0.02] transition-colors border-b border-slate-800/50 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center text-sm">
          {categoryIcons[tx.category] || '💳'}
        </div>
        <div>
          <p className="text-white/90 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{tx.merchant}</p>
          <p className="text-white/40 text-xs">{new Date(tx.timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm ${
          tx.type === 'refund' || tx.type === 'topup' ? 'text-emerald-400' : 'text-white/90'
        }`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {tx.type === 'refund' || tx.type === 'topup' ? '+' : '-'}{tx.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {tx.currency}
        </p>
        <span className={`text-[10px] ${
          tx.status === 'completed' ? 'text-emerald-400/60' :
          tx.status === 'pending' ? 'text-amber-400/60' : 'text-red-400/60'
        }`}>
          {tx.status === 'completed' ? 'Complété' : tx.status === 'pending' ? 'En cours' : 'Refusé'}
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function CardixIntegration() {
  const [cards, setCards] = useState<CardixCard[]>([]);
  const [transactions, setTransactions] = useState<CardixTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'cards' | 'create' | 'topup' | 'transactions'>('cards');
  const [selectedCard, setSelectedCard] = useState<CardixCard | null>(null);
  const [showCardDetails, setShowCardDetails] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  // Create card form
  const [createForm, setCreateForm] = useState<Partial<CardixCardRequest>>({
    type: 'virtual',
    currency: 'EUR',
    tier: 'premium',
    fundingSource: 'eth',
    holderFirstName: '',
    holderLastName: '',
    email: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Top-up form
  const [topUpCardId, setTopUpCardId] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('100');
  const [topUpCrypto, setTopUpCrypto] = useState('eth');
  const [isTopingUp, setIsTopingUp] = useState(false);
  const [topUpResult, setTopUpResult] = useState<any>(null);

  // Load data
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [cardsData, txData] = await Promise.all([
          cardixAPI.getCards(),
          cardixAPI.getTransactions(),
        ]);
        setCards(cardsData);
        setTransactions(txData);
        if (cardsData.length > 0) {
          setSelectedCard(cardsData[0]);
          setTopUpCardId(cardsData[0].id);
        }
      } catch (err) {
        console.error('Cardix API error:', err);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleCreateCard = async () => {
    if (!createForm.holderFirstName || !createForm.holderLastName || !createForm.email) return;
    setIsCreating(true);
    setCreateSuccess(false);
    try {
      const newCard = await cardixAPI.createCard(createForm as CardixCardRequest);
      setCards(prev => [...prev, newCard]);
      setCreateSuccess(true);
      setTimeout(() => {
        setActiveView('cards');
        setSelectedCard(newCard);
        setCreateSuccess(false);
        setCreateForm({ type: 'virtual', currency: 'EUR', tier: 'premium', fundingSource: 'eth', holderFirstName: '', holderLastName: '', email: '' });
      }, 2000);
    } catch (err) {
      console.error('Create card error:', err);
    }
    setIsCreating(false);
  };

  const handleTopUp = async () => {
    if (!topUpCardId || !topUpAmount) return;
    setIsTopingUp(true);
    setTopUpResult(null);
    try {
      const result = await cardixAPI.topUpCard({
        cardId: topUpCardId,
        amount: parseFloat(topUpAmount),
        fromCrypto: topUpCrypto as any,
      });
      setTopUpResult(result);
      // Refresh data
      const [cardsData, txData] = await Promise.all([
        cardixAPI.getCards(),
        cardixAPI.getTransactions(),
      ]);
      setCards(cardsData);
      setTransactions(txData);
    } catch (err) {
      console.error('Top-up error:', err);
    }
    setIsTopingUp(false);
  };

  const handleFreezeCard = async (cardId: string) => {
    const updated = await cardixAPI.freezeCard(cardId);
    if (updated) {
      setCards(prev => prev.map(c => c.id === cardId ? updated : c));
      if (selectedCard?.id === cardId) setSelectedCard(updated);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    const success = await cardixAPI.deleteCard(cardId);
    if (success) {
      setCards(prev => prev.filter(c => c.id !== cardId));
      if (selectedCard?.id === cardId) setSelectedCard(cards[0] || null);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalBalance = cards.reduce((sum, c) => sum + c.balance, 0);
  const totalMonthlySpent = cards.reduce((sum, c) => sum + c.monthlySpent, 0);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050505] to-black" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#d4af37]/3 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/3 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37]/10 to-amber-600/10 border border-[#d4af37]/30 backdrop-blur-xl mb-6">
            <CreditCard className="w-4 h-4 text-[#d4af37]" />
            <span className="text-[#d4af37] text-sm tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              CARDIX PARTNER INTEGRATION
            </span>
            <span className="text-[#d4af37]/50 text-xs ml-2">CODE: NKFDRXGE</span>
          </div>

          <h2 className="text-4xl md:text-6xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            <span className="bg-gradient-to-r from-white via-[#d4af37] to-white bg-clip-text text-transparent">
              Cartes de Paiement Crypto
            </span>
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Commandez votre carte Visa/Mastercard alimentée par vos crypto-actifs.
            Dépensez partout dans le monde avec des frais minimaux.
          </p>

          <a
            href={cardixAPI.getPartnerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-[#d4af37]/70 hover:text-[#d4af37] text-sm transition-colors"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Powered by Cardix.me
          </a>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Cartes Actives', value: cards.filter(c => c.status === 'active').length, icon: CreditCard, color: 'text-[#d4af37]' },
            { label: 'Solde Total', value: `${totalBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€`, icon: Wallet, color: 'text-emerald-400' },
            { label: 'Dépensé ce mois', value: `${totalMonthlySpent.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€`, icon: TrendingUp, color: 'text-blue-400' },
            { label: 'Cashback gagné', value: `${(totalMonthlySpent * 0.02).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€`, icon: Star, color: 'text-purple-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.02] backdrop-blur-xl border border-[#d4af37]/15 rounded-xl p-4 hover:border-[#d4af37]/30 transition-all">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-white text-xl mb-0.5" style={{ fontFamily: 'Playfair Display, serif' }}>{stat.value}</p>
              <p className="text-gray-500 text-xs" style={{ fontFamily: 'Montserrat, sans-serif' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'cards' as const, label: 'Mes Cartes', icon: CreditCard },
            { id: 'create' as const, label: 'Commander', icon: Plus },
            { id: 'topup' as const, label: 'Recharger', icon: ArrowUpCircle },
            { id: 'transactions' as const, label: 'Transactions', icon: Banknote },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all ${
                activeView === tab.id
                  ? 'bg-gradient-to-r from-[#d4af37]/20 to-amber-600/20 text-[#d4af37] border border-[#d4af37]/40'
                  : 'bg-white/[0.02] text-gray-400 border border-slate-800/50 hover:border-[#d4af37]/20 hover:text-gray-300'
              }`}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
            <span className="text-gray-400 ml-3">Connexion à Cardix API...</span>
          </div>
        ) : (
          <>
            {/* ── Cards View ────────────────────────────────────── */}
            {activeView === 'cards' && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Cards List */}
                <div className="lg:col-span-2 space-y-6">
                  {cards.length === 0 ? (
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-dashed border-[#d4af37]/30 rounded-2xl p-12 text-center">
                      <CreditCard className="w-12 h-12 text-[#d4af37]/30 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Aucune carte Cardix. Commandez votre première carte crypto.
                      </p>
                      <button
                        onClick={() => setActiveView('create')}
                        className="bg-gradient-to-r from-[#d4af37] to-amber-600 text-black px-6 py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        Commander une carte
                      </button>
                    </div>
                  ) : (
                    cards.map(card => (
                      <div
                        key={card.id}
                        className={`cursor-pointer transition-all ${selectedCard?.id === card.id ? 'ring-1 ring-[#d4af37]/40 rounded-2xl' : ''}`}
                        onClick={() => setSelectedCard(card)}
                      >
                        <CardVisual
                          card={card}
                          showDetails={showCardDetails[card.id] || false}
                          onToggleDetails={() => setShowCardDetails(prev => ({ ...prev, [card.id]: !prev[card.id] }))}
                        />

                        {/* Card info bar */}
                        <div className="bg-white/[0.02] backdrop-blur-xl border border-[#d4af37]/15 border-t-0 rounded-b-2xl px-5 py-4 -mt-2">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-white/80 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{card.label}</span>
                              <span className="text-white/30 text-xs font-mono">{card.cardId}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleFreezeCard(card.id); }}
                                className={`p-1.5 rounded-lg transition-all ${
                                  card.status === 'frozen'
                                    ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                                    : 'bg-white/5 text-gray-500 hover:text-gray-300'
                                }`}
                                title={card.status === 'frozen' ? 'Débloquer' : 'Geler'}
                              >
                                {card.status === 'frozen' ? <Unlock className="w-3.5 h-3.5" /> : <Snowflake className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleCopy(card.maskedPan); }}
                                className="p-1.5 rounded-lg bg-white/5 text-gray-500 hover:text-gray-300 transition-all"
                                title="Copier le numéro"
                              >
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteCard(card.id); }}
                                className="p-1.5 rounded-lg bg-white/5 text-gray-500 hover:text-red-400 transition-all"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Balance & limits */}
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <p className="text-gray-500 text-[10px] tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>SOLDE</p>
                              <p className="text-[#d4af37] text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>
                                {card.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {card.currency}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-[10px] tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>DÉPENSÉ / JOUR</p>
                              <p className="text-white/70 text-sm">{card.dailySpent.toLocaleString()}€ / {card.dailyLimit.toLocaleString()}€</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-[10px] tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>DÉPENSÉ / MOIS</p>
                              <p className="text-white/70 text-sm">{card.monthlySpent.toLocaleString()}€ / {card.monthlyLimit.toLocaleString()}€</p>
                            </div>
                          </div>

                          {/* Spending bar */}
                          <div className="mt-3">
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#d4af37] to-amber-500 rounded-full transition-all duration-700"
                                style={{ width: `${Math.min((card.monthlySpent / card.monthlyLimit) * 100, 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Features icons */}
                          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-800/50">
                            {card.is3DSecure && <span className="text-[10px] text-gray-500 flex items-center gap-1"><Shield className="w-3 h-3" /> 3D Secure</span>}
                            {card.contactless && <span className="text-[10px] text-gray-500 flex items-center gap-1"><Zap className="w-3 h-3" /> NFC</span>}
                            {card.internationalPayments && <span className="text-[10px] text-gray-500 flex items-center gap-1"><Globe className="w-3 h-3" /> International</span>}
                            {card.atmWithdrawal && <span className="text-[10px] text-gray-500 flex items-center gap-1"><Banknote className="w-3 h-3" /> ATM</span>}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Sidebar - Recent Transactions */}
                <div className="space-y-6">
                  <div className="bg-white/[0.02] backdrop-blur-xl border border-[#d4af37]/15 rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-800/50">
                      <h3 className="text-white text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Dernières transactions</h3>
                    </div>
                    <div className="max-h-[480px] overflow-y-auto">
                      {transactions.slice(0, 8).map(tx => (
                        <TransactionRow key={tx.id} tx={tx} />
                      ))}
                    </div>
                    <div className="px-5 py-3 border-t border-slate-800/50">
                      <button
                        onClick={() => setActiveView('transactions')}
                        className="text-[#d4af37]/70 hover:text-[#d4af37] text-xs flex items-center gap-1 transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        Voir toutes les transactions <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* API Status */}
                  <div className="bg-white/[0.02] backdrop-blur-xl border border-[#d4af37]/15 rounded-2xl p-5">
                    <h3 className="text-white text-sm mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Cardix API Status</h3>
                    <div className="space-y-2">
                      {[
                        { label: 'API Endpoint', value: 'cardix.me/api/v1', status: 'online' },
                        { label: 'Partner Code', value: 'NKFDRXGE', status: 'verified' },
                        { label: 'KYC Level', value: 'Enhanced', status: 'verified' },
                        { label: 'Rate Limit', value: '100 req/min', status: 'online' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">{item.label}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-white/70 font-mono text-[11px]">{item.value}</span>
                            <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'online' ? 'bg-emerald-400' : 'bg-[#d4af37]'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Create Card View ──────────────────────────────── */}
            {activeView === 'create' && (
              <div className="max-w-4xl mx-auto">
                {createSuccess ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-12 text-center">
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-2xl text-emerald-400 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Carte créée avec succès !
                    </h3>
                    <p className="text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {createForm.type === 'virtual'
                        ? 'Votre carte virtuelle est active et prête à l\'emploi.'
                        : 'Votre carte physique sera livrée sous 5-7 jours ouvrés.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Form */}
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-[#d4af37]/15 rounded-2xl p-6 space-y-5">
                      <h3 className="text-xl text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                        <span className="bg-gradient-to-r from-[#d4af37] to-amber-500 bg-clip-text text-transparent">Commander une carte</span>
                      </h3>

                      {/* Type */}
                      <div>
                        <label className="text-gray-400 text-xs block mb-2 tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>TYPE</label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['virtual', 'physical'] as const).map(type => (
                            <button
                              key={type}
                              onClick={() => setCreateForm(f => ({ ...f, type }))}
                              className={`p-3 rounded-xl border text-sm text-center transition-all ${
                                createForm.type === type
                                  ? 'border-[#d4af37]/50 bg-[#d4af37]/10 text-[#d4af37]'
                                  : 'border-slate-800/50 bg-white/[0.01] text-gray-400 hover:border-slate-700'
                              }`}
                              style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                              {type === 'virtual' ? '⚡ Virtuelle' : '💳 Physique'}
                              <span className="block text-[10px] mt-1 opacity-60">
                                {type === 'virtual' ? 'Gratuite, instant' : `${CARDIX_FEES.cardCreation.physical}€, 5-7j`}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tier */}
                      <div>
                        <label className="text-gray-400 text-xs block mb-2 tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>TIER</label>
                        <div className="space-y-2">
                          {(['standard', 'premium', 'black'] as const).map(tier => {
                            const details = CARDIX_TIER_DETAILS[tier];
                            return (
                              <button
                                key={tier}
                                onClick={() => setCreateForm(f => ({ ...f, tier }))}
                                className={`w-full p-3 rounded-xl border text-left transition-all ${
                                  createForm.tier === tier
                                    ? 'border-[#d4af37]/50 bg-[#d4af37]/10'
                                    : 'border-slate-800/50 bg-white/[0.01] hover:border-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-white/90 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                    {tier === 'black' ? '👑' : tier === 'premium' ? '⭐' : '💳'} {details.name}
                                  </span>
                                  <span className="text-[#d4af37] text-xs">{details.cashback}% cashback</span>
                                </div>
                                <p className="text-gray-500 text-[10px] mt-1">
                                  Limite: {CARDIX_LIMITS.daily[tier].toLocaleString()}€/jour &bull; {CARDIX_FEES.monthlyMaintenance[tier] === 0 ? 'Gratuit' : `${CARDIX_FEES.monthlyMaintenance[tier]}€/mois`}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Currency */}
                      <div>
                        <label className="text-gray-400 text-xs block mb-2 tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>DEVISE</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['EUR', 'USD', 'GBP'] as const).map(curr => (
                            <button
                              key={curr}
                              onClick={() => setCreateForm(f => ({ ...f, currency: curr }))}
                              className={`p-2 rounded-lg border text-sm text-center transition-all ${
                                createForm.currency === curr
                                  ? 'border-[#d4af37]/50 bg-[#d4af37]/10 text-[#d4af37]'
                                  : 'border-slate-800/50 text-gray-400 hover:border-slate-700'
                              }`}
                              style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                              {curr}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Funding source */}
                      <div>
                        <label className="text-gray-400 text-xs block mb-2 tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>CRYPTO SOURCE</label>
                        <div className="grid grid-cols-3 gap-2">
                          {SUPPORTED_CRYPTOS.map(crypto => (
                            <button
                              key={crypto.id}
                              onClick={() => setCreateForm(f => ({ ...f, fundingSource: crypto.id as any }))}
                              className={`p-2 rounded-lg border text-center transition-all ${
                                createForm.fundingSource === crypto.id
                                  ? 'border-[#d4af37]/50 bg-[#d4af37]/10'
                                  : 'border-slate-800/50 hover:border-slate-700'
                              }`}
                            >
                              <span className="text-lg" style={{ color: crypto.color }}>{crypto.icon}</span>
                              <span className="block text-[10px] text-gray-400 mt-0.5">{crypto.symbol}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Personal info */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-gray-400 text-xs block mb-2 tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>PRÉNOM</label>
                          <input
                            type="text"
                            value={createForm.holderFirstName || ''}
                            onChange={(e) => setCreateForm(f => ({ ...f, holderFirstName: e.target.value }))}
                            className="w-full bg-white/[0.03] border border-slate-800/50 rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#d4af37]/50 focus:outline-none transition-colors"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="text-gray-400 text-xs block mb-2 tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>NOM</label>
                          <input
                            type="text"
                            value={createForm.holderLastName || ''}
                            onChange={(e) => setCreateForm(f => ({ ...f, holderLastName: e.target.value }))}
                            className="w-full bg-white/[0.03] border border-slate-800/50 rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#d4af37]/50 focus:outline-none transition-colors"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs block mb-2 tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>EMAIL</label>
                        <input
                          type="email"
                          value={createForm.email || ''}
                          onChange={(e) => setCreateForm(f => ({ ...f, email: e.target.value }))}
                          className="w-full bg-white/[0.03] border border-slate-800/50 rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#d4af37]/50 focus:outline-none transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>

                      <button
                        onClick={handleCreateCard}
                        disabled={isCreating || !createForm.holderFirstName || !createForm.holderLastName || !createForm.email}
                        className="w-full bg-gradient-to-r from-[#d4af37] to-amber-600 text-black py-3 rounded-xl text-sm hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {isCreating ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Création en cours...</>
                        ) : (
                          <><CreditCard className="w-4 h-4" /> Commander via Cardix</>
                        )}
                      </button>
                    </div>

                    {/* Tier comparison */}
                    <div className="space-y-4">
                      {(['standard', 'premium', 'black'] as const).map(tier => {
                        const details = CARDIX_TIER_DETAILS[tier];
                        const isSelected = createForm.tier === tier;
                        return (
                          <div
                            key={tier}
                            className={`bg-white/[0.02] backdrop-blur-xl border rounded-2xl p-5 transition-all ${
                              isSelected ? 'border-[#d4af37]/40 ring-1 ring-[#d4af37]/20' : 'border-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                                {tier === 'black' && <Crown className="w-4 h-4 text-[#d4af37] inline mr-2" />}
                                {details.name}
                              </h4>
                              <span className="text-[#d4af37] text-sm">{details.cashback}%</span>
                            </div>
                            <div className="space-y-1.5">
                              {details.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400/60 flex-shrink-0" />
                                  <span style={{ fontFamily: 'Montserrat, sans-serif' }}>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Top-Up View ───────────────────────────────────── */}
            {activeView === 'topup' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white/[0.02] backdrop-blur-xl border border-[#d4af37]/15 rounded-2xl p-6 space-y-6">
                  <h3 className="text-xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                    <span className="bg-gradient-to-r from-[#d4af37] to-amber-500 bg-clip-text text-transparent">
                      Recharger une carte
                    </span>
                  </h3>

                  {/* Select card */}
                  <div>
                    <label className="text-gray-400 text-xs block mb-2 tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>CARTE</label>
                    <div className="space-y-2">
                      {cards.map(card => (
                        <button
                          key={card.id}
                          onClick={() => setTopUpCardId(card.id)}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                            topUpCardId === card.id
                              ? 'border-[#d4af37]/50 bg-[#d4af37]/10'
                              : 'border-slate-800/50 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-[#d4af37]/60" />
                            <div>
                              <span className="text-white/90 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{card.label}</span>
                              <span className="text-gray-500 text-xs ml-2 font-mono">{card.last4}</span>
                            </div>
                          </div>
                          <span className="text-[#d4af37] text-sm">{card.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {card.currency}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="text-gray-400 text-xs block mb-2 tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>MONTANT (EUR)</label>
                    <input
                      type="number"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      className="w-full bg-white/[0.03] border border-slate-800/50 rounded-lg px-4 py-3 text-white text-lg focus:border-[#d4af37]/50 focus:outline-none transition-colors"
                      min={CARDIX_LIMITS.topUp.min}
                      max={CARDIX_LIMITS.topUp.max}
                    />
                    <div className="flex gap-2 mt-2">
                      {[50, 100, 250, 500, 1000, 5000].map(amount => (
                        <button
                          key={amount}
                          onClick={() => setTopUpAmount(String(amount))}
                          className={`px-3 py-1 rounded-lg text-xs transition-all ${
                            topUpAmount === String(amount)
                              ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30'
                              : 'bg-white/[0.03] text-gray-500 border border-slate-800/50 hover:border-slate-700'
                          }`}
                        >
                          {amount}€
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Crypto source */}
                  <div>
                    <label className="text-gray-400 text-xs block mb-2 tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>PAYER AVEC</label>
                    <div className="grid grid-cols-3 gap-2">
                      {SUPPORTED_CRYPTOS.map(crypto => (
                        <button
                          key={crypto.id}
                          onClick={() => setTopUpCrypto(crypto.id)}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            topUpCrypto === crypto.id
                              ? 'border-[#d4af37]/50 bg-[#d4af37]/10'
                              : 'border-slate-800/50 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-xl" style={{ color: crypto.color }}>{crypto.icon}</span>
                          <p className="text-white/80 text-xs mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{crypto.symbol}</p>
                          <p className="text-gray-600 text-[10px]">{crypto.network}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fee info */}
                  <div className="bg-slate-900/50 border border-slate-800/30 rounded-xl p-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Montant</span>
                      <span className="text-white/80">{parseFloat(topUpAmount || '0').toLocaleString('fr-FR', { minimumFractionDigits: 2 })} EUR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Frais Cardix ({CARDIX_FEES.topUp.percentage}%)</span>
                      <span className="text-amber-400">-{Math.max(parseFloat(topUpAmount || '0') * CARDIX_FEES.topUp.percentage / 100, CARDIX_FEES.topUp.minFee).toFixed(2)} EUR</span>
                    </div>
                    <div className="border-t border-slate-800/50 pt-2 flex justify-between">
                      <span className="text-gray-400">Crédit sur carte</span>
                      <span className="text-[#d4af37]">
                        {(parseFloat(topUpAmount || '0') - Math.max(parseFloat(topUpAmount || '0') * CARDIX_FEES.topUp.percentage / 100, CARDIX_FEES.topUp.minFee)).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} EUR
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleTopUp}
                    disabled={isTopingUp || !topUpCardId || parseFloat(topUpAmount || '0') < CARDIX_LIMITS.topUp.min}
                    className="w-full bg-gradient-to-r from-[#d4af37] to-amber-600 text-black py-3 rounded-xl text-sm hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {isTopingUp ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Traitement en cours...</>
                    ) : (
                      <><ArrowUpCircle className="w-4 h-4" /> Recharger via Cardix</>
                    )}
                  </button>

                  {topUpResult && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 mb-2">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Recharge effectuée</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between"><span className="text-gray-500">ID</span><span className="text-white/70 font-mono">{topUpResult.id}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Montant crypto</span><span className="text-white/70">{topUpResult.cryptoAmount.toFixed(6)} {topUpResult.cryptoCurrency}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Taux</span><span className="text-white/70">1 {topUpResult.cryptoCurrency} = {topUpResult.exchangeRate.toLocaleString()} EUR</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Frais</span><span className="text-amber-400">{topUpResult.fee.toFixed(2)} EUR</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Transactions View ─────────────────────────────── */}
            {activeView === 'transactions' && (
              <div className="bg-white/[0.02] backdrop-blur-xl border border-[#d4af37]/15 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800/50 flex items-center justify-between">
                  <h3 className="text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Toutes les transactions
                  </h3>
                  <span className="text-gray-500 text-xs">{transactions.length} transactions</span>
                </div>
                <div className="divide-y divide-slate-800/30">
                  {transactions.map(tx => (
                    <TransactionRow key={tx.id} tx={tx} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Cardix Partner Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#d4af37]/5 via-[#d4af37]/10 to-[#d4af37]/5 border border-[#d4af37]/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37] to-amber-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-black" />
            </div>
            <div>
              <p className="text-white text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Partenaire officiel <span className="text-[#d4af37]">Cardix</span>
              </p>
              <p className="text-gray-500 text-xs" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Code partenaire: <span className="text-[#d4af37] font-mono">NKFDRXGE</span> &bull; Carte virtuelle gratuite &bull; Jusqu'à 5% de cashback crypto
              </p>
            </div>
          </div>
          <a
            href={cardixAPI.getPartnerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#d4af37] to-amber-600 text-black px-6 py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all flex items-center gap-2 whitespace-nowrap"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <ExternalLink className="w-4 h-4" />
            Visiter Cardix.me
          </a>
        </div>
      </div>
    </section>
  );
}

export default CardixIntegration;
