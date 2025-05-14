import { ConSize, OrganizerType } from "./con-types";

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
