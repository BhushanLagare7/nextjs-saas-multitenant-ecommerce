"use client";

import { TriangleAlertIcon } from "lucide-react";

/**
 * Tenants product ID error page.
 * Displays an error message when a product is not found.
 */
export default function TenantsProductIdErrorPage() {
  return (
    <div className="px-4 py-10 lg:px-12">
      <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8">
        <TriangleAlertIcon />
        <p className="text-base font-medium">Something went wrong</p>
      </div>
    </div>
  );
}
