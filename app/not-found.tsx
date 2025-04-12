"use client";
import { Button } from "@/components/ui/button";
import { fireConfetti } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <Image src="/404.png" width={400} alt="sunflower!" height={400} />
      <p className="text-lg font-semibold my-3 max-w-xs sm:max-w-2xl">
        Hi! We couldn’t find that page...but here&apos;s some confetti:
      </p>
      <Button
        onClick={fireConfetti}
        variant="outline"
        className="hover:bg-primary-lightest hover:text-primary-text hover:border-primary-light"
      >
        {/* <Image
          src="/confetti.png"
          height={24}
          width={24}
          alt="confetti icon"
          className="transform -translate-y-1"
        /> */}
        404 Party Button
      </Button>
      <Link href="/" className="text-primary-text mt-8 text-sm hover:underline">
        Back to Explore page →
      </Link>
    </div>
  );
}
