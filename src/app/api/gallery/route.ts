import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = (t?: string) => (getSupabase()?.from(t || "settings") as any);

export async function GET() {
  const supabase = getSupabase();
  const galleryItems: { id: string; title: string; category: string; type: string; src: string; url?: string }[] = [];

  // Fetch manual gallery uploads
  const { data: galleryData } = await db().select("value").eq("key", "gallery").single();
  if (galleryData?.value) {
    for (const item of (galleryData.value as { id: string; title: string; category: string; type: string; url?: string }[])) {
      galleryItems.push({
        id: item.id,
        title: item.title,
        category: item.category,
        type: item.type,
        src: (item as { src?: string; url?: string }).src || item.url || "",
        url: item.url,
      });
    }
  }

  // Fetch menu items with images as gallery entries
  if (supabase) {
    const { data: menuItems } = await supabase.from("menu_items").select("id, name, image").not("image", "is", null);
    if (menuItems) {
      for (const item of menuItems) {
        const exists = galleryItems.some(g => g.title === item.name);
        if (!exists && item.image) {
          const src = item.image.startsWith("data:") || item.image.startsWith("http") || item.image.startsWith("/")
            ? item.image
            : "/food/" + encodeURIComponent(item.image);
          galleryItems.push({
            id: "menu-" + item.id,
            title: item.name,
            category: "Food",
            type: "image",
            src,
          });
        }
      }
    }
  }

  return NextResponse.json(galleryItems);
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
