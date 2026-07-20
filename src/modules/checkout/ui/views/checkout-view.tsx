"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQuery } from "@tanstack/react-query";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { toast } from "sonner";

import { generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

import { useCart } from "../../hooks/use-cart";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { CheckoutItem } from "../components/checkout-item";
import { CheckoutSidebar } from "../components/checkout-sidebar";

interface CheckoutViewProps {
  tenantSlug: string;
}

export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
  const router = useRouter();
  const [states, setStates] = useCheckoutStates();
  const { productIds, removeProduct, clearCart } = useCart(tenantSlug);

  const trpc = useTRPC();
  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    }),
  );

  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setStates({ success: false, cancel: false });
      },
      onSuccess: (data) => {
        window.location.replace(data.url);
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          // TODO: Modify when subdomains enabled
          router.push("/sign-in");
        }

        toast.error(error.message);
      },
    }),
  );

  useEffect(() => {
    if (states.success) {
      setStates({ success: false, cancel: false });
      clearCart();
      // TODO: Invalidate library
      router.push("/products");
    }
  }, [states.success, clearCart, router, setStates]);

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearCart();
      toast.warning("Invalid products found, cart cleared");
    }
  }, [error, clearCart]);

  if (isLoading) {
    return (
      <div className="px-4 pt-4 lg:px-12 lg:pt-16">
        <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8">
          <LoaderIcon className="text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }

  if (data?.totalDocs === 0) {
    return (
      <div className="px-4 pt-4 lg:px-12 lg:pt-16">
        <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8">
          <InboxIcon />
          <p className="text-base font-medium">No products found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 lg:px-12 lg:pt-16">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="overflow-hidden rounded-md border bg-white">
            {data?.docs.map((product, index) => (
              <CheckoutItem
                key={product.id}
                imageUrl={product.image?.url}
                isLast={index === data.docs.length - 1}
                name={product.name}
                price={product.price}
                productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
                tenantName={product.tenant.name}
                tenantUrl={generateTenantURL(product.tenant.slug)}
                onRemove={() => removeProduct(product.id)}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <CheckoutSidebar
            disabled={purchase.isPending}
            isCanceled={states.cancel}
            total={data?.totalPrice || 0}
            onPurchase={() => purchase.mutate({ tenantSlug, productIds })}
          />
        </div>
      </div>
    </div>
  );
};
