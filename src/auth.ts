import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db, users, accounts, sessions, verificationTokens } from "@/lib/db";

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
    }),
    // Demo / Quick Sign-In provider for local testing and developer evaluation
    Credentials({
      name: "Demo Account",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "developer@nexusd.in" },
        name: { label: "Full Name", type: "text", placeholder: "ServiceNow Developer" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        return {
          id: "demo-user-1",
          email: String(credentials.email),
          name: String(credentials.name || "ServiceNow Practitioner"),
          image: "https://avatar.vercel.sh/nexusd",
          role: "user",
        };
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
