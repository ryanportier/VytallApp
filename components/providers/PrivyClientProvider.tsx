"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import { base, baseSepolia } from "viem/chains"; // type-only import for chain config

// We use baseSepolia for testnet, base for mainnet
// Switch based on X402_NETWORK env var
const isMainnet = process.env.NEXT_PUBLIC_X402_NETWORK === "eip155:8453";

export default function PrivyClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#3a6647",
          logo: undefined,
          landingHeader: "Connect your wallet",
          loginMessage: "Connect to make payments in USDC",
        },
        embeddedWallets: {
          ethereum: {
            // Auto-create an embedded wallet for every user
            createOnLogin: "users-without-wallets",
          },
        },
        // Support both testnet and mainnet
        defaultChain: isMainnet ? base : baseSepolia,
        supportedChains: [base, baseSepolia],
        // Login methods — wallet only for payments
        loginMethods: ["wallet", "email"],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
