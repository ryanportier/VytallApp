import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { ArchiveEntry } from "@/types";

const ENTRY_STYLE: Record<string, { color: string; label: string }> = {
  breakthrough: { color: "var(--vital)",  label: "Breakthrough" },
  setback:      { color: "var(--signal)", label: "Setback" },
  era:          { color: "var(--bone)",   label: "Era" },
  recovery:     { color: "#4a8bcc",       label: "Recovery" },
  chapter:      { color: "var(--ghost)",  label: "Chapter" },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function ArchivePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("id").eq("id", user.id).single();
  if (!profile) redirect("/app/onboarding");

  // Check subscription for full access
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .single();

  const isPremium = subscription?.plan === "premium" || subscription?.plan === "elite";

  // Free: last 3 entries. Premium: all.
  const query = supabase
    .from("archive_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!isPremium) query.limit(3);

  const { data: entries } = await query as { data: ArchiveEntry[] | null };

  return (
    <div style={{ padding: "20px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "4px" }}>
            Archive
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--bone)" }}>
            Living Memory
          </h1>
        </div>
        {isPremium && (
          <GenerateButton />
        )}
      </div>

      {(!entries || entries.length === 0) ? (
        <EmptyArchive />
      ) : (
        <>
          <div style={{ position: "relative", paddingLeft: "20px" }}>
            {/* Timeline line */}
            <div style={{ position: "absolute", left: "7px", top: "8px", bottom: "8px", width: "1px", background: "var(--border)" }} />

            {entries.map((entry, i) => {
              const style = ENTRY_STYLE[entry.entry_type] ?? ENTRY_STYLE.chapter;
              return (
                <div key={entry.id} style={{ position: "relative", marginBottom: i < entries.length - 1 ? "20px" : "0" }}>
                  {/* Dot */}
                  <div style={{ position: "absolute", left: "-20px", top: "8px", width: "8px", height: "8px", borderRadius: "50%", background: style.color, border: "1px solid var(--obsidian)", zIndex: 1 }} />
                  <div style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: ".48rem", letterSpacing: ".12em", textTransform: "uppercase", color: style.color, padding: "2px 7px", border: `1px solid ${style.color}`, borderRadius: "3px", opacity: .9 }}>
                        {style.label}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: ".48rem", color: "var(--ghost)", letterSpacing: ".08em" }}>
                        {formatDate(entry.created_at)}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--bone)", marginBottom: "8px" }}>
                      {entry.title}
                    </h3>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: ".85rem", color: "var(--ash)", lineHeight: 1.6 }}>
                      {entry.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {!isPremium && (
            <div style={{ marginTop: "20px", background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ghost)", marginBottom: "8px" }}>
                Deeper History Locked
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: ".85rem", color: "var(--ghost)", marginBottom: "16px", lineHeight: 1.5 }}>
                Full Archive access requires Premium. Every session narratively preserved.
              </p>
              <Link href="/app/payments" className="btn-ghost" style={{ display: "inline-block", fontSize: ".8rem" }}>
                Upgrade to Premium
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyArchive() {
  return (
    <div style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "var(--ghost)", marginBottom: "12px" }}>◎</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--bone)", marginBottom: "8px" }}>
        Archive Empty
      </div>
      <p style={{ fontFamily: "var(--font-body)", fontSize: ".85rem", color: "var(--ghost)", lineHeight: 1.6, marginBottom: "20px" }}>
        Your training narrative forms over time. Log workouts and check-ins consistently — the system will generate your first archive entry.
      </p>
      <Link href="/app/workouts" className="btn-primary" style={{ display: "inline-block" }}>
        Log a Workout →
      </Link>
    </div>
  );
}

function GenerateButton() {
  return (
    <Link href="/api/claude/archive" style={{ textDecoration: "none" }}>
      <div style={{ background: "var(--vital-dim)", border: "1px solid var(--vital)", borderRadius: "8px", padding: "8px 14px", display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: ".75rem", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--vital)" }}>
          + Generate
        </span>
      </div>
    </Link>
  );
}
