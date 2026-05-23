"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, ExternalLink, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/star-rating";
import { useLanguage } from "@/contexts/language-context";
import { t } from "@/lib/i18n";

interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  source: string;
  date: string;
}

const hardcoded: Review[] = [
  { id: -2, author: "Sarah M.", rating: 5, text: "The Blacksmith is hands down the best restaurant in Agadir!", source: "Tripadvisor", date: "4 months ago" },
];

export default function ReviewsPage() {
  const { locale } = useLanguage();
  const [apiReviews, setApiReviews] = useState<Review[]>([]);
  const [googleReviews, setGoogleReviews] = useState<Review[]>([]);
  const [googleRating, setGoogleRating] = useState("4.7");
  const [form, setForm] = useState({ author: "", rating: 0, text: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setApiReviews(data); })
      .catch(() => {});
    fetch("/api/google-reviews")
      .then((r) => r.json())
      .then((data) => {
        if (data?.reviews) setGoogleReviews(data.reviews);
        if (data?.totalRating) setGoogleRating(String(data.totalRating));
      })
      .catch(() => {});
  }, []);

  const allReviews = [...apiReviews, ...googleReviews, ...hardcoded];
  const avgRating = allReviews.length > 0
    ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
    : "4.7";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author.trim() || !form.rating || !form.text.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: form.author.trim(),
          rating: form.rating,
          text: form.text.trim(),
          source: "Website",
          date: new Date().toLocaleDateString(),
        }),
      });
      const newReview: Review = {
        id: Date.now(),
        author: form.author.trim(),
        rating: form.rating,
        text: form.text.trim(),
        source: "Website",
        date: "Just now",
      };
      setApiReviews((prev) => [newReview, ...prev]);
      setForm({ author: "", rating: 0, text: "" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch { /* ignore */ }
    finally { setSubmitting(false); }
  };

  return (
    <>
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-card border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 px-3 py-1">{t(locale, "reviewsPage.title")}</Badge>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-6xl font-heading font-bold mb-4">
            {t(locale, "reviewsPage.title")}
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-center gap-4 text-muted-foreground">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`size-5 ${Math.round(Number(avgRating)) >= i ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <span className="text-lg font-semibold text-foreground">{avgRating}</span>
            <span>· {allReviews.length} reviews</span>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-card border border-border rounded-xl p-6 lg:p-8 mb-8"
          >
            <h2 className="text-xl font-heading font-bold mb-2">{t(locale, "reviewsPage.share")}</h2>
            <p className="text-sm text-muted-foreground mb-6">{t(locale, "reviewsPage.feedback")}</p>
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-6 text-center">
                <CheckCircle className="size-12 text-green-500 mb-3" />
                <p className="font-semibold text-lg">Thank you!</p>
                <p className="text-sm text-muted-foreground">Your review has been submitted.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-1.5 block">{t(locale, "reviewsPage.yourName")}</label>
                    <Input placeholder="e.g. Ahmed M." value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">{t(locale, "reviewsPage.rating")}</label>
                    <div className="h-10 flex items-center">
                      <StarRating rating={form.rating} onRatingChange={(r) => setForm({ ...form, rating: r })} size={28} interactive />
                    </div>
                  </div>
                </div>
                <Textarea placeholder="Tell us about your experience..." rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} required />
                <Button type="submit" disabled={!form.author.trim() || !form.rating || !form.text.trim() || submitting} className="w-full sm:w-auto">
                  <Send className="size-4 mr-2" /> {submitting ? t(locale, "reviewsPage.submitting") : t(locale, "reviewsPage.submit")}
                </Button>
              </form>
            )}
          </motion.div>

          {apiReviews.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-heading font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
                {t(locale, "reviewsPage.websiteReviews")} ({apiReviews.length})
              </h3>
              <div className="space-y-3">
                {apiReviews.map((review) => (
                  <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-xl p-5 border-primary/20"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.author}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRating rating={review.rating} size={14} />
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-primary/5 text-primary border-primary/20">Website</Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {googleReviews.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-sm font-heading font-semibold text-muted-foreground uppercase tracking-wider">
                  {t(locale, "reviewsPage.googleReviews")} ({googleReviews.length})
                </h3>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-xs font-medium">
                  <Star className="size-3 fill-current" /> {googleRating}
                </div>
              </div>
              <div className="space-y-3">
                {googleReviews.map((review, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-xl p-5"
                  >
                    <p className="font-semibold mb-1">{review.author}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <StarRating rating={review.rating} size={14} />
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {hardcoded.map((review) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-card border border-border rounded-xl p-6 relative"
              >
                <Quote className="size-6 text-primary/10 absolute top-4 right-4" />
                <p className="font-semibold mb-1">{review.author}</p>
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={review.rating} size={14} />
                  <span className="text-xs text-muted-foreground">{review.source} · {review.date}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{review.text}&rdquo;</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10 p-8 bg-card border border-border rounded-xl">
            <h3 className="text-xl font-heading font-bold mb-2">{t(locale, "reviewsPage.leaveUs")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t(locale, "reviewsPage.help")}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="https://search.google.com/local/writereview?placeid=ChIJvcKVmzdhpQ0R7-2WqkwP-wQ" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted px-4 py-2 text-sm font-medium transition-all">
                {t(locale, "reviewsPage.onGoogle")} <ExternalLink className="ml-2 size-4" />
              </a>
              <a href="https://www.tripadvisor.com/Restaurant_Review-g293731-d26555772-Reviews-The_Blacksmith-Agadir_Souss_Massa.html" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted px-4 py-2 text-sm font-medium transition-all">
                {t(locale, "reviewsPage.onTripadvisor")} <ExternalLink className="ml-2 size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
