"use client";

import { useState } from "react";
import { movies as initialMovies, providers } from "@/lib/mock-data";
import type { Movie } from "@/lib/types";
import { Plus, Search, Edit, Trash2, Eye, X, Check, Save, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MovieFormData {
  title: string;
  slug: string;
  synopsis: string;
  country: string;
  status: "Ongoing" | "Completed";
  genre: string;
  provider: string;
  rating: number;
  totalEpisodes: number;
  freeEpisodes: number;
  year: number;
  category: Movie["category"];
  isVipOnly: boolean;
}

const emptyForm: MovieFormData = {
  title: "", slug: "", synopsis: "", country: "China",
  status: "Ongoing", genre: "", provider: "", rating: 4.0,
  totalEpisodes: 10, freeEpisodes: 3, year: 2025, category: "drama", isVipOnly: false,
};

function MovieFormModal({
  isOpen, onClose, onSubmit, initial, title,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MovieFormData) => void;
  initial: MovieFormData;
  title: string;
}) {
  const [form, setForm] = useState<MovieFormData>(initial);
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!form.title.trim()) errs.push("Title is required.");
    if (!form.slug.trim()) errs.push("Slug is required.");
    if (form.totalEpisodes < 1) errs.push("Total episodes must be at least 1.");
    if (form.freeEpisodes < 0) errs.push("Free episodes cannot be negative.");
    if (form.freeEpisodes > form.totalEpisodes) errs.push("Free episodes cannot exceed total episodes.");
    if (form.rating < 0 || form.rating > 5) errs.push("Rating must be between 0 and 5.");
    if (form.year < 2000 || form.year > 2030) errs.push("Year must be between 2000 and 2030.");
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(form);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-dark-900 border border-dark-700 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-dark-800 rounded-lg text-dark-400">
            <X size={20} />
          </button>
        </div>

        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-xl">
            {errors.map((err, i) => (
              <p key={i} className="text-xs text-danger flex items-center gap-1.5">
                <AlertCircle size={12} className="shrink-0" /> {err}
              </p>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" placeholder="Movie title" />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Slug *</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" placeholder="movie-slug" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Synopsis</label>
            <textarea value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} rows={3}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent resize-none" placeholder="Movie synopsis..." />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Country</label>
              <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent">
                <option>China</option><option>Korea</option><option>Japan</option><option>Thailand</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Movie["category"] })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent">
                <option value="drama">Drama</option><option value="movie">Movie</option>
                <option value="anime">Anime</option><option value="donghua">Donghua</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "Ongoing" | "Completed" })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent">
                <option>Ongoing</option><option>Completed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Total Eps</label>
              <input type="number" min={1} value={form.totalEpisodes}
                onChange={(e) => setForm({ ...form, totalEpisodes: parseInt(e.target.value) || 0 })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Free Eps</label>
              <input type="number" min={0} value={form.freeEpisodes}
                onChange={(e) => setForm({ ...form, freeEpisodes: parseInt(e.target.value) || 0 })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Rating</label>
              <input type="number" step="0.1" min={0} max={5} value={form.rating}
                onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Provider</label>
              <select value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent">
                <option value="">Select provider</option>
                {providers.filter((p) => !p.isComingSoon).map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Genre (comma sep.)</label>
              <input type="text" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" placeholder="Romance, Drama" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="modalVip" checked={form.isVipOnly}
              onChange={(e) => setForm({ ...form, isVipOnly: e.target.checked })}
              className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-accent focus:ring-accent" />
            <label htmlFor="modalVip" className="text-sm text-dark-300">VIP Only</label>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 bg-dark-800 hover:bg-dark-700 text-white text-sm rounded-xl transition-all">Cancel</button>
            <button onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent hover:bg-accent-dark text-dark-950 font-bold text-sm rounded-xl transition-all">
              <Save size={16} /> {title.includes("Edit") ? "Save Changes" : "Add Movie"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminMoviesPage() {
  const [movieList, setMovieList] = useState<Movie[]>(initialMovies);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Movie | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = movieList.filter((m: Movie) => {
    const matchSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === "all" || m.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const handleAdd = (data: MovieFormData) => {
    const movie: Movie = {
      id: `m${Date.now()}`,
      slug: data.slug || data.title.toLowerCase().replace(/\s+/g, "-"),
      title: data.title,
      synopsis: data.synopsis,
      coverImage: `https://picsum.photos/seed/${data.slug || Date.now()}/300/450`,
      country: data.country,
      status: data.status,
      genre: data.genre.split(",").map((g: string) => g.trim()).filter(Boolean),
      provider: data.provider || "CubeTV",
      providerSlug: (data.provider || "cubetv").toLowerCase().replace(/\s+/g, ""),
      rating: data.rating,
      views: 0,
      totalEpisodes: data.totalEpisodes,
      freeEpisodes: data.freeEpisodes,
      year: data.year,
      isVipOnly: data.isVipOnly,
      isTrending: false,
      isNew: true,
      category: data.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMovieList((prev: Movie[]) => [movie, ...prev]);
    showToast(`"${movie.title}" has been added successfully.`);
  };

  const handleEdit = (data: MovieFormData) => {
    if (!editTarget) return;
    setMovieList((prev: Movie[]) =>
      prev.map((m: Movie) =>
        m.id === editTarget.id
          ? {
              ...m,
              title: data.title,
              slug: data.slug,
              synopsis: data.synopsis,
              country: data.country,
              status: data.status,
              genre: data.genre.split(",").map((g: string) => g.trim()).filter(Boolean),
              provider: data.provider || m.provider,
              providerSlug: (data.provider || m.providerSlug).toLowerCase().replace(/\s+/g, ""),
              rating: data.rating,
              totalEpisodes: data.totalEpisodes,
              freeEpisodes: data.freeEpisodes,
              year: data.year,
              isVipOnly: data.isVipOnly,
              category: data.category,
              updatedAt: new Date().toISOString(),
            }
          : m
      )
    );
    setEditTarget(null);
    showToast(`"${data.title}" has been updated successfully.`);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const movie = movieList.find((m: Movie) => m.id === deleteTarget);
    setMovieList((prev: Movie[]) => prev.filter((m: Movie) => m.id !== deleteTarget));
    setDeleteTarget(null);
    showToast(`"${movie?.title}" has been deleted.`, "error");
  };

  const movieToForm = (m: Movie): MovieFormData => ({
    title: m.title, slug: m.slug, synopsis: m.synopsis, country: m.country,
    status: m.status, genre: m.genre.join(", "), provider: m.provider,
    rating: m.rating, totalEpisodes: m.totalEpisodes, freeEpisodes: m.freeEpisodes,
    year: m.year, category: m.category, isVipOnly: m.isVipOnly,
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-slide-up text-sm font-medium",
          toast.type === "success" ? "bg-success/20 text-success border border-success/30" : "bg-danger/20 text-danger border border-danger/30"
        )}>
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Movies</h1>
          <p className="text-sm text-dark-400">{movieList.length} total movies</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-dark-950 font-bold text-sm rounded-xl transition-all">
          <Plus size={16} /> Add Movie
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 flex-1">
          <Search size={16} className="text-dark-500 mr-2 shrink-0" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies..." className="bg-transparent text-sm text-white placeholder:text-dark-500 focus:outline-none w-full" />
        </div>
        <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1">
          {["all", "drama", "movie", "anime", "donghua"].map((cat) => (
            <button key={cat} onClick={() => setFilterCategory(cat)}
              className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize",
                filterCategory === cat ? "bg-accent text-dark-950 font-bold" : "text-dark-400 hover:text-white hover:bg-dark-700")}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider">Movie</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider hidden md:table-cell">Provider</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider hidden lg:table-cell">Episodes</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider hidden lg:table-cell">Views</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {filtered.map((movie: Movie) => (
                <tr key={movie.id} className="hover:bg-dark-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded-lg overflow-hidden bg-dark-800 shrink-0">
                        <img src={movie.coverImage} alt={movie.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate max-w-[200px]">{movie.title}</p>
                        <p className="text-[11px] text-dark-500">{movie.country} · {movie.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-dark-300 hidden md:table-cell">{movie.provider}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="px-2 py-1 bg-dark-800 text-dark-300 text-xs rounded-lg capitalize">{movie.category}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-dark-300 hidden lg:table-cell">{movie.freeEpisodes}/{movie.totalEpisodes} free</td>
                  <td className="px-4 py-3 text-sm text-dark-300 hidden lg:table-cell">{(movie.views / 1000).toFixed(1)}K</td>
                  <td className="px-4 py-3">
                    <span className={cn("px-2 py-1 text-xs font-medium rounded-lg",
                      movie.status === "Completed" ? "bg-success/10 text-success" : "bg-accent/10 text-accent")}>
                      {movie.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`/movie/${movie.slug}`} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-primary transition-colors" title="View on site">
                        <Eye size={15} />
                      </a>
                      <button onClick={() => setEditTarget(movie)}
                        className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-accent transition-colors" title="Edit movie">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(movie.id)}
                        className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-danger transition-colors" title="Delete movie">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-dark-400 text-sm">No movies found matching your criteria.</div>
        )}
      </div>

      {/* Add Modal */}
      <MovieFormModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAdd} initial={emptyForm} title="Add New Movie" />

      {/* Edit Modal */}
      {editTarget && (
        <MovieFormModal isOpen={true} onClose={() => setEditTarget(null)} onSubmit={handleEdit} initial={movieToForm(editTarget)} title={`Edit: ${editTarget.title}`} />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-dark-900 border border-dark-700 rounded-2xl p-6 max-w-sm w-full animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-2">Delete Movie</h3>
            <p className="text-sm text-dark-400 mb-1">Are you sure you want to delete:</p>
            <p className="text-sm text-white font-semibold mb-4">&quot;{movieList.find((m: Movie) => m.id === deleteTarget)?.title}&quot;</p>
            <p className="text-xs text-danger mb-6">This action cannot be undone and will also delete all episodes.</p>
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
