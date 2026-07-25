import "./globals.css";

import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

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

interface AppLayoutProps {
  children: React.ReactNode;
}

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
