export default function ArchitectureDocs() {
  return (
    <>
      <div className="doc-breadcrumb">
        <a href="/docs">Docs</a> / Architecture
      </div>

      <h1>Stack Overview</h1>
      <p className="doc-lead">
        VYTALL is a mobile-first Next.js 16 web app with a dark premium aesthetic. The stack was chosen for speed, simplicity, and AI-readiness.
      </p>

      <h2>Core Stack</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:"8px", margin:"16px 0" }}>
        {[
          { layer:"Framework",    tech:"Next.js 16.2 · TypeScript · App Router · Turbopack" },
          { layer:"Styling",      tech:"Tailwind CSS · CSS Variables · Mobile-first" },
          { layer:"AI",           tech:"Claude API (claude-sonnet-4-20250514) via Anthropic SDK" },
          { layer:"Database",     tech:"Supabase Postgres · RLS policies · Edge Functions" },
          { layer:"Auth",         tech:"Firebase Authentication · Email/Password · Google OAuth" },
          { layer:"Wallet/Pay",   tech:"Privy · viem · USDC on Base (ERC-20 transfer)" },
          { layer:"Storage",      tech:"Supabase Storage (video uploads, profile assets)" },
          { layer:"Movement",     tech:"MediaPipe Pose (Phase 2 — squat, push-up, plank)" },
        ].map(s => (
          <div key={s.layer} style={{ display:"flex", gap:"16px", background:"var(--graphite)", border:"1px solid var(--border)", borderRadius:"10px", padding:"13px 16px" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".5rem", letterSpacing:".1em", textTransform:"uppercase", color:"var(--ghost)", minWidth:"90px", flexShrink:0 }}>{s.layer}</div>
            <div style={{ fontSize:".88rem", color:"var(--ash)" }}>{s.tech}</div>
          </div>
        ))}
      </div>

      <h2>Project Structure</h2>
      <pre><code>{`vytall/
├── app/
│   ├── (auth)/          # Login, Signup pages
│   ├── (marketing)/     # Landing, Pricing, About, Docs
│   ├── app/             # Protected app pages
│   │   ├── check-in/
│   │   ├── mission/
│   │   ├── workouts/
│   │   ├── archive/
│   │   ├── ghost/
│   │   ├── payments/
│   │   └── profile/
│   └── api/
│       ├── claude/      # AI API routes
│       ├── auth/        # Firebase profile sync
│       └── payments/    # Payment recording
├── components/
│   ├── app-shell/       # Sidebar, TopBar, MobileNav
│   └── providers/       # Firebase, Privy providers
├── lib/
│   ├── ai/             # Claude client + prompts
│   ├── firebase/       # Auth client + admin SDK
│   ├── supabase/       # DB client + server helpers
│   └── utils/
└── proxy.ts            # Auth middleware (Next.js 16)`}</code></pre>

      <h2>Request Flow</h2>
      <p>Every request goes through <code>proxy.ts</code> which checks the <code>firebase-token</code> cookie. Protected <code>/app/*</code> routes redirect to <code>/login</code> if unauthenticated. AI routes are called from Server Components and Route Handlers — never directly from the browser.</p>

      <h2>Environment Variables</h2>
      <pre><code>{`# Supabase (database)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic (AI)
ANTHROPIC_API_KEY=

# Firebase (auth)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Privy (wallet)
NEXT_PUBLIC_PRIVY_APP_ID=
PRIVY_APP_SECRET=

# Payments
NEXT_PUBLIC_RECIPIENT_WALLET=  # USDC receiving address`}</code></pre>
    </>
  );
}
