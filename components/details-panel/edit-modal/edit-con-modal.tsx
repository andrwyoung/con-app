// the all purpose panel to give suggestions for upcoming cons and stuff
// all logic is the corresponding pages

import { FullConventionDetails } from "@/types/types";
import { Dialog, DialogContent } from "../../ui/dialog";

import UpdateDatesPage from "./pages/update-dates-page";
import { AnimatePresence, motion } from "framer-motion";
import { useModalUIStore } from "@/stores/ui-store";
import EditorPage from "./pages/full-edit-page";
import ConfirmationPage from "./pages/confirmation-page";
import UpdateAAPage from "./pages/update-aa-page";

export type EditorSteps =
  | "dates"
  | "confirmation"
  | "editor"
  | "closed"
  | "year";

export default function EditConventionModal({
  conDetails,
}: {
  conDetails: FullConventionDetails;
}) {
  const page = useModalUIStore((s) => s.editingModalPage);
  const setPage = useModalUIStore((s) => s.setEditingModalPage);

  const isOpen = page !== "closed";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setPage("closed");
      }}
    >
      <DialogContent className="sm:max-w-[480px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {page === "dates" && (
              <UpdateDatesPage conDetails={conDetails} setPage={setPage} />
            )}
            {page === "editor" && (
              <EditorPage conDetails={conDetails} setPage={setPage} />
            )}
            {page === "year" && (
              <UpdateAAPage conDetails={conDetails} setPage={setPage} />
            )}
            {page === "confirmation" && <ConfirmationPage />}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
