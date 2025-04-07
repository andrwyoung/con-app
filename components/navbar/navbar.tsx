"use client";
import React from "react";
import Toggler from "./toggler";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import LoginModal from "../auth/login-modal";
import { fireConfetti } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";

export default function NavBar() {
  const pathname = usePathname();
  const user = useUser();
  console.log(user);

  return (
    <div
      className={`absolute left-0 top-0 w-screen bg-gradient-to-b from-gray-600 to-transparent pt-4 pb-6 px-8 ${
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
          className="hidden select-none lg:block transform -translate-x-[100%] translate-y-[8%] text-white text-[40px] hover:text-primary hover:scale-105 transition-all cursor-pointer font-sans-logo"
          onClick={fireConfetti}
        >
          ConCaly
        </div>
        <div className="flex flex-row gap-6 items-center">
          <LoginModal />
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {user ? user.id : "logged out"}
        </div>
      </div>
    </div>
  );
}
