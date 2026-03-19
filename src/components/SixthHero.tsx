import { motion } from "motion/react";
import { Sparkles, Rocket, Star, Globe2 } from "lucide-react";
import spaceImage1 from "figma:asset/5d4cb14ae2e1795f7d4b6e4207134f042ae2b498.png";
import spaceImage2 from "figma:asset/d7d83dd8bfeb93c9c4d8e462baaaac7cd9ff4145.png";
import spaceImage3 from "figma:asset/ec3bef7a1dbbb53891932786dd22b081863ce7d9.png";

export function SixthHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black py-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src={spaceImage1} 
            alt="Space" 
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Top Decorative Line */}
            <div className="w-24 h-px bg-gradient-to-r from-[#d4af37] to-transparent mb-8" />

            {/* Subtitle with Icon */}
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="text-[#d4af37]" size={28} />
              <p
                className="text-[#d4af37] tracking-[0.4em] text-sm uppercase"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                L'Univers Blockchain
              </p>
            </div>

            {/* Main Title */}
            <h2
              className="mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="block text-4xl md:text-5xl lg:text-6xl mb-4 text-white">
                EXPLOREZ
              </span>
              <span className="text-white text-3xl md:text-4xl lg:text-5xl block mb-3">
                L'INFINI DES
              </span>
              <span className="gold-text-gradient text-4xl md:text-5xl lg:text-6xl block">
                POSSIBILITÉS
              </span>
            </h2>

            {/* Description */}
            <p
              className="text-gray-300 leading-relaxed mb-12 max-w-xl"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Découvrez un univers de solutions blockchain innovantes qui transforment 
              la finance décentralisée et ouvrent les portes vers un avenir numérique sans limites.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              {[
                { value: "∞", label: "Potentiel" },
                { value: "24/7", label: "Disponible" },
                { value: "100%", label: "Sécurisé" }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center"
                >
                  <div
                    className="text-4xl md:text-5xl text-[#d4af37] mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {stat.value}
                  </div>
                  <p
                    className="text-white/70 text-sm tracking-wider uppercase"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-12 py-5 bg-[#d4af37] overflow-hidden"
              >
                <span className="relative z-10 text-black tracking-[0.2em] uppercase flex items-center gap-3 justify-center" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Commencer
                  <Rocket size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-12 py-5 bg-transparent border-2 border-[#d4af37] text-[#d4af37] overflow-hidden transition-all duration-300 hover:bg-[#d4af37] hover:text-black"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <span className="relative z-10 tracking-[0.2em] uppercase">
                  En Savoir Plus
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Right Side - Visual Elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] lg:h-[700px]"
          >
            {/* Central Glow */}
            <div className="absolute inset-0 bg-[#d4af37] opacity-20 blur-[120px]" />

            {/* Main Visual Container */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
              {/* Center Image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96">
                <div
                  className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#d4af37]/30"
                  style={{
                    boxShadow: '0 0 60px rgba(212, 175, 55, 0.4)',
                  }}
                >
                  <img 
                    src={spaceImage2} 
                    alt="Earth" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Static Icons in Cardinal Positions */}
              {[
                { Icon: Globe2, top: '0%', left: '50%', translateX: '-50%', translateY: '-50%' },
                { Icon: Star, top: '50%', right: '0%', translateX: '50%', translateY: '-50%' },
                { Icon: Sparkles, bottom: '0%', left: '50%', translateX: '-50%', translateY: '50%' },
                { Icon: Rocket, top: '50%', left: '0%', translateX: '-50%', translateY: '-50%' },
              ].map(({ Icon, top, bottom, left, right, translateX, translateY }, index) => (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    top,
                    bottom,
                    left,
                    right,
                    transform: `translate(${translateX}, ${translateY})`,
                  }}
                >
                  <div
                    className="luxury-glass w-16 h-16 rounded-full flex items-center justify-center border border-[#d4af37]/30"
                    style={{
                      boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)',
                    }}
                  >
                    <Icon className="text-[#d4af37]" size={28} />
                  </div>
                </div>
              ))}

              {/* Static Rings */}
              {[1, 2, 3].map((ring) => (
                <div
                  key={ring}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d4af37]/15"
                  style={{
                    width: `${ring * 200}px`,
                    height: `${ring * 200}px`,
                  }}
                />
              ))}
            </div>

            {/* Floating Info Cards */}
            {[
              { label: "Innovation", value: "100%", top: "5%", right: "10%" },
              { label: "Performance", value: "Max", bottom: "10%", left: "5%" },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="absolute luxury-glass px-6 py-4 border border-[#d4af37]/30 transition-transform duration-300"
                style={{
                  top: item.top,
                  right: item.right,
                  left: item.left,
                  bottom: item.bottom,
                }}
              >
                <p
                  className="text-[#d4af37] text-2xl mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.value}
                </p>
                <p className="text-white text-xs tracking-wider uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {item.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-30" />
    </section>
  );
}

export default SixthHero;