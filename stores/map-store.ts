// map store so all components in explore can access it
import { ConLocation } from "@/types/types";
import { create } from "zustand";


type MapStore = {
  flyTo?: (location: ConLocation, zoom?: number) => void;
  setFlyTo: (fun: (location: ConLocation, zoom?: number) => void) => void;

  clearSelectedPointHighlight?: () => void;
  setClearSelectedPointHighlight: (fn: () => void) => void;

  highlightPointOnMap?: (id: string | number) => void;
  setHighlightPointOnMap: (fn: (id: string | number) => void) => void;

  clearClickedClusterHighlight?: () => void;
  setClearClickedClusterHighlight: (fn: () => void) => void;
};

export const useMapStore = create<MapStore>((set) => ({
  flyTo: undefined,
  setFlyTo: (fun) => set({flyTo: fun}),

  clearSelectedPointHighlight: undefined,
  setClearSelectedPointHighlight: (fn) => set({ clearSelectedPointHighlight: fn }),
  
  highlightPointOnMap: undefined,
  setHighlightPointOnMap: (fn) => set({ highlightPointOnMap: fn }),

  clearClickedClusterHighlight: undefined,
  setClearClickedClusterHighlight: (fn) => set({ clearClickedClusterHighlight: fn }),
}))