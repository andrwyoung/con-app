// TODO: Get rid of ./supabase.ts deprecates this
export const PERSONA = ["ATTENDEE", "ARTIST", "ORGANIZER"] as const;
export type Persona = (typeof PERSONA)[number];