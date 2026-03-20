"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, BookOpen, Ghost, User } from "lucide-react";

const NAV = [
  { href: "/app",          icon: LayoutDashboard, label: "Home" },
  { href: "/app/check-in", icon: CheckSquare,     label: "Check-In" },
  { href: "/app/archive",  icon: BookOpen,        label: "Archive" },
  { href: "/app/ghost",    icon: Ghost,           label: "Ghost" },
  { href: "/app/profile",  icon: User,            label: "Profile" },
];

export default function AppMobileNav() {
  const pathname = usePathname();
  return (
    <>
      <style>{`
        .mob-nav {
          position:fixed; bottom:0; left:0; right:0; height:64px; z-index:40;
          background:rgba(245,242,238,.96); backdrop-filter:blur(16px);
          border-top:1px solid var(--border);
          display:flex; align-items:center; justify-content:space-around; padding:0 4px;
        }
        @media(min-width:768px){ .mob-nav{display:none} }
        .mob-item { display:flex; flex-direction:column; align-items:center; gap:4px; padding:8px 10px; text-decoration:none; flex:1; border-radius:8px; transition:all .15s; }
        .mob-label { font-family:'JetBrains Mono',monospace; font-size:.4rem; letter-spacing:.1em; text-transform:uppercase; transition:color .15s; }
        .mob-dot   { width:4px; height:2px; border-radius:1px; background:var(--vital); }
      `}</style>
      <nav className="mob-nav">
        {NAV.map((item) => {
          const active = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className="mob-item">
              <item.icon size={18} color={active ? "var(--vital)" : "var(--muted)"} strokeWidth={active ? 2 : 1.5} />
              <span className="mob-label" style={{ color: active ? "var(--vital)" : "var(--ghost)" }}>{item.label}</span>
              {active && <div className="mob-dot" />}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
