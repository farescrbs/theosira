import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
  hover?: boolean;
}

export function GlassmorphicCard({ 
  children, 
  className = '', 
  gradient = false,
  hover = true 
}: GlassmorphicCardProps) {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl
        ${gradient 
          ? 'bg-gradient-to-br from-black/40 via-black/30 to-black/40' 
          : 'bg-black/40'
        }
        backdrop-blur-xl
        border border-[#d4af37]/20
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={hover ? { 
        borderColor: 'rgba(212, 175, 55, 0.5)',
        y: -5,
        transition: { duration: 0.2 }
      } : {}}
      style={{
        boxShadow: `
          0 8px 32px 0 rgba(212, 175, 55, 0.1),
          0 0 1px 0 rgba(212, 175, 55, 0.2),
          inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)
        `
      }}
    >
      {/* Effet de reflet lumineux en haut */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />
      
      {/* Effet de brillance animé */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
        }}
      />

      {/* Contenu */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Coins dorés */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#d4af37]/30 rounded-tl-2xl" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#d4af37]/30 rounded-br-2xl" />
    </motion.div>
  );
}

export default GlassmorphicCard;
