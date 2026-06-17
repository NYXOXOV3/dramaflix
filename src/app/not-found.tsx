import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
      <div className="text-center max-w-md space-y-6">
        <div className="text-8xl font-extrabold gradient-text">404</div>
        <h1 className="text-2xl font-extrabold text-white">Page Not Found</h1>
        <p className="text-sm text-dark-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-dark-950 font-bold rounded-xl transition-all"
          >
            <Home size={18} /> Go Home
          </Link>
          <Link
            href="/?sort=popular"
            className="inline-flex items-center gap-2 px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white font-medium rounded-xl transition-all"
          >
            <Search size={18} /> Browse
          </Link>
        </div>
      </div>
    </div>
  );
}
