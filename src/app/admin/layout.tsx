"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Film, Users, Crown, Building2, Settings,
  LogOut, Menu, X, Bell, Search, BarChart3, Loader2, Shield, Globe, Key, Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Movies", href: "/admin/movies", icon: Film },
  { label: "Import TMDB", href: "/admin/import-tmdb", icon: Download },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: Crown },
  { label: "Providers", href: "/admin/providers", icon: Building2 },
  { label: "Countries", href: "/admin/countries", icon: Globe },
  { label: "TMDB Settings", href: "/admin/tmdb-settings", icon: Key },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAdminAuth();

  const isLoginPage = pathname === "/admin/login";

  const handleAdminSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = adminSearch.trim().toLowerCase();
    if (!q) return;
    // Navigate to matching admin page based on search term
    const pageMap: Record<string, string> = {
      movie: "/admin/movies", movies: "/admin/movies",
      user: "/admin/users", users: "/admin/users",
      provider: "/admin/providers", providers: "/admin/providers",
      subscription: "/admin/subscriptions", subscriptions: "/admin/subscriptions",
      analytics: "/admin/analytics",
      setting: "/admin/settings", settings: "/admin/settings",
      dashboard: "/admin",
    };
    const matchedPage = pageMap[q];
    if (matchedPage) {
      router.push(matchedPage);
    } else {
      router.push(`/admin/movies`);
    }
    setAdminSearch("");
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen bg-dark-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-accent animate-spin" />
          <p className="text-sm text-dark-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Login page - no sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Not authenticated - show nothing while redirecting
  if (!isAuthenticated) {
    return (
      <div className="h-screen bg-dark-950 flex items-center justify-center">
        <Loader2 size={32} className="text-accent animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-dark-800 flex flex-col transition-transform duration-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-dark-800 shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-pink rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-sm">D</span>
            </div>
            <span className="text-lg font-extrabold text-white">
              Admin<span className="gradient-text">Panel</span>
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-dark-800 rounded text-dark-400"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-dark-400 hover:text-white hover:bg-dark-800"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-dark-800 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center shrink-0">
              <Shield size={14} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-dark-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-danger transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-dark-900/80 backdrop-blur-md border-b border-dark-800 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-dark-800 rounded-lg text-dark-400"
            >
              <Menu size={20} />
            </button>
            <form onSubmit={handleAdminSearch} className="hidden sm:flex items-center bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 w-72">
              <Search size={16} className="text-dark-500 mr-2 shrink-0" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Search admin..."
                className="bg-transparent text-sm text-white placeholder:text-dark-500 focus:outline-none w-full"
              />
            </form>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-accent/10 text-accent px-2 py-1 rounded font-medium capitalize hidden sm:block">
              {user?.role}
            </span>
            <button className="relative p-2 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
            </button>
            <Link
              href="/"
              className="text-xs text-dark-400 hover:text-white transition-colors hidden sm:block"
            >
              View Site →
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
