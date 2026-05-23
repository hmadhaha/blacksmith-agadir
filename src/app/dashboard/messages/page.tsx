"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Trash2, RefreshCw, ChevronDown, ChevronUp, User, Calendar } from "lucide-react";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function DashboardMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        toast.success("Message deleted");
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Messages</h1>
          <p className="text-sm text-muted-foreground">Customer inquiries from the contact form</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchMessages} disabled={loading}>
          <RefreshCw className={`size-4 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16">
          <Mail className="size-10 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-muted-foreground">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg, i) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{msg.subject || "(No subject)"}</p>
                    <p className="text-xs text-muted-foreground truncate">{msg.name} · {msg.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-muted-foreground hidden sm:block">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                  {expanded === msg.id ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                </div>
              </button>
              {expanded === msg.id && (
                <div className="px-4 pb-4 pt-0 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 pt-3">
                    <Calendar className="size-3" /> {new Date(msg.created_at).toLocaleString()}
                  </div>
                  <p className="text-sm whitespace-pre-wrap bg-muted/50 rounded-lg p-3 mb-3">{msg.message}</p>
                  <div className="flex gap-2">
                    <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Mail className="size-3" /> Reply via Email
                    </a>
                    <button onClick={() => handleDelete(msg.id)}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      <Trash2 className="size-3" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
