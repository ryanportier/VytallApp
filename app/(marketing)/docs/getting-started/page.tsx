export default function GettingStartedDocs() {
  return (
    <>
      <div className="doc-breadcrumb">
        <a href="/docs">Docs</a> / Getting Started
      </div>

      <h1>Getting Started</h1>
      <p className="doc-lead">
        Set up VYTALL locally in under 10 minutes. You'll need Node.js 20+, a Supabase project, Firebase project, and an Anthropic API key.
      </p>

      <h2>1. Clone & Install</h2>
      <pre><code>{`git clone https://github.com/youruser/vytall
cd vytall
npm install`}</code></pre>

      <h2>2. Set Up Supabase</h2>
      <ol style={{ paddingLeft:"20px", marginBottom:"20px" }}>
        <li style={{ fontSize:".9rem", color:"var(--ash)", marginBottom:"8px" }}>Create a project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a></li>
        <li style={{ fontSize:".9rem", color:"var(--ash)", marginBottom:"8px" }}>Go to SQL Editor and run the contents of <code>supabase-schema.sql</code></li>
        <li style={{ fontSize:".9rem", color:"var(--ash)", marginBottom:"8px" }}>Copy your project URL and anon key from Project Settings → API</li>
      </ol>

      <h2>3. Set Up Firebase</h2>
      <ol style={{ paddingLeft:"20px", marginBottom:"20px" }}>
        <li style={{ fontSize:".9rem", color:"var(--ash)", marginBottom:"8px" }}>Create a project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">console.firebase.google.com</a></li>
        <li style={{ fontSize:".9rem", color:"var(--ash)", marginBottom:"8px" }}>Enable Authentication → Email/Password and Google</li>
        <li style={{ fontSize:".9rem", color:"var(--ash)", marginBottom:"8px" }}>Register a web app and copy the <code>firebaseConfig</code></li>
        <li style={{ fontSize:".9rem", color:"var(--ash)", marginBottom:"8px" }}>Go to Project Settings → Service Accounts → Generate new private key</li>
        <li style={{ fontSize:".9rem", color:"var(--ash)", marginBottom:"8px" }}>Copy <code>client_email</code> and <code>private_key</code> from the downloaded JSON</li>
      </ol>

      <h2>4. Get Your Anthropic API Key</h2>
      <p>Go to <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer">console.anthropic.com</a> → API Keys → Create Key.</p>

      <h2>5. Set Up Privy (for payments)</h2>
      <ol style={{ paddingLeft:"20px", marginBottom:"20px" }}>
        <li style={{ fontSize:".9rem", color:"var(--ash)", marginBottom:"8px" }}>Create an app at <a href="https://dashboard.privy.io" target="_blank" rel="noopener noreferrer">dashboard.privy.io</a></li>
        <li style={{ fontSize:".9rem", color:"var(--ash)", marginBottom:"8px" }}>Copy App ID and App Secret</li>
        <li style={{ fontSize:".9rem", color:"var(--ash)", marginBottom:"8px" }}>Add <code>localhost</code> to Allowed Origins</li>
      </ol>

      <h2>6. Configure Environment</h2>
      <p>Copy <code>.env.example</code> to <code>.env.local</code> and fill in all values:</p>
      <pre><code>{`cp .env.example .env.local
# Then edit .env.local with your keys`}</code></pre>

      <h2>7. Run Locally</h2>
      <pre><code>{`npm run dev
# Open http://localhost:3000`}</code></pre>

      <div className="doc-callout">
        <p><strong>Testing payments:</strong> Get free testnet USDC at <a href="https://faucet.circle.com" target="_blank" rel="noopener noreferrer">faucet.circle.com</a> (select Base Sepolia). Your wallet address is shown in the payments page after connecting Privy.</p>
      </div>

      <h2>8. First User Flow</h2>
      <ol style={{ paddingLeft:"20px", marginBottom:"20px" }}>
        <li style={{ fontSize:".9rem", color:"var(--ash)", marginBottom:"8px" }}>Go to <code>/signup</code> and create an account</li>
        <li style={{ fontSize:".9rem", color:"var(--ash)", marginBottom:"8px" }}>Complete onboarding (name, goal, equipment, etc.)</li>
        <li style={{ fontSize:".9rem", color:"var(--ash)", marginBottom:"8px" }}>Do your first daily check-in at <code>/app/check-in</code></li>
        <li style={{ fontSize:".9rem", color:"var(--ash)", marginBottom:"8px" }}>View your AI-generated mission at <code>/app/mission</code></li>
        <li style={{ fontSize:".9rem", color:"var(--ash)", marginBottom:"8px" }}>Log a workout at <code>/app/workouts</code></li>
        <li style={{ fontSize:".9rem", color:"var(--ash)", marginBottom:"8px" }}>Check your Ghost at <code>/app/ghost</code></li>
      </ol>

      <h2>Deploy to Vercel</h2>
      <pre><code>{`npm install -g vercel
vercel

# Set all env vars in Vercel dashboard
# Add your Vercel domain to:
# - Firebase: Authentication > Authorized Domains
# - Privy: Dashboard > Allowed Origins`}</code></pre>
    </>
  );
}
