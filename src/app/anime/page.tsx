"use client";

import { useDataStore } from "@/lib/data-store";
import MovieCard from "@/components/MovieCard";

export default function AnimePage() {
  const { getMoviesByCategory } = useDataStore();
  const animeList = getMoviesByCategory("anime");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Anime</h1>
      <p className="text-sm text-dark-400 mb-8">{animeList.length} anime titles available</p>
      {animeList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {animeList.map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
      ) : (
        <div className="text-center py-20"><p className="text-dark-400">No anime available yet. Check back soon!</p></div>
      )}
    </div>
  );
}
