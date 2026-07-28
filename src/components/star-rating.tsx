import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const MAX_RATING = 5;
const MIN_RATING = 0;

/** Props for the read-only StarRating component. */
interface StarRatingProps {
  /** The rating score to display. Automatically clamped between 0 and 5. */
  rating: number;
  /** Additional CSS classes for the wrapper container. */
  className?: string;
  /** Additional CSS classes applied directly to the Star icons. */
  iconClassName?: string;
  /** Optional text to display alongside the stars (e.g., "(42 reviews)"). */
  text?: string;
}

/**
 * A display-only component that renders a static 5-star rating.
 */
export function StarRating({
  rating,
  className,
  iconClassName,
  text,
}: StarRatingProps) {
  const safeRating = Math.max(MIN_RATING, Math.min(rating, MAX_RATING));

  return (
    <div className={cn("flex items-center gap-x-1", className)}>
      {Array.from({ length: MAX_RATING }).map((_, index) => (
        <StarIcon
          key={index}
          className={cn(
            "size-4",
            index < safeRating ? "fill-black" : "",
            iconClassName,
          )}
        />
      ))}
      {text && <p>{text}</p>}
    </div>
  );
}
