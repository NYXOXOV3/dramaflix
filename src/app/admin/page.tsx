"use client";

import { Film, Users, Crown, Eye, TrendingUp, DollarSign, UserPlus, Activity } from "lucide-react";
import { vipPlans } from "@/lib/mock-data";
import { useData } from "@/lib/data-store";

export default function AdminDashboard() {
  const { movies, providers } = useData();
  const totalViews = movies.reduce((sum: number, m: { views: number }) => sum + m.views, 0);
  const totalMovies = movies.length;
  const totalProviders = providers.filter((p) => !p.isComingSoon).length;
  const vipUsers = 247; // mock

  const stats = [
    { label: "Total Movies", value: totalMovies.toLocaleString(), icon: Film, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Views", value: `${(totalViews / 1000).toFixed(1)}K`, icon: Eye, color: "text-accent", bg: "bg-accent/10" },
    { label: "VIP Members", value: vipUsers.toString(), icon: Crown, color: "text-purple", bg: "bg-purple/10" },
    { label: "Providers", value: totalProviders.toString(), icon: Activity, color: "text-success", bg: "bg-success/10" },
  ];

  const recentMovies = [...movies].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Dashboard</h1>
        <p className="text-sm text-dark-400 mt-1">Welcome back, Admin. Here&apos;s your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 bg-dark-900 border border-dark-800 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <TrendingUp size={16} className="text-success" />
            </div>
            <p className="text-2xl font-extrabold text-white">{stat.value}</p>
            <p className="text-xs text-dark-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Movies */}
        <div className="lg:col-span-2 bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-dark-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Recent Movies</h2>
            <a href="/admin/movies" className="text-xs text-accent hover:text-accent-light">View All →</a>
          </div>
          <div className="divide-y divide-dark-800">
            {recentMovies.map((movie) => (
              <div key={movie.id} className="flex items-center gap-4 p-4 hover:bg-dark-800/50 transition-colors">
                <div className="w-10 h-14 rounded-lg overflow-hidden bg-dark-800 shrink-0">
                  <img src={movie.coverImage} alt={movie.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">{movie.title}</h4>
                  <p className="text-xs text-dark-400 mt-0.5">{movie.provider} · {movie.totalEpisodes} eps · {movie.country}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-accent font-medium">{(movie.views / 1000).toFixed(1)}K views</p>
                  <p className="text-[11px] text-dark-500">{movie.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart (Mock) */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4">
          <h2 className="text-sm font-bold text-white mb-4">Revenue Overview</h2>
          <div className="space-y-4">
            {vipPlans.map((plan) => {
              const mockRevenue = plan.price * Math.floor(Math.random() * 50 + 10);
              return (
                <div key={plan.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-dark-300">{plan.name}</span>
                    <span className="text-white font-medium">Rp {(mockRevenue / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full"
                      style={{ width: `${Math.min((mockRevenue / 5000000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-dark-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-dark-400">Total Revenue</span>
              <span className="text-lg font-extrabold text-accent">Rp 12.4M</span>
            </div>
            <p className="text-[11px] text-success mt-1 flex items-center gap-1">
              <TrendingUp size={12} /> +18% from last month
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4">
        <h2 className="text-sm font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Add Movie", href: "/admin/movies/new", icon: Film, color: "text-primary" },
            { label: "Add Provider", href: "/admin/providers", icon: Activity, color: "text-success" },
            { label: "Manage Users", href: "/admin/users", icon: Users, color: "text-purple" },
            { label: "View Subscriptions", href: "/admin/subscriptions", icon: Crown, color: "text-accent" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-4 bg-dark-800/50 hover:bg-dark-800 border border-dark-700/50 hover:border-dark-600 rounded-xl transition-all"
            >
              <action.icon size={20} className={action.color} />
              <span className="text-sm font-medium text-white">{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
