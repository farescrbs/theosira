import { motion } from "motion/react";
import { Link } from "react-router";
import { Home, ArrowLeft, Compass } from "lucide-react";
import { PageHero } from "../components/PageHero";

export default function NotFoundPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <PageHero
        badge="ERREUR 404 · PAGE INTROUVABLE"
        icon={Compass}
        title="404 · Perdu dans l'univers"
        highlight="404"
        description="Cette page n'existe pas dans l'univers THESORIA. Retournez à l'accueil pour continuer votre exploration blockchain."
        bgImageIndex={2}
        stats={[
          { label: "COORDONNÉES",    value: "Inconnues",  color: "#f87171" },
          { label: "SIGNAL",         value: "Perdu",      color: "#fb923c" },
          { label: "RETOUR BASE",    value: "Disponible", color: "#a3e635" },
        ]}
      />

      {/* Boutons de retour */}
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #d4af37, #f0e68c)",
              color: "#000",
              fontFamily: "'Montserrat',sans-serif",
              fontSize: 11,
              letterSpacing: "0.25em",
              fontWeight: 700,
              boxShadow: "0 0 24px rgba(212,175,55,0.35)",
            }}
          >
            <Home size={14} />
            ACCUEIL
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl transition-all duration-300"
            style={{
              border: "1px solid rgba(212,175,55,0.3)",
              color: "rgba(212,175,55,0.8)",
              fontFamily: "'Montserrat',sans-serif",
              fontSize: 11,
              letterSpacing: "0.25em",
              fontWeight: 600,
              background: "rgba(212,175,55,0.04)",
              backdropFilter: "blur(12px)",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(212,175,55,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(212,175,55,0.04)")}
          >
            <ArrowLeft size={14} />
            RETOUR
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
