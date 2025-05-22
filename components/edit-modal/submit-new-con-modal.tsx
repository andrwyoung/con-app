// PAGE 4 of edit-con-modal. this is the form that lets people add a new convention

import { Dialog, DialogContent } from "@/components/ui/dialog";
import HeadersHelper from "./editor-helpers";
import { useState } from "react";
import { useFormReducer } from "@/lib/editing/reducer-helper";
import NewConGeneralPage from "./new-con-pages.tsx/general-page";
import NewConDatesLoc from "./new-con-pages.tsx/date-loc-page";
import { useModalUIStore } from "@/stores/ui-store";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useUserStore } from "@/stores/user-store";
import { supabaseAnon } from "@/lib/supabase/client";
import {
  NewConFields,
  SuggestionsMetadataFields,
} from "@/types/suggestion-types";
import { buildInitialMetadata } from "@/lib/editing/approval-metadata";
import { NewConState } from "@/types/editor-types";
import { pushNewConvention } from "@/lib/actions/push-new-con";

export type newConPageMode = "general" | "dates_loc" | "confirmation";

export default function SubmitNewConPage() {
  const isOpen = useModalUIStore((s) => s.newConOpen);
  const setIsOpen = useModalUIStore((s) => s.setNewConOpen);

  const [submitting, setSubmitting] = useState(false);
  const [editPagePage, setEditPagePage] = useState<newConPageMode>("general");

  const { user, profile } = useUserStore();
  const isAdmin = profile?.role === "ADMIN";

  // SECTION: reducer

  const newConFields: NewConState = {
    conName: "",
    website: "",
    description: "",
    year: undefined,
    start_date: undefined,
    end_date: undefined,
    venue: "",
    location: "",
    latLong: {
      lat: undefined,
      long: undefined,
    },
  };

  const { state, setField, reset } = useFormReducer<NewConState>(newConFields, {
    latLong: (a, b) => a.lat === b.lat && a.long === b.long,
  });

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      // first submit the suggestion to new con table
      const initMetadata: SuggestionsMetadataFields = buildInitialMetadata(
        user?.id ?? null
      );

      if (
        !state.current.latLong.lat ||
        !state.current.latLong.long ||
        !state.current.year ||
        !state.current.start_date
      )
        throw new Error("Location and Date can't be undefined");

      const payload: NewConFields = {
        // conventions
        convention_name: state.current.conName,
        website: state.current.website,
        cs_description: state.current.description,

        venue: state.current.venue,
        location: state.current.location,
        location_lat: state.current.latLong.lat,
        location_long: state.current.latLong.long,

        // convention_years
        year: state.current.year,
        start_date: state.current.start_date,
        end_date: state.current.end_date,
      };
      console.log("submitting new con: ", payload);

      const { data: suggestionInsert, error: insertError } = await supabaseAnon
        .from("submit_new_con")
        .insert({
          ...payload,
          ...initMetadata,
        })
        .select()
        .single();
      if (insertError) throw insertError;
      toast.success("Suggestion submitted succussfully!");

      // then if admin actually submit the real thing
      if (user && isAdmin) {
        const confirmed = confirm(`Admin: Push real changes too?`);
        if (!confirmed) {
          reset(); // reset all the fields
          setSubmitting(false);
          setEditPagePage("confirmation");
          return;
        }

        await pushNewConvention(payload, suggestionInsert.id, user.id);
      }
    } catch (error) {
      setSubmitting(false);
      console.error("Failed to submit update:", error);
      toast.error("Failed to submit");
      return;
    }

    reset(); // reset all the fields
    setSubmitting(false);
    setEditPagePage("confirmation");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setEditPagePage("general");
        reset(); // reset all fields
        if (!open) {
          setIsOpen(false);
          setSubmitting(false);
        }
      }}
    >
      <DialogContent className="sm:max-w-[480px] overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={editPagePage}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {editPagePage === "general" && (
              <HeadersHelper
                title="Submit New Convention"
                description="Page 1/2"
              >
                <NewConGeneralPage
                  handleNextPage={() => setEditPagePage("dates_loc")}
                  state={state}
                  setField={setField}
                />
              </HeadersHelper>
            )}
            {editPagePage === "dates_loc" && (
              <HeadersHelper
                title="Submit New Convention"
                description="Page 2/2"
              >
                <NewConDatesLoc
                  submitting={submitting}
                  handleSubmit={handleSubmit}
                  onBack={() => setEditPagePage("general")}
                  state={state}
                  setField={setField}
                />
              </HeadersHelper>
            )}
            {editPagePage === "confirmation" && (
              <HeadersHelper title="Thanks for your help!">
                <div className="text-sm">
                  Thanks for submitting a new convention. You can track your
                  submission{" "}
                  <Link
                    href="/queue"
                    target="_blank"
                    className="underline text-secondary-darker hover:text-secondary transition-colors"
                  >
                    here
                  </Link>
                  . We&apos;ll be sure to get to it!
                </div>
              </HeadersHelper>
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
