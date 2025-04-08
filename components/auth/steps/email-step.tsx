import { useState } from "react";
import { authStep } from "../login-modal";
import { AuthFormLayout } from "../../extras";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function EmailStep({
  changeStep,
  email,
  setEmail,
}: {
  changeStep: (step: authStep) => void;
  email: string;
  setEmail: (email: string) => void;
}) {
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const validateEmail = () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email.");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) return;
    changeStep("login");
  };

  return (
    <AuthFormLayout title="Enter Email to Continue">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Input
            value={email}
            placeholder={"Enter Email"}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full ${shake && "animate-shake"}`}
            aria-invalid={!!error}
            aria-describedby={error ? "email-error" : undefined}
          />
          {error && (
            <span id="email-error" className="text-sm text-red-500">
              {error}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-4">
          <Button type="submit" className="font-semibold font-sans-header">
            Continue to Login
          </Button>
          <p className="text-sm">or</p>
          <button
            onClick={() => {
              if (!validateEmail()) return;
              changeStep("signup");
            }}
            type="button"
            className="underline cursor-pointer text-sm font-semibold text-primary-text hover:text-primary-muted"
          >
            Create Account
          </button>
        </div>
      </form>
    </AuthFormLayout>
  );
}
