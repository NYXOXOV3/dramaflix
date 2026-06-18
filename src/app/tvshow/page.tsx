"use client";

import { useData } from "@/lib/data-store";
import MovieCard from "@/components/MovieCard";

export default function TvShowsPage() {
  const { getMoviesByCategory } = useData();
  const tvShows = getMoviesByCategory("tvshow");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">TV Shows</h1>
      <p className="text-sm text-dark-400 mb-8">{tvShows.length} TV shows available</p>
      {tvShows.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tvShows.map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-dark-400">No TV shows available yet. Add some from the admin panel!</p>
        </div>
      )}
    </div>
  );
}
