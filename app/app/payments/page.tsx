import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PaymentsClient from "./PaymentsClient";

export default async function PaymentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: x402Payments } = await supabase
    .from("x402_payments")
    .select("feature_key, amount, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const hasPremium = x402Payments?.some(
    p => p.feature_key === "premium_monthly" && p.status === "completed"
  ) ?? false;

  return (
    <PaymentsClient
      currentPlan={hasPremium ? "premium" : "free"}
      x402History={x402Payments ?? []}
    />
  );
}
