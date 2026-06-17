import Link from "next/link";
import type { Movie } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { Play, Star, Eye, Crown, Sparkles } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  variant?: "default" | "wide" | "ranking";
  rank?: number;
}

export default function MovieCard({ movie, variant = "default", rank }: MovieCardProps) {
  if (variant === "ranking") {
    return (
      <Link href={`/movie/${movie.slug}`} className="group flex items-center gap-4 p-3 hover:bg-dark-800/50 rounded-xl transition-all">
        <span className={cn(
          "text-2xl font-extrabold w-8 text-center shrink-0",
          rank === 1 ? "text-accent" : rank === 2 ? "text-dark-300" : rank === 3 ? "text-amber-700" : "text-dark-500"
        )}>
          {rank}
        </span>
        <div className="relative w-14 h-20 rounded-lg overflow-hidden shrink-0">
          <img src={movie.coverImage} alt={movie.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white truncate group-hover:text-accent transition-colors">{movie.title}</h4>
          <p className="text-xs text-dark-400 mt-1">{movie.provider} · {movie.totalEpisodes} Eps</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-accent"><Star size={12} fill="currentColor" />{movie.rating}</span>
            <span className="flex items-center gap-1 text-xs text-dark-400"><Eye size={12} />{formatNumber(movie.views)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/movie/${movie.slug}`} className="group relative flex flex-col">
      {/* Thumbnail */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-dark-800">
        <img
          src={movie.coverImage}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-accent/90 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play size={20} className="text-dark-950 ml-0.5" fill="currentColor" />
          </div>
        </div>
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {movie.isNew && (
            <span className="flex items-center gap-1 bg-success/90 text-dark-950 text-[10px] font-bold px-2 py-0.5 rounded-md">
              <Sparkles size={10} /> NEW
            </span>
          )}
          {movie.isVipOnly && (
            <span className="flex items-center gap-1 bg-accent/90 text-dark-950 text-[10px] font-bold px-2 py-0.5 rounded-md">
              <Crown size={10} /> VIP
            </span>
          )}
        </div>
        {/* Rating */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-accent text-[11px] font-bold px-2 py-0.5 rounded-md">
          <Star size={10} fill="currentColor" /> {movie.rating}
        </div>
        {/* Episode Count */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
          {movie.totalEpisodes} Eps
        </div>
      </div>

      {/* Info */}
      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-accent transition-colors leading-snug">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-dark-400">{movie.provider}</span>
          <span className="w-1 h-1 rounded-full bg-dark-600" />
          <span className="text-[11px] text-dark-400">{movie.country}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {movie.genre.slice(0, 2).map((g) => (
            <span key={g} className="text-[10px] text-dark-500 bg-dark-800 px-1.5 py-0.5 rounded">{g}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
