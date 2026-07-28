"use client";

import { useState } from "react";

import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** Props for the interactive StarPicker component. */
interface StarPickerProps {
  /** The currently selected rating value (0-5). */
  value?: number;
  /** Callback fired when a star is clicked. */
  onChange?: (value: number) => void;
  /** If true, disables interaction and reduces opacity. */
  disabled?: boolean;
  /** Additional CSS classes for the container. */
  className?: string;
}

/**
 * An interactive 5-star rating input that handles hover states and selection.
 */
export function StarPicker({
  value = 0,
  onChange,
  disabled,
  className,
}: StarPickerProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const handleChange = (value: number) => {
    onChange?.(value);
  };

  return (
    <div
      className={cn(
        "flex items-center",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={cn(
            "p-0.5 transition hover:scale-110",
            !disabled && "cursor-pointer",
          )}
          disabled={disabled}
          type="button"
          onClick={() => handleChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
        >
          <StarIcon
            className={cn(
              "size-5",
              (hoverValue || value) >= star
                ? "fill-black stroke-black"
                : "stroke-black",
            )}
          />
        </button>
      ))}
    </div>
  );
}
