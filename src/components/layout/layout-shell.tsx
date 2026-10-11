"use client";

import React from "react";
import { useSidebar } from "./sidebar-context";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const { isPinned } = useSidebar();

  return (
    <div
      className={`flex min-h-screen flex-col transition-[padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isPinned ? "lg:pl-64" : "lg:pl-[72px]"
      }`}
    >
      {children}
    </div>
  );
}
