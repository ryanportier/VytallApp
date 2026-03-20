import AppSidebar from "@/components/app-shell/AppSidebar";
import AppMobileNav from "@/components/app-shell/AppMobileNav";
import AppTopBar from "@/components/app-shell/AppTopBar";
import { createClient } from "@/lib/supabase/server";
import PrivyClientProvider from "@/components/providers/PrivyClientProvider";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profileName = "";
  let profileInitial = "V";
  if (user) {
    const { data } = await supabase.from("users").select("name").eq("id", user.id).single();
    if (data?.name) {
      profileName = data.name;
      profileInitial = data.name[0].toUpperCase();
    }
  }

  return (
    <PrivyClientProvider>
      <style>{`
        .app-shell {
          display: flex;
          min-height: 100dvh;
          background: var(--void);
        }

        /* ── SIDEBAR (desktop only) ── */
        .app-sidebar {
          width: 240px;
          flex-shrink: 0;
          display: none;
        }
        @media(min-width: 768px) {
          .app-sidebar { display: flex; }
        }

        /* ── MAIN CONTENT ── */
        .app-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }

        .app-content {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 80px; /* space for mobile nav */
        }
        @media(min-width: 768px) {
          .app-content {
            padding-bottom: 0;
            padding-top: 0;
          }
        }

        /* ── INNER CONTENT WIDTH ── */
        .app-inner {
          max-width: 860px;
          margin: 0 auto;
          width: 100%;
        }
      `}</style>

      <div className="app-shell">
        {/* Desktop sidebar */}
        <div className="app-sidebar">
          <AppSidebar profileName={profileName} profileInitial={profileInitial} />
        </div>

        {/* Main area */}
        <div className="app-main">
          {/* Top bar (desktop) */}
          <AppTopBar profileName={profileName} profileInitial={profileInitial} />

          <div className="app-content">
            <div className="app-inner">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <AppMobileNav />
    </PrivyClientProvider>
  );
}
