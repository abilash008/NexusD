"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  BookOpen,
  Flag,
  LayoutDashboard,
  ArrowLeft,
  Sparkles,
  Users,
  Settings,
  ExternalLink,
  ChevronRight,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const navLinks = [
    {
      href: "/admin",
      label: "Platform Overview",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      href: "/admin/questions",
      label: "Question Authoring CMS",
      icon: BookOpen,
      active: pathname.startsWith("/admin/questions"),
    },
    {
      href: "/admin/exams",
      label: "Certification Tracks & Exams",
      icon: Award,
      active: pathname.startsWith("/admin/exams"),
    },
    {
      href: "/admin/reports",
      label: "Errata Dispute Triage",
      icon: Flag,
      active: pathname.startsWith("/admin/reports"),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#0B1120]">
      {/* Admin Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-[#0B192C] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">
                Nexus<span className="text-[#0066FF] dark:text-[#38BDF8]">D</span>
              </span>
              <Badge className="bg-blue-500/20 text-[#38BDF8] border border-blue-400/30 text-[10px] uppercase font-mono tracking-wider">
                Admin CMS
              </Badge>
            </div>
            <span className="hidden sm:inline-block text-slate-500">•</span>
            <span className="hidden sm:inline-block text-xs text-slate-300">
              Content Management & Errata Triage
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs bg-transparent border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Student Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Nav Sub-header */}
      <div className="bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-6 overflow-x-auto py-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    item.active
                      ? "bg-blue-50 dark:bg-blue-950/50 text-[#0066FF] dark:text-[#38BDF8]"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content View */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
