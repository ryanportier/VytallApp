import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("video") as File;
    const exercise = formData.get("exercise") as string;
    const workoutId = formData.get("workout_id") as string | null;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Validate file type
    if (!file.type.startsWith("video/")) {
      return NextResponse.json({ error: "File must be a video" }, { status: 400 });
    }

    // Max 100MB
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 100MB)" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() ?? "mp4";
    const path = `${user.id}/${Date.now()}-${exercise}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from("workout-videos")
      .upload(path, buffer, { contentType: file.type });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("workout-videos")
      .getPublicUrl(path);

    // Create video analysis record (Phase 2: MediaPipe will fill scores)
    const { data: analysis } = await supabase
      .from("video_analyses")
      .insert({
        user_id: user.id,
        workout_id: workoutId ?? null,
        exercise_name: exercise,
        video_url: publicUrl,
        technique_score: null,
        tempo_score: null,
        rom_score: null,
        stability_score: null,
        corrections: [],
      })
      .select()
      .single();

    return NextResponse.json({
      analysis_id: analysis?.id,
      video_url: publicUrl,
      status: "uploaded",
      message: "Video uploaded. Movement analysis available in Phase 2.",
    });
  } catch (err) {
    console.error("[Video Upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
