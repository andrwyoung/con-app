"use client";

import DetailsPanel from "@/components/details-panel/details-panel";
import SuggestionPanel from "./sug-panel";
import { useState } from "react";
import Image from "next/image";

export type lightweightConInfo = {
  id: number;
  name: string;
};

export default function AdminPage() {
  const [selectedCon, setSelectedCon] = useState<lightweightConInfo | null>(
    null
  );

  return (
    <div className="w-screen h-screen flex items-center justify-center gap-12 pt-12 z-10">
      <div
        className="flex flex-col w-[30%] h-[calc(100dvh-16rem)] shadow-lg rounded-lg p-4
      relative"
      >
        <SuggestionPanel selectCon={setSelectedCon} />
      </div>
      <div className="relative flex flex-col h-[calc(100dvh-16rem)] w-96 bg-white rounded-lg shadow-xl z-10">
        {selectedCon ? (
          <>
            <DetailsPanel
              scope="unknown"
              conId={selectedCon.id}
              conName={selectedCon.name}
            />
            {/* <SidebarBackground /> */}
          </>
        ) : (
          <div className="relative text-sm text-primary-text flex h-full w-full items-center justify-center ">
            <div className="flex flex-col absolute bottom-0 gap-6">
              <div className="px-4 py-2 bg-primary-light w-fit rounded-lg relative">
                <h1> hi. select a con! </h1>
                <div className="absolute right-4 -bottom-2 w-0 h-0 border-t-[10px] border-t-primary-light border-x-[10px] border-x-transparent" />
              </div>
              <Image
                src={"/cat.png"}
                alt="Cat image placeholder"
                width={250}
                height={150}
                className="opacity-80"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
