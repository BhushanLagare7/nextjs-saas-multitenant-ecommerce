"use client";

import { useState } from "react";

import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { useProductFilters } from "../../hooks/use-product-filters";

import { PriceFilter } from "./price-filter";
import { TagsFilter } from "./tags-filter";

interface ProductFilterProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const ProductFilter = ({ title, className, children }: ProductFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div className={cn("flex flex-col gap-2 border-b p-4", className)}>
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setIsOpen((current) => !current)}
      >
        <p className="font-medium">{title}</p>
        <Icon className="size-5" />
      </div>
      {isOpen && children}
    </div>
  );
};

export const ProductFilters = () => {
  const [filters, setFilters] = useProductFilters();

  const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "sort") return false;

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === "string") {
      return value !== "";
    }

    return value !== null;
  });

  const onClear = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      tags: [],
    });
  };

  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-md border bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <p className="font-medium">Filters</p>
        {hasAnyFilters && (
          <button
            className="cursor-pointer underline"
            type="button"
            onClick={() => onClear()}
          >
            Clear
          </button>
        )}
      </div>
      <ProductFilter title="Price">
        <PriceFilter
          maxPrice={filters.maxPrice}
          minPrice={filters.minPrice}
          onMaxPriceChange={(value) => onChange("maxPrice", value)}
          onMinPriceChange={(value) => onChange("minPrice", value)}
        />
      </ProductFilter>
      <ProductFilter className="border-b-0" title="Tags">
        <TagsFilter
          value={filters.tags}
          onChange={(value) => onChange("tags", value)}
        />
      </ProductFilter>
    </div>
  );
};
