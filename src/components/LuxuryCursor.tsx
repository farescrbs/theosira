import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function LuxuryCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Ajouter les listeners sur les éléments interactifs
    const interactiveElements = document.querySelectorAll('button, a, input, [role="button"]');
    
    window.addEventListener('mousemove', moveCursor);
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Curseur principal */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="w-8 h-8 rounded-full border-2 border-[#d4af37]"
          animate={{
            scale: isHovering ? 1.5 : 1,
            borderColor: isHovering ? '#f0e68c' : '#d4af37',
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Effet de traînée dorée */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="w-12 h-12 rounded-full bg-[#d4af37]/20 blur-xl"
          animate={{
            scale: isHovering ? 2 : 1.2,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Point central */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10001]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"
            animate={{
              scale: isHovering ? 0 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </motion.div>
    </>
  );
}

export default LuxuryCursor;
