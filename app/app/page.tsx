import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeDate, getReadinessLabel } from "@/lib/utils/format";
import type { DailyCheckin, Workout } from "@/types";

export default async function AppDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single();
  if (!profile) redirect("/app/onboarding");

  const today = new Date(); today.setHours(0,0,0,0);

  const { data: todayCheckin } = await supabase
    .from("daily_checkins").select("*").eq("user_id", user.id)
    .gte("created_at", today.toISOString())
    .order("created_at", { ascending: false }).limit(1).single() as { data: DailyCheckin | null };

  const { data: recentWorkouts } = await supabase
    .from("workouts").select("*").eq("user_id", user.id)
    .order("created_at", { ascending: false }).limit(5) as { data: Workout[] | null };

  const { data: allCheckins } = await supabase
    .from("daily_checkins").select("created_at").eq("user_id", user.id)
    .order("created_at", { ascending: false }).limit(30);

  let streak = 0;
  if (allCheckins?.length) {
    const dates = [...new Set(allCheckins.map(c => { const d = new Date(c.created_at); d.setHours(0,0,0,0); return d.getTime(); }))].sort((a,b)=>b-a);
    let expected = today.getTime();
    for (const d of dates) {
      if (d === expected || d === expected - 86400000) { streak++; expected = d - 86400000; } else break;
    }
  }

  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay()); weekStart.setHours(0,0,0,0);
  const weekWorkouts = recentWorkouts?.filter(w => new Date(w.created_at) >= weekStart && w.completion_status === "completed").length ?? 0;

  const readiness = todayCheckin?.readiness_score ?? 0;
  const modeColors: Record<string, string> = {
    PUSH: "#1a1714", FORGE: "#3a6647", MAINTAIN: "#4a4640", RESTORE: "#888078", RECOVER: "#b83228",
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes breathe  { 0%,100%{opacity:.8;transform:scale(1)} 50%{opacity:1;transform:scale(1.03)} }
        @keyframes countUp  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

        /* ── DESKTOP layout ── */
        .dash { padding:32px; display:flex; flex-direction:column; gap:24px; }

        /* ── MOBILE override — feels like native app ── */
        @media(max-width:767px) {
          .dash {
            padding: 0;
            gap: 0;
            padding-bottom: 80px; /* space for bottom nav */
          }

          /* Mobile top header */
          .dash-mob-header {
            padding: 20px 20px 16px;
            background: var(--void);
            position: sticky; top: 0; z-index: 20;
            backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border);
          }

          /* Mobile sections get padding */
          .dash-section { padding: 20px 16px 0; }
          .dash-section-last { padding: 16px 16px 0; }
        }
        @media(min-width:768px) {
          .dash-mob-header { display: none; }
          .dash-section { display: contents; }
          .dash-section-last { display: contents; }
        }

        /* Greeting */
        .dash-greeting { animation: fadeUp .5s ease-out both; }
        .dash-greeting-time { font-family:'JetBrains Mono',monospace; font-size:.52rem; letter-spacing:.14em; text-transform:uppercase; color:var(--ghost); margin-bottom:4px; }
        .dash-greeting-name { font-family:'Barlow Condensed',sans-serif; font-size:1.9rem; font-weight:800; letter-spacing:.03em; text-transform:uppercase; color:var(--bone); line-height:1; }
        .dash-greeting-sub  { font-size:.8rem; color:var(--ghost); margin-top:3px; }

        /* Status card */
        .dash-hero { background:var(--graphite); border:1px solid var(--border); border-radius:20px; overflow:hidden; animation:fadeUp .5s ease-out .06s both; }
        @media(max-width:767px){
          .dash-hero { border-radius:18px; margin:0 0 1px; }
        }
        .dash-hero-inner { padding:24px; }
        @media(max-width:480px){ .dash-hero-inner { padding:18px; } }

        .dash-hero-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:18px; }
        .dash-mode-label { font-family:'JetBrains Mono',monospace; font-size:.5rem; letter-spacing:.14em; text-transform:uppercase; color:var(--ghost); margin-bottom:5px; }
        .dash-mode-val   { font-family:'Barlow Condensed',sans-serif; font-size:2.6rem; font-weight:800; letter-spacing:.08em; text-transform:uppercase; line-height:1; }

        .dash-ring { position:relative; width:76px; height:76px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .dash-ring-val { font-family:'Barlow Condensed',sans-serif; font-size:1.5rem; font-weight:800; line-height:1; text-align:center; }
        .dash-ring-lbl { font-family:'JetBrains Mono',monospace; font-size:.36rem; letter-spacing:.1em; text-transform:uppercase; color:var(--ghost); text-align:center; }

        .dash-summary-box  { background:var(--void); border-radius:12px; padding:12px 14px; }
        .dash-summary-lbl  { font-family:'JetBrains Mono',monospace; font-size:.48rem; letter-spacing:.12em; text-transform:uppercase; color:var(--vital); margin-bottom:5px; }
        .dash-summary-text { font-size:.85rem; color:var(--ash); line-height:1.5; font-style:italic; }

        .dash-cta-row { display:flex; gap:9px; margin-top:14px; }
        .dash-btn-main { flex:2; display:flex; align-items:center; justify-content:center; gap:7px; background:var(--vital); color:#f5f2ee; font-family:'Barlow Condensed',sans-serif; font-size:.85rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:12px; border-radius:10px; text-decoration:none; transition:background .2s; }
        .dash-btn-main:hover { background:var(--vital-bright); }
        .dash-btn-sec  { flex:1; display:flex; align-items:center; justify-content:center; background:transparent; color:var(--ash); font-family:'Barlow Condensed',sans-serif; font-size:.82rem; font-weight:600; letter-spacing:.08em; text-transform:uppercase; padding:11px; border-radius:10px; border:1px solid var(--border); text-decoration:none; transition:all .2s; }
        .dash-btn-sec:hover { border-color:var(--muted); color:var(--bone); }

        /* No checkin */
        .dash-nocheckin { background:var(--vital-dim); border:1px solid rgba(58,102,71,.22); border-radius:20px; padding:24px; text-decoration:none; display:block; position:relative; overflow:hidden; animation:fadeUp .5s ease-out .06s both; transition:border-color .2s; }
        @media(max-width:767px){ .dash-nocheckin { border-radius:18px; } }
        .dash-nocheckin:hover { border-color:rgba(58,102,71,.45); }
        .dash-nc-pulse-row { display:flex; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; font-size:.5rem; letter-spacing:.14em; text-transform:uppercase; color:var(--vital); margin-bottom:10px; }
        .dash-nc-dot   { width:6px; height:6px; border-radius:50%; background:var(--vital); animation:breathe 2s ease-in-out infinite; flex-shrink:0; }
        .dash-nc-title { font-family:'Barlow Condensed',sans-serif; font-size:1.5rem; font-weight:800; letter-spacing:.05em; text-transform:uppercase; color:var(--bone); margin-bottom:5px; }
        .dash-nc-body  { font-size:.83rem; color:var(--ash); line-height:1.5; margin-bottom:16px; }
        .dash-nc-cta   { display:flex; align-items:center; gap:8px; color:var(--vital); font-family:'Barlow Condensed',sans-serif; font-size:.88rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; }

        /* Stats */
        .dash-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; animation:fadeUp .5s ease-out .12s both; }
        .dash-stat   { background:var(--graphite); border:1px solid var(--border); border-radius:14px; padding:14px 10px; text-align:center; transition:border-color .2s,transform .2s; cursor:default; }
        .dash-stat:hover { border-color:var(--muted); transform:translateY(-1px); }
        .dash-stat-val { font-family:'Barlow Condensed',sans-serif; font-size:1.9rem; font-weight:800; line-height:1; margin-bottom:3px; animation:countUp .6s ease-out both; }
        .dash-stat-lbl { font-family:'JetBrains Mono',monospace; font-size:.44rem; letter-spacing:.12em; text-transform:uppercase; color:var(--ghost); }

        /* Section label */
        .dash-sec-lbl { font-family:'JetBrains Mono',monospace; font-size:.5rem; letter-spacing:.14em; text-transform:uppercase; color:var(--ghost); margin-bottom:10px; display:flex; align-items:center; gap:10px; }
        .dash-sec-line { flex:1; height:1px; background:var(--border); }

        /* Quick actions — MOBILE: horizontal scroll row */
        .dash-actions-scroll {
          display: none;
        }
        @media(max-width:767px){
          .dash-actions-scroll {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            padding: 4px 0 8px;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .dash-actions-scroll::-webkit-scrollbar { display:none; }
          .dash-actions-grid { display: none !important; }
        }

        /* Quick actions — DESKTOP: 2-col grid */
        .dash-actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          animation: fadeUp .5s ease-out .18s both;
        }

        .dash-action-card {
          background:var(--graphite); border:1px solid var(--border); border-radius:14px;
          padding:18px 16px; text-decoration:none; display:flex; flex-direction:column; gap:6px;
          transition:border-color .2s,transform .2s,box-shadow .2s; position:relative; overflow:hidden; min-width:0;
        }
        .dash-action-card:hover { border-color:var(--muted); transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,.05); }
        .dash-action-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--vital); opacity:0; transition:opacity .2s; }
        .dash-action-card:hover::before { opacity:1; }

        /* Mobile action chip — smaller, pill-shaped horizontal scroll */
        .dash-action-chip {
          background:var(--graphite); border:1px solid var(--border); border-radius:100px;
          padding:10px 18px; text-decoration:none; display:flex; align-items:center; gap:8px;
          white-space:nowrap; flex-shrink:0; transition:border-color .2s,background .2s;
        }
        .dash-action-chip:hover { border-color:var(--muted); background:var(--slate); }
        .dash-action-chip-icon  { font-size:1rem; flex-shrink:0; }
        .dash-action-chip-label { font-family:'Barlow Condensed',sans-serif; font-size:.85rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--bone); }

        .dash-action-icon  { font-size:1.1rem; }
        .dash-action-title { font-family:'Barlow Condensed',sans-serif; font-size:1rem; font-weight:700; letter-spacing:.07em; text-transform:uppercase; color:var(--bone); }
        .dash-action-sub   { font-family:'JetBrains Mono',monospace; font-size:.46rem; letter-spacing:.08em; text-transform:uppercase; color:var(--ghost); }
        .dash-action-arr   { position:absolute; bottom:14px; right:14px; color:var(--ghost); font-size:1rem; transition:transform .2s,color .2s; }
        .dash-action-card:hover .dash-action-arr { transform:translateX(3px); color:var(--vital); }

        /* Recent workouts */
        .dash-workouts { animation:fadeUp .5s ease-out .24s both; }
        .dash-w-item   { background:var(--graphite); border:1px solid var(--border); border-radius:12px; padding:13px 15px; display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; transition:border-color .2s; }
        .dash-w-item:last-child { margin-bottom:0; }
        .dash-w-item:hover { border-color:var(--muted); }
        .dash-w-title  { font-family:'Barlow Condensed',sans-serif; font-size:.92rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--bone); }
        .dash-w-meta   { font-family:'JetBrains Mono',monospace; font-size:.46rem; color:var(--ghost); letter-spacing:.08em; margin-top:2px; }
        .dash-w-badge  { font-family:'JetBrains Mono',monospace; font-size:.44rem; letter-spacing:.1em; text-transform:uppercase; padding:3px 7px; border-radius:4px; border:1px solid; white-space:nowrap; flex-shrink:0; }
      `}</style>

      <div className="dash">

        {/* ── MOBILE HEADER (sticky, only visible on mobile) ── */}
        <div className="dash-mob-header">
          <div className="dash-greeting">
            <div className="dash-greeting-time">{greeting}</div>
            <div className="dash-greeting-name">{profile.name}</div>
            {!todayCheckin && <div className="dash-greeting-sub">The system is waiting for today's data.</div>}
          </div>
        </div>

        {/* ── DESKTOP GREETING ── */}
        <div className="dash-section">
          <div className="dash-greeting" style={{ display: "none" }} id="desk-greeting">
            <div className="dash-greeting-time">
              {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
            </div>
            <div className="dash-greeting-name">{profile.name}.</div>
          </div>
          <style>{`@media(min-width:768px){#desk-greeting{display:block!important}}`}</style>

          {/* ── STATUS CARD ── */}
          {todayCheckin ? (
            <div className="dash-hero" style={{ marginTop: "16px" }}>
              <div className="dash-hero-inner">
                <div className="dash-hero-top">
                  <div>
                    <div className="dash-mode-label">Today's Mode</div>
                    <div className="dash-mode-val" style={{ color: modeColors[todayCheckin.mode] ?? "var(--bone)" }}>
                      {todayCheckin.mode}
                    </div>
                  </div>
                  <div className="dash-ring">
                    <svg width="76" height="76" style={{ position:"absolute", transform:"rotate(-90deg)" }}>
                      <circle cx="38" cy="38" r="32" fill="none" stroke="var(--border)" strokeWidth="2.5"/>
                      <circle cx="38" cy="38" r="32" fill="none"
                        stroke={readiness>=70?"#3a6647":readiness>=40?"#d4a017":"#b83228"}
                        strokeWidth="2.5"
                        strokeDasharray={2*Math.PI*32}
                        strokeDashoffset={2*Math.PI*32*(1-readiness/100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div>
                      <div className="dash-ring-val" style={{ color: readiness>=70?"#3a6647":readiness>=40?"#d4a017":"#b83228" }}>
                        {readiness}
                      </div>
                      <div className="dash-ring-lbl">{getReadinessLabel(readiness)}</div>
                    </div>
                  </div>
                </div>
                <div className="dash-summary-box">
                  <div className="dash-summary-lbl">Alchemy</div>
                  <div className="dash-summary-text">"{todayCheckin.ai_summary}"</div>
                </div>
                <div className="dash-cta-row">
                  <Link href="/app/mission" className="dash-btn-main">Mission →</Link>
                  <Link href="/app/workouts" className="dash-btn-sec">Log Workout</Link>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/app/check-in" className="dash-nocheckin" style={{ marginTop:"16px" }}>
              <div style={{ position:"absolute",top:"-24px",right:"-24px",width:"100px",height:"100px",borderRadius:"50%",background:"rgba(58,102,71,.08)",pointerEvents:"none" }}/>
              <div className="dash-nc-pulse-row">
                <div className="dash-nc-dot"/>
                Awaiting check-in
              </div>
              <div className="dash-nc-title">Start Daily Check-In</div>
              <div className="dash-nc-body">Log your state. Get your mission. Under 90 seconds.</div>
              <div className="dash-nc-cta">Begin →</div>
            </Link>
          )}
        </div>

        {/* ── STATS ── */}
        <div className="dash-section" style={{ paddingTop:"16px" }}>
          <div className="dash-stats">
            {[
              { label:"Streak",    val:`${streak}d`,                          color:streak>=3?"#3a6647":"var(--ash)", delay:".05s" },
              { label:"This Week", val:`${weekWorkouts}/${profile.days_per_week}`, color:"var(--bone)",             delay:".1s"  },
              { label:"Readiness", val:readiness>0?`${readiness}`:"—",        color:readiness>=70?"#3a6647":readiness>=40?"#d4a017":"var(--ash)", delay:".15s" },
            ].map(s => (
              <div className="dash-stat" key={s.label} style={{ animationDelay:s.delay }}>
                <div className="dash-stat-val" style={{ color:s.color }}>{s.val}</div>
                <div className="dash-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── QUICK ACTIONS — mobile: horizontal pill scroll ── */}
        <div className="dash-section" style={{ paddingTop:"20px" }}>
          <div className="dash-sec-lbl">Quick Actions <div className="dash-sec-line"/></div>

          {/* Mobile chips */}
          <div className="dash-actions-scroll">
            {[
              { href:"/app/ghost",    emoji:"◉", label:"Ghost" },
              { href:"/app/archive",  emoji:"◈", label:"Archive" },
              { href:"/app/workouts", emoji:"▲", label:"Workout" },
              { href:"/app/mission",  emoji:"◎", label:"Mission" },
              { href:"/app/check-in", emoji:"✦", label:"Check-In" },
              { href:"/app/payments", emoji:"◆", label:"Upgrade" },
            ].map(a => (
              <Link key={a.href} href={a.href} className="dash-action-chip">
                <span className="dash-action-chip-icon">{a.emoji}</span>
                <span className="dash-action-chip-label">{a.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop 2×2 grid */}
          <div className="dash-actions-grid">
            {[
              { href:"/app/ghost",    emoji:"◉", title:"Ghost",   sub:"Compare vs your peak" },
              { href:"/app/archive",  emoji:"◈", title:"Archive", sub:"Your training story" },
              { href:"/app/workouts", emoji:"▲", title:"Workout", sub:"Log a session" },
              { href:"/app/mission",  emoji:"◎", title:"Mission", sub:"Today's prescription" },
            ].map(a => (
              <Link key={a.href} href={a.href} className="dash-action-card">
                <div className="dash-action-icon">{a.emoji}</div>
                <div className="dash-action-title">{a.title}</div>
                <div className="dash-action-sub">{a.sub}</div>
                <div className="dash-action-arr">→</div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── RECENT WORKOUTS ── */}
        {recentWorkouts && recentWorkouts.length > 0 && (
          <div className="dash-section dash-section-last" style={{ paddingTop:"20px" }}>
            <div className="dash-workouts">
              <div className="dash-sec-lbl">Recent Sessions <div className="dash-sec-line"/></div>
              {recentWorkouts.slice(0,4).map(w => (
                <div className="dash-w-item" key={w.id}>
                  <div>
                    <div className="dash-w-title">{w.title}</div>
                    <div className="dash-w-meta">
                      {formatRelativeDate(w.created_at)}{w.duration_minutes>0?` · ${w.duration_minutes}m`:""}
                    </div>
                  </div>
                  <div className="dash-w-badge" style={{
                    color: w.completion_status==="completed"?"#3a6647":"var(--ghost)",
                    borderColor: w.completion_status==="completed"?"rgba(58,102,71,.35)":"var(--border)",
                  }}>
                    {w.completion_status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
