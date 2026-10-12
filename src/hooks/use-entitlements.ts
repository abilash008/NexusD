"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  getStoredEntitlement,
  saveStoredEntitlement,
  clearStoredEntitlement,
  isCertificationUnlocked,
  isProFeatureUnlocked,
  isEntitlementActive,
  getRemainingDays,
  StoredEntitlement,
} from "@/lib/entitlements";

export function useEntitlements() {
  const { data: session, status: authStatus } = useSession();
  const [entitlement, setEntitlement] = useState<StoredEntitlement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // If explicitly unauthenticated, purge any local/stale entitlement immediately
    if (authStatus === "unauthenticated") {
      clearStoredEntitlement();
      setEntitlement(null);
      setIsLoaded(true);
      return;
    }

    if (authStatus === "authenticated") {
      // Sync strictly from server
      fetch("/api/user/entitlements")
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data?.entitlement) {
            saveStoredEntitlement(data.entitlement);
            setEntitlement(data.entitlement);
          } else {
            // User is signed in but has no active paid entitlements in database
            clearStoredEntitlement();
            setEntitlement(null);
          }
        })
        .catch(() => {
          // If offline, read cached entitlement only if session is present
          setEntitlement(getStoredEntitlement());
        })
        .finally(() => {
          setIsLoaded(true);
        });
    }

    // Event listener for updates across tabs / components
    const handleUpdate = () => {
      if (authStatus === "authenticated") {
        setEntitlement(getStoredEntitlement());
      } else {
        setEntitlement(null);
      }
    };

    window.addEventListener("nexusd_entitlement_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("nexusd_entitlement_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [authStatus]);

  const grantPlan = (
    planId: "csa_pass" | "all_access",
    meta?: { orderId?: string; paymentId?: string; receiptNumber?: string; expiresAt?: string }
  ) => {
    const certs = planId === "all_access" ? ["csa", "cad", "cis-df", "cis-itsm"] : ["csa"];
    const now = new Date();
    // 1-year validity for certification tracks
    const expiry = meta?.expiresAt || new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();

    const newEntitlement: StoredEntitlement = {
      planId,
      certifications: certs,
      grantedAt: now.toISOString(),
      expiresAt: expiry,
      orderId: meta?.orderId,
      paymentId: meta?.paymentId,
      receiptNumber: meta?.receiptNumber,
    };
    saveStoredEntitlement(newEntitlement);
    setEntitlement(newEntitlement);
  };

  const revokePlan = () => {
    clearStoredEntitlement();
    setEntitlement(null);
  };

  const isAuthenticated = authStatus === "authenticated" && Boolean(session?.user);
  const active = isAuthenticated && isEntitlementActive(entitlement);

  return {
    entitlement: isAuthenticated ? entitlement : null,
    isLoaded,
    isPro: Boolean(active),
    isCertificationActive: active,
    daysRemaining: active ? getRemainingDays(entitlement) : 0,
    isUnlocked: (certCode: string = "csa") => active && isCertificationUnlocked(certCode, entitlement),
    isFeatureUnlocked: (certCode: string = "csa") => active && isProFeatureUnlocked(entitlement, certCode),
    grantPlan,
    revokePlan,
  };
}
