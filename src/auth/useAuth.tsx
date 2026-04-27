import { FunctionComponent, ReactNode } from "react";
import { useSession, signOut, SessionProvider } from "next-auth/react";

interface AuthUser {
  uid: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

interface IAuthContext {
  user: AuthUser | null;
  logout: () => void;
  authenticated: boolean;
}

/**
 * Thin wrapper around `useSession()` that preserves the original
 * `{ user, logout, authenticated }` API consumed by layout.tsx,
 * spotNav.tsx, and edit.tsx.
 *
 * `user.uid` aliases `session.user.id` so existing call sites keep working.
 */
export function useAuth(): IAuthContext {
  const { data: session, status } = useSession();

  if (status === "authenticated" && session?.user?.id) {
    const user: AuthUser = {
      uid: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    };
    return {
      user,
      logout: () => signOut({ callbackUrl: "/" }),
      authenticated: true,
    };
  }

  return {
    user: null,
    logout: () => signOut({ callbackUrl: "/" }),
    authenticated: false,
  };
}

/**
 * AuthProvider is kept as a named export so `pages/_app.tsx` and any other
 * call sites that import it don't need to change.  The actual session state
 * comes from `SessionProvider` (added to _app.tsx), so this is a passthrough.
 */
export const AuthProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

export { SessionProvider };
