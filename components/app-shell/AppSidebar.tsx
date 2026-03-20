"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Dumbbell,
  BookOpen,
  Ghost,
  Zap,
  User,
  LogOut,
} from "lucide-react";

const NAV = [
  { href: "/app",          icon: LayoutDashboard, label: "Dashboard" },
  { href: "/app/check-in", icon: CheckSquare,     label: "Check-In" },
  { href: "/app/mission",  icon: Target,          label: "Mission" },
  { href: "/app/workouts", icon: Dumbbell,        label: "Workouts" },
  { href: "/app/archive",  icon: BookOpen,        label: "Archive" },
  { href: "/app/ghost",    icon: Ghost,           label: "Ghost" },
];

interface Props { profileName: string; profileInitial: string; }

export default function AppSidebar({ profileName, profileInitial }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <style>{`
        .sb {
          position:fixed; top:0; left:0; bottom:0; width:240px; z-index:40;
          background:var(--obsidian); border-right:1px solid var(--border);
          display:flex; flex-direction:column;
        }
        .sb-logo { padding:22px 22px 18px; border-bottom:1px solid var(--border); text-decoration:none; display:block; }
        .sb-logo-text { font-family:'Barlow Condensed',sans-serif; font-size:1.1rem; font-weight:800; letter-spacing:.22em; text-transform:uppercase; color:var(--bone); }
        .sb-logo-sub  { font-family:'JetBrains Mono',monospace; font-size:.46rem; letter-spacing:.12em; text-transform:uppercase; color:var(--ghost); margin-top:3px; }

        .sb-nav { flex:1; padding:14px 10px; display:flex; flex-direction:column; gap:2px; overflow-y:auto; }

        .sb-item {
          display:flex; align-items:center; gap:11px;
          padding:9px 13px; border-radius:9px;
          text-decoration:none; transition:all .18s;
          position:relative;
        }
        .sb-item-label { font-family:'Barlow Condensed',sans-serif; font-size:.85rem; font-weight:600; letter-spacing:.08em; text-transform:uppercase; transition:color .18s; }
        .sb-item-bar   { position:absolute; left:0; top:25%; bottom:25%; width:2px; border-radius:1px; background:var(--vital); }

        .sb-item:not(.active) { }
        .sb-item:not(.active):hover { background:var(--graphite); }
        .sb-item:not(.active) svg,
        .sb-item:not(.active) .sb-item-label { color:var(--ghost) !important; }
        .sb-item:not(.active):hover svg,
        .sb-item:not(.active):hover .sb-item-label { color:var(--ash) !important; }

        .sb-item.active { background:var(--vital-dim); }
        .sb-item.active svg,
        .sb-item.active .sb-item-label { color:var(--vital) !important; }

        .sb-div { height:1px; background:var(--border); margin:6px 10px; }

        .sb-bottom { padding:10px; border-top:1px solid var(--border); }
        .sb-profile { display:flex; align-items:center; gap:10px; padding:9px 11px; border-radius:9px; text-decoration:none; transition:background .18s; }
        .sb-profile:hover { background:var(--graphite); }
        .sb-avatar { width:30px; height:30px; border-radius:50%; background:var(--vital-dim); border:1px solid rgba(58,102,71,.3); display:flex; align-items:center; justify-content:center; font-family:'Barlow Condensed',sans-serif; font-size:.85rem; font-weight:700; color:var(--vital); flex-shrink:0; }
        .sb-profile-name { font-family:'Barlow Condensed',sans-serif; font-size:.82rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--ash); flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

        .sb-logout { width:100%; margin-top:4px; background:transparent; border:none; cursor:pointer; display:flex; align-items:center; gap:9px; font-family:'JetBrains Mono',monospace; font-size:.52rem; letter-spacing:.1em; text-transform:uppercase; color:var(--ghost); padding:8px 11px; border-radius:7px; transition:color .18s,background .18s; }
        .sb-logout:hover { color:var(--signal); background:rgba(184,50,40,.06); }
        .sb-logout svg { transition:color .18s; }
      `}</style>

      <aside className="sb">
        <Link href="/app" className="sb-logo">
          <div className="sb-logo-text">VYTALL</div>
          <div className="sb-logo-sub">Vitality OS</div>
        </Link>

        <nav className="sb-nav">
          {NAV.map((item) => {
            const active = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`sb-item${active ? " active" : ""}`}>
                {active && <div className="sb-item-bar" />}
                <item.icon size={15} />
                <span className="sb-item-label">{item.label}</span>
              </Link>
            );
          })}

          <div className="sb-div" />

          <Link href="/app/payments" className={`sb-item${pathname.startsWith("/app/payments") ? " active" : ""}`}>
            {pathname.startsWith("/app/payments") && <div className="sb-item-bar" />}
            <Zap size={15} />
            <span className="sb-item-label">Upgrade</span>
          </Link>
        </nav>

        <div className="sb-bottom">
          <Link href="/app/profile" className="sb-profile">
            <div className="sb-avatar">{profileInitial}</div>
            <div className="sb-profile-name">{profileName || "Profile"}</div>
            <User size={13} color="var(--ghost)" />
          </Link>
          <button className="sb-logout" onClick={handleLogout}>
            <LogOut size={13} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
