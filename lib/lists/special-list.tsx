import { SPECIAL_LIST_KEYS } from "../constants";

export type SpecialListKey = (typeof SPECIAL_LIST_KEYS)[number];

export function isSpecialListKey(key: string): key is SpecialListKey {
  return SPECIAL_LIST_KEYS.includes(key as SpecialListKey);
}
