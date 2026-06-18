"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  userRating?: number;
  onRate?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
  showCount?: boolean;
  count?: number;
}

export default function StarRating({ value, userRating = 0, onRate, size = 18, readonly = false, showCount, count }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const displayValue = hovered || userRating || value;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onRate?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={cn(
              "transition-all",
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            )}
          >
            <Star
              size={size}
              className={cn(
                "transition-colors",
                star <= displayValue
                  ? "text-accent fill-accent"
                  : "text-dark-600 fill-dark-800"
              )}
            />
          </button>
        ))}
      </div>
      <span className="text-sm font-bold text-accent">{displayValue > 0 ? displayValue.toFixed(1) : "—"}</span>
      {showCount && count !== undefined && (
        <span className="text-xs text-dark-500">({count})</span>
      )}
    </div>
  );
}
