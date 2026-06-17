"use client";

import { useState } from "react";
import { movies as initialMovies, providers } from "@/lib/mock-data";
import type { Movie } from "@/lib/types";
import { Plus, Search, Edit, Trash2, Eye, Filter, MoreVertical, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminMoviesPage() {
  const [movieList, setMovieList] = useState<Movie[]>(initialMovies);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New movie form state
  const [newMovie, setNewMovie] = useState({
    title: "", slug: "", synopsis: "", coverImage: "", country: "China",
    status: "Ongoing" as "Ongoing" | "Completed", genre: "", provider: "",
    rating: 4.0, totalEpisodes: 10, freeEpisodes: 3, year: 2025,
    category: "drama" as Movie["category"], isVipOnly: false,
  });

  const filtered = movieList.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === "all" || m.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const handleDelete = (id: string) => {
    setMovieList((prev) => prev.filter((m) => m.id !== id));
    setShowDeleteModal(null);
  };

  const handleAddMovie = () => {
    if (!newMovie.title || !newMovie.slug) return;
    const movie: Movie = {
      id: `m${Date.now()}`,
      slug: newMovie.slug || newMovie.title.toLowerCase().replace(/\s+/g, "-"),
      title: newMovie.title,
      synopsis: newMovie.synopsis,
      coverImage: `https://picsum.photos/seed/${newMovie.slug}/300/450`,
      country: newMovie.country,
      status: newMovie.status,
      genre: newMovie.genre.split(",").map((g) => g.trim()).filter(Boolean),
      provider: newMovie.provider || "CubeTV",
      providerSlug: newMovie.provider.toLowerCase().replace(/\s+/g, ""),
      rating: newMovie.rating,
      views: 0,
      totalEpisodes: newMovie.totalEpisodes,
      freeEpisodes: newMovie.freeEpisodes,
      year: newMovie.year,
      isVipOnly: newMovie.isVipOnly,
      isTrending: false,
      isNew: true,
      category: newMovie.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMovieList((prev) => [movie, ...prev]);
    setShowAddModal(false);
    setNewMovie({
      title: "", slug: "", synopsis: "", coverImage: "", country: "China",
      status: "Ongoing", genre: "", provider: "", rating: 4.0,
      totalEpisodes: 10, freeEpisodes: 3, year: 2025, category: "drama", isVipOnly: false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Movies</h1>
          <p className="text-sm text-dark-400">{movieList.length} total movies</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-dark-950 font-bold text-sm rounded-xl transition-all"
        >
          <Plus size={16} /> Add Movie
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 flex-1">
          <Search size={16} className="text-dark-500 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies..."
            className="bg-transparent text-sm text-white placeholder:text-dark-500 focus:outline-none w-full"
          />
        </div>
        <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1">
          {["all", "drama", "movie", "anime", "donghua"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize",
                filterCategory === cat ? "bg-accent text-dark-950 font-bold" : "text-dark-400 hover:text-white hover:bg-dark-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
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
              {filtered.map((movie) => (
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
                  <td className="px-4 py-3 text-sm text-dark-300 hidden lg:table-cell">
                    {movie.freeEpisodes}/{movie.totalEpisodes} free
                  </td>
                  <td className="px-4 py-3 text-sm text-dark-300 hidden lg:table-cell">
                    {(movie.views / 1000).toFixed(1)}K
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-lg",
                      movie.status === "Completed" ? "bg-success/10 text-success" : "bg-accent/10 text-accent"
                    )}>
                      {movie.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-primary transition-colors" title="View">
                        <Eye size={15} />
                      </button>
                      <button className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-accent transition-colors" title="Edit">
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(movie.id)}
                        className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-danger transition-colors"
                        title="Delete"
                      >
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(null)} />
          <div className="relative bg-dark-900 border border-dark-700 rounded-2xl p-6 max-w-sm w-full animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-2">Delete Movie</h3>
            <p className="text-sm text-dark-400 mb-6">Are you sure? This action cannot be undone and will also delete all episodes.</p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white text-sm rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="px-4 py-2 bg-danger hover:bg-danger/80 text-white text-sm font-bold rounded-xl transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Movie Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-dark-900 border border-dark-700 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Add New Movie</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-dark-800 rounded-lg text-dark-400">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Title *</label>
                  <input
                    type="text" value={newMovie.title} onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
                    placeholder="Movie title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Slug *</label>
                  <input
                    type="text" value={newMovie.slug} onChange={(e) => setNewMovie({ ...newMovie, slug: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
                    placeholder="movie-slug"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Synopsis</label>
                <textarea
                  value={newMovie.synopsis} onChange={(e) => setNewMovie({ ...newMovie, synopsis: e.target.value })}
                  rows={3}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent resize-none"
                  placeholder="Movie synopsis..."
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Country</label>
                  <select
                    value={newMovie.country} onChange={(e) => setNewMovie({ ...newMovie, country: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
                  >
                    <option>China</option><option>Korea</option><option>Japan</option><option>Thailand</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Category</label>
                  <select
                    value={newMovie.category} onChange={(e) => setNewMovie({ ...newMovie, category: e.target.value as Movie["category"] })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
                  >
                    <option value="drama">Drama</option><option value="movie">Movie</option>
                    <option value="anime">Anime</option><option value="donghua">Donghua</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Status</label>
                  <select
                    value={newMovie.status} onChange={(e) => setNewMovie({ ...newMovie, status: e.target.value as "Ongoing" | "Completed" })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
                  >
                    <option>Ongoing</option><option>Completed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Total Episodes</label>
                  <input type="number" value={newMovie.totalEpisodes}
                    onChange={(e) => setNewMovie({ ...newMovie, totalEpisodes: parseInt(e.target.value) || 0 })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Free Episodes</label>
                  <input type="number" value={newMovie.freeEpisodes}
                    onChange={(e) => setNewMovie({ ...newMovie, freeEpisodes: parseInt(e.target.value) || 0 })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Rating</label>
                  <input type="number" step="0.1" min="0" max="5" value={newMovie.rating}
                    onChange={(e) => setNewMovie({ ...newMovie, rating: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Provider</label>
                  <select
                    value={newMovie.provider} onChange={(e) => setNewMovie({ ...newMovie, provider: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
                  >
                    <option value="">Select provider</option>
                    {providers.filter((p) => !p.isComingSoon).map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">Genre (comma separated)</label>
                  <input
                    type="text" value={newMovie.genre} onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
                    placeholder="Romance, Drama"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox" id="isVip" checked={newMovie.isVipOnly}
                  onChange={(e) => setNewMovie({ ...newMovie, isVipOnly: e.target.checked })}
                  className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-accent focus:ring-accent"
                />
                <label htmlFor="isVip" className="text-sm text-dark-300">VIP Only</label>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-dark-800 hover:bg-dark-700 text-white text-sm rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMovie}
                  disabled={!newMovie.title || !newMovie.slug}
                  className="flex-1 py-2.5 bg-accent hover:bg-accent-dark disabled:opacity-50 text-dark-950 font-bold text-sm rounded-xl transition-all"
                >
                  Add Movie
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
