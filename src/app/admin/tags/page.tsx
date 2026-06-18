"use client";

import { useState } from "react";
import { useData } from "@/lib/data-store";
import type { Tag } from "@/lib/types";
import { Plus, Edit, Trash2, X, Save, Check, AlertCircle, Tag as TagIcon, Image } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  { color: "#ffffff", bg: "#00e676", label: "Green" },
  { color: "#ffffff", bg: "#ef4444", label: "Red" },
  { color: "#ffffff", bg: "#f59e0b", label: "Amber" },
  { color: "#ffffff", bg: "#a855f7", label: "Purple" },
  { color: "#1a1a1a", bg: "#fbbf24", label: "Gold" },
  { color: "#ffffff", bg: "#3b82f6", label: "Blue" },
  { color: "#ffffff", bg: "#06b6d4", label: "Cyan" },
  { color: "#ffffff", bg: "#ec4899", label: "Pink" },
  { color: "#ffffff", bg: "#14b8a6", label: "Teal" },
  { color: "#ffffff", bg: "#f97316", label: "Orange" },
  { color: "#ffffff", bg: "#8b5cf6", label: "Violet" },
  { color: "#ffffff", bg: "#64748b", label: "Gray" },
];

export default function AdminTagsPage() {
  const { tags, addTag, updateTag, deleteTag } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Tag | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", color: "#ffffff", bgColor: "#3b82f6", logo: "", priority: 10 });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => {
    setEditTarget(null);
    setForm({ name: "", slug: "", color: "#ffffff", bgColor: "#3b82f6", logo: "", priority: tags.length + 1 });
    setShowModal(true);
  };

  const openEdit = (tag: Tag) => {
    setEditTarget(tag);
    setForm({ name: tag.name, slug: tag.slug, color: tag.color, bgColor: tag.bgColor, logo: tag.logo || "", priority: tag.priority });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { showToast("Tag name is required.", "error"); return; }
    const slug = form.slug.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (editTarget) {
      updateTag(editTarget.id, { name: form.name.trim(), slug, color: form.color, bgColor: form.bgColor, logo: form.logo || undefined, priority: form.priority });
      showToast(`"${form.name}" updated.`);
    } else {
      const tag: Tag = { id: `tag-${Date.now()}`, name: form.name.trim(), slug, color: form.color, bgColor: form.bgColor, logo: form.logo || undefined, priority: form.priority };
      addTag(tag);
      showToast(`"${form.name}" created.`);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const tag = tags.find((t: Tag) => t.id === deleteTarget);
    deleteTag(deleteTarget);
    setDeleteTarget(null);
    showToast(`"${tag?.name}" deleted.`, "error");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("Only image files allowed.", "error"); return; }
    if (file.size > 512 * 1024) { showToast("Max 512KB for logos.", "error"); return; }
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, logo: reader.result as string });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={cn("fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-slide-up text-sm font-medium",
          toast.type === "success" ? "bg-success/20 text-success border border-success/30" : "bg-danger/20 text-danger border border-danger/30")}>
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}{toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2"><TagIcon size={24} className="text-accent" /> Tags</h1>
          <p className="text-sm text-dark-400">{tags.length} tags configured. Tags appear as badges on movie posters.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-dark-950 font-bold text-sm rounded-xl transition-all">
          <Plus size={16} /> Add Tag
        </button>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {(tags as Tag[]).sort((a: Tag, b: Tag) => a.priority - b.priority).map((tag: Tag) => (
          <div key={tag.id} className="p-4 bg-dark-900 border border-dark-800 rounded-2xl hover:border-dark-700 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {tag.logo ? (
                  <img src={tag.logo} alt={tag.name} className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-extrabold"
                    style={{ backgroundColor: tag.bgColor, color: tag.color }}>
                    {tag.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-white">{tag.name}</h3>
                  <p className="text-[11px] text-dark-500">Priority: {tag.priority}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(tag)} className="p-1.5 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-accent transition-colors">
                  <Edit size={14} />
                </button>
                <button onClick={() => setDeleteTarget(tag.id)} className="p-1.5 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-danger transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {/* Preview badge */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold" style={{ backgroundColor: tag.bgColor, color: tag.color }}>
                {tag.name}
              </span>
              <span className="text-[10px] text-dark-500">Preview</span>
            </div>
          </div>
        ))}
      </div>
      {tags.length === 0 && <div className="text-center py-12 text-dark-400 text-sm">No tags yet. Create one!</div>}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-dark-900 border border-dark-700 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">{editTarget ? `Edit: ${editTarget.name}` : "Create Tag"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-dark-800 rounded-lg text-dark-400"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Tag Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" placeholder="e.g. NEW, HOT" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Slug</label>
                  <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" placeholder="auto-generated" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Priority (lower = shows first)</label>
                <input type="number" min={1} value={form.priority} onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 1 })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
              </div>

              {/* Color Presets */}
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Color Preset</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((preset, i) => (
                    <button key={i} onClick={() => setForm({ ...form, color: preset.color, bgColor: preset.bg })}
                      className={cn("w-8 h-8 rounded-lg transition-all border-2", form.bgColor === preset.bg ? "border-white scale-110" : "border-transparent hover:border-dark-600")}
                      style={{ backgroundColor: preset.bg }} title={preset.label} />
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.bgColor} onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-dark-700 cursor-pointer bg-transparent" />
                    <input type="text" value={form.bgColor} onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                      className="flex-1 bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-dark-700 cursor-pointer bg-transparent" />
                    <input type="text" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="flex-1 bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent font-mono" />
                  </div>
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5 flex items-center gap-1"><Image size={12} /> Tag Logo (optional)</label>
                <div className="flex items-center gap-3">
                  {form.logo ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-dark-800 border border-dark-700">
                      <img src={form.logo} alt="Logo" className="w-full h-full object-cover" />
                      <button onClick={() => setForm({ ...form, logo: "" })}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full flex items-center justify-center">
                        <X size={10} className="text-white" />
                      </button>
                    </div>
                  ) : null}
                  <label className="flex items-center gap-1.5 px-3 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg text-xs text-dark-300 hover:text-white transition-all cursor-pointer">
                    <Plus size={12} /> Upload Logo
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 bg-dark-800 rounded-xl">
                <p className="text-xs text-dark-400 mb-2">Badge Preview:</p>
                <div className="flex items-center gap-2">
                  {form.logo && <img src={form.logo} alt="" className="w-5 h-5 rounded object-cover" />}
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold" style={{ backgroundColor: form.bgColor, color: form.color }}>
                    {form.name || "Tag Name"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-dark-800 hover:bg-dark-700 text-white text-sm rounded-xl transition-all">Cancel</button>
                <button onClick={handleSave} disabled={!form.name.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent hover:bg-accent-dark disabled:opacity-50 text-dark-950 font-bold text-sm rounded-xl transition-all">
                  <Save size={16} />{editTarget ? "Save" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-dark-900 border border-dark-700 rounded-2xl p-6 max-w-sm w-full animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-2">Delete Tag</h3>
            <p className="text-sm text-dark-400 mb-4">Delete &quot;{tags.find((t: Tag) => t.id === deleteTarget)?.name}&quot;? It will be removed from all movies.</p>
            <div className="flex items-center gap-3 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white text-sm rounded-xl transition-all">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-danger hover:bg-danger/80 text-white text-sm font-bold rounded-xl transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
