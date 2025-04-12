// the sole purpose of this file is because Next throws an error when
// useSearchParams() is used without being wrapped in a <Suspense> lol

import { Suspense } from "react";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}
