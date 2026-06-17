"use client";

import { movies, providers, vipPlans } from "@/lib/mock-data";
import { TrendingUp, Eye, Film, Users, Crown, BarChart3, Globe, Activity } from "lucide-react";

export default function AdminAnalyticsPage() {
  const totalViews = movies.reduce((sum, m) => sum + m.views, 0);
  const avgRating = movies.length > 0 ? (movies.reduce((sum, m) => sum + m.rating, 0) / movies.length).toFixed(1) : "0";
  const topMovies = [...movies].sort((a, b) => b.views - a.views).slice(0, 5);
  const topProviders = [...providers].filter(p => !p.isComingSoon).sort((a, b) => b.totalMovies - a.totalMovies).slice(0, 5);
  const categoryStats = ["drama", "movie", "anime", "donghua"].map(cat => ({
    category: cat,
    count: movies.filter(m => m.category === cat).length,
    views: movies.filter(m => m.category === cat).reduce((s, m) => s + m.views, 0),
  }));

  const countries = Array.from(new Set(movies.map(m => m.country)));
  const countryStats = countries.map(c => ({
    country: c,
    count: movies.filter(m => m.country === c).length,
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Analytics</h1>
        <p className="text-sm text-dark-400">Platform performance overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Views", value: `${(totalViews / 1000).toFixed(1)}K`, icon: Eye, color: "text-accent", bg: "bg-accent/10" },
          { label: "Total Movies", value: movies.length.toString(), icon: Film, color: "text-primary", bg: "bg-primary/10" },
          { label: "Avg Rating", value: avgRating, icon: TrendingUp, color: "text-success", bg: "bg-success/10" },
          { label: "Active Providers", value: providers.filter(p => !p.isComingSoon).length.toString(), icon: Activity, color: "text-purple", bg: "bg-purple/10" },
        ].map(stat => (
          <div key={stat.label} className="p-5 bg-dark-900 border border-dark-800 rounded-2xl">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-2xl font-extrabold text-white">{stat.value}</p>
            <p className="text-xs text-dark-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Movies */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-dark-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2"><BarChart3 size={16} className="text-accent" /> Top Movies by Views</h2>
          </div>
          <div className="divide-y divide-dark-800">
            {topMovies.map((movie, i) => (
              <div key={movie.id} className="flex items-center gap-3 p-4">
                <span className="text-lg font-extrabold w-6 text-center shrink-0" style={{ color: i < 3 ? "#f59e0b" : "#64748b" }}>{i + 1}</span>
                <div className="w-8 h-12 rounded-lg overflow-hidden bg-dark-800 shrink-0">
                  <img src={movie.coverImage} alt={movie.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{movie.title}</p>
                  <p className="text-[11px] text-dark-500">{movie.provider}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-accent">{(movie.views / 1000).toFixed(1)}K</p>
                  <p className="text-[11px] text-dark-500">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4"><Globe size={16} className="text-primary" /> Category Breakdown</h2>
          <div className="space-y-4">
            {categoryStats.map(cat => {
              const maxViews = Math.max(...categoryStats.map(c => c.views), 1);
              const pct = (cat.views / maxViews) * 100;
              return (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-dark-300 capitalize">{cat.category}</span>
                    <span className="text-white font-medium">{cat.count} titles · {(cat.views / 1000).toFixed(1)}K views</span>
                  </div>
                  <div className="w-full h-2.5 bg-dark-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <h3 className="text-sm font-bold text-white mt-8 mb-4 flex items-center gap-2"><Globe size={16} className="text-success" /> By Country</h3>
          <div className="grid grid-cols-2 gap-3">
            {countryStats.map(c => (
              <div key={c.country} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-xl">
                <span className="text-sm text-dark-300">{c.country}</span>
                <span className="text-sm font-bold text-white">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Providers */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-dark-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2"><Crown size={16} className="text-accent" /> Top Providers by Content</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-dark-800">
          {topProviders.map(p => (
            <div key={p.id} className="p-4 text-center">
              <div className="w-10 h-10 bg-dark-800 rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-bold text-accent">{p.name.charAt(0)}</span>
              </div>
              <p className="text-sm font-semibold text-white">{p.name}</p>
              <p className="text-xs text-dark-400 mt-1">{p.totalMovies} titles</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
