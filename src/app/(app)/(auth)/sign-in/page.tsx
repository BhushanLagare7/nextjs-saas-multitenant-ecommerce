import { redirect } from "next/navigation";

import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { caller } from "@/trpc/server";

export const dynamic = "force-dynamic";

/**
 * Sign-in page component.
 * Checks for an active session and redirects to the home page if the user is already authenticated.
 */
export default async function SignInPage() {
  const session = await caller.auth.session();

  // Prevent authenticated users from accessing the sign-in page
  if (session.user) {
    redirect("/");
  }

  return <SignInView />;
}
