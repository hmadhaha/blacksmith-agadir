import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, action, token } = body;

    if (action === "verify") {
      if (!token) return NextResponse.json({ success: false, error: "Token required" }, { status: 400 });
      const supabase = getSupabase();
      if (supabase) {
        const { data } = await supabase.from("settings").select("value").eq("key", "auth_token").single();
        if (data?.value?.token === token && data.value.expires > Date.now()) {
          return NextResponse.json({ success: true });
        }
      }
      return NextResponse.json({ success: false }, { status: 401 });
    }

    if (!password) {
      return NextResponse.json({ success: false, error: "Password required" }, { status: 400 });
    }

    const envPassword = process.env.DASHBOARD_PASSWORD;

    let dbPassword: string | null = null;
    const supabase = getSupabase();
    if (supabase) {
      const { data } = await supabase.from("settings").select("value").eq("key", "password").single();
      if (data?.value) dbPassword = data.value;
    }

    const validPassword = dbPassword || envPassword;

    if (!validPassword) {
      return NextResponse.json({ success: false, error: "No password configured. Set DASHBOARD_PASSWORD env var or save one in Settings." }, { status: 500 });
    }

    if (password === validPassword) {
      const token = crypto.randomUUID();
      const supabase = getSupabase();
      if (supabase) {
        await supabase.from("settings").upsert({
          key: "auth_token",
          value: { token, expires: Date.now() + 86400000 },
        }, { onConflict: "key" });
      }
      return NextResponse.json({ success: true, token });
    }
    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
