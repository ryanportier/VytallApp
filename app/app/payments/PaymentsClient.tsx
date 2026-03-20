"use client";
import { useState } from "react";
import {
  Ghost, BookOpen, Flame, Lock,
  Wallet, Zap, Crown, Check, Clock, ExternalLink, AlertCircle,
} from "lucide-react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { createWalletClient, createPublicClient, custom, http, parseUnits, encodeFunctionData } from "viem";
import { base, baseSepolia } from "viem/chains";

interface Props {
  currentPlan: string;
  x402History: Array<{ feature_key: string; amount: number; status: string; created_at: string }>;
}

// ERC-20 transfer ABI
const ERC20_ABI = [{
  name: "transfer",
  type: "function",
  stateMutability: "nonpayable",
  inputs: [
    { name: "to",    type: "address" },
    { name: "value", type: "uint256" },
  ],
  outputs: [{ type: "bool" }],
}] as const;

// USDC contract addresses
const USDC_ADDRESS: Record<number, `0x${string}`> = {
  8453:  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base mainnet
  84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia
};

// Your receiving wallet
const RECIPIENT = (process.env.NEXT_PUBLIC_RECIPIENT_WALLET ?? "0x875ebd94297992BF61dd1377F26feba84A44E44e") as `0x${string}`;

const PREMIUM_FEATURES = [
  "Full mission history", "Complete Archive access",
  "Full Ghost engine", "Weekly adaptive plan",
  "Unlimited AI reflections", "More workouts saved",
];

const X402_ONEOFFS = [
  { icon: Ghost,    key: "ghost_report",     label: "Deep Ghost Report",  price: 0.50, desc: "Advanced Ghost analysis." },
  { icon: Crown,    key: "elite_plan",        label: "Elite Plan Refresh", price: 1.00, desc: "4-week personalized plan." },
  { icon: BookOpen, key: "advanced_archive",  label: "Advanced Archive",   price: 0.25, desc: "Deep narrative archive entry." },
  { icon: Flame,    key: "premium_challenge", label: "Premium Challenge",  price: 0.50, desc: "Challenge for your Ghost gap." },
];

async function sendUSDC(
  amount: number,
  walletClient: ReturnType<typeof createWalletClient>,
  chainId: number,
): Promise<`0x${string}`> {
  const usdc = USDC_ADDRESS[chainId];
  if (!usdc) throw new Error(`No USDC contract for chainId ${chainId}`);

  const [account] = await walletClient.getAddresses();
  const value = parseUnits(amount.toString(), 6); // USDC has 6 decimals

  const data = encodeFunctionData({
    abi: ERC20_ABI,
    functionName: "transfer",
    args: [RECIPIENT, value],
  });

  const hash = await walletClient.sendTransaction({
    account,
    to: usdc,
    data,
    chain: chainId === 8453 ? base : baseSepolia,
  });

  return hash;
}

export default function PaymentsClient({ currentPlan, x402History }: Props) {
  const { ready, authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [results, setResults]       = useState<Record<string, boolean>>({});
  const [error, setError]           = useState("");

  const isPremium = currentPlan === "premium" || currentPlan === "elite";
  const hasWallet = wallets.length > 0;

  async function handlePayment(featureKey: string, label: string, amount: number) {
    setError("");
    if (!authenticated) { login(); return; }
    if (!hasWallet) return;

    setLoadingKey(featureKey);
    try {
      const wallet   = wallets[0];
      const provider = await wallet.getEthereumProvider();

      const chainIdHex = await provider.request({ method: "eth_chainId" }) as string;
      const chainId    = parseInt(chainIdHex, 16);

      const walletClient = createWalletClient({
        chain: chainId === 8453 ? base : baseSepolia,
        transport: custom(provider),
      });

      // Send USDC onchain
      const txHash = await sendUSDC(amount, walletClient, chainId);

      // Notify our backend to record it
      await fetch("/api/payments/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature_key: featureKey, amount, tx_hash: txHash }),
      });

      setResults(prev => ({ ...prev, [featureKey]: true }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      // User rejected = not an error worth showing loudly
      if (msg.includes("rejected") || msg.includes("denied")) {
        setError("Transaction cancelled.");
      } else {
        setError(`${label}: ${msg}`);
      }
    } finally {
      setLoadingKey(null);
    }
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .pay { padding:32px; display:flex; flex-direction:column; gap:24px; }
        @media(max-width:768px){ .pay{padding:20px 16px;gap:18px} }
        .pay-card { background:var(--graphite); border:1px solid var(--border); border-radius:18px; padding:24px; }
        .pay-premium { background:var(--graphite); border:2px solid var(--vital); border-radius:20px; padding:28px; position:relative; overflow:hidden; animation:fadeUp .5s ease-out .06s both; }
        .pay-premium::before { content:''; position:absolute; top:0; right:0; width:180px; height:180px; background:radial-gradient(circle,rgba(58,102,71,.06) 0%,transparent 70%); pointer-events:none; }
        .pay-price-row { display:flex; align-items:baseline; gap:6px; margin:14px 0 4px; }
        .pay-price-val { font-family:'Barlow Condensed',sans-serif; font-size:3rem; font-weight:800; color:var(--bone); line-height:1; }
        .pay-price-cur { font-family:'JetBrains Mono',monospace; font-size:.7rem; color:var(--vital); letter-spacing:.08em; }
        .pay-price-per { font-family:'JetBrains Mono',monospace; font-size:.6rem; color:var(--ghost); letter-spacing:.08em; text-transform:uppercase; }
        .pay-features { display:flex; flex-direction:column; gap:9px; margin:20px 0 24px; }
        .pay-feat { display:flex; align-items:center; gap:9px; font-size:.85rem; color:var(--ash); }
        .pay-btn { display:flex; align-items:center; justify-content:center; gap:8px; background:var(--vital); color:#f5f2ee; font-family:'Barlow Condensed',sans-serif; font-size:.9rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:14px; border-radius:10px; border:none; cursor:pointer; transition:background .2s; width:100%; }
        .pay-btn:hover { background:var(--vital-bright); }
        .pay-btn:disabled { opacity:.6; cursor:not-allowed; }
        .pay-btn-done { display:flex; align-items:center; justify-content:center; gap:8px; background:transparent; color:var(--ash); font-family:'Barlow Condensed',sans-serif; font-size:.88rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; padding:13px; border-radius:10px; border:1px solid var(--border); width:100%; }
        .usdc-badge { display:inline-flex; align-items:center; gap:6px; background:var(--vital-dim); border:1px solid rgba(58,102,71,.3); border-radius:100px; padding:5px 12px; font-family:'JetBrains Mono',monospace; font-size:.52rem; letter-spacing:.12em; text-transform:uppercase; color:var(--vital); }
        .pay-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:12px; }
        .pay-oneoff { background:var(--graphite); border:1px solid var(--border); border-radius:14px; padding:20px; display:flex; flex-direction:column; gap:8px; transition:border-color .2s,transform .2s; }
        .pay-oneoff:hover { border-color:var(--muted); transform:translateY(-2px); }
        .pay-oneoff-icon { width:34px; height:34px; border-radius:9px; background:var(--vital-dim); border:1px solid rgba(58,102,71,.2); display:flex; align-items:center; justify-content:center; }
        .pay-oneoff-name { font-family:'Barlow Condensed',sans-serif; font-size:.95rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--bone); }
        .pay-oneoff-desc { font-size:.78rem; color:var(--ghost); line-height:1.5; flex:1; }
        .pay-oneoff-foot { display:flex; justify-content:space-between; align-items:center; margin-top:auto; }
        .pay-oneoff-price { font-family:'JetBrains Mono',monospace; font-size:.78rem; color:var(--vital); }
        .pay-oneoff-btn { display:flex; align-items:center; gap:5px; font-family:'Barlow Condensed',sans-serif; font-size:.72rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#f5f2ee; background:var(--vital); border:none; padding:6px 12px; border-radius:6px; cursor:pointer; transition:background .2s; }
        .pay-oneoff-btn:hover { background:var(--vital-bright); }
        .pay-oneoff-btn:disabled { opacity:.6; cursor:not-allowed; }
        .pay-done { background:rgba(58,102,71,.1); border:1px solid rgba(58,102,71,.25); border-radius:8px; padding:8px 12px; font-family:'JetBrains Mono',monospace; font-size:.5rem; color:var(--vital); letter-spacing:.1em; text-transform:uppercase; display:flex; align-items:center; gap:6px; }
        .pay-wallet-banner { background:var(--vital-dim); border:1px solid rgba(58,102,71,.25); border-radius:12px; padding:14px 16px; display:flex; align-items:center; gap:12px; }
        .pay-hist-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); }
        .pay-hist-row:last-child { border-bottom:none; }
        .pay-info { background:var(--obsidian); border:1px solid var(--border); border-radius:12px; padding:14px 16px; display:flex; gap:10px; align-items:flex-start; }
      `}</style>

      <div className="pay">

        {/* Header */}
        <div style={{ animation:"fadeUp .4s ease-out both" }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".52rem", letterSpacing:".14em", textTransform:"uppercase", color:"var(--ghost)", marginBottom:"4px" }}>Payments</div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"2.2rem", fontWeight:800, letterSpacing:".04em", textTransform:"uppercase", color:"var(--bone)", lineHeight:1, marginBottom:"12px" }}>
            Upgrade Access
          </h1>
          <div className="usdc-badge"><Wallet size={11} />Pay with USDC · Privy Wallet</div>
        </div>

        {/* Wallet status */}
        {ready && !authenticated && (
          <div className="pay-wallet-banner">
            <Wallet size={16} color="var(--vital)" style={{ flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:".9rem", fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", color:"var(--bone)", marginBottom:"2px" }}>Connect Wallet</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".5rem", color:"var(--ghost)", textTransform:"uppercase", letterSpacing:".08em" }}>Privy creates a wallet automatically</div>
            </div>
            <button onClick={() => login()} style={{ background:"var(--vital)", color:"#f5f2ee", fontFamily:"'Barlow Condensed',sans-serif", fontSize:".8rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", padding:"9px 16px", borderRadius:"8px", border:"none", cursor:"pointer" }}>
              Connect
            </button>
          </div>
        )}

        {ready && authenticated && hasWallet && (
          <div style={{ background:"rgba(58,102,71,.06)", border:"1px solid rgba(58,102,71,.2)", borderRadius:"10px", padding:"10px 14px", display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"var(--vital)", flexShrink:0 }} />
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".52rem", color:"var(--vital)", letterSpacing:".1em", textTransform:"uppercase" }}>
              {wallets[0]?.address?.slice(0,6)}...{wallets[0]?.address?.slice(-4)} · Wallet Connected
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background:"rgba(184,50,40,.08)", border:"1px solid rgba(184,50,40,.2)", borderRadius:"10px", padding:"12px 14px", display:"flex", alignItems:"center", gap:"8px" }}>
            <AlertCircle size={15} color="var(--signal)" style={{ flexShrink:0 }} />
            <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:".82rem", color:"var(--signal)" }}>{error}</span>
          </div>
        )}

        {/* Premium monthly */}
        <div className="pay-premium">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".52rem", letterSpacing:".14em", textTransform:"uppercase", color:"var(--ghost)", marginBottom:"6px", display:"flex", alignItems:"center", gap:"7px" }}>
                <Crown size={11} color="var(--vital)" />Premium Access
              </div>
              <div className="pay-price-row">
                <span className="pay-price-val">12</span>
                <span className="pay-price-cur">USDC</span>
                <span className="pay-price-per">/ month</span>
              </div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".5rem", color:"var(--ghost)", textTransform:"uppercase", letterSpacing:".08em" }}>
                Direct USDC transfer · Base network
              </div>
            </div>
            {isPremium && (
              <div style={{ background:"var(--vital)", color:"#f5f2ee", fontFamily:"'JetBrains Mono',monospace", fontSize:".48rem", letterSpacing:".12em", textTransform:"uppercase", padding:"5px 10px", borderRadius:"6px" }}>
                Active
              </div>
            )}
          </div>

          <div className="pay-features">
            {PREMIUM_FEATURES.map(f => (
              <div className="pay-feat" key={f}><Check size={13} color="var(--vital)" style={{ flexShrink:0 }} />{f}</div>
            ))}
          </div>

          {isPremium ? (
            <div className="pay-btn-done"><Check size={14} color="var(--vital)" />Premium Active</div>
          ) : !!results["premium_monthly"] ? (
            <div className="pay-done"><Check size={10} />Payment sent — premium activating</div>
          ) : (
            <button className="pay-btn" onClick={() => handlePayment("premium_monthly", "Premium", 12)} disabled={loadingKey === "premium_monthly"}>
              <Wallet size={15} />
              {loadingKey === "premium_monthly" ? "Confirm in wallet..." : !authenticated ? "Connect Wallet" : "Send 12 USDC"}
            </button>
          )}
        </div>

        {/* One-off features */}
        <div style={{ animation:"fadeUp .4s ease-out .18s both" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px" }}>
            <Zap size={16} color="var(--vital)" />
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"1.2rem", fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"var(--bone)" }}>
              Pay-Per-Use
            </div>
            <div style={{ flex:1, height:"1px", background:"var(--border)" }} />
          </div>
          <div className="pay-grid">
            {X402_ONEOFFS.map(f => (
              <div className="pay-oneoff" key={f.key}>
                <div className="pay-oneoff-icon"><f.icon size={15} color="var(--vital)" /></div>
                <div className="pay-oneoff-name">{f.label}</div>
                <div className="pay-oneoff-desc">{f.desc}</div>
                <div className="pay-oneoff-foot">
                  <span className="pay-oneoff-price">{f.price} USDC</span>
                  <button className="pay-oneoff-btn" onClick={() => handlePayment(f.key, f.label, f.price)} disabled={!!loadingKey}>
                    <Lock size={10} />{loadingKey === f.key ? "..." : "Unlock"}
                  </button>
                </div>
                {!!results[f.key] && <div className="pay-done"><Check size={10} />Payment sent</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="pay-info">
          <ExternalLink size={15} color="var(--ghost)" style={{ flexShrink:0, marginTop:"1px" }} />
          <div style={{ fontFamily:"'Barlow',sans-serif", fontSize:".82rem", color:"var(--ghost)", lineHeight:1.6 }}>
            Direct USDC transfer on Base. Your wallet signs a standard ERC-20 transfer — no protocol overhead.
            Need USDC? <a href="https://faucet.circle.com" target="_blank" rel="noopener noreferrer" style={{ color:"var(--vital)", textDecoration:"none" }}>faucet.circle.com</a> for testnet.
          </div>
        </div>

        {/* History */}
        {x402History.length > 0 && (
          <div className="pay-card">
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".52rem", letterSpacing:".14em", textTransform:"uppercase", color:"var(--ghost)", marginBottom:"14px", display:"flex", alignItems:"center", gap:"8px" }}>
              <Clock size={11} />Payment History
            </div>
            {x402History.map((p, i) => (
              <div className="pay-hist-row" key={i}>
                <div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:".9rem", fontWeight:600, letterSpacing:".06em", textTransform:"uppercase", color:"var(--bone)" }}>
                    {p.feature_key.replace(/_/g, " ")}
                  </div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".46rem", color:"var(--ghost)", marginTop:"2px" }}>
                    {new Date(p.created_at).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })}
                  </div>
                </div>
                <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".58rem", color:"var(--vital)" }}>{p.amount} USDC</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".46rem", textTransform:"uppercase", letterSpacing:".08em", padding:"2px 7px", border:"1px solid", borderRadius:"4px", color: p.status === "completed" ? "#3a6647" : "var(--ghost)", borderColor: p.status === "completed" ? "rgba(58,102,71,.35)" : "var(--border)" }}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
