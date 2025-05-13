import { toast } from "sonner";
import { EditModalState } from "../../edit-con-modal";

type SubmitWrapperProps = {
  setSubmitting: (val: boolean) => void;
  setPage: (page: EditModalState) => void;
  tryBlock: () => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
};

export async function handleSubmitWrapper({
  setSubmitting,
  setPage,
  tryBlock,
  successMessage = "Suggestion submitted!",
  errorMessage = "Failed to submit suggestion",
}: SubmitWrapperProps) {
  setSubmitting(true);
  try {
    await tryBlock();
    toast.success(successMessage);
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
