"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Crown, Mail, Lock, Eye, EyeOff, Film, Monitor } from "lucide-react";

const USER_STORAGE_KEY = "dramaflix_user_session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored);
        if (user?.email) {
          router.replace("/");
        }
      }
    } catch { /* ignore */ }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);

    try {
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 1200));

      // Check if user exists in localStorage
      const usersRaw = localStorage.getItem("dramaflix_users");
      const users: Array<{ email: string; password: string; name: string }> = usersRaw ? JSON.parse(usersRaw) : [];
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (existing) {
        if (existing.password !== password) {
          setError("Incorrect password. Please try again.");
          setIsLoading(false);
          return;
        }
        // Login success
        const session = { email: existing.email, name: existing.name, loggedInAt: new Date().toISOString() };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session));
        router.push("/");
      } else {
        // Demo mode: auto-login with any credentials
        const session = { email, name: email.split("@")[0], loggedInAt: new Date().toISOString() };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session));
        // Also register the user for future logins
        const updatedUsers = [...users, { email, password, name: email.split("@")[0] }];
        localStorage.setItem("dramaflix_users", JSON.stringify(updatedUsers));
        router.push("/");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-pink rounded-lg flex items-center justify-center">
                <span className="text-white font-extrabold text-sm">D</span>
              </div>
              <span className="text-lg font-extrabold">
                Drama<span className="gradient-text">Flix</span>
              </span>
            </Link>
            <h1 className="text-2xl font-extrabold text-white">Welcome Back</h1>
            <p className="text-sm text-dark-400 mt-1">Sign in to continue watching your favorite dramas.</p>
          </div>

          {error && (
            <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-sm text-danger">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-accent focus:ring-accent" />
                <span className="text-sm text-dark-400">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-accent hover:text-accent-light transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-accent hover:bg-accent-dark disabled:opacity-50 text-dark-950 font-bold rounded-xl transition-all"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-dark-950 px-3 text-dark-500">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-xl text-sm text-white transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-xl text-sm text-white transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              WhatsApp
            </button>
          </div>

          <p className="text-center text-sm text-dark-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-accent hover:text-accent-light font-medium transition-colors">
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Promo */}
      <div className="hidden lg:flex w-[450px] bg-gradient-to-br from-accent/10 via-dark-900 to-purple/10 items-center justify-center p-10">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
            <Crown size={36} className="text-accent" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Upgrade to VIP</h2>
          <ul className="space-y-3 text-left">
            {[
              { icon: Film, text: "10,000+ Films & Dramas" },
              { icon: Monitor, text: "30+ Premium Platforms" },
              { icon: Crown, text: "Ad-Free HD Streaming" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-dark-300">
                <Icon size={18} className="text-accent shrink-0" />
                {text}
              </li>
            ))}
          </ul>
          <Link
            href="/vip"
            className="inline-flex px-6 py-3 bg-accent hover:bg-accent-dark text-dark-950 font-bold rounded-xl transition-all"
          >
            View VIP Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
