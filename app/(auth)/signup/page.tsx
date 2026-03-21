"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signInWithGoogle } from "@/lib/firebase/auth";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const user = await signUp(email, password);
      const token = await user.getIdToken();
      document.cookie = `firebase-token=${token}; path=/; max-age=3600; SameSite=Lax`;
      await fetch("/api/auth/create-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email }),
      });
      router.push("/app/onboarding");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("email-already-in-use")) {
        setError("An account with this email already exists.");
      } else if (msg.includes("weak-password")) {
        setError("Password is too weak. Use at least 6 characters.");
      } else {
        setError("Signup failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(""); setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (!result) return; // production: redirect happening
      const token = await result.user.getIdToken();
      document.cookie = `firebase-token=${token}; path=/; max-age=3600; SameSite=Lax`;
      await fetch("/api/auth/create-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: result.user.uid, email: result.user.email }),
      });
      router.push(result.isNew ? "/app/onboarding" : "/app");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (!msg.includes("popup-closed")) {
        setError("Google sign-in failed. Try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .auth-page { min-height:100dvh; display:flex; align-items:center; justify-content:center; padding:24px; background:var(--void); }
        .auth-card { width:100%; max-width:400px; background:var(--graphite); border:1px solid var(--border); border-radius:20px; padding:36px 32px; }
        .auth-logo { font-family:'Barlow Condensed',sans-serif; font-size:1.4rem; font-weight:800; letter-spacing:.2em; text-transform:uppercase; color:var(--bone); margin-bottom:6px; }
        .auth-sub  { font-family:'JetBrains Mono',monospace; font-size:.52rem; letter-spacing:.12em; text-transform:uppercase; color:var(--ghost); margin-bottom:28px; }
        .auth-label { font-family:'JetBrains Mono',monospace; font-size:.52rem; letter-spacing:.12em; text-transform:uppercase; color:var(--ghost); display:block; margin-bottom:7px; }
        .auth-input { width:100%; background:var(--void); border:1px solid var(--border); border-radius:8px; color:var(--bone); font-family:'Barlow',sans-serif; font-size:.95rem; padding:12px 14px; outline:none; transition:border-color .2s; box-sizing:border-box; }
        .auth-input:focus { border-color:var(--vital); }
        .auth-input::placeholder { color:var(--ghost); }
        .auth-group { margin-bottom:16px; }
        .auth-btn { width:100%; background:var(--vital); color:#f5f2ee; font-family:'Barlow Condensed',sans-serif; font-size:.95rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:14px; border-radius:10px; border:none; cursor:pointer; transition:background .2s; margin-top:8px; }
        .auth-btn:hover { background:var(--vital-bright); }
        .auth-btn:disabled { opacity:.6; cursor:not-allowed; }
        .auth-google { width:100%; background:var(--void); color:var(--bone); font-family:'Barlow Condensed',sans-serif; font-size:.95rem; font-weight:600; letter-spacing:.08em; text-transform:uppercase; padding:13px; border-radius:10px; border:1px solid var(--border); cursor:pointer; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:10px; }
        .auth-google:hover { border-color:var(--muted); background:var(--slate); }
        .auth-google:disabled { opacity:.6; cursor:not-allowed; }
        .auth-error { background:rgba(184,50,40,.08); border:1px solid rgba(184,50,40,.2); border-radius:8px; padding:10px 14px; font-size:.82rem; color:var(--signal); margin-bottom:16px; }
        .auth-footer { text-align:center; margin-top:20px; font-family:'JetBrains Mono',monospace; font-size:.52rem; letter-spacing:.08em; color:var(--ghost); text-transform:uppercase; }
        .auth-link { color:var(--vital); text-decoration:none; }
        .auth-or { display:flex; align-items:center; gap:12px; margin:20px 0; }
        .auth-or-line { flex:1; height:1px; background:var(--border); }
        .auth-or-text { font-family:'JetBrains Mono',monospace; font-size:.48rem; color:var(--ghost); text-transform:uppercase; letter-spacing:.1em; white-space:nowrap; }
        .auth-divider { height:1px; background:var(--border); margin:24px 0; }
      `}</style>

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">VYTALL</div>
          <div className="auth-sub">Create your account</div>

          {error && <div className="auth-error">{error}</div>}

          {/* Google sign-up */}
          <button className="auth-google" onClick={handleGoogle} disabled={googleLoading || loading}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          <div className="auth-or">
            <div className="auth-or-line" />
            <span className="auth-or-text">or use email</span>
            <div className="auth-or-line" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-group">
              <label className="auth-label">Email</label>
              <input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="auth-group">
              <label className="auth-label">Password</label>
              <input className="auth-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="auth-group">
              <label className="auth-label">Confirm Password</label>
              <input className="auth-input" type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>
            <button className="auth-btn" type="submit" disabled={loading || googleLoading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-divider" />
          <div className="auth-footer">
            Already have an account? <Link href="/login" className="auth-link">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
}
