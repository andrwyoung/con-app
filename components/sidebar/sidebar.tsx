// the sidebar itself
// it's kept intentionally light to prevent prop drilling for all the different modes
// all the logic is handled inside the modes themselves and they all talk to their global stores
import SearchBar from "./searchbar";
import DetailsPanel from "./details-panel";
import SearchMode from "./modes/search-mode";
import { useSidebarStore } from "@/stores/explore-sidebar-store";
import MapMode from "./modes/map-mode";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export type sidebarModes = "search" | "filter" | "map";

export default function Sidebar() {
  const router = useRouter();

  const { sidebarMode: mode, setSelectedCon, selectedCon } = useSidebarStore();

  // when you click on a con, change the url to reflect which one you click
  useEffect(() => {
    if (selectedCon) {
      router.push(`/explore?conId=${selectedCon.id}`, { scroll: false });
    } else {
      router.push(`/explore`, { scroll: false });
    }
  }, [selectedCon, router]);

  return (
    <div className="absolute z-10 top-32 left-10">
      <div className="flex flex-col gap-2 w-80 max-h-[calc(100vh-14rem)] rounded-lg shadow-lg bg-white px-5 py-6">
        <SearchBar key={mode} />
        {mode === "search" && <SearchMode />}
        {mode === "filter" && <div>filter mode</div>}
        {mode === "map" && <MapMode />}
      </div>

      {selectedCon && (
        <DetailsPanel con={selectedCon} onClose={() => setSelectedCon(null)} />
      )}
    </div>
  );
}
