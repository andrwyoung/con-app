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

  const activeTab =
    tabs.find((tab) => pathname.startsWith(tab.link))?.label || "Explore";

  return (
    <div className="relative flex items-center bg-white rounded-lg px-4 py-2 gap-4 shadow-md w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => router.push(tab.link)}
          className={`flex items-center gap-2 px-2 py-1 font-sans-header rounded-lg text-md font-semibold transition-all active:scale-95 duration-200           ${
            activeTab == tab.label
              ? "bg-primary"
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
