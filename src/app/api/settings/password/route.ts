import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function PUT(request: Request) {
  try {
    const { password } = await request.json();
  if (!password || password.length < 6) {
    return NextResponse.json({ error: "Password too short" }, { status: 400 });
  }
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "No DB" }, { status: 500 });
  const { error } = await supabase.from("settings").upsert({ key: "password", value: password }, { onConflict: "key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
