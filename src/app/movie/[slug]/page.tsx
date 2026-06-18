"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useData } from "@/lib/data-store";
import { Star, Play, Crown, Heart, Share2, Download, ArrowLeft, Lock, ExternalLink, Clapperboard } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { Movie, Episode } from "@/lib/types";

interface TmdbData {
  title: string; originalTitle: string; synopsis: string; coverImage: string;
  bannerImage: string; rating: number; year: number; genres: string[];
  country: string; runtime: number; cast: { name: string; character: string; photo: string }[];
  trailers: { key: string; name: string }[];
  similar: { id: number; title: string; poster: string; rating: number }[];
}

export default function MovieDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { getMovieBySlug, getEpisodes } = useData();
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [tmdb, setTmdb] = useState<TmdbData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tmdbLoading, setTmdbLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      const m = getMovieBySlug(slug);
      setMovie(m);
      if (m && m.category !== "movie") {
        setEpisodes(getEpisodes(m.id, m.totalEpisodes, m.freeEpisodes));
      }
      setLoading(false);
    }
  }, [slug, getMovieBySlug, getEpisodes]);

  // Fetch TMDB data if tmdbId is set
  useEffect(() => {
    if (movie?.tmdbId) {
      setTmdbLoading(true);
      const type = movie.category === "tvshow" ? "tv" : "movie";
      const apiKey = typeof window !== "undefined" ? localStorage.getItem("dramaflix_tmdb_api_key") || "" : "";
      fetch(`/api/tmdb?id=${movie.tmdbId}&type=${type}&key=${encodeURIComponent(apiKey)}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) setTmdb(res.data);
        })
        .catch(() => {})
        .finally(() => setTmdbLoading(false));
    }
  }, [movie?.tmdbId, movie?.category]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-12 text-dark-400">Loading...</div>;
  if (!movie) notFound();

  const isDirectPlay = movie.category === "movie";
  const displayTitle = tmdb?.title || movie.title;
  const displaySynopsis = tmdb?.synopsis || movie.synopsis;
  const displayCover = tmdb?.coverImage || movie.coverImage;
  const displayBanner = tmdb?.bannerImage || movie.bannerImage;
  const displayGenres = tmdb?.genres?.length ? tmdb.genres : movie.genre;
  const displayRating = tmdb?.rating || movie.rating;
  const displayYear = tmdb?.year || movie.year;
  const displayCountry = tmdb?.country || movie.country;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      {/* Banner */}
      {displayBanner && (
        <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden mb-6">
          <img src={displayBanner} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-72 shrink-0">
          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-dark-800 shadow-2xl">
            <img src={displayCover} alt={movie.title} className="w-full h-full object-cover" />
            {movie.isVipOnly && (
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-accent/90 text-dark-950 text-xs font-bold px-3 py-1 rounded-lg">
                <Crown size={14} /> VIP Only
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">{displayTitle}</h1>
            {movie.originalTitle && <p className="text-sm text-dark-400 italic mt-1">{movie.originalTitle}</p>}
            {tmdb?.originalTitle && tmdb.originalTitle !== displayTitle && <p className="text-sm text-dark-400 italic mt-1">{tmdb.originalTitle}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1 text-accent font-bold"><Star size={14} fill="currentColor" /> {displayRating}</span>
            <span className="text-dark-400">|</span>
            <span className="text-dark-300">{displayCountry}</span>
            {!isDirectPlay && <><span className="text-dark-400">|</span><span className="text-dark-300">{movie.status}</span></>}
            <span className="text-dark-400">|</span>
            <span className="text-dark-300">{displayYear}</span>
            {isDirectPlay ? (
              <><span className="text-dark-400">|</span><span className="flex items-center gap-1 text-dark-300"><Clapperboard size={12} /> Movie</span></>
            ) : (
              <><span className="text-dark-400">|</span><span className="text-dark-300">{movie.totalEpisodes} Episodes</span></>
            )}
            <span className="text-dark-400">|</span>
            <span className="flex items-center gap-1 text-dark-300"><Play size={12} /> {formatNumber(movie.views)} views</span>
            {tmdb?.runtime ? <><span className="text-dark-400">|</span><span className="text-dark-300">{tmdb.runtime} min</span></> : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {displayGenres.map((g) => (
              <span key={g} className="px-3 py-1 bg-dark-800 text-dark-300 text-xs font-medium rounded-lg border border-dark-700">{g}</span>
            ))}
          </div>

          {movie.provider !== "None" && (
            <div className="flex items-center gap-2 text-sm text-dark-400">
              Provider: <span className="text-white font-medium">{movie.provider}</span>
            </div>
          )}

          <p className="text-sm text-dark-300 leading-relaxed">{displaySynopsis}</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            {isDirectPlay && movie.videoUrl ? (
              <Link href={`/watch/${movie.slug}/play`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-dark-950 font-bold rounded-xl transition-all shadow-lg shadow-accent/20">
                <Play size={18} fill="currentColor" /> Watch Now
              </Link>
            ) : (
              <Link href={`/watch/${movie.slug}/1`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-dark-950 font-bold rounded-xl transition-all shadow-lg shadow-accent/20">
                <Play size={18} fill="currentColor" /> Start Watching
              </Link>
            )}
            <button className="inline-flex items-center gap-2 px-4 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl transition-all">
              <Heart size={18} /> My List
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl transition-all">
              <Share2 size={18} /> Share
            </button>
            <Link href="/download" className="inline-flex items-center gap-2 px-4 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl transition-all">
              <Download size={18} /> App
            </Link>
          </div>

          {/* TMDB Info Badge */}
          {movie.tmdbId && (
            <div className="flex items-center gap-2 text-[11px] text-dark-500">
              <ExternalLink size={10} />
              {tmdbLoading ? "Loading TMDB data..." : tmdb ? "Metadata from TMDB" : "TMDB data unavailable"}
            </div>
          )}
        </div>
      </div>

      {/* TMDB Cast */}
      {tmdb?.cast && tmdb.cast.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-extrabold text-white mb-4">Cast</h2>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {tmdb.cast.map((c, i) => (
              <div key={i} className="shrink-0 w-24 text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-dark-800 mx-auto mb-2">
                  {c.photo ? <img src={c.photo} alt={c.name} className="w-full h-full object-cover" /> : (
                    <div className="w-full h-full flex items-center justify-center text-dark-500 text-xs">{c.name.charAt(0)}</div>
                  )}
                </div>
                <p className="text-xs font-medium text-white truncate">{c.name}</p>
                <p className="text-[10px] text-dark-500 truncate">{c.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TMDB Trailers */}
      {tmdb?.trailers && tmdb.trailers.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-extrabold text-white mb-4">Trailers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tmdb.trailers.map((t) => (
              <a key={t.key} href={`https://youtube.com/watch?v=${t.key}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-dark-800 hover:bg-dark-700 rounded-xl transition-all">
                <div className="w-10 h-10 bg-danger/20 rounded-lg flex items-center justify-center shrink-0">
                  <Play size={16} className="text-danger" fill="currentColor" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{t.name}</p>
                  <p className="text-[11px] text-dark-500">YouTube</p>
                </div>
                <ExternalLink size={14} className="text-dark-500 shrink-0" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Episode List (only for non-movie categories) */}
      {!isDirectPlay && episodes.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-extrabold text-white mb-4">Episodes ({episodes.length})</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {episodes.map((ep) => (
              <Link key={ep.id} href={`/watch/${movie.slug}/${ep.episodeNumber}`}
                className={`relative flex items-center justify-center h-12 rounded-lg text-sm font-medium transition-all ${
                  ep.isFree ? "bg-dark-800 hover:bg-accent hover:text-dark-950 text-white border border-dark-700 hover:border-accent"
                    : "bg-dark-900 text-dark-600 border border-dark-800 hover:border-accent/50"}`}>
                {ep.episodeNumber}
                {ep.isVipOnly && <Lock size={10} className="absolute top-1 right-1 text-accent" />}
              </Link>
            ))}
          </div>
          {(movie.isVipOnly || movie.freeEpisodes < movie.totalEpisodes) && (
            <div className="mt-6 p-4 bg-dark-800/50 border border-accent/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm text-white font-semibold">
                  {movie.isVipOnly ? "This is VIP exclusive" : `Unlock all ${movie.totalEpisodes} episodes`}
                </p>
                <p className="text-xs text-dark-400 mt-1">Upgrade to VIP for unrestricted access.</p>
              </div>
              <Link href="/vip" className="shrink-0 px-5 py-2.5 bg-accent hover:bg-accent-dark text-dark-950 font-bold text-sm rounded-lg transition-all">
                Upgrade VIP
              </Link>
            </div>
          )}
        </section>
      )}

      {/* TMDB Similar */}
      {tmdb?.similar && tmdb.similar.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-extrabold text-white mb-4">Similar Titles</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {tmdb.similar.map((s) => (
              <div key={s.id} className="group">
                <div className="aspect-[2/3] rounded-xl overflow-hidden bg-dark-800 mb-2">
                  {s.poster ? <img src={s.poster} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : (
                    <div className="w-full h-full flex items-center justify-center text-dark-500 text-xs">{s.title}</div>
                  )}
                </div>
                <p className="text-xs font-medium text-white truncate">{s.title}</p>
                <p className="text-[10px] text-accent"><Star size={8} fill="currentColor" /> {s.rating.toFixed(1)}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
