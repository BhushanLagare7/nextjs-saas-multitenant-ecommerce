import "./globals.css";

/**
 * @file layout.tsx
 * @description Application layout component - Root layout for the entire application.
 * This layout wraps all pages and provides global providers and context.
 */
import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!appUrl) {
  throw new Error(
    "CRITICAL: NEXT_PUBLIC_APP_URL is not set in the environment variables.",
  );
}

/**
 * @description Viewport configuration for browser rendering.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

/**
 * @description Root layout metadata - SEO, Open Graph, and Twitter information.
 */
export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Storegrid - The Complete SaaS E-commerce Platform",
    template: "%s | Storegrid",
  },
  description:
    "The complete SaaS platform to launch, manage, and scale multiple e-commerce storefronts.",
  keywords: [
    "e-commerce",
    "multi-tenant",
    "saas",
    "storefront",
    "digital products",
    "online store",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Storegrid",
    title: "Storegrid - The Complete SaaS E-commerce Platform",
    description:
      "The complete SaaS platform to launch, manage, and scale multiple e-commerce storefronts.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Storegrid - The Complete SaaS E-commerce Platform",
    description:
      "The complete SaaS platform to launch, manage, and scale multiple e-commerce storefronts.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
