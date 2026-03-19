import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Barre de progression en haut */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4af37] via-[#f0e68c] to-[#d4af37] origin-left z-[9999]"
        style={{ scaleX }}
      />
      
      {/* Effet glow */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4af37] via-[#f0e68c] to-[#d4af37] origin-left z-[9998] blur-xl opacity-50"
        style={{ scaleX }}
      />
    </>
  );
}

export default ScrollProgress;
