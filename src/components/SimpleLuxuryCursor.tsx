// ═══════════════════════════════════════════════════════════════════════════
// ✨ CURSEUR LUXUEUX SIMPLIFIÉ - THESORIA
// Élégant et performant sans complexité excessive
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function SimpleLuxuryCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring fluide mais simple
  const springConfig = { damping: 30, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const interactiveElements = document.querySelectorAll('button, a, input, [role="button"]');
    
    window.addEventListener('mousemove', moveCursor);
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Masquer curseur par défaut
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      document.body.style.cursor = 'auto';
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Halo lumineux (fond) */}
      <motion.div
        className="fixed pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            scale: isHovering ? 2 : 1.5,
            opacity: isHovering ? 0.15 : 0.08,
          }}
          transition={{ duration: 0.3 }}
          style={{
            width: 60,
            height: 60,
            background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0) 70%)',
            filter: 'blur(20px)',
          }}
        />
      </motion.div>

      {/* Cercle principal */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full border-2"
          animate={{
            scale: isHovering ? 1.5 : 1,
            borderColor: isHovering ? '#f0e68c' : '#d4af37',
          }}
          transition={{ duration: 0.2 }}
          style={{
            width: 32,
            height: 32,
            boxShadow: isHovering 
              ? '0 0 20px rgba(212,175,55,0.6)'
              : '0 0 10px rgba(212,175,55,0.4)',
          }}
        />
      </motion.div>

      {/* Point central */}
      <motion.div
        className="fixed pointer-events-none z-[10000]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full bg-[#d4af37]"
          animate={{
            scale: isHovering ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
          style={{
            width: 4,
            height: 4,
            boxShadow: '0 0 8px rgba(212,175,55,1)',
          }}
        />
      </motion.div>
    </>
  );
}

export default SimpleLuxuryCursor;
