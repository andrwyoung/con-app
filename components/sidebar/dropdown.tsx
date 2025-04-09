import { EventInfo } from "@/types/types";
import React from "react";

type DropdownItem = {
  id: string;
  type: "result" | "action" | "message";
  label: string;
  data?: EventInfo;
  onClick?: () => void;
};

export default function dropdown() {
  const items: DropdownItem[] = [];

  // if (!searc)

  return <div>dropdown</div>;
}
