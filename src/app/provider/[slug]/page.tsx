"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useDataStore } from "@/lib/data-store";
import MovieCard from "@/components/MovieCard";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import type { Movie, Provider } from "@/lib/types";

export default function ProviderPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { getProviderBySlug, getMoviesByProvider } = useDataStore();
  const [provider, setProvider] = useState<Provider | undefined>(undefined);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const p = getProviderBySlug(slug);
      setProvider(p);
      if (p) setMovies(getMoviesByProvider(slug));
      setLoading(false);
    }
  }, [slug, getProviderBySlug, getMoviesByProvider]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-12 text-dark-400">Loading...</div>;
  if (!provider) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Home
      </Link>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">{provider.name}</h1>
          {provider.isVipOnly && <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-bold rounded-md">VIP</span>}
        </div>
        <p className="text-sm text-dark-400">{provider.totalMovies} titles available · {movies.length} loaded</p>
      </div>
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-dark-400 text-sm">No dramas from this provider yet.</p>
          <p className="text-dark-500 text-xs mt-2">Content will appear once added via the admin panel.</p>
        </div>
      )}
    </div>
  );
}
