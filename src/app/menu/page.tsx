"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Percent } from "lucide-react";
import { imageUrl } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { t } from "@/lib/i18n";

const categories = ["All", "Starters", "Main Course", "Pizza", "Pasta", "Burgers", "Seafood", "Desserts", "Beverages"];

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  popular: boolean;
  image: string | null;
  discountPercent: number;
}

export default function MenuPage() {
  const { locale } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data) => setMenuItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedItems = filteredItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <>
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-card border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 px-3 py-1">{t(locale, "menuPage.fromKitchen")}</Badge>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-6xl font-heading font-bold mb-4">
            Flavors That <span className="text-primary">Inspire</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground max-w-xl mx-auto">
            {t(locale, "menuPage.discover")}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-md mx-auto mt-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder={t(locale, "menuPage.signature")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-background" />
          </motion.div>
        </div>
      </section>

      <section className="sticky top-16 lg:top-20 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <Search className="size-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">{t(locale, "menuPage.signature")}</p>
            </div>
          ) : (
            Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="mb-12 last:mb-0">
                <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
                  <span className="size-2 rounded-full bg-primary" />
                  {category}
                </motion.h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {items.map((item, i) => {
                    const finalPrice = item.discountPercent > 0
                      ? Math.round(item.price * (1 - item.discountPercent / 100))
                      : item.price;
                    return (
                      <Link key={item.id} href={`/menu/${item.id}`}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                          className={`group flex items-start gap-4 p-4 rounded-xl bg-card border transition-all duration-300 ${
                            item.discountPercent > 0 ? "border-green-500/30 hover:border-green-500/60" : "border-border hover:border-primary/30"
                          } hover:shadow-md`}
                        >
                          <div className="size-16 rounded-lg shrink-0 flex items-center justify-center overflow-hidden bg-secondary">
                            {item.image ? (
                              <img src={imageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg font-heading font-bold text-muted-foreground/40">
                                {item.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-heading font-semibold group-hover:text-primary transition-colors">{item.name}</h3>
                                {item.popular && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Popular</Badge>}
                              </div>
                              <div className="text-right">
                                {item.discountPercent > 0 ? (
                                  <>
                                    <span className="text-primary font-heading font-bold">{finalPrice} DH</span>
                                    <span className="text-xs text-muted-foreground line-through ml-1.5">{item.price} DH</span>
                                  </>
                                ) : (
                                  <span className="text-primary font-heading font-bold whitespace-nowrap">{item.price} DH</span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{item.description}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              {item.discountPercent > 0 && (
                                <Badge className="bg-green-500 text-white text-[10px] px-1.5 py-0">
                                  <Percent className="size-2.5 mr-0.5" /> {item.discountPercent}% OFF
                                </Badge>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-heading font-bold mb-4">{t(locale, "menuPage.fromKitchen")}</h2>
          <p className="text-muted-foreground mb-6">{t(locale, "menuPage.discover")}</p>
          <Link href="/reservations" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-sm font-medium transition-all">
            {t(locale, "common.bookTable")} <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
