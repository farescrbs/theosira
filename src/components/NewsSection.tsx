import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { LuxuryDivider } from "./LuxuryDivider";

export function NewsSection() {
  const news = [
    {
      category: "DeFi",
      title: "Nouvelle Génération de Smart Contracts",
      excerpt: "Découvrez nos protocoles DeFi révolutionnaires qui redéfinissent les standards de l'industrie blockchain.",
      date: "15 Nov 2024",
    },
    {
      category: "NFT",
      title: "Collection Premium Exclusive",
      excerpt: "Lancement imminent de notre collection NFT ultra-limitée réservée aux investisseurs THESORIA.",
      date: "12 Nov 2024",
    },
    {
      category: "Innovation",
      title: "Technologie Blockchain 3.0",
      excerpt: "THESORIA dévoile sa vision pour l'avenir de la blockchain avec des performances inégalées.",
      date: "8 Nov 2024",
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="newsPattern" width="100" height="100" patternUnits="userSpaceOnUse">
              <motion.path
                d="M0 50 Q25 25 50 50 T100 50"
                stroke="#d4af37"
                strokeWidth="0.5"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#newsPattern)" />
        </svg>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
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
              opacity: [0, 0.8, 0],
              scale: [0, 1.2, 0],
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
            Actualités
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
              DERNIÈRES NOUVELLES
            </motion.span>
          </motion.h2>
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 * index }}
              whileHover={{ scale: 1.03, y: -10 }}
              className="luxury-glass border border-[#d4af37]/20 hover:border-[#d4af37]/60 transition-all duration-500 group relative overflow-hidden cursor-pointer"
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
              <div className="relative z-10 p-8">
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="px-4 py-1.5 border border-[#d4af37]/40 bg-[#d4af37]/5 text-[#d4af37] text-xs tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {item.category}
                  </span>
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                    className="w-2 h-2 bg-[#d4af37] rounded-full"
                    style={{
                      boxShadow: '0 0 10px #d4af37',
                    }}
                  />
                </div>

                {/* Title */}
                <motion.h3
                  className="text-white text-2xl mb-4 group-hover:text-[#d4af37] transition-colors duration-300"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.title}
                </motion.h3>

                {/* Excerpt */}
                <p
                  className="text-gray-400 leading-relaxed mb-6"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {item.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-[#d4af37]/20">
                  <span
                    className="text-[#d4af37] text-sm tracking-wider"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {item.date}
                  </span>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="text-[#d4af37]" size={20} />
                  </motion.div>
                </div>
              </div>

              {/* Bottom Accent Line */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
              />
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center mt-16"
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
              Toutes les Actualités
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
        transition={{ duration: 1.5, delay: 1 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
      />
    </section>
  );
}

export default NewsSection;