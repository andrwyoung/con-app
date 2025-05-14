import { ConSize, OrganizerType } from "./con-types";
import { NewYearInfoFields } from "./suggestion-types";

export type PageOneFormCurrent = {
  description: string;
  conSize: ConSize | null;
  selectedOrganizer: OrganizerType | null;
  discontinued: boolean;
};

export type PageTwoFormCurrent = {
  socialLinks: string[];
  tags: string[];
  website: string;
};

export type PageThreeFormCurrent = {
  location: { lat?: number; long?: number };
  years: NewYearInfoFields[];
};
