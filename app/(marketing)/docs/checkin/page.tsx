export default function CheckinDocs() {
  return (
    <>
      <div className="doc-breadcrumb"><a href="/docs">Docs</a> / Daily Check-In</div>
      <h1>Daily Check-In</h1>
      <p className="doc-lead">The check-in is the first thing you do every day with VYTALL. It takes under 90 seconds — and it's what makes everything else intelligent.</p>

      <h2>Why it matters</h2>
      <p>VYTALL doesn't give you the same workout every Monday. It reads how you actually feel today — and builds your session around that. The check-in is how it reads you.</p>

      <h2>What you tell VYTALL</h2>
      <ul>
        <li><strong>Energy</strong> — How energized do you feel right now? (1–10)</li>
        <li><strong>Sleep quality</strong> — How was your sleep last night? (1–10)</li>
        <li><strong>Fatigue</strong> — How tired is your body? (1–10)</li>
        <li><strong>Mood</strong> — Mental and emotional state today (1–10)</li>
        <li><strong>Soreness or pain</strong> — Where does it hurt, if anywhere?</li>
        <li><strong>Time available</strong> — How long can you train today?</li>
        <li><strong>Optional note</strong> — Anything else your coach should know</li>
      </ul>

      <h2>What VYTALL gives back</h2>
      <div className="doc-callout">
        <p>After your check-in, VYTALL immediately returns your <strong>readiness score</strong>, today's <strong>training mode</strong>, and your <strong>daily mission</strong> — a precise prescription for the session ahead.</p>
      </div>

      <h2>Training Modes</h2>
      <p>Based on your check-in, VYTALL assigns one of five modes:</p>
      <div style={{ display:"flex", flexDirection:"column", gap:"8px", margin:"16px 0" }}>
        {[
          { mode:"PUSH",     desc:"High readiness. Full intensity. Attack today." },
          { mode:"FORGE",    desc:"Good readiness. Build the pattern. Stay consistent." },
          { mode:"MAINTAIN", desc:"Average readiness. Quality over load today." },
          { mode:"RESTORE",  desc:"Low readiness. Active recovery. Move, don't stress." },
          { mode:"RECOVER",  desc:"Poor readiness. Rest. Your body is asking for it." },
        ].map(m => (
          <div key={m.mode} className="doc-mode">
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"1rem", fontWeight:800, letterSpacing:".1em", color:"var(--bone)", minWidth:"90px" }}>{m.mode}</div>
            <div style={{ fontSize:".86rem", color:"var(--ghost)" }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <h2>How often?</h2>
      <p>Every day you plan to train — or even just want to check in with your body. The more consistently you check in, the better VYTALL understands your patterns and the more precise its coaching becomes.</p>
    </>
  );
}
