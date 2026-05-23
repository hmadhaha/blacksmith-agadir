"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/star-rating";
import { Star, Reply, MessageSquare, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  source: string;
  date: string;
  reply?: string;
}

export default function DashboardReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load reviews"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, []);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Reviews</h1>
          <p className="text-sm text-muted-foreground">{reviews.length} reviews · Manage feedback</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={fetchReviews}><RefreshCw className="size-3.5 mr-1" /> Refresh</Button>
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`size-4 ${Math.round(Number(avgRating)) >= i ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <span className="font-heading font-bold text-lg">{avgRating}</span>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <MessageSquare className="size-12 mx-auto mb-3 opacity-30" />
          <p>No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm">{review.author}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={review.rating} size={13} />
                    <span className="text-xs text-muted-foreground">{review.source}</span>
                    {review.date && <><span className="text-xs text-muted-foreground">·</span><span className="text-xs text-muted-foreground">{review.date}</span></>}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">&ldquo;{review.text}&rdquo;</p>
              {review.reply && (
                <div className="ml-6 pl-4 border-l-2 border-primary/30 bg-primary/[0.02] rounded-r-lg py-2 px-3 mb-3">
                  <p className="text-xs font-medium text-primary mb-1">Your Reply</p>
                  <p className="text-sm text-muted-foreground">{review.reply}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
