import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { verifyAuth, unauthorized } from "@/lib/auth-utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (getSupabase()?.from("settings") as any);

export async function GET() {
  try {
    const { data, error } = await db().select("value").eq("key", "categories").single();
    if (error) return NextResponse.json([]);
    return NextResponse.json(data?.value || []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    if (!(await verifyAuth(request))) return unauthorized();
    const body = await request.json();
    const { data: existing } = await db().select("value").eq("key", "categories").single();
    const items = existing?.value || [];
    items.push(body);
    const { error } = await db().upsert({ key: "categories", value: items }, { onConflict: "key" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await verifyAuth(request))) return unauthorized();
    const body = await request.json();
    const { error } = await db().upsert({ key: "categories", value: body }, { onConflict: "key" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
