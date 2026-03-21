import Link from "next/link";
import { Zap, Brain, BookOpen, Ghost, ExternalLink } from "lucide-react";

// X (formerly Twitter) logo as SVG — the actual X mark, not the bird
function XLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-label="X (formerly Twitter)">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const NAV_COLS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/#modules" },
      { label: "Pricing", href: "/pricing" },
      { label: "About", href: "/about" },
    ],
  },
  {
    heading: "Systems",
    links: [
      { label: "Forge", href: "/#modules" },
      { label: "Alchemy", href: "/#modules" },
      { label: "Archive", href: "/#modules" },
      { label: "Ghost", href: "/#modules" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign Up", href: "/signup" },
      { label: "Log In", href: "/login" },
    ],
  },
];

const SYSTEM_ICONS = [
  { icon: Zap,      name: "FORGE" },
  { icon: Brain,    name: "ALCHEMY" },
  { icon: BookOpen, name: "ARCHIVE" },
  { icon: Ghost,    name: "GHOST" },
];

export default function MarketingFooter() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=JetBrains+Mono:wght@400&family=Barlow:wght@400&display=swap');

        .f-wrap {
          background: var(--obsidian, #101010);
          border-top: 1px solid var(--border, #282828);
          color: var(--bone, #e6e2da);
          font-family: 'Barlow', sans-serif;
        }

        /* System badges row */
        .f-systems {
          border-bottom: 1px solid var(--border, #282828);
          padding: 28px 40px;
          display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
        }
        @media(max-width:600px){ .f-systems{ padding:20px 24px } }
        .f-sys-badge {
          display: flex; align-items: center; gap: 6px;
          background: var(--graphite, #181818);
          border: 1px solid var(--border, #282828);
          border-radius: 6px; padding: 6px 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: .5rem; letter-spacing: .14em; text-transform: uppercase;
          color: var(--ghost, #777);
          transition: border-color .2s, color .2s;
        }
        .f-sys-badge:hover { border-color: var(--vital, #4a7c59); color: var(--ash, #aaa); }

        /* Main footer body */
        .f-body {
          padding: 48px 40px 40px;
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 40px;
        }
        @media(max-width:900px){ .f-body{ grid-template-columns:1fr 1fr; gap:32px } }
        @media(max-width:560px){ .f-body{ grid-template-columns:1fr; padding:32px 24px 28px } }

        /* Brand col */
        .f-brand-logo {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.2rem; font-weight: 800; letter-spacing: .22em;
          color: var(--bone, #e6e2da); text-decoration: none; text-transform: uppercase;
          display: block; margin-bottom: 12px;
        }
        .f-brand-tagline {
          font-family: 'JetBrains Mono', monospace;
          font-size: .55rem; letter-spacing: .1em; text-transform: uppercase;
          color: var(--ghost, #777); margin-bottom: 20px;
        }
        .f-brand-desc {
          font-size: .83rem; color: var(--ghost, #777);
          line-height: 1.6; max-width: 220px; margin-bottom: 24px;
        }

        /* Social */
        .f-socials { display: flex; gap: 8px; }
        .f-social-btn {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 8px;
          background: var(--graphite, #181818);
          border: 1px solid var(--border, #282828);
          color: var(--ghost, #777); text-decoration: none;
          transition: all .2s;
        }
        .f-social-btn:hover { border-color: var(--vital, #4a7c59); color: var(--bone, #e6e2da); background: #1e2b22; }

        /* Nav cols */
        .f-col-heading {
          font-family: 'JetBrains Mono', monospace;
          font-size: .52rem; letter-spacing: .14em; text-transform: uppercase;
          color: var(--ghost, #777); margin-bottom: 16px;
        }
        .f-col-links { display: flex; flex-direction: column; gap: 10px; }
        .f-col-link {
          font-size: .85rem; color: var(--ghost, #777);
          text-decoration: none; transition: color .15s;
        }
        .f-col-link:hover { color: var(--ash, #aaa); }

        /* Bottom bar */
        .f-bottom {
          border-top: 1px solid var(--border, #282828);
          padding: 20px 40px;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 12px;
        }
        @media(max-width:600px){ .f-bottom{ padding:16px 24px } }
        .f-bottom-copy {
          font-family: 'JetBrains Mono', monospace;
          font-size: .55rem; letter-spacing: .1em; text-transform: uppercase;
          color: var(--muted, #383838);
        }
        .f-bottom-right {
          display: flex; align-items: center; gap: 16px;
        }
        .f-bottom-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: .52rem; letter-spacing: .08em; text-transform: uppercase;
          color: var(--muted, #383838); text-decoration: none;
          transition: color .15s;
        }
        .f-bottom-link:hover { color: var(--ghost, #777); }
        .f-version {
          font-family: 'JetBrains Mono', monospace;
          font-size: .5rem; letter-spacing: .08em; text-transform: uppercase;
          color: var(--muted, #383838); opacity: .6;
        }
      `}</style>

      <footer className="f-wrap">

        {/* System badges */}
        <div className="f-systems">
          {SYSTEM_ICONS.map((s) => (
            <div className="f-sys-badge" key={s.name}>
              <s.icon size={10} color="var(--vital)" />
              {s.name}
            </div>
          ))}
        </div>

        {/* Main body */}
        <div className="f-body">

          {/* Brand col */}
          <div>
            <Link href="/" className="f-brand-logo">VYTALL</Link>
            <div className="f-brand-tagline">Train your full self.</div>
            <p className="f-brand-desc">
              A memory-driven AI vitality system. Built for athletes who train against their strongest past self.
            </p>
            <div className="f-socials">
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="f-social-btn"
                aria-label="VYTALL on X"
                title="Follow VYTALL on X"
              >
                <XLogo size={14} />
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="f-social-btn"
                aria-label="External link"
                title="More on X"
              >
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Nav cols */}
          {NAV_COLS.map((col) => (
            <div key={col.heading}>
              <div className="f-col-heading">{col.heading}</div>
              <div className="f-col-links">
                {col.links.map((l) => (
                  <Link key={l.href + l.label} href={l.href} className="f-col-link">{l.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="f-bottom">
          <div className="f-bottom-copy">
            © {new Date().getFullYear()} VYTALL. All rights reserved.
          </div>
          <div className="f-bottom-right">
            <Link href="/pricing" className="f-bottom-link">Privacy</Link>
            <Link href="/pricing" className="f-bottom-link">Terms</Link>
            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="f-bottom-link"
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <XLogo size={10} />
              
            </a>
            <span className="f-version">v0.1.0 — MVP</span>
          </div>
        </div>

      </footer>
    </>
  );
}
