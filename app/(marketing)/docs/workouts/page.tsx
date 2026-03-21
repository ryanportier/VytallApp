export default function WorkoutsDocs() {
  return (
    <>
      <div className="doc-breadcrumb"><a href="/docs">Docs</a> / Logging Workouts</div>
      <h1>Logging Workouts</h1>
      <p className="doc-lead">Every session you log becomes part of your history — and your AI coach uses that history to coach you better tomorrow.</p>

      <h2>What to log</h2>
      <ul>
        <li><strong>Session title</strong> — What did you train? (Upper body, Run, Legs, etc.)</li>
        <li><strong>Exercises</strong> — Each movement with sets, reps, or duration</li>
        <li><strong>Completion</strong> — Did you finish the session?</li>
        <li><strong>Notes</strong> — How it felt, what you noticed</li>
      </ul>

      <h2>After you log</h2>
      <p>Once you save a session, your AI coach generates a <strong>post-workout reflection</strong> — a short read that tells you what improved, what to watch, what the coach noticed, and what tomorrow likely needs.</p>

      <div className="doc-callout">
        <p>Example reflection: <strong>"Strength trend is up for the third consecutive session. Recovery between sets is improving. Tomorrow's check-in will be the deciding factor — don't skip it."</strong></p>
      </div>

      <h2>How it feeds the system</h2>
      <p>Your logged sessions feed your Ghost score, your Archive, and your future missions. The more accurately you log, the more precise your coaching becomes. Honest data makes a better coach.</p>

      <h2>How many can I save?</h2>
      <p>Free users can save up to 3 sessions. Premium users get full history and unlimited reflections.</p>
    </>
  );
}
