"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X, Crown, ChevronDown, Globe, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useData } from "@/lib/data-store";

const USER_SESSION_KEY = "dramaflix_user_session";

export default function Navbar() {
  const router = useRouter();
  const { providers } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProviderOpen, setIsProviderOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "id">("en");
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Check user session on mount and on storage changes
  useEffect(() => {
    const checkSession = () => {
      try {
        const stored = localStorage.getItem(USER_SESSION_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.email) {
            setUser(parsed);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    checkSession();
    // Re-check on various triggers
    window.addEventListener("focus", checkSession);
    window.addEventListener("storage", checkSession);
    window.addEventListener("dramaflix:auth-changed", checkSession);
    return () => {
      window.removeEventListener("focus", checkSession);
      window.removeEventListener("storage", checkSession);
      window.removeEventListener("dramaflix:auth-changed", checkSession);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(USER_SESSION_KEY);
    setUser(null);
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    router.push("/");
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const labels = {
    en: { home: "Home", platform: "Platform", movies: "Movies", anime: "Anime", donghua: "Donghua", tvshows: "TV Shows", signIn: "Sign In", register: "Register", searchPlaceholder: "Search dramas across 40+ providers...", upgradeVip: "Upgrade VIP" },
    id: { home: "Beranda", platform: "Platform", movies: "Film", anime: "Anime", donghua: "Donghua", tvshows: "Acara TV", signIn: "Masuk", register: "Daftar", searchPlaceholder: "Cari drama dari 40+ penyedia...", upgradeVip: "Upgrade VIP" },
  };
  const t = labels[lang];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-950/95 backdrop-blur-md border-b border-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-dark-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-pink rounded-lg flex items-center justify-center">
                <span className="text-white font-extrabold text-sm">D</span>
              </div>
              <span className="text-lg font-extrabold hidden sm:block">
                Drama<span className="gradient-text">Flix</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 text-sm font-medium text-dark-200 hover:text-white hover:bg-dark-800 rounded-lg transition-all">
              {t.home}
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsProviderOpen(!isProviderOpen)}
                className="px-3 py-2 text-sm font-medium text-dark-200 hover:text-white hover:bg-dark-800 rounded-lg transition-all flex items-center gap-1"
              >
                {t.platform} <ChevronDown size={14} />
              </button>
              {isProviderOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 max-h-96 overflow-y-auto bg-dark-800 border border-dark-700 rounded-xl shadow-2xl p-2 animate-fade-in">
                  <div className="grid grid-cols-2 gap-1">
                    {providers.filter((p) => !p.isComingSoon).map((p) => (
                      <Link
                        key={p.id}
                        href={`/provider/${p.slug}`}
                        onClick={() => setIsProviderOpen(false)}
                        className="px-3 py-2 text-xs text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-all flex items-center gap-2"
                      >
                        {p.name}
                        {p.isVipOnly && <span className="text-[10px] bg-accent/20 text-accent px-1 rounded">VIP</span>}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link href="/movie" className="px-3 py-2 text-sm font-medium text-dark-200 hover:text-white hover:bg-dark-800 rounded-lg transition-all">
              {t.movies}
            </Link>
            <Link href="/tvshow" className="px-3 py-2 text-sm font-medium text-dark-200 hover:text-white hover:bg-dark-800 rounded-lg transition-all">
              {t.tvshows}
            </Link>
            <Link href="/anime" className="px-3 py-2 text-sm font-medium text-dark-200 hover:text-white hover:bg-dark-800 rounded-lg transition-all">
              {t.anime}
            </Link>
            <Link href="/donghua" className="px-3 py-2 text-sm font-medium text-dark-200 hover:text-white hover:bg-dark-800 rounded-lg transition-all">
              {t.donghua}
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className={cn("relative transition-all duration-300", isSearchOpen ? "w-64" : "w-auto")}>
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-dark-800 border border-dark-600 rounded-l-lg px-4 py-2 text-sm text-white placeholder:text-dark-400 focus:outline-none focus:border-accent"
                    autoFocus
                  />
                  <button type="submit" className="p-2 bg-accent hover:bg-accent-dark text-dark-950 rounded-r-lg">
                    <Search size={16} />
                  </button>
                  <button type="button" onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="ml-2 p-2 text-dark-400 hover:text-white">
                    <X size={18} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:bg-dark-800 rounded-lg transition-colors text-dark-300 hover:text-white"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Language */}
            <button
              onClick={() => setLang(lang === "en" ? "id" : "en")}
              className="p-2 hover:bg-dark-800 rounded-lg transition-colors text-dark-300 hover:text-white flex items-center gap-1"
              aria-label="Toggle language"
            >
              <Globe size={16} />
              <span className="text-xs font-medium uppercase hidden sm:block">{lang}</span>
            </button>

            {/* VIP CTA */}
            <Link
              href="/vip"
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-accent to-accent-dark hover:from-accent-light hover:to-accent px-4 py-2 rounded-lg text-sm font-bold text-dark-950 transition-all shadow-lg shadow-accent/20"
            >
              <Crown size={16} />
              {t.upgradeVip}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-dark-200 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
                >
                  <div className="w-7 h-7 bg-accent/20 rounded-full flex items-center justify-center">
                    <User size={14} className="text-accent" />
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown size={14} />
                </button>
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl p-2 z-50 animate-fade-in">
                      <div className="px-3 py-2 border-b border-dark-700 mb-1">
                        <p className="text-xs font-medium text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-dark-400 truncate">{user.email}</p>
                      </div>
                      <Link href="/profile" onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-all">
                        <User size={14} /> My Profile
                      </Link>
                      <Link href="/subscription" onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-all">
                        <Crown size={14} /> Subscription
                      </Link>
                      <div className="border-t border-dark-700 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-all"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:inline-flex px-3 py-2 text-sm font-medium text-dark-200 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
                >
                  {t.signIn}
                </Link>
                <Link
                  href="/register"
                  className="hidden md:inline-flex px-4 py-2 text-sm font-bold bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-all"
                >
                  {t.register}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-dark-900 border-r border-dark-800 p-4 pt-20 overflow-y-auto animate-slide-left">
            <nav className="space-y-1">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-white hover:bg-dark-800 rounded-xl transition-all font-medium">
                {t.home}
              </Link>
              <Link href="/movie" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-dark-300 hover:bg-dark-800 hover:text-white rounded-xl transition-all">
                {t.movies}
              </Link>
              <Link href="/tvshow" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-dark-300 hover:bg-dark-800 hover:text-white rounded-xl transition-all">
                {t.tvshows}
              </Link>
              <Link href="/anime" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-dark-300 hover:bg-dark-800 hover:text-white rounded-xl transition-all">
                {t.anime}
              </Link>
              <Link href="/donghua" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-dark-300 hover:bg-dark-800 hover:text-white rounded-xl transition-all">
                {t.donghua}
              </Link>

              <div className="pt-4 mt-4 border-t border-dark-800">
                <p className="px-4 text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">Providers</p>
                <div className="max-h-64 overflow-y-auto space-y-0.5">
                  {providers.filter((p) => !p.isComingSoon).map((p) => (
                    <Link
                      key={p.id}
                      href={`/provider/${p.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-sm text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
                    >
                      {p.name}
                      {p.isVipOnly && <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-medium">VIP</span>}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-dark-800 space-y-1">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="w-9 h-9 bg-accent/20 rounded-full flex items-center justify-center shrink-0">
                        <User size={16} className="text-accent" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-dark-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-dark-300 hover:bg-dark-800 hover:text-white rounded-xl transition-all">
                      <User size={16} /> My Profile
                    </Link>
                    <Link href="/subscription" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-dark-300 hover:bg-dark-800 hover:text-white rounded-xl transition-all">
                      <Crown size={16} /> Subscription
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-danger hover:bg-danger/10 rounded-xl transition-all font-medium"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-dark-300 hover:bg-dark-800 hover:text-white rounded-xl transition-all font-medium">
                      {t.signIn}
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 bg-accent hover:bg-accent-dark text-dark-950 rounded-xl transition-all font-bold text-center">
                      {t.register}
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
