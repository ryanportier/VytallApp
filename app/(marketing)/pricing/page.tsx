import Link from "next/link";
import { Check, Ghost, Crown, BookOpen, Flame, Wallet } from "lucide-react";

const FREE_FEATURES = [
  "Onboarding & athlete profile",
  "Daily check-in",
  "Basic AI mission generation",
  "Archive — last 7 days",
  "Limited Ghost summary",
  "3 workouts saved",
];

const PREMIUM_FEATURES = [
  "Everything in Free",
  "Full AI mission history",
  "Complete Archive access",
  "Full Ghost engine",
  "Weekly adaptive plan",
  "Unlimited AI reflections",
  "More workouts saved",
];

const ONEOFFS = [
  { icon: Ghost,    label: "Deep Ghost Report",    price: "0.50", desc: "Advanced multi-dimensional Ghost breakdown." },
  { icon: Crown,    label: "Elite Plan Refresh",   price: "1.00", desc: "Personalized 4-week elite training plan." },
  { icon: BookOpen, label: "Advanced Archive",     price: "0.25", desc: "Deep narrative archive for your training era." },
  { icon: Flame,    label: "Premium Challenge",    price: "0.50", desc: "High-intensity challenge for your Ghost gap." },
];

export default function PricingPage() {
  return (
    <>
      <style>{`
        .pr { max-width:900px; margin:0 auto; padding:80px 24px; }
        .pr-eyebrow { font-family:'JetBrains Mono',monospace; font-size:.55rem; letter-spacing:.18em; text-transform:uppercase; color:var(--ghost); text-align:center; margin-bottom:16px; display:flex; align-items:center; justify-content:center; gap:12px; }
        .pr-eyebrow::before,.pr-eyebrow::after { content:''; flex:1; max-width:60px; height:1px; background:var(--border); }
        .pr-title { font-family:'Barlow Condensed',sans-serif; font-size:clamp(2.8rem,6vw,4.5rem); font-weight:800; letter-spacing:.04em; text-transform:uppercase; color:var(--bone); text-align:center; line-height:1; margin-bottom:16px; }
        .pr-sub { font-size:1rem; color:var(--ghost); text-align:center; margin-bottom:64px; line-height:1.6; }

        /* Tier grid */
        .pr-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:64px; }
        @media(max-width:640px){ .pr-grid { grid-template-columns:1fr; } }

        .pr-tier { background:var(--graphite); border:1px solid var(--border); border-radius:20px; padding:32px; position:relative; }
        .pr-tier-hot { border:2px solid var(--vital); }
        .pr-badge { position:absolute; top:20px; right:20px; background:var(--vital); color:#f5f2ee; font-family:'JetBrains Mono',monospace; font-size:.48rem; letter-spacing:.12em; text-transform:uppercase; padding:4px 10px; border-radius:4px; }
        .pr-tier-label { font-family:'JetBrains Mono',monospace; font-size:.52rem; letter-spacing:.14em; text-transform:uppercase; color:var(--ghost); margin-bottom:14px; display:flex; align-items:center; gap:7px; }
        .pr-price { font-family:'Barlow Condensed',sans-serif; font-size:3.5rem; font-weight:800; color:var(--bone); line-height:1; }
        .pr-period { font-family:'JetBrains Mono',monospace; font-size:.55rem; color:var(--ghost); text-transform:uppercase; letter-spacing:.1em; margin-bottom:24px; margin-top:4px; }
        .pr-divider { height:1px; background:var(--border); margin-bottom:20px; }
        .pr-features { display:flex; flex-direction:column; gap:10px; margin-bottom:28px; }
        .pr-feat { display:flex; align-items:center; gap:9px; font-size:.88rem; color:var(--ash); }

        .pr-btn { display:flex; align-items:center; justify-content:center; gap:8px; background:var(--vital); color:#f5f2ee; font-family:'Barlow Condensed',sans-serif; font-size:.9rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:14px; border-radius:10px; text-decoration:none; transition:background .2s; }
        .pr-btn:hover { background:var(--vital-bright); }
        .pr-btn-ghost { background:transparent; color:var(--ash); border:1px solid var(--border); }
        .pr-btn-ghost:hover { border-color:var(--muted); color:var(--bone); background:transparent; }

        /* One-off */
        .pr-oneoff-title { font-family:'Barlow Condensed',sans-serif; font-size:1.6rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; color:var(--bone); margin-bottom:6px; }
        .pr-oneoff-sub { font-size:.85rem; color:var(--ghost); margin-bottom:24px; }
        .pr-oneoff-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:12px; }
        .pr-oneoff-card { background:var(--graphite); border:1px solid var(--border); border-radius:14px; padding:20px; transition:border-color .2s,transform .2s; }
        .pr-oneoff-card:hover { border-color:var(--muted); transform:translateY(-2px); }
        .pr-oneoff-icon { width:32px; height:32px; border-radius:8px; background:var(--vital-dim); border:1px solid rgba(58,102,71,.2); display:flex; align-items:center; justify-content:center; margin-bottom:10px; }
        .pr-oneoff-name { font-family:'Barlow Condensed',sans-serif; font-size:.92rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--bone); margin-bottom:4px; }
        .pr-oneoff-desc { font-size:.78rem; color:var(--ghost); line-height:1.5; margin-bottom:12px; }
        .pr-oneoff-price { font-family:'JetBrains Mono',monospace; font-size:.75rem; color:var(--vital); }

        /* USDC badge */
        .pr-usdc { display:inline-flex; align-items:center; gap:6px; background:var(--vital-dim); border:1px solid rgba(58,102,71,.3); border-radius:100px; padding:5px 12px; font-family:'JetBrains Mono',monospace; font-size:.52rem; letter-spacing:.12em; text-transform:uppercase; color:var(--vital); margin-bottom:20px; }

        /* CTA bottom */
        .pr-cta { text-align:center; padding:64px 0 0; }
        .pr-cta-title { font-family:'Barlow Condensed',sans-serif; font-size:2rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; color:var(--bone); margin-bottom:12px; }
        .pr-cta-sub { font-size:.88rem; color:var(--ghost); margin-bottom:24px; }
      `}</style>

      <div className="pr">
        {/* Header */}
        <div className="pr-eyebrow">Pricing</div>
        <h1 className="pr-title">Simple.<br /><span style={{ color:"var(--vital)" }}>Precise.</span></h1>
        <p className="pr-sub">Start free. Upgrade when ready. Pay per use for premium features.</p>

        {/* Tier cards */}
        <div className="pr-grid">
          {/* Free */}
          <div className="pr-tier">
            <div className="pr-tier-label">Free Tier</div>
            <div className="pr-price">$0</div>
            <div className="pr-period">Forever</div>
            <div className="pr-divider" />
            <div className="pr-features">
              {FREE_FEATURES.map(f => (
                <div className="pr-feat" key={f}>
                  <Check size={13} color="var(--vital)" style={{ flexShrink:0 }} />
                  {f}
                </div>
              ))}
            </div>
            <Link href="/signup" className="pr-btn pr-btn-ghost">Get Started Free</Link>
          </div>

          {/* Premium */}
          <div className="pr-tier pr-tier-hot">
            <div className="pr-badge">Recommended</div>
            <div className="pr-tier-label" style={{ color:"var(--vital)" }}>
              <Crown size={11} color="var(--vital)" />
              Premium
            </div>
            <div className="pr-price">12 <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".9rem", fontWeight:400, color:"var(--vital)" }}>USDC</span></div>
            <div className="pr-period">/ month · paid in USDC</div>
            <div className="pr-divider" />
            <div className="pr-features">
              {PREMIUM_FEATURES.map(f => (
                <div className="pr-feat" key={f}>
                  <Check size={13} color="var(--vital)" style={{ flexShrink:0 }} />
                  {f}
                </div>
              ))}
            </div>
            <Link href="/signup" className="pr-btn">
              <Wallet size={14} />
              Start Premium
            </Link>
          </div>
        </div>

        {/* Pay-per-use */}
        <div className="pr-usdc">
          <Wallet size={11} />
          Pay-Per-Use · USDC · Base Network
        </div>
        <div className="pr-oneoff-title">One-off Features</div>
        <p className="pr-oneoff-sub">No subscription needed. Pay only for what you use.</p>
        <div className="pr-oneoff-grid">
          {ONEOFFS.map(f => (
            <div className="pr-oneoff-card" key={f.label}>
              <div className="pr-oneoff-icon"><f.icon size={14} color="var(--vital)" /></div>
              <div className="pr-oneoff-name">{f.label}</div>
              <div className="pr-oneoff-desc">{f.desc}</div>
              <div className="pr-oneoff-price">{f.price} USDC</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="pr-cta">
          <div className="pr-cta-title">Ready to train your full self?</div>
          <p className="pr-cta-sub">Start free. No credit card. No commitment.</p>
          <Link href="/signup" className="pr-btn" style={{ display:"inline-flex", padding:"14px 32px" }}>
            Begin →
          </Link>
        </div>
      </div>
    </>
  );
}
