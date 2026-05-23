import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { verifyAuth, unauthorized } from "@/lib/auth-utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (getSupabase()?.from("reservations") as any);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { error } = await db().insert({
      name: body.name,
      email: body.email || "",
      phone: body.phone || "",
      guests: Number(body.guests) || 2,
      date: body.date,
      time: body.time,
      status: "pending",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, message: "Reservation received" });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(request: Request) {
  try {
    if (!(await verifyAuth(request))) return unauthorized();
    const { data, error } = await db().select("*").order("date", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await verifyAuth(request))) return unauthorized();
    const { id, status } = await request.json();
    const { error } = await db().update({ status }).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
