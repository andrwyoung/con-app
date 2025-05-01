import { toast } from "sonner";
import { EditorSteps } from "../../edit-con-modal";

type SubmitWrapperProps = {
  setSubmitting: (val: boolean) => void;
  setPage: (page: EditorSteps) => void;
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
    setPage("confirmation");
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
