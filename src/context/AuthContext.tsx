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
    try {
      const { data, error } = await insforge.auth.getCurrentSession();
      
      if (error) {
        console.error('Auth session error:', error);
        setUser(null);
        setLoading(false);
        return;
      }
      
      const sessionUser = data.session?.user;
      if (sessionUser) {
        setUser({
          id: sessionUser.id,
          email: sessionUser.email,
          name: sessionUser.profile?.name,
        });
        console.log('✅ User session loaded:', sessionUser.email);
      } else {
        setUser(null);
        console.log('ℹ️ No active session');
      }
    } catch (err) {
      console.error('Failed to load session:', err);
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await insforge.auth.signOut();
      setUser(null);
      console.log('✅ User signed out');
    } catch (err) {
      console.error('Sign out error:', err);
      // Still clear user state even if API call fails
      setUser(null);
    }
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
