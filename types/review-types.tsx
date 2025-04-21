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
  review_id: string;
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
