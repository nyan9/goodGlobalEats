import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "src/prisma";

// Warn (rather than throw) so this doesn't break `next build`, where
// NODE_ENV=production but AUTH_SECRET may not be wired in yet. Auth.js
// will fail loudly at first sign-in if it's actually missing in prod.
if (!process.env.AUTH_SECRET) {
  console.warn(
    "[auth] AUTH_SECRET is not set — Auth.js will fail at request time",
  );
}

/**
 * Extend the built-in session/user types so that `session.user.id` is
 * always a non-optional string when using the database strategy.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: {
    strategy: "database",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
