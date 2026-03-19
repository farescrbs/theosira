import { useState, useEffect } from "react";
import { Shield, Lock, Key, FileText, StickyNote, Star, Plus, Search, Trash2, Eye, EyeOff, Copy, Check, Crown, Clock, Database, Users, CheckCircle, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  getVaultItems,
  getVaultStats,
  getVaultPlans,
  addVaultItem,
  deleteVaultItem,
  toggleVaultFavorite,
  subscribeToPlan,
  getVaultMetrics,
  type VaultItem,
  type VaultPlan,
} from "../services/vaultAPI";
import { UniversalConnection } from "./UniversalConnectionSimple";
import { PaymentManager } from "./PaymentManager";

const typeIcons = {
  seed: Key,
  private_key: Lock,
  password: Shield,
  document: FileText,
  note: StickyNote,
};

const typeColors = {
  seed: 'text-[#d4af37] bg-[#d4af37]/10 border-[#d4af37]/30',
  private_key: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  password: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  document: 'text-green-400 bg-green-400/10 border-green-400/30',
  note: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
};

export function VaultSection() {
  const [activeTab, setActiveTab] = useState("vault");
  const [items, setItems] = useState<VaultItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<VaultPlan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [copied, setCopied] = useState(false);

  const [newItemType, setNewItemType] = useState<'seed' | 'private_key' | 'password' | 'document' | 'note'>('seed');
  const [newItemName, setNewItemName] = useState("");
  const [newItemContent, setNewItemContent] = useState("");
  const [newItemTags, setNewItemTags] = useState("");

  const plans = getVaultPlans();
  const metrics = getVaultMetrics();

  useEffect(() => {
    const loadData = async () => {
      const vaultItems = await getVaultItems();
      const vaultStats = await getVaultStats();
      setItems(vaultItems);
      setStats(vaultStats);
    };
    loadData();
  }, []);

  const handleAddItem = async () => {
    setIsAdding(true);
    
    try {
      const newItem = await addVaultItem({
        type: newItemType,
        name: newItemName,
        content: newItemContent,
        encrypted: true,
        tags: newItemTags.split(',').map(t => t.trim()).filter(Boolean),
        favorite: false,
      });
      
      setItems([...items, newItem]);
      
      setTimeout(() => {
        setIsAdding(false);
        setShowAddDialog(false);
        setNewItemName("");
        setNewItemContent("");
        setNewItemTags("");
      }, 1500);
    } catch (error) {
      setIsAdding(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    await deleteVaultItem(id);
    setItems(items.filter(item => item.id !== id));
    setShowViewDialog(false);
  };

  const handleToggleFavorite = async (id: string) => {
    const updated = await toggleVaultFavorite(id);
    if (updated) {
      setItems(items.map(item => item.id === id ? updated : item));
    }
  };

  const handleCopyContent = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribe = async (plan: VaultPlan) => {
    setSelectedPlan(plan);
    setShowSubscribeDialog(true);
  };

  const confirmSubscription = async () => {
    if (!selectedPlan) return;
    
    setIsSubscribing(true);
    
    try {
      await subscribeToPlan(selectedPlan.id);
      
      setTimeout(() => {
        setIsSubscribing(false);
        setShowSubscribeDialog(false);
      }, 2500);
    } catch (error) {
      setIsSubscribing(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const favoriteItems = items.filter(item => item.favorite);

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a1a1a] to-black" />
        <div className="absolute top-1/4 left-1/4 w-[950px] h-[950px] bg-[#d4af37]/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[850px] h-[850px] bg-[#f0e68c]/10 rounded-full blur-[200px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <div className="px-6 py-2 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/5 backdrop-blur-sm">
              <span className="text-[#d4af37] tracking-[0.3em] text-xs" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                SECURE VAULT
              </span>
            </div>
          </div>

          <h2 
            className="text-[3rem] md:text-[4rem] lg:text-[5rem] mb-6 text-[#d4af37] tracking-tight leading-[1.1]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
          >
            Coffre-Fort Cloud
          </h2>
          
          <p 
            className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
          >
            Stockage ultra-sécurisé pour vos clés, seeds et documents. Encryption militaire. Abonnement à vie.
          </p>

          <Button
            onClick={() => setActiveTab("plans")}
            className="bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity px-8 py-6 text-base"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
          >
            <Crown className="mr-2 w-5 h-5" />
            Voir les Plans
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Users className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p className="text-3xl text-[#d4af37] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {(metrics.totalUsers / 1000).toFixed(1)}K
            </p>
            <p className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Utilisateurs Sécurisés
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Database className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p className="text-3xl text-[#d4af37] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {metrics.totalStorage.toFixed(0)} TB
            </p>
            <p className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Données Cryptées
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Shield className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p className="text-3xl text-[#d4af37] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {stats?.securityScore || 98}%
            </p>
            <p className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Score Sécurité
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Award className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p className="text-3xl text-[#d4af37] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {metrics.plansAvailable}
            </p>
            <p className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Plans Lifetime
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/[0.02] border border-[#d4af37]/20 rounded-2xl p-2 mb-8">
            <TabsTrigger 
              value="vault"
              className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <Lock className="w-4 h-4 mr-2" />
              Mon Coffre
            </TabsTrigger>
            <TabsTrigger 
              value="favorites"
              className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <Star className="w-4 h-4 mr-2" />
              Favoris
            </TabsTrigger>
            <TabsTrigger 
              value="plans"
              className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <Crown className="w-4 h-4 mr-2" />
              Plans Lifetime
            </TabsTrigger>
          </TabsList>

          {/* Vault Tab */}
          <TabsContent value="vault" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
              <div className="flex-1 relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]/40 w-5 h-5" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher dans le coffre..."
                  className="pl-12 h-12 rounded-xl border border-[#d4af37]/20 bg-white/[0.02] text-white placeholder:text-white/30 focus:border-[#d4af37]/40"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
              >
                <Plus className="mr-2 w-4 h-4" />
                Ajouter un Item
              </Button>
            </div>

            {stats && (
              <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                    Stockage Utilisé
                  </span>
                  <span className="text-[#d4af37]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                    {stats.usedStorage} GB / {stats.maxStorage} GB
                  </span>
                </div>
                <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(stats.usedStorage / stats.maxStorage) * 100}%` }}
                    className="h-full bg-gradient-to-r from-[#d4af37] to-[#f0e68c] transition-all"
                  />
                </div>
                <div className="flex items-center justify-between mt-3 text-sm text-white/60">
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {stats.totalItems} items stockés
                  </span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {stats.encryptedItems} cryptés
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const Icon = typeIcons[item.type];
                return (
                  <div
                    key={item.id}
                    onClick={() => { setSelectedItem(item); setShowViewDialog(true); }}
                    className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 hover:border-[#d4af37]/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${typeColors[item.type]} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(item.id);
                        }}
                        className="transition-transform hover:scale-110"
                      >
                        <Star className={`w-5 h-5 ${item.favorite ? 'text-[#d4af37] fill-[#d4af37]' : 'text-white/40'}`} />
                      </button>
                    </div>

                    <h4 className="text-white text-lg mb-2 truncate" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      {item.name}
                    </h4>

                    <p className="text-white/40 text-sm mb-4 truncate font-mono" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {item.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {item.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs text-white/60 border-white/20">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {item.encrypted && (
                        <Lock className="w-4 h-4 text-[#d4af37]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-20">
                <Lock className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 text-lg mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Aucun item trouvé
                </p>
              </div>
            )}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <div className="mb-8">
              <h3 className="text-white text-xl mb-6" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                Moyens de Paiement
              </h3>
              <PaymentManager />
            </div>

            <div className="mb-8">
              <h3 className="text-white text-xl mb-6" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                Connexion Universelle
              </h3>
              <UniversalConnection />
            </div>

            <div>
              <h3 className="text-white text-xl mb-6" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                Items Favoris
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteItems.map((item) => {
                  const Icon = typeIcons[item.type];
                  return (
                    <div
                      key={item.id}
                      onClick={() => { setSelectedItem(item); setShowViewDialog(true); }}
                      className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 hover:border-[#d4af37]/40 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl ${typeColors[item.type]} flex items-center justify-center`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <Star className="w-5 h-5 text-[#d4af37] fill-[#d4af37]" />
                      </div>

                      <h4 className="text-white text-lg mb-2 truncate" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                        {item.name}
                      </h4>

                      <p className="text-white/40 text-sm mb-4 truncate font-mono" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {item.content}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {item.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs text-white/60 border-white/20">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {favoriteItems.length === 0 && (
                <div className="text-center py-20">
                  <Star className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 text-lg mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Aucun favori pour le moment
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl border ${plan.popular ? 'border-[#d4af37]/60 shadow-2xl shadow-[#d4af37]/20' : 'border-[#d4af37]/20'} bg-white/[0.02] backdrop-blur-xl p-8 relative overflow-hidden hover:scale-105 transition-transform`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black text-sm" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      POPULAIRE
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl text-white mb-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl text-[#d4af37]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        ${plan.price}
                      </span>
                      <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        une fois
                      </span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Accès à Vie
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                        <span className="text-white/80 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleSubscribe(plan)}
                    className={`w-full h-12 ${plan.popular ? 'bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black' : 'border border-[#d4af37]/30 bg-white/[0.02] text-white hover:bg-white/[0.05]'}`}
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                  >
                    Choisir ce Plan
                  </Button>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-8">
              <h3 className="text-2xl text-[#d4af37] mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                Sécurité de Niveau Militaire
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-[#d4af37] mx-auto mb-4" />
                  <h4 className="text-white text-lg mb-2" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                    Encryption
                  </h4>
                  <p className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    AES-256 à Quantum-Safe selon votre plan
                  </p>
                </div>

                <div className="text-center">
                  <Database className="w-12 h-12 text-[#d4af37] mx-auto mb-4" />
                  <h4 className="text-white text-lg mb-2" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                    Backup Automatique
                  </h4>
                  <p className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Sauvegarde multi-datacenter géo-redondante
                  </p>
                </div>

                <div className="text-center">
                  <Clock className="w-12 h-12 text-[#d4af37] mx-auto mb-4" />
                  <h4 className="text-white text-lg mb-2" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                    Disponibilité 99.99%
                  </h4>
                  <p className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Infrastructure redondante et haute disponibilité
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl text-[#d4af37]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ajouter un Item Sécurisé
            </DialogTitle>
            <DialogDescription className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Stockez vos données sensibles avec encryption militaire
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            <div>
              <label className="text-white mb-3 block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                Type d'Item
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {(['seed', 'private_key', 'password', 'document', 'note'] as const).map((type) => {
                  const Icon = typeIcons[type];
                  return (
                    <button
                      key={type}
                      onClick={() => setNewItemType(type)}
                      className={`p-4 rounded-xl border transition-all ${
                        newItemType === type ? typeColors[type] : 'border-[#d4af37]/20 bg-white/[0.02] hover:border-[#d4af37]/40'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-xs text-white text-center capitalize" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {type.replace('_', ' ')}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-white mb-2 block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                Nom
              </label>
              <Input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="ex: MetaMask Wallet"
                className="h-12 bg-white/[0.02] border-[#d4af37]/20 text-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>

            <div>
              <label className="text-white mb-2 block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                Contenu
              </label>
              <textarea
                value={newItemContent}
                onChange={(e) => setNewItemContent(e.target.value)}
                placeholder="Entrez votre contenu sensible..."
                rows={4}
                className="w-full p-4 rounded-xl border border-[#d4af37]/20 bg-white/[0.02] text-white placeholder:text-white/30 focus:border-[#d4af37]/40 focus:outline-none resize-none font-mono"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>

            <div>
              <label className="text-white mb-2 block" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                Tags (séparés par des virgules)
              </label>
              <Input
                type="text"
                value={newItemTags}
                onChange={(e) => setNewItemTags(e.target.value)}
                placeholder="ex: wallet, ethereum, backup"
                className="h-12 bg-white/[0.02] border-[#d4af37]/20 text-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>

            <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-400 text-sm mb-1" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                    Sécurité Garantie
                  </p>
                  <p className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Vos données seront cryptées avec AES-256 avant stockage. Seul vous pourrez les déchiffrer.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleAddItem}
              disabled={!newItemName || !newItemContent || isAdding}
              className="w-full h-14 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              {isAdding ? 'Sécurisation en cours...' : 'Ajouter au Coffre'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl text-[#d4af37]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {selectedItem?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <Badge className={typeColors[selectedItem.type]}>
                  {selectedItem.type.replace('_', ' ').toUpperCase()}
                </Badge>
                <button
                  onClick={() => handleToggleFavorite(selectedItem.id)}
                  className="transition-transform hover:scale-110"
                >
                  <Star className={`w-6 h-6 ${selectedItem.favorite ? 'text-[#d4af37] fill-[#d4af37]' : 'text-white/40'}`} />
                </button>
              </div>

              <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Contenu {selectedItem.encrypted && '(Crypté)'}
                  </label>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setShowContent(!showContent)} className="border-[#d4af37]/20 bg-white/[0.02]">
                      {showContent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCopyContent} className="border-[#d4af37]/20 bg-white/[0.02]">
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <p className="text-white font-mono break-all" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {showContent ? selectedItem.content : selectedItem.content}
                </p>
              </div>

              <div>
                <label className="text-white/60 text-sm mb-2 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-white/60 border-white/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/5 p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/60 mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Créé le
                    </p>
                    <p className="text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {new Date(selectedItem.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Dernier accès
                    </p>
                    <p className="text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {new Date(selectedItem.lastAccessed).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleDeleteItem(selectedItem.id)}
                  variant="outline"
                  className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  <Trash2 className="mr-2 w-4 h-4" />
                  Supprimer
                </Button>
                <Button
                  onClick={() => setShowViewDialog(false)}
                  className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showSubscribeDialog} onOpenChange={setShowSubscribeDialog}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-3xl text-[#d4af37]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Confirmer l'Abonnement
            </DialogTitle>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-6 mt-6">
              <div className="text-center">
                <h3 className="text-2xl text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {selectedPlan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-6xl text-[#d4af37]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    ${selectedPlan.price}
                  </span>
                  <span className="text-white/60 text-xl" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    paiement unique
                  </span>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-lg px-4 py-2">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Accès à Vie Garanti
                </Badge>
              </div>

              <div className="rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/5 p-6">
                <h4 className="text-[#d4af37] mb-4" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                  Fonctionnalités Incluses
                </h4>
                <div className="space-y-2">
                  {selectedPlan.features.slice(0, 5).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                  {selectedPlan.features.length > 5 && (
                    <p className="text-white/60 text-sm mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      + {selectedPlan.features.length - 5} autres fonctionnalités...
                    </p>
                  )}
                </div>
              </div>

              <Button
                onClick={confirmSubscription}
                disabled={isSubscribing}
                className="w-full h-14 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
              >
                {isSubscribing ? 'Traitement en cours...' : 'Confirmer l\'Abonnement à Vie'}
              </Button>

              <p className="text-center text-white/40 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Paiement sécurisé. Garantie satisfait ou remboursé 30 jours.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}