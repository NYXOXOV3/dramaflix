"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Search, Film, ArrowLeft } from "lucide-react";
import { useData } from "@/lib/data-store";
import MovieCard from "@/components/MovieCard";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { searchMovies } = useData();
  const results = query ? searchMovies(query) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Search size={24} className="text-accent" />
          <h1 className="text-2xl font-extrabold text-white">
            {query ? (
              <>
                Results for &ldquo;<span className="gradient-text">{query}</span>&rdquo;
              </>
            ) : (
              "Search"
            )}
          </h1>
        </div>
        <p className="text-sm text-dark-400">
          {results.length} {results.length === 1 ? "result" : "results"} found
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Film size={36} className="text-dark-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No results found</h2>
          <p className="text-sm text-dark-400 max-w-md mx-auto mb-6">
            {query
              ? `We couldn't find any dramas matching "${query}". Try a different keyword or browse our categories.`
              : "Enter a search term to find dramas, movies, and anime."}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-dark-950 font-bold rounded-xl transition-all"
            >
              Browse Home
            </Link>
            <Link
              href="/anime"
              className="inline-flex items-center gap-2 px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white font-medium rounded-xl transition-all"
            >
              Explore Anime
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-dark-800 rounded-lg" />
            <div className="h-4 w-48 bg-dark-800/50 rounded" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-dark-800 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
