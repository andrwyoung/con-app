"use client";
import React from "react";
import Toggler from "./toggler";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarImage } from "../ui/avatar";
import LoginModal from "../auth/login-modal";
import { fireConfetti } from "@/lib/utils";
import { FiFile, FiGrid, FiLock } from "react-icons/fi";
import { supabaseAnon } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import WelcomeModal from "../onboarding/welcome-modal";

function DropdownButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex flex-row gap-2 text-left px-2 py-1 hover:bg-gray-100 cursor-pointer rounded items-center"
    >
      {children}
    </button>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  const profile = useUserStore((s) => s.profile);
  console.log(user);

  return (
    <div
      className={`absolute left-0 top-0 w-screen bg-gradient-to-b from-gray-600 to-transparent pt-4 pb-6 px-8 z-10 ${
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
            About + Foundry
          </Link>
        </div>
        <div
          className="hidden select-none lg:block transform -translate-x-[100%] translate-y-[8%] text-white text-[40px] hover:text-primary hover:scale-105 transition-all cursor-pointer font-sans-logo"
          onClick={fireConfetti}
        >
          ConCaly
        </div>

        {user ? (
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex cursor-pointer flex-row gap-2 items-center group transition-all duration-200 hover:scale-105">
                <button
                  type="button"
                  className="text-white font-bold cursor-pointer text-lg group-hover:text-primary"
                >
                  {profile?.username}
                </button>
                <Avatar>
                  <AvatarImage
                    src="https://github.com/andrwyoung.png"
                    className="shadow-inner shadow-black/20"
                  />
                </Avatar>
              </div>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-32 p-2 text-sm bg-white shadow-lg rounded-md"
            >
              <DropdownButton>
                <FiFile />
                Profile
              </DropdownButton>
              <DropdownButton>
                <FiGrid />
                Settings
              </DropdownButton>
              <DropdownButton
                onClick={async () => {
                  // TODO: toast saying logged out
                  await supabaseAnon.auth.signOut();
                }}
              >
                <FiLock />
                Log out
              </DropdownButton>
              {/* Add more options here later, like "Profile", "Settings", etc */}
            </PopoverContent>
          </Popover>
        ) : (
          // if user is not logged in
          <LoginModal />
        )}
      </div>
      {/* gotta put the welcome modal somewhere... */}
      {profile && <WelcomeModal />}
    </div>
  );
}
