// PAGE 4 of edit-con-modal. this is the form that lets people add a new convention

import { DialogFooter } from "@/components/ui/dialog";
import { EditModalState } from "../edit-con-modal";
import HeadersHelper from "../editor-helpers";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useShakeError from "@/hooks/use-shake-error";
import { handleSubmitWrapper } from "../handle-submit-wrapper";

export default function SubmitNewConPage({
  setPage,
  setRefreshKey,
}: {
  setPage: (p: EditModalState) => void;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const { error, shake, triggerError } = useShakeError();
  console.log(triggerError);

  const handleSubmit = async () => {
    await handleSubmitWrapper({
      setSubmitting,
      setPage,
      tryBlock: async () => {
        // reset states
        setRefreshKey((prev) => prev + 1);
      },
    });
  };

  return (
    <HeadersHelper title="Submit New Convention">
      <div>hey</div>

      <DialogFooter>
        <div className="flex flex-col gap-2 items-center">
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit New Convention"}
          </Button>
          {error && (
            <span
              id="aa-update-error"
              className={`text-sm ${shake && "animate-shake"} text-red-500`}
            >
              {error}
            </span>
          )}
        </div>
      </DialogFooter>
    </HeadersHelper>
  );
}
