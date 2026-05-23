"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setMsg("Passwords don't match"); return; }
    if (password.length < 6) { setMsg("At least 6 characters"); return; }
    setStatus("sending");
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("done");
        setMsg("Password changed! Redirecting to dashboard...");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setStatus("error");
        setMsg(data.error || "Failed");
      }
    } catch { setStatus("error"); setMsg("Network error"); }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center">
          <AlertCircle className="size-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-heading font-bold mb-2">Invalid Link</h1>
          <p className="text-sm text-muted-foreground mb-6">This reset link is invalid or expired.</p>
          <Link href="/dashboard" className="text-sm text-primary hover:underline">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center">
          <CheckCircle className="size-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-heading font-bold mb-2">Password Changed</h1>
          <p className="text-sm text-muted-foreground">{msg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <Lock className="size-10 text-primary mx-auto mb-3" />
          <h1 className="text-xl font-heading font-bold">Reset Password</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your new dashboard password</p>
        </div>
        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <div className="relative">
              <input type={show ? "text" : "password"} value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 rounded-xl border border-input bg-transparent px-4 text-sm outline-none focus-visible:border-ring transition-colors"
                placeholder="Min 6 characters"
              />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <input type={show ? "text" : "password"} value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full h-11 rounded-xl border border-input bg-transparent px-4 text-sm outline-none focus-visible:border-ring transition-colors"
              placeholder="Repeat password"
            />
          </div>
          {msg && <p className={`text-sm ${status === "error" ? "text-destructive" : "text-muted-foreground"}`}>{msg}</p>}
          <Button type="submit" className="w-full h-11 rounded-xl" disabled={status === "sending" || !password || !confirm}>
            {status === "sending" ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4 bg-muted/30"><div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>}>
      <ResetForm />
    </Suspense>
  );
}
