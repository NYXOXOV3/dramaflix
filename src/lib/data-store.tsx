"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Movie, Episode, Provider, Country, Tag } from "@/lib/types";
import {
  movies as seedMovies,
  providers as seedProviders,
  generateEpisodes as seedGenerateEpisodes,
} from "@/lib/mock-data";

// ============================================================
// MODULE-LEVEL SINGLETON STORE
// ============================================================

const MOVIES_KEY = "dramaflix_movies";
const PROVIDERS_KEY = "dramaflix_providers";
const EPISODES_KEY = "dramaflix_episodes";
const COUNTRIES_KEY = "dramaflix_countries";
const TAGS_KEY = "dramaflix_tags";
const INIT_FLAG_KEY = "dramaflix_store_init";
const CHANGE_EVENT = "dramaflix:data-changed";

// Default countries seed
const seedCountries: Country[] = [
  { id: "c1", name: "China", code: "CN", flag: "🇨🇳" },
  { id: "c2", name: "Korea", code: "KR", flag: "🇰🇷" },
  { id: "c3", name: "Japan", code: "JP", flag: "🇯🇵" },
  { id: "c4", name: "Thailand", code: "TH", flag: "🇹🇭" },
  { id: "c5", name: "United States", code: "US", flag: "🇺🇸" },
  { id: "c6", name: "United Kingdom", code: "GB", flag: "🇬🇧" },
  { id: "c7", name: "Indonesia", code: "ID", flag: "🇮🇩" },
];

// Default seed tags
const seedTags: Tag[] = [
  { id: "tag-new", name: "NEW", slug: "new", color: "#ffffff", bgColor: "#00e676", priority: 1 },
  { id: "tag-hot", name: "HOT", slug: "hot", color: "#ffffff", bgColor: "#ef4444", priority: 2 },
  { id: "tag-trending", name: "Trending", slug: "trending", color: "#ffffff", bgColor: "#f59e0b", priority: 3 },
  { id: "tag-top", name: "Top Rated", slug: "top-rated", color: "#ffffff", bgColor: "#a855f7", priority: 4 },
  { id: "tag-vip", name: "VIP", slug: "vip", color: "#1a1a1a", bgColor: "#fbbf24", priority: 5 },
  { id: "tag-movie", name: "Movie", slug: "movie", color: "#ffffff", bgColor: "#3b82f6", priority: 6 },
  { id: "tag-tvshow", name: "TV Show", slug: "tv-show", color: "#ffffff", bgColor: "#06b6d4", priority: 7 },
  { id: "tag-anime", name: "Anime", slug: "anime", color: "#ffffff", bgColor: "#ec4899", priority: 8 },
  { id: "tag-donghua", name: "Donghua", slug: "donghua", color: "#ffffff", bgColor: "#14b8a6", priority: 9 },
];

let _movies: Movie[] = [];
let _providers: Provider[] = [];
let _countries: Country[] = [];
let _tags: Tag[] = [];
let _episodesMap: Record<string, Episode[]> = {};
let _initialized = false;
let _version = 0;

// ---- LocalStorage ----
function loadLS<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveLS(key: string, data: unknown) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* quota */ }
}

function notify() {
  _version++;
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: _version }));
}

// ---- Init (FIXED: uses flag to distinguish first-visit vs empty-data) ----
function initStore() {
  if (_initialized) return;
  _initialized = true;

  const wasInitializedBefore = loadLS<boolean>(INIT_FLAG_KEY) === true;

  if (wasInitializedBefore) {
    // Returning user - trust localStorage EXACTLY as-is (even if empty)
    _movies = loadLS<Movie[]>(MOVIES_KEY) ?? [];
    _providers = loadLS<Provider[]>(PROVIDERS_KEY) ?? [];
    _countries = loadLS<Country[]>(COUNTRIES_KEY) ?? [];
    _tags = loadLS<Tag[]>(TAGS_KEY) ?? [];
    _episodesMap = loadLS<Record<string, Episode[]>>(EPISODES_KEY) ?? {};
  } else {
    // First-ever visit - seed with defaults
    _movies = [...seedMovies];
    _providers = [...seedProviders];
    _countries = [...seedCountries];
    _tags = [...seedTags];
    _episodesMap = {};
    saveLS(INIT_FLAG_KEY, true);
  }

  // Persist current state
  saveLS(MOVIES_KEY, _movies);
  saveLS(PROVIDERS_KEY, _providers);
  saveLS(COUNTRIES_KEY, _countries);
  saveLS(TAGS_KEY, _tags);
  saveLS(EPISODES_KEY, _episodesMap);
}

// ---- Movie CRUD ----
function addMovie(movie: Movie) {
  _movies = [movie, ..._movies];
  saveLS(MOVIES_KEY, _movies);
  notify();
}

function updateMovie(id: string, data: Partial<Movie>) {
  _movies = _movies.map((m) => m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m);
  saveLS(MOVIES_KEY, _movies);
  notify();
}

function deleteMovie(id: string) {
  _movies = _movies.filter((m) => m.id !== id);
  const eps = { ..._episodesMap };
  delete eps[id];
  _episodesMap = eps;
  saveLS(MOVIES_KEY, _movies);
  saveLS(EPISODES_KEY, _episodesMap);
  notify();
}

// ---- Provider CRUD ----
function addProvider(provider: Provider) {
  _providers = [..._providers, provider];
  saveLS(PROVIDERS_KEY, _providers);
  notify();
}

function updateProvider(id: string, data: Partial<Provider>) {
  _providers = _providers.map((p) => p.id === id ? { ...p, ...data } : p);
  saveLS(PROVIDERS_KEY, _providers);
  notify();
}

function deleteProvider(id: string) {
  _providers = _providers.filter((p) => p.id !== id);
  saveLS(PROVIDERS_KEY, _providers);
  notify();
}

// ---- Country CRUD ----
function addCountry(country: Country) {
  _countries = [..._countries, country];
  saveLS(COUNTRIES_KEY, _countries);
  notify();
}

function updateCountry(id: string, data: Partial<Country>) {
  _countries = _countries.map((c) => c.id === id ? { ...c, ...data } : c);
  saveLS(COUNTRIES_KEY, _countries);
  notify();
}

function deleteCountry(id: string) {
  _countries = _countries.filter((c) => c.id !== id);
  saveLS(COUNTRIES_KEY, _countries);
  notify();
}

// ---- Tag CRUD ----
function addTag(tag: Tag) {
  _tags = [..._tags, tag];
  saveLS(TAGS_KEY, _tags);
  notify();
}

function updateTag(id: string, data: Partial<Tag>) {
  _tags = _tags.map((t) => t.id === id ? { ...t, ...data } : t);
  saveLS(TAGS_KEY, _tags);
  notify();
}

function deleteTag(id: string) {
  _tags = _tags.filter((t) => t.id !== id);
  saveLS(TAGS_KEY, _tags);
  notify();
}

function getTags() { return [..._tags].sort((a, b) => a.priority - b.priority); }

// ---- Episode management ----
function setEpisodes(movieId: string, episodes: Episode[]) {
  _episodesMap = { ..._episodesMap, [movieId]: episodes };
  saveLS(EPISODES_KEY, _episodesMap);
  notify();
}

function getEpisodes(movieId: string, totalEps: number, freeEps: number): Episode[] {
  if (_episodesMap[movieId] && _episodesMap[movieId].length > 0) {
    return _episodesMap[movieId];
  }
  return seedGenerateEpisodes(movieId, totalEps, freeEps);
}

// ---- Query helpers ----
function getMovieBySlug(slug: string) { return _movies.find((m) => m.slug === slug); }
function getProviderBySlug(slug: string) { return _providers.find((p) => p.slug === slug); }
function searchMovies(query: string) {
  const q = query.toLowerCase();
  return _movies.filter((m) =>
    m.title.toLowerCase().includes(q) || m.synopsis.toLowerCase().includes(q) ||
    m.genre.some((g) => g.toLowerCase().includes(q)) || m.provider.toLowerCase().includes(q)
  );
}
function getMoviesByCategory(cat: Movie["category"]) { return _movies.filter((m) => m.category === cat); }
function getMoviesByProvider(slug: string) { return _movies.filter((m) => m.providerSlug === slug); }
function getTrendingMovies() { return _movies.filter((m) => m.isTrending); }
function getNewMovies() { return _movies.filter((m) => m.isNew); }
function getRankings(period: "daily" | "weekly" | "monthly" | "yearly") {
  // Sort purely by total views (most viewed first)
  return [..._movies].sort((a, b) => b.views - a.views).slice(0, 10);
}

// ---- Picks For You (top rated + most viewed combined score) ----
function getPicksForYou(limit = 12) {
  return [..._movies]
    .map((m) => ({
      movie: m,
      // Combined score: 60% rating weight + 40% views weight (normalized)
      score: (m.rating / 5) * 0.6 + (m.views / Math.max(..._movies.map((x) => x.views), 1)) * 0.4,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.movie);
}

// ---- Most Viewed ----
function getMostViewed(limit = 6) {
  return [..._movies].sort((a, b) => b.views - a.views).slice(0, limit);
}

// ---- View counting ----
function incrementView(movieId: string) {
  _movies = _movies.map((m) => m.id === movieId ? { ...m, views: m.views + 1 } : m);
  saveLS(MOVIES_KEY, _movies);
  notify();
}

// ---- Rating ----
const RATINGS_KEY = "dramaflix_ratings";

function rateMovie(movieId: string, rating: number, userId?: string) {
  // Update movie's average rating
  const raw = loadLS<Record<string, Array<{ userId: string; rating: number; date: string }>>>(RATINGS_KEY) || {};
  if (!raw[movieId]) raw[movieId] = [];
  // Remove existing rating from same user/guest
  const key = userId || "guest_" + (typeof window !== "undefined" ? localStorage.getItem("dramaflix_guest_id") || "anon" : "anon");
  raw[movieId] = raw[movieId].filter((r) => r.userId !== key);
  raw[movieId].push({ userId: key, rating, date: new Date().toISOString() });
  saveLS(RATINGS_KEY, raw);
  // Recalculate average
  const ratings = raw[movieId];
  const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  _movies = _movies.map((m) => m.id === movieId ? { ...m, rating: Math.round(avg * 10) / 10 } : m);
  saveLS(MOVIES_KEY, _movies);
  notify();
}

function getUserRating(movieId: string, userId?: string): number {
  const raw = loadLS<Record<string, Array<{ userId: string; rating: number }>>>(RATINGS_KEY) || {};
  const key = userId || "guest_" + (typeof window !== "undefined" ? localStorage.getItem("dramaflix_guest_id") || "anon" : "anon");
  const entry = (raw[movieId] || []).find((r) => r.userId === key);
  return entry?.rating || 0;
}

// ---- Guest ID ----
function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return "anon";
  let id = localStorage.getItem("dramaflix_guest_id");
  if (!id) {
    id = "guest_" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("dramaflix_guest_id", id);
  }
  return id;
}

// ============================================================
// useSyncExternalStore - reliable cross-component sync
// ============================================================

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  // Also listen for storage events from other tabs
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  return _version;
}

function getServerSnapshot() {
  return -1;
}

// ============================================================
// THE HOOK
// ============================================================

export function useData() {
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Initialize store on first client render
  useEffect(() => {
    initStore();
    // Bump version so components that rendered before init get fresh data
    _version++;
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: _version }));
  }, []);

  return {
    get movies() { return _movies; },
    get providers() { return _providers; },
    get countries() { return _countries; },
    get tags() { return _tags; },

    addMovie,
    updateMovie,
    deleteMovie,

    addProvider,
    updateProvider,
    deleteProvider,

    addCountry,
    updateCountry,
    deleteCountry,

    addTag,
    updateTag,
    deleteTag,
    getTags,

    getEpisodes,
    setEpisodes,

    getMovieBySlug,
    getProviderBySlug,
    searchMovies,
    getMoviesByCategory,
    getMoviesByProvider,
    getTrendingMovies,
    getNewMovies,
    getRankings,
    getPicksForYou,
    getMostViewed,

    incrementView,
    rateMovie,
    getUserRating,
    getOrCreateGuestId,
  };
}
