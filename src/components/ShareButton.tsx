"use client";

import { useState } from "react";
import { Share2, Check, Copy, Link as LinkIcon, MessageCircle } from "lucide-react";

interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
  className?: string;
}

export default function ShareButton({ url, title, text, className = "" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;
  const shareText = text || `Check out ${title} on DramaFlix!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = fullUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: fullUrl });
      } catch { /* cancelled */ }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(shareText + " " + fullUrl)}`,
      icon: MessageCircle,
      color: "hover:text-success",
    },
    {
      name: "Twitter/X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`,
      icon: LinkIcon,
      color: "hover:text-primary",
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(shareText)}`,
      icon: MessageCircle,
      color: "hover:text-primary",
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className={`inline-flex items-center gap-2 px-4 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl transition-all ${className}`}
      >
        <Share2 size={18} /> Share
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-56 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl p-3 z-50 animate-fade-in">
            <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2 px-1">Share to</p>
            <div className="space-y-1">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-sm text-dark-300 ${link.color} hover:bg-dark-700 rounded-lg transition-all`}
                >
                  <link.icon size={16} />
                  {link.name}
                </a>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-dark-700">
              <button
                onClick={() => { handleCopy(); setIsOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-dark-300 hover:text-accent hover:bg-dark-700 rounded-lg transition-all"
              >
                {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
