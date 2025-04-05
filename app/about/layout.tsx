// app/about/layout.tsx
import type { ReactNode } from "react";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* Shared layout for all /about routes */}
      <h1 className="text-2xl font-bold mb-4">About Section</h1>
      <div>{children}</div>
    </div>
  );
}
