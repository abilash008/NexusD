"use client";

import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { LogOut, AlertTriangle, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function SignOutModal({ isOpen, onClose, user }: SignOutModalProps) {
  const { data: session } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (!isOpen) return null;

  const activeEmail = user?.email || session?.user?.email || "candidate@nexusd.in";
  const activeName = user?.name || session?.user?.name || "ServiceNow Candidate";

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error("[SignOut Error]:", err);
      setIsSigningOut(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
              Confirm Sign Out
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              NexusD Candidate Portal
            </p>
          </div>
        </div>

        {/* Account detail card */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <User className="h-3.5 w-3.5" /> Active Account
            </span>
            <Badge
              variant="outline"
              className="text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60 font-mono"
            >
              Student Candidate
            </Badge>
          </div>
          <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">
            {activeName}
          </div>
          <div className="font-mono text-slate-500 dark:text-slate-400 truncate text-[11px]">
            {activeEmail}
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Are you sure you want to sign out from NexusD? Your practice test progress, mock exam results, and study history are safely preserved on your account.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSigningOut}
            onClick={onClose}
            className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs h-9 px-4 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isSigningOut}
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs h-9 px-4 gap-1.5 cursor-pointer shadow-xs"
          >
            {isSigningOut ? (
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
  );
}
