"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useData } from "@/lib/data-store";
import { ArrowLeft, ChevronLeft, ChevronRight, Share2, Lock, Crown, Play } from "lucide-react";
import { useEffect, useState } from "react";
import type { Movie, Episode } from "@/lib/types";

export default function WatchPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const episodeParam = params?.episode as string;
  const { getMovieBySlug, getEpisodes } = useData();
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  const episodeNum = parseInt(episodeParam || "1");

  useEffect(() => {
    if (slug) {
      const m = getMovieBySlug(slug);
      setMovie(m);
      if (m) setEpisodes(getEpisodes(m.id, m.totalEpisodes, m.freeEpisodes));
      setLoading(false);
    }
  }, [slug, getMovieBySlug, getEpisodes]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-12 text-dark-400">Loading...</div>;
  if (!movie) notFound();

  const currentEp = episodes.find((e) => e.episodeNumber === episodeNum);
  const hasPrev = episodeNum > 1;
  const hasNext = episodeNum < movie.totalEpisodes;
  if (!currentEp) notFound();

  const isLocked = currentEp.isVipOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <Link href={`/movie/${movie.slug}`} className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Details
        </Link>
        <button className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors">
          <Share2 size={16} /> Share
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            {isLocked ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900 p-6">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Lock size={36} className="text-accent" />
                </div>
                <h2 className="text-xl font-extrabold text-white mb-2">VIP Exclusive Content</h2>
                <p className="text-sm text-dark-400 text-center max-w-sm mb-6">
                  Episode {episodeNum} is locked for VIP members only. Upgrade to unlock.
                </p>
                <div className="flex items-center gap-3">
                  <Link href="/vip" className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-dark-950 font-bold rounded-xl transition-all shadow-lg shadow-accent/20">
                    <Crown size={18} /> Upgrade VIP
                  </Link>
                  <Link href={`/watch/${movie.slug}/1`} className="inline-flex items-center gap-2 px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white font-medium rounded-xl transition-all">
                    <Play size={18} /> Watch Free Eps
                  </Link>
                </div>
              </div>
            ) : (
              <video key={currentEp.id} src={currentEp.videoUrl || movie.videoUrl || ""} controls autoPlay className="w-full h-full" poster={currentEp.thumbnailUrl || movie.bannerImage || movie.coverImage}>
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <h1 className="text-xl font-extrabold text-white">{movie.title} - Episode {episodeNum}</h1>
            <div className="flex items-center gap-3 text-sm text-dark-400">
              <span>{movie.provider}</span><span>·</span><span>{currentEp.duration} min</span>
              {isLocked ? (
                <><span>·</span><span className="flex items-center gap-1 text-accent font-medium"><Lock size={12} /> VIP Locked</span></>
              ) : (
                <><span>·</span><span className="text-success">Free</span></>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            {hasPrev && (
              <Link href={`/watch/${movie.slug}/${episodeNum - 1}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-dark-800 hover:bg-dark-700 text-white text-sm font-medium rounded-xl transition-all border border-dark-700">
                <ChevronLeft size={16} /> Previous
              </Link>
            )}
            {hasNext && (
              <Link href={`/watch/${movie.slug}/${episodeNum + 1}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-dark-950 text-sm font-bold rounded-xl transition-all">
                Next <ChevronRight size={16} />
              </Link>
            )}
          </div>
        </div>

        <div className="lg:w-72 xl:w-80 shrink-0">
          <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-dark-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Episodes ({episodes.length})</h3>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-success bg-success/10 px-1.5 py-0.5 rounded">{movie.freeEpisodes} free</span>
                <span className="text-accent bg-accent/10 px-1.5 py-0.5 rounded flex items-center gap-0.5"><Lock size={8} /> VIP</span>
              </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto p-2 space-y-1">
              {episodes.map((ep) => {
                const isCurrent = ep.episodeNumber === episodeNum;
                const isEpLocked = ep.isVipOnly;
                return (
                  <Link key={ep.id} href={`/watch/${movie.slug}/${ep.episodeNumber}`}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isCurrent ? "bg-accent/20 border border-accent/40" : "hover:bg-dark-800"}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${isCurrent ? "bg-accent text-dark-950" : isEpLocked ? "bg-accent/10 text-accent" : "bg-dark-800 text-dark-300"}`}>
                      {isEpLocked && !isCurrent ? <Lock size={12} /> : ep.episodeNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${isCurrent ? "text-accent font-semibold" : "text-white"}`}>{ep.title}</p>
                      <p className="text-[11px] text-dark-500">{ep.duration} min</p>
                    </div>
                    {isEpLocked ? (
                      <span className="text-[10px] text-accent font-medium bg-accent/10 px-2 py-0.5 rounded shrink-0 flex items-center gap-0.5"><Crown size={8} /> VIP</span>
                    ) : (
                      <span className="text-[10px] text-success font-medium bg-success/10 px-2 py-0.5 rounded shrink-0">FREE</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-br from-accent/10 to-dark-900 border border-accent/20 rounded-2xl text-center">
            <Crown size={24} className="text-accent mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white mb-1">Unlock All Episodes</h4>
            <p className="text-[11px] text-dark-400 mb-3">Get VIP to watch without restrictions</p>
            <Link href="/vip" className="inline-flex px-4 py-2 bg-accent hover:bg-accent-dark text-dark-950 font-bold text-xs rounded-lg transition-all">
              View VIP Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
