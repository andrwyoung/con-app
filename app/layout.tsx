import type { Metadata } from "next";
import { Raleway, Mulish, Pattaya } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navbar/navbar";

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
  title: "Convention App",
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
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}
