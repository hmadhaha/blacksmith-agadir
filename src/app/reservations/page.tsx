"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CalendarDays, Clock, Users, CalendarCheck } from "lucide-react";

export default function ReservationsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Reservation request submitted! We'll confirm shortly.");
        setForm({ name: "", email: "", phone: "", date: "", time: "", guests: "2", notes: "" });
      } else {
        toast.error("Failed to submit. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-card border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 px-3 py-1">Reservations</Badge>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-6xl font-heading font-bold mb-4">
            Book Your <span className="text-primary">Table</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground max-w-xl mx-auto text-lg">
            Reserve your spot at Agadir&apos;s most beloved dining destination
          </motion.p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                  <CalendarCheck className="size-5 text-primary" /> Important Info
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    { icon: Clock, text: "Open daily 8:30 AM - 1:00 AM" },
                    { icon: Users, text: "Tables for 2-8 guests" },
                    { icon: CalendarDays, text: "Reserve up to 30 days in advance" },
                  ].map((item) => (
                    <li key={item.text} className="flex items-center gap-3">
                      <item.icon className="size-4 text-primary shrink-0" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-heading font-semibold mb-2">Need a larger party?</h3>
                <p className="text-sm text-muted-foreground mb-4">For groups of 8+ or private events, please call us directly.</p>
                <a href="tel:+212808600401" className="inline-flex items-center justify-center w-full rounded-lg border border-border bg-background hover:bg-muted px-4 py-2 text-sm font-medium transition-all">
                  Call +212 8086 00401
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-4">
                <h2 className="text-2xl font-heading font-bold mb-2">Reservation Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name *</label>
                    <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone *</label>
                    <Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+212 XXX XXX XXX" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Guests *</label>
                    <select
                      required
                      value={form.guests}
                      onChange={(e) => setForm({ ...form, guests: e.target.value })}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date *</label>
                    <Input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time *</label>
                    <Input required type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Special Requests</label>
                  <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Allergies, celebrations, seating preferences..." rows={3} />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  <CalendarCheck className="mr-2 size-4" /> {submitting ? "Submitting..." : "Confirm Reservation"}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
