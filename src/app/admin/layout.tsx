"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ShieldCheck,
  ShieldAlert,
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
  LogOut,
  Lock,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showExitModal, setShowExitModal] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const role = (session?.user as any)?.role;

  // Handle unauthenticated state: immediately challenge for admin credentials (declared at top level)
  useEffect(() => {
    if (pathname !== "/admin/login" && status === "unauthenticated") {
      router.replace(`/admin/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [status, pathname, router]);

  // Browser Back Button Trap: Prevent administrator session from escaping to candidate portal via browser Back button
  useEffect(() => {
    if (status === "authenticated" && role === "admin") {
      // Push initial dummy state to trap back-clicks within the admin domain
      window.history.pushState({ adminBoundary: true }, "", window.location.href);

      const handlePopState = () => {
        if (!window.location.pathname.startsWith("/admin")) {
          window.history.pushState({ adminBoundary: true }, "", "/admin");
          router.replace("/admin");
        }
      };

      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [status, role, router]);

  // If on the dedicated admin login page, bypass layout chrome completely
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#070D18] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-slate-300">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xs font-mono text-slate-400">
            Verifying Administrative Security Clearance...
          </div>
        </div>
      </div>
    );
  }

  // If unauthenticated, show redirecting state
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#070D18] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-slate-300">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xs font-mono text-slate-400">
            Redirecting to Administrator Gateway...
          </div>
        </div>
      </div>
    );
  }

  // Access Denied: User is authenticated but is a student account
  if (role !== "admin") {
    return (
      <div className="min-h-screen bg-[#070D18] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 bg-[#0B1528] border border-red-500/30 rounded-2xl shadow-2xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <div className="space-y-1.5">
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-[10px] uppercase font-mono tracking-wider">
              Security Notice • 403 Forbidden
            </Badge>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Administrator Clearance Required
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              The internal administrative portal is confidential. You are currently authenticated under a student account:
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 truncate">
            {session?.user?.email || "Student Account"}
          </div>

          <div className="space-y-2 pt-2">
            <Button
              onClick={async () => {
                await signOut({ redirect: false });
                router.push(`/admin/login?callbackUrl=${encodeURIComponent(pathname)}`);
              }}
              className="w-full bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-semibold h-10 gap-1.5"
            >
              <Lock className="h-3.5 w-3.5" /> Sign In with Administrator Credentials
            </Button>

            <Link href="/dashboard" className="block">
              <Button
                variant="outline"
                className="w-full border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs h-10 gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Return to Student Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Administrator View
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
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 text-[10px] uppercase font-mono tracking-wider flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Admin CMS
              </Badge>
            </div>
            <span className="hidden sm:inline-block text-slate-500">•</span>
            <span className="hidden sm:inline-block text-xs text-slate-300">
              Content Management & Errata Triage
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
              {session?.user?.email}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExitModal(true)}
              className="gap-1.5 text-xs border-red-900/50 text-red-300 hover:bg-red-950/40 hover:text-red-200 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Exit Admin</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Nav Sub-header */}
      <div className="bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
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

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 text-white">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Confirm Administrator Sign Out
                </h3>
                <p className="text-xs text-slate-400">
                  NexusD Administrative Clearance Gateway
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Active Account</span>
                <span className="font-mono text-emerald-400 font-medium">Administrator</span>
              </div>
              <div className="font-mono text-slate-200 truncate font-medium">
                {session?.user?.email || "admin@nexusd.in"}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to sign out from the Administrative Console? You will be returned to the Admin Gateway login screen and your administrator credentials will be required to re-authenticate.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isExiting}
                onClick={() => setShowExitModal(false)}
                className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs h-9 px-4 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isExiting}
                onClick={async () => {
                  try {
                    setIsExiting(true);
                    await signOut({ callbackUrl: "/admin/login" });
                  } catch (err) {
                    console.error("[Admin SignOut Error]:", err);
                    setIsExiting(false);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs h-9 px-4 gap-1.5 cursor-pointer shadow-xs"
              >
                {isExiting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Signing Out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Confirm & Sign Out</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
