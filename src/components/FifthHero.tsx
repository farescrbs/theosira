import { motion } from "motion/react";
import { Globe, Network, Zap, Shield, TrendingUp } from "lucide-react";
import earthView from "figma:asset/d7d83dd8bfeb93c9c4d8e462baaaac7cd9ff4145.png";
import earthCenter from "figma:asset/f2c8edbbb3b86a52a96e4b14d456ffcee87ec84f.png";
import earthSpace from "figma:asset/5d4cb14ae2e1795f7d4b6e4207134f042ae2b498.png";

export function FifthHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black py-20">
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2 }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${earthSpace})`,
            filter: 'brightness(0.4)',
          }}
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </motion.div>

      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <motion.path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="#d4af37"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Globe className="text-[#d4af37]" size={32} />
              </motion.div>
              <div className="h-px flex-1 bg-gradient-to-r from-[#d4af37] to-transparent" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-[#d4af37] tracking-[0.4em] mb-6 uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Réseau Mondial
            </motion.p>

            {/* Main Title */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mb-8"
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
                className="block text-4xl md:text-5xl lg:text-6xl mb-4"
                style={{
                  background: 'linear-gradient(90deg, #fff 0%, #d4af37 25%, #f0e68c 50%, #d4af37 75%, #fff 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                BLOCKCHAIN
              </motion.span>
              <span className="text-white text-3xl md:text-4xl lg:text-5xl block">
                SANS FRONTIÈRES
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-gray-300 text-lg leading-relaxed mb-12 max-w-xl"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Connectez-vous à un réseau décentralisé qui transcende les frontières, 
              unifiant les marchés mondiaux dans un écosystème blockchain sécurisé et transparent.
            </motion.p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                {
                  icon: Network,
                  title: "Réseau Décentralisé",
                  description: "Nodes mondiaux interconnectés"
                },
                {
                  icon: Shield,
                  title: "Sécurité Maximale",
                  description: "Protection cryptographique"
                },
                {
                  icon: Zap,
                  title: "Transactions Rapides",
                  description: "Vitesse exceptionnelle"
                },
                {
                  icon: TrendingUp,
                  title: "Croissance Continue",
                  description: "Expansion mondiale"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="luxury-glass p-6 border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Hover Background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  
                  <div className="relative z-10">
                    <feature.icon className="text-[#d4af37] mb-3 group-hover:scale-110 transition-transform duration-300" size={28} />
                    <h4 className="text-white mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {feature.title}
                    </h4>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.9 }}
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
                <span className="relative z-10 tracking-[0.2em] uppercase">
                  Rejoindre le Réseau
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Side - Image Composition */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-[600px] lg:h-[700px]"
          >
            {/* Glowing Background */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
              }}
              className="absolute inset-0 bg-[#d4af37] blur-3xl"
            />

            {/* Main Earth Image (Center) */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-96 md:h-96"
            >
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="relative w-full h-full"
              >
                <img 
                  src={earthCenter} 
                  alt="Earth" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  style={{
                    filter: 'drop-shadow(0 0 40px rgba(212, 175, 55, 0.6))',
                  }}
                />
                
                {/* Rotating Ring */}
                <motion.div
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0"
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="url(#ringGradient)"
                      strokeWidth="1"
                      strokeDasharray="5 10"
                      opacity="0.6"
                    />
                    <defs>
                      <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d4af37" />
                        <stop offset="100%" stopColor="#f0e68c" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
                  <stop offset="50%" stopColor="#d4af37" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[...Array(12)].map((_, i) => {
                const startAngle = (i * 360) / 12;
                return (
                  <motion.line
                    key={i}
                    x1="50%"
                    y1="50%"
                    x2={`${50 + Math.cos((startAngle * Math.PI) / 180) * 40}%`}
                    y2={`${50 + Math.sin((startAngle * Math.PI) / 180) * 40}%`}
                    stroke="url(#lineGradient)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: [0, 1, 0],
                      opacity: [0, 0.8, 0] 
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.25,
                    }}
                  />
                );
              })}
            </svg>

            {/* Floating Info Cards */}
            {[
              { label: "200+", text: "Pays", top: "10%", left: "10%" },
              { label: "50M+", text: "Utilisateurs", top: "15%", right: "5%" },
              { label: "24/7", text: "Actif", bottom: "15%", left: "5%" },
              { label: "99.9%", text: "Uptime", bottom: "10%", right: "10%" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="absolute luxury-glass px-4 py-3 border border-[#d4af37]/30"
                style={{
                  top: item.top,
                  left: item.left,
                  right: item.right,
                  bottom: item.bottom,
                }}
              >
                <motion.p
                  animate={{
                    textShadow: [
                      '0 0 10px rgba(212, 175, 55, 0.5)',
                      '0 0 20px rgba(212, 175, 55, 0.8)',
                      '0 0 10px rgba(212, 175, 55, 0.5)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="text-[#d4af37] text-xl mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.label}
                </motion.p>
                <p className="text-white text-xs tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {item.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
    </section>
  );
}

export default FifthHero;