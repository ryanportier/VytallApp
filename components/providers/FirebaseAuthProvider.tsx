"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { type User } from "firebase/auth";
import { onAuthChange } from "@/lib/firebase/auth";

interface AuthCtx {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthCtx>({ user: null, loading: true });

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      setLoading(false);

      if (u) {
        const token = await u.getIdToken(true);
        document.cookie = `firebase-token=${token}; path=/; max-age=3600; SameSite=Lax`;

        // If on auth pages, redirect to app
        const path = window.location.pathname;
        if (path === "/login" || path === "/signup") {
          window.location.href = "/app";
        }
      } else {
        document.cookie = "firebase-token=; path=/; max-age=0";
      }
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  return useContext(AuthContext);
}
