"use client";

import DetailsPanel, {
  DetailsPanelRef,
} from "@/components/details-panel/details-panel";
import SuggestionPanel from "./sug-panel";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { fetchSuggestions } from "@/lib/admin/fetch-suggestions";
import { UnifiedSuggestion } from "@/types/admin-panel-types";
import { useAdminPanelStore } from "@/stores/admin-panel-store";

export type GroupedSuggestion = {
  conId: number | null;
  conName: string;
  suggestions: UnifiedSuggestion[];
};

export default function AdminPage() {
  const selectedCon = useAdminPanelStore((s) => s.selectedCon);
  const setSelectedCon = useAdminPanelStore((s) => s.setSelectedCon);

  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<GroupedSuggestion[]>([]);
  const panelRef = useRef<DetailsPanelRef>(null);

  const refreshDetailsPanel = useCallback(() => {
    // refresh details panel
    panelRef.current?.refetch();
  }, []);

  const init = useCallback(async () => {
    setLoading(true);
    const flatSuggestions = await fetchSuggestions();

    const groupedMap = flatSuggestions.reduce((acc, sugg) => {
      const key =
        sugg.conId === undefined || sugg.conId === null
          ? `new-${sugg.id}`
          : sugg.conId;

      if (!acc[key]) {
        acc[key] = {
          conId: sugg.conId ?? null,
          conName: sugg.conName,
          suggestions: [],
        };
      }

      acc[key].suggestions.push(sugg);
      return acc;
    }, {} as Record<string, GroupedSuggestion>);

    const groupedSuggestions = Object.values(groupedMap).sort((a, b) =>
      a.conName.localeCompare(b.conName)
    );
    setSuggestions(groupedSuggestions);

    refreshDetailsPanel();

    setLoading(false);
  }, [refreshDetailsPanel]);

  const removeSuggestionById = (id: string) => {
    setSuggestions(
      (prev) =>
        prev
          .map((group) => ({
            ...group,
            suggestions: group.suggestions.filter((s) => s.id !== id),
          }))
          .filter((group) => group.suggestions.length > 0) // remove empty groups
    );
  };

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="w-screen h-screen flex items-center justify-center gap-6 lg:gap-12 pt-12 z-10 px-4">
      <div
        className="flex flex-col w-[70%] max-w-3xl h-[calc(100dvh-16rem)] shadow-lg rounded-lg p-4
      relative"
      >
        <SuggestionPanel
          suggestions={suggestions}
          loading={loading}
          refreshDetails={() => refreshDetailsPanel()}
          refetchSuggestions={() => init()}
          setSelectedCon={setSelectedCon}
          removeSuggestion={removeSuggestionById}
        />
      </div>

      <div className="relative hidden md:flex flex-col h-[calc(100dvh-16rem)] w-96 bg-white rounded-lg shadow-xl z-10">
        {selectedCon ? (
          <DetailsPanel
            ref={panelRef}
            scope="unknown"
            conId={selectedCon.conId}
            conName={selectedCon.conName}
          />
        ) : (
          <div className="relative text-sm text-primary-text flex h-full w-full items-center justify-center ">
            <div className="flex flex-col absolute bottom-0 gap-6">
              <div className="px-4 py-2 bg-primary-light w-fit rounded-lg relative">
                <h1> hi. select somethin to review! </h1>
                <div className="absolute right-16 -bottom-2 w-0 h-0 border-t-[10px] border-t-primary-light border-x-[10px] border-x-transparent" />
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
