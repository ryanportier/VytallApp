import Link from "next/link";

export default function ConfirmPage() {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--vital-dim)", border: "1px solid rgba(74,124,89,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "1.2rem" }}>
        ✉
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "10px" }}>
        Check Your Email
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--bone)", marginBottom: "12px" }}>
        Confirm Your Account
      </h1>
      <p style={{ fontFamily: "var(--font-body)", fontSize: ".875rem", color: "var(--ghost)", lineHeight: 1.65, marginBottom: "28px" }}>
        We sent a confirmation link to your email. Click it to activate your account and begin training.
      </p>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", color: "var(--ghost)", letterSpacing: ".08em", marginBottom: "24px" }}>
        Didn't receive it? Check your spam folder.
      </p>
      <Link
        href="/login"
        style={{ fontFamily: "var(--font-display)", fontSize: ".85rem", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--vital)", textDecoration: "none" }}
      >
        Back to Log In
      </Link>
    </div>
  );
}
