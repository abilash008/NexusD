export interface StoredEntitlement {
  planId: "csa_pass" | "all_access";
  certifications: string[];
  grantedAt: string;
  expiresAt: string; // 1-year validity for certification tracks
  orderId?: string;
  paymentId?: string;
  receiptNumber?: string;
}

const STORAGE_KEY = "nexusd_user_entitlements";

/**
 * Retrieves the stored entitlements from localStorage
 */
export function getStoredEntitlement(): StoredEntitlement | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredEntitlement;
  } catch (err) {
    console.error("Error reading stored entitlement:", err);
    return null;
  }
}

/**
 * Saves a new entitlement record to localStorage and dispatches a storage event
 */
export function saveStoredEntitlement(entitlement: StoredEntitlement): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entitlement));
    // Dispatch custom event to notify listeners in the same window
    window.dispatchEvent(new CustomEvent("nexusd_entitlement_updated", { detail: entitlement }));
  } catch (err) {
    console.error("Error saving stored entitlement:", err);
  }
}

/**
 * Clears stored entitlements
 */
export function clearStoredEntitlement(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("nexusd_entitlement_updated", { detail: null }));
  } catch (err) {
    console.error("Error clearing stored entitlement:", err);
  }
}

/**
 * Checks if a specific entitlement is still active within its 1-year window
 */
export function isEntitlementActive(entitlement: StoredEntitlement | null): boolean {
  if (!entitlement) return false;
  if (!entitlement.expiresAt) return true; // fallback
  return new Date(entitlement.expiresAt).getTime() > Date.now();
}

/**
 * Returns remaining validity in days (for 1-year certification pass)
 */
export function getRemainingDays(entitlement: StoredEntitlement | null): number {
  if (!entitlement || !entitlement.expiresAt) return 0;
  const diffMs = new Date(entitlement.expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Checks if a specific certification track is unlocked and within 1-year validity.
 * This applies specifically to certification materials; general platform features remain open.
 */
export function isCertificationUnlocked(
  certCode: string,
  entitlement: StoredEntitlement | null
): boolean {
  if (!entitlement) return false;
  if (!isEntitlementActive(entitlement)) return false;
  if (entitlement.planId === "all_access") return true;
  return entitlement.certifications.includes(certCode.toLowerCase());
}

/**
 * Checks if Pro features (PDF Export, Questions 61+) are unlocked within the 1-year window
 */
export function isProFeatureUnlocked(
  entitlement: StoredEntitlement | null,
  certCode: string = "csa"
): boolean {
  if (!entitlement) return false;
  if (!isEntitlementActive(entitlement)) return false;
  if (entitlement.planId === "all_access") return true;
  if (entitlement.planId === "csa_pass" && certCode.toLowerCase() === "csa") return true;
  return false;
}
