"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useProductFilters } from "../../hooks/use-product-filters"

export const ProductSort = () => {
  const [filters, setFilters] = useProductFilters();

  return (
    <div className="flex items-center gap-2">
      <Button
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "curated" &&
            "bg-transparent border-transparent hover:border-border hover:bg-transparent"
        )}
        size="sm"
        variant="secondary"
        onClick={() => setFilters({ sort: "curated" })}
      >
        Curated
      </Button>
      <Button
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "trending" &&
            "bg-transparent border-transparent hover:border-border hover:bg-transparent"
        )}
        size="sm"
        variant="secondary"
        onClick={() => setFilters({ sort: "trending" })}
      >
        Trending
      </Button>
      <Button
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "hot_and_new" &&
            "bg-transparent border-transparent hover:border-border hover:bg-transparent"
        )}
        size="sm"
        variant="secondary"
        onClick={() => setFilters({ sort: "hot_and_new" })}
      >
        Hot & New
      </Button>
    </div>
  );
};
