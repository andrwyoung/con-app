// had to make a seperate "use client" component since not-found.tsx can't have
// metadata if it's also a client component

"use client";
import { Button } from "@/components/ui/button";
import { fireConfetti } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function NotFoundClient() {
  return (
    <div className="h-screen-dvh flex flex-col items-center justify-center text-center">
      <Image src="/404.png" width={400} alt="sunflower!" height={400} />
      <p className="text-lg font-semibold my-3 max-w-xs sm:max-w-2xl">
        Hi! We couldn’t find that page...but here&apos;s a fun button:
      </p>
      <Button
        onClick={fireConfetti}
        variant="outline"
        className="hover:bg-primary-lightest hover:text-primary-text hover:border-primary-light"
      >
        404 Party Button
      </Button>
      <Link href="/" className="text-primary-text mt-8 text-sm hover:underline">
        Back to Explore page →
      </Link>
    </div>
  );
}
