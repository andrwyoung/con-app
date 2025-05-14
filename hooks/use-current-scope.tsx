// some component are reused in different files but have different behaviors
// depending on the page, this function just determines which "scope" or page
// a component is in

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
