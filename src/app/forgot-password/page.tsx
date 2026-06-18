"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setIsLoading(true);
    // Simulate sending email
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors mb-6">
            <ArrowLeft size={16} /> Back to Login
          </Link>
          <h1 className="text-2xl font-extrabold text-white">Forgot Password?</h1>
          <p className="text-sm text-dark-400 mt-1">
            No worries! Enter your email and we&apos;ll send you reset instructions.
          </p>
        </div>

        {sent ? (
          <div className="p-6 bg-success/10 border border-success/30 rounded-2xl text-center space-y-4">
            <CheckCircle size={48} className="text-success mx-auto" />
            <h2 className="text-lg font-bold text-white">Check Your Email</h2>
            <p className="text-sm text-dark-300">
              We&apos;ve sent password reset instructions to <strong className="text-white">{email}</strong>.
              Check your inbox and spam folder.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-dark-950 font-bold rounded-xl transition-all"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-sm text-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Email Address</label>
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-accent hover:bg-accent-dark disabled:opacity-50 text-dark-950 font-bold rounded-xl transition-all"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-dark-400">
          Remember your password?{" "}
          <Link href="/login" className="text-accent hover:text-accent-light font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
