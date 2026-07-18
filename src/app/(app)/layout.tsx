import "./globals.css";

import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn("h-full", "antialiased", "font-sans", dmSans.variable)}
      lang="en"
    >
      <body className="flex min-h-full flex-col">
        <TRPCReactProvider>
          {children}
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
