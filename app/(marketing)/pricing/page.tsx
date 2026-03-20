import Link from "next/link";
import { Check, Zap, Brain, BookOpen, Ghost, Crown, Flame, BarChart3, RefreshCw, Lock, Unlock } from "lucide-react";

const FREE_FEATURES = [
  { icon: Check, text: "Onboarding & athlete profile" },
  { icon: Check, text: "Daily check-in" },
  { icon: Check, text: "Basic AI mission generation" },
  { icon: Check, text: "Archive — last 7 days" },
  { icon: Check, text: "Limited Ghost summary" },
  { icon: Check, text: "3 workouts saved" },
];

const PREMIUM_FEATURES = [
  { icon: Check, text: "Everything in Free" },
  { icon: Brain, text: "Full AI mission history" },
  { icon: BookOpen, text: "Complete Archive access" },
  { icon: Ghost, text: "Full Ghost engine" },
  { icon: BarChart3, text: "Weekly adaptive plan" },
  { icon: Zap, text: "Unlimited AI reflections" },
  { icon: RefreshCw, text: "More workouts saved" },
];

const X402_FEATURES = [
  {
    icon: Ghost,
    key: "Deep Ghost Report",
    price: "0.50",
    desc: "Advanced multi-dimensional Ghost breakdown with full historical analysis.",
  },
  {
    icon: Crown,
    key: "Elite Plan Refresh",
    price: "1.00",
    desc: "Personalized 4-week elite training plan calibrated to your Ghost.",
  },
  {
    icon: BookOpen,
    key: "Advanced Archive Entry",
    price: "0.25",
    desc: "Deep narrative archive generation for your full training era.",
  },
  {
    icon: Flame,
    key: "Premium Challenge Unlock",
    price: "0.50",
    desc: "High-intensity challenge calibrated specifically to your Ghost gap.",
  },
];

export default function PricingPage() {
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

        .p-wrap { background:var(--void); color:var(--bone); font-family:'Barlow',sans-serif; min-height:100dvh; padding-top:64px; }

        /* HERO */
        .p-hero { padding:80px 24px 64px; text-align:center; position:relative; overflow:hidden; border-bottom:1px solid var(--border); }
        .p-hero-glow { position:absolute; top:0; left:50%; transform:translateX(-50%); width:600px; height:300px; background:radial-gradient(ellipse,rgba(74,124,89,.07) 0%,transparent 70%); pointer-events:none; }
        .p-hero-label { display:flex; align-items:center; justify-content:center; gap:12px; margin-bottom:20px; }
        .p-hero-line  { width:20px; height:1px; background:var(--vital); }
        .p-hero-lbl   { font-family:'JetBrains Mono',monospace; font-size:.58rem; letter-spacing:.16em; color:var(--ghost); text-transform:uppercase; }
        .p-hero-h1    { font-family:'Barlow Condensed',sans-serif; font-size:clamp(3rem,6vw,5rem); font-weight:800; letter-spacing:.04em; text-transform:uppercase; color:var(--bone); line-height:.92; margin-bottom:20px; position:relative; z-index:1; }
        .p-hero-h1 span { color:var(--vital); }
        .p-hero-sub   { font-size:.95rem; color:var(--ash); max-width:380px; margin:0 auto; line-height:1.65; position:relative; z-index:1; }

        /* TIERS */
        .p-tiers { max-width:900px; margin:0 auto; padding:64px 24px; display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        @media(max-width:680px){ .p-tiers{grid-template-columns:1fr} }

        .p-tier { background:var(--graphite); border:1px solid var(--border); border-radius:18px; padding:32px; position:relative; transition:border-color .2s; }
        .p-tier:hover { border-color:var(--muted); }
        .p-tier-premium { border-color:var(--vital); }
        .p-tier-premium:hover { border-color:var(--vital-bright); }

        .p-tier-badge { position:absolute; top:16px; right:16px; background:var(--vital); color:#040f08; font-family:'JetBrains Mono',monospace; font-size:.5rem; letter-spacing:.12em; text-transform:uppercase; padding:4px 9px; border-radius:4px; }
        .p-tier-label { font-family:'JetBrains Mono',monospace; font-size:.55rem; letter-spacing:.14em; color:var(--ghost); text-transform:uppercase; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
        .p-tier-price { font-family:'Barlow Condensed',sans-serif; font-size:3.5rem; font-weight:800; color:var(--bone); line-height:1; margin-bottom:4px; }
        .p-tier-period { font-family:'JetBrains Mono',monospace; font-size:.58rem; color:var(--ghost); text-transform:uppercase; letter-spacing:.1em; margin-bottom:28px; }
        .p-tier-divider { height:1px; background:var(--border); margin-bottom:24px; }
        .p-tier-features { display:flex; flex-direction:column; gap:10px; margin-bottom:28px; }
        .p-tier-feat { display:flex; align-items:flex-start; gap:10px; font-size:.85rem; color:var(--ash); line-height:1.4; }
        .p-feat-icon { flex-shrink:0; margin-top:1px; }

        .p-btn-free { display:block; text-align:center; background:transparent; color:var(--ash); font-family:'Barlow Condensed',sans-serif; font-size:.85rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; padding:13px; border-radius:8px; border:1px solid var(--border); text-decoration:none; transition:all .2s; }
        .p-btn-free:hover { border-color:var(--muted); color:var(--bone); }
        .p-btn-premium { display:block; text-align:center; background:var(--vital); color:#040f08; font-family:'Barlow Condensed',sans-serif; font-size:.85rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:14px; border-radius:8px; text-decoration:none; transition:background .2s; }
        .p-btn-premium:hover { background:var(--vital-bright); }

        /* X402 */
        .p-x402 { max-width:900px; margin:0 auto; padding:0 24px 80px; }
        .p-x402-header { margin-bottom:28px; padding-bottom:24px; border-top:1px solid var(--border); padding-top:48px; }
        .p-x402-title { font-family:'Barlow Condensed',sans-serif; font-size:1.6rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--bone); margin-bottom:8px; display:flex; align-items:center; gap:10px; }
        .p-x402-sub { font-size:.85rem; color:var(--ghost); line-height:1.55; max-width:480px; }

        .p-x402-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:12px; }
        .p-x402-card { background:var(--graphite); border:1px solid var(--border); border-radius:14px; padding:20px; transition:border-color .2s,transform .2s; }
        .p-x402-card:hover { border-color:var(--muted); transform:translateY(-2px); }
        .p-x402-icon { width:32px; height:32px; border-radius:8px; background:var(--vital-dim); border:1px solid rgba(74,124,89,.2); display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
        .p-x402-name { font-family:'Barlow Condensed',sans-serif; font-size:1rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--bone); margin-bottom:6px; }
        .p-x402-desc { font-size:.78rem; color:var(--ghost); line-height:1.5; margin-bottom:14px; }
        .p-x402-footer { display:flex; justify-content:space-between; align-items:center; }
        .p-x402-price { font-family:'JetBrains Mono',monospace; font-size:.8rem; color:var(--vital); letter-spacing:.04em; }
        .p-x402-btn { font-family:'Barlow Condensed',sans-serif; font-size:.7rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--ghost); background:none; border:1px solid var(--border); padding:5px 10px; border-radius:5px; cursor:pointer; transition:all .2s; }
        .p-x402-btn:hover { border-color:var(--muted); color:var(--ash); }

        /* FAQ row */
        .p-faq { max-width:900px; margin:0 auto; padding:0 24px 80px; }
        .p-faq-label { font-family:'JetBrains Mono',monospace; font-size:.55rem; letter-spacing:.14em; color:var(--ghost); text-transform:uppercase; margin-bottom:24px; display:flex; align-items:center; gap:10px; }
        .p-faq-line { width:16px; height:1px; background:var(--vital); }
        .p-faq-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        @media(max-width:600px){ .p-faq-grid{grid-template-columns:1fr} }
        .p-faq-item { background:var(--graphite); border:1px solid var(--border); border-radius:12px; padding:20px; }
        .p-faq-q { font-family:'Barlow Condensed',sans-serif; font-size:.95rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--bone); margin-bottom:8px; }
        .p-faq-a { font-size:.82rem; color:var(--ghost); line-height:1.6; }
      `}</style>

      <div className="p-wrap">

        {/* HERO */}
        <div className="p-hero">
          <div className="p-hero-glow" />
          <div className="p-hero-label">
            <div className="p-hero-line" />
            <span className="p-hero-lbl">Pricing</span>
            <div className="p-hero-line" />
          </div>
          <h1 className="p-hero-h1">Simple.<br /><span>Precise.</span></h1>
          <p className="p-hero-sub">Start free. Upgrade when ready. Pay per use for premium one-off access via x402.</p>
        </div>

        {/* TIERS */}
        <div className="p-tiers">
          {/* Free */}
          <div className="p-tier">
            <div className="p-tier-label">
              <Unlock size={12} color="var(--ghost)" />
              Free Tier
            </div>
            <div className="p-tier-price">$0</div>
            <div className="p-tier-period">Forever</div>
            <div className="p-tier-divider" />
            <div className="p-tier-features">
              {FREE_FEATURES.map((f) => (
                <div className="p-tier-feat" key={f.text}>
                  <f.icon size={13} color="var(--vital)" className="p-feat-icon" />
                  {f.text}
                </div>
              ))}
            </div>
            <Link href="/signup" className="p-btn-free">Start Free</Link>
          </div>

          {/* Premium */}
          <div className="p-tier p-tier-premium">
            <div className="p-tier-badge">Recommended</div>
            <div className="p-tier-label">
              <Crown size={12} color="var(--vital)" />
              Premium
            </div>
            <div className="p-tier-price">$12</div>
            <div className="p-tier-period">/ month via Stripe</div>
            <div className="p-tier-divider" />
            <div className="p-tier-features">
              {PREMIUM_FEATURES.map((f) => (
                <div className="p-tier-feat" key={f.text}>
                  <f.icon size={13} color="var(--vital)" className="p-feat-icon" />
                  {f.text}
                </div>
              ))}
            </div>
            <Link href="/signup" className="p-btn-premium">Upgrade to Premium</Link>
          </div>
        </div>

        {/* X402 */}
        <div className="p-x402">
          <div className="p-x402-header">
            <div className="p-x402-title">
              <Zap size={18} color="var(--vital)" />
              Pay-Per-Use · x402 Protocol
            </div>
            <p className="p-x402-sub">
              One-off premium features paid in USDC via the x402 protocol. No subscription required. Access exactly what you need, when you need it.
            </p>
          </div>
          <div className="p-x402-grid">
            {X402_FEATURES.map((f) => (
              <div className="p-x402-card" key={f.key}>
                <div className="p-x402-icon">
                  <f.icon size={15} color="var(--vital)" />
                </div>
                <div className="p-x402-name">{f.key}</div>
                <div className="p-x402-desc">{f.desc}</div>
                <div className="p-x402-footer">
                  <span className="p-x402-price">${f.price} USDC</span>
                  <button className="p-x402-btn">
                    <Lock size={9} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                    Unlock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="p-faq">
          <div className="p-faq-label">
            <div className="p-faq-line" />
            Common Questions
          </div>
          <div className="p-faq-grid">
            {[
              { q: "Can I cancel anytime?", a: "Yes. Stripe subscriptions can be canceled at any time. Your access continues until the end of the billing period." },
              { q: "What is x402?", a: "x402 is a micropayment protocol for one-off premium features paid in USDC. No subscription needed — pay only for what you use." },
              { q: "Is my data private?", a: "Your training data is yours. VYTALL uses it only to build your personal model. It is never shared or sold." },
              { q: "What happens to my Ghost if I downgrade?", a: "Your Ghost data is preserved. You'll retain a limited view on the free tier. Full Ghost access resumes when you upgrade." },
            ].map((item) => (
              <div className="p-faq-item" key={item.q}>
                <div className="p-faq-q">{item.q}</div>
                <div className="p-faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
