"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useData } from "@/lib/data-store";
import { ArrowLeft, Share2, Heart, Crown, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import type { Movie } from "@/lib/types";

export default function DirectPlayPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { getMovieBySlug } = useData();
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setMovie(getMovieBySlug(slug));
      setLoading(false);
    }
  }, [slug, getMovieBySlug]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-12 text-dark-400">Loading...</div>;
  if (!movie || !movie.videoUrl) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <Link href={`/movie/${movie.slug}`} className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Details
        </Link>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors">
            <Heart size={16} /> My List
          </button>
          <button className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors">
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
        <video
          src={movie.videoUrl}
          controls
          autoPlay
          className="w-full h-full"
          poster={movie.bannerImage || movie.coverImage}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Movie Info */}
      <div className="mt-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-3">
          <h1 className="text-xl md:text-2xl font-extrabold text-white">{movie.title}</h1>
          {movie.originalTitle && <p className="text-sm text-dark-400 italic">{movie.originalTitle}</p>}

          <div className="flex flex-wrap items-center gap-3 text-sm text-dark-400">
            <span className="text-dark-300">{movie.country}</span>
            <span>·</span>
            <span className="text-dark-300">{movie.year}</span>
            {movie.genre.length > 0 && <><span>·</span><span className="text-dark-300">{movie.genre.join(", ")}</span></>}
            {movie.isVipOnly && <><span>·</span><span className="flex items-center gap-1 text-accent"><Crown size={12} /> VIP</span></>}
          </div>

          <p className="text-sm text-dark-300 leading-relaxed">{movie.synopsis}</p>

          {movie.provider !== "None" && (
            <p className="text-xs text-dark-500">Provider: {movie.provider}</p>
          )}
        </div>

        {/* Sidebar info */}
        <div className="md:w-72 shrink-0">
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4 space-y-3">
            <div className="aspect-[2/3] rounded-xl overflow-hidden bg-dark-800">
              <img src={movie.coverImage} alt={movie.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{movie.title}</p>
              <p className="text-xs text-dark-400 mt-1">{movie.year} · {movie.country}</p>
            </div>
            <Link href={`/movie/${movie.slug}`}
              className="block w-full text-center py-2 bg-dark-800 hover:bg-dark-700 text-white text-sm rounded-xl transition-all">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
