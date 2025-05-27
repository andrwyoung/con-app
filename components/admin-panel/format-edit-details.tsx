// con-details-field-map.ts
export const conDetailsFieldConfig = [
  { label: "Size:", dbField: "con_size", changeKeys: ["size"] },
  {
    label: "Organizer ID:",
    dbField: "organizer_id",
    changeKeys: ["organizerId"],
  },
  {
    label: "Organizer Name:",
    dbField: "organizer_name",
    changeKeys: ["organizerName"],
  },
  {
    label: "Description:",
    dbField: "new_description",
    changeKeys: ["description"],
  },
  {
    label: "Discontinued:",
    dbField: "discontinued",
    changeKeys: ["discontinued"],
  },
  {
    label: "Tags:",
    dbField: "new_tags",
    changeKeys: ["tags"],
    formatter: (val: string[]) => val.join(", "),
  },
  {
    label: "Social Links:",
    dbField: "new_social_links",
    changeKeys: ["social"],
  },
  { label: "Website:", dbField: "new_website", changeKeys: ["website"] },
  { label: "Latitude:", dbField: "new_lat", changeKeys: ["latitude"] },
  { label: "Longitude:", dbField: "new_long", changeKeys: ["longitude"] },
  { label: "Notes:", dbField: "notes", changeKeys: ["notes"] },
] as const;
