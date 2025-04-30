import { Scope } from "@/types/con-types";
import { usePathname } from "next/navigation";

export function useCurrentScope(): Scope {
  const pathname = usePathname();

  if (!pathname) return "unknown";

  if (pathname.includes("/explore")) return "explore";
  if (pathname.includes("/plan")) return "plan";
  if (pathname.includes("/share")) return "share";

  return "unknown";
}
