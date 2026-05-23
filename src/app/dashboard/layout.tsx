"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tags,
  CalendarCheck,
  Images,
  Settings,
  LogOut,
  Menu,
  BarChart3,
  Tag,
  MessageSquare,
  Mail,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/menu", label: "Menu Items", icon: UtensilsCrossed },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/discounts", label: "Discounts", icon: Tag },
  { href: "/dashboard/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/dashboard/messages", label: "Messages", icon: Mail },
  { href: "/dashboard/categories", label: "Categories", icon: Tags },
  { href: "/dashboard/reservations", label: "Reservations", icon: CalendarCheck },
  { href: "/dashboard/gallery", label: "Gallery", icon: Images },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("bs-auth");
    if (token) {
      fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", token }),
      }).then((r) => {
        if (r.ok) setAuthenticated(true);
        else sessionStorage.removeItem("bs-auth");
      }).catch(() => {
        setAuthenticated(true);
      }).finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("bs-auth", data.token);
        setAuthenticated(true);
      } else {
        setLoginError("Wrong password");
      }
    } catch {
      setLoginError("Login failed");
    }
  };

  if (checking) return null;

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="size-8 text-primary" />
            </div>
            <h1 className="text-xl font-heading font-bold">Dashboard Access</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-11 rounded-xl border border-input bg-transparent px-4 text-sm outline-none focus-visible:border-ring transition-colors"
              autoFocus
            />
            {loginError && <p className="text-sm text-destructive text-center">{loginError}</p>}
            <Button type="submit" className="w-full h-11 rounded-xl" disabled={!password}>
              <Lock className="size-4 mr-2" /> Unlock Dashboard
            </Button>
          </form>
          <div className="mt-4 text-center space-y-1">
            <Link href="/reset-password" className="text-xs text-muted-foreground hover:text-foreground transition-colors block">
              Forgot password?
            </Link>
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors block">
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-16 lg:pt-20">
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <Button size="icon" className="size-12 rounded-full shadow-lg" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="size-5" />
        </Button>
      </div>

      <aside className={cn(
        "fixed left-0 top-16 lg:top-20 z-30 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] w-64 bg-card border-r border-border transition-transform duration-300 flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-4 border-b border-border shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Logo" className="h-7 w-auto rounded" />
            <div>
              <h2 className="font-heading font-bold text-sm">Dashboard</h2>
              <p className="text-[10px] text-muted-foreground">The Blacksmith</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <link.icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border space-y-1 shrink-0">
          <button
            onClick={() => { sessionStorage.removeItem("bs-auth"); setAuthenticated(false); }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <LogOut className="size-4" /> Lock Dashboard
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <LogOut className="size-4" /> Back to Site
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="lg:pl-64">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
