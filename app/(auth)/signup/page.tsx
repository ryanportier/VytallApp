"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/app` },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // If email confirmation is disabled in Supabase, user is immediately signed in
    if (data.session) {
      router.push("/app/onboarding");
      router.refresh();
    } else {
      // Email confirmation required
      router.push("/signup/confirm");
    }
  }

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "10px" }}>
          Create Account
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--bone)", marginBottom: "8px" }}>
          Begin
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: ".875rem", color: "var(--ghost)" }}>
          The system needs a baseline. Let's build it.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[
          { label: "Email", type: "email", val: email, set: setEmail, ph: "you@example.com", ac: "email" },
          { label: "Password", type: "password", val: password, set: setPassword, ph: "Min. 8 characters", ac: "new-password" },
          { label: "Confirm Password", type: "password", val: confirmPassword, set: setConfirmPassword, ph: "Repeat password", ac: "new-password" },
        ].map((f) => (
          <div key={f.label}>
            <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "8px" }}>
              {f.label}
            </label>
            <input
              type={f.type} value={f.val}
              onChange={(e) => f.set(e.target.value)}
              className="input-field" placeholder={f.ph}
              required autoComplete={f.ac}
            />
          </div>
        ))}

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
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", color: "var(--ghost)", textAlign: "center", lineHeight: 1.5, letterSpacing: ".04em" }}>
          By continuing, you agree to VYTALL's terms of service.
        </p>
      </form>

      <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid var(--border)", textAlign: "center", fontFamily: "var(--font-body)", fontSize: ".85rem", color: "var(--ghost)" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--vital)", textDecoration: "none" }}>Log in</Link>
      </div>
    </div>
  );
}
