# VYTALL — MVP

> Train your full self.

Memory-driven AI vitality app · Next.js 16 · Supabase · Claude API · x402

---

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill in your keys in .env.local
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Setup

### 1. Supabase
- Create project at supabase.com
- Run `supabase-schema.sql` in SQL Editor
- Go to Authentication → Providers → Email → disable "Confirm email"
- Copy URL + anon key to `.env.local`

### 2. Anthropic
- Get API key at console.anthropic.com
- Add to `.env.local`

### 3. x402 (optional — for premium features)
- Get a wallet address (MetaMask, Coinbase Wallet)
- For testnet: use `https://x402.org/facilitator` (no signup)
- For mainnet: create CDP keys at portal.cdp.coinbase.com
- Add wallet address to `.env.local`

---

## Stack
- **Framework**: Next.js 16, TypeScript, App Router, Turbopack
- **Database**: Supabase Postgres + RLS
- **Auth**: Supabase Auth
- **AI**: Anthropic Claude (claude-sonnet-4-5)
- **Payments**: x402 protocol (USDC on Base)
- **UI**: Tailwind CSS + Lucide React

## Pages
| Route | Description |
|---|---|
| `/` | Landing page |
| `/pricing` | Pricing |
| `/about` | About |
| `/login` | Login |
| `/signup` | Signup |
| `/app` | Dashboard |
| `/app/check-in` | Daily check-in → AI mission |
| `/app/mission` | Today's prescription |
| `/app/workouts` | Workout logging + AI reflection |
| `/app/archive` | Training narrative timeline |
| `/app/ghost` | Ghost comparison engine |
| `/app/profile` | Profile |
| `/app/payments` | x402 payments |
