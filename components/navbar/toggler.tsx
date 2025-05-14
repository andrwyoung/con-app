// this is the little "explor, plan, share" pill box on the top

"use client";
import { FiMapPin, FiCalendar, FiSend } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { label: "Explore", link: "/explore", icon: <FiMapPin /> },
  { label: "Plan", link: "/plan", icon: <FiCalendar /> },
  { label: "Share", link: "/share", icon: <FiSend /> },
];

export default function Toggler() {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = tabs.find((tab) => pathname.startsWith(tab.link))?.label;

  return (
    <div className="relative flex items-center bg-primary md:bg-white rounded-t-sm md:rounded-lg px-3 py-2 md:py-1.5 gap-6 md:gap-4 shadow-md justify-center">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => router.push(tab.link)}
          className={`flex items-center gap-1 md:gap-2 px-2 py-1 font-sans-header cursor-pointer rounded-lg text-md font-semibold transition-all active:scale-95 duration-200           ${
            activeTab == tab.label
              ? "bg-white md:bg-primary"
              : "hover:bg-primary-lightest hover:scale-105 "
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
