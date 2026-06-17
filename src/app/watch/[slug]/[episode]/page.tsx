import Link from "next/link";
import { notFound } from "next/navigation";
import { getMovieBySlug, generateEpisodes } from "@/lib/mock-data";
import { ArrowLeft, ChevronLeft, ChevronRight, Share2, Lock, Crown } from "lucide-react";

interface WatchPageProps {
  params: { slug: string; episode: string };
}

export function generateMetadata({ params }: WatchPageProps) {
  const movie = getMovieBySlug(params.slug);
  if (!movie) return { title: "Not Found" };
  return {
    title: `Watch ${movie.title} - Episode ${params.episode}`,
    description: `Watching ${movie.title} Episode ${params.episode}`,
  };
}

export default function WatchPage({ params }: WatchPageProps) {
  const movie = getMovieBySlug(params.slug);
  if (!movie) notFound();

  const episodeNum = parseInt(params.episode);
  const episodes = generateEpisodes(movie.id, movie.totalEpisodes, movie.freeEpisodes);
  const currentEp = episodes.find((e) => e.episodeNumber === episodeNum);
  const hasPrev = episodeNum > 1;
  const hasNext = episodeNum < movie.totalEpisodes;

  if (!currentEp) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href={`/movie/${movie.slug}`}
          className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Details
        </Link>
        <button className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors">
          <Share2 size={16} /> Share
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Video Player */}
        <div className="flex-1">
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <video
              key={currentEp.id}
              src={currentEp.videoUrl}
              controls
              autoPlay
              className="w-full h-full"
              poster={currentEp.thumbnailUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Episode Info */}
          <div className="mt-4 space-y-2">
            <h1 className="text-xl font-extrabold text-white">
              {movie.title} - Episode {episodeNum}
            </h1>
            <div className="flex items-center gap-3 text-sm text-dark-400">
              <span>{movie.provider}</span>
              <span>·</span>
              <span>{currentEp.duration} min</span>
              {currentEp.isVipOnly && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-accent"><Crown size={12} /> VIP</span>
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-4">
            {hasPrev && (
              <Link
                href={`/watch/${movie.slug}/${episodeNum - 1}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-dark-800 hover:bg-dark-700 text-white text-sm font-medium rounded-xl transition-all border border-dark-700"
              >
                <ChevronLeft size={16} /> Previous
              </Link>
            )}
            {hasNext && (
              <Link
                href={episodes[episodeNum]?.isFree ? `/watch/${movie.slug}/${episodeNum + 1}` : "/vip"}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-dark-950 text-sm font-bold rounded-xl transition-all"
              >
                Next <ChevronRight size={16} />
              </Link>
            )}
          </div>

          {/* Synopsis (Mobile) */}
          <div className="mt-6 lg:hidden">
            <h3 className="text-sm font-bold text-white mb-2">Synopsis</h3>
            <p className="text-xs text-dark-400 leading-relaxed">{movie.synopsis}</p>
          </div>
        </div>

        {/* Episode List Sidebar */}
        <div className="lg:w-72 xl:w-80 shrink-0">
          <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-dark-800">
              <h3 className="text-sm font-bold text-white">Episodes ({movie.totalEpisodes})</h3>
            </div>
            <div className="max-h-[500px] overflow-y-auto p-2 space-y-1">
              {episodes.map((ep) => {
                const isCurrent = ep.episodeNumber === episodeNum;
                return (
                  <Link
                    key={ep.id}
                    href={ep.isFree ? `/watch/${movie.slug}/${ep.episodeNumber}` : "/vip"}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isCurrent
                        ? "bg-accent/20 border border-accent/40"
                        : "hover:bg-dark-800"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCurrent ? "bg-accent text-dark-950" : "bg-dark-800 text-dark-300"
                    }`}>
                      {ep.episodeNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${isCurrent ? "text-accent font-semibold" : "text-white"}`}>
                        Episode {ep.episodeNumber}
                      </p>
                      <p className="text-[11px] text-dark-500">{ep.duration} min</p>
                    </div>
                    {ep.isVipOnly && <Lock size={14} className="text-accent shrink-0" />}
                    {ep.isFree && (
                      <span className="text-[10px] text-success font-medium bg-success/10 px-2 py-0.5 rounded shrink-0">
                        FREE
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
