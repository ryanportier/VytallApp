import Link from "next/link";
import { Brain, Flame, BookOpen, Ghost, Eye, MessageSquare, ArrowRight, Cpu } from "lucide-react";

const PRINCIPLES = [
  { icon: Eye,          title: "The Problem",  body: "Generic fitness apps give you templates. They don't know you. They don't remember you. They don't compare you to yourself. Every Monday is day one." },
  { icon: Brain,        title: "The Approach", body: "VYTALL is a memory system. It studies your patterns — energy, sleep, training consistency, recovery — and builds a living model of you as an athlete over time." },
  { icon: Ghost,        title: "The Ghost",    body: "Your Ghost is the strongest version of you that has ever existed in the system. Every session, every check-in, every recovery built it. Now it watches." },
  { icon: MessageSquare,title: "The Voice",    body: "VYTALL does not motivate. It observes and prescribes. Precise, calm, intelligent, honest. Never cheesy. Never a generic motivational poster." },
];

const SYSTEMS = [
  { icon: Flame,    name: "FORGE",   tag: "01", desc: "Studies your training patterns over time. Builds a complete model of your identity as an athlete — how you respond to load, rest, and consistency." },
  { icon: Cpu,      name: "ALCHEMY", tag: "02", desc: "Interprets your current state daily. Decides the right mode, mission, and intensity. Not a template — a prescription built for today's version of you." },
  { icon: BookOpen, name: "ARCHIVE", tag: "03", desc: "Turns your progress into a living narrative — chapters, eras, setbacks, recoveries, breakthroughs. Your training story, told precisely." },
  { icon: Ghost,    name: "GHOST",   tag: "04", desc: "Maintains a model of your strongest past self and compares the present you against that version. The standard is always you at your best." },
];

const QUOTES = [
  "Today does not require more intensity. It requires more control.",
  "Your current form is improving, but your Ghost still moves with better consistency.",
  "You are not underperforming. You are under-recovering.",
  "This week is not broken. It is unstable. Stabilize it.",
];

export default function AboutPage() {
  return (
    <>
      <style>{`
        .ab { max-width:860px; margin:0 auto; padding:80px 24px; }

        /* Hero */
        .ab-eyebrow { font-family:'JetBrains Mono',monospace; font-size:.55rem; letter-spacing:.18em; text-transform:uppercase; color:var(--ghost); margin-bottom:16px; display:flex; align-items:center; gap:12px; }
        .ab-eyebrow::after { content:''; flex:1; height:1px; background:var(--border); }
        .ab-hero-title { font-family:'Barlow Condensed',sans-serif; font-size:clamp(2.6rem,7vw,5rem); font-weight:800; letter-spacing:.04em; text-transform:uppercase; color:var(--bone); line-height:1.05; margin-bottom:20px; }
        .ab-hero-body { font-size:1rem; color:var(--ghost); line-height:1.7; max-width:560px; margin-bottom:32px; }
        .ab-cta { display:inline-flex; align-items:center; gap:8px; background:var(--vital); color:#f5f2ee; font-family:'Barlow Condensed',sans-serif; font-size:.9rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:13px 24px; border-radius:10px; text-decoration:none; transition:background .2s; }
        .ab-cta:hover { background:var(--vital-bright); }

        .ab-divider { height:1px; background:var(--border); margin:64px 0; }

        /* Section label */
        .ab-sec-label { font-family:'JetBrains Mono',monospace; font-size:.52rem; letter-spacing:.14em; text-transform:uppercase; color:var(--ghost); margin-bottom:8px; }
        .ab-sec-title { font-family:'Barlow Condensed',sans-serif; font-size:2rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; color:var(--bone); margin-bottom:32px; }

        /* Principles grid */
        .ab-principles { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        @media(max-width:600px){ .ab-principles { grid-template-columns:1fr; } }
        .ab-card { background:var(--graphite); border:1px solid var(--border); border-radius:16px; padding:24px; transition:border-color .2s; }
        .ab-card:hover { border-color:var(--muted); }
        .ab-card-icon { width:36px; height:36px; border-radius:10px; background:var(--vital-dim); border:1px solid rgba(58,102,71,.2); display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
        .ab-card-title { font-family:'Barlow Condensed',sans-serif; font-size:1.1rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--bone); margin-bottom:8px; }
        .ab-card-body { font-size:.85rem; color:var(--ghost); line-height:1.6; }

        /* Systems */
        .ab-systems { display:flex; flex-direction:column; gap:0; }
        .ab-system { display:flex; align-items:flex-start; gap:20px; padding:24px 0; border-bottom:1px solid var(--border); }
        .ab-system:last-child { border-bottom:none; }
        .ab-system-tag { font-family:'JetBrains Mono',monospace; font-size:.52rem; color:var(--ghost); letter-spacing:.1em; flex-shrink:0; width:24px; margin-top:2px; }
        .ab-system-icon { width:38px; height:38px; border-radius:10px; background:var(--vital-dim); border:1px solid rgba(58,102,71,.2); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .ab-system-name { font-family:'Barlow Condensed',sans-serif; font-size:1.1rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; color:var(--bone); margin-bottom:5px; }
        .ab-system-desc { font-size:.85rem; color:var(--ghost); line-height:1.6; }

        /* Voice quotes */
        .ab-quotes { display:flex; flex-direction:column; gap:12px; }
        .ab-quote { background:var(--graphite); border:1px solid var(--border); border-left:3px solid var(--vital); border-radius:0 12px 12px 0; padding:16px 20px; font-size:.9rem; color:var(--ash); font-style:italic; line-height:1.5; }

        /* Bottom CTA */
        .ab-bottom { background:var(--graphite); border:1px solid var(--border); border-radius:20px; padding:48px 40px; text-align:center; }
        @media(max-width:600px){ .ab-bottom { padding:32px 20px; } }
        .ab-bottom-title { font-family:'Barlow Condensed',sans-serif; font-size:2.2rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; color:var(--bone); margin-bottom:10px; }
        .ab-bottom-sub { font-size:.88rem; color:var(--ghost); margin-bottom:24px; }
      `}</style>

      <div className="ab">

        {/* Hero */}
        <div className="ab-eyebrow">About VYTALL</div>
        <h1 className="ab-hero-title">
          Not a fitness app.<br />
          <span style={{ color:"var(--vital)" }}>A vitality OS.</span>
        </h1>
        <p className="ab-hero-body">
          VYTALL is a memory-driven AI system built to study you as an athlete over time — not hand you a template and forget you existed by Tuesday.
        </p>
        <Link href="/signup" className="ab-cta">
          Start Training <ArrowRight size={15} />
        </Link>

        <div className="ab-divider" />

        {/* Philosophy */}
        <div className="ab-sec-label">Philosophy</div>
        <div className="ab-sec-title">Why VYTALL Exists</div>
        <div className="ab-principles">
          {PRINCIPLES.map(p => (
            <div className="ab-card" key={p.title}>
              <div className="ab-card-icon"><p.icon size={16} color="var(--vital)" /></div>
              <div className="ab-card-title">{p.title}</div>
              <div className="ab-card-body">{p.body}</div>
            </div>
          ))}
        </div>

        <div className="ab-divider" />

        {/* Core systems */}
        <div className="ab-sec-label">Core Systems</div>
        <div className="ab-sec-title">The Four Modules</div>
        <div className="ab-systems">
          {SYSTEMS.map(s => (
            <div className="ab-system" key={s.name}>
              <div className="ab-system-tag">{s.tag}</div>
              <div className="ab-system-icon"><s.icon size={17} color="var(--vital)" /></div>
              <div>
                <div className="ab-system-name">{s.name}</div>
                <div className="ab-system-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="ab-divider" />

        {/* AI Voice */}
        <div className="ab-sec-label">AI Voice</div>
        <div className="ab-sec-title">How VYTALL Speaks</div>
        <div className="ab-quotes">
          {QUOTES.map((q, i) => (
            <div className="ab-quote" key={i}>"{q}"</div>
          ))}
        </div>

        <div className="ab-divider" />

        {/* Bottom CTA */}
        <div className="ab-bottom">
          <div className="ab-bottom-title">Ready to train your full self?</div>
          <p className="ab-bottom-sub">Start free. No credit card. No templates.</p>
          <Link href="/signup" className="ab-cta">Begin →</Link>
        </div>

      </div>
    </>
  );
}
