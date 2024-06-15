import type { Metadata, Viewport } from "next";
import { Courier_Prime } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@acme/ui";
import { ThemeProvider, ThemeToggle } from "@acme/ui/theme";
import { Toaster } from "@acme/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { env } from "~/env";

// If loading a variable font, you don't need to specify the font weight
const courier = Courier_Prime({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-courier-prime",
  weight: "400",
});

export const metadata: Metadata = {
  description: "Simple monorepo with shared backend for web & mobile apps",
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://turbo.t3.gg"
      : "http://localhost:3000",
  ),
  openGraph: {
    description: "Simple monorepo with shared backend for web & mobile apps",
    siteName: "Create T3 Turbo",
    title: "Create T3 Turbo",
    url: "https://create-t3-turbo.vercel.app",
  },
  title: "Create T3 Turbo",
  twitter: {
    card: "summary_large_image",
    creator: "@jullerino",
    site: "@jullerino",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { color: "white", media: "(prefers-color-scheme: light)" },
    { color: "black", media: "(prefers-color-scheme: dark)" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "relative min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
          courier.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <div className="fixed bottom-4 right-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
