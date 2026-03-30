import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router";
import {
  Menu, X, ChevronDown, Globe, Zap,
  TrendingUp, Layers, Brain, ShoppingBag,
  Wallet, Shield, ChevronRight, Building, Crown, Code2, Video
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Web3ConnectionButton from "./Web3ConnectionButton";

/* ══════════════════════════════════════════════════════
   DONNÉES
══════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { label: "MARCHÉS",   to: "/markets",  icon: TrendingUp, special: false, sub: "Crypto · Forex · Indices" },
  { label: "DeFi",      to: "/defi",     icon: Layers,     special: false, sub: "Pools · Yield · Swap" },
  { label: "WALLET",    to: "/wallet",   icon: Wallet,     special: true,  sub: "ETH · Multi-Chain" },
  { label: "NFT",       to: "/nft",      icon: ShoppingBag,special: false, sub: "Mint · Trade · Gallery" },
  { label: "PRIVILÈGE", to: "/lottery",  icon: Crown,      special: true,  sub: "Loterie · On-Chain" },
  { label: "IMMOBILIER",to: "/real-estate", icon: Building, special: false, sub: "Real Estate · ERC-3643" },
  { label: "STUDIO",    to: "/studio",   icon: Code2,      special: true,  sub: "Smart Contracts · No-Code" },
  { label: "TRADING",   to: "/trading",  icon: Shield,     special: false, sub: "Spot · Futures · Options" },
  { label: "MEV GOD",   to: "/mev",      icon: Zap,        special: true,  sub: "Flash · Arbitrage · Bot" },
  { label: "IA MAÎTRE", to: "/ai",       icon: Brain,      special: true,  sub: "Neural · Prediction · DAO" },
  { label: "VIDÉO",     to: "/video",    icon: Video,      special: true,  sub: "Tutoriels · Démos · Témoignages" },
  { label: "SERVICES",  to: "/services", icon: Globe,      special: false, sub: "Domain · Card · Bridge" },
];

const LANGS = [
  { code: "FR", flag: "🇫🇷" },
  { code: "EN", flag: "🇬🇧" },
  { code: "ES", flag: "🇪🇸" },
  { code: "ZH", flag: "🇨🇳" },
  { code: "AR", flag: "🇦🇪" },
];

/* Orbes dorées — valeurs statiques (pas de Math.random au render) */
const ORBS = [
  { left: "8%",  top: "70%", dur: 3.2 },
  { left: "22%", top: "15%", dur: 4.1 },
  { left: "38%", top: "75%", dur: 3.7 },
  { left: "55%", top: "20%", dur: 4.8 },
  { left: "70%", top: "65%", dur: 3.4 },
  { left: "85%", top: "30%", dur: 5.0 },
  { left: "95%", top: "60%", dur: 3.9 },
];

/* ══════════════════════════════════════════════════════
   SOUS-COMPOSANTS
══════════════════════════════════════════════════════ */

function GoldOrb({ left, top, dur }: { left: string; top: string; dur: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left, top, width: 3, height: 3,
        background: "#d4af37",
        boxShadow: "0 0 8px #d4af37, 0 0 16px rgba(212,175,55,0.4)",
      }}
      animate={{ y: [0, -10, 0], opacity: [0.15, 0.9, 0.15], scale: [0.8, 1.4, 0.8] }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function HUDCorner({ pos, idx }: { pos: Record<string, number | string>; idx: number }) {
  const rotations = [0, 90, -90, 180];
  return (
    <motion.div
      className="absolute w-5 h-5 pointer-events-none"
      style={pos}
      animate={{ opacity: [0.25, 0.9, 0.25], scale: [0.9, 1.08, 0.9] }}
      transition={{ duration: 2.8, delay: idx * 0.65, repeat: Infinity }}
    >
      <svg viewBox="0 0 20 20" fill="none" style={{ transform: `rotate(${rotations[idx]}deg)` }}>
        <path d="M0 11 L0 0 L11 0" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
        <circle cx="0" cy="0" r="1.8" fill="#d4af37" opacity="0.5" />
      </svg>
    </motion.div>
  );
}

function NetworkBadge() {
  const [block, setBlock] = useState(21_847_321);
  const [gas, setGas]     = useState(12);

  useEffect(() => {
    const id = setInterval(() => {
      setBlock(b => b + 1);
      setGas(g => Math.max(8, Math.min(35, g + Math.floor(Math.random() * 7) - 3)));
    }, 12000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.3, duration: 0.7 }}
      className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg"
      style={{
        background: "rgba(0,0,0,0.45)",
        border: "1px solid rgba(212,175,55,0.14)",
        backdropFilter: "blur(14px)",
      }}
    >
      <motion.div
        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
        animate={{ opacity: [0.35, 1, 0.35], scale: [0.7, 1.5, 0.7] }}
        transition={{ duration: 1.7, repeat: Infinity }}
      />
      <div style={{ fontFamily: "'Montserrat',sans-serif" }}>
        <span style={{ fontSize: 7.5, letterSpacing: "0.22em", color: "rgba(212,175,55,0.45)" }}>
          ETH #{block.toLocaleString("fr-FR")}
        </span>
        <span style={{ fontSize: 7, color: "rgba(255,255,255,0.22)", marginLeft: 6 }}>
          {gas} gwei
        </span>
      </div>
    </motion.div>
  );
}

function NavTooltip({ sub }: { sub: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.92 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap px-3 py-1.5 rounded-lg z-[60] pointer-events-none"
      style={{
        background: "rgba(4,4,16,0.98)",
        border: "1px solid rgba(212,175,55,0.2)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 28px rgba(0,0,0,0.75), 0 0 14px rgba(212,175,55,0.06)",
      }}
    >
      <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9, letterSpacing: "0.22em", color: "rgba(212,175,55,0.65)" }}>
        {sub}
      </span>
      <div
        className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45"
        style={{
          background: "rgba(212,175,55,0.12)",
          border: "1px solid rgba(212,175,55,0.18)",
          borderBottom: "none",
          borderRight: "none",
        }}
      />
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════════════ */
export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [scanPhase, setScanPhase]   = useState<"idle" | "h" | "v">("idle");
  const [langOpen, setLangOpen]     = useState(false);
  const [activeLang, setActiveLang] = useState("FR");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mouseX, setMouseX]         = useState(0.5);
  const location = useLocation();
  const navRef   = useRef<HTMLDivElement>(null);

  /* scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* scan line alternée H/V */
  useEffect(() => {
    let phase: "h" | "v" = "h";
    const fire = () => {
      setScanPhase(phase);
      setTimeout(() => setScanPhase("idle"), 1500);
      phase = phase === "h" ? "v" : "h";
    };
    const id = setInterval(fire, 9000);
    return () => clearInterval(id);
  }, []);

  /* fermeture au changement de route */
  useEffect(() => {
    setIsMenuOpen(false);
    setLangOpen(false);
    setHoveredItem(null);
  }, [location.pathname]);

  /* reflet selon position souris */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    setMouseX((e.clientX - rect.left) / rect.width);
  }, []);

  const CORNERS = [
    { top: 5,  left: 12 },
    { top: 5,  right: 12 },
    { bottom: 5, left: 12 },
    { bottom: 5, right: 12 },
  ] as const;

  return (
    <motion.nav
      ref={navRef}
      onMouseMove={handleMouseMove}
      initial={{ y: -130, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* ── Couche transparente de base (toujours) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,8,0.55) 0%, transparent 100%)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* ── Couche glassmorphism complète (scrolled) ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.65 }}
      >
        {/* blur principal */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, rgba(0,0,10,0.97) 0%, rgba(3,3,20,0.92) 100%)",
          backdropFilter: "blur(32px) saturate(190%) brightness(0.82)",
          WebkitBackdropFilter: "blur(32px) saturate(190%)",
        }} />
        {/* reflet doré dynamique */}
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 65% 90% at ${mouseX * 100}% -25%, rgba(212,175,55,0.17) 0%, transparent 62%)`,
          transition: "background 0.25s ease",
        }} />
        {/* halo chromatique latéral */}
        <div className="absolute inset-0 opacity-15" style={{
          background: "linear-gradient(90deg, rgba(80,140,255,0.12) 0%, transparent 28%, transparent 72%, rgba(255,120,80,0.07) 100%)",
        }} />
        {/* noise premium */}
        <div className="absolute inset-0 opacity-[0.035]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />
      </motion.div>

      {/* ── Scan ligne horizontale ── */}
      <AnimatePresence>
        {scanPhase === "h" && (
          <motion.div
            key="scan-h"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "120%", opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-y-0 w-36 pointer-events-none z-20"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.05), rgba(212,175,55,0.28), rgba(255,255,255,0.06), rgba(212,175,55,0.28), rgba(212,175,55,0.05), transparent)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Scan ligne verticale ── */}
      <AnimatePresence>
        {scanPhase === "v" && (
          <motion.div
            key="scan-v"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0.6, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 h-px pointer-events-none z-20 origin-left"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5) 20%, #f0e68c 50%, rgba(212,175,55,0.5) 80%, transparent)",
              boxShadow: "0 0 10px rgba(212,175,55,0.7)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Bordure supérieure animée (lueur glissante) ── */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden z-10">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)",
        }} />
        <motion.div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), #f0e68c, rgba(212,175,55,0.4), transparent)", width: "40%" }}
          animate={{ x: ["-40%", "280%"] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
        />
      </div>

      {/* ── Bordure inférieure (scrolled) ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px z-10"
        animate={{ opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.22) 15%, rgba(212,175,55,0.5) 50%, rgba(212,175,55,0.22) 85%, transparent)" }}
      />

      {/* ── Coins HUD ── */}
      {CORNERS.map((pos, i) => (
        <HUDCorner key={i} pos={pos} idx={i} />
      ))}

      {/* ── Orbes dorées (scrolled uniquement) ── */}
      <AnimatePresence>
        {scrolled && ORBS.map((o, i) => <GoldOrb key={i} {...o} />)}
      </AnimatePresence>

      {/* ════════════════════════════════════════
          CONTENU
      ════════════════════════════════════════ */}
      <div className="relative max-w-[1440px] mx-auto px-5 py-3.5">
        <div className="flex items-center justify-between gap-3">

          {/* ─── LOGO ─── */}
          <Link to="/" className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer group"
            >
              {/* Halo hover */}
              <motion.div
                className="absolute -inset-3 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                style={{ background: "radial-gradient(ellipse, rgba(212,175,55,0.1) 0%, transparent 70%)" }}
              />

              <div className="flex items-center gap-3">
                {/* Symbole Θ — double anneau orbital */}
                <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
                  {/* Anneau dashed lent */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: "1px dashed rgba(212,175,55,0.22)" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Anneau continu + point orbital */}
                  <motion.div
                    className="absolute inset-1.5 rounded-full"
                    style={{ border: "1px solid rgba(212,175,55,0.42)" }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
                  >
                    <div
                      className="absolute w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "#d4af37",
                        boxShadow: "0 0 6px #d4af37, 0 0 12px rgba(212,175,55,0.5)",
                        top: -3, left: "50%", marginLeft: -3,
                      }}
                    />
                  </motion.div>
                  {/* Θ central */}
                  <motion.span
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 22,
                      background: "linear-gradient(145deg, #cfe678, #d4af37, #f0e68c, #d4af37)",
                      backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      position: "relative", zIndex: 2,
                    }}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      filter: [
                        "drop-shadow(0 0 3px rgba(212,175,55,0.25))",
                        "drop-shadow(0 0 14px rgba(212,175,55,0.95))",
                        "drop-shadow(0 0 3px rgba(212,175,55,0.25))",
                      ],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >Θ</motion.span>
                </div>

                {/* Wordmark */}
                <div className="relative">
                  <div className="relative overflow-hidden">
                    <motion.span
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 24,
                        fontStyle: "italic",
                        fontWeight: 700,
                        background: "linear-gradient(135deg, #cfe678 0%, #d4af37 35%, #f0e68c 55%, #d4af37 80%, #cfe678 100%)",
                        backgroundSize: "280% auto",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        letterSpacing: "0.3em",
                        display: "block",
                      }}
                      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    >
                      THESORIA
                    </motion.span>
                    {/* Shimmer sur hover */}
                    <div
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full pointer-events-none"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
                        transition: "transform 0.85s ease",
                      }}
                    />
                  </div>
                  <div style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 6.5, letterSpacing: "0.55em",
                    color: "rgba(212,175,55,0.38)",
                    marginTop: 1,
                  }}>
                    PRIVATE BLOCKCHAIN · SWISS
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* ─── DESKTOP NAV ─── */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_ITEMS.map((item, i) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: -18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.3, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                  onHoverStart={() => setHoveredItem(item.label)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <Link to={item.to} className="relative group block px-3 py-2.5">
                    {/* Pill actif animé (layout partagé) */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: "linear-gradient(135deg, rgba(212,175,55,0.16), rgba(212,175,55,0.06))",
                          border: "1px solid rgba(212,175,55,0.36)",
                          boxShadow: "0 0 18px rgba(212,175,55,0.14), inset 0 0 10px rgba(212,175,55,0.05)",
                        }}
                        transition={{ type: "spring", stiffness: 360, damping: 30 }}
                      />
                    )}

                    {/* Hover bg */}
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-250"
                      style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.1)" }}
                    />

                    {/* Contenu */}
                    <div className="relative z-10 flex flex-col items-center gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <Icon
                          size={11}
                          className={`transition-colors duration-300 ${
                            isActive ? "text-[#d4af37]"
                            : item.special ? "text-[#d4af37]/55 group-hover:text-[#d4af37]"
                            : "text-white/35 group-hover:text-[#d4af37]/80"
                          }`}
                        />
                        <span
                          className={`transition-colors duration-300 ${
                            isActive ? "text-[#d4af37]"
                            : item.special ? "text-[#d4af37]/72 group-hover:text-[#d4af37]"
                            : "text-white/68 group-hover:text-[#d4af37]"
                          }`}
                          style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, letterSpacing: "0.18em", fontWeight: 600 }}
                        >
                          {item.label}
                        </span>
                        {item.special && (
                          <motion.span
                            className="w-1.5 h-1.5 rounded-full bg-[#d4af37] flex-shrink-0"
                            animate={{ opacity: [0.35, 1, 0.35], scale: [0.65, 1.35, 0.65] }}
                            transition={{ duration: 1.7, repeat: Infinity }}
                          />
                        )}
                      </div>

                      {/* Soulignement actif */}
                      <div className="relative h-px w-full overflow-hidden">
                        <motion.div
                          className="absolute inset-0"
                          style={{ background: "linear-gradient(90deg, transparent, #d4af37, #f0e68c, #d4af37, transparent)" }}
                          animate={{ scaleX: isActive ? 1 : 0 }}
                          transition={{ duration: 0.35 }}
                        />
                      </div>
                    </div>

                    {/* Glow hover */}
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                      style={{ boxShadow: "0 0 22px rgba(212,175,55,0.09)" }}
                    />
                  </Link>

                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredItem === item.label && <NavTooltip sub={item.sub} />}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </nav>

          {/* ─── ACTIONS DROITE ─── */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <NetworkBadge />

            {/* Séparateur */}
            <div className="h-7 w-px mx-1" style={{
              background: "linear-gradient(180deg, transparent, rgba(212,175,55,0.28), transparent)"
            }} />

            {/* Sélecteur langue */}
            <div className="relative">
              <motion.button
                onClick={() => setLangOpen(o => !o)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg relative overflow-hidden"
                style={{
                  border: "1px solid rgba(212,175,55,0.18)",
                  background: langOpen ? "rgba(212,175,55,0.1)" : "rgba(212,175,55,0.04)",
                  fontFamily: "'Montserrat',sans-serif",
                  fontSize: 10.5, letterSpacing: "0.15em", fontWeight: 600,
                  color: langOpen ? "#d4af37" : "rgba(255,255,255,0.62)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.25s ease",
                }}
              >
                <Globe size={11} />
                <span>{activeLang}</span>
                <motion.span animate={{ rotate: langOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown size={10} />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.93 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.93 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full mt-2 right-0 w-28 rounded-xl overflow-hidden z-[60]"
                    style={{
                      background: "rgba(4,4,18,0.99)",
                      border: "1px solid rgba(212,175,55,0.22)",
                      backdropFilter: "blur(28px)",
                      boxShadow: "0 14px 44px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.06)",
                    }}
                  >
                    <div className="px-3 py-2" style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
                      <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 7.5, letterSpacing: "0.4em", color: "rgba(212,175,55,0.28)" }}>
                        LANGUE
                      </span>
                    </div>
                    {LANGS.map(l => (
                      <motion.button
                        key={l.code}
                        whileHover={{ x: 4 }}
                        onClick={() => { setActiveLang(l.code); setLangOpen(false); }}
                        className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 transition-colors duration-150"
                        style={{
                          color: l.code === activeLang ? "#d4af37" : "rgba(255,255,255,0.52)",
                          fontSize: 10.5, letterSpacing: "0.15em",
                          fontFamily: "'Montserrat',sans-serif", fontWeight: 600,
                          borderBottom: "1px solid rgba(212,175,55,0.06)",
                          background: l.code === activeLang ? "rgba(212,175,55,0.06)" : "transparent",
                        }}
                      >
                        <span className="text-base leading-none">{l.flag}</span>
                        <span>{l.code}</span>
                        {l.code === activeLang && (
                          <motion.div layoutId="activeLang" className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Web3ConnectionButton />
          </div>

          {/* ─── BURGER MOBILE ─── */}
          <motion.button
            className="lg:hidden relative w-11 h-11 flex items-center justify-center rounded-xl z-10"
            onClick={() => setIsMenuOpen(o => !o)}
            whileTap={{ scale: 0.87 }}
            style={{
              border: `1px solid ${isMenuOpen ? "rgba(212,175,55,0.48)" : "rgba(212,175,55,0.2)"}`,
              background: isMenuOpen ? "rgba(212,175,55,0.1)" : "rgba(212,175,55,0.03)",
              backdropFilter: "blur(12px)",
              transition: "all 0.3s ease",
            }}
          >
            {isMenuOpen && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                animate={{ boxShadow: ["0 0 0px rgba(212,175,55,0)", "0 0 18px rgba(212,175,55,0.32)", "0 0 0px rgba(212,175,55,0)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div key="x"
                  initial={{ rotate: -90, opacity: 0, scale: 0.4 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.22 }}
                >
                  <X size={18} className="text-[#d4af37]" />
                </motion.div>
              ) : (
                <motion.div key="menu"
                  initial={{ rotate: 90, opacity: 0, scale: 0.4 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.22 }}
                >
                  <Menu size={18} className="text-white/70" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* ════════════════════════════════════════
            MENU MOBILE PREMIUM
        ════════════════════════════════════════ */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -16 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -16 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden overflow-hidden mt-3"
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(155deg, rgba(5,5,20,0.99) 0%, rgba(8,8,28,0.98) 100%)",
                  border: "1px solid rgba(212,175,55,0.2)",
                  backdropFilter: "blur(40px)",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.85), 0 0 50px rgba(212,175,55,0.05), inset 0 1px 0 rgba(212,175,55,0.1)",
                }}
              >
                {/* Header */}
                <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 flex items-center justify-center rounded-full"
                      style={{ border: "1px solid rgba(212,175,55,0.4)" }}
                    >
                      <span style={{ color: "#d4af37", fontSize: 10, fontFamily: "'Playfair Display',serif" }}>Θ</span>
                    </motion.div>
                    <span style={{ color: "rgba(212,175,55,0.42)", fontSize: 8.5, letterSpacing: "0.45em", fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>
                      THESORIA · NAVIGATION
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                      animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }} />
                    <span style={{ fontSize: 7, color: "rgba(255,255,255,0.28)", fontFamily: "'Montserrat',sans-serif", letterSpacing: "0.2em" }}>LIVE</span>
                  </div>
                </div>

                {/* Grille d'items */}
                <div className="p-3 grid grid-cols-2 gap-2">
                  {NAV_ITEMS.map((item, i) => {
                    const isActive = location.pathname === item.to;
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -18 : 18, y: -8 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ delay: 0.035 * i, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Link
                          to={item.to}
                          className="flex flex-col gap-1.5 px-4 py-3.5 rounded-xl relative group overflow-hidden"
                          style={{
                            background: isActive ? "rgba(212,175,55,0.09)" : "rgba(255,255,255,0.02)",
                            border: `1px solid ${isActive ? "rgba(212,175,55,0.28)" : "rgba(255,255,255,0.045)"}`,
                          }}
                        >
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ background: "rgba(212,175,55,0.055)" }} />
                          {isActive && (
                            <motion.div
                              layoutId="mobileActiveLine"
                              className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
                              style={{ background: "linear-gradient(180deg, transparent, #d4af37, transparent)" }}
                            />
                          )}

                          <div className="flex items-center justify-between relative z-10">
                            <Icon size={14} className={`flex-shrink-0 transition-colors duration-300 ${isActive ? "text-[#d4af37]" : "text-white/30 group-hover:text-[#d4af37]/70"}`} />
                            {item.special && (
                              <motion.span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"
                                animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
                            )}
                          </div>

                          <div className="relative z-10">
                            <div className={`transition-colors duration-300 ${isActive ? "text-[#d4af37]" : "text-white/72 group-hover:text-white"}`}
                              style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 9.5, letterSpacing: "0.2em", fontWeight: 700 }}>
                              {item.label}
                            </div>
                            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 7.5, color: "rgba(255,255,255,0.22)", letterSpacing: "0.1em", marginTop: 2 }}>
                              {item.sub}
                            </div>
                          </div>

                          <ChevronRight size={10}
                            className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ color: "rgba(212,175,55,0.5)" }} />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Footer mobile */}
                <div className="px-4 py-4 flex flex-col gap-3" style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}>
                  {/* Sélecteur langue */}
                  <div className="flex gap-1.5 flex-wrap">
                    {LANGS.map(l => (
                      <motion.button
                        key={l.code}
                        whileTap={{ scale: 0.88 }}
                        onClick={() => setActiveLang(l.code)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg"
                        style={{
                          border: `1px solid ${activeLang === l.code ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.07)"}`,
                          background: activeLang === l.code ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.02)",
                          color: activeLang === l.code ? "#d4af37" : "rgba(255,255,255,0.38)",
                          fontFamily: "'Montserrat',sans-serif",
                          fontSize: 9, letterSpacing: "0.14em", fontWeight: 600,
                          transition: "all 0.2s ease",
                        }}
                      >
                        {l.flag} {l.code}
                      </motion.button>
                    ))}
                  </div>

                  <Web3ConnectionButton />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

export default Navigation;