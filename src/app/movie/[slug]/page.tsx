import Link from "next/link";
import { notFound } from "next/navigation";
import { getMovieBySlug, generateEpisodes } from "@/lib/mock-data";
import { Star, Play, Crown, Heart, Share2, Download, ArrowLeft, Lock } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface MovieDetailPageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: MovieDetailPageProps) {
  const movie = getMovieBySlug(params.slug);
  if (!movie) return { title: "Not Found" };
  return {
    title: movie.title,
    description: movie.synopsis,
    openGraph: {
      title: movie.title,
      description: movie.synopsis,
      images: [movie.coverImage],
    },
  };
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const movie = getMovieBySlug(params.slug);
  if (!movie) notFound();

  const episodes = generateEpisodes(movie.id, movie.totalEpisodes, movie.freeEpisodes);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="w-full md:w-72 shrink-0">
          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-dark-800 shadow-2xl">
            <img src={movie.coverImage} alt={movie.title} className="w-full h-full object-cover" />
            {movie.isVipOnly && (
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-accent/90 text-dark-950 text-xs font-bold px-3 py-1 rounded-lg">
                <Crown size={14} /> VIP Only
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">{movie.title}</h1>
            {movie.originalTitle && (
              <p className="text-sm text-dark-400 italic mt-1">{movie.originalTitle}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1 text-accent font-bold">
              <Star size={14} fill="currentColor" /> {movie.rating}
            </span>
            <span className="text-dark-400">|</span>
            <span className="text-dark-300">{movie.country}</span>
            <span className="text-dark-400">|</span>
            <span className="text-dark-300">{movie.status}</span>
            <span className="text-dark-400">|</span>
            <span className="text-dark-300">{movie.year}</span>
            <span className="text-dark-400">|</span>
            <span className="text-dark-300">{movie.totalEpisodes} Episodes</span>
            <span className="text-dark-400">|</span>
            <span className="flex items-center gap-1 text-dark-300">
              <Play size={12} /> {formatNumber(movie.views)} views
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {movie.genre.map((g) => (
              <span key={g} className="px-3 py-1 bg-dark-800 text-dark-300 text-xs font-medium rounded-lg border border-dark-700">
                {g}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm text-dark-400">
            Provider: <span className="text-white font-medium">{movie.provider}</span>
          </div>

          <p className="text-sm text-dark-300 leading-relaxed">{movie.synopsis}</p>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`/watch/${movie.slug}/1`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-dark-950 font-bold rounded-xl transition-all shadow-lg shadow-accent/20"
            >
              <Play size={18} fill="currentColor" /> Start Watching
            </Link>
            <button className="inline-flex items-center gap-2 px-4 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl transition-all">
              <Heart size={18} /> My List
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl transition-all">
              <Share2 size={18} /> Share
            </button>
            <Link
              href="/download"
              className="inline-flex items-center gap-2 px-4 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl transition-all"
            >
              <Download size={18} /> App
            </Link>
          </div>

          {!movie.isVipOnly && movie.freeEpisodes > 0 && (
            <p className="text-xs text-dark-500">
              {movie.freeEpisodes} free episodes · {movie.totalEpisodes} total episodes
            </p>
          )}
        </div>
      </div>

      {/* Episode List */}
      <section className="mt-10">
        <h2 className="text-lg font-extrabold text-white mb-4">
          Episodes ({movie.totalEpisodes})
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {episodes.map((ep) => (
            <Link
              key={ep.id}
              href={ep.isFree ? `/watch/${movie.slug}/${ep.episodeNumber}` : "#"}
              className={`relative flex items-center justify-center h-12 rounded-lg text-sm font-medium transition-all ${
                ep.isFree
                  ? "bg-dark-800 hover:bg-accent hover:text-dark-950 text-white border border-dark-700 hover:border-accent"
                  : "bg-dark-900 text-dark-600 border border-dark-800 cursor-not-allowed"
              }`}
            >
              {ep.episodeNumber}
              {ep.isVipOnly && (
                <Lock size={10} className="absolute top-1 right-1 text-accent" />
              )}
            </Link>
          ))}
        </div>
        {movie.isVipOnly || movie.freeEpisodes < movie.totalEpisodes ? (
          <div className="mt-6 p-4 bg-dark-800/50 border border-accent/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm text-white font-semibold">
                {movie.isVipOnly ? "This drama is VIP exclusive" : `Unlock all ${movie.totalEpisodes} episodes`}
              </p>
              <p className="text-xs text-dark-400 mt-1">Upgrade to VIP to access all content without restrictions.</p>
            </div>
            <Link
              href="/vip"
              className="shrink-0 px-5 py-2.5 bg-accent hover:bg-accent-dark text-dark-950 font-bold text-sm rounded-lg transition-all"
            >
              Upgrade VIP
            </Link>
          </div>
        ) : null}
      </section>
    </div>
  );
}
