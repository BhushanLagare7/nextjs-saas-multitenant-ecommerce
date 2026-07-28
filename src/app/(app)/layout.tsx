import "./globals.css";

/**
 * @file layout.tsx
 * @description Application layout component - Root layout for the entire application.
 * This layout wraps all pages and provides global providers and context.
 */
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

/**
 * @description Root layout metadata - SEO and Open Graph information.
 */
export const metadata: Metadata = {
  title: {
    default: "Storegrid - The Complete SaaS E-commerce Platform",
    template: "%s | Storegrid",
  },
  description:
    "The complete SaaS platform to launch, manage, and scale multiple e-commerce storefronts.",
  icons: {
    icon: "/icon.svg",
  },
};

/**
 * @interface AppLayoutProps
 * @description Interface for the application layout component props.
 */
interface AppLayoutProps {
  /** Child React nodes to render within the layout */
  children: React.ReactNode;
}

/**
 * @description Application layout component - Root layout for the entire application.
 * This layout wraps all pages and provides global providers and context.
 * @param props - Component props containing children
 */
export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} antialiased`}>
        <NuqsAdapter>
          <TRPCReactProvider>
            {children}
            <Toaster />
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
