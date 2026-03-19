import { motion } from "motion/react";
import { TrendingUp, Shield, Sparkles, ArrowRight } from "lucide-react";

export function ThirdHero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black flex items-center py-20">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#f0e68c" />
            </linearGradient>
          </defs>
          {[...Array(20)].map((_, i) => (
            <motion.line
              key={i}
              x1={`${i * 5}%`}
              y1="0%"
              x2={`${i * 5}%`}
              y2="100%"
              stroke="url(#meshGradient)"
              strokeWidth="1"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: i * 0.05 }}
            />
          ))}
        </svg>
      </div>

      {/* Large Animated Orb */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#d4af37] to-[#f0e68c] rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 luxury-glass px-6 py-3 mb-12 border border-[#d4af37]/30"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="text-[#d4af37]" size={20} />
            </motion.div>
            <span className="text-[#d4af37] tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              INNOVATION RÉVOLUTIONNAIRE
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl lg:text-6xl mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="text-white">Investissez dans</span>
            <br />
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="inline-block"
              style={{
                background: 'linear-gradient(90deg, #d4af37, #f0e68c, #d4af37, #f0e68c)',
                backgroundSize: '300% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              L'Avenir Digital
            </motion.span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-300 max-w-4xl mx-auto mb-16 leading-relaxed"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Des opportunités d'investissement blockchain qui redéfinissent 
            les standards du marché financier traditionnel.
          </motion.p>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {[
              { icon: TrendingUp, value: "+247%", label: "ROI Annuel Moyen", color: "from-green-400 to-emerald-500" },
              { icon: Shield, value: "100%", label: "Sécurisé & Audité", color: "from-blue-400 to-cyan-500" },
              { icon: Sparkles, value: "24/7", label: "Support Premium", color: "from-purple-400 to-pink-500" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="relative luxury-glass p-8 border border-[#d4af37]/20 group cursor-pointer"
              >
                {/* Hover Glow */}
                <motion.div
                  animate={{
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} blur-2xl`}
                />

                <div className="relative z-10">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-6`}
                  >
                    <stat.icon className="text-white" size={28} />
                  </motion.div>

                  <motion.p
                    className="text-4xl md:text-5xl mb-3 gold-text-gradient"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {stat.value}
                  </motion.p>

                  <p className="text-gray-400 text-sm tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {stat.label}
                  </p>
                </div>

                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-12 py-5 overflow-hidden group"
            >
              <motion.div
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
              
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] to-[#f0e68c]" />
              
              <span className="relative z-10 flex items-center gap-3 text-black tracking-[0.2em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                INVESTIR MAINTENANT
                <ArrowRight size={20} />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-12 py-5 border-2 border-[#d4af37] text-[#d4af37] tracking-[0.2em] overflow-hidden group"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <span className="relative z-10 group-hover:text-black transition-colors duration-500">
                VOIR LE GUIDE
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ThirdHero;