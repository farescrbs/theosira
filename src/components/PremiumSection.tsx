import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { LuxuryDivider } from "./LuxuryDivider";
import { Shield, Zap, TrendingUp, Lock } from "lucide-react";
import { ArrowRight } from "lucide-react";

export function PremiumSection() {
  const features = [
    {
      icon: Shield,
      title: "Sécurité Absolue",
      description: "Protocoles de sécurité de niveau militaire pour protéger vos actifs numériques"
    },
    {
      icon: Zap,
      title: "Transactions Instantanées",
      description: "Vitesse d'exécution ultra-rapide avec confirmation en temps réel"
    },
    {
      icon: TrendingUp,
      title: "Croissance Optimisée",
      description: "Algorithmes avancés pour maximiser vos rendements d'investissement"
    },
    {
      icon: Lock,
      title: "Confidentialité Premium",
      description: "Cryptage de bout en bout et anonymat garanti pour toutes vos transactions"
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-black">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="premiumGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <motion.rect
                width="58"
                height="58"
                x="1"
                y="1"
                fill="none"
                stroke="#d4af37"
                strokeWidth="0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#premiumGrid)" />
        </svg>
      </div>

      {/* Floating Golden Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#d4af37] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 15px #d4af37, 0 0 30px rgba(212, 175, 55, 0.5)',
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, Math.cos(i) * 40, 0],
              opacity: [0, 0.9, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
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
          className="text-center mb-24"
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
            Services Premium
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mb-6"
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
              L'EXCELLENCE
            </motion.span>
            <span className="text-white text-4xl md:text-6xl block mt-4">
              À VOTRE SERVICE
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Des services blockchain de classe mondiale, conçus pour les investisseurs 
            les plus exigeants qui recherchent l'excellence et la performance absolue.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="luxury-glass p-8 border border-[#d4af37]/20 hover:border-[#d4af37]/60 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Hover Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-transparent to-[#f0e68c]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              {/* Glow Effect */}
              <motion.div
                className="absolute -inset-1 bg-[#d4af37] opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500"
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon Container */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                  className="w-16 h-16 mb-6 flex items-center justify-center border-2 border-[#d4af37]/30 group-hover:border-[#d4af37] transition-colors duration-500"
                >
                  <feature.icon className="text-[#d4af37]" size={32} />
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
                  className="text-white mb-4 text-xl"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {feature.title}
                </motion.h3>

                {/* Description */}
                <p 
                  className="text-gray-400 leading-relaxed"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {feature.description}
                </p>

                {/* Animated Dot */}
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                  className="absolute top-8 right-8 w-2 h-2 bg-[#d4af37] rounded-full"
                  style={{
                    boxShadow: '0 0 10px #d4af37',
                  }}
                />
              </div>

              {/* Bottom Accent Line */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-12 py-5 bg-transparent border-2 border-[#d4af37] text-[#d4af37] overflow-hidden transition-all duration-500 hover:text-black"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <motion.span
              className="absolute inset-0 bg-[#d4af37]"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative z-10 tracking-[0.2em] uppercase flex items-center gap-3">
              Découvrir Nos Services
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom Separator */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
      />
    </section>
  );
}

export default PremiumSection;