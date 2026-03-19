// ═══════════════════════════════════════════════════════════════════════════
// ✨ CURSEUR ULTRA-PREMIUM AAA - THESORIA
// Curseur personnalisé avec particules, magnétisme, et effets 3D
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';

interface CursorParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  color: string;
}

export function EnhancedLuxuryCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'text' | 'grab'>('default');
  const [particles, setParticles] = useState<CursorParticle[]>([]);
  const particleIdRef = useRef(0);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Configuration spring ultra-fluide
  const springConfig = { damping: 30, stiffness: 500, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  // Curseur secondaire avec plus de latence pour effet de traînée
  const trailSpringConfig = { damping: 35, stiffness: 200, mass: 0.8 };
  const trailXSpring = useSpring(cursorX, trailSpringConfig);
  const trailYSpring = useSpring(cursorY, trailSpringConfig);

  // Générer des particules
  const createParticle = (x: number, y: number) => {
    const colors = ['#d4af37', '#f0e68c', '#ffd700', '#ffec8b'];
    const particle: CursorParticle = {
      id: particleIdRef.current++,
      x,
      y,
      size: Math.random() * 4 + 2,
      opacity: 1,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    
    setParticles(prev => [...prev.slice(-20), particle]); // Garder max 20 particules
    
    // Supprimer la particule après animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== particle.id));
    }, 1000);
  };

  useEffect(() => {
    let particleInterval: NodeJS.Timeout;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      createParticle(cursorX.get(), cursorY.get());
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      setIsHovering(true);
      
      // Déterminer le type de curseur selon l'élément
      if (target.tagName === 'BUTTON' || target.role === 'button') {
        setCursorType('pointer');
      } else if (target.tagName === 'A') {
        setCursorType('pointer');
      } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setCursorType('text');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setCursorType('default');
    };

    // Ajouter les listeners
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    const interactiveElements = document.querySelectorAll(
      'button, a, input, textarea, [role="button"], [data-cursor="pointer"]'
    );
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Créer des particules périodiquement quand en mouvement
    let lastX = 0;
    let lastY = 0;
    particleInterval = setInterval(() => {
      const currentX = cursorX.get();
      const currentY = cursorY.get();
      const speed = Math.hypot(currentX - lastX, currentY - lastY);
      
      if (speed > 5) { // Si la souris bouge vite
        createParticle(currentX, currentY);
      }
      
      lastX = currentX;
      lastY = currentY;
    }, 50);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      
      clearInterval(particleInterval);
    };
  }, [cursorX, cursorY]);

  // Masquer le curseur par défaut
  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  if (!isVisible) return null;

  // Taille du curseur selon le type
  const getCursorSize = () => {
    if (isClicking) return 0.7;
    if (isHovering) {
      if (cursorType === 'pointer') return 1.8;
      if (cursorType === 'text') return 1.3;
      return 1.5;
    }
    return 1;
  };

  return (
    <>
      {/* Particules animées */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="fixed pointer-events-none z-[10000]"
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              x: particle.x + (Math.random() - 0.5) * 100,
              y: particle.y + (Math.random() - 0.5) * 100 - 50,
              scale: 0,
              opacity: 0,
              rotate: particle.rotation,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <div
              className="rounded-full blur-sm"
              style={{
                width: particle.size,
                height: particle.size,
                background: particle.color,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Halo externe (le plus grand) */}
      <motion.div
        className="fixed pointer-events-none z-[9997]"
        style={{
          x: trailYSpring,
          y: trailXSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            scale: isHovering ? 2.5 : 1.5,
            opacity: isHovering ? 0.15 : 0.08,
          }}
          transition={{ duration: 0.4 }}
          style={{
            width: 80,
            height: 80,
            background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0) 70%)',
            filter: 'blur(20px)',
          }}
        />
      </motion.div>

      {/* Cercle de traînée avec gradient */}
      <motion.div
        className="fixed pointer-events-none z-[9998]"
        style={{
          x: trailXSpring,
          y: trailYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full border-2"
          animate={{
            scale: getCursorSize() * 1.3,
            borderColor: isHovering ? '#f0e68c' : '#d4af37',
            opacity: isHovering ? 0.6 : 0.4,
          }}
          transition={{ duration: 0.3 }}
          style={{
            width: 50,
            height: 50,
            borderWidth: 2,
            background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0) 70%)',
          }}
        />
      </motion.div>

      {/* Cercle principal doré avec effet 3D */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full border-2 relative"
          animate={{
            scale: getCursorSize(),
            borderColor: isClicking 
              ? '#ffd700' 
              : isHovering 
                ? '#f0e68c' 
                : '#d4af37',
            rotate: isHovering ? 90 : 0,
          }}
          transition={{ 
            duration: 0.2,
            rotate: { duration: 0.6, ease: 'easeOut' }
          }}
          style={{
            width: 40,
            height: 40,
            boxShadow: isHovering 
              ? '0 0 30px rgba(212,175,55,0.8), inset 0 0 20px rgba(212,175,55,0.3)'
              : '0 0 15px rgba(212,175,55,0.5)',
          }}
        >
          {/* Effet de brillance rotatif */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Point central avec pulse */}
      <motion.div
        className="fixed pointer-events-none z-[10001]"
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
            scale: isClicking ? 2 : isHovering ? 0 : 1,
            opacity: isClicking ? 0 : isHovering ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
          style={{
            width: 6,
            height: 6,
            boxShadow: '0 0 10px rgba(212,175,55,1)',
          }}
        />
      </motion.div>

      {/* Texte indicateur pour les boutons */}
      <AnimatePresence>
        {isHovering && cursorType === 'pointer' && (
          <motion.div
            className="fixed pointer-events-none z-[10002] text-[#d4af37] text-xs font-semibold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: '20px',
              translateY: '-30px',
              fontFamily: "'Montserrat', sans-serif",
              textShadow: '0 0 10px rgba(212,175,55,0.8)',
            }}
          >
            CLIQUER
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cercles concentriques lors du clic */}
      <AnimatePresence>
        {isClicking && (
          <>
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.div
                key={i}
                className="fixed pointer-events-none z-[9996] rounded-full border-2 border-[#d4af37]"
                initial={{ 
                  x: cursorX.get(),
                  y: cursorY.get(),
                  translateX: '-50%',
                  translateY: '-50%',
                  scale: 0.5,
                  opacity: 0.8,
                  width: 40,
                  height: 40,
                }}
                animate={{
                  scale: 3,
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.8,
                  delay,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Étoiles dorées qui apparaissent aléatoirement */}
      <AnimatePresence>
        {isHovering && cursorType === 'pointer' && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="fixed pointer-events-none z-[10000]"
                initial={{
                  x: cursorX.get(),
                  y: cursorY.get(),
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  x: cursorX.get() + Math.cos((i * Math.PI) / 2) * 30,
                  y: cursorY.get() + Math.sin((i * Math.PI) / 2) * 30,
                  scale: [0, 1, 0],
                  rotate: 360,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              >
                <div
                  className="text-[#d4af37]"
                  style={{
                    fontSize: 8,
                    filter: 'drop-shadow(0 0 5px rgba(212,175,55,0.8))',
                  }}
                >
                  ✦
                </div>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default EnhancedLuxuryCursor;
