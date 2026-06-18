"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

const USER_SESSION_KEY = "dramaflix_user_session";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_SESSION_KEY);
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
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setIsLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1200));

      // Check if email already exists
      const usersRaw = localStorage.getItem("dramaflix_users");
      const users: Array<{ email: string; password: string; name: string }> = usersRaw ? JSON.parse(usersRaw) : [];
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (existing) {
        setError("An account with this email already exists. Please sign in.");
        setIsLoading(false);
        return;
      }

      // Register user
      const updatedUsers = [...users, { email, password, name }];
      localStorage.setItem("dramaflix_users", JSON.stringify(updatedUsers));

      // Auto-login after registration
      const session = { email, name, loggedInAt: new Date().toISOString() };
      localStorage.setItem("dramaflix_user_session", JSON.stringify(session));
      window.dispatchEvent(new Event("dramaflix:auth-changed"));

      router.push("/");
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
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
          <h1 className="text-2xl font-extrabold text-white">Create Account</h1>
          <p className="text-sm text-dark-400 mt-1">Join DramaFlix and start streaming today.</p>
        </div>

        {error && (
          <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-sm text-danger">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

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
                placeholder="Min. 8 characters"
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

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-accent hover:bg-accent-dark disabled:opacity-50 text-dark-950 font-bold rounded-xl transition-all"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-dark-400">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:text-accent-light font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
