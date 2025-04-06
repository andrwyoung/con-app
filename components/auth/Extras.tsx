import { FiArrowLeft } from "react-icons/fi";
import { authStep } from "./LoginModal";

export function AuthBackFooterButton({
  setStep,
}: {
  setStep: (step: authStep) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => setStep("email")}
      className="flex flex-row items-center opacity-40 gap-1 cursor-pointer transform-colors hover:opacity-70"
    >
      <FiArrowLeft />
      <p className="transform -translate-y-[1px]">back</p>
    </button>
  );
}
