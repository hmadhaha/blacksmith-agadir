import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (getSupabase()?.from("settings") as any);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key") || "general";
    const { data, error } = await db().select("*").eq("key", key).single();
    if (error) return NextResponse.json(error.message === "No rows" ? {} : { error: error.message }, { status: error.message === "No rows" ? 200 : 500 });
    return NextResponse.json(data?.value || {});
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key") || "general";
    const body = await request.json();
    const { error } = await db().upsert({ key, value: body }, { onConflict: "key" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
