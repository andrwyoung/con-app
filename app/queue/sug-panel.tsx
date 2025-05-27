import { useState } from "react";
import { suggestionTypeLabels } from "@/types/admin-panel-types";
import { formatSubmittedAt } from "@/lib/helpers/time/date-formatters";
import FormatAASuggestion from "@/components/admin-panel/format-aa-suggestion";
import {
  ArtistAlleyInfoFields,
  NewConFields,
  NewYearInfoFields,
} from "@/types/suggestion-types";
import { GroupedSuggestion } from "./page";
import { AnimatePresence, motion } from "framer-motion";
import { FaCaretDown } from "react-icons/fa6";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user-store";
import { approveSuggestion } from "@/lib/admin/approve-suggestion";
import { rejectSuggestion } from "@/lib/admin/reject-suggestion";
import FormatNewYearSuggestion from "@/components/admin-panel/format-new-year";
import FormatNewConSuggestion from "@/components/admin-panel/format-new-con";
import { MinimumDetailPanelProps } from "@/stores/admin-panel-store";

function ToggleConGroup({
  conName,
  isNewCon,
  changes,
  children,
  defaultOpen,
}: {
  conName: string;
  isNewCon: boolean;
  changes: number;
  children: React.ReactNode;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-primary-text border-b flex items-center justify-between
        cursor-pointer hover:bg-primary-lightest py-1 px-3 rounded-lg transition-all duration-200"
      >
        <div className="flex flex-row gap-4 items-center">
          <h1 className="text-left text-lg font-semibold ">{conName}</h1>
          <p className="text-sm hidden lg:block">
            (
            {isNewCon
              ? "New Convention"
              : `${changes} change${changes !== 1 ? "s" : ""}`}
            )
          </p>
        </div>

        <div className="flex">
          <span className="text-sm text-muted-foreground ">
            <FaCaretDown
              className={`size-4 transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SuggestionPanel({
  suggestions,
  loading,
  refreshDetails,
  refetchSuggestions,
  setSelectedCon,
  removeSuggestion,
}: {
  suggestions: GroupedSuggestion[];
  loading: boolean;
  refreshDetails: () => void;
  refetchSuggestions: () => void;
  setSelectedCon: (s: MinimumDetailPanelProps | null) => void;
  removeSuggestion: (id: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [defaultOpenState, setDefaultOpenState] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  const { user, profile } = useUserStore();
  const isAdmin = profile?.role === "ADMIN";

  return (
    <>
      <div className="px-2 mb-4 flex justify-between">
        <h1 className="text-xl font-semibold text-primary-text">Suggestions</h1>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-primary-muted cursor-pointer px-2 py-1 text-xs bg-primary-lightest rounded-lg
        hover:text-pimary-text hover:bg-primary-light"
            onClick={() => {
              setDefaultOpenState(false);
              setResetKey((prev) => prev + 1);
            }}
          >
            Collapse All
          </button>

          <button
            type="button"
            className="hidden lg:block text-primary-muted cursor-pointer px-2 py-1 text-xs bg-primary-lightest rounded-lg
        hover:text-pimary-text hover:bg-primary-light"
            onClick={() => {
              setDefaultOpenState(true);
              setResetKey((prev) => prev + 1);
            }}
          >
            Open All
          </button>
          <button
            type="button"
            className="text-primary-muted cursor-pointer px-2 py-1 text-xs rounded-lg
        hover:text-pimary-text hover:bg-primary-light"
            onClick={refetchSuggestions}
          >
            Reload Panel
          </button>
        </div>
      </div>

      <div
        key={resetKey}
        className="p-6 flex flex-col 
      overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent"
      >
        {loading ? (
          <p>Loading...</p>
        ) : suggestions.length === 0 ? (
          <p>No pending suggestions!</p>
        ) : (
          <div className="space-y-6">
            {suggestions.map((group) => (
              <ToggleConGroup
                key={
                  group.conId ??
                  `new-${group.conName}-${group.suggestions[0]?.id}`
                }
                conName={group.conName}
                isNewCon={!group.conId}
                changes={group.suggestions.length}
                defaultOpen={defaultOpenState}
              >
                <div className="">
                  {/* <div className="text-lg font-bold text-primary-text border-b pb-1">
                  {group.conName}
                </div> */}

                  <div className="flex flex-col my-2">
                    {group.suggestions.map((sugg) => (
                      <>
                        <div
                          key={sugg.id}
                          className={`m-2  px-1 py-2 rounded-lg transition-all
                   text-sm flex flex-col gap-2 ring-2  ${
                     selectedId === sugg.id
                       ? " bg-secondary-light cursor-default ring-secondary"
                       : " cursor-pointer ring-primary-darker/40"
                   }`}
                          onClick={() => {
                            if (group.conName && group.conId) {
                              setSelectedCon({
                                conId: group.conId,
                                conName: group.conName,
                              });
                            } else {
                              setSelectedCon(null);
                            }
                            setSelectedId(sugg.id ?? null);
                          }}
                        >
                          <div className="flex flex-col lg:flex-row justify-between px-2 text-primary-text items-center lg:items-start gap-1">
                            <div className=" flex flex-row items-center gap-2">
                              <h1 className="font-semibold text-sm">
                                {suggestionTypeLabels[sugg.type]}
                              </h1>
                              {sugg.year && (
                                <h1 className="text-xs font-medium">
                                  ({sugg.year},
                                  {sugg.isCurrentYear && " latest year"})
                                </h1>
                              )}

                              {sugg.isNewYear && (
                                <div className="hidden lg:block rounded-full px-2 py-0.5 text-xs bg-green-200">
                                  New Year
                                </div>
                              )}
                            </div>

                            {isAdmin && user?.id && selectedId === sugg.id && (
                              <div className="flex gap-2 ">
                                <button
                                  className="px-3 py-1 text-xs cursor-pointer border-2 border-green-400 font-medium rounded-md bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const confirm = window.confirm(
                                      "Approve this suggestion and push changes?"
                                    );
                                    if (confirm) {
                                      await approveSuggestion(
                                        sugg,
                                        user.id,
                                        setSelectedCon
                                      );
                                      removeSuggestion(sugg.id);
                                      refreshDetails();
                                    }
                                  }}
                                >
                                  Approve
                                </button>
                                <button
                                  className="px-3 py-1 text-xs cursor-pointer border-2 border-rose-300 font-medium rounded-md bg-rose-100 text-rose-800 hover:bg-red-200 transition-colors"
                                  onClick={async (e) => {
                                    e.stopPropagation();

                                    await rejectSuggestion(
                                      sugg.type,
                                      sugg.id,
                                      user.id
                                    );
                                    removeSuggestion(sugg.id);
                                    toast.success("Suggestion Rejected");
                                  }}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>

                          <div
                            className={`flex flex-col gap-2 px-2 py-4
                           rounded-lg text-sm text-primary-text
                          ${
                            selectedId === sugg.id
                              ? "bg-secondary-lightest"
                              : "bg-primary-lightest/50"
                          }`}
                          >
                            {sugg.raw && sugg.type === "artist_alley" && (
                              <FormatAASuggestion
                                newInfo={sugg.raw as ArtistAlleyInfoFields}
                                changedFields={sugg.changedFields}
                              />
                            )}

                            {sugg.raw && sugg.type === "new_year" && (
                              <FormatNewYearSuggestion
                                newInfo={sugg.raw as NewYearInfoFields}
                                changedFields={sugg.changedFields}
                              />
                            )}

                            {sugg.raw && sugg.type === "new_con" && (
                              <FormatNewConSuggestion
                                newInfo={sugg.raw as NewConFields}
                              />
                            )}
                          </div>
                          <div className="text-xs px-2">
                            <p>
                              Submitted by: {sugg.submittedBy || "Anonymous"} at{" "}
                              {formatSubmittedAt(sugg.createdAt)}
                            </p>
                            {/* <p>Status: {sugg.approvalStatus}</p> */}
                          </div>
                        </div>
                      </>
                    ))}

                    {isAdmin && user?.id && (
                      <button
                        type="button"
                        className="self-end text-primary-muted transition-all hover:text-rose-400 hover:underline
                        rounded-lg cursor-pointer text-xs mr-4"
                        onClick={async () => {
                          const confirmed = confirm(
                            `Reject ALL suggestions for ${group.conName}?`
                          );
                          if (!confirmed) return;

                          for (const suggestion of group.suggestions) {
                            await rejectSuggestion(
                              suggestion.type,
                              suggestion.id,
                              user.id
                            );
                            removeSuggestion(suggestion.id);
                          }

                          toast.success(
                            `All suggestions for ${group.conName} rejected.`
                          );
                        }}
                      >
                        Reject All {group.conName} Suggestions
                      </button>
                    )}
                  </div>
                </div>
              </ToggleConGroup>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
