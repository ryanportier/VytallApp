import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { feature_key, amount, tx_hash } = await req.json();

    await supabase.from("x402_payments").insert({
      user_id: user.id,
      feature_key,
      amount,
      status: "completed",
      tx_hash,
    });

    // If premium monthly, also upsert subscription
    if (feature_key === "premium_monthly") {
      await supabase.from("subscriptions").upsert({
        user_id: user.id,
        stripe_customer_id: `usdc_${user.id}`,
        stripe_subscription_id: `usdc_${tx_hash}`,
        plan: "premium",
        status: "active",
      }, { onConflict: "user_id" });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Payments Record]", err);
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }
}
