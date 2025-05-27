import { Dispatch, SetStateAction, useState } from "react";
import { suggestionTypeLabels } from "@/types/admin-panel-types";
import { formatSubmittedAt } from "@/lib/helpers/time/date-formatters";
import FormatAASuggestion from "@/components/admin-panel/format-aa-suggestion";
import { ArtistAlleyInfoFields } from "@/types/suggestion-types";
import { GroupedSuggestion } from "./page";
import { AnimatePresence, motion } from "framer-motion";
import { FaCaretDown } from "react-icons/fa6";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user-store";
import { approveSuggestion } from "@/lib/admin/approve-suggestion";
import { rejectSuggestion } from "@/lib/admin/reject-suggestion";

function ToggleConGroup({
  conName,
  isNewCon,
  changes,
  children,
}: {
  conName: string;
  isNewCon: boolean;
  changes: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-primary-text border-b flex items-center justify-between
        cursor-pointer hover:bg-secondary-lightest py-1 px-3 rounded-lg transition-all duration-200"
      >
        <div className="flex flex-row gap-4 items-center">
          <h1 className="text-left text-lg font-semibold ">{conName}</h1>
          <p className="text-sm">
            (
            {isNewCon
              ? "New Convention"
              : `${changes} change${changes !== 1 ? "s" : ""}`}
            )
          </p>
        </div>

        <span className="text-sm text-muted-foreground ">
          <FaCaretDown
            className={`size-4 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </span>
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
  setSelectedCon: Dispatch<SetStateAction<GroupedSuggestion | null>>;
  removeSuggestion: (id: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
            onClick={() => setResetKey((prev) => prev + 1)}
          >
            Collapse All
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
              >
                <div className="">
                  {/* <div className="text-lg font-bold text-primary-text border-b pb-1">
                  {group.conName}
                </div> */}

                  <div className="flex flex-col my-2">
                    {group.suggestions.map((sugg) => (
                      <div
                        key={sugg.id}
                        className={`m-2  px-1 py-2 rounded-lg transition-all
                   text-sm flex flex-col gap-2 ring-2 ring-secondary ${
                     selectedId === sugg.id
                       ? " bg-secondary-light cursor-default"
                       : " cursor-pointer "
                   }`}
                        onClick={() => {
                          if (sugg.conName && sugg.conId !== null) {
                            setSelectedCon(group);
                          }
                          setSelectedId(sugg.id ?? null);
                        }}
                      >
                        <div className="flex justify-between px-2  text-primary-text">
                          <div className="font-semibold text-md flex flex-row items-center gap-2">
                            <h1 className="font-semibold text-xs">
                              {suggestionTypeLabels[sugg.type]}
                            </h1>
                            <h1>{sugg.year && `(${sugg.year})`}</h1>
                            {sugg.isCurrentYear && (
                              <div className="rounded-full px-2 py-0.5 text-xs bg-green-200">
                                Latest Year
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
                                    await approveSuggestion(sugg, user.id);
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

                        {sugg.raw && sugg.currentYearData && (
                          <FormatAASuggestion
                            newInfo={sugg.raw as ArtistAlleyInfoFields}
                            changedFields={sugg.changedFields}
                          />
                        )}
                        <div className="text-xs px-2">
                          <p>
                            Submitted by: {sugg.submittedBy || "Anonymous"} at{" "}
                            {formatSubmittedAt(sugg.createdAt)}
                          </p>
                          {/* <p>Status: {sugg.approvalStatus}</p> */}
                        </div>
                      </div>
                    ))}
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
