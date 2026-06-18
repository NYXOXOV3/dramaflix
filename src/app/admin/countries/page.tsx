"use client";

import { useState } from "react";
import { useData } from "@/lib/data-store";
import type { Country } from "@/lib/types";
import { Plus, Search, Edit, Trash2, X, Save, Check, AlertCircle, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminCountriesPage() {
  const { countries, addCountry, updateCountry, deleteCountry } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Country | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", code: "", flag: "" });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = countries.filter((c: Country) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const country: Country = {
      id: `c${Date.now()}`,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase() || form.name.trim().substring(0, 2).toUpperCase(),
      flag: form.flag.trim(),
    };
    addCountry(country);
    setShowAddModal(false);
    setForm({ name: "", code: "", flag: "" });
    showToast(`"${country.name}" has been added.`);
  };

  const handleEdit = () => {
    if (!editTarget || !form.name.trim()) return;
    updateCountry(editTarget.id, {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      flag: form.flag.trim(),
    });
    showToast(`"${form.name}" has been updated.`);
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const country = countries.find((c: Country) => c.id === deleteTarget);
    deleteCountry(deleteTarget);
    setDeleteTarget(null);
    showToast(`"${country?.name}" has been deleted.`, "error");
  };

  const openEdit = (country: Country) => {
    setEditTarget(country);
    setForm({ name: country.name, code: country.code, flag: country.flag || "" });
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
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Country Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
              placeholder="e.g. China, Korea, Japan" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Code</label>
              <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} maxLength={3}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent uppercase"
                placeholder="CN" />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Flag Emoji</label>
              <input type="text" value={form.flag} onChange={(e) => setForm({ ...form, flag: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
                placeholder="🇨🇳" />
            </div>
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
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2"><Globe size={24} className="text-accent" /> Countries</h1>
          <p className="text-sm text-dark-400">{countries.length} countries configured</p>
        </div>
        <button onClick={() => { setShowAddModal(true); setForm({ name: "", code: "", flag: "" }); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-dark-950 font-bold text-sm rounded-xl transition-all">
          <Plus size={16} /> Add Country
        </button>
      </div>

      <div className="flex items-center bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 max-w-md">
        <Search size={16} className="text-dark-500 mr-2 shrink-0" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search countries..." className="bg-transparent text-sm text-white placeholder:text-dark-500 focus:outline-none w-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((country: Country) => (
          <div key={country.id} className="p-4 bg-dark-900 border border-dark-800 rounded-2xl hover:border-dark-700 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                {country.flag ? (
                  <span className="text-2xl">{country.flag}</span>
                ) : (
                  <div className="w-10 h-10 bg-dark-800 rounded-xl flex items-center justify-center">
                    <Globe size={18} className="text-accent" />
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-white">{country.name}</h3>
                  <p className="text-[11px] text-dark-500">{country.code}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(country)} className="p-1.5 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-accent transition-colors">
                  <Edit size={14} />
                </button>
                <button onClick={() => setDeleteTarget(country.id)} className="p-1.5 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-danger transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="text-center py-12 text-dark-400 text-sm">No countries found.</div>}

      {showAddModal && renderFormModal(handleAdd, "Add Country", () => setShowAddModal(false))}
      {editTarget && renderFormModal(handleEdit, `Edit: ${editTarget.name}`, () => setEditTarget(null))}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-dark-900 border border-dark-700 rounded-2xl p-6 max-w-sm w-full animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-2">Delete Country</h3>
            <p className="text-sm text-dark-400 mb-1">Are you sure you want to delete:</p>
            <p className="text-sm text-white font-semibold mb-4">&quot;{countries.find((c: Country) => c.id === deleteTarget)?.name}&quot;</p>
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
