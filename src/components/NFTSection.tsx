import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Sparkles, Image as ImageIcon, ShoppingCart, TrendingUp, Zap, Crown, Heart, Eye, Upload, Check, X, Filter, Search, Flame, Star, Grid3x3, List, Plus, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { fetchNFTsFromBlockchain, fetchCollectionsFromBlockchain, subscribeToMarketUpdates } from "../services/blockchainAPI";

interface NFT {
  id: string;
  name: string;
  image: string;
  collection: string;
  price: number;
  currency: string;
  creator: string;
  owner: string;
  likes: number;
  views: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  blockchain: string;
  verified: boolean;
}

interface Collection {
  id: string;
  name: string;
  image: string;
  floor: number;
  volume: number;
  items: number;
  owners: number;
  change24h: number;
  verified: boolean;
  featured: boolean;
}

const collections: Collection[] = [
  {
    id: '1',
    name: 'Luxury Yachts Collection',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400&h=400&fit=crop',
    floor: 125.5,
    volume: 45890,
    items: 10000,
    owners: 3420,
    change24h: 18.5,
    verified: true,
    featured: true
  },
  {
    id: '2',
    name: 'Premium Estates',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=400&fit=crop',
    floor: 89.9,
    volume: 32450,
    items: 5000,
    owners: 2105,
    change24h: -5.2,
    verified: true,
    featured: true
  },
  {
    id: '3',
    name: 'Gold Reserve NFTs',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=400&fit=crop',
    floor: 250.0,
    volume: 78920,
    items: 2500,
    owners: 1840,
    change24h: 25.8,
    verified: true,
    featured: true
  },
  {
    id: '4',
    name: 'Diamond Collection',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
    floor: 340.0,
    volume: 92350,
    items: 1000,
    owners: 890,
    change24h: 32.4,
    verified: true,
    featured: true
  },
  {
    id: '5',
    name: 'Art Masterpieces',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&h=400&fit=crop',
    floor: 45.0,
    volume: 18920,
    items: 8000,
    owners: 2890,
    change24h: 12.3,
    verified: true,
    featured: false
  },
  {
    id: '6',
    name: 'Elite Memberships',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=400&fit=crop',
    floor: 180.0,
    volume: 54320,
    items: 500,
    owners: 485,
    change24h: 8.9,
    verified: true,
    featured: false
  },
];

const nfts: NFT[] = [
  {
    id: '1',
    name: 'Prestige Yacht #001',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&h=600&fit=crop',
    collection: 'Luxury Yachts Collection',
    price: 125.5,
    currency: 'ETH',
    creator: '0x742d...0bEb',
    owner: '0x8Ba1...DBA72',
    likes: 342,
    views: 5420,
    rarity: 'Legendary',
    blockchain: 'Ethereum',
    verified: true
  },
  {
    id: '2',
    name: 'Golden Villa #042',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=600&fit=crop',
    collection: 'Premium Estates',
    price: 89.9,
    currency: 'ETH',
    creator: '0x123a...4def',
    owner: '0x456b...1abc',
    likes: 289,
    views: 4120,
    rarity: 'Epic',
    blockchain: 'Ethereum',
    verified: true
  },
  {
    id: '3',
    name: 'Gold Bar #777',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&h=600&fit=crop',
    collection: 'Gold Reserve NFTs',
    price: 250.0,
    currency: 'ETH',
    creator: '0xabc1...9xyz',
    owner: '0x789c...5def',
    likes: 567,
    views: 8920,
    rarity: 'Legendary',
    blockchain: 'Ethereum',
    verified: true
  },
  {
    id: '4',
    name: 'Diamond Crystal #013',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop',
    collection: 'Diamond Collection',
    price: 340.0,
    currency: 'ETH',
    creator: '0xdef2...8ghi',
    owner: '0xabc3...2def',
    likes: 689,
    views: 12340,
    rarity: 'Legendary',
    blockchain: 'Ethereum',
    verified: true
  },
  {
    id: '5',
    name: 'Abstract Art #256',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&h=600&fit=crop',
    collection: 'Art Masterpieces',
    price: 45.0,
    currency: 'ETH',
    creator: '0x999a...7bcd',
    owner: '0x111b...3efg',
    likes: 234,
    views: 3450,
    rarity: 'Rare',
    blockchain: 'Polygon',
    verified: false
  },
  {
    id: '6',
    name: 'VIP Pass #099',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=600&fit=crop',
    collection: 'Elite Memberships',
    price: 180.0,
    currency: 'ETH',
    creator: '0x222c...4hij',
    owner: '0x333d...5klm',
    likes: 456,
    views: 6780,
    rarity: 'Epic',
    blockchain: 'Ethereum',
    verified: true
  },
];

const myNFTs: NFT[] = [
  {
    id: 'my1',
    name: 'Prestige Yacht #042',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&h=600&fit=crop',
    collection: 'Luxury Yachts Collection',
    price: 125.5,
    currency: 'ETH',
    creator: '0x742d...0bEb',
    owner: 'You',
    likes: 298,
    views: 4820,
    rarity: 'Legendary',
    blockchain: 'Ethereum',
    verified: true
  },
  {
    id: 'my2',
    name: 'Gold Bar #123',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&h=600&fit=crop',
    collection: 'Gold Reserve NFTs',
    price: 250.0,
    currency: 'ETH',
    creator: '0xabc1...9xyz',
    owner: 'You',
    likes: 512,
    views: 8120,
    rarity: 'Legendary',
    blockchain: 'Ethereum',
    verified: true
  },
];

const rarityColors = {
  'Common': 'text-gray-400 border-gray-400/30',
  'Rare': 'text-blue-400 border-blue-400/30',
  'Epic': 'text-purple-400 border-purple-400/30',
  'Legendary': 'text-[#d4af37] border-[#d4af37]/30',
};

export function NFTSection() {
  const [activeTab, setActiveTab] = useState("marketplace");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreating, setIsCreating] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  // Create NFT Form State
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftPrice, setNftPrice] = useState("");
  const [nftBlockchain, setNftBlockchain] = useState("Ethereum");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleCreateNFT = () => {
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      setShowCreateDialog(false);
      setNftName("");
      setNftDescription("");
      setNftPrice("");
      setUploadedImage(null);
    }, 2500);
  };

  const handleBuyNFT = () => {
    setIsBuying(true);
    setTimeout(() => {
      setIsBuying(false);
      setShowBuyDialog(false);
    }, 2000);
  };

  const totalVolume = collections.reduce((sum, col) => sum + col.volume, 0);
  const totalItems = collections.reduce((sum, col) => sum + col.items, 0);
  const totalOwners = collections.reduce((sum, col) => sum + col.owners, 0);

  const filteredNFTs = nfts.filter(nft =>
    nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nft.collection.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredCollections = collections.filter(col => col.featured);

  useEffect(() => {
    // Fetch NFTs and Collections from Blockchain
    fetchNFTsFromBlockchain().then(data => {
      // Update NFTs state with fetched data
      // For demonstration, we're using the predefined nfts array
      // In a real-world scenario, you would update the state with the fetched data
      // setNFTs(data);
    });

    fetchCollectionsFromBlockchain().then(data => {
      // Update Collections state with fetched data
      // For demonstration, we're using the predefined collections array
      // In a real-world scenario, you would update the state with the fetched data
      // setCollections(data);
    });

    // Subscribe to market updates
    const unsubscribe = subscribeToMarketUpdates((update) => {
      // Handle market updates
      // For demonstration, we're logging the update
      console.log('Market Update:', update);
      // In a real-world scenario, you would update the state with the new data
    });

    // Cleanup subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a1a1a] to-black" />
        
        {/* Animated Orbs */}
        <motion.div
          animate={{
            opacity: [0.04, 0.1, 0.04],
            scale: [1, 1.4, 1],
            x: [0, 120, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-[950px] h-[950px] bg-[#d4af37]/25 rounded-full blur-[200px]"
        />
        <motion.div
          animate={{
            opacity: [0.05, 0.12, 0.05],
            scale: [1.4, 1, 1.4],
            x: [0, -100, 0],
          }}
          transition={{
            duration: 38,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-[850px] h-[850px] bg-[#f0e68c]/20 rounded-full blur-[200px]"
        />

        {/* Floating Sparkles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0, 1, 0],
              y: [0, -150],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeOut"
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="inline-block mb-6"
          >
            <div className="px-6 py-2 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/5 backdrop-blur-sm">
              <span className="text-[#d4af37] tracking-[0.3em] text-xs" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                NFT MARKETPLACE
              </span>
            </div>
          </motion.div>

          <h2 
            className="text-[3rem] md:text-[4rem] lg:text-[5rem] mb-6 text-[#d4af37] tracking-tight leading-[1.1]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
          >
            Créez & Collectez
          </h2>
          
          <p 
            className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
          >
            Marketplace premium de NFT. Créez, achetez et vendez des actifs numériques uniques. Collections exclusives.
          </p>

          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity px-8 py-6 text-base"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
          >
            <Plus className="mr-2 w-5 h-5" />
            Créer un NFT
          </Button>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {(totalVolume / 1000).toFixed(0)}K ETH
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Volume Total
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <ImageIcon className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {(totalItems / 1000).toFixed(0)}K
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              NFTs Créés
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Crown className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {(totalOwners / 1000).toFixed(1)}K
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Collectionneurs
            </p>
          </div>

          <div className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 text-center">
            <Sparkles className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
            <p 
              className="text-3xl text-[#d4af37] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {collections.length}
            </p>
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Collections
            </p>
          </div>
        </motion.div>

        {/* Featured Collections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 
              className="text-2xl text-white flex items-center gap-3"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              <Flame className="w-6 h-6 text-[#d4af37]" />
              Collections Tendance
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCollections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="rounded-2xl border border-[#d4af37]/30 bg-white/[0.03] backdrop-blur-xl overflow-hidden hover:border-[#d4af37]/60 transition-all group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-[#d4af37]/90 text-black border-0">
                      <Flame className="w-3 h-3 mr-1" />
                      Hot
                    </Badge>
                  </div>
                  {collection.verified && (
                    <div className="absolute top-3 left-3">
                      <div className="w-6 h-6 rounded-full bg-[#d4af37]/90 flex items-center justify-center">
                        <Check className="w-4 h-4 text-black" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h4 
                    className="text-white text-lg mb-3 truncate"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                  >
                    {collection.name}
                  </h4>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p 
                        className="text-white/60 text-xs mb-1"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        Floor
                      </p>
                      <p 
                        className="text-[#d4af37]"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                      >
                        {collection.floor} ETH
                      </p>
                    </div>
                    <div>
                      <p 
                        className="text-white/60 text-xs mb-1"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        Volume
                      </p>
                      <p 
                        className="text-white"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                      >
                        {(collection.volume / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span 
                      className={`text-sm flex items-center gap-1 ${collection.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                    >
                      {collection.change24h >= 0 ? '+' : ''}{collection.change24h}%
                    </span>
                    <span 
                      className="text-white/60 text-sm"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {collection.items.toLocaleString()} items
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/[0.02] border border-[#d4af37]/20 rounded-2xl p-2 mb-8">
            <TabsTrigger 
              value="marketplace"
              className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger 
              value="mynfts"
              className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Mes NFTs
            </TabsTrigger>
            <TabsTrigger 
              value="collections"
              className="rounded-xl data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37] text-white/60 py-3"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              <Crown className="w-4 h-4 mr-2" />
              Collections
            </TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]/40 w-5 h-5" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher des NFTs..."
                  className="pl-12 h-12 rounded-xl border border-[#d4af37]/20 bg-white/[0.02] text-white placeholder:text-white/30 focus:border-[#d4af37]/40"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className={`h-12 px-4 border-[#d4af37]/20 ${viewMode === 'grid' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-white/[0.02] text-white'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className={`h-12 px-4 border-[#d4af37]/20 ${viewMode === 'list' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-white/[0.02] text-white'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* NFTs Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredNFTs.map((nft, index) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  onClick={() => { setSelectedNFT(nft); setShowBuyDialog(true); }}
                  className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl overflow-hidden hover:border-[#d4af37]/40 transition-all group cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    <div className="absolute top-3 right-3 flex gap-2">
                      {nft.verified && (
                        <div className="w-8 h-8 rounded-full bg-[#d4af37]/90 backdrop-blur-sm flex items-center justify-center">
                          <Check className="w-5 h-5 text-black" />
                        </div>
                      )}
                    </div>

                    <div className="absolute top-3 left-3">
                      <Badge variant="outline" className={rarityColors[nft.rarity]}>
                        {nft.rarity}
                      </Badge>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
                        <Heart className="w-4 h-4 text-white/80" />
                        <span className="text-white/80 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {nft.likes}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
                        <Eye className="w-4 h-4 text-white/80" />
                        <span className="text-white/80 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {nft.views}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h4 
                      className="text-white text-lg mb-1 truncate"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                    >
                      {nft.name}
                    </h4>
                    
                    <p 
                      className="text-white/60 text-sm mb-4 truncate"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {nft.collection}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p 
                          className="text-white/60 text-xs mb-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          Prix
                        </p>
                        <p 
                          className="text-[#d4af37] text-xl"
                          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                        >
                          {nft.price} {nft.currency}
                        </p>
                      </div>

                      <Button
                        className="bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNFT(nft);
                          setShowBuyDialog(true);
                        }}
                      >
                        <ShoppingCart className="mr-2 w-4 h-4" />
                        Acheter
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* My NFTs Tab */}
          <TabsContent value="mynfts" className="space-y-6">
            {myNFTs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myNFTs.map((nft, index) => (
                  <motion.div
                    key={nft.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl overflow-hidden hover:border-[#d4af37]/40 transition-all group"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      <div className="absolute top-3 left-3">
                        <Badge variant="outline" className={rarityColors[nft.rarity]}>
                          {nft.rarity}
                        </Badge>
                      </div>

                      <div className="absolute top-3 right-3">
                        <Badge className="bg-green-500/90 text-white border-0">
                          <Check className="w-3 h-3 mr-1" />
                          Owned
                        </Badge>
                      </div>
                    </div>

                    <div className="p-5">
                      <h4 
                        className="text-white text-lg mb-1 truncate"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                      >
                        {nft.name}
                      </h4>
                      
                      <p 
                        className="text-white/60 text-sm mb-4 truncate"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        {nft.collection}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p 
                            className="text-white/60 text-xs mb-1"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            Valeur Actuelle
                          </p>
                          <p 
                            className="text-[#d4af37] text-xl"
                            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                          >
                            {nft.price} {nft.currency}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#d4af37]/20 bg-white/[0.02] text-white hover:bg-white/[0.05]"
                          >
                            <Zap className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                      >
                        Vendre
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <ImageIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p 
                  className="text-white/60 text-lg mb-6"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Vous ne possédez aucun NFT pour le moment
                </p>
                <Button
                  onClick={() => setActiveTab("marketplace")}
                  className="bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  Explorer le Marketplace
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-6">
            <div className="space-y-4">
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                  className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-6 hover:border-[#d4af37]/40 transition-all group cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {collection.verified && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 rounded-full bg-[#d4af37]/90 flex items-center justify-center">
                            <Check className="w-4 h-4 text-black" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 
                          className="text-white text-xl"
                          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                        >
                          {collection.name}
                        </h4>
                        {collection.featured && (
                          <Badge className="bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <p 
                            className="text-white/60 text-xs mb-1"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            Floor Price
                          </p>
                          <p 
                            className="text-[#d4af37] text-lg"
                            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                          >
                            {collection.floor} ETH
                          </p>
                        </div>

                        <div>
                          <p 
                            className="text-white/60 text-xs mb-1"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            Volume
                          </p>
                          <p 
                            className="text-white text-lg"
                            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                          >
                            {(collection.volume / 1000).toFixed(0)}K ETH
                          </p>
                        </div>

                        <div>
                          <p 
                            className="text-white/60 text-xs mb-1"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            Items
                          </p>
                          <p 
                            className="text-white text-lg"
                            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                          >
                            {collection.items.toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p 
                            className="text-white/60 text-xs mb-1"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            24h
                          </p>
                          <p 
                            className={`text-lg flex items-center gap-1 ${collection.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}
                            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                          >
                            <TrendingUp className="w-4 h-4" />
                            {collection.change24h >= 0 ? '+' : ''}{collection.change24h}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                    >
                      Explorer
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create NFT Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle 
              className="text-3xl text-[#d4af37]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Créer Votre NFT
            </DialogTitle>
            <DialogDescription 
              className="text-white/60"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Mintez votre actif numérique unique sur la blockchain
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Upload Image */}
            <div>
              <label 
                className="text-white mb-3 block"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
              >
                Image / Média
              </label>
              <div className="border-2 border-dashed border-[#d4af37]/20 rounded-xl p-8 text-center hover:border-[#d4af37]/40 transition-all cursor-pointer bg-white/[0.02]">
                <Upload className="w-12 h-12 text-[#d4af37]/60 mx-auto mb-3" />
                <p 
                  className="text-white/60 mb-2"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Glissez-déposez ou cliquez pour uploader
                </p>
                <p 
                  className="text-white/40 text-sm"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  PNG, JPG, GIF, WebP jusqu'à 100MB
                </p>
              </div>
            </div>

            {/* NFT Name */}
            <div>
              <label 
                className="text-white mb-2 block"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
              >
                Nom du NFT
              </label>
              <Input
                type="text"
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
                placeholder="ex: Prestige Yacht #001"
                className="h-12 bg-white/[0.02] border-[#d4af37]/20 text-white"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>

            {/* Description */}
            <div>
              <label 
                className="text-white mb-2 block"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
              >
                Description
              </label>
              <textarea
                value={nftDescription}
                onChange={(e) => setNftDescription(e.target.value)}
                placeholder="Décrivez votre NFT..."
                rows={4}
                className="w-full p-4 rounded-xl border border-[#d4af37]/20 bg-white/[0.02] text-white placeholder:text-white/30 focus:border-[#d4af37]/40 focus:outline-none resize-none"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>

            {/* Price */}
            <div>
              <label 
                className="text-white mb-2 block"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
              >
                Prix
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={nftPrice}
                  onChange={(e) => setNftPrice(e.target.value)}
                  placeholder="0.00"
                  className="h-12 bg-white/[0.02] border-[#d4af37]/20 text-white pr-16"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
                <span 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  ETH
                </span>
              </div>
            </div>

            {/* Blockchain */}
            <div>
              <label 
                className="text-white mb-2 block"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
              >
                Blockchain
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Ethereum', 'Polygon', 'Binance Smart Chain'].map((chain) => (
                  <button
                    key={chain}
                    onClick={() => setNftBlockchain(chain)}
                    className={`p-4 rounded-xl border transition-all ${
                      nftBlockchain === chain
                        ? 'border-[#d4af37]/60 bg-[#d4af37]/10'
                        : 'border-[#d4af37]/20 bg-white/[0.02] hover:border-[#d4af37]/40'
                    }`}
                  >
                    <p 
                      className="text-white text-sm text-center"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {chain}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            {nftName && nftPrice && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/5 p-6"
              >
                <h4 
                  className="text-[#d4af37] mb-4"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  Résumé
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Nom:
                    </span>
                    <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      {nftName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Prix:
                    </span>
                    <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      {nftPrice} ETH
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Blockchain:
                    </span>
                    <span className="text-[#d4af37]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      {nftBlockchain}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Frais de mint:
                    </span>
                    <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      ~0.005 ETH
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Create Button */}
            <Button
              onClick={handleCreateNFT}
              disabled={!nftName || !nftPrice || isCreating}
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity disabled:opacity-50 h-14"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
            >
              {isCreating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"
                  />
                  Création en cours...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 w-5 h-5" />
                  Créer le NFT
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Buy NFT Dialog */}
      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-xl">
          <DialogHeader>
            <DialogTitle 
              className="text-3xl text-[#d4af37]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Acheter ce NFT
            </DialogTitle>
          </DialogHeader>

          {selectedNFT && (
            <div className="space-y-6 mt-6">
              {/* NFT Image */}
              <div className="relative h-80 rounded-xl overflow-hidden">
                <img
                  src={selectedNFT.image}
                  alt={selectedNFT.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="outline" className={rarityColors[selectedNFT.rarity]}>
                    {selectedNFT.rarity}
                  </Badge>
                </div>
              </div>

              {/* NFT Details */}
              <div>
                <h3 
                  className="text-2xl text-white mb-2"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                >
                  {selectedNFT.name}
                </h3>
                <p 
                  className="text-white/60 mb-4"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {selectedNFT.collection}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] p-4">
                    <p 
                      className="text-white/60 text-sm mb-1"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Créateur
                    </p>
                    <p 
                      className="text-white"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                    >
                      {selectedNFT.creator}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] p-4">
                    <p 
                      className="text-white/60 text-sm mb-1"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Propriétaire
                    </p>
                    <p 
                      className="text-white"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
                    >
                      {selectedNFT.owner}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/5 p-6">
                <p 
                  className="text-white/60 text-sm mb-2"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Prix actuel
                </p>
                <p 
                  className="text-[#d4af37] text-4xl mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                >
                  {selectedNFT.price} {selectedNFT.currency}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Prix:
                    </span>
                    <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      {selectedNFT.price} {selectedNFT.currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Frais de marketplace:
                    </span>
                    <span className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      {(selectedNFT.price * 0.025).toFixed(3)} {selectedNFT.currency}
                    </span>
                  </div>
                  <div className="w-full h-px bg-[#d4af37]/30 my-2" />
                  <div className="flex justify-between">
                    <span className="text-[#d4af37]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      Total:
                    </span>
                    <span className="text-[#d4af37] text-lg" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                      {(selectedNFT.price * 1.025).toFixed(3)} {selectedNFT.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Buy Button */}
              <Button
                onClick={handleBuyNFT}
                disabled={isBuying}
                className="w-full h-14 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
              >
                {isBuying ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"
                    />
                    Achat en cours...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 w-5 h-5" />
                    Acheter Maintenant
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default NFTSection;