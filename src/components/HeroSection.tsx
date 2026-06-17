import Link from "next/link";
import { Play, Star, Info } from "lucide-react";
import type { Movie } from "@/lib/types";

interface HeroSectionProps {
  movie: Movie;
}

export default function HeroSection({ movie }: HeroSectionProps) {
  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={movie.bannerImage || movie.coverImage}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/80 to-dark-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="max-w-lg space-y-4 animate-slide-up">
          <div className="flex items-center gap-2">
            {movie.isTrending && (
              <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-bold rounded-md">#1 Trending</span>
            )}
            <span className="px-2 py-1 bg-dark-800/80 text-dark-200 text-xs font-medium rounded-md">{movie.country}</span>
            <span className="px-2 py-1 bg-dark-800/80 text-dark-200 text-xs font-medium rounded-md">{movie.status}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            {movie.title}
          </h1>

          {movie.originalTitle && (
            <p className="text-sm text-dark-400 italic">{movie.originalTitle}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-dark-300">
            <span className="flex items-center gap-1 text-accent font-bold">
              <Star size={14} fill="currentColor" /> {movie.rating}
            </span>
            <span>{movie.totalEpisodes} Episodes</span>
            <span>{movie.year}</span>
            <span className="flex items-center gap-1">{movie.provider}</span>
          </div>

          <p className="text-sm text-dark-300 line-clamp-3 leading-relaxed">{movie.synopsis}</p>

          <div className="flex items-center gap-3 pt-2">
            <Link
              href={`/watch/${movie.slug}/1`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-dark-950 font-bold rounded-xl transition-all shadow-lg shadow-accent/20"
            >
              <Play size={18} fill="currentColor" /> Start Watching
            </Link>
            <Link
              href={`/movie/${movie.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-dark-700/80 hover:bg-dark-600 text-white font-medium rounded-xl transition-all backdrop-blur-sm"
            >
              <Info size={18} /> Details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
