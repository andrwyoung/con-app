import { SortType } from "./sort-types";
import { ConLocation } from "./con-types";

export type SearchType = "typed" | "clicked" | "current-location" | "near-me";

export type SearchContext =
  | { type: "typed"; query: string; sort: SortType }
  | { type: "clicked"; query: string; sort: SortType }
  | { type: "current-location"; location: ConLocation; sort: SortType }
  | { type: "near-me"; location: ConLocation; sort: SortType };

export type SearchState = {
  context: SearchContext | null;
};
