"use client";

import { useState } from "react";
import { AlertCircle, ExternalLink } from "lucide-react";

// Detect if URL is a direct video file or an embed URL
function isDirectVideoUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    lower.endsWith(".mp4") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".ogg") ||
    lower.endsWith(".ogv") ||
    lower.endsWith(".m3u8") ||
    lower.includes(".mp4?") ||
    lower.includes(".webm?") ||
    lower.includes("blob:") ||
    lower.includes("/video/") ||
    lower.includes("/stream/") ||
    lower.includes(".m3u8?")
  );
}

// Convert various URLs to embeddable format
function toEmbedUrl(url: string): string {
  const trimmed = url.trim();

  // YouTube: convert watch?v= or youtu.be/ to embed
  const ytWatch = trimmed.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;

  const ytShort = trimmed.match(/youtu\.be\/([^?&]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;

  // Already an embed URL (youtube.com/embed, drive.google.com, etc.)
  if (trimmed.includes("/embed/") || trimmed.includes("/preview")) {
    return trimmed;
  }

  // Google Drive: convert /file/d/ID/view to /file/d/ID/preview
  const gdrive = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (gdrive) return `https://drive.google.com/file/d/${gdrive[1]}/preview`;

  // Return as-is (assume it's already embeddable)
  return trimmed;
}

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
}

export default function VideoPlayer({ src, poster, autoPlay = true, className = "" }: VideoPlayerProps) {
  const [error, setError] = useState(false);

  if (!src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-dark-900 text-dark-400 ${className}`}>
        <AlertCircle size={48} className="mb-3 text-dark-600" />
        <p className="text-sm font-medium">No video URL available</p>
        <p className="text-xs text-dark-600 mt-1">Set a video URL in the admin panel</p>
      </div>
    );
  }

  if (isDirectVideoUrl(src)) {
    // Direct video file - use <video> tag
    return (
      <div className={`relative ${className}`}>
        <video
          src={src}
          controls
          autoPlay={autoPlay}
          className="w-full h-full"
          poster={poster}
          onError={() => setError(true)}
          playsInline
        >
          Your browser does not support the video tag.
        </video>
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-900/90 text-dark-400">
            <AlertCircle size={48} className="mb-3 text-danger" />
            <p className="text-sm font-medium">Failed to load video</p>
            <p className="text-xs text-dark-600 mt-1 max-w-xs text-center">
              The video URL might be invalid or the server doesn&apos;t support direct playback.
            </p>
            <a href={src} target="_blank" rel="noopener noreferrer"
              className="mt-3 flex items-center gap-1 text-xs text-primary hover:text-primary-light">
              <ExternalLink size={12} /> Open URL directly
            </a>
          </div>
        )}
      </div>
    );
  }

  // Embed URL - use <iframe>
  const embedUrl = toEmbedUrl(src);
  return (
    <div className={`relative ${className}`}>
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        style={{ border: "none" }}
      />
    </div>
  );
}
