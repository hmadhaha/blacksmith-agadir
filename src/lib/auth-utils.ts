import { NextResponse } from "next/server";
import { getSupabase } from "./supabase";

export async function verifyAuth(request: Request): Promise<boolean> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);

  const supabase = getSupabase();
  if (!supabase) return false;

  const { data } = await supabase.from("settings").select("value").eq("key", "auth_token").single();
  if (!data?.value) return false;

  const stored = data.value as { token: string; expires: number };
  if (stored.token !== token) return false;
  if (Date.now() > stored.expires) return false;

  return true;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
