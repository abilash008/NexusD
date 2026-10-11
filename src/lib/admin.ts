export interface AdminUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

const ADMIN_EMAILS = [
  "admin@nexusd.in",
  "founder@nexusd.in",
  "developer@nexusd.in",
];

/**
 * Validates whether a user account possesses administrative permissions
 */
export function isAdminUser(user?: AdminUser | null): boolean {
  if (!user) return false;

  // Direct role check
  if (user.role === "admin") return true;

  // Designated administrative email addresses
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return true;
  }

  return false;
}
