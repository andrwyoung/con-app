// the sidebar itself
// it's kept intentionally light to prevent prop drilling for all the different modes
// all the logic is handled inside the modes themselves and they all talk to their global stores
import SearchBar from "../../components/sidebar/searchbar";
import SearchMode from "../../components/sidebar/modes/search-mode";
import { useSidebarStore } from "@/stores/explore-sidebar-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FilterMode from "../../components/sidebar/modes/filter-mode";

export type sidebarModes = "search" | "filter";

export default function Sidebar() {
  const router = useRouter();

  const { sidebarMode: mode, selectedCon, initialized } = useSidebarStore();

  // when you click on a con, change the url to reflect which one you click
  useEffect(() => {
    if (!initialized) return;

    if (selectedCon) {
      router.push(`/explore?con=${selectedCon.slug}`, { scroll: false });
    } else {
      router.push(`/explore`, { scroll: false });
    }
  }, [selectedCon, router, initialized]);

  return (
    <div className="flex flex-col gap-2 w-80 max-h-[calc(100vh-14rem)] border rounded-lg shadow-xl bg-white px-5 py-6">
      <SearchBar key={mode} />
      {/* <StatusDotTester /> */}
      {mode === "search" && <SearchMode />}
      {mode === "filter" && <FilterMode />}
    </div>
  );
}
