"use client";

import { useEffect } from "react";

import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";

/**
 * Stripe verification page.
 * Verifies the Stripe checkout session and redirects the user to the appropriate URL.
 */
export default function StripeVerifyPage() {
  const trpc = useTRPC();

  // Mutation for verifying the Stripe checkout session
  const { mutate: verify } = useMutation(
    trpc.checkout.verify.mutationOptions({
      // Callback for successful verification
      onSuccess: (data) => {
        window.location.replace(data.url);
      },
      onError: () => {
        window.location.replace("/");
      },
    }),
  );

  // Trigger the verification mutation when the component mounts
  useEffect(() => {
    verify();
  }, [verify]);

  // Loading state - display a loader while verification is in progress
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoaderIcon className="text-muted-foreground animate-spin" />
    </div>
  );
}
