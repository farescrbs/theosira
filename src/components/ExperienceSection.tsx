import { Award, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const experiences = [
  {
    id: 1,
    title: "INNOVATION",
    description: "Des technologies de pointe pour des solutions blockchain révolutionnaires",
    image: "https://images.unsplash.com/photo-1737731662588-729f42147158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBvZmZpY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MjQ2MDA1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: Zap,
  },
  {
    id: 2,
    title: "EXCELLENCE",
    description: "Un savoir-faire inégalé au service de votre vision numérique",
    image: "https://images.unsplash.com/photo-1572457598110-2e060c4588ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjIzNzc0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: Award,
  },
];

const stats = [
  { number: "10+", label: "Années d'Excellence" },
  { number: "500K+", label: "Utilisateurs Actifs" },
  { number: "$5B+", label: "Volume Traité" },
  { number: "99.9%", label: "Taux de Satisfaction" },
];

export function ExperienceSection() {
  return (
    <section className="relative py-32 overflow-hidden bg-black">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="experienceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f0e68c" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {[...Array(20)].map((_, i) => (
            <motion.circle
              key={i}
              cx={`${(i % 5) * 20 + 10}%`}
              cy={`${Math.floor(i / 5) * 25 + 12.5}%`}
              r="2"
              fill="url(#experienceGradient)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.5, 0],
                opacity: [0, 0.8, 0] 
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </svg>
      </div>

      {/* Radial Glow Effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-[#d4af37] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 12px #d4af37',
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 0.9, 0],
              scale: [0, 1.3, 0],
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
            Notre Impact
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
              CHIFFRES CLÉS
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Une décennie d'innovation et d'excellence dans l'écosystème blockchain,
            au service d'une communauté mondiale d'investisseurs exigeants.
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              whileHover={{ scale: 1.08, y: -15 }}
              className="luxury-glass p-10 border border-[#d4af37]/20 hover:border-[#d4af37]/60 transition-all duration-500 group relative overflow-hidden text-center"
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
                {/* Number */}
                <motion.div
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(212, 175, 55, 0.3)',
                      '0 0 40px rgba(212, 175, 55, 0.6)',
                      '0 0 20px rgba(212, 175, 55, 0.3)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="text-6xl md:text-7xl mb-4 text-[#d4af37]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {stat.number}
                </motion.div>

                {/* Label */}
                <p 
                  className="text-white tracking-[0.15em] uppercase text-sm"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {stat.label}
                </p>

                {/* Decorative Line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  className="w-16 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-6"
                />
              </div>

              {/* Pulsing Corner Accents */}
              <motion.div
                animate={{
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
                className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#d4af37]"
              />
              <motion.div
                animate={{
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2 + 0.5,
                }}
                className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#d4af37]"
              />

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
        transition={{ duration: 1.5, delay: 0.6 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
      />
    </section>
  );
}

export default ExperienceSection;