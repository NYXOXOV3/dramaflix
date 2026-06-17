import Link from "next/link";
import { notFound } from "next/navigation";
import { getProviderBySlug, getMoviesByProvider, providers } from "@/lib/mock-data";
import MovieCard from "@/components/MovieCard";
import { ArrowLeft } from "lucide-react";

interface ProviderPageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: ProviderPageProps) {
  const provider = getProviderBySlug(params.slug);
  if (!provider) return { title: "Not Found" };
  return {
    title: `${provider.name} - Dramas`,
    description: `Watch ${provider.totalMovies} dramas from ${provider.name} on DramaFlix.`,
  };
}

export function generateStaticParams() {
  return providers.map((p) => ({ slug: p.slug }));
}

export default function ProviderPage({ params }: ProviderPageProps) {
  const provider = getProviderBySlug(params.slug);
  if (!provider) notFound();

  const movies = getMoviesByProvider(params.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">{provider.name}</h1>
          {provider.isVipOnly && (
            <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-bold rounded-md">VIP</span>
          )}
        </div>
        <p className="text-sm text-dark-400">
          {provider.totalMovies} titles available · {movies.length} loaded in demo
        </p>
      </div>

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-dark-400 text-sm">No dramas available from this provider in the demo.</p>
          <p className="text-dark-500 text-xs mt-2">This provider&apos;s content will be available once connected to the database.</p>
        </div>
      )}
    </div>
  );
}
