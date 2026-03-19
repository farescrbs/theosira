// ═══════════════════════════════════════════════════════════════════════════
// ✨ EFFET DE TRAÎNÉE DE PARTICULES - BONUS
// Particules dorées qui suivent le curseur avec physique réaliste
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

export function CursorTrailEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Adapter la taille du canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Couleurs dorées variées
    const colors = [
      '#d4af37',
      '#f0e68c',
      '#ffd700',
      '#ffec8b',
      '#daa520',
    ];

    // Créer une particule
    const createParticle = (x: number, y: number, speed: number) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 2 + speed * 0.1;
      
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
        size: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    };

    // Gérer le mouvement de la souris
    const handleMouseMove = (e: MouseEvent) => {
      const { lastX, lastY } = mouseRef.current;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      // Calculer la vitesse
      const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY);

      // Créer des particules selon la vitesse
      if (speed > 2) {
        const particleCount = Math.min(Math.floor(speed / 10), 5);
        for (let i = 0; i < particleCount; i++) {
          createParticle(e.clientX, e.clientY, speed);
        }
      }

      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Mettre à jour et dessiner les particules
      particlesRef.current = particlesRef.current.filter(particle => {
        // Mise à jour physique
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98; // Friction
        particle.vy += 0.1; // Gravité
        particle.life -= 0.02;
        particle.rotation += particle.rotationSpeed;

        if (particle.life <= 0) return false;

        // Dessiner la particule
        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);

        // Forme en étoile
        const spikes = 5;
        const outerRadius = particle.size;
        const innerRadius = particle.size / 2;

        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (Math.PI / spikes) * i;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();

        // Gradient pour chaque particule
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, outerRadius);
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fill();

        // Glow
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 2;
        ctx.fill();

        ctx.restore();

        return true;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9993]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

export default CursorTrailEffect;
