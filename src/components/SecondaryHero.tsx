import { motion } from "motion/react";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function SecondaryHero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black flex items-center py-20">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Radial Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#d4af37] rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
        }}
        className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-[#f0e68c] rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {/* Top Decoration */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "120px" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="h-px bg-gradient-to-r from-[#d4af37] to-transparent mb-8"
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-[#d4af37] tracking-[0.4em] mb-6 uppercase"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Innovation • Sécurité • Performance
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="text-white">La Puissance de la</span>
            <br />
            <span className="gold-text-gradient">Blockchain Premium</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="text-gray-300 leading-relaxed mb-12"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Explorez un écosystème blockchain conçu pour l'excellence. 
            Des solutions décentralisées qui redéfinissent les standards 
            de l'industrie avec une élégance inégalée.
          </motion.p>

          {/* Features */}
          <div className="space-y-6 mb-12">
            {[
              { icon: Shield, title: "Sécurité Maximale", desc: "Protection cryptographique de niveau militaire" },
              { icon: Zap, title: "Performance Ultra-Rapide", desc: "Transactions instantanées et scalabilité infinie" },
              { icon: Globe, title: "Réseau Global", desc: "Infrastructure décentralisée à travers le monde" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ x: 10, scale: 1.02 }}
                className="flex items-start gap-4 group cursor-pointer"
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                    className="absolute inset-0 bg-[#d4af37] blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                  />
                  <motion.div 
                    className="relative w-14 h-14 rounded-full luxury-glass flex items-center justify-center border border-[#d4af37]/30 group-hover:border-[#d4af37] transition-colors duration-500"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="text-[#d4af37]" size={24} />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  <motion.h4 
                    className="text-white mb-1 text-lg" 
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    whileHover={{ color: "#d4af37" }}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.title}
                  </motion.h4>
                  <p className="text-gray-400 text-sm">
                    {feature.desc}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-12 py-5 overflow-hidden group"
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
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
              />
              
              <span className="relative z-10 flex items-center gap-3 text-black tracking-[0.2em]">
                COMMENCER MAINTENANT
                <ArrowRight size={20} />
              </span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Visual */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative"
        >
          {/* Floating Cards */}
          <div className="relative h-[600px]">
            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 2, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.05, rotate: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 luxury-glass p-8 border border-[#d4af37]/30 group cursor-pointer"
            >
              <motion.div
                animate={{
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="absolute inset-0 bg-[#d4af37] blur-2xl group-hover:opacity-50"
              />
              
              <div className="relative z-10">
                <motion.div 
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f0e68c] flex items-center justify-center mb-6"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Shield className="text-black" size={32} />
                </motion.div>
                <motion.h3 
                  className="text-white text-2xl mb-4" 
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  initial={{ opacity: 1 }}
                  whileHover={{ 
                    textShadow: "0 0 20px rgba(212, 175, 55, 0.8)",
                  }}
                >
                  Smart Contracts
                </motion.h3>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  Déployez des contrats intelligents sécurisés et automatisés pour vos applications décentralisées.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Sécurité</span>
                    <motion.span 
                      className="text-[#d4af37]"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      99.9%
                    </motion.span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "99%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, delay: 1 }}
                      className="h-full bg-gradient-to-r from-[#d4af37] to-[#f0e68c]"
                    />
                  </div>
                </div>
              </div>

              {/* Corner Decorations */}
              <motion.div 
                className="absolute top-0 left-0"
                initial={{ opacity: 0.5 }}
                whileHover={{ opacity: 1 }}
              >
                <svg width="60" height="60" className="text-[#d4af37] opacity-50 group-hover:opacity-100 transition-opacity">
                  <motion.line
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    x1="0" y1="0" x2="60" y2="0" stroke="currentColor" strokeWidth="1"
                  />
                  <motion.line
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 1.7 }}
                    x1="0" y1="0" x2="0" y2="60" stroke="currentColor" strokeWidth="1"
                  />
                </svg>
              </motion.div>
              <motion.div 
                className="absolute bottom-0 right-0"
                initial={{ opacity: 0.5 }}
                whileHover={{ opacity: 1 }}
              >
                <svg width="60" height="60" className="text-[#d4af37] opacity-50 group-hover:opacity-100 transition-opacity">
                  <motion.line
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 1.9 }}
                    x1="0" y1="60" x2="60" y2="60" stroke="currentColor" strokeWidth="1"
                  />
                  <motion.line
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 2.1 }}
                    x1="60" y1="0" x2="60" y2="60" stroke="currentColor" strokeWidth="1"
                  />
                </svg>
              </motion.div>
            </motion.div>

            {/* Floating Stat Card 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{
                y: [0, 15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="absolute top-10 right-10 luxury-glass px-6 py-4 border border-[#d4af37]/20 hover:border-[#d4af37]/60 transition-all cursor-pointer"
            >
              <p className="text-gray-400 text-sm mb-1">Transactions/sec</p>
              <motion.p 
                className="text-[#d4af37] text-2xl" 
                style={{ fontFamily: "'Playfair Display', serif" }}
                animate={{
                  textShadow: [
                    "0 0 10px rgba(212, 175, 55, 0.3)",
                    "0 0 20px rgba(212, 175, 55, 0.6)",
                    "0 0 10px rgba(212, 175, 55, 0.3)",
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                100K+
              </motion.p>
            </motion.div>

            {/* Floating Stat Card 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="absolute bottom-10 left-10 luxury-glass px-6 py-4 border border-[#d4af37]/20 hover:border-[#d4af37]/60 transition-all cursor-pointer"
            >
              <p className="text-gray-400 text-sm mb-1">Uptime</p>
              <motion.p 
                className="text-[#d4af37] text-2xl" 
                style={{ fontFamily: "'Playfair Display', serif" }}
                animate={{
                  textShadow: [
                    "0 0 10px rgba(212, 175, 55, 0.3)",
                    "0 0 20px rgba(212, 175, 55, 0.6)",
                    "0 0 10px rgba(212, 175, 55, 0.3)",
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5,
                }}
              >
                99.99%
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default SecondaryHero;