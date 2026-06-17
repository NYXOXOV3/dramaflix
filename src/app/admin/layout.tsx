"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Film, Users, Crown, Building2, Settings,
  LogOut, Menu, X, ChevronDown, Bell, Search, BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Movies", href: "/admin/movies", icon: Film },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: Crown },
  { label: "Providers", href: "/admin/providers", icon: Building2 },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-dark-950">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-dark-800 flex flex-col transition-transform duration-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-dark-800">
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

        {/* Nav */}
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

        {/* User */}
        <div className="p-3 border-t border-dark-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
              <span className="text-accent text-xs font-bold">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin</p>
              <p className="text-[11px] text-dark-500 truncate">admin@dramaflix.com</p>
            </div>
            <Link href="/" className="p-1.5 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-white transition-colors" title="Back to site">
              <LogOut size={16} />
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-dark-900/80 backdrop-blur-md border-b border-dark-800 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-dark-800 rounded-lg text-dark-400"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 w-72">
              <Search size={16} className="text-dark-500 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search admin..."
                className="bg-transparent text-sm text-white placeholder:text-dark-500 focus:outline-none w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
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

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
