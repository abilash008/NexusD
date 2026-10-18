"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Zap,
  BookOpen,
  BarChart3,
  CreditCard,
  User,
  Users,
  Menu,
  X,
  LogOut,
  LogIn,
  Pin,
  PinOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-context";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const { isPinned, togglePin, isHovered, setIsHovered, isExpanded } = useSidebar();

  // Admin portal has dedicated navigation and layout
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      match: (path: string) => path === "/dashboard",
    },
    {
      title: "Practice Engine",
      href: "/certifications",
      icon: Zap,
      match: (path: string) =>
        path === "/certifications" || path.startsWith("/certifications/"),
    },
    {
      title: "Study Guides & Bank",
      href: "/study",
      icon: BookOpen,
      match: (path: string) => path.startsWith("/study"),
    },
    {
      title: "Readiness Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      match: (path: string) => path.startsWith("/dashboard/analytics"),
    },
    {
      title: "Pricing & Plans",
      href: "/pricing",
      icon: CreditCard,
      match: (path: string) => path.startsWith("/pricing"),
    },
    {
      title: "Candidate Profile",
      href: "/profile",
      icon: User,
      match: (path: string) => path.startsWith("/profile"),
    },
    {
      title: "Community",
      href: "/community",
      icon: Users,
      match: (path: string) => path.startsWith("/community"),
    },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md px-4 shadow-xs">
        <Link href="/" className="flex items-center gap-2">
          {/* Light Mode Mobile ND Logo */}
          <div className="bg-white/90 rounded-md p-0.5 shadow-2xs dark:hidden">
            <Image
              src="/nd-logo.png"
              alt="NexusD"
              width={32}
              height={32}
              className="object-contain mix-blend-multiply"
            />
          </div>
          {/* Dark Mode Mobile ND Logo (ND - Logo Glassy Premium Dark) */}
          <div className="rounded-md p-0.5 hidden dark:block">
            <Image
              src="/nd-logo-dark.png"
              alt="NexusD"
              width={34}
              height={34}
              className="object-contain mix-blend-screen drop-shadow-[0_0_10px_rgba(0,102,255,0.45)]"
            />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-[#0B192C] dark:text-white">
            Nexus<span className="text-[#0066FF] dark:text-[#38BDF8]">D</span>
          </span>
        </Link>
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          aria-label="Toggle Navigation"
        >
          {isOpenMobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Modern 2026 Glassy Sidebar (Slim Rail Collapsed, Expands on Hover/Click) */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between border-r border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-xl text-slate-700 dark:text-slate-300 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isExpanded ? "w-64 shadow-2xl" : "w-[72px] shadow-xs"
        } ${
          isOpenMobile
            ? "translate-x-0 w-64 shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col space-y-4 pt-3">
          {/* Top Logo Button Header */}
          <div className="px-3">
            <div
              onClick={togglePin}
              className={`group flex items-center justify-between rounded-xl p-2 cursor-pointer transition-colors hover:bg-slate-100/80 dark:hover:bg-slate-800/60 ${
                isExpanded ? "h-14" : "h-12 justify-center"
              }`}
              title={isPinned ? "Pinned open. Click to unpin." : "Click to pin sidebar open"}
            >
              <Link
                href="/"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpenMobile(false);
                }}
                className="flex items-center gap-3 overflow-hidden"
              >
                {/* Collapsed Icon vs Expanded Full Logo */}
                {isExpanded ? (
                  <>
                    {/* Light Theme Expanded Full Logo */}
                    <div className="relative h-10 w-44 transition-all duration-300 flex items-center bg-white/90 rounded-lg px-2 py-1 shadow-2xs dark:hidden">
                      <Image
                        src="/nexusd-full-logo.png"
                        alt="NexusD"
                        width={150}
                        height={40}
                        priority
                        className="object-contain mix-blend-multiply drop-shadow-xs"
                      />
                    </div>
                    {/* Dark Theme Expanded Full Logo (NexusD Glassy Premium Dark) */}
                    <div className="relative h-10 w-44 transition-all duration-300 items-center px-1 hidden dark:flex">
                      <Image
                        src="/nexusd-full-logo-dark.png"
                        alt="NexusD"
                        width={155}
                        height={40}
                        priority
                        className="object-contain mix-blend-screen drop-shadow-[0_0_15px_rgba(0,102,255,0.45)]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Light Theme Collapsed Icon */}
                    <div className="relative h-10 w-10 flex items-center justify-center shrink-0 bg-white/90 rounded-lg p-1 shadow-2xs dark:hidden">
                      <Image
                        src="/nd-logo.png"
                        alt="NexusD"
                        width={34}
                        height={34}
                        priority
                        className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                      />
                    </div>
                    {/* Dark Theme Collapsed Icon (ND - Logo Glassy Premium Dark) */}
                    <div className="relative h-10 w-10 items-center justify-center shrink-0 p-0.5 hidden dark:flex">
                      <Image
                        src="/nd-logo-dark.png"
                        alt="NexusD"
                        width={36}
                        height={36}
                        priority
                        className="object-contain mix-blend-screen drop-shadow-[0_0_12px_rgba(0,102,255,0.45)] group-hover:scale-110 transition-transform"
                      />
                    </div>
                  </>
                )}
              </Link>

              {/* Pin Toggle Button (Visible only when expanded) */}
              {isExpanded && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePin();
                  }}
                  className={`hidden lg:flex h-7 w-7 items-center justify-center rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 ${
                    isPinned ? "text-[#0066FF] dark:text-[#38BDF8] bg-blue-50 dark:bg-blue-950/60" : ""
                  }`}
                  title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
                >
                  {isPinned ? (
                    <PinOff className="h-3.5 w-3.5 text-[#0066FF] dark:text-[#38BDF8]" />
                  ) : (
                    <Pin className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 px-3">
            {navItems.map((item) => {
              const isActive = item.match(pathname);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpenMobile(false)}
                  className={`group relative flex items-center rounded-xl transition-all ${
                    isExpanded ? "px-3.5 py-2.5 justify-start gap-3" : "h-11 w-11 mx-auto justify-center"
                  } ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/40 text-[#0066FF] dark:text-[#38BDF8] font-bold shadow-xs border border-blue-200/60 dark:border-blue-800/60"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/90 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <Icon
                    className={`shrink-0 transition-colors ${
                      isExpanded ? "h-4 w-4" : "h-5 w-5"
                    } ${
                      isActive
                        ? "text-[#0066FF] dark:text-[#38BDF8]"
                        : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100"
                    }`}
                  />

                  {/* Title Label (Visible when expanded) */}
                  {isExpanded && (
                    <span className="text-xs font-semibold whitespace-nowrap overflow-hidden transition-all duration-200">
                      {item.title}
                    </span>
                  )}

                  {/* Floating Tooltip (Visible only when collapsed on desktop) */}
                  {!isExpanded && (
                    <div className="hidden lg:block absolute left-[62px] px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium rounded-md shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50">
                      {item.title}
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-800" />
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Theme Switcher & User Profile / Sign In */}
        <div className="border-t border-slate-200/80 dark:border-slate-800/80 p-3 bg-slate-50/50 dark:bg-[#0E1726]/80 space-y-2.5">
          {/* Theme Option (Placed right above Sign In, aligned to the right) */}
          <ThemeToggle isExpanded={isExpanded} />

          {/* Sign In or Active Candidate Details */}
          {user ? (
            <div className="space-y-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
              <Link
                href="/profile"
                className={`flex items-center gap-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 p-1 transition-colors group cursor-pointer ${
                  isExpanded ? "px-1" : "justify-center"
                }`}
                title="View ServiceNow Candidate Profile"
              >
                <div
                  className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#0066FF] to-blue-400 flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                  title={user.name || "Candidate"}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>

                {isExpanded && (
                  <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#0066FF] dark:group-hover:text-[#38BDF8] transition-colors">
                      {user.name || "ServiceNow Trainee"}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user.email || "candidate@nexusd.in"}
                    </span>
                  </div>
                )}
              </Link>

              {isExpanded ? (
                <div className="flex items-center justify-between pt-1 px-1 border-t border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                    Candidate Active
                  </span>
                  <Link href="/auth/signout">
                    <button
                      type="button"
                      className="text-xs text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer p-1"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Sign Out
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Link
                    href="/auth/signout"
                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
              {isExpanded ? (
                <div className="space-y-1.5">
                  <Link
                    href="/login"
                    onClick={() => setIsOpenMobile(false)}
                    className="block"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-medium border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-2xs"
                    >
                      <LogIn className="h-3.5 w-3.5 mr-1.5" /> Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsOpenMobile(false)}
                    className="block"
                  >
                    <Button
                      variant="accent"
                      size="sm"
                      className="w-full text-xs font-semibold shadow-xs"
                    >
                      Sign Up Free
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Link
                    href="/login"
                    onClick={() => setIsOpenMobile(false)}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-[#0066FF] dark:hover:text-[#38BDF8] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Sign In to NexusD"
                  >
                    <LogIn className="h-5 w-5" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
