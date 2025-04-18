import { supabaseAnon } from "../supabase/client";
import { Review } from "@/components/details-panel/reviews-section/reviews-section";

export async function grabAllReviewsForConvention(
  conventionId: number
): Promise<Review[]> {
  const { data, error } = await supabaseAnon
    .from("reviews")
    .select("*")
    .eq("convention_id", conventionId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return data as Review[];
}
