import { motion } from "motion/react";
import { useState } from "react";
import { Box, Link2, Lock, Zap, Database, Network } from "lucide-react";
import { LuxuryDivider } from "./LuxuryDivider";

const blockchainBlocks = [
  { id: 1, hash: "0x7a9f3c2b...", transactions: 247, timestamp: "2 min ago" },
  { id: 2, hash: "0x4e8d1a6f...", transactions: 189, timestamp: "5 min ago" },
  { id: 3, hash: "0x9b2c5f1e...", transactions: 312, timestamp: "8 min ago" },
  { id: 4, hash: "0x3d6a8c4b...", transactions: 156, timestamp: "11 min ago" },
  { id: 5, hash: "0x8f1e2d9a...", transactions: 278, timestamp: "14 min ago" },
];

const features = [
  {
    icon: Lock,
    title: "Sécurité Cryptographique",
    description: "Chiffrement de niveau militaire avec algorithmes SHA-256 et cryptographie asymétrique",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Link2,
    title: "Immuabilité des Données",
    description: "Chaque transaction est gravée de manière permanente dans la chaîne de blocs",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Network,
    title: "Réseau Décentralisé",
    description: "Des milliers de nœuds répartis mondialement pour une fiabilité maximale",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Zap,
    title: "Transactions Instantanées",
    description: "Vitesse de traitement ultra-rapide avec finalité des transactions en secondes",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Database,
    title: "Smart Contracts",
    description: "Exécution automatique de contrats programmables sans intermédiaires",
    color: "from-indigo-500 to-violet-500"
  },
  {
    icon: Box,
    title: "Consensus Avancé",
    description: "Mécanisme de validation éprouvé garantissant l'intégrité du réseau",
    color: "from-yellow-500 to-amber-500"
  },
];

export function BlockchainVisualization() {
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <section className="relative py-40 overflow-hidden bg-black">
      {/* Animated Circuit Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <motion.path
                d="M 0 50 L 20 50 L 20 20 L 50 20 L 50 0"
                stroke="#d4af37"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.circle cx="20" cy="50" r="2" fill="#d4af37"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.circle cx="20" cy="20" r="2" fill="#d4af37"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Glowing Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
        }}
        className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#d4af37] rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <LuxuryDivider variant="centered" />
          
          <p className="text-[#d4af37] tracking-[0.4em] mb-6 text-sm uppercase"
            style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Technologie de Pointe
          </p>
          
          <h2 className="text-white mb-8 text-4xl md:text-6xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="gold-text-gradient">
              L'Architecture Blockchain
            </span>
          </h2>

          <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed text-lg"
            style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Une infrastructure révolutionnaire qui transforme la manière dont les données 
            et les transactions sont sécurisées et vérifiées à l'échelle mondiale.
          </p>

          <LuxuryDivider variant="centered" />
        </motion.div>

        {/* Blockchain Visualization */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Chain Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent -translate-y-1/2 hidden lg:block" />

            {/* Blocks */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-4">
              {blockchainBlocks.map((block, index) => (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -15, scale: 1.05 }}
                  onClick={() => setSelectedBlock(block.id)}
                  className={`relative w-full lg:w-48 cursor-pointer group ${
                    selectedBlock === block.id ? 'z-20' : 'z-10'
                  }`}
                >
                  {/* Connection Line to next block */}
                  {index < blockchainBlocks.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.15 + 0.5 }}
                      className="hidden lg:block absolute top-1/2 -right-2 w-8 h-1 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] -translate-y-1/2 origin-left"
                    />
                  )}

                  {/* Block Card */}
                  <div className={`luxury-glass p-6 border-2 transition-all duration-500 ${
                    selectedBlock === block.id 
                      ? 'border-[#d4af37] shadow-2xl shadow-[#d4af37]/50' 
                      : 'border-[#d4af37]/20 group-hover:border-[#d4af37]/50'
                  }`}>
                    {/* Animated Glow */}
                    <motion.div
                      animate={{
                        opacity: selectedBlock === block.id ? [0.2, 0.4, 0.2] : 0,
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="absolute inset-0 bg-[#d4af37] blur-2xl"
                    />

                    <div className="relative z-10">
                      {/* Block Icon */}
                      <div className="flex items-center justify-between mb-4">
                        <motion.div
                          animate={{ rotate: selectedBlock === block.id ? 360 : 0 }}
                          transition={{ duration: 1 }}
                          className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#f0e68c] flex items-center justify-center"
                        >
                          <Box className="text-black" size={20} />
                        </motion.div>
                        <span className="text-xs text-gray-500">#{block.id}</span>
                      </div>

                      {/* Block Info */}
                      <div className="space-y-2 mb-4">
                        <div>
                          <p className="text-gray-500 text-xs">Hash</p>
                          <p className="text-[#d4af37] text-sm font-mono">{block.hash}</p>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <p className="text-gray-500 text-xs">Transactions</p>
                            <p className="text-white">{block.transactions}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-500 text-xs">Time</p>
                            <p className="text-white text-sm">{block.timestamp}</p>
                          </div>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                          className="w-2 h-2 bg-green-400 rounded-full"
                        />
                        <span className="text-xs text-gray-400">Verified</span>
                      </div>
                    </div>
                  </div>

                  {/* Corner Accents */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onHoverStart={() => setHoveredFeature(index)}
              onHoverEnd={() => setHoveredFeature(null)}
              className="relative luxury-glass p-8 cursor-pointer group"
            >
              {/* Gradient Background on Hover */}
              <motion.div
                animate={{
                  opacity: hoveredFeature === index ? 0.1 : 0,
                }}
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} blur-xl`}
              />

              {/* Border Animation */}
              <motion.div
                animate={{
                  opacity: hoveredFeature === index ? 1 : 0,
                }}
                className={`absolute inset-0 border-2 bg-gradient-to-br ${feature.color}`}
                style={{ WebkitMaskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', padding: '2px' }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  animate={{
                    rotate: hoveredFeature === index ? 360 : 0,
                    scale: hoveredFeature === index ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 rounded-full luxury-glass flex items-center justify-center mb-6 border border-[#d4af37]/30 group-hover:border-[#d4af37]"
                >
                  <feature.icon className="text-[#d4af37]" size={28} />
                </motion.div>

                {/* Content */}
                <h3 className="text-white text-xl mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {feature.title}
                </h3>

                <div className="w-12 h-px bg-gradient-to-r from-[#d4af37] to-transparent mb-4" />

                <p className="text-gray-400 leading-relaxed text-sm">
                  {feature.description}
                </p>

                {/* Hover Accent */}
                <motion.div
                  animate={{
                    scaleX: hoveredFeature === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] origin-left"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 luxury-glass p-8 border border-[#d4af37]/20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Blocks Minés", value: "2,547,893", suffix: "" },
              { label: "Transactions Totales", value: "847", suffix: "M+" },
              { label: "Nœuds Actifs", value: "15,432", suffix: "" },
              { label: "TPS Moyen", value: "100,000", suffix: "+" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <motion.p
                  className="text-3xl md:text-4xl mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="gold-text-gradient">{stat.value}</span>
                  <span className="text-[#d4af37]">{stat.suffix}</span>
                </motion.p>
                <p className="text-gray-400 text-sm tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default BlockchainVisualization;