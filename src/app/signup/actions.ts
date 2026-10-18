"use server";

import { db, users } from "@/lib/db";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { ADMIN_CONFIG } from "@/lib/admin-auth";

function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least 1 uppercase letter (A-Z)." };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least 1 digit (0-9)." };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    return { valid: false, error: "Password must contain at least 1 special character (e.g. !@#$%^&*)." };
  }
  return { valid: true };
}

export async function registerUser(formData: FormData) {
  const username = (formData.get("username") as string)?.trim();
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!username || username.length < 2) {
    return { error: "Username must be at least 2 characters long." };
  }

  if (!email || !email.includes("@") || !email.includes(".")) {
    return { error: "Please enter a valid email address." };
  }

  if (!password) {
    return { error: "Password is required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const passwordCheck = validatePassword(password);
  if (!passwordCheck.valid) {
    return { error: passwordCheck.error };
  }

  // Block registration of reserved administrative credentials
  const reservedUsernames = ["admin", "administrator", "root", "superuser", ADMIN_CONFIG.username.toLowerCase()];
  if (
    email === ADMIN_CONFIG.email ||
    reservedUsernames.includes(username.toLowerCase())
  ) {
    return { error: "This username or email is reserved for platform administration and cannot be registered publicly." };
  }

  try {
    // 1. Verify user does not already exist in Neon PostgreSQL
    const existing = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .limit(1);

    if (existing.length > 0) {
      if (existing[0].email === email) {
        return { error: "An account with this email already exists. Please sign in instead." };
      }
      return { error: "This username is already taken. Please choose another username." };
    }

    // 2. Hash password with bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Persist new user into Neon PostgreSQL
    await db.insert(users).values({
      username,
      name: username,
      email,
      password: hashedPassword,
      image: `https://avatar.vercel.sh/${encodeURIComponent(username)}`,
      role: "user",
    });

    // 4. Automatically sign in user
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });

    return { success: true };
  } catch (error: any) {
    if (error instanceof AuthError) {
      return { error: "Account created! Please sign in from the login page." };
    }
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("[Registration Error]:", error);
    return { error: "Failed to create account. Please try again." };
  }
}
