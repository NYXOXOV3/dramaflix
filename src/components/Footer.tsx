import Link from "next/link";
import { Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-pink rounded-lg flex items-center justify-center">
                <span className="text-white font-extrabold text-sm">D</span>
              </div>
              <span className="text-lg font-extrabold">
                Drama<span className="gradient-text">Flix</span>
              </span>
            </Link>
            <p className="text-sm text-dark-400 leading-relaxed mb-4">
              Platform streaming drama pendek terbaik. Update episode setiap hari, kualitas HD, dan akses gratis.
            </p>
            <a
              href="https://t.me/dramaflix"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-light transition-colors"
            >
              <Send size={16} /> Join Telegram
            </a>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Category</h4>
            <ul className="space-y-2">
              {[
                { label: "Latest", href: "/?sort=latest" },
                { label: "Popular", href: "/?sort=popular" },
                { label: "Free", href: "/?filter=free" },
                { label: "VIP", href: "/vip" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-dark-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Information</h4>
            <ul className="space-y-2">
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "Referral Program", href: "/referral" },
                { label: "DMCA & Copyright", href: "/dmca" },
                { label: "Download App", href: "/download" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-dark-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Disclaimer", href: "/disclaimer" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-dark-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-dark-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-dark-500">
            &copy; {new Date().getFullYear()} DramaFlix. All rights reserved.
          </p>
          <p className="text-xs text-dark-600">
            DramaFlix is a content aggregator. We do not host or store any video content.
          </p>
        </div>
      </div>
    </footer>
  );
}
