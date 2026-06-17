"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface PromoBannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  expiresAt?: Date;
}

export default function PromoBanner({ title, subtitle, ctaText, ctaHref, expiresAt }: PromoBannerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;
    const timer = setInterval(() => {
      const diff = expiresAt.getTime() - Date.now();
      if (diff <= 0) {
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  if (isDismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent/20 via-pink/10 to-purple/20 border border-accent/30 p-6 md:p-8">
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded-lg transition-colors text-dark-300 hover:text-white"
        aria-label="Dismiss"
      >
        <X size={18} />
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-extrabold text-white mb-1">{title}</h3>
          <p className="text-sm text-dark-300">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          {expiresAt && (
            <div className="flex items-center gap-2">
              {[
                { value: timeLeft.days, label: "D" },
                { value: timeLeft.hours, label: "H" },
                { value: timeLeft.minutes, label: "M" },
                { value: timeLeft.seconds, label: "S" },
              ].map((t, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="w-10 h-10 bg-dark-900/80 border border-dark-700 rounded-lg flex items-center justify-center text-lg font-bold text-accent">
                    {String(t.value).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] text-dark-500 mt-0.5">{t.label}</span>
                </div>
              ))}
            </div>
          )}
          <a
            href={ctaHref}
            className="shrink-0 px-6 py-2.5 bg-accent hover:bg-accent-dark text-dark-950 font-bold text-sm rounded-lg transition-all shadow-lg shadow-accent/20"
          >
            {ctaText}
          </a>
        </div>
      </div>
    </div>
  );
}
