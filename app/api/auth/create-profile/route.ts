import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// Called after Firebase signup to create the Supabase user profile
export async function POST(req: NextRequest) {
  try {
    const { uid, email } = await req.json();
    if (!uid || !email) return NextResponse.json({ error: "Missing uid or email" }, { status: 400 });

    const supabase = await createServiceClient();

    // Check if profile already exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("id", uid)
      .single();

    if (!existing) {
      await supabase.from("users").insert({
        id: uid, // use Firebase UID as the Supabase user ID
        email,
        name: "",
        goal: "",
        level: "beginner",
        equipment: [],
        session_preference: 45,
        days_per_week: 4,
        restrictions: "",
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Create Profile]", err);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}
