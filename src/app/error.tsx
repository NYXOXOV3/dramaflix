"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
      <div className="text-center max-w-md space-y-6">
        <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle size={40} className="text-danger" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Something went wrong</h1>
        <p className="text-sm text-dark-400">
          An unexpected error occurred. Our team has been notified and is working to fix it.
        </p>
        {error.digest && (
          <p className="text-xs text-dark-600 bg-dark-800 px-3 py-2 rounded-lg font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-dark-950 font-bold rounded-xl transition-all"
          >
            <RefreshCw size={18} /> Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white font-medium rounded-xl transition-all"
          >
            <Home size={18} /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
