"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Movie, Episode, Provider } from "@/lib/types";
import {
  movies as seedMovies,
  providers as seedProviders,
  generateEpisodes as seedGenerateEpisodes,
} from "@/lib/mock-data";

// ============ STORAGE KEYS ============
const MOVIES_KEY = "dramaflix_movies";
const PROVIDERS_KEY = "dramaflix_providers";
const EPISODES_KEY = "dramaflix_episodes"; // keyed by movieId

// ============ TYPES ============
interface DataStoreContextType {
  movies: Movie[];
  providers: Provider[];
  getEpisodes: (movieId: string, totalEps: number, freeEps: number) => Episode[];

  // Movie CRUD
  addMovie: (movie: Movie) => void;
  updateMovie: (id: string, data: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
  getMovieBySlug: (slug: string) => Movie | undefined;
  searchMovies: (query: string) => Movie[];
  getMoviesByCategory: (cat: Movie["category"]) => Movie[];
  getMoviesByProvider: (slug: string) => Movie[];
  getTrendingMovies: () => Movie[];
  getNewMovies: () => Movie[];
  getRankings: (period: "daily" | "weekly" | "monthly" | "yearly") => Movie[];

  // Provider CRUD
  addProvider: (provider: Provider) => void;
  updateProvider: (id: string, data: Partial<Provider>) => void;
  deleteProvider: (id: string) => void;
  getProviderBySlug: (slug: string) => Provider | undefined;

  // Episode management
  setEpisodes: (movieId: string, episodes: Episode[]) => void;
}

const DataStoreContext = createContext<DataStoreContextType | null>(null);

export function useDataStore() {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error("useDataStore must be used within DataStoreProvider");
  return ctx;
}

// ============ HELPERS ============
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
  } catch { /* ignore */ }
  return fallback;
}

function saveToStorage<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* ignore quota errors */ }
}

// ============ PROVIDER COMPONENT ============
export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>(() => loadFromStorage(MOVIES_KEY, seedMovies));
  const [providers, setProviders] = useState<Provider[]>(() => loadFromStorage(PROVIDERS_KEY, seedProviders));
  const [episodesMap, setEpisodesMap] = useState<Record<string, Episode[]>>(() =>
    loadFromStorage(EPISODES_KEY, {} as Record<string, Episode[]>)
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const storedMovies = loadFromStorage<Movie[]>(MOVIES_KEY, []);
    const storedProviders = loadFromStorage<Provider[]>(PROVIDERS_KEY, []);
    const storedEpisodes = loadFromStorage<Record<string, Episode[]>>(EPISODES_KEY, {});

    setMovies(storedMovies.length > 0 ? storedMovies : seedMovies);
    setProviders(storedProviders.length > 0 ? storedProviders : seedProviders);
    setEpisodesMap(storedEpisodes);
    setIsHydrated(true);
  }, []);

  // Persist to localStorage on changes
  useEffect(() => { if (isHydrated) saveToStorage(MOVIES_KEY, movies); }, [movies, isHydrated]);
  useEffect(() => { if (isHydrated) saveToStorage(PROVIDERS_KEY, providers); }, [providers, isHydrated]);
  useEffect(() => { if (isHydrated) saveToStorage(EPISODES_KEY, episodesMap); }, [episodesMap, isHydrated]);

  // ============ EPISODE MANAGEMENT ============
  const getEpisodes = useCallback((movieId: string, totalEps: number, freeEps: number): Episode[] => {
    if (episodesMap[movieId] && episodesMap[movieId].length > 0) {
      return episodesMap[movieId];
    }
    // Generate fallback episodes
    return seedGenerateEpisodes(movieId, totalEps, freeEps);
  }, [episodesMap]);

  const setEpisodes = useCallback((movieId: string, episodes: Episode[]) => {
    setEpisodesMap((prev) => ({ ...prev, [movieId]: episodes }));
  }, []);

  // ============ MOVIE CRUD ============
  const addMovie = useCallback((movie: Movie) => {
    setMovies((prev) => [movie, ...prev]);
  }, []);

  const updateMovie = useCallback((id: string, data: Partial<Movie>) => {
    setMovies((prev) => prev.map((m) => (m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m)));
  }, []);

  const deleteMovie = useCallback((id: string) => {
    setMovies((prev) => prev.filter((m) => m.id !== id));
    setEpisodesMap((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }, []);

  const getMovieBySlugFn = useCallback((slug: string) => movies.find((m) => m.slug === slug), [movies]);

  const searchMoviesFn = useCallback((query: string) => {
    const q = query.toLowerCase();
    return movies.filter(
      (m) => m.title.toLowerCase().includes(q) || m.synopsis.toLowerCase().includes(q) ||
        m.genre.some((g) => g.toLowerCase().includes(q)) || m.provider.toLowerCase().includes(q)
    );
  }, [movies]);

  const getMoviesByCategoryFn = useCallback((cat: Movie["category"]) => movies.filter((m) => m.category === cat), [movies]);
  const getMoviesByProviderFn = useCallback((slug: string) => movies.filter((m) => m.providerSlug === slug), [movies]);
  const getTrendingFn = useCallback(() => movies.filter((m) => m.isTrending), [movies]);
  const getNewFn = useCallback(() => movies.filter((m) => m.isNew), [movies]);

  const getRankingsFn = useCallback((period: "daily" | "weekly" | "monthly" | "yearly") => {
    const mult = period === "daily" ? 1 : period === "weekly" ? 3 : period === "monthly" ? 7 : 30;
    return [...movies].sort((a, b) => (b.views * mult * (b.rating / 5)) - (a.views * mult * (a.rating / 5))).slice(0, 10);
  }, [movies]);

  // ============ PROVIDER CRUD ============
  const addProvider = useCallback((provider: Provider) => {
    setProviders((prev) => [...prev, provider]);
  }, []);

  const updateProvider = useCallback((id: string, data: Partial<Provider>) => {
    setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  }, []);

  const deleteProvider = useCallback((id: string) => {
    setProviders((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getProviderBySlugFn = useCallback((slug: string) => providers.find((p) => p.slug === slug), [providers]);

  return (
    <DataStoreContext.Provider value={{
      movies, providers, getEpisodes,
      addMovie, updateMovie, deleteMovie,
      getMovieBySlug: getMovieBySlugFn,
      searchMovies: searchMoviesFn,
      getMoviesByCategory: getMoviesByCategoryFn,
      getMoviesByProvider: getMoviesByProviderFn,
      getTrendingMovies: getTrendingFn,
      getNewMovies: getNewFn,
      getRankings: getRankingsFn,
      addProvider, updateProvider, deleteProvider,
      getProviderBySlug: getProviderBySlugFn,
      setEpisodes,
    }}>
      {children}
    </DataStoreContext.Provider>
  );
}
