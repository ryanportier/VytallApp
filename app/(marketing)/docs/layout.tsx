import Link from "next/link";
import { type ReactNode } from "react";

const NAV = [
  {
    group: "Start Here",
    items: [
      { href:"/docs",           label:"What is VYTALL?" },
      { href:"/docs/checkin",   label:"Daily Check-In" },
      { href:"/docs/mission",   label:"Your Daily Mission" },
    ],
  },
  {
    group: "Your Progress",
    items: [
      { href:"/docs/workouts",  label:"Logging Workouts" },
      { href:"/docs/archive",   label:"Your Archive" },
      { href:"/docs/ghost",     label:"The Ghost" },
    ],
  },
  {
    group: "Your Account",
    items: [
      { href:"/docs/profile",   label:"Your Profile" },
      { href:"/docs/payments",  label:"Plans & Payments" },
    ],
  },
];

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        .docs-shell { display:flex; min-height:100dvh; background:var(--void); }
        .docs-sidebar { width:250px; flex-shrink:0; background:var(--graphite); border-right:1px solid var(--border); position:sticky; top:0; height:100dvh; overflow-y:auto; padding:0 0 40px; }
        @media(max-width:768px){ .docs-sidebar{display:none} }
        .docs-logo { padding:22px 20px 18px; border-bottom:1px solid var(--border); text-decoration:none; display:block; }
        .docs-logo-name { font-family:'Barlow Condensed',sans-serif; font-size:1rem; font-weight:800; letter-spacing:.2em; text-transform:uppercase; color:var(--bone); }
        .docs-logo-sub  { font-family:'JetBrains Mono',monospace; font-size:.46rem; letter-spacing:.1em; text-transform:uppercase; color:var(--ghost); margin-top:3px; }
        .docs-nav { padding:16px 10px; }
        .docs-group { margin-bottom:22px; }
        .docs-group-label { font-family:'JetBrains Mono',monospace; font-size:.46rem; letter-spacing:.14em; text-transform:uppercase; color:var(--ghost); padding:6px 12px; margin-bottom:2px; }
        .docs-link { display:block; font-size:.88rem; color:var(--ash); text-decoration:none; padding:7px 12px; border-radius:7px; transition:all .15s; font-family:'Barlow',sans-serif; }
        .docs-link:hover { background:var(--slate); color:var(--bone); }

        .docs-main { flex:1; min-width:0; }
        .docs-content { max-width:720px; margin:0 auto; padding:56px 40px 80px; }
        @media(max-width:768px){ .docs-content{padding:32px 20px 60px} }

        .docs-content h1 { font-family:'Barlow Condensed',sans-serif; font-size:2.2rem; font-weight:800; letter-spacing:.04em; text-transform:uppercase; color:var(--bone); margin-bottom:8px; line-height:1; }
        .docs-content .doc-lead { font-size:1rem; color:var(--ghost); margin-bottom:32px; line-height:1.7; border-bottom:1px solid var(--border); padding-bottom:24px; }
        .docs-content h2 { font-family:'Barlow Condensed',sans-serif; font-size:1.3rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--bone); margin:36px 0 12px; }
        .docs-content h3 { font-family:'Barlow Condensed',sans-serif; font-size:1rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--ash); margin:24px 0 8px; }
        .docs-content p { font-size:.9rem; color:var(--ash); line-height:1.75; margin-bottom:14px; }
        .docs-content ul,.docs-content ol { padding-left:20px; margin-bottom:14px; }
        .docs-content li { font-size:.9rem; color:var(--ash); line-height:1.75; margin-bottom:6px; }
        .docs-content strong { color:var(--bone); font-weight:600; }
        .docs-content a { color:var(--vital); text-decoration:none; }
        .docs-content a:hover { text-decoration:underline; }

        .doc-callout { background:var(--vital-dim); border:1px solid rgba(58,102,71,.25); border-left:3px solid var(--vital); border-radius:0 10px 10px 0; padding:14px 18px; margin:20px 0; }
        .doc-callout p { color:var(--ash); margin:0; font-size:.88rem; }

        .doc-breadcrumb { font-family:'JetBrains Mono',monospace; font-size:.5rem; letter-spacing:.1em; text-transform:uppercase; color:var(--ghost); margin-bottom:14px; display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
        .doc-breadcrumb a { color:var(--ghost); text-decoration:none; }
        .doc-breadcrumb a:hover { color:var(--vital); }

        .doc-mode { display:flex; align-items:center; gap:12px; background:var(--graphite); border:1px solid var(--border); border-radius:10px; padding:12px 16px; margin-bottom:8px; }
      `}</style>

      <div className="docs-shell">
        <aside className="docs-sidebar">
          <Link href="/docs" className="docs-logo">
            <div className="docs-logo-name">VYTALL</div>
            <div className="docs-logo-sub">Your AI Coach</div>
          </Link>
          <nav className="docs-nav">
            {NAV.map(group => (
              <div className="docs-group" key={group.group}>
                <div className="docs-group-label">{group.group}</div>
                {group.items.map(item => (
                  <Link key={item.href} href={item.href} className="docs-link">
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <main className="docs-main">
          <div className="docs-content">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
