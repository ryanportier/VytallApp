"use client";
import Link from "next/link";
import { useState } from "react";

export default function MarketingNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <style>{`
        .vn { position:fixed; top:0; left:0; right:0; z-index:100; height:64px;
          background:rgba(245,242,238,.92); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
          border-bottom:1px solid #cac6bc; display:flex; align-items:center; padding:0 32px; justify-content:space-between; }
        .vn-logo { font-family:'Barlow Condensed',sans-serif; font-size:1.1rem; font-weight:800; letter-spacing:.24em; color:#1a1714; text-decoration:none; text-transform:uppercase; flex-shrink:0; }
        .vn-links { display:flex; align-items:center; gap:4px; }
        .vn-link { font-family:'JetBrains Mono',monospace; font-size:.6rem; letter-spacing:.14em; text-transform:uppercase; color:#888078; text-decoration:none; padding:8px 14px; border-radius:6px; transition:color .2s,background .2s; }
        .vn-link:hover { color:#4a4640; background:rgba(0,0,0,.04); }
        .vn-actions { display:flex; align-items:center; gap:8px; flex-shrink:0; }
        .vn-login { font-family:'Barlow Condensed',sans-serif; font-size:.8rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#4a4640; text-decoration:none; padding:8px 16px; border-radius:7px; border:1px solid #cac6bc; transition:all .2s; }
        .vn-login:hover { border-color:#b0aca2; color:#1a1714; }
        .vn-cta { font-family:'Barlow Condensed',sans-serif; font-size:.8rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#f5f2ee; text-decoration:none; padding:9px 18px; border-radius:7px; background:#3a6647; transition:background .2s,transform .1s; position:relative; overflow:hidden; }
        .vn-cta::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.1) 0%,transparent 60%); }
        .vn-cta:hover { background:#2d5238; transform:translateY(-1px); }
        .vn-toggle { display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer; padding:6px; }
        .vn-toggle span { display:block; width:20px; height:1px; background:#4a4640; transition:all .25s ease; transform-origin:center; }
        .vn-toggle.open span:nth-child(1) { transform:translateY(6px) rotate(45deg); }
        .vn-toggle.open span:nth-child(2) { opacity:0; transform:scaleX(0); }
        .vn-toggle.open span:nth-child(3) { transform:translateY(-6px) rotate(-45deg); }
        .vn-drawer { position:fixed; top:64px; left:0; right:0; z-index:99; background:rgba(245,242,238,.97); backdrop-filter:blur(20px); border-bottom:1px solid #cac6bc; padding:20px 24px 24px; display:flex; flex-direction:column; gap:4px; transform:translateY(-8px); opacity:0; pointer-events:none; transition:opacity .22s ease,transform .22s ease; }
        .vn-drawer.open { opacity:1; transform:translateY(0); pointer-events:all; }
        .vn-dlink { font-family:'JetBrains Mono',monospace; font-size:.65rem; letter-spacing:.14em; text-transform:uppercase; color:#888078; text-decoration:none; padding:12px 16px; border-radius:8px; transition:color .15s,background .15s; }
        .vn-dlink:hover { color:#4a4640; background:rgba(0,0,0,.04); }
        .vn-ddiv { height:1px; background:#cac6bc; margin:8px 0; }
        .vn-dbtns { display:flex; gap:10px; margin-top:4px; }
        .vn-dlogin { flex:1; text-align:center; font-family:'Barlow Condensed',sans-serif; font-size:.85rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#4a4640; text-decoration:none; padding:13px; border-radius:8px; border:1px solid #cac6bc; transition:all .15s; }
        .vn-dlogin:hover { border-color:#b0aca2; color:#1a1714; }
        .vn-dcta { flex:1.5; text-align:center; font-family:'Barlow Condensed',sans-serif; font-size:.85rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#f5f2ee; text-decoration:none; padding:13px; border-radius:8px; background:#3a6647; transition:background .15s; }
        .vn-dcta:hover { background:#2d5238; }
        @media(max-width:768px) { .vn-links,.vn-actions{display:none} .vn-toggle{display:flex} .vn{padding:0 20px} }
      `}</style>

      <nav className="vn">
        <Link href="/" className="vn-logo">VYTALL</Link>
        <div className="vn-links">
          {[{l:"Modules",h:"/#modules"},{l:"Pricing",h:"/pricing"},{l:"About",h:"/about"}].map(i=>(
            <Link key={i.h} href={i.h} className="vn-link">{i.l}</Link>
          ))}
        </div>
        <div className="vn-actions">
          <Link href="/login" className="vn-login">Log In</Link>
          <Link href="/signup" className="vn-cta">Start</Link>
        </div>
        <button className={`vn-toggle${open?" open":""}`} onClick={()=>setOpen(!open)} aria-label="Toggle menu">
          <span/><span/><span/>
        </button>
      </nav>

      <div className={`vn-drawer${open?" open":""}`}>
        {[{l:"Modules",h:"/#modules"},{l:"Pricing",h:"/pricing"},{l:"About",h:"/about"}].map(i=>(
          <Link key={i.h} href={i.h} className="vn-dlink" onClick={()=>setOpen(false)}>{i.l}</Link>
        ))}
        <div className="vn-ddiv"/>
        <div className="vn-dbtns">
          <Link href="/login" className="vn-dlogin" onClick={()=>setOpen(false)}>Log In</Link>
          <Link href="/signup" className="vn-dcta" onClick={()=>setOpen(false)}>Start Free</Link>
        </div>
      </div>
    </>
  );
}
