import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (getSupabase()?.from("reviews") as any);

export async function GET() {
  try {
    const { data, error } = await db().select("*").order("id", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { error } = await db().insert({
      author: body.author,
      rating: body.rating,
      text: body.text,
      source: body.source || "Website",
      date: body.date || new Date().toLocaleDateString(),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
