"use client";

import React from "react";
import Image from "next/image";

interface NexusLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  iconOnly?: boolean;
  priority?: boolean;
}

export function NexusLogo({
  className = "",
  size = "md",
  iconOnly = false,
  priority = false,
}: NexusLogoProps) {
  // Dimension definitions
  const dimensions = {
    sm: iconOnly ? { width: 34, height: 34 } : { width: 140, height: 46 },
    md: iconOnly ? { width: 44, height: 44 } : { width: 180, height: 60 },
    lg: iconOnly ? { width: 56, height: 56 } : { width: 220, height: 72 },
    xl: iconOnly ? { width: 72, height: 72 } : { width: 280, height: 92 },
  };

  const currentDim = dimensions[size] || dimensions.md;
  const lightSrc = iconOnly ? "/nd-logo.png" : "/nexusd-full-logo.png";
  const darkSrc = iconOnly ? "/nd-logo-dark.png" : "/nexusd-full-logo-dark.png";

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none transition-all duration-300 ${className}`}
    >
      {/* Light Theme Logo */}
      <Image
        src={lightSrc}
        alt={iconOnly ? "ND Logo" : "NexusD"}
        width={currentDim.width}
        height={currentDim.height}
        priority={priority}
        className="object-contain mix-blend-multiply drop-shadow-xs transition-transform duration-300 hover:scale-105 dark:hidden"
        style={{
          maxHeight: `${currentDim.height}px`,
          width: "auto",
        }}
      />

      {/* Dark Theme Logo (Glassy Premium Dark) */}
      <Image
        src={darkSrc}
        alt={iconOnly ? "ND Logo" : "NexusD"}
        width={currentDim.width}
        height={currentDim.height}
        priority={priority}
        className="object-contain mix-blend-screen drop-shadow-[0_0_15px_rgba(0,102,255,0.4)] transition-transform duration-300 hover:scale-105 hidden dark:inline-block"
        style={{
          maxHeight: `${currentDim.height}px`,
          width: "auto",
        }}
      />
    </div>
  );
}
