import { FiArrowLeft } from "react-icons/fi";
import { authStep } from "./login-modal";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";

export function AuthFormLayout({
  title,
  description,
  haveBackButton = false,
  children,
}: {
  title: string;
  description?: React.ReactElement;
  haveBackButton?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      <div className="flex flex-col gap-4 mt-4 w-full">{children}</div>
      <DialogFooter>{haveBackButton && <AuthBackFooterButton />}</DialogFooter>
    </>
  );
}

export function PasswordToggleButton({
  show,
  toggle,
}: {
  show: boolean;
  toggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm cursor-pointer text-primary-text hover:text-primary-muted"
    >
      {show ? "Hide" : "Show"}
    </button>
  );
}

export function AuthBackFooterButton() {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className="flex flex-row items-center opacity-40 gap-1 cursor-pointer transform-colors hover:opacity-70"
    >
      <FiArrowLeft />
      <p className="transform -translate-y-[1px]">back</p>
    </button>
  );
}
