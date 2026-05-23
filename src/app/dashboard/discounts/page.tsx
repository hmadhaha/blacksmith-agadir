"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Percent, Save, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { imageUrl } from "@/lib/utils";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string | null;
  discountPercent: number;
}

export default function DiscountsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDiscount, setEditingDiscount] = useState<string | null>(null);
  const [discountValue, setDiscountValue] = useState(0);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      setItems(data);
    } catch { toast.error("Failed to load") }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const discounted = items.filter((i) => i.discountPercent > 0);
  const regular = items.filter((i) => !i.discountPercent);

  const applyDiscount = async (id: string) => {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discountPercent: discountValue }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Discount applied");
        setEditingDiscount(null);
        setDiscountValue(0);
        fetchItems();
      }
    } catch { toast.error("Failed to apply discount"); }
  };

  const removeDiscount = async (id: string) => {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discountPercent: 0 }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Discount removed");
        fetchItems();
      }
    } catch { toast.error("Failed to remove discount"); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold">Discounts</h1>
        <p className="text-sm text-muted-foreground">Manage promotions and special offers</p>
      </div>

      {discounted.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-heading font-semibold mb-3 flex items-center gap-2">
            <Tag className="size-4 text-green-500" /> Active Discounts ({discounted.length})
          </h2>
          <div className="grid gap-2">
            {discounted.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-card border border-green-500/20 rounded-xl p-4 flex items-center gap-4"
              >
                <div className="size-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                  {item.image && <img src={imageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.category} · {item.price} DH</p>
                </div>
                <Badge className="bg-green-500 text-white text-sm px-3 py-1">-{item.discountPercent}%</Badge>
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" onClick={() => removeDiscount(item.id)}>
                  <X className="size-3.5" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-heading font-semibold mb-3 text-muted-foreground">All Items</h2>
        <div className="grid gap-2">
          {regular.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
            >
              <div className="size-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                {item.image && <img src={imageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.category} · {item.price} DH</p>
              </div>
              {editingDiscount === item.id ? (
                <div className="flex items-center gap-2">
                  <Input type="number" min={0} max={100} value={discountValue || ""} onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-16 h-8 text-sm" placeholder="%" />
                  <Button size="sm" className="h-8" onClick={() => applyDiscount(item.id)} disabled={!discountValue}>
                    <Save className="size-3 mr-1" /> Apply
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => { setEditingDiscount(null); setDiscountValue(0); }}>
                    <X className="size-3.5" />
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="h-8" onClick={() => { setEditingDiscount(item.id); setDiscountValue(0); }}>
                  <Percent className="size-3 mr-1" /> Add Discount
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
