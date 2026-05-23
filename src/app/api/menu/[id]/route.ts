import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { verifyAuth, unauthorized } from "@/lib/auth-utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => (getSupabase()?.from("menu_items") as any);

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!getSupabase()) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { id } = await params;
    const { data, error } = await db().select("*").eq("id", id).single();
    if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      id: data.id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      image: data.image,
      popular: data.popular,
      discountPercent: data.discount_percent || 0,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await verifyAuth(request))) return unauthorized();
    if (!getSupabase()) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { id } = await params;
    const body = await request.json();
    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.price !== undefined) updates.price = Number(body.price);
    if (body.category !== undefined) updates.category = body.category;
    if (body.image !== undefined) updates.image = body.image;
    if (body.popular !== undefined) updates.popular = Boolean(body.popular);
    if (body.discountPercent !== undefined) updates.discount_percent = Number(body.discountPercent);
    updates.updated_at = new Date().toISOString();
    const { error } = await db().update(updates).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await verifyAuth(request))) return unauthorized();
    if (!getSupabase()) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { id } = await params;
    const { error } = await db().delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
