"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  interactive?: boolean;
}

export function StarRating({ rating, onRatingChange, size = 5, interactive = false }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = interactive ? (hovered || rating) >= star : rating >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onRatingChange?.(star)}
            className={cn(
              "transition-all",
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default",
              filled ? "text-yellow-500" : "text-muted-foreground/30"
            )}
          >
            <Star className={cn("transition-all", filled && "fill-yellow-500")} style={{ width: size, height: size }} />
          </button>
        );
      })}
    </div>
  );
}
