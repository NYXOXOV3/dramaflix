"use client";

import { useState, useEffect } from "react";
import { useData } from "@/lib/data-store";
import type { Movie } from "@/lib/types";
import { Search, Download, Star, Film, Tv, Loader2, Check, AlertCircle, Eye, Plus, ExternalLink, X } from "lucide-react";
import { cn } from "@/lib/utils";

const TMDB_KEY_STORAGE = "dramaflix_tmdb_api_key";

interface TmdbSearchResult {
  id: number; title: string; originalTitle: string; synopsis: string;
  coverImage: string; bannerImage: string; rating: number; year: number; popularity: number;
}

interface TmdbDetailData {
  id: number; title: string; originalTitle: string; synopsis: string;
  coverImage: string; bannerImage: string; rating: number; year: number;
  genres: string[]; country: string; status: string; runtime: number;
  totalEpisodes: number; totalSeasons: number;
}

export default function ImportTmdbPage() {
  const { addMovie, countries } = useData();
  const [apiKey, setApiKey] = useState("");
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"movie" | "tv">("movie");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<TmdbSearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<TmdbDetailData | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [importForm, setImportForm] = useState({ videoUrl: "", isVipOnly: false, category: "movie" as Movie["category"] });

  useEffect(() => {
    const stored = localStorage.getItem(TMDB_KEY_STORAGE);
    if (stored) setApiKey(stored);
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setResults([]);
    setSelectedId(null);
    setDetail(null);
    try {
      const res = await fetch(`/api/tmdb?action=search&type=${searchType}&q=${encodeURIComponent(query.trim())}&key=${encodeURIComponent(apiKey)}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.results);
        setTotalResults(data.total);
      } else {
        showToast(data.error || "Search failed", "error");
      }
    } catch {
      showToast("Network error", "error");
    }
    setSearching(false);
  };

  const handleSelect = async (id: number) => {
    setSelectedId(id);
    setDetailLoading(true);
    setDetail(null);
    try {
      const type = searchType === "tv" ? "tv" : "movie";
      const res = await fetch(`/api/tmdb?id=${id}&type=${type}&key=${encodeURIComponent(apiKey)}`);
      const data = await res.json();
      if (data.success) {
        setDetail(data.data);
        setImportForm({
          videoUrl: "",
          isVipOnly: false,
          category: searchType === "tv" ? "tvshow" : "movie",
        });
      } else {
        showToast(data.error || "Failed to fetch details", "error");
      }
    } catch {
      showToast("Network error", "error");
    }
    setDetailLoading(false);
  };

  const handleImport = () => {
    if (!detail) return;
    setImporting(true);

    const slug = detail.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    const movie: Movie = {
      id: `tmdb-${detail.id}-${Date.now()}`,
      slug: slug || `tmdb-${detail.id}`,
      title: detail.title,
      originalTitle: detail.originalTitle,
      synopsis: detail.synopsis,
      coverImage: detail.coverImage,
      bannerImage: detail.bannerImage,
      videoUrl: importForm.videoUrl || undefined,
      tmdbId: detail.id,
      country: detail.country || "Unknown",
      status: detail.status === "Ended" || detail.status === "Released" ? "Completed" : "Ongoing",
      genre: detail.genres || [],
      provider: importForm.category === "drama" ? "None" : "None",
      providerSlug: "none",
      rating: detail.rating,
      views: 0,
      totalEpisodes: detail.totalEpisodes || (importForm.category === "movie" ? 1 : 10),
      freeEpisodes: importForm.isVipOnly ? 0 : (importForm.category === "movie" ? 1 : 3),
      year: detail.year,
      isVipOnly: importForm.isVipOnly,
      isTrending: false,
      isNew: true,
      category: importForm.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addMovie(movie);
    showToast(`"${movie.title}" imported successfully!`);
    setImporting(false);
    setSelectedId(null);
    setDetail(null);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={cn("fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-slide-up text-sm font-medium",
          toast.type === "success" ? "bg-success/20 text-success border border-success/30" : "bg-danger/20 text-danger border border-danger/30")}>
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}{toast.message}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Download size={24} className="text-accent" /> Import from TMDB
        </h1>
        <p className="text-sm text-dark-400 mt-1">Search and import movies or TV shows directly from TMDB into your library.</p>
      </div>

      {/* API Key Warning */}
      {!apiKey && (
        <div className="p-4 bg-accent/10 border border-accent/30 rounded-xl">
          <p className="text-sm text-accent flex items-center gap-2">
            <AlertCircle size={16} />
            No TMDB API key found. <a href="/admin/tmdb-settings" className="underline font-medium">Set it in TMDB Settings</a> first.
          </p>
        </div>
      )}

      {/* Search */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 flex-1">
            <Search size={16} className="text-dark-500 mr-2 shrink-0" />
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by title... (e.g. Breaking Bad, Inception, Squid Game)"
              className="bg-transparent text-sm text-white placeholder:text-dark-500 focus:outline-none w-full"
              disabled={!apiKey}
            />
          </div>
          <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1 shrink-0">
            <button onClick={() => setSearchType("movie")}
              className={cn("flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg transition-all",
                searchType === "movie" ? "bg-accent text-dark-950 font-bold" : "text-dark-400 hover:text-white hover:bg-dark-700")}>
              <Film size={14} /> Movie
            </button>
            <button onClick={() => setSearchType("tv")}
              className={cn("flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg transition-all",
                searchType === "tv" ? "bg-accent text-dark-950 font-bold" : "text-dark-400 hover:text-white hover:bg-dark-700")}>
              <Tv size={14} /> TV Show
            </button>
          </div>
          <button onClick={handleSearch} disabled={!query.trim() || searching || !apiKey}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark disabled:opacity-50 text-dark-950 font-bold text-sm rounded-xl transition-all shrink-0">
            {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Search
          </button>
        </div>
        {totalResults > 0 && <p className="text-xs text-dark-500">{totalResults} results found</p>}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search Results */}
        <div className="flex-1">
          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSelect(r.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-3 rounded-xl text-left transition-all",
                    selectedId === r.id ? "bg-accent/10 border border-accent/30" : "bg-dark-900 border border-dark-800 hover:border-dark-700"
                  )}
                >
                  <div className="w-14 h-20 rounded-lg overflow-hidden bg-dark-800 shrink-0">
                    {r.coverImage ? <img src={r.coverImage} alt={r.title} className="w-full h-full object-cover" /> : (
                      <div className="w-full h-full flex items-center justify-center text-dark-600"><Film size={20} /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{r.title}</p>
                    {r.originalTitle && r.originalTitle !== r.title && <p className="text-[11px] text-dark-500 truncate">{r.originalTitle}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      {r.year > 0 && <span className="text-xs text-dark-400">{r.year}</span>}
                      {r.rating > 0 && <span className="flex items-center gap-0.5 text-xs text-accent"><Star size={10} fill="currentColor" />{r.rating}</span>}
                    </div>
                    <p className="text-[11px] text-dark-500 line-clamp-2 mt-1">{r.synopsis}</p>
                  </div>
                  {selectedId === r.id && <Check size={18} className="text-accent shrink-0" />}
                </button>
              ))}
            </div>
          )}
          {searching && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="text-accent animate-spin" />
            </div>
          )}
        </div>

        {/* Detail + Import Panel */}
        {detail && (
          <div className="lg:w-96 shrink-0">
            <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden sticky top-4">
              {detail.bannerImage && (
                <div className="h-32 overflow-hidden">
                  <img src={detail.bannerImage} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-white">{detail.title}</h3>
                  {detail.originalTitle && <p className="text-xs text-dark-400 italic">{detail.originalTitle}</p>}
                  <div className="flex items-center gap-2 mt-2 text-xs text-dark-400">
                    {detail.year > 0 && <span>{detail.year}</span>}
                    <span>·</span>
                    <span className="flex items-center gap-0.5 text-accent"><Star size={10} fill="currentColor" />{detail.rating}</span>
                    {detail.runtime > 0 && <><span>·</span><span>{detail.runtime} min</span></>}
                    {detail.totalEpisodes > 0 && <><span>·</span><span>{detail.totalEpisodes} eps</span></>}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {detail.genres.map((g) => (
                    <span key={g} className="px-2 py-0.5 bg-dark-800 text-dark-300 text-[10px] rounded">{g}</span>
                  ))}
                </div>

                <p className="text-xs text-dark-400 line-clamp-4 leading-relaxed">{detail.synopsis}</p>

                <div className="text-[11px] text-dark-500 space-y-1">
                  <p>Country: {detail.country}</p>
                  <p>Status: {detail.status}</p>
                  <p>TMDB ID: {detail.id}</p>
                </div>

                {/* Import Options */}
                <div className="pt-3 border-t border-dark-800 space-y-3">
                  <p className="text-xs font-semibold text-white">Import Options</p>
                  <div>
                    <label className="block text-[11px] font-medium text-dark-300 mb-1">Category</label>
                    <select value={importForm.category} onChange={(e) => setImportForm({ ...importForm, category: e.target.value as Movie["category"] })}
                      className="w-full bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent">
                      <option value="movie">Movie</option>
                      <option value="tvshow">TV Show</option>
                      <option value="drama">Drama</option>
                      <option value="anime">Anime</option>
                      <option value="donghua">Donghua</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-dark-300 mb-1">Video URL (optional - add later)</label>
                    <input type="url" value={importForm.videoUrl} onChange={(e) => setImportForm({ ...importForm, videoUrl: e.target.value })}
                      className="w-full bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                      placeholder="https://..." />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={importForm.isVipOnly}
                      onChange={(e) => setImportForm({ ...importForm, isVipOnly: e.target.checked })}
                      className="w-3.5 h-3.5 rounded border-dark-600 bg-dark-800 text-accent focus:ring-accent" />
                    <span className="text-xs text-dark-300">VIP Only</span>
                  </label>
                </div>

                <button onClick={handleImport} disabled={importing}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-dark disabled:opacity-50 text-dark-950 font-bold text-sm rounded-xl transition-all">
                  {importing ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {importing ? "Importing..." : "Import to Library"}
                </button>

                <button onClick={() => { setSelectedId(null); setDetail(null); }}
                  className="w-full py-2 text-dark-400 hover:text-white text-xs transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {detailLoading && (
          <div className="lg:w-96 shrink-0 flex items-center justify-center py-12">
            <Loader2 size={32} className="text-accent animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
