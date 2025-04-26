// the sole purpose of file is to initialize useUser() on top level
// without needing to have layout.tsx be a Client component

"use client";

import { useUser } from "@/hooks/use-user";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useUser();
  return <>{children}</>;
}
