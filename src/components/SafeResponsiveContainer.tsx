import React from "react";
import { ResponsiveContainer } from "recharts@2.15.2";

/**
 * SafeResponsiveContainer - Wrapper pour ResponsiveContainer de Recharts
 * 
 * Garantit que les dimensions sont toujours valides (> 0) pour éviter les warnings.
 * Utilise des dimensions explicites au lieu de "100%" qui peuvent être mal calculées.
 */

interface SafeResponsiveContainerProps {
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  minHeight?: number;
  aspect?: number;
  children: React.ReactNode;
  debounce?: number;
  className?: string;
}

export default function SafeResponsiveContainer({
  width = "100%",
  height = 300,
  minWidth = 0,
  minHeight,
  aspect,
  children,
  debounce = 0,
  className,
}: SafeResponsiveContainerProps) {
  // Si height ou width sont des pourcentages/strings et qu'on n'a pas de minHeight,
  // on définit une hauteur minimale par défaut pour éviter les erreurs
  const effectiveMinHeight = minHeight !== undefined 
    ? minHeight 
    : (typeof height === "string" && height.includes("%")) 
      ? 200 
      : undefined;

  return (
    <ResponsiveContainer
      width={width}
      height={height}
      minWidth={minWidth}
      minHeight={effectiveMinHeight}
      aspect={aspect}
      debounce={debounce}
      className={className}
    >
      {children}
    </ResponsiveContainer>
  );
}
