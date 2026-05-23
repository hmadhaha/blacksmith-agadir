"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, UtensilsCrossed, Star, CalendarCheck, MessageSquare, Loader2 } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from "recharts";

const COLORS = ["#10b981", "#d97706", "#ea580c", "#ca8a04", "#dc2626", "#06b6d4", "#ec4899", "#8b5cf6", "#14b8a6", "#f97316"];

export default function AnalyticsPage() {
  const [menuItems, setMenuItems] = useState<{ category: string }[]>([]);
  const [reviews, setReviews] = useState<{ rating: number; created_at: string }[]>([]);
  const [reservations, setReservations] = useState<{ date: string; time: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/menu").then(r => r.json()).catch(() => []),
      fetch("/api/reviews").then(r => r.json()).catch(() => []),
      fetch("/api/reservations").then(r => r.json()).catch(() => []),
    ]).then(([menu, revs, resvs]) => {
      setMenuItems(Array.isArray(menu) ? menu : []);
      setReviews(Array.isArray(revs) ? revs : []);
      setReservations(Array.isArray(resvs) ? resvs : []);
    }).finally(() => setLoading(false));
  }, []);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  const catCount = new Map<string, number>();
  menuItems.forEach(i => catCount.set(i.category, (catCount.get(i.category) || 0) + 1));
  const categoryDist = [...catCount.entries()].map(([name, value], idx) => ({ name, value, color: COLORS[idx % COLORS.length] }));

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyData = days.map(day => ({ day, count: 0 }));
  reservations.forEach(r => {
    try {
      const d = new Date(r.date);
      const dayIdx = d.getDay();
      weeklyData[dayIdx].count++;
    } catch {}
  });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const ratingByMonth = new Map<string, { sum: number; count: number }>();
  reviews.forEach(r => {
    try {
      const d = new Date(r.created_at);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      const entry = ratingByMonth.get(key) || { sum: 0, count: 0 };
      entry.sum += r.rating;
      entry.count++;
      ratingByMonth.set(key, entry);
    } catch {}
  });
  const ratingTrend = [...ratingByMonth.entries()].map(([month, data]) => ({
    month,
    rating: Number((data.sum / data.count).toFixed(2)),
  }));

  const totalReservations = reservations.length;
  const totalReviews = reviews.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold mb-1">Analytics</h1>
        <p className="text-muted-foreground mb-8">Real-time insights from your data</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Menu Items", value: String(menuItems.length), icon: UtensilsCrossed },
          { label: "Reservations", value: String(totalReservations), icon: CalendarCheck },
          { label: "Avg Rating", value: avgRating, icon: Star },
          { label: "Reviews", value: String(totalReviews), icon: MessageSquare },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <stat.icon className="size-4 text-primary" />
            </div>
            <p className="text-xl font-heading font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-heading font-semibold text-sm mb-4">Reservations by Day of Week</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "13px" }} />
              <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="url(#resGrad)" strokeWidth={2} name="Reservations" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-heading font-semibold text-sm mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryDist.length > 0 ? categoryDist : [{ name: "No data", value: 1, color: "#888" }]}
                cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value"
              >
                {(categoryDist.length > 0 ? categoryDist : [{ name: "No data", value: 1, color: "#888" }]).map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "13px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {categoryDist.map((c) => (
              <span key={c.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-2.5 rounded-full" style={{ background: c.color }} />
                {c.name} ({c.value})
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-heading font-semibold text-sm mb-4">Rating Trend</h3>
          {ratingTrend.length === 0 ? (
            <div className="flex items-center justify-center h-[220px] text-sm text-muted-foreground">No review data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={ratingTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "13px" }} />
                <Line type="monotone" dataKey="rating" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 4 }} name="Rating" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-heading font-semibold text-sm mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {totalReviews > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <Star className="size-4 text-yellow-500 shrink-0" />
                <span className="text-muted-foreground">{totalReviews} review{totalReviews !== 1 ? "s" : ""} · <span className="text-foreground font-medium">{avgRating}</span> avg</span>
              </div>
            )}
            {totalReservations > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <CalendarCheck className="size-4 text-blue-500 shrink-0" />
                <span className="text-muted-foreground">{totalReservations} reservation{totalReservations !== 1 ? "s" : ""} total</span>
              </div>
            )}
            {menuItems.length > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <UtensilsCrossed className="size-4 text-primary shrink-0" />
                <span className="text-muted-foreground">{menuItems.length} menu item{menuItems.length !== 1 ? "s" : ""} · <span className="text-foreground font-medium">{categoryDist.length}</span> categories</span>
              </div>
            )}
            {totalReviews === 0 && totalReservations === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No activity yet. Start by adding menu items and collecting reviews!</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
