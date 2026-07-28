import Link from "next/link";

import { ShoppingCartIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, generateTenantURL } from "@/lib/utils";

import { useCart } from "../../hooks/use-cart";

interface CheckoutButtonProps {
  className?: string;
  /** Hide button completely when cart is empty */
  hideIfEmpty?: boolean;
  tenantSlug: string;
}

/**
 * Cart button shown in navigation.
 * Displays item count and links to checkout.
 */
export function CheckoutButton({
  className,
  hideIfEmpty,
  tenantSlug,
}: CheckoutButtonProps) {
  const { totalItems } = useCart(tenantSlug);

  if (hideIfEmpty && totalItems === 0) return null;

  return (
    <Button asChild className={cn("bg-white", className)} variant="elevated">
      <Link href={`${generateTenantURL(tenantSlug)}/checkout`}>
        <ShoppingCartIcon /> {totalItems > 0 ? totalItems : ""}
      </Link>
    </Button>
  );
}
