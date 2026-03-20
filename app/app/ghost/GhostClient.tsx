"use client";
import { useState } from "react";
import Link from "next/link";
import type { GhostSnapshot } from "@/types";

interface Props {
  currentScores: { consistency: number; readiness: number; technique: number; strength: number; recovery: number };
  peakGhost: GhostSnapshot | null;
  hasData: boolean;
  userId: string;
}

const DIMS = [
  { key: "consistency" as const, label: "Consistency", icon: "◎" },
  { key: "readiness"   as const, label: "Readiness",   icon: "✦" },
  { key: "technique"  as const, label: "Technique",   icon: "▲" },
  { key: "strength"   as const, label: "Strength",    icon: "◆" },
  { key: "recovery"   as const, label: "Recovery",    icon: "◉" },
];

// Human figure SVG — two overlapping silhouettes
function GhostFigure({ currentTotal, peakTotal, hasGhost }: {
  currentTotal: number;
  peakTotal: number;
  hasGhost: boolean;
}) {
  const gap = hasGhost ? peakTotal - currentTotal : 0;
  const gapPct = Math.min(Math.max(gap / 100, 0), 0.4);

  // ghost is slightly larger/more transparent based on gap
  const ghostScale = 1 + gapPct * 0.3;
  const ghostOpacity = 0.18 + gapPct * 0.25;

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: "280px" }}>
      <style>{`
        @keyframes ghostFloat { 0%,100%{transform:translateY(0) scale(${ghostScale})} 50%{transform:translateY(-8px) scale(${ghostScale * 1.01})} }
        @keyframes youPulse   { 0%,100%{filter:drop-shadow(0 0 8px rgba(58,102,71,.25))} 50%{filter:drop-shadow(0 0 18px rgba(58,102,71,.45))} }
        @keyframes scanFig    { 0%{transform:translateY(-100%)} 100%{transform:translateY(360px)} }
        .ghost-fig-ghost { animation: ghostFloat 5s ease-in-out infinite; transform-origin: bottom center; }
        .ghost-fig-you   { animation: youPulse 3s ease-in-out infinite; }
        .ghost-fig-scan  {
          position: absolute; left: 10%; right: 10%; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(58,102,71,.5), transparent);
          animation: scanFig 4s linear infinite;
          pointer-events: none;
        }
      `}</style>

      {/* Ghost figure — behind, slightly larger, translucent */}
      {hasGhost && (
        <svg className="ghost-fig-ghost" style={{ position:"absolute", bottom:0, opacity: ghostOpacity }}
          width="120" height="240" viewBox="0 0 60 120">
          {/* Head */}
          <circle cx="30" cy="14" r="10" fill="#888078" />
          {/* Neck */}
          <rect x="27" y="23" width="6" height="6" rx="2" fill="#888078" />
          {/* Torso */}
          <path d="M16 29 Q30 27 44 29 L42 72 Q30 75 18 72 Z" fill="#888078" />
          {/* Left arm */}
          <path d="M16 31 Q8 45 10 62" stroke="#888078" strokeWidth="7" strokeLinecap="round" fill="none"/>
          {/* Right arm */}
          <path d="M44 31 Q52 45 50 62" stroke="#888078" strokeWidth="7" strokeLinecap="round" fill="none"/>
          {/* Left leg */}
          <path d="M22 72 Q19 92 20 110" stroke="#888078" strokeWidth="8" strokeLinecap="round" fill="none"/>
          {/* Right leg */}
          <path d="M38 72 Q41 92 40 110" stroke="#888078" strokeWidth="8" strokeLinecap="round" fill="none"/>
          {/* Ghost label */}
          <text x="30" y="118" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="6" fill="#888078" letterSpacing="1">GHOST</text>
        </svg>
      )}

      {/* YOU figure — front, solid green */}
      <svg className="ghost-fig-you" style={{ position:"absolute", bottom:0 }}
        width="100" height="200" viewBox="0 0 60 120">
        {/* Head */}
        <circle cx="30" cy="14" r="10" fill="#3a6647" />
        {/* Face highlight */}
        <circle cx="27" cy="12" r="3" fill="rgba(255,255,255,.2)" />
        {/* Neck */}
        <rect x="27" y="23" width="6" height="6" rx="2" fill="#3a6647" />
        {/* Torso */}
        <path d="M16 29 Q30 27 44 29 L42 72 Q30 75 18 72 Z" fill="#3a6647" />
        {/* Torso highlight */}
        <path d="M22 32 Q30 30 38 32 L37 50 Q30 52 23 50 Z" fill="rgba(255,255,255,.08)" />
        {/* Left arm */}
        <path d="M16 31 Q8 45 10 62" stroke="#3a6647" strokeWidth="7" strokeLinecap="round" fill="none"/>
        {/* Right arm */}
        <path d="M44 31 Q52 45 50 62" stroke="#3a6647" strokeWidth="7" strokeLinecap="round" fill="none"/>
        {/* Left leg */}
        <path d="M22 72 Q19 92 20 110" stroke="#3a6647" strokeWidth="8" strokeLinecap="round" fill="none"/>
        {/* Right leg */}
        <path d="M38 72 Q41 92 40 110" stroke="#3a6647" strokeWidth="8" strokeLinecap="round" fill="none"/>
        {/* YOU label */}
        <text x="30" y="118" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="6" fill="#3a6647" letterSpacing="2">YOU</text>
      </svg>

      {/* Scan line */}
      <div className="ghost-fig-scan" />

      {/* Score bubbles */}
      <div style={{ position:"absolute", top:8, left:0, right:0, display:"flex", justifyContent:"space-between", padding:"0 8px" }}>
        <div style={{ background:"var(--graphite)", border:"1px solid var(--border)", borderRadius:"8px", padding:"6px 10px", textAlign:"center" }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"1.2rem", fontWeight:800, color:"#3a6647", lineHeight:1 }}>{currentTotal.toFixed(0)}</div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".42rem", color:"var(--ghost)", textTransform:"uppercase", letterSpacing:".1em" }}>You</div>
        </div>
        {hasGhost && (
          <div style={{ background:"var(--graphite)", border:"1px solid var(--border)", borderRadius:"8px", padding:"6px 10px", textAlign:"center" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"1.2rem", fontWeight:800, color:"var(--ash)", lineHeight:1 }}>{peakTotal.toFixed(0)}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".42rem", color:"var(--ghost)", textTransform:"uppercase", letterSpacing:".1em" }}>Ghost</div>
          </div>
        )}
      </div>

      {/* Gap label */}
      {hasGhost && gap > 0 && (
        <div style={{ position:"absolute", bottom:140, left:"50%", transform:"translateX(-50%)", background:"rgba(184,50,40,.1)", border:"1px solid rgba(184,50,40,.2)", borderRadius:"6px", padding:"4px 10px", whiteSpace:"nowrap" }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".48rem", color:"#b83228", letterSpacing:".1em", textTransform:"uppercase" }}>
            Gap: −{gap.toFixed(0)}
          </span>
        </div>
      )}
    </div>
  );
}

function DimBar({ label, icon, current, peak }: { label: string; icon: string; current: number; peak: number }) {
  const delta = current - peak;
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"7px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <span style={{ fontFamily:"monospace", fontSize:".7rem", color:"var(--vital)" }}>{icon}</span>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".52rem", letterSpacing:".12em", textTransform:"uppercase", color:"var(--ghost)" }}>{label}</span>
        </div>
        <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
          {peak > 0 && <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".5rem", color:"var(--ghost)" }}>Ghost {peak}</span>}
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"1rem", fontWeight:700, color: delta >= 0 ? "var(--vital)" : "var(--ash)" }}>
            {current > 0 ? (delta >= 0 ? `+${delta}` : `${delta}`) : "—"}
          </span>
        </div>
      </div>
      <div style={{ position:"relative", height:"3px", background:"var(--border)", borderRadius:"2px" }}>
        {peak > 0 && <div style={{ position:"absolute", top:0, left:0, height:"3px", width:`${peak}%`, background:"var(--muted)", borderRadius:"2px", opacity:.4 }} />}
        {current > 0 && <div style={{ position:"absolute", top:0, left:0, height:"3px", width:`${current}%`, background:"var(--vital)", borderRadius:"2px", transition:"width 1s cubic-bezier(.16,1,.3,1)" }} />}
      </div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"3px" }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".46rem", color:current>0?"var(--vital)":"var(--ghost)", letterSpacing:".08em" }}>
          {current > 0 ? `YOU ${current}` : "NO DATA"}
        </span>
      </div>
    </div>
  );
}

export default function GhostClient({ currentScores, peakGhost, hasData }: Props) {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<{ current_vs_ghost: string; verdict: string; is_baseline?: boolean } | null>(null);
  const [error, setError] = useState("");

  const currentTotal = Object.values(currentScores).reduce((a, b) => a + b, 0) / 5;
  const peakTotal = peakGhost
    ? (peakGhost.consistency_score + peakGhost.readiness_score + peakGhost.technique_score + peakGhost.strength_score + peakGhost.recovery_score) / 5
    : 0;

  async function generateReport() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/claude/ghost", { method: "POST" });
      if (!res.ok) throw new Error();
      setReport(await res.json());
    } catch { setError("Could not generate Ghost report. Try again."); }
    finally { setLoading(false); }
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .ghost-page { padding:32px; display:flex; flex-direction:column; gap:24px; }
        @media(max-width:768px){.ghost-page{padding:20px 16px}}
        .ghost-layout { display:grid; grid-template-columns:1fr 1fr; gap:24px; align-items:start; }
        @media(max-width:700px){.ghost-layout{grid-template-columns:1fr}}
        .ghost-card { background:var(--graphite); border:1px solid var(--border); border-radius:18px; padding:24px; animation:fadeUp .5s ease-out both; }
      `}</style>

      <div className="ghost-page">
        <div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".52rem", letterSpacing:".14em", textTransform:"uppercase", color:"var(--ghost)", marginBottom:"4px" }}>Ghost Engine</div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"2.2rem", fontWeight:800, letterSpacing:".04em", textTransform:"uppercase", color:"var(--bone)", lineHeight:1 }}>Your Ghost</h1>
        </div>

        {!hasData ? (
          <div className="ghost-card" style={{ textAlign:"center", padding:"40px" }}>
            <div style={{ fontSize:"3rem", marginBottom:"16px" }}>◉</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"1.2rem", fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"var(--bone)", marginBottom:"8px" }}>Ghost Not Yet Formed</div>
            <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:".85rem", color:"var(--ghost)", lineHeight:1.6, marginBottom:"20px" }}>
              Check in daily and log workouts. The Ghost forms once the system has enough data to model your peak.
            </p>
            <Link href="/app/check-in" style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"var(--vital)", color:"#f5f2ee", fontFamily:"'Barlow Condensed',sans-serif", fontSize:".85rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", padding:"12px 22px", borderRadius:"8px", textDecoration:"none" }}>
              Start Check-In →
            </Link>
          </div>
        ) : (
          <div className="ghost-layout">
            {/* Left — figure */}
            <div className="ghost-card">
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".5rem", letterSpacing:".12em", textTransform:"uppercase", color:"var(--ghost)", marginBottom:"16px", display:"flex", justifyContent:"space-between" }}>
                <span>Visual Comparison</span>
                {peakGhost && <span style={{ color:"var(--ash)" }}>Peak snapshot</span>}
              </div>
              <GhostFigure currentTotal={currentTotal} peakTotal={peakTotal} hasGhost={!!peakGhost} />

              {/* Legend */}
              <div style={{ display:"flex", gap:"16px", justifyContent:"center", marginTop:"12px" }}>
                {[{ color:"#3a6647", label:"You (now)" }, { color:"#888078", label:"Ghost (peak)" }].map(l => (
                  <div key={l.label} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                    <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:l.color, opacity:.8 }} />
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".46rem", color:"var(--ghost)", textTransform:"uppercase", letterSpacing:".08em" }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — bars + report */}
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              <div className="ghost-card" style={{ animationDelay:".1s" }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".5rem", letterSpacing:".12em", textTransform:"uppercase", color:"var(--ghost)", marginBottom:"18px" }}>
                  Dimension Breakdown
                </div>
                {DIMS.map(d => (
                  <DimBar key={d.key} label={d.label} icon={d.icon}
                    current={currentScores[d.key]}
                    peak={peakGhost ? (peakGhost as unknown as Record<string,number>)[`${d.key}_score`] : 0}
                  />
                ))}
              </div>

              {/* AI report */}
              {report ? (
                <div className="ghost-card" style={{ animationDelay:".2s" }}>
                  {!report.is_baseline && (
                    <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:".875rem", color:"var(--ash)", lineHeight:1.6, fontStyle:"italic", marginBottom:"12px" }}>
                      "{report.current_vs_ghost}"
                    </p>
                  )}
                  <div style={{ borderTop:"1px solid var(--border)", paddingTop:"12px" }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".5rem", letterSpacing:".12em", textTransform:"uppercase", color:"var(--vital)", marginBottom:"6px" }}>Verdict</div>
                    <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"1rem", fontWeight:600, color:"var(--bone)", lineHeight:1.45 }}>"{report.verdict}"</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={generateReport} disabled={loading}
                  style={{ background:"var(--vital)", color:"#f5f2ee", fontFamily:"'Barlow Condensed',sans-serif", fontSize:".9rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", padding:"14px", borderRadius:"12px", border:"none", cursor:loading?"not-allowed":"pointer", opacity:loading?.6:1, transition:"background .2s" }}
                >
                  {loading ? "Analyzing..." : "Generate Ghost Report →"}
                </button>
              )}

              {error && <div style={{ background:"rgba(184,50,40,.08)", border:"1px solid rgba(184,50,40,.2)", borderRadius:"8px", padding:"12px", fontSize:".82rem", color:"#b83228" }}>{error}</div>}

              {/* x402 */}
              <div className="ghost-card" style={{ animationDelay:".3s", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:".9rem", fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", color:"var(--bone)", marginBottom:"3px" }}>Deep Ghost Report</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".48rem", letterSpacing:".1em", color:"var(--ghost)", textTransform:"uppercase" }}>Full breakdown · $0.50 USDC</div>
                </div>
                <Link href="/app/payments" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:".78rem", fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", color:"var(--ash)", background:"transparent", border:"1px solid var(--border)", padding:"7px 14px", borderRadius:"7px", textDecoration:"none", transition:"all .2s" }}>
                  Unlock
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
