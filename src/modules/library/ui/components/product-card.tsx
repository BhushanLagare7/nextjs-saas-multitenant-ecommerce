import React from "react";
import Image from "next/image";
import Link from "next/link";

import { StarIcon } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  tenantSlug: string;
  tenantImageUrl?: string | null;
  reviewRating: number;
  reviewCount: number;
}

export const ProductCard = ({
  id,
  name,
  imageUrl,
  tenantSlug,
  tenantImageUrl,
  reviewRating,
  reviewCount,
}: ProductCardProps) => {
  return (
    <Link href={`/library/${id}`} prefetch>
      <div className="flex h-full flex-col overflow-hidden rounded-md border bg-white transition-shadow hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative aspect-square">
          <Image
            alt={name}
            className="object-cover"
            fill
            src={imageUrl || "/placeholder.png"}
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 border-y p-4">
          <h2 className="line-clamp-4 text-lg font-medium">{name}</h2>
          <div className="flex items-center gap-2">
            {tenantImageUrl && (
              <Image
                alt={tenantSlug}
                className="size-[16px] shrink-0 rounded-full border"
                height={16}
                src={tenantImageUrl}
                width={16}
              />
            )}
            <p className="text-sm font-medium underline">{tenantSlug}</p>
          </div>
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <StarIcon className="size-3.5 fill-black" />
              <p className="text-sm font-medium">
                {reviewRating} ({reviewCount})
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="aspect-3/4 w-full animate-pulse rounded-lg bg-neutral-200" />
  );
};
