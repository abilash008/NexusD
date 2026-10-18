"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { db, users } from "@/lib/db";
import { eq, or } from "drizzle-orm";
import { isMasterAdminEmail } from "@/lib/admin-auth";

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function loginWithCredentials(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!email || !email.includes("@") || !email.includes(".")) {
    return { error: "Please enter a valid email address." };
  }

  if (!password) {
    return { error: "Password is required." };
  }

  // Pre-check: Restrict administrator credentials strictly to the dedicated /admin/login gateway
  try {
    const [existingUser] = await db
      .select({ role: users.role, email: users.email })
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, email)))
      .limit(1);

    if (existingUser && (existingUser.role === "admin" || isMasterAdminEmail(existingUser.email))) {
      return {
        error: "Administrator accounts cannot sign in through the candidate portal. Please access the dedicated Admin Gateway at /admin/login.",
      };
    }
  } catch (checkErr) {
    console.error("[Login Action Check Error]:", checkErr);
  }

  try {
    await signIn("credentials", {
      email,
      password,
      portal: "student",
      redirectTo: "/dashboard",
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password. Please verify your credentials or create a new account." };
    }
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("[Login Action Error]:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
