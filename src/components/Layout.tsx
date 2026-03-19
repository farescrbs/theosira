import { Outlet, Link, useLocation } from "react-router";
import { useEffect } from "react";
import { Toaster } from "./ui/sonner";
import Navigation from "./Navigation";
import Footer from "./Footer";
import EnhancedBackground from "./EnhancedBackground";
import Premium3DParticles from "./Premium3DParticles";
import ScrollProgress from "./ScrollProgress";
import FloatingActionButton from "./FloatingActionButton";
import SoundEffects from "./SoundEffects";
import PerformanceMonitor from "./PerformanceMonitor";
import KeyboardShortcuts from "./KeyboardShortcuts";
import SystemHealthDashboard from "./SystemHealthDashboard";
import PremiumLoadingScreen from "./PremiumLoadingScreen";
import { OmnipotentOverlay } from "./OmnipotentOverlay";
import Web3Debug from "./Web3Debug";

export default function Layout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-black relative">
      {/* Loading screen (first visit only) */}
      <PremiumLoadingScreen />

      {/* Global overlays */}
      <Premium3DParticles />
      <ScrollProgress />
      <FloatingActionButton />
      <SoundEffects />
      <PerformanceMonitor />
      <KeyboardShortcuts />
      <EnhancedBackground />
      <Web3Debug />

      <Toaster
        position="top-right"
        expand={true}
        richColors
        toastOptions={{
          style: {
            background: "rgba(0, 0, 0, 0.95)",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            backdropFilter: "blur(20px)",
            color: "white",
          },
        }}
      />

      <div className="relative z-10">
        <Navigation />
        <Outlet />
        <Footer />
      </div>

      <SystemHealthDashboard />
      <OmnipotentOverlay />
      
      {/* Hidden God Mode Entrance (Top Left corner very small) */}
      <Link 
        to="/god-mode" 
        className="fixed top-0 left-0 w-4 h-4 z-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-crosshair"
        title="Omniscience Protocol"
      >
        <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
      </Link>
    </div>
  );
}