"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function loginWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;

  if (!email || !email.includes("@") || !email.includes(".")) {
    return { error: "Please enter a valid email address." };
  }

  try {
    await signIn("credentials", {
      email,
      name: name || "ServiceNow Practitioner",
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Failed to sign in. Please verify your email." };
    }
    throw error;
  }
}
