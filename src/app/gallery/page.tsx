"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { X, ImageIcon } from "lucide-react";

const categories = ["All", "Interior", "Food", "Drinks", "Events"];

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  type: string;
  src: string;
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setItems(data);
        else setItems([]);
      })
      .catch(() => setItems([]));
  }, []);

  const filtered = activeCategory === "All"
    ? items
    : items.filter((item) => item.category === activeCategory);

  return (
    <>
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-card border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 px-3 py-1">Gallery</Badge>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-6xl font-heading font-bold mb-4">
            A Visual <span className="text-primary">Journey</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground max-w-xl mx-auto">
            Explore the atmosphere, flavors, and moments that make The Blacksmith special
          </motion.p>
        </div>
      </section>

      <section className="sticky top-16 lg:top-20 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <ImageIcon className="size-12 mx-auto text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground">No media in the gallery yet.</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Add photos from the dashboard.</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedItem(item)}
                  className="group relative aspect-[4/3] rounded-xl bg-gradient-to-br from-secondary to-muted overflow-hidden cursor-pointer"
                >
                  {item.src.startsWith("data:") || item.src.startsWith("http") ? (
                    <img src={item.src} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="size-10 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium">{item.title}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] bg-card rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 size-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X className="size-5" />
              </button>
              <div className="w-full h-full flex items-center justify-center bg-black">
                {selectedItem.src.startsWith("data:") || selectedItem.src.startsWith("http") ? (
                  <img src={selectedItem.src} alt={selectedItem.title} className="max-w-full max-h-[85vh] object-contain" />
                ) : (
                  <div className="text-muted-foreground p-10">
                    <ImageIcon className="size-16 mx-auto mb-4" />
                    <p>Image unavailable</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
