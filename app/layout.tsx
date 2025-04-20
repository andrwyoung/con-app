import type { Metadata } from "next";
import { Raleway, Mulish, Pattaya } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navbar/navbar";
import UserProvider from "@/components/user-provider";
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const HeavyComponent = lazy(() => import("./map-wrapper"));

const raleway = Raleway({
  variable: "--font-header",
  subsets: ["latin"],
});

const mulish = Mulish({
  variable: "--font-body",
  subsets: ["latin"],
});

const pattaya = Pattaya({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    template: "%s - ConCaly",
    default: "ConCaly",
  },
  description:
    "Find, track, and plan your next convention — anime, comics, gaming, and more.",
  metadataBase: new URL("https://www.concaly.app"),
  keywords: [
    "conventions",
    "anime",
    "comic cons",
    "gaming expos",
    "convention planner",
    "event calendar",
    "convention schedule",
    "cosplay",
  ],
  applicationName: "ConCaly",
  alternates: {
    canonical: "https://www.concaly.app",
  },
  openGraph: {
    title: "ConCaly",
    description: "Find, track, and plan your next convention.",
    url: "https://www.concaly.app",
    siteName: "ConCaly",
    images: [
      {
        url: "/og-image.png", // ideally a real OG image at public root
        width: 1860,
        height: 954,
        alt: "ConCaly convention planning preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConCaly",
    description: "Discover and plan upcoming conventions.",
    creator: "@andrwyoung", // if you have a handle
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#FFD79E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pattaya.variable} ${mulish.variable} ${raleway.variable} antialiased`}
        style={{ margin: 0, padding: 0 }}
      >
        <UserProvider>
          <NavBar />
          {children}
          <Suspense>
            <HeavyComponent />
          </Suspense>
          <Toaster />
        </UserProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
