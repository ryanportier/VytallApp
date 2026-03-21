export default function PaymentsDocs() {
  return (
    <>
      <div className="doc-breadcrumb"><a href="/docs">Docs</a> / Plans & Payments</div>
      <h1>Plans & Payments</h1>
      <p className="doc-lead">VYTALL is free to start. Upgrade when you want more — more history, more coaching depth, more access to your Ghost.</p>

      <h2>Free Plan</h2>
      <p>Free forever. No credit card. Includes:</p>
      <ul>
        <li>Daily check-in and AI mission generation</li>
        <li>Workout logging (up to 3 sessions)</li>
        <li>Archive — last 7 days</li>
        <li>Ghost summary (overview only)</li>
      </ul>

      <h2>Premium — 12 USDC / month</h2>
      <p>Full access to everything. Includes:</p>
      <ul>
        <li>Unlimited workout logging</li>
        <li>Full Archive — your complete training history</li>
        <li>Full Ghost engine — all 5 dimensions with prescription</li>
        <li>Weekly adaptive plan</li>
        <li>Unlimited AI reflections</li>
        <li>Full mission history</li>
      </ul>

      <h2>Pay-per-use features</h2>
      <p>Some premium features can be unlocked one at a time, without a subscription:</p>
      <ul>
        <li><strong>Deep Ghost Report</strong> — 0.50 USDC</li>
        <li><strong>Elite Plan Refresh</strong> — 1.00 USDC</li>
        <li><strong>Advanced Archive Entry</strong> — 0.25 USDC</li>
        <li><strong>Premium Challenge</strong> — 0.50 USDC</li>
      </ul>

      <h2>How payments work</h2>
      <p>VYTALL payments are made in <strong>USDC</strong> — a digital dollar — on the Base network. When you pay, your wallet (created automatically by VYTALL via Privy) sends USDC directly. No bank account needed.</p>

      <div className="doc-callout">
        <p><strong>New to crypto?</strong> Don't worry — VYTALL creates a wallet for you automatically when you connect. You just need to fund it with USDC to unlock premium features. The payments page walks you through it.</p>
      </div>
    </>
  );
}
