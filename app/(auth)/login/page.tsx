"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(redirectTo);
      router.refresh();
    }
  }

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "10px" }}>
          Auth
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--bone)", marginBottom: "8px" }}>
          Log In
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: ".875rem", color: "var(--ghost)" }}>
          Continue your training.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "8px" }}>
            Email
          </label>
          <input
            type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field" placeholder="you@example.com"
            required autoComplete="email"
          />
        </div>

        <div>
          <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "8px" }}>
            Password
          </label>
          <input
            type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field" placeholder="••••••••"
            required autoComplete="current-password"
          />
        </div>

        {error && (
          <div style={{ background: "rgba(192,57,43,.1)", border: "1px solid rgba(192,57,43,.3)", borderRadius: "8px", padding: "12px", fontFamily: "var(--font-body)", fontSize: ".825rem", color: "#e74c3c" }}>
            {error}
          </div>
        )}

        <button
          type="submit" className="btn-primary"
          disabled={loading}
          style={{ width: "100%", marginTop: "8px", opacity: loading ? .6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid var(--border)", textAlign: "center", fontFamily: "var(--font-body)", fontSize: ".85rem", color: "var(--ghost)" }}>
        No account?{" "}
        <Link href="/signup" style={{ color: "var(--vital)", textDecoration: "none" }}>
          Start free
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div />}>
      <LoginForm />
    </Suspense>
  );
}
