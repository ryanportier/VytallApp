import Link from "next/link";

export default function LandingPage() {
  const modules = [
    { tag: "01", name: "FORGE",   desc: "Studies your training patterns over time. Builds a complete model of your identity as an athlete." },
    { tag: "02", name: "ALCHEMY", desc: "Interprets your current state daily. Decides the right mode, mission, and intensity for today." },
    { tag: "03", name: "ARCHIVE", desc: "Turns your progress into a living narrative — chapters, eras, setbacks, recoveries, breakthroughs." },
    { tag: "04", name: "GHOST",   desc: "Maintains a model of your strongest past self. Compares who you are now against who you were at peak." },
  ];
  const steps = [
    { n: "01", title: "Check In Daily",       body: "Log energy, sleep, fatigue, mood. Under 90 seconds." },
    { n: "02", title: "Receive Your Mission", body: "VYTALL interprets your state and returns a precise prescription." },
    { n: "03", title: "Train and Log",        body: "Execute. Log exercises, reps, effort. The system watches." },
    { n: "04", title: "Face Your Ghost",      body: "Your peak self is waiting. Every session closes the gap." },
  ];
  const quotes = [
    "Today does not require more intensity. It requires more control.",
    "Your Ghost still moves with better consistency.",
    "You are not underperforming. You are under-recovering.",
    "This week is not broken. It is unstable. Stabilize it.",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500&family=JetBrains+Mono:wght@400&display=swap');

        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes breathe  { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:.9;transform:scale(1.06)} }
        @keyframes breathe2 { 0%,100%{opacity:.3;transform:scale(1)} 50%{opacity:.6;transform:scale(1.04)} }
        @keyframes rotate   { from{transform:rotate(0deg)}  to{transform:rotate(360deg)} }
        @keyframes rotRev   { from{transform:rotate(0deg)}  to{transform:rotate(-360deg)} }
        @keyframes scanline { 0%{transform:translateY(-100%);opacity:0} 10%{opacity:.5} 90%{opacity:.5} 100%{transform:translateY(800px);opacity:0} }
        @keyframes ticker   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes barGrow  { from{width:0} to{width:var(--w)} }

        .v { background:#f5f2ee; color:#1a1714; font-family:'Barlow',sans-serif; overflow-x:hidden; }
        .afu{animation:fadeUp .7s ease-out both} .d1{animation-delay:.1s} .d2{animation-delay:.22s} .d3{animation-delay:.34s} .d4{animation-delay:.46s}

        /* HERO */
        .v-hero { min-height:100dvh; display:grid; grid-template-columns:1fr 1fr; position:relative; overflow:hidden; padding-top:64px; }
        @media(max-width:900px){ .v-hero{grid-template-columns:1fr} .v-hero-r{display:none!important} }

        .v-grid { position:absolute; inset:0; pointer-events:none;
          background-image:linear-gradient(rgba(0,0,0,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.04) 1px,transparent 1px);
          background-size:52px 52px; }
        .v-glow { position:absolute; top:-200px; left:-200px; width:600px; height:600px; border-radius:50%;
          background:radial-gradient(circle,rgba(58,102,71,.07) 0%,transparent 65%); pointer-events:none; }

        .v-left { display:flex; flex-direction:column; justify-content:center; padding:80px 64px; position:relative; z-index:2; }
        @media(max-width:1100px){.v-left{padding:60px 36px}} @media(max-width:600px){.v-left{padding:48px 24px}}

        .v-pre { display:flex; align-items:center; gap:12px; margin-bottom:28px; }
        .v-pre-line { width:28px; height:1px; background:#3a6647; }
        .v-pre-txt { font-family:'JetBrains Mono',monospace; font-size:.6rem; letter-spacing:.16em; color:#888078; text-transform:uppercase; }

        .v-h1 { font-family:'Barlow Condensed',sans-serif; font-size:clamp(3.8rem,7.5vw,7rem); font-weight:800; line-height:.88; letter-spacing:.02em; text-transform:uppercase; color:#1a1714; margin-bottom:28px; }
        .v-h1 span { color:#3a6647; }
        .v-sub { font-size:1.05rem; color:#4a4640; line-height:1.65; max-width:420px; margin-bottom:44px; }
        .v-ctas { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:56px; }

        .v-start { display:inline-flex; align-items:center; gap:10px; background:#3a6647; color:#f5f2ee;
          font-family:'Barlow Condensed',sans-serif; font-size:.95rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
          padding:14px 28px; border-radius:8px; text-decoration:none; border:none; cursor:pointer; transition:background .2s,transform .12s; position:relative; overflow:hidden; }
        .v-start::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.12) 0%,transparent 60%); }
        .v-start:hover { background:#2d5238; transform:translateY(-1px); }
        .v-arr { font-size:1.1rem; transition:transform .2s; display:inline-block; }
        .v-start:hover .v-arr { transform:translateX(5px); }

        .v-ghost-btn { display:inline-flex; align-items:center; gap:8px; background:transparent; color:#4a4640;
          font-family:'Barlow Condensed',sans-serif; font-size:.9rem; font-weight:500; letter-spacing:.1em; text-transform:uppercase;
          padding:13px 24px; border-radius:8px; text-decoration:none; border:1px solid #cac6bc; cursor:pointer; transition:all .2s; }
        .v-ghost-btn:hover { border-color:#b0aca2; color:#1a1714; }

        .v-stats { display:flex; gap:36px; padding-top:32px; border-top:1px solid #cac6bc; flex-wrap:wrap; }
        .v-sv { font-family:'Barlow Condensed',sans-serif; font-size:2.4rem; font-weight:800; color:#1a1714; line-height:1; margin-bottom:4px; }
        .v-sl { font-family:'JetBrains Mono',monospace; font-size:.55rem; letter-spacing:.14em; color:#888078; text-transform:uppercase; }

        /* DEVICE */
        .v-right { display:flex; align-items:center; justify-content:center; padding:80px 48px; position:relative; z-index:2; }
        .v-device { position:relative; width:300px; height:580px;
          background:linear-gradient(160deg,#ffffff 0%,#f0ede8 100%);
          border-radius:36px; border:1px solid #cac6bc; overflow:hidden;
          box-shadow:0 0 60px rgba(58,102,71,.08),0 20px 80px rgba(0,0,0,.1),0 40px 100px rgba(0,0,0,.06);
          animation:float 6s ease-in-out infinite; }
        .v-scan { position:absolute; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(58,102,71,.4),transparent);
          animation:scanline 6s linear infinite; z-index:10; pointer-events:none; }
        .v-scanlines { position:absolute; inset:0; pointer-events:none; z-index:3;
          background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.008) 3px,rgba(0,0,0,.008) 4px); }

        .v-dtop { position:absolute; top:20px; left:20px; right:20px; display:flex; justify-content:space-between; align-items:center; z-index:5; }
        .v-dlogo { font-family:'Barlow Condensed',sans-serif; font-size:.75rem; font-weight:800; letter-spacing:.22em; color:#1a1714; text-transform:uppercase; }
        .v-dstatus { display:flex; align-items:center; gap:5px; font-family:'JetBrains Mono',monospace; font-size:.48rem; letter-spacing:.12em; color:#3a6647; text-transform:uppercase; }
        .v-dstatus-dot { width:5px; height:5px; border-radius:50%; background:#3a6647; animation:pulseDot 2s ease-in-out infinite; }

        .v-dbars { position:absolute; top:58px; left:20px; right:20px; z-index:5; }
        .v-dbar-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:9px; }
        .v-dbar-lbl { font-family:'JetBrains Mono',monospace; font-size:.42rem; letter-spacing:.12em; color:#888078; text-transform:uppercase; width:68px; }
        .v-dbar-track { flex:1; height:2px; background:#cac6bc; border-radius:1px; overflow:hidden; margin:0 10px; }
        .v-dbar-fill { height:100%; background:#3a6647; border-radius:1px; animation:barGrow .8s ease-out both; }
        .v-dbar-val { font-family:'JetBrains Mono',monospace; font-size:.42rem; color:#4a4640; width:22px; text-align:right; }

        .v-orb-area { position:absolute; top:50%; left:50%; transform:translate(-50%,-53%); display:flex; align-items:center; justify-content:center; width:200px; height:200px; }
        .v-ring-out { position:absolute; width:180px; height:180px; border-radius:50%; border:1px solid rgba(58,102,71,.2); animation:rotate 20s linear infinite; }
        .v-ring-out::before { content:''; position:absolute; top:-3px; left:50%; width:6px; height:6px; border-radius:50%; background:#3a6647; opacity:.7; transform:translateX(-50%); }
        .v-ring-mid { position:absolute; width:140px; height:140px; border-radius:50%; border:1px solid rgba(58,102,71,.14); animation:rotRev 14s linear infinite; }
        .v-ring-mid::before { content:''; position:absolute; bottom:-3px; left:50%; width:4px; height:4px; border-radius:50%; background:rgba(58,102,71,.55); transform:translateX(-50%); }
        .v-orb { position:relative; width:80px; height:80px; border-radius:50%;
          background:radial-gradient(circle at 38% 32%,rgba(100,180,120,.6),rgba(58,102,71,.35) 45%,rgba(58,102,71,.1));
          box-shadow:0 0 30px rgba(58,102,71,.25),inset 0 0 20px rgba(255,255,255,.3);
          animation:breathe 3.5s ease-in-out infinite; }
        .v-orb-inner { position:absolute; inset:12px; border-radius:50%; background:radial-gradient(circle at 40% 35%,rgba(255,255,255,.5),transparent 60%); animation:breathe2 3.5s ease-in-out infinite .8s; }

        .v-dlabel { position:absolute; z-index:5; }
        .v-dlabel-k { font-family:'JetBrains Mono',monospace; font-size:.44rem; letter-spacing:.14em; color:#888078; text-transform:uppercase; }
        .v-dlabel-v { font-family:'Barlow Condensed',sans-serif; font-size:1.4rem; font-weight:700; line-height:1; margin-top:2px; }

        .v-dquote { position:absolute; bottom:64px; left:16px; right:16px; z-index:5;
          background:rgba(245,242,238,.97); border:1px solid #cac6bc; border-radius:12px; padding:12px 14px; }
        .v-dquote-l { font-family:'JetBrains Mono',monospace; font-size:.43rem; letter-spacing:.14em; color:#3a6647; text-transform:uppercase; margin-bottom:6px; }
        .v-dquote-t { font-family:'Barlow',sans-serif; font-size:.75rem; color:#4a4640; line-height:1.5; font-style:italic; }

        .v-dnav { position:absolute; bottom:0; left:0; right:0; height:52px; background:rgba(236,233,227,.98); border-top:1px solid #cac6bc; display:flex; align-items:center; justify-content:space-around; z-index:5; }
        .v-dnav-item { display:flex; flex-direction:column; align-items:center; gap:3px; }
        .v-dnav-icon { font-size:.85rem; }
        .v-dnav-lbl { font-family:'JetBrains Mono',monospace; font-size:.36rem; letter-spacing:.1em; text-transform:uppercase; }

        /* TICKER */
        .v-ticker { background:#ece9e3; border-top:1px solid #cac6bc; border-bottom:1px solid #cac6bc; padding:11px 0; overflow:hidden; }
        .v-ticker-inner { display:flex; animation:ticker 26s linear infinite; width:max-content; }
        .v-ticker-item { display:flex; align-items:center; gap:10px; padding:0 28px; white-space:nowrap; font-family:'JetBrains Mono',monospace; font-size:.58rem; letter-spacing:.12em; color:#888078; text-transform:uppercase; }
        .v-ticker-dot { width:3px; height:3px; border-radius:50%; background:#3a6647; opacity:.55; }

        /* SECTIONS */
        .v-sec { padding:100px 24px; }
        .v-sec-inner { max-width:1200px; margin:0 auto; }
        .v-slabel { display:flex; align-items:center; gap:12px; margin-bottom:20px; }
        .v-sline  { width:20px; height:1px; background:#3a6647; }
        .v-slbl   { font-family:'JetBrains Mono',monospace; font-size:.58rem; letter-spacing:.16em; color:#888078; text-transform:uppercase; }
        .v-sh2    { font-family:'Barlow Condensed',sans-serif; font-size:clamp(2.2rem,4vw,3.5rem); font-weight:800; letter-spacing:.04em; text-transform:uppercase; color:#1a1714; line-height:.95; margin-bottom:48px; }
        .v-sh2 span { color:#3a6647; }

        /* MODULES */
        .v-mgrid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:1px; background:#cac6bc; border:1px solid #cac6bc; border-radius:16px; overflow:hidden; }
        .v-mcard { background:#f5f2ee; padding:28px 24px; transition:background .2s; cursor:default; }
        .v-mcard:hover { background:#ece9e3; }
        .v-mnum  { font-family:'JetBrains Mono',monospace; font-size:.5rem; letter-spacing:.18em; color:#3a6647; text-transform:uppercase; margin-bottom:14px; }
        .v-mname { font-family:'Barlow Condensed',sans-serif; font-size:1.4rem; font-weight:700; letter-spacing:.1em; color:#1a1714; text-transform:uppercase; margin-bottom:10px; }
        .v-mdesc { font-size:.83rem; color:#888078; line-height:1.6; }
        .v-mind  { width:5px; height:5px; border-radius:50%; background:#3a6647; opacity:.5; float:right; margin-top:4px; }

        /* QUOTES */
        .v-qsec   { background:#ece9e3; border-top:1px solid #cac6bc; border-bottom:1px solid #cac6bc; padding:60px 24px; overflow:hidden; }
        .v-qtrack { display:flex; gap:24px; animation:ticker 38s linear infinite; width:max-content; }
        .v-qcard  { background:#f5f2ee; border:1px solid #cac6bc; border-radius:12px; padding:20px 22px; width:300px; flex-shrink:0; }
        .v-qmark  { font-family:'Barlow Condensed',sans-serif; font-size:2rem; color:#3a6647; opacity:.4; line-height:1; margin-bottom:6px; }
        .v-qtxt   { font-family:'Barlow',sans-serif; font-size:.85rem; color:#4a4640; line-height:1.55; font-style:italic; }

        /* HOW IT WORKS */
        .v-sgrid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:20px; }
        .v-scard { background:#f5f2ee; border:1px solid #cac6bc; border-radius:14px; padding:28px 22px; position:relative; overflow:hidden; transition:border-color .2s,transform .2s,box-shadow .2s; }
        .v-scard:hover { border-color:#b0aca2; transform:translateY(-3px); box-shadow:0 8px 24px rgba(0,0,0,.07); }
        .v-scard::before { content:attr(data-n); position:absolute; right:14px; bottom:10px; font-family:'Barlow Condensed',sans-serif; font-size:3.5rem; font-weight:800; color:#e4e0d8; line-height:1; pointer-events:none; }
        .v-snum   { font-family:'JetBrains Mono',monospace; font-size:.52rem; letter-spacing:.16em; color:#3a6647; text-transform:uppercase; margin-bottom:14px; }
        .v-stitle { font-family:'Barlow Condensed',sans-serif; font-size:1.1rem; font-weight:700; letter-spacing:.08em; color:#1a1714; text-transform:uppercase; margin-bottom:10px; }
        .v-sbody  { font-size:.83rem; color:#888078; line-height:1.6; }

        /* GHOST */
        .v-gsec   { background:#ece9e3; border-top:1px solid #cac6bc; }
        .v-ginner { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; padding:100px 24px; }
        @media(max-width:800px){.v-ginner{grid-template-columns:1fr;gap:40px}}
        .v-gchart { display:flex; flex-direction:column; gap:16px; }
        .v-grow   { display:flex; flex-direction:column; gap:6px; }
        .v-grow-top { display:flex; justify-content:space-between; align-items:center; }
        .v-grow-lbl { font-family:'JetBrains Mono',monospace; font-size:.55rem; letter-spacing:.12em; color:#888078; text-transform:uppercase; }
        .v-grow-vals { display:flex; gap:10px; align-items:center; }
        .v-gval-you   { font-family:'Barlow Condensed',sans-serif; font-size:.9rem; font-weight:700; color:#3a6647; }
        .v-gval-ghost { font-family:'JetBrains Mono',monospace; font-size:.52rem; color:#888078; }
        .v-gtrack { height:3px; background:#cac6bc; border-radius:2px; position:relative; }
        .v-gfill-g { position:absolute; top:0; left:0; height:3px; border-radius:2px; background:#b0aca2; opacity:.45; }
        .v-gfill-y { position:absolute; top:0; left:0; height:3px; border-radius:2px; background:#3a6647; }

        /* CTA */
        .v-cta { padding:120px 24px; text-align:center; position:relative; overflow:hidden; background:#f5f2ee; }
        .v-cta-glow { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:600px; height:300px; border-radius:50%; background:radial-gradient(ellipse,rgba(58,102,71,.07) 0%,transparent 70%); pointer-events:none; }
        .v-cta-h2 { font-family:'Barlow Condensed',sans-serif; font-size:clamp(3rem,7vw,5.5rem); font-weight:800; letter-spacing:.04em; text-transform:uppercase; color:#1a1714; line-height:.9; margin-bottom:24px; position:relative; z-index:1; }
        .v-cta-h2 span { color:#3a6647; }
        .v-cta-sub { font-size:1rem; color:#4a4640; max-width:360px; margin:0 auto 40px; line-height:1.65; position:relative; z-index:1; }
      `}</style>

      <div className="v">
        {/* HERO */}
        <section className="v-hero">
          <div className="v-grid" />
          <div className="v-glow" />
          <div className="v-left">
            <div className="v-pre afu">
              <div className="v-pre-line" />
              <span className="v-pre-txt">Memory-driven AI Vitality System</span>
            </div>
            <h1 className="v-h1 afu d1">Train<br /><span>Your</span><br />Full Self.</h1>
            <p className="v-sub afu d2">A memory-driven AI vitality system that studies your patterns, interprets your daily state, and helps you train against the strongest version of yourself.</p>
            <div className="v-ctas afu d3">
              <Link href="/signup" className="v-start">Begin Training <span className="v-arr">→</span></Link>
              <Link href="/pricing" className="v-ghost-btn">View Plans</Link>
            </div>
            <div className="v-stats afu d4">
              {[{v:"4",l:"Core Systems"},{v:"∞",l:"Memory Depth"},{v:"1",l:"Ghost to Chase"}].map(s=>(
                <div key={s.l}><div className="v-sv">{s.v}</div><div className="v-sl">{s.l}</div></div>
              ))}
            </div>
          </div>

          <div className="v-right">
            <div style={{position:"absolute",width:"360px",height:"360px",borderRadius:"50%",background:"radial-gradient(circle,rgba(58,102,71,.08) 0%,transparent 65%)",pointerEvents:"none"}} />
            <div className="v-device">
              <div className="v-scan" />
              <div className="v-scanlines" />
              <div className="v-dtop">
                <span className="v-dlogo">VYTALL</span>
                <div className="v-dstatus"><div className="v-dstatus-dot" />ACTIVE</div>
              </div>
              <div className="v-dbars">
                {[{l:"Consistency",w:"68%",v:"68",d:".2s"},{l:"Readiness",w:"74%",v:"74",d:".35s"},{l:"Recovery",w:"70%",v:"70",d:".5s"}].map(b=>(
                  <div className="v-dbar-row" key={b.l}>
                    <div className="v-dbar-lbl">{b.l}</div>
                    <div className="v-dbar-track"><div className="v-dbar-fill" style={{width:b.w,animationDelay:b.d} as React.CSSProperties} /></div>
                    <div className="v-dbar-val">{b.v}</div>
                  </div>
                ))}
              </div>
              <div className="v-orb-area">
                <div className="v-ring-out" /><div className="v-ring-mid" />
                <div className="v-orb"><div className="v-orb-inner" /></div>
              </div>
              <div className="v-dlabel" style={{top:"44%",left:"18px"}}>
                <div className="v-dlabel-k">Readiness</div>
                <div className="v-dlabel-v" style={{color:"#3a6647"}}>74</div>
              </div>
              <div className="v-dlabel" style={{top:"44%",right:"18px",textAlign:"right"}}>
                <div className="v-dlabel-k">Mode</div>
                <div className="v-dlabel-v" style={{color:"#1a1714",fontSize:"1.15rem",letterSpacing:".08em"}}>FORGE</div>
              </div>
              <div className="v-dlabel" style={{top:"58%",left:"18px"}}>
                <div className="v-dlabel-k">Ghost</div>
                <div className="v-dlabel-v" style={{color:"#4a4640",fontSize:"1.25rem"}}>−11</div>
              </div>
              <div className="v-dlabel" style={{top:"58%",right:"18px",textAlign:"right"}}>
                <div className="v-dlabel-k">Vital</div>
                <div className="v-dlabel-v" style={{color:"#1a1714",fontSize:"1.15rem"}}>74.3</div>
              </div>
              <div className="v-dquote">
                <div className="v-dquote-l">Alchemy · Today</div>
                <div className="v-dquote-t">"Today does not require more intensity. It requires more control."</div>
              </div>
              <div className="v-dnav">
                {[{i:"⬡",l:"Home",a:true},{i:"✦",l:"Check-In",a:false},{i:"◎",l:"Archive",a:false},{i:"◈",l:"Ghost",a:false},{i:"○",l:"Profile",a:false}].map(n=>(
                  <div className="v-dnav-item" key={n.l}>
                    <span className="v-dnav-icon" style={{color:n.a?"#3a6647":"#b0aca2"}}>{n.i}</span>
                    <span className="v-dnav-lbl" style={{color:n.a?"#3a6647":"#888078"}}>{n.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TICKER */}
        <div className="v-ticker">
          <div className="v-ticker-inner">
            {[...Array(2)].map((_,r)=>
              ["FORGE","ALCHEMY","ARCHIVE","GHOST","DAILY CHECK-IN","AI MISSION","VITALITY OS","TRAIN YOUR FULL SELF","MEMORY-DRIVEN","BEAT YOUR GHOST"].map(t=>(
                <div className="v-ticker-item" key={`${r}-${t}`}><span className="v-ticker-dot"/>{t}</div>
              ))
            )}
          </div>
        </div>

        {/* MODULES */}
        <section className="v-sec" id="modules" style={{background:"#f5f2ee"}}>
          <div className="v-sec-inner">
            <div className="v-slabel"><div className="v-sline"/><span className="v-slbl">Core Systems</span></div>
            <h2 className="v-sh2">Four Systems.<br/><span>One Intelligence.</span></h2>
            <div className="v-mgrid">
              {modules.map(m=>(
                <div className="v-mcard" key={m.name}>
                  <div className="v-mnum">{m.tag} · System</div>
                  <div style={{float:"right"}}><div className="v-mind"/></div>
                  <div className="v-mname">{m.name}</div>
                  <div className="v-mdesc">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VOICE TICKER */}
        <div className="v-qsec">
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"12px",marginBottom:"28px"}}>
            <div className="v-sline"/><span className="v-slbl">The VYTALL Voice</span><div className="v-sline"/>
          </div>
          <div style={{overflow:"hidden"}}>
            <div className="v-qtrack">
              {[...quotes,...quotes].map((q,i)=>(
                <div className="v-qcard" key={i}>
                  <div className="v-qmark">"</div>
                  <div className="v-qtxt">{q}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section className="v-sec" style={{background:"#f5f2ee",borderTop:"1px solid #cac6bc"}}>
          <div className="v-sec-inner">
            <div className="v-slabel"><div className="v-sline"/><span className="v-slbl">Protocol</span></div>
            <h2 className="v-sh2">How <span>VYTALL</span> Works</h2>
            <div className="v-sgrid">
              {steps.map(s=>(
                <div className="v-scard" key={s.n} data-n={s.n}>
                  <div className="v-snum">{s.n} ·</div>
                  <div className="v-stitle">{s.title}</div>
                  <div className="v-sbody">{s.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GHOST */}
        <section className="v-gsec">
          <div className="v-ginner">
            <div>
              <div className="v-slabel"><div className="v-sline"/><span className="v-slbl">Ghost Engine</span></div>
              <h2 className="v-sh2" style={{marginBottom:"20px"}}>Train Against<br/><span>Your Peak Self.</span></h2>
              <p style={{fontSize:".95rem",color:"#4a4640",lineHeight:1.65,maxWidth:"380px",marginBottom:"32px"}}>
                VYTALL maintains a model of the strongest version of you that has ever existed in the system. Every session, it compares. Every gap, it measures.
              </p>
              <Link href="/signup" className="v-start" style={{display:"inline-flex"}}>Start Building Your Ghost <span className="v-arr">→</span></Link>
            </div>
            <div className="v-gchart">
              <div style={{display:"flex",justifyContent:"flex-end",gap:"16px",marginBottom:"8px"}}>
                {[{c:"#3a6647",l:"You"},{c:"#b0aca2",l:"Ghost"}].map(x=>(
                  <div key={x.l} style={{display:"flex",alignItems:"center",gap:"6px"}}>
                    <div style={{width:"12px",height:"2px",background:x.c,borderRadius:"1px"}}/>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".5rem",color:"#888078",textTransform:"uppercase",letterSpacing:".1em"}}>{x.l}</span>
                  </div>
                ))}
              </div>
              {[
                {l:"Consistency",you:68,ghost:88},{l:"Readiness",you:74,ghost:91},
                {l:"Technique",you:72,ghost:85},{l:"Strength",you:65,ghost:84},{l:"Recovery",you:70,ghost:80},
              ].map(row=>(
                <div className="v-grow" key={row.l}>
                  <div className="v-grow-top">
                    <span className="v-grow-lbl">{row.l}</span>
                    <div className="v-grow-vals">
                      <span className="v-gval-you">{row.you}</span>
                      <span className="v-gval-ghost">/ {row.ghost} Ghost</span>
                    </div>
                  </div>
                  <div className="v-gtrack">
                    <div className="v-gfill-g" style={{width:`${row.ghost}%`}}/>
                    <div className="v-gfill-y" style={{width:`${row.you}%`}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="v-cta">
          <div className="v-cta-glow"/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"12px",marginBottom:"24px"}}>
            <div className="v-sline"/><span className="v-slbl">Ready to begin</span><div className="v-sline"/>
          </div>
          <h2 className="v-cta-h2">Your Ghost<br/><span>is waiting.</span></h2>
          <p className="v-cta-sub">The system needs data to begin. Every check-in builds the model. Every session closes the gap.</p>
          <div style={{position:"relative",zIndex:1,display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
            <Link href="/signup" className="v-start" style={{fontSize:"1rem",padding:"16px 36px"}}>Start Free <span className="v-arr">→</span></Link>
            <Link href="/pricing" className="v-ghost-btn">See Plans</Link>
          </div>
        </section>
      </div>
    </>
  );
}
