"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/data-store";
import type { Provider } from "@/lib/types";
import { Plus, Search, Edit, Trash2, Film, Crown, Clock, X, Save, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminProvidersPage() {
  const { providers: providerList, addProvider, updateProvider: storeUpdateProvider, deleteProvider: storeDeleteProvider } = useDataStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Provider | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", isVipOnly: false, isComingSoon: false });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = providerList.filter((p: Provider) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const provider: Provider = {
      id: `p${Date.now()}`, name: form.name.trim(),
      slug: form.slug.trim() || form.name.toLowerCase().replace(/\s+/g, "-"),
      logo: "", totalMovies: 0, isVipOnly: form.isVipOnly, isComingSoon: form.isComingSoon,
    };
    addProvider(provider);
    setShowAddModal(false);
    setForm({ name: "", slug: "", isVipOnly: false, isComingSoon: false });
    showToast(`"${provider.name}" has been added.`);
  };

  const handleEdit = () => {
    if (!editTarget || !form.name.trim()) return;
    storeUpdateProvider(editTarget.id, {
      name: form.name.trim(),
      slug: form.slug.trim() || editTarget.slug,
      isVipOnly: form.isVipOnly,
      isComingSoon: form.isComingSoon,
    });
    showToast(`"${form.name}" has been updated.`);
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const provider = providerList.find((p: Provider) => p.id === deleteTarget);
    storeDeleteProvider(deleteTarget);
    setDeleteTarget(null);
    showToast(`"${provider?.name}" has been deleted.`, "error");
  };

  const openEdit = (provider: Provider) => {
    setEditTarget(provider);
    setForm({ name: provider.name, slug: provider.slug, isVipOnly: provider.isVipOnly, isComingSoon: provider.isComingSoon });
  };

  const renderFormModal = (onSubmit: () => void, title: string, onClose: () => void) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-dark-900 border border-dark-700 rounded-2xl p-6 max-w-md w-full animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-dark-800 rounded-lg text-dark-400"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Provider Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" placeholder="Provider name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" placeholder="auto-generated" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isVipOnly} onChange={(e) => setForm({ ...form, isVipOnly: e.target.checked })}
                className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-accent focus:ring-accent" />
              <span className="text-sm text-dark-300">VIP Only Provider</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isComingSoon} onChange={(e) => setForm({ ...form, isComingSoon: e.target.checked })}
                className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-accent focus:ring-accent" />
              <span className="text-sm text-dark-300">Coming Soon</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 bg-dark-800 hover:bg-dark-700 text-white text-sm rounded-xl transition-all">Cancel</button>
            <button onClick={onSubmit} disabled={!form.name.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent hover:bg-accent-dark disabled:opacity-50 text-dark-950 font-bold text-sm rounded-xl transition-all">
              <Save size={16} />{title.includes("Edit") ? "Save" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
          <h1 className="text-2xl font-extrabold text-white">Providers</h1>
          <p className="text-sm text-dark-400">{providerList.length} content providers</p>
        </div>
        <button onClick={() => { setShowAddModal(true); setForm({ name: "", slug: "", isVipOnly: false, isComingSoon: false }); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-dark-950 font-bold text-sm rounded-xl transition-all">
          <Plus size={16} /> Add Provider
        </button>
      </div>

      <div className="flex items-center bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 max-w-md">
        <Search size={16} className="text-dark-500 mr-2 shrink-0" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search providers..." className="bg-transparent text-sm text-white placeholder:text-dark-500 focus:outline-none w-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((provider: Provider) => (
          <div key={provider.id} className="p-4 bg-dark-900 border border-dark-800 rounded-2xl hover:border-dark-700 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dark-800 rounded-xl flex items-center justify-center">
                  <span className="text-sm font-bold text-accent">{provider.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{provider.name}</h3>
                  <p className="text-[11px] text-dark-500">{provider.slug}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(provider)} className="p-1.5 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-accent transition-colors"><Edit size={14} /></button>
                <button onClick={() => setDeleteTarget(provider.id)} className="p-1.5 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-danger transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-dark-800 text-dark-300 text-[11px] rounded-lg"><Film size={10} /> {provider.totalMovies} titles</span>
              {provider.isVipOnly && <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-[11px] font-medium rounded-lg"><Crown size={10} /> VIP</span>}
              {provider.isComingSoon && <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple/10 text-purple text-[11px] font-medium rounded-lg"><Clock size={10} /> Soon</span>}
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="text-center py-12 text-dark-400 text-sm">No providers found.</div>}

      {showAddModal && renderFormModal(handleAdd, "Add Provider", () => setShowAddModal(false))}
      {editTarget && renderFormModal(handleEdit, `Edit: ${editTarget.name}`, () => setEditTarget(null))}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-dark-900 border border-dark-700 rounded-2xl p-6 max-w-sm w-full animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-2">Delete Provider</h3>
            <p className="text-sm text-dark-400 mb-1">Are you sure you want to delete:</p>
            <p className="text-sm text-white font-semibold mb-4">&quot;{providerList.find((p: Provider) => p.id === deleteTarget)?.name}&quot;</p>
            <p className="text-xs text-danger mb-6">All movies linked to this provider will lose their provider reference.</p>
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
