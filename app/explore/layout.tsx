import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Browse and discover upcoming conventions near you — filter by category, date, and location.",
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}
