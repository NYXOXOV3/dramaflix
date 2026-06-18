"use client";

import { useState } from "react";
import { Download, Smartphone, Monitor, CheckCircle, HelpCircle, Clock } from "lucide-react";

export default function DownloadPage() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-slide-up text-sm font-medium bg-accent/20 text-accent border border-accent/30">
          <Clock size={16} />{toast}
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Download DramaFlix</h1>
        <p className="text-dark-400 max-w-lg mx-auto">
          Watch your favorite dramas on the go. Download our app for the best experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Android */}
        <div className="p-8 bg-dark-800 border border-dark-700 rounded-2xl text-center">
          <div className="w-20 h-20 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Smartphone size={36} className="text-success" />
          </div>
          <h3 className="text-xl font-extrabold text-white mb-2">Android</h3>
          <p className="text-sm text-dark-400 mb-6">Download APK directly for Android devices.</p>
          <button
            onClick={() => showToast("Android APK download coming soon! We're working on it.")}
            className="inline-flex items-center gap-2 px-8 py-3 bg-success hover:bg-success/80 text-dark-950 font-bold rounded-xl transition-all"
          >
            <Download size={18} /> Download APK
          </button>
          <p className="text-xs text-dark-500 mt-4">v2.1.0 · 15MB · Android 7.0+</p>
        </div>

        {/* iOS */}
        <div className="p-8 bg-dark-800 border border-dark-700 rounded-2xl text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Monitor size={36} className="text-primary" />
          </div>
          <h3 className="text-xl font-extrabold text-white mb-2">iOS (iPhone/iPad)</h3>
          <p className="text-sm text-dark-400 mb-6">Install via Safari as Progressive Web App.</p>
          <button
            onClick={() => showToast("PWA install guide coming soon!")}
            className="inline-flex items-center gap-2 px-8 py-3 bg-dark-700 hover:bg-dark-600 text-white font-bold rounded-xl transition-all"
          >
            PWA Install Guide
          </button>
          <p className="text-xs text-dark-500 mt-4">Works on iOS 14+ via Safari</p>
        </div>
      </div>

      {/* Installation Steps */}
      <div className="mb-12">
        <h2 className="text-xl font-extrabold text-white text-center mb-8">Installation Guide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { step: 1, title: "Download", desc: "Download the APK file from the button above." },
            { step: 2, title: "Allow Install", desc: "Enable 'Install from Unknown Sources' in settings." },
            { step: 3, title: "Install", desc: "Open the downloaded file and tap Install." },
            { step: 4, title: "Enjoy", desc: "Open DramaFlix and start watching!" },
          ].map((item) => (
            <div key={item.step} className="p-4 bg-dark-800/50 border border-dark-700/50 rounded-xl text-center">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-accent font-bold">{item.step}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
              <p className="text-xs text-dark-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* App Features */}
      <div className="mb-12">
        <h2 className="text-xl font-extrabold text-white text-center mb-8">App Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "Offline viewing - download episodes",
            "Push notifications for new episodes",
            "Picture-in-picture mode",
            "Chromecast & AirPlay support",
            "Multi-language subtitles",
            "Background playback",
          ].map((f) => (
            <div key={f} className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
              <CheckCircle size={18} className="text-success shrink-0" />
              <span className="text-sm text-dark-300">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-extrabold text-white text-center mb-6">FAQ</h2>
        <div className="space-y-4">
          {[
            { q: "Why does the app show 'dangerous app' warning?", a: "This is a standard Android warning for apps installed outside the Play Store. DramaFlix is safe to use." },
            { q: "Can I use the app on multiple devices?", a: "Yes! You can use DramaFlix on up to 3-6 devices depending on your VIP plan." },
            { q: "Is the iOS version available on App Store?", a: "Currently not on the App Store. Use the PWA installation method via Safari for the best iOS experience." },
          ].map((faq, i) => (
            <div key={i} className="p-4 bg-dark-800/50 border border-dark-700/50 rounded-xl">
              <div className="flex items-start gap-2">
                <HelpCircle size={16} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{faq.q}</h4>
                  <p className="text-xs text-dark-400 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
