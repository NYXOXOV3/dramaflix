"use client";

import { useState, useRef } from "react";
import { Upload, X, AlertCircle, ImageIcon } from "lucide-react";

// ---- XSS Protection ----
// Only allow safe image MIME types
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Sanitize SVG to prevent XSS (remove script tags, event handlers)
function sanitizeSvg(dataUrl: string): string {
  // For SVG, strip dangerous elements
  try {
    const svgContent = atob(dataUrl.split(",")[1]);
    const clean = svgContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
      .replace(/on\w+\s*=\s*'[^']*'/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/<iframe\b[^>]*>.*?<\/iframe>/gi, "")
      .replace(/<embed\b[^>]*>/gi, "")
      .replace(/<object\b[^>]*>.*?<\/object>/gi, "");
    return "data:image/svg+xml;base64," + btoa(clean);
  } catch {
    return "";
  }
}

interface SecureImageUploadProps {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
  aspect?: string;
  maxSize?: number;
}

export default function SecureImageUpload({ value, onChange, label = "Profile Image", aspect = "w-24 h-24", maxSize = MAX_FILE_SIZE }: SecureImageUploadProps) {
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Security: validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG allowed.");
      return;
    }

    // Security: validate file size
    if (file.size > maxSize) {
      setError(`File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB.`);
      return;
    }

    // Security: validate filename (no path traversal, no special chars)
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "");
    if (safeName.length < 1 || safeName.includes("..")) {
      setError("Invalid filename.");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;

      // Security: validate data URL prefix
      if (!result.startsWith("data:image/")) {
        setError("Invalid image data.");
        setUploading(false);
        return;
      }

      // Security: sanitize SVG content
      if (file.type === "image/svg+xml") {
        const sanitized = sanitizeSvg(result);
        if (!sanitized) {
          setError("SVG contains unsafe content.");
          setUploading(false);
          return;
        }
        onChange(sanitized);
      } else {
        onChange(result);
      }
      setUploading(false);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
      setUploading(false);
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  return (
    <div>
      <label className="block text-xs font-medium text-dark-300 mb-1.5">{label}</label>
      <div className="flex items-center gap-4">
        {/* Preview */}
        <div className={`${aspect} rounded-full overflow-hidden bg-dark-800 border-2 border-dark-700 shrink-0 flex items-center justify-center`}>
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={24} className="text-dark-600" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg text-xs text-dark-300 hover:text-white transition-all disabled:opacity-50"
            >
              <Upload size={12} />
              {uploading ? "Uploading..." : "Upload"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="flex items-center gap-1.5 px-3 py-2 bg-dark-800 hover:bg-danger/20 border border-dark-700 hover:border-danger/30 rounded-lg text-xs text-dark-300 hover:text-danger transition-all"
              >
                <X size={12} /> Remove
              </button>
            )}
          </div>
          <p className="text-[10px] text-dark-500">JPEG, PNG, GIF, WebP. Max {Math.round(maxSize / 1024 / 1024)}MB.</p>
          {error && (
            <p className="flex items-center gap-1 text-[11px] text-danger">
              <AlertCircle size={10} /> {error}
            </p>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
