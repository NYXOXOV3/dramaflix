"use client";

import { useState, useRef } from "react";
import { useData } from "@/lib/data-store";
import { generateEpisodes as fallbackGenerate } from "@/lib/mock-data";
import type { Movie, Episode } from "@/lib/types";
import {
  Plus, Search, Edit, Trash2, Eye, X, Check, Save, AlertCircle,
  Image, Film, Link2, Lock, Unlock, Crown, Upload, ListVideo, ChevronDown, ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============ TYPES ============
interface MovieFormData {
  title: string; slug: string; synopsis: string; country: string;
  status: "Ongoing" | "Completed"; genre: string; provider: string;
  rating: number; totalEpisodes: number; freeEpisodes: number; year: number;
  category: Movie["category"]; isVipOnly: boolean;
  coverImage: string; bannerImage: string; videoUrl: string;
}

interface EpisodeFormData {
  episodeNumber: number; title: string; duration: number;
  videoUrl: string; thumbnailUrl: string; embedType: "direct" | "iframe";
  isVipLocked: boolean;
}

const emptyForm: MovieFormData = {
  title: "", slug: "", synopsis: "", country: "China",
  status: "Ongoing", genre: "", provider: "", rating: 4.0,
  totalEpisodes: 10, freeEpisodes: 3, year: 2025, category: "drama", isVipOnly: false,
  coverImage: "", bannerImage: "", videoUrl: "",
};

// ============ POSTER UPLOAD HELPER ============
function PosterUploader({ label, value, onChange, aspect }: {
  label: string; value: string; onChange: (url: string) => void; aspect: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-dark-300 mb-1.5">{label}</label>
      <div className="flex gap-2">
        {value ? (
          <div className={cn("relative rounded-lg overflow-hidden bg-dark-800 border border-dark-700 shrink-0", aspect)}>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button onClick={() => onChange("")} className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-danger">
              <X size={12} />
            </button>
          </div>
        ) : null}
        <div className="flex-1 flex flex-col gap-2">
          <input
            type="text" value={value.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
            placeholder="Paste image URL..."
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-xl text-xs text-dark-300 hover:text-white transition-all"
          >
            <Upload size={12} /> Upload from device
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>
      </div>
    </div>
  );
}

// ============ MOVIE FORM MODAL ============
function MovieFormModal({ isOpen, onClose, onSubmit, initial, title }: {
  isOpen: boolean; onClose: () => void; onSubmit: (data: MovieFormData) => void;
  initial: MovieFormData; title: string;
}) {
  const { providers: storeProviders } = useData();
  const [form, setForm] = useState<MovieFormData>(initial);
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!form.title.trim()) errs.push("Title is required.");
    if (!form.slug.trim()) errs.push("Slug is required.");
    if (form.totalEpisodes < 1) errs.push("Total episodes must be at least 1.");
    if (form.freeEpisodes < 0) errs.push("Free episodes cannot be negative.");
    if (form.freeEpisodes > form.totalEpisodes) errs.push("Free episodes cannot exceed total.");
    if (form.rating < 0 || form.rating > 5) errs.push("Rating must be between 0 and 5.");
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = () => {
    if (validate()) { onSubmit(form); onClose(); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-dark-900 border border-dark-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-dark-800 rounded-lg text-dark-400"><X size={20} /></button>
        </div>

        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-xl">
            {errors.map((err, i) => <p key={i} className="text-xs text-danger flex items-center gap-1.5"><AlertCircle size={12} className="shrink-0" />{err}</p>)}
          </div>
        )}

        <div className="space-y-5">
          {/* Basic Info */}
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

          {/* Media Section */}
          <div className="pt-2 border-t border-dark-800">
            <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-3 flex items-center gap-1.5"><Image size={12} />Media & Video</p>
            <div className="space-y-4">
              <PosterUploader label="Poster / Cover Image" value={form.coverImage} onChange={(v) => setForm({ ...form, coverImage: v })} aspect="w-16 h-24" />
              <PosterUploader label="Banner Image (optional)" value={form.bannerImage} onChange={(v) => setForm({ ...form, bannerImage: v })} aspect="w-32 h-16" />
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5 flex items-center gap-1.5"><Link2 size={12} />Default Video Embed URL</label>
                <input type="url" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
                  placeholder="https://example.com/video.mp4 or embed URL" />
                <p className="text-[11px] text-dark-500 mt-1">Direct .mp4 URL or embeddable video URL. Individual episodes can override this.</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-2 border-t border-dark-800">
            <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-3 flex items-center gap-1.5"><Film size={12} />Metadata</p>
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
                  <option value="drama">Drama</option><option value="movie">Movie</option><option value="anime">Anime</option><option value="donghua">Donghua</option>
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
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Total Eps</label>
                <input type="number" min={1} value={form.totalEpisodes} onChange={(e) => setForm({ ...form, totalEpisodes: parseInt(e.target.value) || 0 })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Free Eps</label>
                <input type="number" min={0} value={form.freeEpisodes} onChange={(e) => setForm({ ...form, freeEpisodes: parseInt(e.target.value) || 0 })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Rating</label>
                <input type="number" step="0.1" min={0} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Provider</label>
                <select value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent">
                  <option value="">Select provider</option>
                  {storeProviders.filter((p: { isComingSoon: boolean }) => !p.isComingSoon).map((p: { id: string; name: string }) => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Genre (comma sep.)</label>
                <input type="text" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent" placeholder="Romance, Drama" />
              </div>
            </div>
            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input type="checkbox" checked={form.isVipOnly} onChange={(e) => setForm({ ...form, isVipOnly: e.target.checked })}
                className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-accent focus:ring-accent" />
              <span className="text-sm text-dark-300">VIP Only (entire movie)</span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 bg-dark-800 hover:bg-dark-700 text-white text-sm rounded-xl transition-all">Cancel</button>
            <button onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent hover:bg-accent-dark text-dark-950 font-bold text-sm rounded-xl transition-all">
              <Save size={16} />{title.includes("Edit") ? "Save Changes" : "Add Movie"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ EPISODE MANAGER MODAL ============
function EpisodeManagerModal({ movie, onClose, showToast }: {
  movie: Movie; onClose: () => void; showToast: (msg: string, type?: "success" | "error") => void;
}) {
  const { getEpisodes: getStoredEpisodes, setEpisodes: saveEpisodesToStore } = useData();
  const [episodes, setEpisodes] = useState<Episode[]>(() =>
    getStoredEpisodes(movie.id, movie.totalEpisodes, movie.freeEpisodes)
  );
  const [editingEp, setEditingEp] = useState<EpisodeFormData | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [showAddEp, setShowAddEp] = useState(false);

  const emptyEpForm: EpisodeFormData = {
    episodeNumber: episodes.length + 1, title: "", duration: 10,
    videoUrl: "", thumbnailUrl: "", embedType: "direct", isVipLocked: false,
  };

  const openEdit = (ep: Episode, idx: number) => {
    setEditingEp({
      episodeNumber: ep.episodeNumber, title: ep.title, duration: ep.duration,
      videoUrl: ep.videoUrl, thumbnailUrl: ep.thumbnailUrl, embedType: "direct",
      isVipLocked: ep.isVipOnly,
    });
    setEditingIndex(idx);
  };

  const saveEpisode = () => {
    if (!editingEp) return;
    if (!editingEp.videoUrl.trim() && !editingEp.isVipLocked) {
      showToast("Video URL is required for non-VIP episodes.", "error");
      return;
    }
    const updated = episodes.map((ep: Episode, i: number) =>
      i === editingIndex ? {
        ...ep,
        episodeNumber: editingEp.episodeNumber,
        title: editingEp.title || `Episode ${editingEp.episodeNumber}`,
        duration: editingEp.duration,
        videoUrl: editingEp.videoUrl,
        thumbnailUrl: editingEp.thumbnailUrl,
        isFree: !editingEp.isVipLocked,
        isVipOnly: editingEp.isVipLocked,
      } : ep
    );
    setEpisodes(updated);
    saveEpisodesToStore(movie.id, updated);
    setEditingEp(null);
    setEditingIndex(-1);
    showToast(`Episode ${editingEp.episodeNumber} updated.`);
  };

  const addEpisode = () => {
    if (!editingEp) return;
    if (!editingEp.videoUrl.trim()) {
      showToast("Video URL is required.", "error");
      return;
    }
    const newEp: Episode = {
      id: `${movie.id}-ep${editingEp.episodeNumber}`,
      movieId: movie.id,
      episodeNumber: editingEp.episodeNumber,
      title: editingEp.title || `Episode ${editingEp.episodeNumber}`,
      duration: editingEp.duration,
      videoUrl: editingEp.videoUrl,
      thumbnailUrl: editingEp.thumbnailUrl,
      isFree: !editingEp.isVipLocked,
      isVipOnly: editingEp.isVipLocked,
    };
    const updated = [...episodes, newEp].sort((a: Episode, b: Episode) => a.episodeNumber - b.episodeNumber);
    setEpisodes(updated);
    saveEpisodesToStore(movie.id, updated);
    setEditingEp(null);
    setShowAddEp(false);
    showToast(`Episode ${newEp.episodeNumber} added.`);
  };

  const deleteEpisode = (idx: number) => {
    const ep = episodes[idx];
    const updated = episodes.filter((_: Episode, i: number) => i !== idx);
    setEpisodes(updated);
    saveEpisodesToStore(movie.id, updated);
    showToast(`Episode ${ep.episodeNumber} deleted.`, "error");
  };

  const toggleVip = (idx: number) => {
    setEpisodes((prev: Episode[]) => prev.map((ep: Episode, i: number) =>
      i === idx ? { ...ep, isFree: !ep.isFree, isVipOnly: !ep.isVipOnly } : ep
    ));
    const ep = episodes[idx];
    showToast(`Episode ${ep.episodeNumber} ${ep.isVipOnly ? "unlocked (free)" : "locked for VIP"}.`);
  };

  const lockAll = () => {
    const updated = episodes.map((ep: Episode) => ({ ...ep, isFree: false, isVipOnly: true }));
    setEpisodes(updated);
    saveEpisodesToStore(movie.id, updated);
    showToast("All episodes locked for VIP.", "error");
  };

  const unlockAll = () => {
    const updated = episodes.map((ep: Episode) => ({ ...ep, isFree: true, isVipOnly: false }));
    setEpisodes(updated);
    saveEpisodesToStore(movie.id, updated);
    showToast("All episodes unlocked (free).");
  };

  const vipCount = episodes.filter((e: Episode) => e.isVipOnly).length;
  const freeCount = episodes.filter((e: Episode) => e.isFree).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-dark-900 border border-dark-700 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ListVideo size={20} className="text-accent" /> Episodes: {movie.title}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-dark-800 rounded-lg text-dark-400"><X size={20} /></button>
        </div>
        <div className="flex items-center gap-3 mb-4 text-xs text-dark-400">
          <span>{episodes.length} total</span>
          <span className="text-success">{freeCount} free</span>
          <span className="text-accent">{vipCount} VIP locked</span>
          <div className="flex-1" />
          <button onClick={unlockAll} className="px-2.5 py-1 bg-success/10 hover:bg-success/20 text-success rounded-lg transition-all flex items-center gap-1"><Unlock size={12} />Unlock All</button>
          <button onClick={lockAll} className="px-2.5 py-1 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-all flex items-center gap-1"><Lock size={12} />Lock All VIP</button>
          <button onClick={() => { setEditingEp(emptyEpForm); setShowAddEp(true); }}
            className="px-2.5 py-1 bg-accent hover:bg-accent-dark text-dark-950 font-bold rounded-lg transition-all flex items-center gap-1"><Plus size={12} />Add Episode</button>
        </div>

        {/* Episode List */}
        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
          {episodes.map((ep: Episode, idx: number) => (
            <div key={ep.id} className={cn(
              "flex items-center gap-3 p-3 rounded-xl border transition-all",
              ep.isVipOnly ? "bg-accent/5 border-accent/20" : "bg-dark-800/50 border-dark-700/50"
            )}>
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                ep.isVipOnly ? "bg-accent/20 text-accent" : "bg-dark-700 text-dark-300")}>
                {ep.episodeNumber}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{ep.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-dark-500">{ep.duration} min</span>
                  {ep.videoUrl && <span className="text-[11px] text-primary">has video</span>}
                  {!ep.videoUrl && <span className="text-[11px] text-danger">no video URL</span>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => toggleVip(idx)}
                  className={cn("p-1.5 rounded-lg transition-all", ep.isVipOnly ? "bg-accent/20 text-accent hover:bg-accent/30" : "bg-success/10 text-success hover:bg-success/20")}
                  title={ep.isVipOnly ? "Click to unlock (make free)" : "Click to lock for VIP"}>
                  {ep.isVipOnly ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
                <button onClick={() => openEdit(ep, idx)}
                  className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-accent transition-colors" title="Edit episode">
                  <Edit size={14} />
                </button>
                <button onClick={() => deleteEpisode(idx)}
                  className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-danger transition-colors" title="Delete episode">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {episodes.length === 0 && (
          <div className="text-center py-8 text-dark-400 text-sm">
            No episodes yet. Click &quot;Add Episode&quot; to create one.
          </div>
        )}

        {/* Edit/Add Episode Form */}
        {(editingEp !== null && (editingIndex >= 0 || showAddEp)) && (
          <div className="mt-4 pt-4 border-t border-dark-800">
            <h4 className="text-sm font-bold text-white mb-4">
              {showAddEp ? "Add New Episode" : `Edit Episode ${editingEp.episodeNumber}`}
            </h4>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1">Episode #</label>
                  <input type="number" min={1} value={editingEp.episodeNumber}
                    onChange={(e) => setEditingEp({ ...editingEp, episodeNumber: parseInt(e.target.value) || 1 })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1">Title</label>
                  <input type="text" value={editingEp.title}
                    onChange={(e) => setEditingEp({ ...editingEp, title: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                    placeholder={`Episode ${editingEp.episodeNumber}`} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-300 mb-1">Duration (min)</label>
                  <input type="number" min={1} value={editingEp.duration}
                    onChange={(e) => setEditingEp({ ...editingEp, duration: parseInt(e.target.value) || 1 })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1 flex items-center gap-1"><Link2 size={12} />Video URL *</label>
                <input type="url" value={editingEp.videoUrl}
                  onChange={(e) => setEditingEp({ ...editingEp, videoUrl: e.target.value })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                  placeholder="https://example.com/video.mp4 or embed URL" />
                <p className="text-[11px] text-dark-500 mt-1">Direct video URL (.mp4), Google Drive link, or any embeddable video URL.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1 flex items-center gap-1"><Image size={12} />Thumbnail URL</label>
                <input type="url" value={editingEp.thumbnailUrl}
                  onChange={(e) => setEditingEp({ ...editingEp, thumbnailUrl: e.target.value })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                  placeholder="https://example.com/thumb.jpg" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editingEp.isVipLocked}
                  onChange={(e) => setEditingEp({ ...editingEp, isVipLocked: e.target.checked })}
                  className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-accent focus:ring-accent" />
                <Lock size={14} className="text-accent" />
                <span className="text-sm text-dark-300">Lock for VIP only</span>
              </label>
              <div className="flex items-center gap-3 pt-2">
                <button onClick={() => { setEditingEp(null); setEditingIndex(-1); setShowAddEp(false); }}
                  className="flex-1 py-2.5 bg-dark-800 hover:bg-dark-700 text-white text-sm rounded-xl transition-all">Cancel</button>
                <button onClick={showAddEp ? addEpisode : saveEpisode}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent hover:bg-accent-dark text-dark-950 font-bold text-sm rounded-xl transition-all">
                  <Save size={16} />{showAddEp ? "Add Episode" : "Save Episode"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ MAIN PAGE ============
export default function AdminMoviesPage() {
  const { movies: movieList, addMovie, updateMovie, deleteMovie: storeDeleteMovie, providers: storeProviders } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Movie | null>(null);
  const [episodeTarget, setEpisodeTarget] = useState<Movie | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = movieList.filter((m: Movie) => {
    const matchSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === "all" || m.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const handleAdd = (data: MovieFormData) => {
    const movie: Movie = {
      id: `m${Date.now()}`, slug: data.slug || data.title.toLowerCase().replace(/\s+/g, "-"),
      title: data.title, synopsis: data.synopsis,
      coverImage: data.coverImage || `https://picsum.photos/seed/${data.slug || Date.now()}/300/450`,
      bannerImage: data.bannerImage || undefined,
      videoUrl: data.videoUrl || undefined,
      country: data.country, status: data.status,
      genre: data.genre.split(",").map((g: string) => g.trim()).filter(Boolean),
      provider: data.provider || "CubeTV",
      providerSlug: (data.provider || "cubetv").toLowerCase().replace(/\s+/g, ""),
      rating: data.rating, views: 0,
      totalEpisodes: data.totalEpisodes, freeEpisodes: data.freeEpisodes,
      year: data.year, isVipOnly: data.isVipOnly,
      isTrending: false, isNew: true, category: data.category,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    addMovie(movie);
    showToast(`"${movie.title}" added. Use Episode Manager to add episodes.`);
  };

  const handleEdit = (data: MovieFormData) => {
    if (!editTarget) return;
    updateMovie(editTarget.id, {
      title: data.title, slug: data.slug, synopsis: data.synopsis,
      coverImage: data.coverImage || editTarget.coverImage,
      bannerImage: data.bannerImage || editTarget.bannerImage,
      videoUrl: data.videoUrl || editTarget.videoUrl,
      country: data.country, status: data.status,
      genre: data.genre.split(",").map((g: string) => g.trim()).filter(Boolean),
      provider: data.provider || editTarget.provider,
      providerSlug: (data.provider || editTarget.providerSlug).toLowerCase().replace(/\s+/g, ""),
      rating: data.rating, totalEpisodes: data.totalEpisodes, freeEpisodes: data.freeEpisodes,
      year: data.year, isVipOnly: data.isVipOnly, category: data.category,
    });
    setEditTarget(null);
    showToast(`"${data.title}" updated.`);
  };
  
  const handleDelete = () => {
    if (!deleteTarget) return;
    const movie = movieList.find((m: Movie) => m.id === deleteTarget);
    storeDeleteMovie(deleteTarget);
    setDeleteTarget(null);
    showToast(`"${movie?.title}" deleted.`, "error");
  };

  const movieToForm = (m: Movie): MovieFormData => ({
    title: m.title, slug: m.slug, synopsis: m.synopsis, country: m.country,
    status: m.status, genre: m.genre.join(", "), provider: m.provider,
    rating: m.rating, totalEpisodes: m.totalEpisodes, freeEpisodes: m.freeEpisodes,
    year: m.year, category: m.category, isVipOnly: m.isVipOnly,
    coverImage: m.coverImage, bannerImage: m.bannerImage || "", videoUrl: m.videoUrl || "",
  });

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
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase">Movie</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase hidden md:table-cell">Provider</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase hidden lg:table-cell">Episodes</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase hidden lg:table-cell">Views</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dark-400 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-dark-400 uppercase">Actions</th>
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
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-dark-500">{movie.country} · {movie.year}</span>
                          {movie.videoUrl && <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">video</span>}
                        </div>
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
                      <button onClick={() => setEpisodeTarget(movie)}
                        className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-primary transition-colors" title="Manage Episodes">
                        <ListVideo size={15} />
                      </button>
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
        {filtered.length === 0 && <div className="text-center py-12 text-dark-400 text-sm">No movies found.</div>}
      </div>

      <MovieFormModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAdd} initial={emptyForm} title="Add New Movie" />
      {editTarget && <MovieFormModal isOpen={true} onClose={() => setEditTarget(null)} onSubmit={handleEdit} initial={movieToForm(editTarget)} title={`Edit: ${editTarget.title}`} />}

      {episodeTarget && <EpisodeManagerModal movie={episodeTarget} onClose={() => setEpisodeTarget(null)} showToast={showToast} />}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-dark-900 border border-dark-700 rounded-2xl p-6 max-w-sm w-full animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-2">Delete Movie</h3>
            <p className="text-sm text-dark-400 mb-1">Delete:</p>
            <p className="text-sm text-white font-semibold mb-4">&quot;{movieList.find((m: Movie) => m.id === deleteTarget)?.title}&quot;</p>
            <p className="text-xs text-danger mb-6">This also deletes all episodes. Cannot be undone.</p>
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
