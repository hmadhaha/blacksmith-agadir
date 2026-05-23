"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { t } from "@/lib/i18n";

export default function ContactPage() {
  const { locale } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Message sent! We'll get back to you soon.");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send. Please try again.");
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 px-3 py-1">{t(locale, "contactPage.title")}</Badge>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-6xl font-heading font-bold mb-4">
            {t(locale, "contactPage.title")}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground max-w-xl mx-auto">
            {t(locale, "contactPage.subtitle")}
          </motion.p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="space-y-6 mb-8">
                {[
                  { icon: MapPin, labelKey: "contactPage.address", value: "2 Rue des Orangers, Agadir 80000", href: "https://maps.google.com/?q=2+Rue+des+Orangers+Agadir+80000" },
                  { icon: Phone, labelKey: "contactPage.phone", value: "+212 8086 00401", href: "tel:+212808600401" },
                  { icon: Mail, labelKey: "contactPage.email", value: "info@blacksmith-agadir.com", href: "mailto:info@blacksmith-agadir.com" },
                  { icon: Clock, labelKey: "contactPage.hours", value: "Daily 8:30 AM - 1:00 AM" },
                ].map((item) => (
                  <div key={item.labelKey} className="flex items-start gap-4">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t(locale, item.labelKey)}</p>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306.5!2d-9.6018446!3d30.4226454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xfc277e3fc9248212!2sThe+Blacksmith!5e0!3m2!1sen!2sma!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Blacksmith Location"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-4">
                <h2 className="text-2xl font-heading font-bold mb-2">{t(locale, "contactPage.formTitle")}</h2>
                <p className="text-sm text-muted-foreground mb-4">{t(locale, "contactPage.formSubtitle")}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t(locale, "contactPage.name")} *</label>
                    <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t(locale, "contactPage.name")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t(locale, "contactPage.emailLabel")} *</label>
                    <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t(locale, "contactPage.phoneLabel")}</label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+212 XXX" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t(locale, "contactPage.subject")} *</label>
                    <Input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder={t(locale, "contactPage.subject")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t(locale, "contactPage.message")} *</label>
                  <Textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t(locale, "contactPage.message")} rows={5} />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  <Send className="mr-2 size-4" /> {submitting ? t(locale, "contactPage.sending") : t(locale, "contactPage.send")}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
