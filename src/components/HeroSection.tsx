import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useFlashLoanBot } from "../hooks/useFlashLoanBot";
import { formatCurrency, formatNumber } from "../hooks/useFlashLoanStats";
import { Link } from "react-router";
import { ArrowRight, Zap, TrendingUp, Shield, Globe, Lock, Cpu } from "lucide-react";

/* ── Images spatiales ── */
import moonEarthImage from "figma:asset/276cea897d479014f3bb099096b244cf5ec2be4b.png";
import earthImage    from "figma:asset/c47fb4f835e4dc9598e9fd6b66ab6609a6b32133.png";
import earthNightImage from "figma:asset/ca547bfc114d4a2a41ab021ccfd1497a3c6acede.png";
import earthAtmosImage from "figma:asset/d2f04083bf369d8a3776c82e1e12d3c2f776a88c.png";
import heroImage1    from "figma:asset/94f91bfbc8dbf2f8c8e7f8b1eecf4b435393110b.png";
import heroImage2    from "figma:asset/1038fd06bb6a401b3dca9a9772bad37538621417.png";
import heroImage3    from "figma:asset/5f51e538d29b254ba38cbdf38d07e02ba7eafc79.png";
import heroImage4    from "figma:asset/2ea33df8ef9972a17e1b1dc9a9411736a1a891c4.png";
import heroImage5    from "figma:asset/d7d83dd8bfeb93c9c4d8e462baaaac7cd9ff4145.png";
import heroImage6    from "figma:asset/e9551396a03238c73b4494cf8da3551b77ea7b0a.png";

/* ════════���══════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */

/* Étoile scintillante */
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
        boxShadow: gold ? `0 0 ${size * 3}px rgba(212,175,55,0.6)` : "none",
      }}
      animate={{ opacity: [0, gold ? 1 : 0.85, 0], scale: [0.4, 1, 0.4] }}
      transition={{ duration: 2 + delay % 3, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* Anneau orbital */
function OrbitalRing({
  size, duration, opacity, clockwise = true, dotColor,
}: {
  size: number; duration: number; opacity: number; clockwise?: boolean; dotColor?: string;
}) {
  return (
    <div className="absolute pointer-events-none" style={{ width: size, height: size, left: "50%", top: "50%", marginLeft: -size / 2, marginTop: -size / 2 }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: `1px solid rgba(212,175,55,${opacity})` }}
        animate={{ rotate: clockwise ? 360 : -360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      />
      {dotColor && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ rotate: clockwise ? 360 : -360 }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="absolute"
            style={{
              width: 6, height: 6,
              background: dotColor,
              borderRadius: "50%",
              top: 0, left: "50%",
              marginLeft: -3, marginTop: -3,
              boxShadow: `0 0 8px ${dotColor}, 0 0 20px ${dotColor}80`,
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

/* Ligne HUD */
function HUDLine({ vertical = false, length = 60, opacity = 0.15, delay = 0 }: {
  vertical?: boolean; length?: number; opacity?: number; delay?: number;
}) {
  return (
    <motion.div
      initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
      animate={{ scaleX: 1, scaleY: 1, opacity }}
      transition={{ delay, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: vertical ? 1 : length,
        height: vertical ? length : 1,
        background: vertical
          ? "linear-gradient(180deg, transparent, rgba(212,175,55,0.8), transparent)"
          : "linear-gradient(90deg, transparent, rgba(212,175,55,0.8), transparent)",
      }}
    />
  );
}

/* ═══════════════════════════════════════════
   CONSTANTES ALÉATOIRES (stable au mount)
═══════════════════════════════════════════ */
const BG_IMAGES = [moonEarthImage, earthImage, earthNightImage, earthAtmosImage];

/* Données statiques pour les étoiles — calculées une seule fois */
const WHITE_STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: (i * 1.1 * 137.508) % 100,
  y: (i * 0.9 * 97.3) % 55,
  size: i % 5 === 0 ? 2 : 1,
  delay: (i * 0.13) % 5,
}));
const GOLD_STARS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: (i * 8.7 + 5) % 100,
  y: (i * 6.2 + 3) % 45,
  size: 2,
  delay: (i * 0.4) % 4,
}));

const slideImages = [heroImage1, heroImage2, heroImage3, heroImage4, heroImage5, heroImage6];

/* ═══════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════ */
export function HeroSection() {
  const [bgIndex, setBgIndex]     = useState(0);
  const [slideIdx, setSlideIdx]   = useState(0);
  const [mounted, setMounted]     = useState(false);
  const [scanActive, setScan]     = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { totalProfit, successRate, recentTrades } = useFlashLoanBot();

  /* Parallax */
  const { scrollY } = useScroll();
  const rawBgY     = useTransform(scrollY, [0, 800], [0, 160]);
  const rawBgScale = useTransform(scrollY, [0, 800], [1, 1.12]);
  const rawContentY = useTransform(scrollY, [0, 500], [0, -70]);
  const contentOpacity = useTransform(scrollY, [0, 420], [1, 0]);
  const bgY     = useSpring(rawBgY,     { stiffness: 60, damping: 20 });
  const bgScale = useSpring(rawBgScale, { stiffness: 60, damping: 20 });
  const contentY = useSpring(rawContentY, { stiffness: 60, damping: 20 });

  useEffect(() => { setMounted(true); }, []);

  /* Crossfade des deux images de fond toutes les 10s */
  useEffect(() => {
    const id = setInterval(() => setBgIndex(p => (p + 1) % BG_IMAGES.length), 10000);
    return () => clearInterval(id);
  }, []);

  /* Slideshow coin */
  useEffect(() => {
    const id = setInterval(() => setSlideIdx(p => (p + 1) % slideImages.length), 7000);
    return () => clearInterval(id);
  }, []);

  /* Scan line périodique */
  useEffect(() => {
    const id = setInterval(() => { setScan(true); setTimeout(() => setScan(false), 1600); }, 14000);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={heroRef} className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: 700 }}>

      {/* ═══ FOND NOIR ABSOLU ═══ */}
      <div className="absolute inset-0 bg-[#000005]" />

      {/* ═══ ÉTOILES ═══ */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {mounted && WHITE_STARS.map(s => <Star key={`w${s.id}`} {...s} />)}
        {mounted && GOLD_STARS.map(s  => <Star key={`g${s.id}`} {...s} gold />)}
      </div>

      {/* ═══ BACKGROUND CROSSFADE — DEUX IMAGES SPATIALES ═══ */}
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0 z-[2] origin-bottom">
        <AnimatePresence mode="sync">
          <motion.img
            key={bgIndex}
            src={BG_IMAGES[bgIndex]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: bgIndex === 0 ? "50% 40%" : "50% 55%",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.5, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Calque 1 — Noircissement haut (espace) + bas */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.6) 22%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.82) 82%, rgba(0,0,0,0.99) 100%)",
        }} />

        {/* Calque 2 — Vignette radiale */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 110% 100% at 50% 50%, transparent 30%, rgba(0,0,5,0.75) 100%)",
        }} />

        {/* Calque 3 — Halo or sur l'atmosphère */}
        <motion.div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 25% at 50% 42%, rgba(212,175,55,0.07) 0%, transparent 80%)" }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Calque 4 — Lueur bleue atmosphère (renforce l'image ISS) */}
        <motion.div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 20% at 50% 47%, rgba(30,120,255,0.06) 0%, transparent 70%)" }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ═══ ANNEAUX ORBITAUX ═══ */}
      <div className="absolute inset-0 z-[3] pointer-events-none flex items-center justify-center">
        <OrbitalRing size={400}  duration={28}  opacity={0.10} clockwise  dotColor="#d4af37" />
        <OrbitalRing size={620}  duration={50}  opacity={0.06} clockwise={false} dotColor="rgba(100,180,255,0.8)" />
        <OrbitalRing size={900}  duration={80}  opacity={0.035} clockwise />
        <OrbitalRing size={1200} duration={120} opacity={0.02} clockwise={false} />
        {/* Croix centrale */}
        <div className="absolute flex items-center justify-center">
          <motion.div className="absolute w-px h-10" style={{ background: "linear-gradient(180deg,transparent,rgba(212,175,55,0.5),transparent)" }}
            animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
          <motion.div className="absolute h-px w-10" style={{ background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.5),transparent)" }}
            animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} />
          <motion.div className="w-2 h-2 rounded-full" style={{ background: "#d4af37", boxShadow: "0 0 12px #d4af37, 0 0 30px rgba(212,175,55,0.5)" }}
            animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />
        </div>
      </div>

      {/* ═══ SCAN LINE ═══ */}
      <AnimatePresence>
        {scanActive && (
          <motion.div
            className="absolute inset-x-0 z-[15] pointer-events-none"
            style={{ height: 2, background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.3),rgba(212,175,55,0.9),rgba(212,175,55,0.3),transparent)" }}
            initial={{ top: "0%", opacity: 0.8 }}
            animate={{ top: "100%", opacity: [0.8, 1, 0.8] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "linear" }}
          />
        )}
      </AnimatePresence>

      {/* ═══ SLIDESHOW DISCRET (coin bas-gauche) ═══ */}
      <div className="absolute bottom-8 left-6 z-[4] w-44 h-28 md:w-64 md:h-40 rounded-xl overflow-hidden opacity-15 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.img key={slideIdx} src={slideImages[slideIdx]} alt="" className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.8 }} />
        </AnimatePresence>
        <div className="absolute inset-0 rounded-xl" style={{ border: "1px solid rgba(212,175,55,0.15)" }} />
      </div>

      {/* ═══ CONTENU PRINCIPAL (parallax) ═══ */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-[10] h-full flex flex-col items-center justify-between pt-24 pb-8 px-6"
      >

        {/* ── BADGE LIVE ── */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 px-5 py-2 rounded-full"
          style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(212,175,55,0.2)", backdropFilter: "blur(20px)" }}
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.4, 0.8] }} transition={{ duration: 1.6, repeat: Infinity }} />
          <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, letterSpacing: "0.45em", color: "rgba(212,175,55,0.65)", fontWeight: 500 }}>
            PLATEFORME BLOCKCHAIN PRIVÉE · SUISSE
          </span>
          <div className="h-3 w-px" style={{ background: "rgba(212,175,55,0.2)" }} />
          <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, letterSpacing: "0.2em", color: "#d4af37" }}>LIVE</span>
        </motion.div>

        {/* ── BLOC CENTRAL ── */}
        <div className="flex flex-col items-center text-center -mt-8">

          {/* Label au-dessus du titre */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1.5 }}
            className="flex items-center gap-4 mb-5"
          >
            <HUDLine length={50} delay={1.2} />
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, letterSpacing: "0.55em", color: "rgba(212,175,55,0.35)", fontWeight: 400 }}>
              THESORIA · EST. 2024
            </span>
            <HUDLine length={50} delay={1.2} />
          </motion.div>

          {/* ── TITRE GÉANT ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-2"
          >
            {/* Halo derrière le titre */}
            <motion.div
              className="absolute inset-0 blur-[80px] pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(212,175,55,0.18) 0%, transparent 70%)" }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 7, repeat: Infinity }}
            />

            <motion.h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 200,
                letterSpacing: "0.22em",
                lineHeight: 0.9,
                background: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.9) 35%, rgba(212,175,55,0.85) 75%, rgba(180,140,30,0.6) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              className="text-[4rem] md:text-[7rem] lg:text-[9.5rem] xl:text-[11rem]"
              animate={{
                filter: [
                  "drop-shadow(0 0 30px rgba(212,175,55,0.08)) drop-shadow(0 0 80px rgba(212,175,55,0.04))",
                  "drop-shadow(0 0 60px rgba(212,175,55,0.22)) drop-shadow(0 0 120px rgba(212,175,55,0.1))",
                  "drop-shadow(0 0 30px rgba(212,175,55,0.08)) drop-shadow(0 0 80px rgba(212,175,55,0.04))",
                ],
              }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            >
              THESORIA
            </motion.h1>

            {/* Underline décorative */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.8, duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 mx-auto"
              style={{
                height: 1,
                width: "70%",
                background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.6) 20%, rgba(255,255,255,0.3) 50%, rgba(212,175,55,0.6) 80%, transparent)",
              }}
            />
          </motion.div>

          {/* ── SÉPARATEUR DIAMANT ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-5 my-5"
          >
            <div className="h-px w-20 md:w-40" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4))" }} />
            <motion.div
              className="w-2 h-2 rotate-45 border border-[#d4af37]/60"
              animate={{ rotate: [45, 225, 45], borderColor: ["rgba(212,175,55,0.6)", "rgba(212,175,55,1)", "rgba(212,175,55,0.6)"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div className="w-1 h-1 rotate-45 bg-[#d4af37]/40" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
            <motion.div
              className="w-2 h-2 rotate-45 border border-[#d4af37]/60"
              animate={{ rotate: [45, -135, 45] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="h-px w-20 md:w-40" style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.4), transparent)" }} />
          </motion.div>

          {/* ── SLOGAN ── */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 300,
              color: "rgba(212,175,55,0.75)",
              letterSpacing: "0.04em",
              textShadow: "0 0 60px rgba(212,175,55,0.25), 0 4px 24px rgba(0,0,0,0.6)",
            }}
            className="text-xl md:text-3xl lg:text-4xl mb-10 max-w-3xl"
            whileHover={{ scale: 1.02, color: "rgba(212,175,55,0.95)", transition: { duration: 0.6 } }}
          >
            "Un revenu à vie pour tous"
          </motion.p>

          {/* ── COMPTEUR FLASH LOAN (glassmorphism) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl mb-8"
          >
            {/* Halo derrière la card */}
            <motion.div
              className="absolute -inset-4 blur-3xl rounded-3xl pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(212,175,55,0.1) 0%, transparent 70%)" }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 6, repeat: Infinity }}
            />

            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(0,0,0,0.6) 60%, rgba(212,175,55,0.04) 100%)",
                border: "1px solid rgba(212,175,55,0.22)",
                backdropFilter: "blur(28px)",
                boxShadow: "0 0 80px rgba(212,175,55,0.07), inset 0 1px 0 rgba(212,175,55,0.12), inset 0 -1px 0 rgba(212,175,55,0.05)",
              }}
            >
              {/* Ligne supérieure animée */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, #d4af37, #f0e68c, #d4af37, transparent)" }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />

              <div className="grid grid-cols-3 gap-0 px-8 py-6">
                {/* Profit principal */}
                <div className="col-span-3 text-center pb-5 mb-5 relative"
                  style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 8, letterSpacing: "0.5em", color: "rgba(212,175,55,0.35)", marginBottom: 8 }}>
                    ROBOT FLASH LOAN · PROFITS GÉNÉRÉS
                  </div>
                  <motion.div
                    key={totalProfit}
                    initial={{ opacity: 0, y: -8 }}
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 300,
                      fontSize: "clamp(2rem, 5vw, 3.2rem)",
                      background: "linear-gradient(135deg, #cfe678, #d4af37, #f4e4a8, #d4af37)",
                      backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                    animate={{ opacity: 1, y: 0, backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {formatCurrency(totalProfit)}
                  </motion.div>

                  {/* Indicateur live */}
                  <div className="absolute top-0 right-0 flex items-center gap-1.5 mt-1">
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"
                      animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity }} />
                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 7, letterSpacing: "0.3em", color: "rgba(212,175,55,0.4)" }}>LIVE</span>
                  </div>
                </div>

                {/* Trades */}
                <div className="text-center" style={{ borderRight: "1px solid rgba(212,175,55,0.1)" }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 7.5, letterSpacing: "0.3em", color: "rgba(212,175,55,0.33)", marginBottom: 6 }}>TRADES</div>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 22, color: "rgba(212,175,55,0.85)", fontWeight: 200 }}>
                    {formatNumber(recentTrades.length)}
                  </div>
                </div>

                {/* Taux succès */}
                <div className="text-center" style={{ borderRight: "1px solid rgba(212,175,55,0.1)" }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 7.5, letterSpacing: "0.3em", color: "rgba(212,175,55,0.33)", marginBottom: 6 }}>SUCCÈS</div>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 22, color: "rgba(212,175,55,0.85)", fontWeight: 200 }}>
                    {successRate.toFixed(1)}%
                  </div>
                </div>

                {/* Réseau */}
                <div className="text-center">
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 7.5, letterSpacing: "0.3em", color: "rgba(212,175,55,0.33)", marginBottom: 6 }}>RÉSEAU</div>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 22, color: "rgba(212,175,55,0.85)", fontWeight: 200 }}>
                    ETH
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── CTA BUTTONS ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/wallet">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex items-center gap-2.5 px-9 py-4 rounded-xl overflow-hidden group"
                style={{ boxShadow: "0 4px 30px rgba(212,175,55,0.28), 0 0 60px rgba(212,175,55,0.08)" }}
              >
                <div className="absolute inset-0 transition-opacity duration-500"
                  style={{ background: "linear-gradient(135deg, #d4af37 0%, #c19b22 50%, #d4af37 100%)", backgroundSize: "200% auto" }} />
                <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: "linear-gradient(135deg, #f0e68c, #d4af37)" }} />
                <Zap size={15} className="relative z-10 text-black" />
                <span className="relative z-10 text-black" style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, letterSpacing: "0.22em", fontWeight: 700 }}>
                  ACCÉDER AU WALLET
                </span>
                <ArrowRight size={13} className="relative z-10 text-black" />
              </motion.button>
            </Link>

            <Link to="/defi">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-8 py-4 rounded-xl"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(212,175,55,0.28)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 0 20px rgba(212,175,55,0.05)",
                }}
              >
                <TrendingUp size={14} style={{ color: "#d4af37" }} />
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, letterSpacing: "0.22em", color: "rgba(212,175,55,0.8)", fontWeight: 600 }}>
                  EXPLORER DeFi
                </span>
              </motion.button>
            </Link>

            <Link to="/mev">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-8 py-4 rounded-xl"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <Cpu size={14} style={{ color: "rgba(180,180,255,0.8)" }} />
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, letterSpacing: "0.22em", color: "rgba(200,200,255,0.7)", fontWeight: 600 }}>
                  MEV GOD
                </span>
                <motion.div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.3, 0.8] }} transition={{ duration: 1.4, repeat: Infinity }} />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* ── BAS : MINI-STATS + SCROLL ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.0, duration: 1.5 }}
          className="flex flex-col items-center gap-5 w-full"
        >
          {/* Mini-stats row */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {[
              { icon: Shield, label: "SWISS GRADE", value: "Bank-Level" },
              { icon: Zap,    label: "FLASH LOANS", value: "Aave v3" },
              { icon: Globe,  label: "RÉSEAUX",     value: "12+ Chains" },
              { icon: Lock,   label: "AUDIT",       value: "Certifié" },
            ].map(({ icon: Icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.0 + i * 0.1 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{
                  background: "rgba(0,0,0,0.45)",
                  border: "1px solid rgba(212,175,55,0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Icon size={10} style={{ color: "rgba(212,175,55,0.55)" }} />
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 7.5, letterSpacing: "0.25em", color: "rgba(212,175,55,0.35)" }}>{label}</span>
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 8.5, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>{value}</span>
              </motion.div>
            ))}
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="flex flex-col items-center gap-2 cursor-pointer group"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" })}
          >
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 7.5, letterSpacing: "0.7em", color: "rgba(212,175,55,0.25)" }}>DÉFILER</span>
            <div className="w-4 h-8 rounded-full flex justify-center pt-1.5" style={{ border: "1px solid rgba(212,175,55,0.12)" }}>
              <motion.div
                className="w-0.5 h-2 rounded-full"
                style={{ background: "rgba(212,175,55,0.5)" }}
                animate={{ y: [0, 8, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ═══ DOTS SLIDESHOW (bas droit) ═══ */}
      <div className="absolute bottom-6 right-6 z-20 flex gap-1.5 items-center">
        {slideImages.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setSlideIdx(i)}
            className="rounded-full transition-all duration-500"
            style={{
              width: i === slideIdx ? 18 : 5,
              height: 5,
              background: i === slideIdx ? "rgba(212,175,55,0.7)" : "rgba(255,255,255,0.15)",
            }}
            whileHover={{ scale: 1.3 }}
          />
        ))}
      </div>

      {/* ═══ INDICATEUR BG SWITCHER (bas centre) ═══ */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center">
        {BG_IMAGES.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setBgIndex(i)}
            className="rounded-full transition-all duration-700"
            style={{
              width: i === bgIndex ? 24 : 6,
              height: 6,
              background: i === bgIndex ? "rgba(212,175,55,0.8)" : "rgba(212,175,55,0.2)",
              boxShadow: i === bgIndex ? "0 0 8px rgba(212,175,55,0.5)" : "none",
            }}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>

    </section>
  );
}

export default HeroSection;