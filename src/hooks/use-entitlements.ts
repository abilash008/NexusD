"use client";

import { useState, useEffect } from "react";
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
  const [entitlement, setEntitlement] = useState<StoredEntitlement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initial read
    setEntitlement(getStoredEntitlement());
    setIsLoaded(true);

    // Event listener for updates across tabs / components
    const handleUpdate = () => {
      setEntitlement(getStoredEntitlement());
    };

    window.addEventListener("nexusd_entitlement_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("nexusd_entitlement_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

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

  const active = isEntitlementActive(entitlement);

  return {
    entitlement,
    isLoaded,
    isPro: Boolean(entitlement && active),
    isCertificationActive: active,
    daysRemaining: getRemainingDays(entitlement),
    isUnlocked: (certCode: string = "csa") => isCertificationUnlocked(certCode, entitlement),
    isFeatureUnlocked: (certCode: string = "csa") => isProFeatureUnlocked(entitlement, certCode),
    grantPlan,
    revokePlan,
  };
}
