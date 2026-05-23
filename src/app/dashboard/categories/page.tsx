"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, X, Check, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface MenuItem {
  category: string;
}

export default function DashboardCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const fetchData = async () => {
    try {
      const [catRes, menuRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/menu"),
      ]);
      const cats = await catRes.json();
      const menu = await menuRes.json();
      setCategories(Array.isArray(cats) ? cats : []);
      setMenuItems(Array.isArray(menu) ? menu : []);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const getItemCount = (catName: string) =>
    menuItems.filter((i) => i.category === catName).length;

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const item = { id: Date.now().toString(), name: newName.trim() };
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        setCategories((prev) => [...prev, item]);
        setNewName("");
        setAdding(false);
        toast.success("Category added");
      } else { toast.error("Failed to save"); }
    } catch { toast.error("Network error"); }
  };

  const handleEdit = async (id: string) => {
    if (!editValue.trim()) return;
    const updated = categories.map((c) => c.id === id ? { ...c, name: editValue.trim() } : c);
    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setCategories(updated);
        setEditingId(null);
        toast.success("Updated");
      } else { toast.error("Failed to save"); }
    } catch { toast.error("Network error"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const updated = categories.filter((c) => c.id !== id);
    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setCategories(updated);
        toast.success("Deleted");
      } else { toast.error("Failed to delete"); }
    } catch { toast.error("Network error"); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">Organize your menu categories</p>
        </div>
        <Button onClick={() => setAdding(true)}>
          <Plus className="mr-2 size-4" /> Add Category
        </Button>
      </div>

      {adding && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-card border border-border rounded-xl">
          <Input value={newName} onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name" className="flex-1" autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button size="sm" onClick={handleAdd} disabled={!newName.trim()}>
            <Check className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setAdding(false); setNewName(""); }}>
            <X className="size-4" />
          </Button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, i) => (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="bg-card border border-border rounded-xl p-5 flex items-center justify-between group"
          >
            {editingId === cat.id ? (
              <div className="flex items-center gap-2 flex-1">
                <Input value={editValue} onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 h-8 text-sm" autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleEdit(cat.id)}
                />
                <Button size="sm" className="h-8" onClick={() => handleEdit(cat.id)}>
                  <Check className="size-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8" onClick={() => setEditingId(null)}>
                  <X className="size-3.5" />
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-medium">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{getItemCount(cat.name)} items</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="size-8"
                    onClick={() => { setEditingId(cat.id); setEditValue(cat.name); }}>
                    <Edit2 className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8 text-destructive"
                    onClick={() => handleDelete(cat.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            No categories yet. Add your first one.
          </div>
        )}
      </div>
    </div>
  );
}
