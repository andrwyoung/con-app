import { Review } from "@/types/review-types";
import { supabaseAnon } from "../supabase/client";

export async function grabAllReviewsForConvention(
  conventionId: number
): Promise<Review[]> {
  const { data, error } = await supabaseAnon
    .from("reviews")
    .select("*, user_profiles(username)")
    .eq("convention_id", conventionId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return data as Review[];
}
