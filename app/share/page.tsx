import Link from "next/link";
import React from "react";

export default function SharePage() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center text-primary-text">
      <span className="">
        Soon to come. But for now, here&apos;s the admin panel:
      </span>
      <span className="text-xs ">(cause idk where to put it yet)</span>
      <Link
        href={`/queue`}
        className="mt-4 px-4 py-1 border cursor-pointeer rounded-lg shadow-sm transition-all
        hover:scale-105 hover:text-primary-muted hover:bg-primary-lightest hover:border-primary"
      >
        Admin Panel
      </Link>
    </div>
  );
}
