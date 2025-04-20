// app/not-found.tsx
import { Metadata } from "next";
import NotFoundClient from "./not-found/not-found-client";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "Sad we couldn’t find that page. But here's a 404 party",
};

export default function NotFoundPage() {
  return <NotFoundClient />;
}
