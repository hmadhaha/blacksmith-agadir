"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { Plus, Search, Edit2, Trash2, X, Save, Upload,
  Image as ImageIcon, Tag, Percent, Eye
} from "lucide-react";
import { toast } from "sonner";
import { imageUrl } from "@/lib/utils";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  popular: boolean;
  discountPercent: number;
}

const categories = ["Starters", "Main Course", "Pizza", "Pasta", "Burgers", "Seafood", "Desserts", "Beverages"];

const emptyForm = { name: "", description: "", price: 0, category: "Starters", popular: false, discountPercent: 0, image: null as string | null };

export default function DashboardMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      setItems(data);
    } catch { toast.error("Failed to load menu items"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const filtered = items.filter((i) => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "All" || i.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setPreview(null);
    setModalOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      popular: item.popular,
      discountPercent: item.discountPercent,
      image: item.image,
    });
    setPreview(imageUrl(item.image));
    setModalOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setForm({ ...form, image: data.url });
        setPreview(data.url);
        toast.success("Image uploaded");
      } else { toast.error("Upload failed"); }
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.description.trim() || form.price <= 0) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const url = editId ? `/api/menu/${editId}` : "/api/menu";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        toast.success(editId ? "Item updated" : "Item added");
        setModalOpen(false);
        fetchItems();
      }
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/menu/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Item deleted");
        setDeleteId(null);
        fetchItems();
      }
    } catch { toast.error("Delete failed"); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Menu Items</h1>
          <p className="text-sm text-muted-foreground">{items.length} items · Manage your menu</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="mr-2 size-4" /> Add Item
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", ...categories].map((cat) => (
            <button key={cat} onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                categoryFilter === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >{cat}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.map((item) => (
          <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/20 transition-all group"
          >
            <div className="size-14 rounded-lg overflow-hidden shrink-0 bg-secondary">
              {item.image ? (
                <img src={imageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/40"><ImageIcon className="size-6" /></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm">{item.name}</h3>
                {item.popular && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Popular</Badge>}
                {item.discountPercent > 0 && (
                  <Badge className="text-[10px] px-1.5 py-0 bg-green-500 text-white">-{item.discountPercent}%</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{item.category} · {item.price} DH</p>
            </div>
            <div className="flex items-center gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="size-8" onClick={() => openEdit(item)}>
                <Edit2 className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => setDeleteId(item.id)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="size-10 mx-auto mb-3 opacity-30" />
            <p>No items found</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-lg font-heading font-bold">{editId ? "Edit Item" : "Add New Item"}</h2>
                <button onClick={() => setModalOpen(false)} className="size-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors">
                  <X className="size-4" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex gap-6">
                  <div className="shrink-0">
                    <div className="size-28 rounded-xl bg-secondary overflow-hidden flex items-center justify-center relative">
                      {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="size-10 text-muted-foreground/40" />
                      )}
                    </div>
                    <label className="mt-2 flex items-center justify-center gap-1.5 text-xs text-primary cursor-pointer hover:underline">
                      <Upload className="size-3" />
                      {uploading ? "Uploading..." : "Upload Image"}
                      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                    </label>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Name *</label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Item name" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Price (DH) *</label>
                        <Input type="number" min={0} value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="0" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className="w-full h-10 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring"
                        >
                          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Description *</label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe this dish..." rows={3} />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} className="rounded" />
                    <span className="text-sm">Mark as Popular</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Percent className="size-4 text-muted-foreground" />
                    <Input type="number" min={0} max={100} value={form.discountPercent || ""} onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
                      className="w-20 text-sm" placeholder="0" />
                    <span className="text-sm text-muted-foreground">% off</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
                <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="mr-2 size-4" /> {saving ? "Saving..." : editId ? "Update Item" : "Add Item"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="size-10 text-destructive mx-auto mb-3" />
              <h3 className="font-heading font-bold mb-1">Delete Item?</h3>
              <p className="text-sm text-muted-foreground mb-6">This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
