"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Movie, Episode, Provider, Country } from "@/lib/types";
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

let _movies: Movie[] = [];
let _providers: Provider[] = [];
let _countries: Country[] = [];
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
    _episodesMap = loadLS<Record<string, Episode[]>>(EPISODES_KEY) ?? {};
  } else {
    // First-ever visit - seed with defaults
    _movies = [...seedMovies];
    _providers = [...seedProviders];
    _countries = [...seedCountries];
    _episodesMap = {};
    saveLS(INIT_FLAG_KEY, true);
  }

  // Persist current state
  saveLS(MOVIES_KEY, _movies);
  saveLS(PROVIDERS_KEY, _providers);
  saveLS(COUNTRIES_KEY, _countries);
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
  const mult = period === "daily" ? 1 : period === "weekly" ? 3 : period === "monthly" ? 7 : 30;
  return [..._movies].sort((a, b) => (b.views * mult * (b.rating / 5)) - (a.views * mult * (a.rating / 5))).slice(0, 10);
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

    addMovie,
    updateMovie,
    deleteMovie,

    addProvider,
    updateProvider,
    deleteProvider,

    addCountry,
    updateCountry,
    deleteCountry,

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
  };
}
