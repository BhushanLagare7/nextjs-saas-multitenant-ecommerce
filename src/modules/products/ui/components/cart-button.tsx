import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";

interface Props {
  tenantSlug: string;
  productId: string;
  isPurchased?: boolean;
}

export const CartButton = ({ tenantSlug, productId, isPurchased }: Props) => {
  const cart = useCart(tenantSlug);

  if (isPurchased) {
    return (
      <Button
        asChild
        className="flex-1 bg-white font-medium"
        variant="elevated"
      >
        <Link href={`/library/${productId}`} prefetch>
          View in Library
        </Link>
      </Button>
    );
  }

  return (
    <Button
      className={cn(
        "flex-1 bg-pink-400",
        cart.isProductInCart(productId) && "bg-white",
      )}
      variant="elevated"
      onClick={() => cart.toggleProduct(productId)}
    >
      {cart.isProductInCart(productId) ? "Remove from cart" : "Add to cart"}
    </Button>
  );
};
