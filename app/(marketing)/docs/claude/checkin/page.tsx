export default function CheckinDocs() {
  return (
    <>
      <div className="doc-breadcrumb">
        <a href="/docs">Docs</a> / <a href="/docs/claude">Claude AI</a> / Daily Check-In
      </div>

      <h1>Daily Check-In</h1>
      <p className="doc-lead">
        The daily check-in is the foundation of the entire VYTALL system. Every AI output — mission, mode, archive entry, Ghost comparison — is rooted in what the user reports each day.
      </p>

      <h2>Input Fields</h2>
      <p>The check-in collects seven data points from the user:</p>
      <div style={{ overflowX:"auto", marginBottom:"20px" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:"2px solid var(--border)" }}>
              <th style={{ textAlign:"left", padding:"8px 12px", fontFamily:"'JetBrains Mono',monospace", fontSize:".52rem", letterSpacing:".1em", textTransform:"uppercase", color:"var(--ghost)" }}>Field</th>
              <th style={{ textAlign:"left", padding:"8px 12px", fontFamily:"'JetBrains Mono',monospace", fontSize:".52rem", letterSpacing:".1em", textTransform:"uppercase", color:"var(--ghost)" }}>Type</th>
              <th style={{ textAlign:"left", padding:"8px 12px", fontFamily:"'JetBrains Mono',monospace", fontSize:".52rem", letterSpacing:".1em", textTransform:"uppercase", color:"var(--ghost)" }}>Range</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Energy Level",    "Slider", "1–10"],
              ["Sleep Quality",   "Slider", "1–10"],
              ["Fatigue",         "Slider", "1–10"],
              ["Mood",            "Slider", "1–10"],
              ["Soreness / Pain", "Body map + text", "areas + intensity"],
              ["Time Available",  "Select", "30 / 45 / 60 / 90+ min"],
              ["Optional Note",   "Text", "Free text"],
            ].map(([f, t, r]) => (
              <tr key={f} style={{ borderBottom:"1px solid var(--border)" }}>
                <td style={{ padding:"10px 12px", fontSize:".88rem", color:"var(--bone)" }}>{f}</td>
                <td style={{ padding:"10px 12px", fontSize:".88rem", color:"var(--ghost)" }}>{t}</td>
                <td style={{ padding:"10px 12px", fontFamily:"'JetBrains Mono',monospace", fontSize:".76rem", color:"var(--vital)" }}>{r}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Claude's Output</h2>
      <p>After receiving the check-in data, Claude returns four things as structured JSON:</p>
      <ul>
        <li><strong>Readiness Score</strong> (0–100) — overall physical readiness</li>
        <li><strong>Mode</strong> — one of: PUSH, FORGE, MAINTAIN, RESTORE, RECOVER</li>
        <li><strong>Mission</strong> — today's training prescription in one sharp sentence</li>
        <li><strong>Summary</strong> — 2–3 sentence AI interpretation in VYTALL voice</li>
      </ul>

      <h2>Training Modes</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:"8px", margin:"16px 0" }}>
        {[
          { mode:"PUSH",     color:"#1a1714", desc:"High readiness. Full intensity. Attack the session." },
          { mode:"FORGE",    color:"#3a6647", desc:"Good readiness. Build the pattern. Stay consistent." },
          { mode:"MAINTAIN", color:"#4a4640", desc:"Moderate readiness. Maintain quality without excess load." },
          { mode:"RESTORE",  color:"#888078", desc:"Low readiness. Active recovery. Move, don't stress." },
          { mode:"RECOVER",  color:"#b83228", desc:"Poor readiness. Full rest or very light movement only." },
        ].map(m => (
          <div key={m.mode} style={{ display:"flex", alignItems:"center", gap:"14px", background:"var(--graphite)", border:"1px solid var(--border)", borderRadius:"10px", padding:"12px 16px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"1rem", fontWeight:800, letterSpacing:".1em", color:m.color, minWidth:"90px" }}>{m.mode}</div>
            <div style={{ fontSize:".85rem", color:"var(--ghost)" }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <h2>API Route</h2>
      <p>The check-in is processed at <code>POST /api/claude/checkin</code>. The route receives the form data, constructs the Claude prompt with full user context (profile, recent history), calls the API, stores the result in <code>daily_checkins</code>, and returns the parsed response.</p>

      <pre><code>{`// API response shape
{
  "readiness_score": 73,
  "mode": "FORGE",
  "mission": "Two working sets of heavy compound movement. 
               No failure. Exit with capacity remaining.",
  "ai_summary": "Your energy and sleep are tracking above 
                  your baseline. Fatigue is present but manageable. 
                  Today is a building day — not a testing day."
}`}</code></pre>
    </>
  );
}
