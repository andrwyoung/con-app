"use client";
import React from "react";
import Toggler from "./navbar/Toggler";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <div
      className={`absolute left-0 top-0 w-screen bg-gradient-to-b from-gray-600 to-transparent py-6 px-8 ${
        pathname?.startsWith("/about") ? "hidden" : "block"
      }`}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-6">
          <Toggler />
          <Link
            href="/about"
            className="text-md hidden md:block text-white font-bold transition-all hover:text-primary hover:scale-105"
          >
            About + Pricing
          </Link>
        </div>
        <div className="hidden lg:block transform -translate-x-[53%] translate-y-[8%] text-white text-5xl font-sans-logo">
          ConCaly
        </div>
        <h1>Login</h1>
      </div>
    </div>
  );
}
