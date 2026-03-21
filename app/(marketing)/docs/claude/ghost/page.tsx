export default function GhostDocs() {
  return (
    <>
      <div className="doc-breadcrumb">
        <a href="/docs">Docs</a> / <a href="/docs/claude">Claude AI</a> / Ghost Engine
      </div>

      <h1>Ghost Engine</h1>
      <p className="doc-lead">
        The Ghost is VYTALL's most distinctive feature. It maintains a model of the user's strongest past self — and every session, every check-in, every recovery is measured against it.
      </p>

      <div className="doc-callout">
        <p>"Your current form is improving, but your Ghost still moves with better consistency."</p>
      </div>

      <h2>What is the Ghost?</h2>
      <p>The Ghost is a snapshot of the user at their historical peak — not a single moment, but a composite model built from the best scores across five dimensions:</p>
      <ul>
        <li><strong>Consistency Score</strong> — how regularly the user checked in and trained</li>
        <li><strong>Readiness Score</strong> — average peak readiness during their best period</li>
        <li><strong>Technique Score</strong> — movement quality from video analyses (Phase 2)</li>
        <li><strong>Strength Score</strong> — training load and progression trend</li>
        <li><strong>Recovery Score</strong> — sleep quality and recovery discipline</li>
      </ul>

      <h2>Ghost Snapshot Data</h2>
      <p>Ghost data is stored in the <code>ghost_snapshots</code> table in Supabase. The system periodically generates new snapshots and the peak is retrieved via a database function:</p>
      <pre><code>{`-- Supabase function to get peak ghost
create or replace function get_peak_ghost(p_user_id uuid)
returns ghost_snapshots as $$
  select * from ghost_snapshots
  where user_id = p_user_id
  order by (
    consistency_score + readiness_score + 
    strength_score + recovery_score
  ) desc
  limit 1;
$$ language sql security definer;`}</code></pre>

      <h2>Claude's Ghost Comparison Prompt</h2>
      <p>When a user requests a Ghost comparison, Claude receives both current metrics and peak Ghost data and generates a multi-dimensional analysis:</p>
      <pre><code>{`const prompt = \`Compare this athlete's current state vs their Ghost.

CURRENT STATE:
- Readiness: \${readiness}/100
- Recent workouts: \${workoutCount} this week
- Last check-in: \${lastCheckin}

GHOST (Peak Self):
- Consistency: \${ghost.consistency_score}/100
- Readiness: \${ghost.readiness_score}/100  
- Strength: \${ghost.strength_score}/100
- Recovery: \${ghost.recovery_score}/100
- Ghost period: \${ghost.created_at}

Return JSON with:
{
  "overall_gap": "closing|stable|widening",
  "dimensions": [
    { "name": "Consistency", "current": N, "ghost": N, "verdict": "..." }
  ],
  "summary": "...",
  "prescription": "..."
}\`;`}</code></pre>

      <h2>Ghost API Route</h2>
      <p>The Ghost comparison is served via <code>/api/claude/ghost</code> — a POST endpoint that pulls both current user data and peak Ghost snapshot from Supabase, then calls Claude.</p>

      <h2>Free vs Premium</h2>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", margin:"16px 0" }}>
        {[
          { tier:"Free", features:["Limited Ghost summary", "Overall gap only", "Basic prescription"] },
          { tier:"Premium", features:["Full Ghost breakdown", "All 5 dimensions", "Historical trend", "Deep prescription", "Era comparison"] },
        ].map(t => (
          <div key={t.tier} style={{ background:"var(--graphite)", border:"1px solid var(--border)", borderRadius:"12px", padding:"16px" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".52rem", letterSpacing:".12em", textTransform:"uppercase", color:"var(--ghost)", marginBottom:"10px" }}>{t.tier} Tier</div>
            {t.features.map(f => <div key={f} style={{ fontSize:".84rem", color:"var(--ash)", marginBottom:"5px" }}>✓ {f}</div>)}
          </div>
        ))}
      </div>
    </>
  );
}
