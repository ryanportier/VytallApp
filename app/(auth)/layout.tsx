import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--void)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "300px",
          background:
            "radial-gradient(ellipse, rgba(74,124,89,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <Link
        href="/"
        style={{
          position: "absolute",
          top: "24px",
          left: "24px",
          fontFamily: "var(--font-display)",
          fontSize: "1.1rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          color: "var(--bone)",
          textDecoration: "none",
          textTransform: "uppercase",
          zIndex: 10,
        }}
      >
        VYTALL
      </Link>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "400px" }}>
        {children}
      </div>
    </div>
  );
}
