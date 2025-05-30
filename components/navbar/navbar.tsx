// the navbar! it's everything you see on that gradient on the top
// it also hosts the pop up thing you use to login and also the welcome pop up thing

"use client";
import React from "react";
import Toggler from "./toggler";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarImage } from "../ui/avatar";
import LoginModal from "../auth/login-modal";
import { fireConfetti } from "@/lib/utils";
import { FiLock } from "react-icons/fi";
import { supabaseAnon } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import WelcomeModal from "../onboarding/welcome-modal";
import { toast } from "sonner";
import { useListStore } from "@/stores/list-store";

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

  const resetLists = useListStore((s) => s.resetLists);
  const showNav = !pathname.startsWith("/about");

  return (
    <>
      <div
        className={`hidden md:block absolute left-0 top-0 w-screen pt-4 pb-6 px-8 z-10
            ${
              showNav
                ? "bg-gradient-to-b from-gray-600 to-transparent "
                : "bg-transparent"
            }
        `}
      >
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-6">
            <Toggler />
            {showNav && (
              <Link
                href="/about"
                className="text-md hidden md:block text-white font-bold transition-all hover:text-primary hover:scale-105"
              >
                About
              </Link>
            )}
          </div>

          {showNav && (
            <div
              className={`hidden select-none lg:block transform  translate-y-[8%] text-[40px] 
             hover:scale-105 transition-all cursor-pointer font-sans-logo hover:text-primary text-white -translate-x-[100%]`}
              onClick={fireConfetti}
            >
              ConCaly
            </div>
          )}

          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex cursor-pointer flex-row gap-2 items-center group transition-all duration-200 hover:scale-105">
                  <button
                    type="button"
                    className={`font-bold cursor-pointer text-lg 
                      ${
                        showNav
                          ? "text-white group-hover:text-primary"
                          : "text-primary-text group-hover:text-secondary-darker"
                      }`}
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
                {/* <DropdownButton>
                <FiFile />
                Profile
              </DropdownButton>
              <DropdownButton>
                <FiGrid />
                Settings
              </DropdownButton> */}
                <DropdownButton
                  onClick={async () => {
                    await supabaseAnon.auth.signOut();
                    resetLists();
                    toast.success("Succesfully Logged Out");
                  }}
                >
                  <FiLock />
                  Log out
                </DropdownButton>
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
    </>
  );
}
