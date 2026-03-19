// ═══════════════════════════════════════════════════════════════════════════
// 🧲 CURSEUR MAGNÉTIQUE ULTRA-PREMIUM - THESORIA
// Curseur avec attraction magnétique vers les boutons et effets avancés
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface MagneticElement {
  element: HTMLElement;
  rect: DOMRect;
  magneticStrength: number;
}

export function MagneticCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [magneticTarget, setMagneticTarget] = useState<MagneticElement | null>(null);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const rippleIdRef = useRef(0);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Curseur principal avec spring ultra-smooth
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  
  // Curseur de traînée
  const trailConfig = { damping: 30, stiffness: 150, mass: 1 };
  const trailX = useSpring(mouseX, trailConfig);
  const trailY = useSpring(mouseY, trailConfig);
  
  // Rotation basée sur le mouvement
  const cursorRotate = useTransform(
    [cursorX, cursorY],
    ([latestX, latestY]) => {
      const deltaX = latestX - mouseX.getPrevious();
      const deltaY = latestY - mouseY.getPrevious();
      return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    }
  );

  // Créer un effet ripple au clic
  const createRipple = useCallback((x: number, y: number) => {
    const ripple = { id: rippleIdRef.current++, x, y };
    setRipples(prev => [...prev, ripple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 1000);
  }, []);

  // Calculer l'attraction magnétique
  const updateMagneticForce = useCallback((clientX: number, clientY: number) => {
    const magneticElements = document.querySelectorAll('[data-magnetic="true"], button, a');
    let closestElement: MagneticElement | null = null;
    let minDistance = Infinity;

    magneticElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const rect = htmlEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(clientX - centerX, clientY - centerY);
      
      // Zone d'attraction (150px autour du bouton)
      const magneticRadius = 150;
      
      if (distance < magneticRadius && distance < minDistance) {
        minDistance = distance;
        const strength = 1 - (distance / magneticRadius); // Plus proche = plus fort
        closestElement = {
          element: htmlEl,
          rect,
          magneticStrength: strength,
        };
      }
    });

    setMagneticTarget(closestElement);

    if (closestElement) {
      const centerX = closestElement.rect.left + closestElement.rect.width / 2;
      const centerY = closestElement.rect.top + closestElement.rect.height / 2;
      
      // Attirer le curseur vers le centre
      const pullStrength = closestElement.magneticStrength * 0.3;
      const targetX = clientX + (centerX - clientX) * pullStrength;
      const targetY = clientY + (centerY - clientY) * pullStrength;
      
      mouseX.set(targetX);
      mouseY.set(targetY);
    } else {
      mouseX.set(clientX);
      mouseY.set(clientY);
    }
  }, [mouseX, mouseY]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updateMagneticForce(e.clientX, e.clientY);
      setIsVisible(true);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      createRipple(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const interactiveElements = document.querySelectorAll('button, a, input, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Masquer curseur par défaut
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      document.body.style.cursor = 'auto';
    };
  }, [updateMagneticForce, createRipple]);

  if (!isVisible) return null;

  const cursorScale = isClicking ? 0.8 : isHovering ? 1.5 : 1;

  return (
    <>
      {/* Ripples au clic */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="fixed pointer-events-none z-[9995]"
          initial={{
            x: ripple.x,
            y: ripple.y,
            translateX: '-50%',
            translateY: '-50%',
            scale: 0,
            opacity: 0.6,
          }}
          animate={{
            scale: 4,
            opacity: 0,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div
            className="rounded-full border-2 border-[#d4af37]"
            style={{
              width: 60,
              height: 60,
              boxShadow: '0 0 30px rgba(212,175,55,0.6)',
            }}
          />
        </motion.div>
      ))}

      {/* Halo lumineux externe */}
      <motion.div
        className="fixed pointer-events-none z-[9996]"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 3 : 2,
            opacity: isHovering ? 0.2 : 0.1,
          }}
          transition={{ duration: 0.4 }}
          className="rounded-full"
          style={{
            width: 100,
            height: 100,
            background: 'radial-gradient(circle, rgba(212,175,55,0.6) 0%, rgba(212,175,55,0) 70%)',
            filter: 'blur(30px)',
          }}
        />
      </motion.div>

      {/* Cercle de traînée secondaire */}
      <motion.div
        className="fixed pointer-events-none z-[9997]"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full border-2 border-[#d4af37]/40"
          animate={{
            scale: cursorScale * 1.4,
            rotate: 180,
          }}
          transition={{ 
            scale: { duration: 0.3 },
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' }
          }}
          style={{
            width: 60,
            height: 60,
          }}
        />
      </motion.div>

      {/* Curseur principal avec gradient animé */}
      <motion.div
        className="fixed pointer-events-none z-[9998]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="relative rounded-full"
          animate={{
            scale: cursorScale,
          }}
          style={{
            rotate: cursorRotate,
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Cercle principal */}
          <motion.div
            className="rounded-full border-3"
            animate={{
              borderColor: isClicking 
                ? '#ffd700' 
                : magneticTarget 
                  ? '#f0e68c'
                  : isHovering 
                    ? '#f0e68c' 
                    : '#d4af37',
            }}
            style={{
              width: 50,
              height: 50,
              borderWidth: 3,
              boxShadow: magneticTarget
                ? '0 0 40px rgba(212,175,55,1), inset 0 0 20px rgba(212,175,55,0.3)'
                : isHovering
                  ? '0 0 25px rgba(212,175,55,0.8)'
                  : '0 0 15px rgba(212,175,55,0.5)',
            }}
          >
            {/* Gradient tournant */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-50"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, #d4af37 50%, transparent 100%)',
              }}
            />
          </motion.div>

          {/* Lignes directionnelles */}
          {magneticTarget && (
            <>
              {[0, 90, 180, 270].map((angle, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-[#d4af37] rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.6, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  style={{
                    width: 2,
                    height: 20,
                    left: '50%',
                    top: '50%',
                    transformOrigin: 'center',
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-25px)`,
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Point central brillant */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full bg-[#d4af37]"
          animate={{
            scale: isClicking ? 3 : isHovering ? 0 : 1,
            opacity: isClicking ? 0.5 : isHovering ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
          style={{
            width: 8,
            height: 8,
            boxShadow: '0 0 15px rgba(212,175,55,1), 0 0 30px rgba(212,175,55,0.5)',
          }}
        />
      </motion.div>

      {/* Particules orbitales autour du curseur */}
      {isHovering && (
        <>
          {[0, 120, 240].map((angle, i) => (
            <motion.div
              key={i}
              className="fixed pointer-events-none z-[10000]"
              style={{
                x: cursorX,
                y: cursorY,
              }}
            >
              <motion.div
                animate={{
                  x: Math.cos((angle * Math.PI) / 180) * 40,
                  y: Math.sin((angle * Math.PI) / 180) * 40,
                  rotate: 360,
                }}
                transition={{
                  x: { duration: 2, repeat: Infinity, ease: 'linear' },
                  y: { duration: 2, repeat: Infinity, ease: 'linear' },
                  rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                }}
              >
                <div
                  className="rounded-full bg-[#d4af37]"
                  style={{
                    width: 4,
                    height: 4,
                    boxShadow: '0 0 10px rgba(212,175,55,0.8)',
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </>
      )}

      {/* Indicateur de force magnétique */}
      {magneticTarget && (
        <motion.div
          className="fixed pointer-events-none z-[10001] text-[#d4af37] text-xs font-bold tracking-wider"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{
            x: cursorX,
            y: cursorY,
            translateX: '-50%',
            translateY: '40px',
            fontFamily: "'Montserrat', sans-serif",
            textShadow: '0 0 10px rgba(212,175,55,1)',
          }}
        >
          🧲 ATTIRÉ
        </motion.div>
      )}

      {/* Effet de traînée de particules */}
      <motion.div
        className="fixed pointer-events-none z-[9994]"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="rounded-full bg-gradient-to-r from-[#d4af37] to-[#f0e68c]"
          style={{
            width: 80,
            height: 80,
            filter: 'blur(25px)',
          }}
        />
      </motion.div>
    </>
  );
}

export default MagneticCursor;
