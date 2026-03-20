import Link from "next/link";
import { Brain, Flame, BookOpen, Ghost, Eye, Target, Cpu, MessageSquare, ArrowRight } from "lucide-react";

const PRINCIPLES = [
  {
    icon: Eye,
    title: "The Problem",
    body: "Generic fitness apps give you templates. They don't know you. They don't remember you. They don't compare you to yourself. Every Monday is day one.",
  },
  {
    icon: Brain,
    title: "The Approach",
    body: "VYTALL is a memory system. It studies your patterns — energy, sleep, training consistency, recovery — and builds a living model of you as an athlete over time.",
  },
  {
    icon: Ghost,
    title: "The Ghost",
    body: "Your Ghost is the strongest version of you that has ever existed in the system. Every session, every check-in, every recovery built it. Now it watches.",
  },
  {
    icon: MessageSquare,
    title: "The Voice",
    body: "VYTALL does not motivate. It observes and prescribes. Precise, calm, intelligent, honest. Never cheesy. Never a generic motivational poster.",
  },
];

const SYSTEMS = [
  { icon: Flame,    name: "FORGE",   tag: "01", desc: "Studies your training patterns over time. Builds a complete model of your identity as an athlete — how you respond to load, rest, and consistency." },
  { icon: Cpu,      name: "ALCHEMY", tag: "02", desc: "Interprets your current state daily. Decides the right mode, mission, and intensity. Not a template — a prescription built for today's version of you." },
  { icon: BookOpen, name: "ARCHIVE", tag: "03", desc: "Turns your progress into a living narrative — chapters, eras, setbacks, recoveries, breakthroughs. Your training story, told precisely." },
  { icon: Ghost,    name: "GHOST",   tag: "04", desc: "Maintains a model of your strongest past self. Compares who you are now against who you were at peak across 5 dimensions." },
];

const VOICE_EXAMPLES = [
  "Today does not require more intensity. It requires more control.",
  "Your current form is improving, but your Ghost still moves with better consistency.",
  "You are not underperforming. You are under-recovering.",
  "This week is not broken. It is unstable. Stabilize it.",
  "The gap to your Ghost is closing. Do not accelerate. Let the consistency do the work.",
];

export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800&family=Barlow:wght@300;400;500&family=JetBrains+Mono:wght@300;400&display=swap');

        :root {
          --void:#090909; --obsidian:#101010; --graphite:#181818;
          --border:#282828; --muted:#383838;
          --ghost:#777; --ash:#aaa; --bone:#e6e2da;
          --vital:#4a7c59; --vital-bright:#5d9e70; --vital-dim:#1e3328;
        }

        .a-wrap { background:var(--void); color:var(--bone); font-family:'Barlow',sans-serif; min-height:100dvh; padding-top:64px; }

        /* HERO */
        .a-hero { padding:80px 24px 72px; max-width:900px; margin:0 auto; position:relative; }
        .a-hero-label { display:flex; align-items:center; gap:12px; margin-bottom:20px; }
        .a-hero-line  { width:20px; height:1px; background:var(--vital); }
        .a-hero-lbl   { font-family:'JetBrains Mono',monospace; font-size:.58rem; letter-spacing:.16em; color:var(--ghost); text-transform:uppercase; }
        .a-hero-h1    { font-family:'Barlow Condensed',sans-serif; font-size:clamp(3rem,6vw,5.5rem); font-weight:800; letter-spacing:.04em; text-transform:uppercase; color:var(--bone); line-height:.9; margin-bottom:28px; }
        .a-hero-h1 span { color:var(--vital); }
        .a-hero-sub   { font-size:1rem; color:var(--ash); line-height:1.7; max-width:520px; margin-bottom:36px; }
        .a-hero-cta   { display:inline-flex; align-items:center; gap:10px; background:var(--vital); color:#040f08; font-family:'Barlow Condensed',sans-serif; font-size:.85rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:12px 22px; border-radius:8px; text-decoration:none; transition:background .2s; }
        .a-hero-cta:hover { background:var(--vital-bright); }

        /* PRINCIPLES */
        .a-section { padding:72px 24px; border-top:1px solid var(--border); }
        .a-section-inner { max-width:900px; margin:0 auto; }
        .a-slabel { display:flex; align-items:center; gap:12px; margin-bottom:36px; }
        .a-sline  { width:16px; height:1px; background:var(--vital); }
        .a-slbl   { font-family:'JetBrains Mono',monospace; font-size:.56rem; letter-spacing:.16em; color:var(--ghost); text-transform:uppercase; }
        .a-sh2    { font-family:'Barlow Condensed',sans-serif; font-size:clamp(2rem,4vw,3rem); font-weight:800; letter-spacing:.04em; text-transform:uppercase; color:var(--bone); line-height:.95; margin-bottom:40px; }
        .a-sh2 span { color:var(--vital); }

        .a-principles { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        @media(max-width:640px){ .a-principles{grid-template-columns:1fr} }
        .a-principle { background:var(--graphite); border:1px solid var(--border); border-radius:14px; padding:24px; transition:border-color .2s; }
        .a-principle:hover { border-color:var(--muted); }
        .a-p-icon { width:36px; height:36px; border-radius:9px; background:var(--vital-dim); border:1px solid rgba(74,124,89,.22); display:flex; align-items:center; justify-content:center; margin-bottom:16px; }
        .a-p-title { font-family:'Barlow Condensed',sans-serif; font-size:1.05rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--bone); margin-bottom:8px; }
        .a-p-body  { font-size:.84rem; color:var(--ghost); line-height:1.65; }

        /* SYSTEMS */
        .a-systems { display:flex; flex-direction:column; gap:1px; background:var(--border); border:1px solid var(--border); border-radius:16px; overflow:hidden; }
        .a-system  { background:var(--graphite); padding:24px 28px; display:grid; grid-template-columns:auto 1fr; gap:20px; align-items:start; transition:background .2s; }
        .a-system:hover { background:#1e1e1e; }
        .a-sys-icon { width:44px; height:44px; border-radius:10px; background:var(--vital-dim); border:1px solid rgba(74,124,89,.22); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .a-sys-num  { font-family:'JetBrains Mono',monospace; font-size:.45rem; letter-spacing:.16em; color:var(--vital); text-transform:uppercase; margin-bottom:4px; }
        .a-sys-name { font-family:'Barlow Condensed',sans-serif; font-size:1.3rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--bone); margin-bottom:6px; }
        .a-sys-desc { font-size:.83rem; color:var(--ghost); line-height:1.6; }

        /* VOICE */
        .a-voice { background:var(--obsidian); }
        .a-voice-quotes { display:flex; flex-direction:column; gap:12px; }
        .a-voice-q { background:var(--graphite); border:1px solid var(--border); border-radius:12px; padding:18px 20px; display:flex; gap:14px; align-items:flex-start; transition:border-color .2s; }
        .a-voice-q:hover { border-color:var(--muted); }
        .a-voice-mark { font-family:'Barlow Condensed',sans-serif; font-size:1.8rem; color:var(--vital); opacity:.4; line-height:1; flex-shrink:0; margin-top:-2px; }
        .a-voice-txt  { font-family:'Barlow',sans-serif; font-size:.9rem; color:var(--ash); line-height:1.55; font-style:italic; }

        /* TARGET */
        .a-target { background:var(--void); }
        .a-target-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
        @media(max-width:640px){ .a-target-grid{grid-template-columns:1fr} }
        .a-target-card { background:var(--graphite); border:1px solid var(--border); border-radius:12px; padding:20px; }
        .a-target-icon { width:32px; height:32px; border-radius:8px; background:var(--vital-dim); border:1px solid rgba(74,124,89,.2); display:flex; align-items:center; justify-content:center; margin-bottom:12px; }
        .a-target-title { font-family:'Barlow Condensed',sans-serif; font-size:1rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--bone); margin-bottom:6px; }
        .a-target-body  { font-size:.8rem; color:var(--ghost); line-height:1.6; }

        /* CTA */
        .a-cta { border-top:1px solid var(--border); padding:80px 24px; text-align:center; background:var(--void); }
        .a-cta-h2  { font-family:'Barlow Condensed',sans-serif; font-size:clamp(2.5rem,5vw,4rem); font-weight:800; letter-spacing:.04em; text-transform:uppercase; color:var(--bone); line-height:.92; margin-bottom:20px; }
        .a-cta-h2 span { color:var(--vital); }
        .a-cta-sub { font-size:.95rem; color:var(--ash); max-width:360px; margin:0 auto 36px; line-height:1.65; }
        .a-cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .a-cta-btn  { display:inline-flex; align-items:center; gap:8px; background:var(--vital); color:#040f08; font-family:'Barlow Condensed',sans-serif; font-size:.9rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:14px 28px; border-radius:8px; text-decoration:none; transition:background .2s; }
        .a-cta-btn:hover { background:var(--vital-bright); }
        .a-cta-ghost { display:inline-flex; align-items:center; gap:8px; background:transparent; color:var(--ash); font-family:'Barlow Condensed',sans-serif; font-size:.88rem; font-weight:500; letter-spacing:.1em; text-transform:uppercase; padding:13px 22px; border-radius:8px; border:1px solid var(--border); text-decoration:none; transition:all .2s; }
        .a-cta-ghost:hover { border-color:var(--muted); color:var(--bone); }
      `}</style>

      <div className="a-wrap">

        {/* HERO */}
        <div className="a-hero">
          <div className="a-hero-label">
            <div className="a-hero-line" />
            <span className="a-hero-lbl">About VYTALL</span>
          </div>
          <h1 className="a-hero-h1">
            Not a fitness app.<br />
            <span>A vitality OS.</span>
          </h1>
          <p className="a-hero-sub">
            VYTALL is a memory-driven AI system built to study you as an athlete over time — not hand you a template and forget you existed by Tuesday.
          </p>
          <Link href="/signup" className="a-hero-cta">
            Start Training <ArrowRight size={15} />
          </Link>
        </div>

        {/* PRINCIPLES */}
        <section className="a-section" style={{ background: "var(--obsidian)" }}>
          <div className="a-section-inner">
            <div className="a-slabel"><div className="a-sline" /><span className="a-slbl">Philosophy</span></div>
            <h2 className="a-sh2">Why <span>VYTALL</span> Exists</h2>
            <div className="a-principles">
              {PRINCIPLES.map((p) => (
                <div className="a-principle" key={p.title}>
                  <div className="a-p-icon"><p.icon size={16} color="var(--vital)" /></div>
                  <div className="a-p-title">{p.title}</div>
                  <div className="a-p-body">{p.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SYSTEMS */}
        <section className="a-section">
          <div className="a-section-inner">
            <div className="a-slabel"><div className="a-sline" /><span className="a-slbl">Core Systems</span></div>
            <h2 className="a-sh2">The Four <span>Systems</span></h2>
            <div className="a-systems">
              {SYSTEMS.map((s) => (
                <div className="a-system" key={s.name}>
                  <div className="a-sys-icon"><s.icon size={18} color="var(--vital)" /></div>
                  <div>
                    <div className="a-sys-num">{s.tag} · System</div>
                    <div className="a-sys-name">{s.name}</div>
                    <div className="a-sys-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VOICE */}
        <section className="a-section a-voice">
          <div className="a-section-inner">
            <div className="a-slabel"><div className="a-sline" /><span className="a-slbl">The VYTALL Voice</span></div>
            <h2 className="a-sh2" style={{ marginBottom: "28px" }}>Observant.<br /><span>Precise. Honest.</span></h2>
            <p style={{ fontSize: ".9rem", color: "var(--ash)", lineHeight: 1.65, maxWidth: "480px", marginBottom: "32px" }}>
              VYTALL does not motivate. It observes and prescribes. The system is never cheesy, never generic. It says exactly what the data suggests, in the most useful way possible.
            </p>
            <div className="a-voice-quotes">
              {VOICE_EXAMPLES.map((q, i) => (
                <div className="a-voice-q" key={i}>
                  <div className="a-voice-mark">"</div>
                  <div className="a-voice-txt">{q}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="a-section a-target" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="a-section-inner">
            <div className="a-slabel"><div className="a-sline" /><span className="a-slbl">Who It's For</span></div>
            <h2 className="a-sh2" style={{ marginBottom: "32px" }}>Built for <span>Serious Athletes</span></h2>
            <div className="a-target-grid">
              {[
                { icon: Target, title: "Goal-Driven", body: "You have a specific outcome in mind. VYTALL builds everything around it." },
                { icon: Brain,  title: "Pattern-Aware", body: "You know your body changes day to day. VYTALL adapts with it." },
                { icon: Ghost,  title: "Self-Competitive", body: "Your only real competition is your past self. VYTALL measures that precisely." },
              ].map((c) => (
                <div className="a-target-card" key={c.title}>
                  <div className="a-target-icon"><c.icon size={15} color="var(--vital)" /></div>
                  <div className="a-target-title">{c.title}</div>
                  <div className="a-target-body">{c.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="a-cta">
          <h2 className="a-cta-h2">Ready to <span>begin?</span></h2>
          <p className="a-cta-sub">The system needs data to build your Ghost. Start today.</p>
          <div className="a-cta-btns">
            <Link href="/signup" className="a-cta-btn">
              Start Free <ArrowRight size={14} />
            </Link>
            <Link href="/pricing" className="a-cta-ghost">View Plans</Link>
          </div>
        </div>

      </div>
    </>
  );
}
