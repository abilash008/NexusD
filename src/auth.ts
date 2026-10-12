import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db, users, accounts, sessions, verificationTokens } from "@/lib/db";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  secret: process.env.AUTH_SECRET || "nexusd_secret_dev_key_2026_super_secure_fallback",
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Email Account",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "learner@nexusd.in" },
        name: { label: "Full Name", type: "text", placeholder: "ServiceNow Practitioner" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const email = String(credentials.email).toLowerCase().trim();
        const name = String(credentials.name || "").trim() || "ServiceNow Practitioner";

        // Validate genuine email format
        if (!email.includes("@") || !email.includes(".")) {
          return null;
        }

        try {
          // Check if user already exists in Neon PostgreSQL
          const existing = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

          if (existing.length > 0) {
            return {
              id: existing[0].id,
              email: existing[0].email,
              name: existing[0].name || name,
              image: existing[0].image || `https://avatar.vercel.sh/${encodeURIComponent(email)}`,
              role: existing[0].role || "user",
            };
          }

          // Insert new verified user into Neon PostgreSQL
          const [newUser] = await db
            .insert(users)
            .values({
              email,
              name,
              image: `https://avatar.vercel.sh/${encodeURIComponent(email)}`,
              role: "user",
            })
            .returning();

          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            image: newUser.image,
            role: newUser.role,
          };
        } catch (dbErr) {
          console.error("[NextAuth DB Error in authorize]:", dbErr);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
});
