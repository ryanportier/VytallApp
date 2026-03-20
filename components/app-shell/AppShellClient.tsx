"use client";
import { useEffect, useState } from "react";
import { useFirebaseAuth } from "@/components/providers/FirebaseAuthProvider";
import AppSidebar from "./AppSidebar";
import AppMobileNav from "./AppMobileNav";
import AppTopBar from "./AppTopBar";

export default function AppShellClient({ children }: { children: React.ReactNode }) {
  const { user } = useFirebaseAuth();
  const [profileName, setProfileName]       = useState("");
  const [profileInitial, setProfileInitial] = useState("V");

  useEffect(() => {
    if (!user) return;
    fetch("/api/auth/profile")
      .then(r => r.json())
      .then(d => {
        if (d.name) {
          setProfileName(d.name);
          setProfileInitial(d.name[0].toUpperCase());
        }
      })
      .catch(() => {});
  }, [user]);

  return (
    <>
      <style>{`
        .app-shell { display:flex; min-height:100dvh; background:var(--void); }
        .app-sidebar { width:240px; flex-shrink:0; display:none; }
        @media(min-width:768px){ .app-sidebar { display:flex; } }
        .app-main { flex:1; display:flex; flex-direction:column; min-width:0; overflow:hidden; }
        .app-content { flex:1; overflow-y:auto; padding-bottom:80px; }
        @media(min-width:768px){ .app-content { padding-bottom:0; } }
        .app-inner { max-width:860px; margin:0 auto; width:100%; }
      `}</style>

      <div className="app-shell">
        <div className="app-sidebar">
          <AppSidebar profileName={profileName} profileInitial={profileInitial} />
        </div>
        <div className="app-main">
          <AppTopBar profileName={profileName} profileInitial={profileInitial} />
          <div className="app-content">
            <div className="app-inner">{children}</div>
          </div>
        </div>
      </div>
      <AppMobileNav />
    </>
  );
}
