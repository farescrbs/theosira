import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import type { LucideIcon } from "lucide-react";

/* ── Images spatiales partagées ── */
import moonEarthImage   from "figma:asset/276cea897d479014f3bb099096b244cf5ec2be4b.png";
import earthImage       from "figma:asset/c47fb4f835e4dc9598e9fd6b66ab6609a6b32133.png";
import earthNightImage  from "figma:asset/ca547bfc114d4a2a41ab021ccfd1497a3c6acede.png";
import earthAtmosImage  from "figma:asset/d2f04083bf369d8a3776c82e1e12d3c2f776a88c.png";

const BG_IMAGES = [earthAtmosImage, moonEarthImage, earthNightImage, earthImage];

/* ── Étoiles fixes ── */
const WHITE_STARS = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  x: (i * 1.1 * 137.508) % 100,
  y: (i * 0.9 * 97.3)   % 100,
  size: i % 5 === 0 ? 2 : 1,
  delay: (i * 0.13) % 5,
}));
const GOLD_STARS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: (i * 12.7 + 4) % 100,
  y: (i * 9.1  + 6) % 100,
  delay: (i * 0.5) % 4,
}));

/* ═══════════════════════════════════════
   TYPES
═══════════════════════════════════════ */
export interface PageHeroStat {
  label: string;
  value: string;
  color?: string;
}

export interface PageHeroProps {
  /** Étiquette au-dessus du titre (ex: "MARCHÉS · TEMPS RÉEL") */
  badge?: string;
  /** Icône Lucide affichée dans le badge */
  icon?: LucideIcon;
  /** Titre principal — peut contenir des sauts de ligne \n */
  title: string;
  /** Texte mis en valeur (gradient doré) intégré dans le titre */
  highlight?: string;
  /** Description sous le titre */
  description: string;
  /** Statistiques affichées sous la description */
  stats?: PageHeroStat[];
  /** Image unique à droite (optionnelle) */
  sideImage?: string;
  /** Index de l'image de fond (0-3), sinon rotation auto */
  bgImageIndex?: number;
}

/* ═══════════════════════════════════════
   SOUS-COMPOSANTS
═══════════════════════════════════════ */
function Star({ x, y, size, delay, gold = false }: {
  x: number; y: number; size: number; delay: number; gold?: boolean;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`, top: `${y}%`,
        width: size, height: size,
        background: gold ? "#d4af37" : "#fff",
        boxShadow: gold ? `0 0 ${size * 4}px rgba(212,175,55,0.7)` : "none",
      }}
      animate={{ opacity: [0, gold ? 0.9 : 0.75, 0], scale: [0.4, 1, 0.4] }}
      transition={{ duration: 2.5 + delay % 3, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function OrbitalRing({ size, duration, opacity, clockwise = true, color = "#d4af37", hasDot = false }: {
  size: number; duration: number; opacity: number; clockwise?: boolean; color?: string; hasDot?: boolean;
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ width: size, height: size, left: "50%", top: "50%", marginLeft: -size / 2, marginTop: -size / 2 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: `1px solid rgba(${color === "#d4af37" ? "212,175,55" : "100,160,255"},${opacity})` }}
        animate={{ rotate: clockwise ? 360 : -360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      />
      {hasDot && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ rotate: clockwise ? 360 : -360 }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="absolute"
            style={{
              width: 5, height: 5, background: "#d4af37", borderRadius: "50%",
              top: -2.5, left: "50%", marginLeft: -2.5,
              boxShadow: "0 0 8px #d4af37, 0 0 18px rgba(212,175,55,0.6)",
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════ */
export function PageHero({
  badge, icon: Icon, title, highlight, description, stats = [], sideImage, bgImageIndex,
}: PageHeroProps) {
  const [bgIdx, setBgIdx] = useState(bgImageIndex ?? 0);
  const [scanActive, setScan] = useState(false);

  /* Parallax */
  const { scrollY } = useScroll();
  const rawY     = useTransform(scrollY, [0, 600], [0, 120]);
  const rawScale = useTransform(scrollY, [0, 600], [1, 1.1]);
  const rawOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const bgY      = useSpring(rawY,     { stiffness: 55, damping: 18 });
  const bgScale  = useSpring(rawScale, { stiffness: 55, damping: 18 });

  /* Crossfade images auto si pas d'index fixe */
  useEffect(() => {
    if (bgImageIndex !== undefined) return;
    const id = setInterval(() => setBgIdx(p => (p + 1) % BG_IMAGES.length), 12000);
    return () => clearInterval(id);
  }, [bgImageIndex]);

  /* Scan line */
  useEffect(() => {
    const id = setInterval(() => {
      setScan(true);
      setTimeout(() => setScan(false), 1600);
    }, 16000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "68vh", minHeight: 520, maxHeight: 780 }}>

      {/* ── Fond noir ── */}
      <div className="absolute inset-0 bg-[#000008]" />

      {/* ── Crossfade images spatiales ── */}
      {BG_IMAGES.map((img, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: i === bgIdx ? 1 : 0 }}
          transition={{ duration: 3.5, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${img})`, y: bgY, scale: bgScale }}
          />
        </motion.div>
      ))}

      {/* ── Overlays gradient ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(180deg, rgba(0,0,8,0.55) 0%, rgba(0,0,8,0.3) 40%, rgba(0,0,8,0.72) 80%, rgba(0,0,8,0.97) 100%)"
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 65%)"
      }} />

      {/* ── Étoiles ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {WHITE_STARS.map(s => <Star key={s.id} x={s.x} y={s.y} size={s.size} delay={s.delay} />)}
        {GOLD_STARS.map(s  => <Star key={s.id} x={s.x} y={s.y} size={2} delay={s.delay} gold />)}
      </div>

      {/* ── Anneaux orbitaux centrés (décoratifs, très subtils) ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <OrbitalRing size={320} duration={50} opacity={0.06} clockwise />
        <OrbitalRing size={480} duration={75} opacity={0.04} clockwise={false} hasDot />
        <OrbitalRing size={660} duration={100} opacity={0.025} clockwise />
      </div>

      {/* ── Scan line ── */}
      <AnimatePresence>
        {scanActive && (
          <motion.div
            key="scan"
            className="absolute inset-x-0 pointer-events-none z-20"
            style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.6), #f0e68c, rgba(212,175,55,0.6), transparent)" }}
            initial={{ top: "-2%", opacity: 0 }}
            animate={{ top: "102%", opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "linear" }}
          />
        )}
      </AnimatePresence>

      {/* ── Sélecteur de fond (petits points) ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-auto">
        {BG_IMAGES.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setBgIdx(i)}
            animate={{ scale: i === bgIdx ? 1.4 : 1, opacity: i === bgIdx ? 1 : 0.35 }}
            transition={{ duration: 0.3 }}
            className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"
            style={{ boxShadow: i === bgIdx ? "0 0 8px #d4af37" : "none" }}
          />
        ))}
      </div>

      {/* ── HUD lines ── */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-px pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent 10%, rgba(212,175,55,0.15) 50%, transparent 90%)", marginLeft: "8%" }}
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.6, duration: 1.4 }}
      />
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-px pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent 10%, rgba(212,175,55,0.1) 50%, transparent 90%)", marginRight: "8%" }}
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.9, duration: 1.4 }}
      />

      {/* ══════════════════════════════════════
          CONTENU
      ══════════════════════════════════════ */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className={`grid gap-12 items-center ${sideImage ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 max-w-3xl"}`}>

            {/* Colonne texte */}
            <div>
              {/* Badge */}
              {badge && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="inline-flex items-center gap-2 mb-5"
                >
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{
                      background: "rgba(212,175,55,0.08)",
                      border: "1px solid rgba(212,175,55,0.25)",
                      backdropFilter: "blur(16px)",
                    }}
                  >
                    {Icon && (
                      <motion.div
                        animate={{ rotate: [0, 8, -8, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <Icon size={12} style={{ color: "#d4af37" }} />
                      </motion.div>
                    )}
                    <span style={{
                      fontFamily: "'Montserrat',sans-serif",
                      fontSize: 9, letterSpacing: "0.4em", fontWeight: 600,
                      color: "rgba(212,175,55,0.75)",
                    }}>
                      {badge}
                    </span>
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.6, 1.3, 0.6] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Titre */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="mb-5"
              >
                {highlight ? (
                  <h1 className="text-white" style={{ lineHeight: 1.1 }}>
                    {title.replace(highlight, "").split("__BEFORE__")[0]}
                    <motion.span
                      style={{
                        background: "linear-gradient(135deg, #cfe678 0%, #d4af37 40%, #f0e68c 60%, #d4af37 85%, #cfe678 100%)",
                        backgroundSize: "250% auto",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        display: "inline",
                      }}
                      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                      transition={{ duration: 6, repeat: Infinity }}
                    >
                      {highlight}
                    </motion.span>
                    {title.split(highlight)[1] || ""}
                  </h1>
                ) : (
                  <h1 style={{
                    background: "linear-gradient(135deg, #cfe678 0%, #d4af37 40%, #f0e68c 60%, #d4af37 85%, #cfe678 100%)",
                    backgroundSize: "250% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1.1,
                  }}>
                    {title}
                  </h1>
                )}
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.35 }}
                className="text-white/55 max-w-xl mb-7"
                style={{ fontFamily: "'Montserrat',sans-serif", lineHeight: 1.7 }}
              >
                {description}
              </motion.p>

              {/* Ligne décorative */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 1.2 }}
                className="mb-7 origin-left"
                style={{
                  height: 1,
                  width: 120,
                  background: "linear-gradient(90deg, #d4af37, rgba(212,175,55,0.2), transparent)",
                }}
              />

              {/* Stats */}
              {stats.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.8 }}
                  className="flex flex-wrap gap-3"
                >
                  {stats.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="px-4 py-2.5 rounded-xl"
                      style={{
                        background: "rgba(0,0,0,0.5)",
                        border: "1px solid rgba(212,175,55,0.18)",
                        backdropFilter: "blur(16px)",
                      }}
                    >
                      <div style={{
                        fontFamily: "'Montserrat',sans-serif",
                        fontSize: 7.5, letterSpacing: "0.3em",
                        color: "rgba(212,175,55,0.45)", marginBottom: 3,
                      }}>
                        {s.label}
                      </div>
                      <div style={{
                        fontFamily: "'Montserrat',sans-serif",
                        fontSize: 14, fontWeight: 700,
                        color: s.color ?? "#d4af37",
                      }}>
                        {s.value}
                      </div>
                      {/* bar animée */}
                      <motion.div
                        className="mt-1.5 h-px"
                        style={{ background: `linear-gradient(90deg, ${s.color ?? "#d4af37"}, transparent)` }}
                        animate={{ scaleX: [0.3, 1, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Image latérale optionnelle */}
            {sideImage && (
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="hidden lg:flex justify-center items-center relative"
              >
                <div className="relative">
                  {/* Halo */}
                  <motion.div
                    className="absolute -inset-8 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(ellipse, rgba(212,175,55,0.12) 0%, transparent 70%)" }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <motion.img
                    src={sideImage}
                    alt=""
                    className="relative w-64 h-64 object-cover rounded-full"
                    style={{
                      border: "1px solid rgba(212,175,55,0.2)",
                      boxShadow: "0 0 60px rgba(212,175,55,0.1), 0 0 120px rgba(0,0,0,0.6)",
                    }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* Anneau autour de l'image */}
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ border: "1px dashed rgba(212,175,55,0.2)", margin: -16 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bord inférieur ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3) 30%, rgba(212,175,55,0.6) 50%, rgba(212,175,55,0.3) 70%, transparent)" }}
      />
    </section>
  );
}

export default PageHero;
