"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  status: string;
}

export default function DashboardReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const res = await fetch("/api/reservations");
      const data = await res.json();
      setReservations(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReservations(); }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      toast.success(`Reservation ${status}`);
      fetchReservations();
    } catch { toast.error("Failed to update"); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Reservations</h1>
          <p className="text-sm text-muted-foreground">{reservations.length} bookings</p>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchReservations}><RefreshCw className="size-3.5 mr-1" /> Refresh</Button>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>No reservations yet</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 text-sm font-medium">Guest</th>
                <th className="text-left p-4 text-sm font-medium">Contact</th>
                <th className="text-left p-4 text-sm font-medium">Date</th>
                <th className="text-left p-4 text-sm font-medium">Time</th>
                <th className="text-left p-4 text-sm font-medium">Guests</th>
                <th className="text-left p-4 text-sm font-medium">Status</th>
                <th className="text-left p-4 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-sm font-medium">{r.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    <div>{r.email}</div>
                    <div>{r.phone}</div>
                  </td>
                  <td className="p-4 text-sm">{r.date}</td>
                  <td className="p-4 text-sm">{r.time}</td>
                  <td className="p-4 text-sm">{r.guests}</td>
                  <td className="p-4">
                    <Badge variant={r.status === "confirmed" ? "default" : r.status === "cancelled" ? "destructive" : "secondary"} className="text-xs">
                      {r.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {r.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(r.id, "confirmed")}>Confirm</Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-destructive" onClick={() => updateStatus(r.id, "cancelled")}>Cancel</Button>
                        </>
                      )}
                      {r.status === "confirmed" && (
                        <Button size="sm" variant="outline" className="h-7 text-xs text-destructive" onClick={() => updateStatus(r.id, "cancelled")}>Cancel</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
