"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { VUser } from "@/types";

interface Props {
  profile: VUser;
  email: string;
  stats: { totalCheckins: number; totalWorkouts: number; memberSince: string };
  subscription: { plan: string; status: string } | null;
}

export default function ProfileClient({ profile, email, stats, subscription }: Props) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const planLabel = subscription?.plan === "premium" ? "Premium" : subscription?.plan === "elite" ? "Elite" : "Free";
  const planColor = subscription?.plan === "premium" || subscription?.plan === "elite" ? "var(--vital)" : "var(--ghost)";

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "4px" }}>
        Profile
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--bone)", marginBottom: "24px" }}>
        {profile.name}
      </h1>

      {/* Identity card */}
      <div style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "var(--slate)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--ash)" }}>
              {profile.name[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 600, color: "var(--bone)", letterSpacing: ".04em" }}>
              {profile.name}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: ".8rem", color: "var(--ghost)" }}>{email}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "4px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: planColor }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: ".48rem", letterSpacing: ".1em", textTransform: "uppercase", color: planColor }}>
                {planLabel}
              </span>
            </div>
          </div>
        </div>

        <div style={{ height: "1px", background: "var(--border)", marginBottom: "16px" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            { label: "Level",      value: profile.level.charAt(0).toUpperCase() + profile.level.slice(1) },
            { label: "Member Since", value: stats.memberSince },
            { label: "Session",    value: `${profile.session_preference}min` },
            { label: "Days / Week", value: `${profile.days_per_week}×` },
          ].map((item) => (
            <div key={item.label}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: ".48rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "3px" }}>
                {item.label}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: ".9rem", color: "var(--ash)" }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        {[
          { label: "Total Check-Ins", value: stats.totalCheckins },
          { label: "Completed Sessions", value: stats.totalWorkouts },
        ].map((s) => (
          <div key={s.label} style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "var(--bone)", lineHeight: 1, marginBottom: "4px" }}>
              {s.value}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: ".48rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ghost)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Goal */}
      <div style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "6px" }}>
          Training Goal
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: ".9rem", color: "var(--ash)", lineHeight: 1.5 }}>{profile.goal}</p>
      </div>

      {/* Equipment */}
      {profile.equipment?.length > 0 && (
        <div style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "10px" }}>
            Equipment
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {profile.equipment.map((eq: string) => (
              <span key={eq} style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".1em", textTransform: "uppercase", padding: "5px 10px", border: "1px solid var(--border)", borderRadius: "5px", color: "var(--ash)" }}>
                {eq}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Link href="/app/payments" style={{ textDecoration: "none" }}>
          <div style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: ".9rem", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--bone)" }}>
              Manage Plan
            </div>
            <span style={{ color: "var(--ghost)" }}>→</span>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          style={{ width: "100%", background: "transparent", border: "1px solid rgba(192,57,43,.3)", color: "var(--signal)", fontFamily: "var(--font-display)", fontSize: ".85rem", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", padding: "13px", borderRadius: "8px", cursor: "pointer", transition: "all .2s" }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
