import Link from "next/link";

import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { Category } from "@/payload-types";

interface Props {
  category: CategoriesGetManyOutput[1];
  isOpen: boolean;
}

export const SubcategoryMenu = ({ category, isOpen }: Props) => {
  if (
    !isOpen ||
    !category.subcategories ||
    category.subcategories.length === 0
  ) {
    return null;
  }

  const backgroundColor = category.color || "#F5F5F5";

  return (
    <div
      className="absolute z-100"
      style={{
        top: "100%",
        left: 0,
      }}
    >
      {/* Invisible bridge to maintain hover */}
      <div className="h-3 w-60" />
      <div
        className="w-60 -translate-x-[2px] -translate-y-[2px] overflow-hidden rounded-md border text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        style={{ backgroundColor }}
      >
        <div>
          {category.subcategories?.map((subcategory: Category) => (
            <Link
              key={subcategory.slug}
              className="flex w-full items-center justify-between p-4 text-left font-medium underline hover:bg-black hover:text-white"
              href={`/${category.slug}/${subcategory.slug}`}
            >
              {subcategory.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
