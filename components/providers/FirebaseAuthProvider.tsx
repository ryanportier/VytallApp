"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { type User } from "firebase/auth";
import { onAuthChange, getGoogleRedirectResult } from "@/lib/firebase/auth";

interface AuthCtx {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthCtx>({ user: null, loading: true });

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged fires AFTER redirect result is processed by Firebase
    // so we handle everything inside it
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      setLoading(false);

      if (u) {
        // Always refresh and store token
        const token = await u.getIdToken(true);
        document.cookie = `firebase-token=${token}; path=/; max-age=3600; SameSite=Lax`;

        // Check if we just came back from a Google redirect
        try {
          const result = await getGoogleRedirectResult();
          if (result) {
            await fetch("/api/auth/create-profile", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ uid: result.user.uid, email: result.user.email }),
            });
            window.location.href = result.isNew ? "/app/onboarding" : "/app";
            return;
          }
        } catch {
          // No redirect pending — normal flow
        }

        // If on login/signup page but already authed, redirect to app
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
