import { createContext, useContext, useEffect, useState } from "react";
import { insforge } from "@/lib/insforgeClient";

type AuthUser = {
  id: string;
  email?: string;
  name?: string;
};

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    setLoading(true);
    const { data } = await insforge.auth.getCurrentSession();
    const sessionUser = data.session?.user;
    if (sessionUser) {
      setUser({
        id: sessionUser.id,
        email: sessionUser.email,
        name: sessionUser.profile?.name,
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSession();
  }, []);

  const handleSignOut = async () => {
    await insforge.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, refresh: loadSession, signOut: handleSignOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
