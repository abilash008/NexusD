"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, Menu, X, Award, BookOpen, BarChart3, ShieldCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Mark */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B192C] text-[#0066FF] shadow-xs group-hover:scale-105 transition-transform">
              <Compass className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#0B192C]">
                Nexus<span className="text-[#0066FF]">D</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                ServiceNow Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link
              href="/certifications/csa"
              className="flex items-center gap-1.5 transition-colors hover:text-[#0066FF]"
            >
              <Award className="h-4 w-4 text-[#0066FF]" />
              Practice Engine
            </Link>
            <Link
              href="/study/csa"
              className="flex items-center gap-1.5 transition-colors hover:text-[#0066FF]"
            >
              <BookOpen className="h-4 w-4 text-slate-400" />
              Study Guides
            </Link>
            <Link
              href="/dashboard/analytics"
              className="flex items-center gap-1.5 transition-colors hover:text-[#0066FF]"
            >
              <BarChart3 className="h-4 w-4 text-slate-400" />
              Readiness Analytics
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 transition-colors hover:text-[#0066FF]"
            >
              <CreditCard className="h-4 w-4 text-slate-400" />
              Pricing
            </Link>
          </nav>
        </div>

        {/* Desktop CTA / User Profile */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link href="/api/auth/signout">
                <Button variant="ghost" size="sm" className="text-slate-600">
                  Sign Out
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-slate-700">
                  Sign In
                </Button>
              </Link>
              <Link href="/certifications/csa">
                <Button variant="accent" size="sm">
                  Start Practice Test
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Toggle navigation menu</span>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pt-2 pb-6 md:hidden">
          <nav className="flex flex-col space-y-3 pt-2">
            <Link
              href="/certifications/csa"
              className="flex items-center gap-2 rounded-md p-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Award className="h-4 w-4 text-[#0066FF]" />
              Practice Engine
            </Link>
            <Link
              href="/study/csa"
              className="flex items-center gap-2 rounded-md p-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen className="h-4 w-4 text-slate-400" />
              Study Guides
            </Link>
            <Link
              href="/dashboard/analytics"
              className="flex items-center gap-2 rounded-md p-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BarChart3 className="h-4 w-4 text-slate-400" />
              Readiness Analytics
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 rounded-md p-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <CreditCard className="h-4 w-4 text-[#0066FF]" />
              Pricing Plans
            </Link>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/certifications/csa" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="accent" className="w-full">
                  Start Practice Test
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
