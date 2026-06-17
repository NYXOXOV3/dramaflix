"use client";

import { useDataStore } from "@/lib/data-store";
import MovieCard from "@/components/MovieCard";
import Carousel from "@/components/Carousel";
import PromoBanner from "@/components/PromoBanner";
import RankingSection from "@/components/RankingSection";
import HeroSection from "@/components/HeroSection";

export default function HomePage() {
  const { movies, getTrendingMovies, getNewMovies, getMoviesByCategory } = useDataStore();
  const trending = getTrendingMovies();
  const newMovies = getNewMovies();
  const animeList = getMoviesByCategory("anime");
  const donghuaList = getMoviesByCategory("donghua");
  const heroMovie = trending[0] || movies[0];

  const promoExpiry = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-10 py-6">
      {heroMovie && <HeroSection movie={heroMovie} />}

      <div className="max-w-7xl mx-auto space-y-10">
        <PromoBanner
          title="VIP Lifetime - 50% OFF!"
          subtitle="Get unlimited access to all providers forever. Limited time offer!"
          ctaText="Get VIP Now"
          ctaHref="/vip"
          expiresAt={promoExpiry}
        />

        <Carousel title="Picks For You" seeMoreHref="/?sort=popular">
          {trending.map((m) => (
            <div key={m.id} className="w-[140px] sm:w-[160px] md:w-[180px] shrink-0">
              <MovieCard movie={m} />
            </div>
          ))}
        </Carousel>

        <section>
          <h2 className="text-lg font-extrabold text-white mb-4 px-4 lg:px-0">Popular Today</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4 lg:px-0">
            {movies.slice(0, 6).map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </section>

        <RankingSection />

        {newMovies.length > 0 && (
          <Carousel title="New Releases" seeMoreHref="/?sort=latest">
            {newMovies.map((m) => (
              <div key={m.id} className="w-[140px] sm:w-[160px] md:w-[180px] shrink-0">
                <MovieCard movie={m} />
              </div>
            ))}
          </Carousel>
        )}

        {animeList.length > 0 && (
          <Carousel title="Anime Picks" seeMoreHref="/anime">
            {animeList.map((m) => (
              <div key={m.id} className="w-[140px] sm:w-[160px] md:w-[180px] shrink-0">
                <MovieCard movie={m} />
              </div>
            ))}
          </Carousel>
        )}

        {donghuaList.length > 0 && (
          <Carousel title="Donghua" seeMoreHref="/donghua">
            {donghuaList.map((m) => (
              <div key={m.id} className="w-[140px] sm:w-[160px] md:w-[180px] shrink-0">
                <MovieCard movie={m} />
              </div>
            ))}
          </Carousel>
        )}

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple/20 via-dark-800 to-primary/20 border border-dark-700 p-6 md:p-8 text-center">
          <h3 className="text-xl font-extrabold text-white mb-2">Refer Friends, Earn 15% Commission</h3>
          <p className="text-sm text-dark-300 mb-4">Share your referral link and earn from every VIP subscription.</p>
          <a href="/referral" className="inline-flex px-6 py-2.5 bg-purple hover:bg-purple/80 text-white font-bold text-sm rounded-lg transition-all">
            Start Referring
          </a>
        </div>
      </div>
    </div>
  );
}
