// a lot of my submission forms have the same error and submission behaviors
// so this wrapper just helps keep it consistent

import { toast } from "sonner";
import { EditModalState } from "./edit-con-modal";

type SubmitWrapperProps = {
  setSubmitting: (val: boolean) => void;
  setPage: (page: EditModalState) => void;
  tryBlock: () => Promise<void>;
  errorMessage?: string;
};

export async function handleSubmitWrapper({
  setSubmitting,
  setPage,
  tryBlock,
  errorMessage = "Failed to submit suggestion",
}: SubmitWrapperProps) {
  setSubmitting(true);
  try {
    await tryBlock();
    setPage({ type: "confirmation" });
  } catch (error) {
    if (error instanceof Error && error.message === "Validation failed") {
      return;
    }
    console.error("Failed to submit update:", error);
    toast.error(errorMessage);
  } finally {
    setSubmitting(false);
  }
}
