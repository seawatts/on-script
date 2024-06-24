import type { Metadata, Viewport } from "next";
import { Courier_Prime } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@on-script/ui";
import { ThemeProvider } from "@on-script/ui/theme";
import { Toaster } from "@on-script/ui/toast";

import "~/app/globals.css";

import { env } from "~/env";
import { UserStoreProvider } from "~/providers/user-store-provider";

// If loading a variable font, you don't need to specify the font weight
const courier = Courier_Prime({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-courier-prime",
  weight: "400",
});

export const metadata: Metadata = {
  description: "OnScript is an AI script-reading tool",
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://on-script.vercel.app"
      : "http://localhost:3000",
  ),
  openGraph: {
    description: "OnScript is an AI script-reading tool",
    siteName: "OnScript",
    title: "OnScript",
    url: "https://on-script.vercel.app",
  },
  title: "OnScript",
  twitter: {
    card: "summary_large_image",
    creator: "@seawatts",
    site: "@seawatts",
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
    // <ClerkProvider>
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
          {/* <TRPCReactProvider> */}
          {/* <header>
                <SignedOut>
                <SignInButton />
                </SignedOut>
                <SignedIn>
                <UserButton />
                </SignedIn>
                </header> */}
          <UserStoreProvider user={undefined}>
            {props.children}
          </UserStoreProvider>
          {/* </TRPCReactProvider> */}
          {/* <div className="fixed bottom-4 right-4">
            <ThemeToggle />
          </div> */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
    // </ClerkProvider>
  );
}
