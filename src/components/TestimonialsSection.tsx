import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Alexandre Dubois",
      role: "CEO, Crypto Ventures",
      content: "THESORIA a transformé notre approche de la blockchain. L'excellence technique et le service premium dépassent toutes nos attentes.",
      rating: 5,
    },
    {
      name: "Sophie Laurent",
      role: "Investment Director",
      content: "Une plateforme d'exception qui allie sécurité maximale et performances remarquables. Un partenaire de confiance absolu.",
      rating: 5,
    },
    {
      name: "Marc Chen",
      role: "Blockchain Entrepreneur",
      content: "L'innovation et le professionnalisme de THESORIA ont propulsé nos projets DeFi vers de nouveaux sommets.",
      rating: 5,
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="testimonialGlow">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
            </radialGradient>
          </defs>
          {[...Array(15)].map((_, i) => (
            <motion.circle
              key={i}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r="50"
              fill="url(#testimonialGlow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 2, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#d4af37] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px #d4af37',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
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
            Témoignages
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
              ILS NOUS FONT CONFIANCE
            </motion.span>
          </motion.h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 * index }}
              whileHover={{ scale: 1.03, y: -10 }}
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
                {/* Quote Icon */}
                <motion.div
                  animate={{
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                  className="mb-6"
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 20C10 15 12 10 18 8V12C15 13 14 15 14 17H18V26H10V20ZM26 20C26 15 28 10 34 8V12C31 13 30 15 30 17H34V26H26V20Z"
                      fill="#d4af37"
                      opacity="0.5"
                    />
                  </svg>
                </motion.div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                    >
                      <Star className="text-[#d4af37] fill-[#d4af37]" size={18} />
                    </motion.div>
                  ))}
                </div>

                {/* Content */}
                <p
                  className="text-gray-300 mb-8 leading-relaxed italic"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="border-t border-[#d4af37]/20 pt-6">
                  <p
                    className="text-white mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {testimonial.name}
                  </p>
                  <p
                    className="text-[#d4af37] text-sm tracking-wider"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {testimonial.role}
                  </p>
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
        transition={{ duration: 1.5, delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
      />
    </section>
  );
}

export default TestimonialsSection;