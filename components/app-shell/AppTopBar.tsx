import Link from "next/link";

interface Props {
  profileName: string;
  profileInitial: string;
}

export default function AppTopBar({ profileName, profileInitial }: Props) {
  return (
    <>
      <style>{`
        .topbar {
          display: none;
          height: 56px; align-items: center;
          padding: 0 32px;
          border-bottom: 1px solid var(--border);
          background: var(--void);
          justify-content: space-between;
          flex-shrink: 0;
          position: sticky; top: 0; z-index: 30;
          backdrop-filter: blur(12px);
        }
        @media(min-width:768px) { .topbar { display: flex; } }

        .topbar-date {
          font-family: 'JetBrains Mono', monospace;
          font-size: .55rem; letter-spacing: .12em; text-transform: uppercase;
          color: var(--ghost);
        }
        .topbar-right { display: flex; align-items: center; gap: 12px; }
        .topbar-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: var(--vital-dim); border: 1px solid rgba(58,102,71,.3);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: .85rem; font-weight: 700; color: var(--vital);
          text-decoration: none; transition: border-color .2s;
        }
        .topbar-avatar:hover { border-color: var(--vital); }
      `}</style>

      <div className="topbar">
        <div className="topbar-date">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
        <div className="topbar-right">
          <Link href="/app/profile" className="topbar-avatar" title={profileName}>
            {profileInitial}
          </Link>
        </div>
      </div>
    </>
  );
}
