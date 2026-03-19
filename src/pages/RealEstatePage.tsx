import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building, Lock, Globe, Code, Shield, 
  ArrowRight, FileText, CheckCircle, Diamond,
  MapPin, TrendingUp, Key, Building2, Layers,
  ChevronRight,
  Activity
} from "lucide-react";
import { Button } from "../components/ui/button";
import PropertyInvestModal from "../components/PropertyInvestModal";

const propertiesData = [
  {
    id: 1,
    title: "Le Penthouse Stellaire",
    location: "Monaco, Marina",
    image: "https://images.unsplash.com/photo-1592860070861-f114190c468a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMHBlbnRob3VzZSUyMG1vbmFjb3xlbnwxfHx8fDE3NzI5MTMzNTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    valuation: "12,500,000 $",
    tokenPrice: "1,000 USDC",
    apy: "+8.5% APY",
    progress: 74,
    status: "funding",
    category: "residential",
    investors: 342,
    contractAddress: "0x7F4a...b9C2"
  },
  {
    id: 2,
    title: "Villa L'Horizon",
    location: "Dubaï, Palm Jumeirah",
    image: "https://images.unsplash.com/photo-1722404190766-cd39c0742175?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjB2aWxsYSUyMGR1YmFpJTIwZXh0ZXJpb3IlMjBwb29sfGVufDF8fHx8MTc3MjkxMzM1NHww&ixlib=rb-4.1.0&q=80&w=1080",
    valuation: "24,000,000 $",
    tokenPrice: "2,500 USDC",
    apy: "+11.2% APY",
    progress: 32,
    status: "funding",
    category: "villa",
    investors: 128,
    contractAddress: "0x3A21...f1B8"
  },
  {
    id: 3,
    title: "The Mayfair Residence",
    location: "Londres, Mayfair",
    image: "https://images.unsplash.com/photo-1757439402296-000be181e38b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZWFsJTIwZXN0YXRlJTIwZXh0ZXJpb3IlMjBldmVuaW5nfGVufDF8fHx8MTc3MjkxMzM1MHww&ixlib=rb-4.1.0&q=80&w=1080",
    valuation: "18,200,000 $",
    tokenPrice: "1,000 USDC",
    apy: "+7.8% APY",
    progress: 100,
    status: "completed",
    category: "residential",
    investors: 856,
    contractAddress: "0x9C8d...e4A1"
  },
  {
    id: 4,
    title: "Château de Vignes",
    location: "Bordeaux, France",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGF0ZWF1JTIwZXN0YXRlfGVufDF8fHx8MTcxMTExMTExMXww&ixlib=rb-4.1.0&q=80&w=1080",
    valuation: "32,000,000 $",
    tokenPrice: "5,000 USDC",
    apy: "+6.5% APY",
    progress: 0,
    status: "upcoming",
    category: "historical",
    investors: 0,
    contractAddress: "N/A"
  }
];

export default function RealEstatePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [properties, setProperties] = useState(propertiesData);
  const [isSyncing, setIsSyncing] = useState(true);

  // Simulate pulling live blockchain data via Alchemy / Smart Contracts
  useEffect(() => {
    const syncData = () => {
      setIsSyncing(true);
      setTimeout(() => {
        setProperties(prev => prev.map(p => {
          if (p.status === "funding") {
            // Randomly increment progress or investors to simulate live network activity
            const newProgress = Math.min(100, p.progress + (Math.random() > 0.7 ? 1 : 0));
            const newInvestors = p.investors + (Math.random() > 0.8 ? 1 : 0);
            return { ...p, progress: newProgress, investors: newInvestors };
          }
          return p;
        }));
        setIsSyncing(false);
      }, 1200);
    };

    syncData(); // initial sync
    const interval = setInterval(syncData, 15000); // sync every 15s
    return () => clearInterval(interval);
  }, []);

  const filteredProperties = properties.filter(p => {
    if (activeFilter === "all") return true;
    return p.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-24 pb-12 font-['Montserrat'] overflow-hidden selection:bg-[#d4af37]/30 relative">
      
      {/* Background Orbs */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HERO SECTION */}
        <div className="flex flex-col lg:flex-row gap-16 items-center mb-32 mt-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[#d4af37] text-xs font-semibold tracking-[0.2em] mb-8 uppercase">
              <Shield className="w-3.5 h-3.5" />
              <span>Conforme ERC-3643</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl text-white mb-6 leading-[1.1] font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
              L'Immobilier <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37]">
                Ultra-Luxe
              </span><br/>
              Liquide
            </h1>
            
            <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light max-w-lg">
              Une collection exclusive de propriétés de prestige accessibles via des fractions tokenisées sur Ethereum. Transparence totale, revenus automatisés et liquidité inédite.
            </p>
            
            <div className="flex flex-wrap gap-5">
              <Button 
                onClick={() => {
                  const el = document.getElementById("catalog");
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#d4af37] hover:bg-[#b5952f] text-black font-semibold px-8 py-6 rounded-none transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                Accéder à la Collection
              </Button>
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 hover:border-white/20 px-8 py-6 rounded-none transition-all duration-300 backdrop-blur-sm">
                <Code className="w-4 h-4 mr-2 text-[#d4af37]" />
                Audits & Smart Contracts
              </Button>
            </div>
            
            <div className="mt-12 flex items-center gap-8 border-t border-white/5 pt-8">
              <div>
                <div className="text-3xl font-light text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>$142M+</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Actifs sous gestion</div>
              </div>
              <div className="w-px h-10 bg-white/5"></div>
              <div>
                <div className="text-3xl font-light text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>9.4%</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Rendement moyen</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto group cursor-pointer" onClick={() => setSelectedProperty(properties[0])}>
              {/* Glass frame */}
              <div className="absolute inset-0 border border-white/10 bg-white/5 backdrop-blur-3xl transform translate-x-4 translate-y-4 -z-10 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6" />
              
              <div className="relative h-full w-full overflow-hidden border border-[#d4af37]/20 bg-black">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1592860070861-f114190c468a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMHBlbnRob3VzZSUyMG1vbmFjb3xlbnwxfHx8fDE3NzI5MTMzNTR8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                  alt="Luxury Real Estate" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000"
                />
                
                {/* Floating Stats */}
                <div className="absolute bottom-8 left-8 right-8 z-20 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md border border-[#d4af37]/30 text-xs text-[#d4af37] mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                    Offre Primaire en cours
                  </div>
                  <h3 className="text-2xl text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Le Penthouse Stellaire</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Rendement Estimé</p>
                      <p className="text-[#d4af37] text-lg font-light" style={{ fontFamily: "'Playfair Display', serif" }}>+8.5% APY</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Prix par Fraction</p>
                      <p className="text-white text-lg font-light" style={{ fontFamily: "'Playfair Display', serif" }}>1,000 USDC</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FEATURES - GLASSMORPHISM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {[
            {
              icon: <Key className="w-6 h-6 text-[#d4af37]" />,
              title: "Propriété Directe",
              desc: "Chaque token représente une part légale de la SPV détenant l'actif, inscrite sur la blockchain publique.",
            },
            {
              icon: <TrendingUp className="w-6 h-6 text-[#d4af37]" />,
              title: "Revenus Automatisés",
              desc: "Les loyers sont collectés et redistribués mensuellement en USDC via des smart contracts autonomes.",
            },
            {
              icon: <Layers className="w-6 h-6 text-[#d4af37]" />,
              title: "Liquidité Secondaire",
              desc: "Revendez vos fractions à tout moment sur notre DEX dédié aux actifs du monde réel (RWA).",
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white/[0.02] backdrop-blur-xl border border-white/5 hover:border-[#d4af37]/30 p-8 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="mb-6 relative z-10">
                {feature.icon}
              </div>
              <h3 className="text-xl text-white mb-3 relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed relative z-10 font-light">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* PROPERTIES GRID */}
        <div id="catalog" className="mb-32 scroll-mt-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-4xl md:text-5xl text-white font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Collection <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f3e5ab]">Signature</span>
                </h2>
                {isSyncing && (
                  <span className="flex items-center gap-1 text-[10px] text-[#d4af37] border border-[#d4af37]/30 px-2 py-0.5 rounded-full bg-[#d4af37]/10 animate-pulse">
                    <Activity className="w-3 h-3" /> Sync Alchemy
                  </span>
                )}
              </div>
              <p className="text-gray-400 max-w-xl font-light">
                Une sélection rigoureuse d'actifs immobiliers de prestige, audités et structurés pour une rentabilité optimale. Données on-chain en temps réel.
              </p>
            </div>
            
            <div className="flex gap-2 p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-none">
              {[
                { id: "all", label: "Toutes" },
                { id: "funding", label: "En Financement" },
                { id: "completed", label: "Complétées" },
                { id: "upcoming", label: "À Venir" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors duration-300 ${
                    activeFilter === tab.id 
                      ? "bg-[#d4af37] text-black font-semibold" 
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredProperties.map((property) => (
                <motion.div 
                  key={property.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/[0.02] backdrop-blur-md border border-white/5 hover:border-[#d4af37]/30 group overflow-hidden flex flex-col transition-colors duration-500"
                >
                  <div className="h-72 overflow-hidden relative">
                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                      {property.status === "funding" && (
                        <div className="bg-[#d4af37] text-black text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
                          En Financement
                        </div>
                      )}
                      {property.status === "completed" && (
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
                          Financé • Marché Secondaire
                        </div>
                      )}
                      {property.status === "upcoming" && (
                        <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
                          Prochainement
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" 
                    />
                    <div className="absolute bottom-4 left-4 z-20 flex items-center text-gray-300 text-xs">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-[#d4af37]" />
                      {property.location}
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{property.title}</h3>
                        <p className="text-[#d4af37] font-semibold text-lg">{property.valuation}</p>
                      </div>
                      <div className="text-right bg-white/5 border border-white/10 px-3 py-2">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Rendement</p>
                        <p className="text-white font-medium">{property.apy}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-8 flex-grow">
                      <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                        <span className="text-gray-400 font-light">Prix par token</span>
                        <span className="text-white">{property.tokenPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                        <span className="text-gray-400 font-light">Investisseurs on-chain</span>
                        <span className="text-white flex items-center gap-2">
                          {property.investors}
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        </span>
                      </div>
                      
                      {property.status === "funding" && (
                        <div className="pt-2">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-[#d4af37] uppercase tracking-wider">Financement progress</span>
                            <span className="text-white">{property.progress}%</span>
                          </div>
                          <div className="w-full bg-white/5 h-1 relative overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${property.progress}%` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#d4af37] to-[#f3e5ab]" 
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={() => property.status !== "upcoming" && setSelectedProperty(property)}
                      className={`w-full rounded-none transition-all duration-300 py-6 ${
                        property.status === "funding" 
                          ? "bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black" 
                          : property.status === "completed"
                            ? "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                            : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
                      }`}
                    >
                      {property.status === "funding" ? "Investir Maintenant" : 
                       property.status === "completed" ? "Marché Secondaire" : "Bientôt Disponible"}
                      {property.status !== "upcoming" && <ChevronRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* TECHNICAL ARCHITECTURE / OPEN SOURCE */}
        <div className="relative border border-white/10 bg-black/40 backdrop-blur-xl p-12 overflow-hidden">
          {/* Subtle gradient glow */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#d4af37]/5 to-transparent pointer-events-none" />
          
          <div className="absolute -right-20 -bottom-20 opacity-[0.03]">
            <Code className="w-96 h-96" />
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-xs text-gray-300 tracking-widest uppercase mb-6">
              <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
              Infrastruture Sécurisée
            </div>
            
            <h2 className="text-3xl md:text-4xl text-white mb-6 font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
              Architecture Technique & <span className="text-[#d4af37]">Open Source</span>
            </h2>
            
            <p className="text-gray-400 mb-10 leading-relaxed font-light text-lg">
              Le cœur du protocole THESORIA est entièrement open source. Les actifs sont tokenisés selon la norme T-REX (ERC-3643), garantissant que seuls les investisseurs vérifiés (KYC/AML) peuvent détenir ou échanger des tokens, assurant une conformité parfaite on-chain.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-[#d4af37]/30 flex items-center justify-center shrink-0 bg-black">
                  <Lock className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium mb-1">Standard ERC-3643</h4>
                  <p className="text-xs text-gray-500 font-light">Intégration native de l'identité digitale (ONCHAINID) pour la conformité.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-[#d4af37]/30 flex items-center justify-center shrink-0 bg-black">
                  <CheckCircle className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium mb-1">Audits Certifiés</h4>
                  <p className="text-xs text-gray-500 font-light">Contrats validés par les leaders mondiaux de la sécurité blockchain.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="bg-white/5 border border-white/10 hover:border-white/30 text-white rounded-none py-6 px-6">
                <FileText className="w-4 h-4 mr-2 text-gray-400" />
                Lire le Whitepaper
              </Button>
              <Button className="bg-white/5 border border-white/10 hover:border-[#d4af37]/50 text-white hover:text-[#d4af37] rounded-none py-6 px-6 transition-colors">
                <Code className="w-4 h-4 mr-2" />
                Explorer sur GitHub
              </Button>
            </div>
          </div>
        </div>

      </div>

      <AnimatePresence>
        {selectedProperty && (
          <PropertyInvestModal 
            property={selectedProperty} 
            onClose={() => setSelectedProperty(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
