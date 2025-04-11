// map store so all components in explore can access it
import { ConLocation } from "@/types/types";
import { create } from "zustand";


type MapStore = {
  userLocation: ConLocation | null;
  setUserLocation: (loc: ConLocation) => void;

  flyTo?: (location: ConLocation, zoom?: number) => void;
  setFlyTo: (fun: (location: ConLocation, zoom?: number) => void) => void;

  flyToMyLocation?: () => void;
  setFlyToMyLocation: (fn: () => void) => void;

  getCurrentCenter: () => [number, number] | null;
  setGetCurrentCenter: (fn: () => [number, number] | null) => void; 

  clearSelectedPointHighlight?: () => void;
  setClearSelectedPointHighlight: (fn: () => void) => void;

  highlightPointOnMap?: (id: string | number) => void;
  setHighlightPointOnMap: (fn: (id: string | number) => void) => void;

  clearClickedClusterHighlight?: () => void;
  setClearClickedClusterHighlight: (fn: () => void) => void;
};

export const useMapStore = create<MapStore>((set) => ({
  userLocation: null,
  setUserLocation: (loc) => set({ userLocation: loc }),

  flyTo: undefined,
  setFlyTo: (fun) => set({flyTo: fun}),

  flyToMyLocation: undefined,
  setFlyToMyLocation: (fn) => set({ flyToMyLocation: fn }),

  getCurrentCenter: () => null,
  setGetCurrentCenter: (fn) => set({ getCurrentCenter: fn }),

  clearSelectedPointHighlight: undefined,
  setClearSelectedPointHighlight: (fn) => set({ clearSelectedPointHighlight: fn }),
  
  highlightPointOnMap: undefined,
  setHighlightPointOnMap: (fn) => set({ highlightPointOnMap: fn }),

  clearClickedClusterHighlight: undefined,
  setClearClickedClusterHighlight: (fn) => set({ clearClickedClusterHighlight: fn }),
}))