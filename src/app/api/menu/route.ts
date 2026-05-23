import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { verifyAuth, unauthorized } from "@/lib/auth-utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (getSupabase()?.from("menu_items") as any);

export async function GET() {
  try {
    const { data, error } = await db().select("*").order("id");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const items = (data || []).map((i: Record<string, unknown>) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      price: Number(i.price),
      category: i.category,
      image: i.image,
      popular: i.popular,
      discountPercent: i.discount_percent || 0,
    }));
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await verifyAuth(request))) return unauthorized();
    if (!getSupabase()) return NextResponse.json({ error: "No DB" }, { status: 500 });
    const body = await request.json();
    const newItem = {
      id: String(Date.now()),
      name: body.name || "New Item",
      description: body.description || "",
      price: Number(body.price) || 0,
      category: body.category || "Starters",
      image: body.image || null,
      popular: Boolean(body.popular),
      discount_percent: Number(body.discountPercent) || 0,
    };
    const { error } = await db().insert(newItem);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, item: { ...newItem, discountPercent: newItem.discount_percent } });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
