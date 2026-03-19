import { motion } from "motion/react";

export function EnhancedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Animated Gradient Mesh */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#f0e68c" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0.3" />
            </linearGradient>
            
            <radialGradient id="glowGradient">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Grid Lines */}
          {[...Array(15)].map((_, i) => (
            <motion.line
              key={`v-${i}`}
              x1={`${(i + 1) * 6.66}%`}
              y1="0%"
              x2={`${(i + 1) * 6.66}%`}
              y2="100%"
              stroke="url(#gridGradient)"
              strokeWidth="0.5"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                pathLength: 1 
              }}
              transition={{
                opacity: {
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.1,
                },
                pathLength: {
                  duration: 2,
                  delay: i * 0.05,
                }
              }}
            />
          ))}
          
          {[...Array(10)].map((_, i) => (
            <motion.line
              key={`h-${i}`}
              x1="0%"
              y1={`${(i + 1) * 10}%`}
              x2="100%"
              y2={`${(i + 1) * 10}%`}
              stroke="url(#gridGradient)"
              strokeWidth="0.5"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                pathLength: 1 
              }}
              transition={{
                opacity: {
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.15,
                },
                pathLength: {
                  duration: 2,
                  delay: i * 0.05,
                }
              }}
            />
          ))}
          
          {/* Intersection Glows */}
          {[...Array(20)].map((_, i) => (
            <motion.circle
              key={`glow-${i}`}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r="3"
              fill="url(#glowGradient)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
      </div>

      {/* Floating Light Beams */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`beam-${i}`}
          className="absolute w-1 h-full"
          style={{
            left: `${20 + i * 15}%`,
            background: 'linear-gradient(180deg, transparent 0%, rgba(212, 175, 55, 0.1) 50%, transparent 100%)',
          }}
          animate={{
            opacity: [0, 0.3, 0],
            scaleY: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: i * 1.2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Radial Glow Effects */}
      <motion.div
        className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 150, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-0 right-0 w-[1000px] h-[1000px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(240, 230, 140, 0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, -150, 0],
          y: [0, -100, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Animated Particles Field */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-[#d4af37] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px #d4af37',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Vignette Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
        }}
      />
    </div>
  );
}

export default EnhancedBackground;