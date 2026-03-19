import { motion } from "motion/react";
import { useState } from "react";
import { Wallet, Users, Globe2, Zap, Lock, TrendingUp } from "lucide-react";

const services = [
  {
    icon: Wallet,
    title: "Portfolio Digital",
    description: "Gérez vos actifs crypto avec élégance",
    stat: "500K+",
    label: "Utilisateurs"
  },
  {
    icon: Users,
    title: "Communauté Elite",
    description: "Rejoignez les leaders du Web3",
    stat: "150+",
    label: "Pays"
  },
  {
    icon: Globe2,
    title: "Réseau Global",
    description: "Infrastructure mondiale décentralisée",
    stat: "99.99%",
    label: "Uptime"
  },
];

export function FourthHero() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center py-20" 
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
      }}>
      
      {/* Hexagon Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" x="0" y="0" width="100" height="87" patternUnits="userSpaceOnUse">
              <polygon 
                points="50,0 93.3,25 93.3,62 50,87 6.7,62 6.7,25" 
                fill="none" 
                stroke="#d4af37" 
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      {/* Radial Glow Effects */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#d4af37] rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
        className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-[#f0e68c] rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-[#d4af37]" />
            <motion.div
              animate={{ rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-[#d4af37]"
              style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
            />
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-[#d4af37]" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#d4af37] tracking-[0.4em] mb-6 uppercase"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Écosystème Complet
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="text-white">Votre Passerelle vers</span>
            <br />
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
              }}
              style={{
                background: 'linear-gradient(90deg, #d4af37 0%, #f0e68c 25%, #d4af37 50%, #f0e68c 75%, #d4af37 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              La Finance Décentralisée
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Une plateforme complète qui combine technologie de pointe, 
            sécurité maximale et expérience utilisateur exceptionnelle.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="relative group"
            >
              {/* Card Background */}
              <div className="luxury-glass p-10 h-full border border-[#d4af37]/20 group-hover:border-[#d4af37] transition-all duration-500">
                {/* Animated Glow */}
                <motion.div
                  animate={{
                    opacity: hoveredIndex === index ? 0.2 : 0,
                  }}
                  className="absolute inset-0 bg-[#d4af37] blur-2xl"
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    animate={{
                      rotate: hoveredIndex === index ? [0, 360] : 0,
                      scale: hoveredIndex === index ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.8 }}
                    className="w-20 h-20 rounded-full luxury-glass flex items-center justify-center mb-8 border border-[#d4af37]/30 mx-auto"
                  >
                    <service.icon className="text-[#d4af37]" size={36} />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-white text-2xl mb-4 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-center mb-8 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Divider */}
                  <motion.div
                    animate={{
                      scaleX: hoveredIndex === index ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.5 }}
                    className="h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-6"
                  />

                  {/* Stat */}
                  <div className="text-center">
                    <motion.p
                      animate={{
                        scale: hoveredIndex === index ? 1.1 : 1,
                      }}
                      className="text-3xl mb-2 gold-text-gradient"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {service.stat}
                    </motion.p>
                    <p className="text-gray-500 text-sm tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {service.label}
                    </p>
                  </div>
                </div>

                {/* Animated Corner Borders */}
                <motion.div
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    scale: hoveredIndex === index ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#d4af37]" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#d4af37]" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#d4af37]" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#d4af37]" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="luxury-glass p-12 border border-[#d4af37]/30"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { icon: Lock, label: "Sécurité Militaire" },
              { icon: Zap, label: "Transactions Rapides" },
              { icon: TrendingUp, label: "ROI Optimisé" },
              { icon: Wallet, label: "Multi-Actifs" },
              { icon: Users, label: "Support 24/7" },
              { icon: Globe2, label: "100% Décentralisé" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#f0e68c]/20 flex items-center justify-center mb-4 border border-[#d4af37]/30 group-hover:border-[#d4af37] transition-colors"
                >
                  <feature.icon className="text-[#d4af37]" size={24} />
                </motion.div>
                <p className="text-gray-400 text-sm group-hover:text-[#d4af37] transition-colors" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {feature.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-16 py-6 overflow-hidden group"
          >
            <motion.div
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, #d4af37, #f0e68c, #d4af37)',
                backgroundSize: '200% auto',
              }}
            />
            
            <motion.div
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            />
            
            <span className="relative z-10 text-black tracking-[0.3em] text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              REJOINDRE L'ÉLITE
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export default FourthHero;