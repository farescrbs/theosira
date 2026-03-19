// ═══════════════════════════════════════════════════════════════════════════
// 🖼️ GALERIE NFT ULTRA-LUXUEUSE - THESORIA
// Affichage des NFTs avec design de musée d'art
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Image as ImageIcon, Grid3x3, List, Loader2, ExternalLink,
  Eye, TrendingUp, Award, Sparkles, Search, Filter
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Dialog, DialogContent } from "./ui/dialog";
import { useWalletConnection } from "../hooks/useWeb3";
import { nftService, type NFT } from "../services/nftService";
import { toast } from "sonner@2.0.3";

export default function NFTGallery() {
  const { isConnected } = useWalletConnection();
  
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isConnected) {
      loadNFTs();
    }
  }, [isConnected]);

  const loadNFTs = async () => {
    setIsLoading(true);
    try {
      const userNFTs = await nftService.getUserNFTs(20);
      setNfts(userNFTs);
      
      if (userNFTs.length > 0) {
        toast.success(`${userNFTs.length} NFTs chargés ! ✨`);
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des NFTs:', error);
      toast.error('Erreur', {
        description: 'Impossible de charger les NFTs',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNFTs = nfts.filter(nft => 
    nft.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nft.collectionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-12 text-center"
      >
        <ImageIcon className="w-16 h-16 text-[#d4af37]/40 mx-auto mb-4" />
        <h3 className="text-white text-xl mb-2" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
          Galerie NFT Non Disponible
        </h3>
        <p className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Connectez votre wallet pour voir votre collection
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/5 via-transparent to-transparent backdrop-blur-xl p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#f0e68c] flex items-center justify-center">
                <ImageIcon className="w-7 h-7 text-black" />
              </div>
              <div>
                <h2 className="text-white text-3xl mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Ma Collection NFT
                </h2>
                <p className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {filteredNFTs.length} NFT{filteredNFTs.length > 1 ? 's' : ''} dans votre wallet
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/[0.05] border-[#d4af37]/20 text-white placeholder:text-white/40 w-64"
                />
              </div>
              
              <div className="flex rounded-lg bg-white/[0.05] border border-[#d4af37]/20 p-1">
                <Button
                  onClick={() => setViewMode('grid')}
                  variant="ghost"
                  size="sm"
                  className={viewMode === 'grid' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'text-white/60'}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setViewMode('list')}
                  variant="ghost"
                  size="sm"
                  className={viewMode === 'list' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'text-white/60'}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={loadNFTs}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="border-[#d4af37]/30 text-white hover:bg-white/[0.05]"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Actualiser'
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Galerie */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin mx-auto mb-4" />
              <p className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Chargement de vos NFTs...
              </p>
            </div>
          </div>
        ) : filteredNFTs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-12 text-center"
          >
            <Sparkles className="w-12 h-12 text-[#d4af37]/40 mx-auto mb-4" />
            <p className="text-white text-lg mb-2" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
              {searchQuery ? 'Aucun NFT trouvé' : 'Aucun NFT détecté'}
            </p>
            <p className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {searchQuery ? 'Essayez une autre recherche' : 'Commencez à collectionner des NFTs premium'}
            </p>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredNFTs.map((nft, index) => (
                <motion.div
                  key={`${nft.contractAddress}-${nft.tokenId}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  onClick={() => setSelectedNFT(nft)}
                  className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl overflow-hidden cursor-pointer group"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={nft.metadata.image}
                      alt={nft.metadata.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-[#d4af37] text-black border-none hover:bg-[#f0e68c]"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir Détails
                      </Button>
                    </div>

                    {/* Badge Collection */}
                    <Badge className="absolute top-3 left-3 bg-black/60 text-white border-[#d4af37]/30 backdrop-blur-md">
                      {nft.collectionName}
                    </Badge>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-white text-lg mb-2 truncate" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
                      {nft.metadata.name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-white/50 text-xs mb-1">Floor Price</p>
                        <p className="text-[#d4af37] font-semibold">{nft.floorPrice}</p>
                      </div>
                      {nft.lastSale && (
                        <div className="text-right">
                          <p className="text-white/50 text-xs mb-1">Last Sale</p>
                          <p className="text-white font-semibold">{nft.lastSale}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredNFTs.map((nft, index) => (
                <motion.div
                  key={`${nft.contractAddress}-${nft.tokenId}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedNFT(nft)}
                  className="rounded-2xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-4 hover:border-[#d4af37]/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={nft.metadata.image}
                      alt={nft.metadata.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-white text-lg mb-1" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
                        {nft.metadata.name}
                      </h3>
                      <p className="text-white/60 text-sm">{nft.collectionName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#d4af37] text-lg font-semibold">{nft.floorPrice}</p>
                      <p className="text-white/50 text-sm">Floor</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* NFT Detail Dialog */}
      <Dialog open={selectedNFT !== null} onOpenChange={() => setSelectedNFT(null)}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-3xl backdrop-blur-2xl">
          {selectedNFT && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Image */}
              <div className="rounded-2xl overflow-hidden border border-[#d4af37]/20">
                <img
                  src={selectedNFT.metadata.image}
                  alt={selectedNFT.metadata.name}
                  className="w-full aspect-square object-cover"
                />
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <Badge className="bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30 mb-3">
                    {selectedNFT.collectionName}
                  </Badge>
                  <h2 className="text-white text-3xl mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {selectedNFT.metadata.name}
                  </h2>
                  <p className="text-white/70" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {selectedNFT.metadata.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/[0.03] border border-[#d4af37]/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-[#d4af37]" />
                      <p className="text-white/60 text-sm">Floor Price</p>
                    </div>
                    <p className="text-white text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {selectedNFT.floorPrice}
                    </p>
                  </div>

                  {selectedNFT.lastSale && (
                    <div className="rounded-xl bg-white/[0.03] border border-[#d4af37]/10 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-[#d4af37]" />
                        <p className="text-white/60 text-sm">Last Sale</p>
                      </div>
                      <p className="text-white text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {selectedNFT.lastSale}
                      </p>
                    </div>
                  )}
                </div>

                {/* Attributes */}
                {selectedNFT.metadata.attributes && selectedNFT.metadata.attributes.length > 0 && (
                  <div>
                    <h3 className="text-white text-lg mb-3" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
                      Attributs
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedNFT.metadata.attributes.map((attr, i) => (
                        <div key={i} className="rounded-lg bg-white/[0.03] border border-[#d4af37]/10 p-3">
                          <p className="text-white/50 text-xs mb-1">{attr.trait_type}</p>
                          <p className="text-white font-semibold">{attr.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Token ID */}
                <div className="rounded-lg bg-white/[0.02] border border-[#d4af37]/10 p-3">
                  <p className="text-white/50 text-xs mb-1">Token ID</p>
                  <p className="text-white font-mono text-sm">#{selectedNFT.tokenId}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
