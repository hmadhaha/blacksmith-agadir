"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, ImageIcon, Trash2, Film, X, Upload, Loader2 } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  type: "image" | "video";
  src: string;
  url?: string;
}

export default function DashboardGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Interior", type: "image" as "image" | "video", url: "" });

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load gallery"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const authHeaders = (): Record<string, string> => {
    const token = sessionStorage.getItem("bs-auth");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", headers: authHeaders(), body: fd });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, url: data.url, type: "image" }));
        toast.success("Image uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleAdd = async () => {
    if (!form.title || !form.url) { toast.error("Title and image required"); return; }
    const item: GalleryItem = { id: Date.now().toString(), ...form, src: form.url };
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        setItems((prev) => [item, ...prev]);
        setShowModal(false);
        setForm({ title: "", category: "Interior", type: "image", url: "" });
        toast.success("Added to gallery");
      } else {
        toast.error("Failed to save");
      }
    } catch { toast.error("Network error"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        toast.success("Deleted");
      } else {
        toast.error("Failed to delete");
      }
    } catch { toast.error("Network error"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Gallery</h1>
          <p className="text-sm text-muted-foreground">Manage your media gallery</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2 size-4" /> Upload Media
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="group relative aspect-[4/3] rounded-xl bg-gradient-to-br from-secondary to-muted overflow-hidden"
          >
            {item.type === "video" ? (
              <video src={item.src} className="w-full h-full object-cover" />
            ) : item.src ? (
              <img src={item.src} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="size-10 text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white text-sm font-medium">{item.title}</p>
              <p className="text-white/70 text-[10px]">{item.category}</p>
            </div>
            {item.type === "video" && (
              <div className="absolute top-2 left-2 bg-black/60 rounded-lg px-2 py-0.5">
                <Film className="size-3.5 text-white" />
              </div>
            )}
            <button onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 size-8 rounded-lg bg-destructive/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </motion.div>
        ))}
        {!loading && items.length === 0 && (
          <div className="col-span-full text-center py-16">
            <ImageIcon className="size-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-muted-foreground">No media yet. Click &quot;Upload Media&quot; to add.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-bold">Add to Gallery</h2>
              <button onClick={() => setShowModal(false)} className="size-8 rounded-lg hover:bg-muted flex items-center justify-center">
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Restaurant Interior" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  {["Interior", "Food", "Events", "Exterior", "Drinks"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Image</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 h-10 rounded-lg border border-input bg-background px-3 text-sm text-muted-foreground hover:bg-muted transition-colors">
                      <Upload className="size-4" /> {uploading ? "Uploading..." : "Choose File"}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                  {uploading && <Loader2 className="size-5 animate-spin" />}
                </div>
              </div>
              {form.url && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preview</label>
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img src={form.url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
              <Button className="w-full" onClick={handleAdd} disabled={!form.title || !form.url}>
                <Plus className="mr-2 size-4" /> Add to Gallery
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
