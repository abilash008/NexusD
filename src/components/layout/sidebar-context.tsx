"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  isPinned: boolean;
  isHovered: boolean;
  isExpanded: boolean;
  togglePin: () => void;
  setIsHovered: (val: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nexusd_sidebar_pinned");
      if (saved === "true") {
        setIsPinned(true);
      }
    } catch (e) {}
  }, []);

  const togglePin = () => {
    setIsPinned((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("nexusd_sidebar_pinned", String(next));
      } catch (e) {}
      return next;
    });
  };

  const isExpanded = isHovered || isPinned;

  return (
    <SidebarContext.Provider
      value={{
        isPinned,
        isHovered,
        isExpanded,
        togglePin,
        setIsHovered,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
