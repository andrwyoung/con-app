// the all purpose panel to give suggestions for upcoming cons and stuff
// all logic is the corresponding pages

import { FullConventionDetails } from "@/types/con-types";
import { Dialog, DialogContent } from "../ui/dialog";

import SubmitNewYearPage from "./pages/submit-new-year-page";
import { AnimatePresence, motion } from "framer-motion";
import { useModalUIStore } from "@/stores/ui-store";
import UpdateConDetailsPage from "./pages/update-con-details-page";
import ConfirmationPage from "./pages/confirmation-page";
import UpdateAAPage from "./pages/update-aa-page";
import { useUserStore } from "@/stores/user-store";
import { useEffect, useState } from "react";

export type EditModalState =
  | { type: "closed" }
  | { type: "editor" }
  | { type: "dates" }
  | { type: "confirmation" }
  | { type: "year"; year: number };

export default function EditConventionModal({
  conDetails,
  onSubmitSuccess,
}: {
  conDetails: FullConventionDetails;
  onSubmitSuccess: () => void;
}) {
  const page = useModalUIStore((s) => s.editModalState);
  const setPage = useModalUIStore((s) => s.setEditModalState);
  const profile = useUserStore((s) => s.profile);
  const isAdmin = profile?.role == "ADMIN" || profile?.role == "SUDO";

  const isOpen = page.type !== "closed";

  const [refreshKey, setRefreshKey] = useState(0);

  // reload everytime we swap
  useEffect(() => {
    if (page.type === "editor" || page.type === "confirmation") {
      onSubmitSuccess();
    }
  }, [page, onSubmitSuccess]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setPage({ type: "closed" });
      }}
    >
      <DialogContent className="sm:max-w-[480px]">
        {page.type != "confirmation" && (
          <div className="absolute bottom-4 right-4 text-xs text-primary-muted/50 flex flex-col text-right">
            {isAdmin && <span className="uppercase">Admin</span>}
            <span>Editing as: </span>
            {profile ? <span>{profile.username}</span> : "Anonymous"}
          </div>
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page.type}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {page.type === "dates" && (
              <SubmitNewYearPage
                conDetails={conDetails}
                setPage={setPage}
                key={`newyear-${refreshKey}`} // refreshing state on new submit
                setRefreshKey={setRefreshKey}
              />
            )}
            {page.type === "editor" && (
              <UpdateConDetailsPage
                conDetails={conDetails}
                setPage={setPage}
                key={`editor-${refreshKey}`} // refreshing state on new submit
                setRefreshKey={setRefreshKey}
              />
            )}
            {page.type === "year" && (
              <UpdateAAPage
                conDetails={conDetails}
                setPage={setPage}
                key={`aa-${refreshKey}`} // refreshing state on new submit
                setRefreshKey={setRefreshKey}
                year={page.year}
              />
            )}
            {page.type === "confirmation" && (
              <ConfirmationPage conDetails={conDetails} />
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
