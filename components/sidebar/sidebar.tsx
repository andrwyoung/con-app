// the sidebar itself
// it's kept intentionally light to prevent prop drilling for all the different modes
// all the logic is handled inside the modes themselves and they all talk to their global stores
import SearchBar from "./searchbar";
import DetailsPanel from "./details-panel";
import SearchMode from "./modes/search-mode";
import { useSidebarStore } from "@/stores/explore-sidebar-store";
import MapMode from "./modes/map-mode";

export type sidebarModes = "search" | "filter" | "map";

export default function Sidebar() {
  const { sidebarMode: mode, setSelectedCon, selectedCon } = useSidebarStore();

  return (
    <div className="absolute z-10 top-36 left-8">
      <div className="flex flex-col gap-2 w-80 max-h-180 h-full rounded-lg shadow-lg bg-white px-5 py-6">
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
