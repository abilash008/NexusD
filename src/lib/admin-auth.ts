import { db, users } from "@/lib/db";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const ADMIN_CONFIG = {
  email: (process.env.ADMIN_EMAIL || "admin@nexusd.in").toLowerCase().trim(),
  username: (process.env.ADMIN_USERNAME || "admin").trim(),
  name: "Platform Administrator",
  defaultPassword: process.env.ADMIN_PASSWORD || "AdminNexusD@2026!",
  role: "admin",
};

let adminSeeded = false;

/**
 * Ensures the authoritative administrator user exists in Neon PostgreSQL.
 * If the admin does not exist, it creates the record with role 'admin' and hashed password.
 * If the record exists but has role 'user', it elevates it to 'admin'.
 */
export async function ensureAdminUser(): Promise<void> {
  if (adminSeeded) return;

  try {
    // Check if admin user exists by email or username
    const existing = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, ADMIN_CONFIG.email),
          eq(users.username, ADMIN_CONFIG.username)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      // Hash admin password
      const hashedPassword = await bcrypt.hash(ADMIN_CONFIG.defaultPassword, 10);

      await db.insert(users).values({
        id: crypto.randomUUID(),
        name: ADMIN_CONFIG.name,
        username: ADMIN_CONFIG.username,
        email: ADMIN_CONFIG.email,
        password: hashedPassword,
        role: "admin",
        image: `https://avatar.vercel.sh/${encodeURIComponent(ADMIN_CONFIG.email)}`,
      });

      console.log(`[AdminAuth] Initialized administrative account: ${ADMIN_CONFIG.email}`);
    } else {
      const user = existing[0];
      // Ensure role is elevated to admin
      if (user.role !== "admin") {
        await db
          .update(users)
          .set({ role: "admin", updatedAt: new Date() })
          .where(eq(users.id, user.id));
        console.log(`[AdminAuth] Elevated user ${user.email} to 'admin' role.`);
      }
    }

    adminSeeded = true;
  } catch (err) {
    console.error("[AdminAuth] Error ensuring admin user:", err);
  }
}

/**
 * Checks if a given email is the configured master admin email
 */
export function isMasterAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase().trim() === ADMIN_CONFIG.email;
}
