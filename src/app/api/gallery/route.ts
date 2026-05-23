import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (getSupabase()?.from("settings") as any);

export async function GET() {
  const { data, error } = await db().select("value").eq("key", "gallery").single();
  if (error) return NextResponse.json([]);
  return NextResponse.json(data?.value || []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data: existing } = await db().select("value").eq("key", "gallery").single();
  const items = existing?.value || [];
  items.push(body);
  const { error } = await db().upsert({ key: "gallery", value: items }, { onConflict: "key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { data: existing } = await db().select("value").eq("key", "gallery").single();
  const items = (existing?.value || []).filter((item: { id: string }) => item.id !== id);
  const { error } = await db().upsert({ key: "gallery", value: items }, { onConflict: "key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
