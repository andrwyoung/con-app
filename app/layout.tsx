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
    template: "ConCaly | %s",
    default: "ConCaly",
  },
  description: "Search and Plan conventions",
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
