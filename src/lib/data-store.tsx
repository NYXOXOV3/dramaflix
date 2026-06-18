"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import type { Movie, Episode, Provider } from "@/lib/types";
import {
  movies as seedMovies,
  providers as seedProviders,
  generateEpisodes as seedGenerateEpisodes,
} from "@/lib/mock-data";

// ============================================================
// MODULE-LEVEL SINGLETON STORE
// This guarantees ALL components share the same data regardless
// of React Context tree structure or layout boundaries.
// ============================================================

const MOVIES_KEY = "dramaflix_movies";
const PROVIDERS_KEY = "dramaflix_providers";
const EPISODES_KEY = "dramaflix_episodes";
const CHANGE_EVENT = "dramaflix:data-changed";

// The single source of truth - module-level variables
let _movies: Movie[] = [];
let _providers: Provider[] = [];
let _episodesMap: Record<string, Episode[]> = {};
let _initialized = false;
let _mutationCounter = 0; // Incremented on every mutation for reliable snapshots

// ---- LocalStorage helpers ----
function loadLS<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveLS(key: string, data: unknown) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* quota */ }
}

// ---- Notify all subscribers ----
function notify() {
  _mutationCounter++;
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

// ---- Initialize once ----
function initStore() {
  if (_initialized) return;
  _initialized = true;

  const storedMovies = loadLS<Movie[]>(MOVIES_KEY);
  const storedProviders = loadLS<Provider[]>(PROVIDERS_KEY);
  const storedEpisodes = loadLS<Record<string, Episode[]>>(EPISODES_KEY);

  _movies = (storedMovies && storedMovies.length > 0) ? storedMovies : [...seedMovies];
  _providers = (storedProviders && storedProviders.length > 0) ? storedProviders : [...seedProviders];
  _episodesMap = storedEpisodes || {};

  // Persist initial state
  saveLS(MOVIES_KEY, _movies);
  saveLS(PROVIDERS_KEY, _providers);
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
// useSyncExternalStore for guaranteed cross-component sync
// ============================================================

function subscribe(callback: () => void) {
  const handler = () => callback();
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}

function getSnapshot() {
  // Return a monotonically increasing counter that changes on every mutation
  return _mutationCounter;
}

function getServerSnapshot() {
  return seedMovies.length + seedProviders.length;
}

// ============================================================
// THE HOOK - Every component that calls this will auto-update
// when ANY data changes anywhere in the app
// ============================================================

export function useData() {
  // Force re-render when data changes
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Initialize on first client render
  useEffect(() => { initStore(); notify(); }, []);

  // Return stable references to all data + CRUD operations
  return {
    // Data (always reads from module-level singleton)
    get movies() { return _movies; },
    get providers() { return _providers; },

    // Movie CRUD
    addMovie,
    updateMovie,
    deleteMovie,

    // Provider CRUD
    addProvider,
    updateProvider,
    deleteProvider,

    // Episodes
    getEpisodes,
    setEpisodes,

    // Queries
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
