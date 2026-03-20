import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { adminAuth } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("firebase-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    const supabase = await createServiceClient();

    const { data } = await supabase
      .from("users")
      .select("name, goal, level")
      .eq("id", decoded.uid)
      .single();

    return NextResponse.json(data ?? {});
  } catch {
    return NextResponse.json({});
  }
}
