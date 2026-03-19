import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { LuxuryDivider } from "./LuxuryDivider";

export function CollectionSection() {
  const collections = [
    {
      title: "NFT PREMIUM",
      description: "Collection exclusive d'actifs numériques certifiés",
      value: "Édition Limitée",
    },
    {
      title: "SMART CONTRACTS",
      description: "Contrats intelligents de nouvelle génération",
      value: "Automatisés",
    },
    {
      title: "DeFi ELITE",
      description: "Finance décentralisée pour investisseurs exigeants",
      value: "Rendements Élevés",
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="collectionGrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <motion.circle
                cx="40"
                cy="40"
                r="1"
                fill="#d4af37"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#collectionGrid)" />
        </svg>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#d4af37] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px #d4af37',
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.sin(i) * 30, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-8"
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[#d4af37] tracking-[0.4em] mb-6 text-sm uppercase"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Notre Collection
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="block text-5xl md:text-7xl"
              style={{
                background: 'linear-gradient(90deg, #fff 0%, #d4af37 25%, #f0e68c 50%, #d4af37 75%, #fff 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              EXCELLENCE BLOCKCHAIN
            </motion.span>
          </motion.h2>
        </motion.div>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 * index }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="luxury-glass p-10 border border-[#d4af37]/20 hover:border-[#d4af37]/60 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Animated Background Gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#f0e68c]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              {/* Glow Effect */}
              <motion.div
                className="absolute -inset-1 bg-[#d4af37] opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500"
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon/Number */}
                <motion.div
                  animate={{
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="mb-8"
                >
                  <span 
                    className="text-8xl opacity-10 text-[#d4af37]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h3
                  animate={{
                    textShadow: [
                      '0 0 10px rgba(212, 175, 55, 0)',
                      '0 0 20px rgba(212, 175, 55, 0.5)',
                      '0 0 10px rgba(212, 175, 55, 0)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="text-white mb-4 text-2xl"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {collection.title}
                </motion.h3>

                {/* Description */}
                <p 
                  className="text-gray-400 mb-6 leading-relaxed"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {collection.description}
                </p>

                {/* Value Badge */}
                <div className="inline-block px-6 py-2 border border-[#d4af37]/40 bg-[#d4af37]/5">
                  <span 
                    className="text-[#d4af37] text-sm tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {collection.value}
                  </span>
                </div>
              </div>

              {/* Bottom Accent Line */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Separator */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
      />
    </section>
  );
}

export default CollectionSection;