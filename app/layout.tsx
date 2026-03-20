import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VYTALL",
  description:
    "A memory-driven AI vitality system that studies your patterns, interprets your daily state, and helps you train against the strongest version of yourself.",
  keywords: ["vitality", "fitness", "AI training", "workout tracker"],
  authors: [{ name: "VYTALL" }],
  openGraph: {
    title: "VYTALL — Train your full self.",
    description: "Memory-driven AI vitality system.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f5f2ee",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
