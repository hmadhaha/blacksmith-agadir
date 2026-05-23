"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/star-rating";
import { ArrowLeft, Star, Send, ThumbsUp, Percent } from "lucide-react";
import { imageUrl } from "@/lib/utils";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  popular: boolean;
  ingredients: string;
  image: string | null;
  discountPercent: number;
}

const defaultIngredients: Record<string, string> = {
  "1": "Phyllo dough, spiced minced meat/cheese, herbs, vegetable oil",
  "2": "Baguette, garlic butter, parsley, herbs",
  "21": "Squid rings, flour, eggs, breadcrumbs, tartar sauce, lemon",
  "3": "Chicken wings, house sauce, herbs",
  "4": "King prawns, garlic, olive oil, chili, Moroccan spices",
  "22": "Bomba rice, saffron, chicken, prawns, mussels, peas, bell peppers",
  "5": "Lamb chops, chicken skewers, kofta, rice, grilled vegetables",
  "6": "Chicken breast, yogurt, garlic, lemon, spices",
  "7": "Beef strips, mushrooms, onion, sour cream, beef broth, mashed potatoes",
  "23": "Lamb shank, rosemary, thyme, garlic, carrots, celery, red wine",
  "8": "Chicken, preserved lemon, olives, onion, saffron, ginger",
  "9": "Grilled chicken breast, brioche bun, house sauce, lettuce, tomato, cheese",
  "10": "Angus beef patty, lettuce, tomato, onion, pickles, fries",
  "11": "Pizza dough, tomato sauce, mozzarella, fresh basil, olive oil",
  "12": "Pizza dough, tomato sauce, mozzarella, pepperoni, herbs",
  "13": "Spaghetti, pancetta, eggs, parmesan, black pepper",
  "14": "Lasagna sheets, beef mince, béchamel, tomato sauce, mozzarella",
  "15": "Mascarpone, espresso, ladyfinger biscuits, cocoa powder, eggs",
  "16": "Eggs, milk, sugar, vanilla, caramel",
  "17": "Heavy cream, vanilla bean, egg yolks, sugar",
  "24": "Dark chocolate, butter, eggs, flour, sugar, vanilla ice cream",
  "18": "White rum, mint, lime, passion fruit, soda water, sugar",
  "19": "Fresh oranges",
  "20": "Green tea, fresh mint, sugar",
};

export default function MenuItemPage() {
  const params = useParams();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [dishRating, setDishRating] = useState(0);
  const [dishReview, setDishReview] = useState("");
  const [dishSubmitted, setDishSubmitted] = useState(false);
  const [dishReviews, setDishReviews] = useState<{ rating: number; text: string; date: string }[]>([]);

  useEffect(() => {
    fetch(`/api/menu/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setItem(null); return; }
        setItem(data);
      })
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`bs-dish-${params.id}`);
      if (saved) setDishReviews(JSON.parse(saved));
    } catch { /* ignore */ }
  }, [params.id]);

  const handleDishReview = async () => {
    if (!dishRating || !dishReview.trim()) return;
    const newEntry = { rating: dishRating, text: dishReview.trim(), date: new Date().toLocaleDateString() };
    const updated = [newEntry, ...dishReviews];
    setDishReviews(updated);
    try { localStorage.setItem(`bs-dish-${params.id}`, JSON.stringify(updated)); } catch { /* ignore */ }
    setDishRating(0);
    setDishReview("");
    setDishSubmitted(true);
    setTimeout(() => setDishSubmitted(false), 3000);
  };

  if (loading) return (
    <section className="pt-28 pb-16 min-h-screen flex items-center justify-center">
      <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </section>
  );

  if (!item) {
    return (
      <section className="pt-28 pb-16 text-center">
        <h1 className="text-2xl font-heading font-bold mb-4">Dish Not Found</h1>
        <Link href="/menu" className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted px-6 py-3 text-sm font-medium transition-all">Back to Menu</Link>
      </section>
    );
  }

  const ingredients = item.ingredients || defaultIngredients[item.id] || "Fresh ingredients prepared by our chef";
  const finalPrice = item.discountPercent > 0 ? Math.round(item.price * (1 - item.discountPercent / 100)) : item.price;

  return (
    <section className="pt-28 pb-16 lg:pt-36 lg:pb-20 bg-card border-b border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/menu" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="size-4" /> Back to Menu
        </Link>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="aspect-square rounded-2xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center relative overflow-hidden">
            {item.image ? (
              <img src={imageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="size-40 rounded-full bg-secondary flex items-center justify-center text-6xl font-heading font-bold text-muted-foreground/30">{item.name.charAt(0)}</div>
            )}
            {item.popular && <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground"><Star className="size-3 mr-1 fill-current" /> Popular</Badge>}
            {item.discountPercent > 0 && (
              <Badge className="absolute top-4 right-4 bg-green-500 text-white"><Percent className="size-3 mr-1" /> {item.discountPercent}% OFF</Badge>
            )}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Badge variant="secondary" className="mb-3">{item.category}</Badge>
            <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4">{item.name}</h1>
            <p className="text-muted-foreground leading-relaxed mb-6">{item.description}</p>
            <div className="mb-8">
              {item.discountPercent > 0 ? (
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-heading font-bold text-primary">{finalPrice} DH</span>
                  <span className="text-xl text-muted-foreground line-through">{item.price} DH</span>
                  <Badge className="bg-green-500 text-white">-{item.discountPercent}%</Badge>
                </div>
              ) : (
                <span className="text-4xl font-heading font-bold text-primary">{item.price} DH</span>
              )}
            </div>
            <div className="border-t border-border pt-6 mb-8">
              <h3 className="font-heading font-semibold mb-3">Ingredients</h3>
              <p className="text-sm text-muted-foreground">{ingredients}</p>
            </div>
            <Link href="/reservations" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-sm font-medium transition-all">
              Book a Table to Try This
            </Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 p-6 lg:p-8 bg-card border border-border rounded-xl">
          <h3 className="text-lg font-heading font-bold mb-1">Rate This Dish</h3>
          <p className="text-sm text-muted-foreground mb-4">Let us know what you think of the {item.name}.</p>
          {dishSubmitted ? (
            <div className="flex items-center gap-3 text-green-600">
              <ThumbsUp className="size-5" />
              <p className="text-sm font-medium">Thanks for your feedback!</p>
            </div>
          ) : (
            <div className="space-y-3">
              <StarRating rating={dishRating} onRatingChange={setDishRating} size={32} interactive />
              <Textarea placeholder="Share your thoughts on this dish..." rows={3} value={dishReview} onChange={(e) => setDishReview(e.target.value)} />
              <Button onClick={handleDishReview} disabled={!dishRating || !dishReview.trim()} size="sm">
                <Send className="size-3.5 mr-2" /> Submit
              </Button>
            </div>
          )}
          {dishReviews.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reviews ({dishReviews.length})</p>
              {dishReviews.map((r, i) => (
                <div key={i} className="text-sm">
                  <div className="flex items-center gap-2 mb-0.5">
                    <StarRating rating={r.rating} size={12} />
                    <span className="text-[11px] text-muted-foreground">{r.date}</span>
                  </div>
                  <p className="text-muted-foreground">&ldquo;{r.text}&rdquo;</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
