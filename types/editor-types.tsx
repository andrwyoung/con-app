import { ConSize, OrganizerType } from "./con-types";
import { NewYearInfoFields } from "./suggestion-types";

export type PageOneFormState = {
  description: string;
  conSize: ConSize | null;
  selectedOrganizer: OrganizerType | null;
  discontinued: boolean;
};

export type PageTwoFormState = {
  socialLinks: string[];
  tags: string[];
  website: string;
};

export type PageThreeFormState = {
  location: { lat?: number; long?: number };
  years: NewYearInfoFields[];
};

export type AAFormState = {
  startDate: Date | undefined;
  deadline: Date | undefined;
  website: string | null;
  aaExistence: "unknown" | "invite_only" | "no_aa";
  aaStatus: "unknown" | "open" | "watch_link" | "closed" | "waitlist";
};

export type NewConState = {
  conName: string;
  website: string;
  description: string;

  year: number | undefined;
  start_date: string | null | undefined;
  end_date: string | null | undefined;

  venue: string;
  location: string;
  latLong: { lat?: number; long?: number };
};
