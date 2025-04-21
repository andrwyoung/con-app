import ListPanel from "@/components/list-panel/list-panel";
import React from "react";

export default function page() {
  return (
    <div className="flex flex-row gap-8">
      <ListPanel isOpen={true} draggedCon={null} scope="plan" />
    </div>
  );
}
