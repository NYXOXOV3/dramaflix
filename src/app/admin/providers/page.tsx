"use client";

import { useState } from "react";
import { providers as initialProviders } from "@/lib/mock-data";
import type { Provider } from "@/lib/types";
import { Plus, Search, Edit, Trash2, Film, Crown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminProvidersPage() {
  const [providerList, setProviderList] = useState<Provider[]>(initialProviders);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProvider, setNewProvider] = useState({ name: "", slug: "", isVipOnly: false });

  const filtered = providerList.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    if (!newProvider.name) return;
    const provider: Provider = {
      id: `p${Date.now()}`,
      name: newProvider.name,
      slug: newProvider.slug || newProvider.name.toLowerCase().replace(/\s+/g, ""),
      logo: "",
      totalMovies: 0,
      isVipOnly: newProvider.isVipOnly,
      isComingSoon: false,
    };
    setProviderList((prev) => [...prev, provider]);
    setShowAddModal(false);
    setNewProvider({ name: "", slug: "", isVipOnly: false });
  };

  const handleDelete = (id: string) => {
    setProviderList((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Providers</h1>
          <p className="text-sm text-dark-400">{providerList.length} content providers</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-dark-950 font-bold text-sm rounded-xl transition-all">
          <Plus size={16} /> Add Provider
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 max-w-md">
        <Search size={16} className="text-dark-500 mr-2 shrink-0" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search providers..."
          className="bg-transparent text-sm text-white placeholder:text-dark-500 focus:outline-none w-full" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((provider) => (
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
                <button className="p-1.5 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-accent transition-colors">
                  <Edit size={14} />
                </button>
                <button onClick={() => handleDelete(provider.id)}
                  className="p-1.5 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-danger transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-dark-800 text-dark-300 text-[11px] rounded-lg">
                <Film size={10} /> {provider.totalMovies} titles
              </span>
              {provider.isVipOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-[11px] font-medium rounded-lg">
                  <Crown size={10} /> VIP
                </span>
              )}
              {provider.isComingSoon && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple/10 text-purple text-[11px] font-medium rounded-lg">
                  <Clock size={10} /> Soon
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-dark-900 border border-dark-700 rounded-2xl p-6 max-w-md w-full animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-6">Add Provider</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Provider Name *</label>
                <input type="text" value={newProvider.name} onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
                  placeholder="Provider name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Slug</label>
                <input type="text" value={newProvider.slug} onChange={(e) => setNewProvider({ ...newProvider, slug: e.target.value })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
                  placeholder="auto-generated" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="providerVip" checked={newProvider.isVipOnly}
                  onChange={(e) => setNewProvider({ ...newProvider, isVipOnly: e.target.checked })}
                  className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-accent focus:ring-accent" />
                <label htmlFor="providerVip" className="text-sm text-dark-300">VIP Only Provider</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-dark-800 hover:bg-dark-700 text-white text-sm rounded-xl transition-all">Cancel</button>
                <button onClick={handleAdd} disabled={!newProvider.name}
                  className="flex-1 py-2.5 bg-accent hover:bg-accent-dark disabled:opacity-50 text-dark-950 font-bold text-sm rounded-xl transition-all">
                  Add Provider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
