import { useState } from "react";
import { CreditCard, Wallet, Smartphone, Trash2, Plus, CheckCircle, Shield, DollarSign, Bitcoin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  getPaymentCards,
  getCryptoWallets,
  getMobilePayments,
  getTransactions,
  addPaymentCard,
  addCryptoWallet,
  addMobilePayment,
  removePaymentCard,
  removeCryptoWallet,
  removeMobilePayment,
  setDefaultCard,
  setDefaultWallet,
  setDefaultMobilePayment,
  getPaymentStats,
  type PaymentCard,
  type CryptoWallet,
  type MobilePayment,
} from "../services/paymentAPI";

const cardBrands = {
  visa: { name: 'Visa', color: 'bg-blue-500', icon: '💳' },
  mastercard: { name: 'Mastercard', color: 'bg-orange-500', icon: '💳' },
  amex: { name: 'American Express', color: 'bg-green-500', icon: '💳' },
  discover: { name: 'Discover', color: 'bg-purple-500', icon: '💳' },
};

const cryptoTypes = {
  btc: { name: 'Bitcoin', symbol: 'BTC', icon: '₿', color: 'text-orange-400' },
  eth: { name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', color: 'text-blue-400' },
  usdt: { name: 'Tether', symbol: 'USDT', icon: '₮', color: 'text-green-400' },
  usdc: { name: 'USD Coin', symbol: 'USDC', icon: '$', color: 'text-blue-500' },
  bnb: { name: 'BNB', symbol: 'BNB', icon: '💎', color: 'text-yellow-400' },
  sol: { name: 'Solana', symbol: 'SOL', icon: '◎', color: 'text-purple-400' },
};

const mobileTypes = {
  apple_pay: { name: 'Apple Pay', icon: '🍎', color: 'text-white' },
  google_pay: { name: 'Google Pay', icon: '🔴', color: 'text-blue-400' },
  samsung_pay: { name: 'Samsung Pay', icon: '📱', color: 'text-blue-500' },
  paypal: { name: 'PayPal', icon: '💙', color: 'text-blue-600' },
};

export function PaymentManager() {
  const [activeTab, setActiveTab] = useState("cards");
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  const [showAddWalletDialog, setShowAddWalletDialog] = useState(false);
  const [showAddMobileDialog, setShowAddMobileDialog] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Card form
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");

  // Wallet form
  const [walletType, setWalletType] = useState<'btc' | 'eth' | 'usdt' | 'usdc' | 'bnb' | 'sol'>('eth');
  const [walletAddress, setWalletAddress] = useState("");

  // Mobile payment form
  const [mobileType, setMobileType] = useState<'apple_pay' | 'google_pay' | 'samsung_pay' | 'paypal'>('apple_pay');
  const [mobileEmail, setMobileEmail] = useState("");

  const cards = getPaymentCards();
  const wallets = getCryptoWallets();
  const mobilePayments = getMobilePayments();
  const transactions = getTransactions();
  const stats = getPaymentStats();

  const handleAddCard = async () => {
    setIsAdding(true);
    
    try {
      const cardType = cardNumber.startsWith('4') ? 'visa' : 
                       cardNumber.startsWith('5') ? 'mastercard' : 
                       cardNumber.startsWith('3') ? 'amex' : 'discover';
      
      await addPaymentCard({
        type: cardType,
        last4: cardNumber.slice(-4),
        expiryMonth,
        expiryYear,
        holderName: cardHolder,
        isDefault: cards.length === 0,
      });
      
      setTimeout(() => {
        setIsAdding(false);
        setShowAddCardDialog(false);
        setCardNumber("");
        setCardHolder("");
        setExpiryMonth("");
        setExpiryYear("");
        setCvv("");
      }, 2000);
    } catch (error) {
      setIsAdding(false);
    }
  };

  const handleAddWallet = async () => {
    setIsAdding(true);
    
    try {
      await addCryptoWallet({
        type: walletType,
        address: walletAddress,
        balance: 0,
        network: cryptoTypes[walletType].name,
        isDefault: wallets.length === 0,
      });
      
      setTimeout(() => {
        setIsAdding(false);
        setShowAddWalletDialog(false);
        setWalletAddress("");
      }, 2000);
    } catch (error) {
      setIsAdding(false);
    }
  };

  const handleAddMobile = async () => {
    setIsAdding(true);
    
    try {
      await addMobilePayment({
        type: mobileType,
        email: mobileEmail,
        isDefault: mobilePayments.length === 0,
      });
      
      setTimeout(() => {
        setIsAdding(false);
        setShowAddMobileDialog(false);
        setMobileEmail("");
      }, 2000);
    } catch (error) {
      setIsAdding(false);
    }
  };

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-4 text-center">
          <CreditCard className="w-6 h-6 text-[#d4af37] mx-auto mb-2" />
          <p className="text-2xl text-[#d4af37] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            {stats.totalCards}
          </p>
          <p className="text-white/60 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Cartes Bancaires
          </p>
        </div>

        <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-4 text-center">
          <Bitcoin className="w-6 h-6 text-[#d4af37] mx-auto mb-2" />
          <p className="text-2xl text-[#d4af37] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            {stats.totalWallets}
          </p>
          <p className="text-white/60 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Wallets Crypto
          </p>
        </div>

        <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-4 text-center">
          <Smartphone className="w-6 h-6 text-[#d4af37] mx-auto mb-2" />
          <p className="text-2xl text-[#d4af37] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            {stats.totalMobilePayments}
          </p>
          <p className="text-white/60 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Paiements Mobile
          </p>
        </div>

        <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-4 text-center">
          <DollarSign className="w-6 h-6 text-[#d4af37] mx-auto mb-2" />
          <p className="text-2xl text-[#d4af37] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            ${stats.totalSpent}
          </p>
          <p className="text-white/60 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Total Dépensé
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/[0.02] border border-[#d4af37]/20 rounded-2xl p-2 mb-8">
          <TabsTrigger 
            value="cards"
            className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Cartes
          </TabsTrigger>
          <TabsTrigger 
            value="wallets"
            className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
          >
            <Wallet className="w-4 h-4 mr-2" />
            Crypto
          </TabsTrigger>
          <TabsTrigger 
            value="mobile"
            className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
          >
            <Shield className="w-4 h-4 mr-2" />
            Historique
          </TabsTrigger>
        </TabsList>

        {/* Cards Tab */}
        <TabsContent value="cards" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white text-lg" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
              Cartes Bancaires
            </h3>
            <Button
              onClick={() => setShowAddCardDialog(true)}
              className="bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <Plus className="mr-2 w-4 h-4" />
              Ajouter une Carte
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card) => {
              const brand = cardBrands[card.type];
              return (
                <div
                  key={card.id}
                  className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 ${brand.color} opacity-10 rounded-full -mr-16 -mt-16`} />
                  
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-3xl">{brand.icon}</span>
                    {card.isDefault && (
                      <Badge className="bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30">
                        Par Défaut
                      </Badge>
                    )}
                  </div>

                  <p className="text-white/60 text-sm mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {brand.name}
                  </p>
                  <p className="text-white text-2xl mb-4 font-mono">
                    •••• •••• •••• {card.last4}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white/40 text-xs mb-1">Titulaire</p>
                      <p className="text-white text-sm" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                        {card.holderName}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-1">Expire</p>
                      <p className="text-white text-sm font-mono">
                        {card.expiryMonth}/{card.expiryYear}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!card.isDefault && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDefaultCard(card.id)}
                        className="flex-1 text-xs border-[#d4af37]/20"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        Par Défaut
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removePaymentCard(card.id)}
                      className="flex-1 text-xs border-red-500/30 text-red-400"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Retirer
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Wallets Tab */}
        <TabsContent value="wallets" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white text-lg" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
              Wallets Crypto
            </h3>
            <Button
              onClick={() => setShowAddWalletDialog(true)}
              className="bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <Plus className="mr-2 w-4 h-4" />
              Ajouter un Wallet
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wallets.map((wallet) => {
              const crypto = cryptoTypes[wallet.type];
              return (
                <div
                  key={wallet.id}
                  className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-3xl ${crypto.color}`}>{crypto.icon}</span>
                      <div>
                        <p className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                          {crypto.name}
                        </p>
                        <p className="text-white/60 text-sm">{wallet.network}</p>
                      </div>
                    </div>
                    {wallet.isDefault && (
                      <Badge className="bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30">
                        Par Défaut
                      </Badge>
                    )}
                  </div>

                  <p className="text-white/40 text-xs mb-1">Adresse</p>
                  <p className="text-white text-sm font-mono mb-4 break-all">
                    {wallet.address.slice(0, 12)}...{wallet.address.slice(-8)}
                  </p>

                  <div className="rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/5 p-3 mb-4">
                    <p className="text-white/60 text-xs mb-1">Solde</p>
                    <p className={`text-2xl ${crypto.color}`} style={{ fontFamily: "'Playfair Display', serif" }}>
                      {wallet.balance} {crypto.symbol}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {!wallet.isDefault && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDefaultWallet(wallet.id)}
                        className="flex-1 text-xs border-[#d4af37]/20"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        Par Défaut
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeCryptoWallet(wallet.id)}
                      className="flex-1 text-xs border-red-500/30 text-red-400"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Retirer
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Mobile Tab */}
        <TabsContent value="mobile" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white text-lg" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
              Paiements Mobile
            </h3>
            <Button
              onClick={() => setShowAddMobileDialog(true)}
              className="bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <Plus className="mr-2 w-4 h-4" />
              Ajouter un Moyen
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mobilePayments.map((payment) => {
              const mobile = mobileTypes[payment.type];
              return (
                <div
                  key={payment.id}
                  className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{mobile.icon}</span>
                      <div>
                        <p className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                          {mobile.name}
                        </p>
                        <p className="text-white/60 text-sm">{payment.email}</p>
                      </div>
                    </div>
                    {payment.isDefault && (
                      <Badge className="bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30">
                        Par Défaut
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {payment.verified && (
                      <Badge className="bg-green-400/20 text-green-400 border-green-400/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Vérifié
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {!payment.isDefault && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDefaultMobilePayment(payment.id)}
                        className="flex-1 text-xs border-[#d4af37]/20"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        Par Défaut
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeMobilePayment(payment.id)}
                      className="flex-1 text-xs border-red-500/30 text-red-400"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Retirer
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <h3 className="text-white text-lg mb-6" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
            Historique des Transactions
          </h3>

          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      {tx.description}
                    </p>
                    <p className="text-white/60 text-sm">{tx.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#d4af37]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {tx.amount} {tx.currency}
                    </p>
                    <Badge className={`text-xs ${
                      tx.status === 'completed' ? 'bg-green-400/20 text-green-400 border-green-400/30' :
                      tx.status === 'pending' ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30' :
                      'bg-red-400/20 text-red-400 border-red-400/30'
                    }`}>
                      {tx.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-white/40 text-xs">
                  {new Date(tx.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Card Dialog */}
      <Dialog open={showAddCardDialog} onOpenChange={setShowAddCardDialog}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#d4af37]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ajouter une Carte
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            <div>
              <label className="text-white mb-2 block text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Numéro de carte
              </label>
              <Input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                placeholder="4242 4242 4242 4242"
                maxLength={16}
                className="h-12 bg-white/[0.02] border-[#d4af37]/20 text-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>

            <div>
              <label className="text-white mb-2 block text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Titulaire
              </label>
              <Input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder="John Doe"
                className="h-12 bg-white/[0.02] border-[#d4af37]/20 text-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-white mb-2 block text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Mois
                </label>
                <Input
                  type="text"
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  placeholder="12"
                  maxLength={2}
                  className="h-12 bg-white/[0.02] border-[#d4af37]/20 text-white"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>
              <div>
                <label className="text-white mb-2 block text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Année
                </label>
                <Input
                  type="text"
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                  placeholder="2026"
                  maxLength={4}
                  className="h-12 bg-white/[0.02] border-[#d4af37]/20 text-white"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>
              <div>
                <label className="text-white mb-2 block text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  CVV
                </label>
                <Input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  maxLength={4}
                  className="h-12 bg-white/[0.02] border-[#d4af37]/20 text-white"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>
            </div>

            <Button
              onClick={handleAddCard}
              disabled={!cardNumber || !cardHolder || !expiryMonth || !expiryYear || !cvv || isAdding}
              className="w-full h-12 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 disabled:opacity-50"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              {isAdding ? 'Ajout en cours...' : 'Ajouter la Carte'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Wallet Dialog */}
      <Dialog open={showAddWalletDialog} onOpenChange={setShowAddWalletDialog}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#d4af37]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ajouter un Wallet
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            <div>
              <label className="text-white mb-2 block text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Type de Crypto
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(cryptoTypes) as Array<keyof typeof cryptoTypes>).map((type) => {
                  const crypto = cryptoTypes[type];
                  return (
                    <button
                      key={type}
                      onClick={() => setWalletType(type)}
                      className={`p-3 rounded-xl border transition-all ${
                        walletType === type
                          ? 'border-[#d4af37]/40 bg-[#d4af37]/10'
                          : 'border-[#d4af37]/20 bg-white/[0.02]'
                      }`}
                    >
                      <span className={`text-2xl ${crypto.color}`}>{crypto.icon}</span>
                      <p className="text-white text-xs mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {crypto.symbol}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-white mb-2 block text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Adresse du Wallet
              </label>
              <Input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="h-12 bg-white/[0.02] border-[#d4af37]/20 text-white font-mono"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>

            <Button
              onClick={handleAddWallet}
              disabled={!walletAddress || isAdding}
              className="w-full h-12 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 disabled:opacity-50"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              {isAdding ? 'Ajout en cours...' : 'Ajouter le Wallet'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Mobile Payment Dialog */}
      <Dialog open={showAddMobileDialog} onOpenChange={setShowAddMobileDialog}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#d4af37]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ajouter un Paiement Mobile
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            <div>
              <label className="text-white mb-2 block text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Type de Paiement
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(mobileTypes) as Array<keyof typeof mobileTypes>).map((type) => {
                  const mobile = mobileTypes[type];
                  return (
                    <button
                      key={type}
                      onClick={() => setMobileType(type)}
                      className={`p-4 rounded-xl border transition-all ${
                        mobileType === type
                          ? 'border-[#d4af37]/40 bg-[#d4af37]/10'
                          : 'border-[#d4af37]/20 bg-white/[0.02]'
                      }`}
                    >
                      <span className="text-3xl">{mobile.icon}</span>
                      <p className="text-white text-sm mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {mobile.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-white mb-2 block text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Email
              </label>
              <Input
                type="email"
                value={mobileEmail}
                onChange={(e) => setMobileEmail(e.target.value)}
                placeholder="user@example.com"
                className="h-12 bg-white/[0.02] border-[#d4af37]/20 text-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>

            <Button
              onClick={handleAddMobile}
              disabled={!mobileEmail || isAdding}
              className="w-full h-12 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 disabled:opacity-50"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              {isAdding ? 'Ajout en cours...' : 'Ajouter le Paiement'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}