"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save, Loader2, Lock, Eye, EyeOff, Mail } from "lucide-react";

const defaults = {
  name: "The Blacksmith",
  email: "info@blacksmith-agadir.com",
  phone: "+212 8086 00401",
  address: "2 Rue des Orangers, Agadir 80000",
  openingHours: "8:30 AM - 1:00 AM",
  instagram: "instagram.com/blacksmithagadir",
};

export default function DashboardSettingsPage() {
  const [settings, setSettings] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [curPassword, setCurPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.name) setSettings(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!curPassword || !newPassword) {
      toast.error("Fill in both fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setChangingPw(true);
    try {
      const authRes = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: curPassword }),
      });
      const authData = await authRes.json();
      if (!authData.success) {
        toast.error("Current password is wrong");
        return;
      }
      const res = await fetch("/api/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      if (res.ok) {
        toast.success("Password changed!");
        setCurPassword("");
        setNewPassword("");
      } else {
        toast.error("Failed to change password");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setChangingPw(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your restaurant information</p>
      </div>

      <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-heading font-semibold">Restaurant Info</h2>
        <div className="space-y-2">
          <label className="text-sm font-medium">Restaurant Name</label>
          <Input value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Address</label>
          <Input value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Opening Hours</label>
            <Input value={settings.openingHours} onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Instagram</label>
            <Input value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} />
          </div>
        </div>
        <Button type="submit" className="w-full sm:w-auto" disabled={saving}>
          <Save className="mr-2 size-4" /> {saving ? "Saving..." : "Save Settings"}
        </Button>
      </form>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-heading font-semibold flex items-center gap-2">
          <Lock className="size-4 text-primary" /> Dashboard Password
        </h2>
        <p className="text-sm text-muted-foreground">Change the password used to access the dashboard.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <div className="relative">
              <Input type={showPw ? "text" : "password"} value={curPassword} onChange={(e) => setCurPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" />
          </div>
        </div>
        <Button variant="default" onClick={handleChangePassword} disabled={changingPw || !curPassword || !newPassword}>
          <Lock className="mr-2 size-4" /> {changingPw ? "Changing..." : "Change Password"}
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-heading font-semibold flex items-center gap-2">
          <Mail className="size-4 text-primary" /> Email Reset Link
        </h2>
        <p className="text-sm text-muted-foreground">
          Send a password reset link to <strong>{settings.email || "your configured email"}</strong>.
          You need a Resend API key (<code>RESEND_API_KEY</code>) set in Vercel environment variables for email delivery.
        </p>
        <Button variant="outline" onClick={async () => {
          const res = await fetch("/api/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
          const data = await res.json();
          if (data.success && data.emailed) toast.success("Reset link sent to your email!");
          else if (data.resetUrl) toast.success(`Use this link: ${data.resetUrl}`, { duration: 15000 });
          else toast.error(data.error || "Failed");
        }}>
          <Mail className="mr-2 size-4" /> Send Reset Link
        </Button>
      </div>
    </div>
  );
}
