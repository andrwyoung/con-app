import { UUID } from "crypto";

// export const TAG_OPTIONS = [
//   "Family Friendly",
//   "Great Artist Alley",
//   "Well Organized",
//   "Awesome Panels",
//   "Would Go Again",
//   "Lots of People",
//   "A Little Slow",
//   "Not My Vibe",
// ] as const;

export const TAG_OPTIONS = [
  "Great Artist Alley",
  "Well Organized",
  "Good Foot Traffic",
  "Helpful Staff",
  "Smooth Setup/Takedown",
  "Would Go Again",
  "A Little Slow",
  "Unorganized",
  "Not Worth It",
] as const;

export type ReviewTag = (typeof TAG_OPTIONS)[number];

export type Review = {
  review_id: UUID;
  created_at: Date;

  user_id: string;
  convention_id: number;
  review_text: string;
  stars: number;

  tags: string[];

  // grabbing username too
  user_profiles?: {
    username: string;
  };
};
