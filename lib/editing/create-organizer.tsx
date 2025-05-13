import { supabaseAnon } from "@/lib/supabase/client";

export async function getOrCreateOrganizerId({
  organizerName,
  organizerId,
  organizerHasChanged,
}: {
  organizerName?: string | null;
  organizerId?: string | null;
  organizerHasChanged: boolean;
}): Promise<string | null> {
  const trimmedName = organizerName?.trim();
  if (
    !organizerHasChanged ||
    organizerId || // if already exists, use it
    !trimmedName ||
    trimmedName === ""
  ) {
    return organizerId ?? null;
  }

  const { data: existing, error: existingError } = await supabaseAnon
    .from("organizers")
    .select("organizer_id")
    .ilike("organizer_name", trimmedName)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) {
    return existing.organizer_id;
  } else {
    const { data: organizerData, error: insertError } = await supabaseAnon
      .from("organizers")
      .insert({ organizer_name: trimmedName })
      .select()
      .single();

    if (insertError || !organizerData) throw insertError;

    return organizerData.organizer_id;
  }
}
