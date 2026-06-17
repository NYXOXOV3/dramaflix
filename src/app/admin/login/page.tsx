"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAdminAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect
  if (isAuthenticated) {
    router.replace("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    const result = await login(email.trim(), password);
    setIsLoading(false);

    if (result.success) {
      router.replace("/admin");
    } else {
      setError(result.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-pink rounded-xl flex items-center justify-center">
              <span className="text-white font-extrabold text-lg">D</span>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Admin Panel</h1>
          <p className="text-sm text-dark-400 mt-1">Sign in to manage DramaFlix</p>
        </div>

        {/* Login Form */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 md:p-8">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-danger/10 border border-danger/20 rounded-xl mb-5">
              <AlertCircle size={16} className="text-danger shrink-0 mt-0.5" />
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="admin@dramaflix.com"
                  autoComplete="email"
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-11 pr-12 py-3 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-dark-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed text-dark-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-accent/20"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-dark-900/50 border border-dark-800 rounded-xl">
          <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">Demo Credentials</p>
          <div className="space-y-2">
            <button
              onClick={() => { setEmail("admin@dramaflix.com"); setPassword("admin123"); setError(""); }}
              className="w-full flex items-center justify-between p-2.5 bg-dark-800 hover:bg-dark-700 rounded-lg transition-all text-left"
            >
              <div>
                <p className="text-xs font-medium text-white">Super Admin</p>
                <p className="text-[11px] text-dark-500">admin@dramaflix.com</p>
              </div>
              <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded font-medium">admin123</span>
            </button>
            <button
              onClick={() => { setEmail("editor@dramaflix.com"); setPassword("editor123"); setError(""); }}
              className="w-full flex items-center justify-between p-2.5 bg-dark-800 hover:bg-dark-700 rounded-lg transition-all text-left"
            >
              <div>
                <p className="text-xs font-medium text-white">Content Editor</p>
                <p className="text-[11px] text-dark-500">editor@dramaflix.com</p>
              </div>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">editor123</span>
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-dark-600 mt-6">
          &copy; {new Date().getFullYear()} DramaFlix Admin. All rights reserved.
        </p>
      </div>
    </div>
  );
}
