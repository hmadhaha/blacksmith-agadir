"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, UtensilsCrossed, CalendarCheck, Star, MessageSquare, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [menuCount, setMenuCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [avgRating, setAvgRating] = useState("4.7");
  const [reservations, setReservations] = useState<{ name: string; guests: number; date: string; time: string; status: string }[]>([]);
  const [discountCount, setDiscountCount] = useState(0);

  useEffect(() => {
    fetch("/api/menu").then(r => r.json()).then(d => {
      if (Array.isArray(d)) {
        setMenuCount(d.length);
        setDiscountCount(d.filter((i: { discountPercent: number }) => i.discountPercent > 0).length);
      }
    }).catch(() => {});

    fetch("/api/reviews").then(r => r.json()).then(d => {
      if (Array.isArray(d) && d.length > 0) {
        setReviewCount(d.length);
        setAvgRating((d.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / d.length).toFixed(1));
      }
    }).catch(() => {});

    fetch("/api/reservations").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setReservations(d.slice(0, 5));
    }).catch(() => {});
  }, []);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground mb-8">Welcome back! Here&apos;s your restaurant overview.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Menu Items", value: String(menuCount), change: `${discountCount} on sale`, icon: UtensilsCrossed, href: "/dashboard/menu" },
          { label: "Reservations", value: String(reservations.length), change: "Latest bookings", icon: CalendarCheck, href: "/dashboard/reservations" },
          { label: "Avg Rating", value: avgRating, change: `${reviewCount} reviews`, icon: Star, href: "/dashboard/reviews" },
          { label: "Discounts", value: String(discountCount), change: "Active offers", icon: TrendingUp, href: "/dashboard/discounts" },
        ].map((stat, i) => (
          <Link key={stat.label} href={stat.href}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <stat.icon className="size-4 text-primary" />
              </div>
              <p className="text-xl font-heading font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">{stat.change}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold">Recent Reservations</h2>
            <Link href="/dashboard/reservations" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          {reservations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No reservations yet</p>
          ) : (
            <div className="space-y-2">
              {reservations.map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.guests} guests · {r.time}</p>
                  </div>
                  <Badge variant={r.status === "confirmed" ? "default" : r.status === "cancelled" ? "destructive" : "secondary"} className="text-[10px] px-1.5 py-0">
                    {r.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Add Menu Item", href: "/dashboard/menu", icon: UtensilsCrossed, desc: "Create new dish" },
              { label: "Manage Discounts", href: "/dashboard/discounts", icon: TrendingUp, desc: "Set promotions" },
              { label: "View Reviews", href: "/dashboard/reviews", icon: MessageSquare, desc: "Read feedback" },
              { label: "Reservations", href: "/dashboard/reservations", icon: CalendarCheck, desc: "Manage bookings" },
            ].map((action) => (
              <Link key={action.label} href={action.href}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-secondary/30 transition-all text-center"
              >
                <action.icon className="size-5 text-primary" />
                <span className="text-xs font-medium">{action.label}</span>
                <span className="text-[10px] text-muted-foreground">{action.desc}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
