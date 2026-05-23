import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export async function POST(request: Request) {
  try {
    const body = await request.json();
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "No DB" }, { status: 500 });

  if (body.token) {
    const { data } = await supabase.from("settings").select("value").eq("key", "reset_token").single();
    if (!data?.value?.token || data.value.token !== body.token) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }
    if (data.value.expires < Date.now()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }
    if (!body.password || body.password.length < 6) {
      return NextResponse.json({ error: "Password too short" }, { status: 400 });
    }
    await supabase.from("settings").upsert({ key: "password", value: body.password }, { onConflict: "key" });
    await supabase.from("settings").upsert({ key: "reset_token", value: null }, { onConflict: "key" });
    return NextResponse.json({ success: true, message: "Password updated" });
  }

  const { data: settingsData } = await supabase.from("settings").select("value").eq("key", "general").single();
  const email = settingsData?.value?.email || body.email;
  if (!email) return NextResponse.json({ error: "No email configured" }, { status: 400 });

  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  await supabase.from("settings").upsert({
    key: "reset_token",
    value: { token, expires: Date.now() + 3600000 },
  }, { onConflict: "key" });

  const resetUrl = `${BASE_URL}/reset-password?token=${token}`;

  const resendKey = process.env.RESEND_API_KEY;
  let emailed = false;
  if (resendKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "The Blacksmith <onboarding@resend.dev>",
          to: email,
          subject: "Dashboard Password Reset",
          html: `<p>Click <a href="${resetUrl}">here</a> to reset your dashboard password. This link expires in 1 hour.</p>`,
        }),
      });
      emailed = true;
    } catch {}
  }

  return NextResponse.json({
    success: true,
    emailed,
    message: emailed ? "Reset link sent to your email" : "No email service configured. Use the link below:",
    resetUrl: emailed ? null : resetUrl,
  });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
