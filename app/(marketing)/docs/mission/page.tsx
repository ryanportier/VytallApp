export default function MissionDocs() {
  return (
    <>
      <div className="doc-breadcrumb"><a href="/docs">Docs</a> / Your Daily Mission</div>
      <h1>Your Daily Mission</h1>
      <p className="doc-lead">Your mission is today's training prescription. Not a template — a session built specifically for today's version of you, based on your check-in and your history.</p>

      <h2>What is a mission?</h2>
      <p>After your daily check-in, VYTALL generates a mission: a sharp, specific directive for your session. It tells you what to focus on, how hard to push, and why — in plain language, no fluff.</p>

      <div className="doc-callout">
        <p>Example: <strong>"Two working sets of heavy compound movement. No failure. Exit with capacity remaining. Your recovery trend requires it."</strong></p>
      </div>

      <h2>What goes into it</h2>
      <ul>
        <li>Your check-in results from today</li>
        <li>Your recent training history</li>
        <li>Your goals and available equipment</li>
        <li>How much time you have</li>
        <li>Your Ghost gap — where you are vs your best self</li>
      </ul>

      <h2>Your training mode</h2>
      <p>Every mission comes with a mode — PUSH, FORGE, MAINTAIN, RESTORE, or RECOVER. The mode sets the tone for the session. Your AI coach decides the mode based on your readiness, not your schedule.</p>

      <h2>The mission screen</h2>
      <p>Once your check-in is done, head to the <strong>Mission</strong> tab. You'll see your mode, your mission for today, and a brief explanation from your coach. From there, you can start logging your workout.</p>
    </>
  );
}
