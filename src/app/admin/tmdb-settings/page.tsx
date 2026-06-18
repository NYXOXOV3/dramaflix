"use client";

import { useState, useEffect } from "react";
import { Key, CheckCircle, XCircle, Loader2, ExternalLink, Save, TestTube, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const TMDB_KEY_STORAGE = "dramaflix_tmdb_api_key";

export default function TmdbSettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(TMDB_KEY_STORAGE);
    if (stored) setApiKey(stored);
  }, []);

  const handleSave = () => {
    localStorage.setItem(TMDB_KEY_STORAGE, apiKey.trim());
    setSaved(true);
    setTestResult(null);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTest = async () => {
    if (!apiKey.trim()) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(`/api/tmdb?action=test&key=${encodeURIComponent(apiKey.trim())}`);
      const data = await res.json();
      setTestResult({ success: data.success, message: data.success ? data.message : data.error });
    } catch {
      setTestResult({ success: false, message: "Network error - could not reach server" });
    }
    setTesting(false);
  };

  const handleClear = () => {
    setApiKey("");
    localStorage.removeItem(TMDB_KEY_STORAGE);
    setTestResult(null);
    setSaved(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Key size={24} className="text-accent" /> TMDB Settings
        </h1>
        <p className="text-sm text-dark-400 mt-1">Configure your TMDB API key for movie and TV show metadata integration.</p>
      </div>

      {/* API Key */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-200 mb-2">TMDB API Key</label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setTestResult(null); }}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-accent"
              placeholder="Enter your TMDB API key (v3 auth)"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-dark-500 hover:text-white transition-colors"
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-[11px] text-dark-500 mt-2">
            Get a free API key at{" "}
            <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer"
              className="text-primary hover:text-primary-light inline-flex items-center gap-0.5">
              themoviedb.org <ExternalLink size={10} />
            </a>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark disabled:opacity-50 text-dark-950 font-bold text-sm rounded-xl transition-all"
          >
            <Save size={16} /> Save Key
          </button>
          <button
            onClick={handleTest}
            disabled={!apiKey.trim() || testing}
            className="flex items-center gap-2 px-5 py-2.5 bg-dark-700 hover:bg-dark-600 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all"
          >
            {testing ? <Loader2 size={16} className="animate-spin" /> : <TestTube size={16} />}
            {testing ? "Testing..." : "Test Connection"}
          </button>
          {apiKey && (
            <button
              onClick={handleClear}
              className="px-4 py-2.5 text-danger text-sm hover:bg-danger/10 rounded-xl transition-all"
            >
              Clear
            </button>
          )}
        </div>

        {/* Saved confirmation */}
        {saved && (
          <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-xl text-sm text-success">
            <CheckCircle size={16} /> API key saved to browser storage.
          </div>
        )}

        {/* Test result */}
        {testResult && (
          <div className={cn(
            "flex items-start gap-2 p-3 rounded-xl text-sm",
            testResult.success ? "bg-success/10 border border-success/20 text-success" : "bg-danger/10 border border-danger/20 text-danger"
          )}>
            {testResult.success ? <CheckCircle size={16} className="shrink-0 mt-0.5" /> : <XCircle size={16} className="shrink-0 mt-0.5" />}
            {testResult.message}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-bold text-white">How it works</h3>
        <div className="space-y-2 text-xs text-dark-400 leading-relaxed">
          <p>1. The API key is stored in your browser&apos;s localStorage.</p>
          <p>2. When you import movies/TV shows, the key is sent to the server to query TMDB.</p>
          <p>3. Movie detail pages also use this key to fetch cast, trailers, and similar titles.</p>
          <p>4. You can also set <code className="text-accent bg-dark-800 px-1.5 py-0.5 rounded">TMDB_API_KEY</code> as an environment variable on Vercel for server-side default.</p>
        </div>
      </div>

      {/* Current status */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-3">Current Status</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">Browser Key</span>
            <span className={cn("font-medium", apiKey ? "text-success" : "text-dark-500")}>
              {apiKey ? `••••••••${apiKey.slice(-4)}` : "Not set"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">Environment Variable</span>
            <span className="text-dark-500">Set via Vercel dashboard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
