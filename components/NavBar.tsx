"use client";
import React from "react";
import Toggler from "./navbar/Toggler";
import Link from "next/link";
import { usePathname } from "next/navigation";
import confetti from "canvas-confetti";

const fireConfettiFromClick = (e: React.MouseEvent) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  confetti({
    particleCount: 100,
    spread: 360,

    origin: { x, y }, // 🔥 where the click happened
  });
};

export default function NavBar() {
  const pathname = usePathname();

  return (
    <div
      className={`absolute left-0 top-0 w-screen bg-gradient-to-b from-gray-600 to-transparent pt-3 pb-4 px-8 ${
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
        <div
          className="hidden lg:block transform -translate-x-[100%] translate-y-[8%] text-white text-[40px] hover:text-primary hover:scale-105 transition-all cursor-pointer font-sans-logo"
          onClick={fireConfettiFromClick}
        >
          ConCaly
        </div>
        <h1>Login</h1>
      </div>
    </div>
  );
}
