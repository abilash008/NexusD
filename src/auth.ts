import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db, users, accounts, sessions, verificationTokens } from "@/lib/db";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { ensureAdminUser, isMasterAdminEmail } from "@/lib/admin-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  secret: process.env.AUTH_SECRET || "nexusd-prod-secret-key-australia-brazil-2026-production-ready",
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Ensure backend administrator account is provisioned
        await ensureAdminUser();

        const identifier = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        try {
          // Verify user exists in database by email OR username
          const [user] = await db
            .select()
            .from(users)
            .where(
              or(
                eq(users.email, identifier),
                eq(users.username, identifier)
              )
            )
            .limit(1);

          if (!user) {
            return null;
          }

          if (!user.password) {
            // Account signed up with Google OAuth
            return null;
          }

          // Verify bcrypt password hash
          const isPasswordMatch = await bcrypt.compare(password, user.password);
          if (!isPasswordMatch) {
            return null;
          }

          const role = isMasterAdminEmail(user.email) ? "admin" : (user.role || "user");
          const portal = (credentials as any)?.portal
            ? String((credentials as any).portal).toLowerCase().trim()
            : "student";

          // Administrator accounts can ONLY sign in from the dedicated /admin/login gateway
          if (role === "admin" && portal !== "admin") {
            return null;
          }

          const emailStr = user.email || user.username || "practitioner";
          return {
            id: user.id,
            email: user.email,
            name: user.name || user.username || (role === "admin" ? "Platform Administrator" : "ServiceNow Practitioner"),
            image: user.image || `https://avatar.vercel.sh/${encodeURIComponent(emailStr)}`,
            role,
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
    signIn({ user, account }) {
      if (account?.provider === "google") {
        if (isMasterAdminEmail(user.email)) {
          return "/login?error=AdminMustUseAdminPortal";
        }
      }
      return true;
    },
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
