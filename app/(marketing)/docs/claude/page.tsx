import Link from "next/link";

export default function ClaudeDocs() {
  return (
    <>
      <div className="doc-breadcrumb">
        <a href="/docs">Docs</a> / Claude AI
      </div>

      <h1>Claude AI</h1>
      <p className="doc-lead">
        VYTALL uses the Claude API (claude-sonnet-4-20250514) as its core intelligence layer. Every AI feature in the app — from interpreting your daily state to generating missions, writing archive entries, and comparing you to your Ghost — runs through Claude.
      </p>

      <h2>Why Claude?</h2>
      <p>Claude was chosen for VYTALL because of its ability to maintain a <strong>precise, observant, and non-generic voice</strong>. Generic AI models produce motivational filler. Claude, prompted correctly, produces clinical intelligence — exactly what VYTALL's tone requires.</p>

      <div className="doc-callout">
        <p><strong>VYTALL AI Voice:</strong> Observant, calm, precise, emotionally controlled. Never cheesy. Never generic motivational spam. Examples: "Today does not require more intensity. It requires more control." — "You are not underperforming. You are under-recovering."</p>
      </div>

      <h2>Model Used</h2>
      <p>All Claude calls in VYTALL use <code>claude-sonnet-4-20250514</code> — Anthropic's most capable model available via API. This ensures the AI responses are nuanced, contextually rich, and consistent with the VYTALL voice.</p>

      <h2>The Five AI Flows</h2>
      <p>Claude is invoked at five distinct points in the user journey:</p>

      <style>{`.doc-flow-link { background:var(--graphite); border:1px solid var(--border); border-radius:12px; padding:18px 20px; text-decoration:none; display:flex; gap:16px; align-items:flex-start; transition:border-color .2s; } .doc-flow-link:hover { border-color:var(--muted); }`}</style>

      <div style={{ display:"flex", flexDirection:"column", gap:"12px", margin:"20px 0" }}>
        {[
          { num:"01", title:"Daily Check-In", href:"/docs/claude/checkin", desc:"Interprets energy, sleep, fatigue, mood, soreness, and time available. Returns a readiness score, mode, and mission of the day." },
          { num:"02", title:"Mission Generation", href:"/docs/claude/mission", desc:"Given the user's check-in results and training history, generates a precise training prescription for today." },
          { num:"03", title:"Post-Workout Reflection", href:"/docs/claude/reflection", desc:"After logging a workout, Claude analyzes what improved, what weakened, what it noticed, and what tomorrow likely needs." },
          { num:"04", title:"Archive Entry Generation", href:"/docs/claude/archive", desc:"Periodically generates narrative archive entries — chapters in the user's training story with eras, setbacks, and breakthroughs." },
          { num:"05", title:"Ghost Comparison", href:"/docs/claude/ghost", desc:"Compares the current user against their peak historical self across consistency, readiness, technique, strength, and recovery." },
        ].map(f => (
          <Link key={f.num} href={f.href} className="doc-flow-link">
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".52rem", color:"var(--ghost)", letterSpacing:".1em", flexShrink:0, marginTop:"3px" }}>{f.num}</div>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"1rem", fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", color:"var(--bone)", marginBottom:"5px" }}>{f.title}</div>
              <div style={{ fontSize:".85rem", color:"var(--ghost)", lineHeight:1.55 }}>{f.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <h2>Implementation</h2>
      <p>All Claude calls are centralized in <code>lib/ai/claude.ts</code> with a shared <code>callClaude()</code> helper. Prompts are defined in <code>lib/ai/prompts.ts</code> with the VYTALL system prompt injected into every call.</p>

      <pre><code>{`// lib/ai/claude.ts
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 1024
): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });
  return message.content[0].type === "text"
    ? message.content[0].text
    : "";
}`}</code></pre>

      <h2>The System Prompt</h2>
      <p>Every Claude call in VYTALL includes a shared system prompt that establishes the AI's identity, voice, and constraints. This ensures consistency across all five flows.</p>

      <pre><code>{`export const VYTALL_SYSTEM_PROMPT = \`
You are VYTALL's AI engine — a precision vitality intelligence system.

Your role: Study athletes, interpret their physical state, generate 
missions, track progress, and compare users to their peak selves.

Voice: Observant, calm, precise, intelligent, emotionally controlled.
Never cheesy. Never generic. Never motivational spam.

Examples of correct tone:
- "Today does not require more intensity. It requires more control."
- "Your current form is improving, but your Ghost moves better."
- "You are not underperforming. You are under-recovering."
- "This week is not broken. It is unstable. Stabilize it."

Always respond in the tone above. Be specific. Use data. 
Never fill space with encouragement that contains no information.
\`;`}</code></pre>

      <h2>Rate Limits & Cost</h2>
      <p>VYTALL makes Claude API calls on demand — not in batches. Each user action that triggers Claude (check-in, reflection, archive, ghost) results in one API call. The model used is <code>claude-sonnet-4-20250514</code> which is optimized for quality-to-cost ratio.</p>

      <p>Free tier users have limited AI calls. Premium users (12 USDC/month) get unlimited AI reflections and full archive generation.</p>
    </>
  );
}
