import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/app/onboarding");

  // Fetch stats
  const { count: totalCheckins } = await supabase
    .from("daily_checkins")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: totalWorkouts } = await supabase
    .from("workouts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("completion_status", "completed");

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .single();

  const memberSince = new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" });

  return (
    <ProfileClient
      profile={profile}
      email={user.email ?? ""}
      stats={{ totalCheckins: totalCheckins ?? 0, totalWorkouts: totalWorkouts ?? 0, memberSince }}
      subscription={subscription ?? null}
    />
  );
}
