"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "./layout/sidebar-context";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isPinned } = useSidebar();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <div className="flex min-h-screen flex-col w-full">{children}</div>;
  }

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
