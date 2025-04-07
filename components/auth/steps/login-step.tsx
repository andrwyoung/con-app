import { useEffect, useRef, useState } from "react";
import { authStep } from "../login-modal";
import { AuthFormLayout, PasswordToggleButton } from "../extras";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabaseClient } from "@/lib/supabase/client";
import React from "react";
import useShakeError from "@/hooks/use-shake-error";
import { fireConfetti } from "@/lib/utils";
import { translateAuthError } from "@/lib/translate-auth-errors";

export default function LoginStep({
  changeStep,
  email,
}: {
  changeStep: (step: authStep) => void;
  email: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error, setError, shake, triggerError } = useShakeError();

  const [isSendingPasswordReset, setIsSendingPasswordReset] = useState(false);

  // focus on (in this case it's the password form) on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      //   console.log(error);
      triggerError(error.message);
      setIsSubmitting(false);
      return;
    }

    setError("");
    console.log(data);
    console.log(supabaseClient.auth.getSession);
    setIsSubmitting(false);

    fireConfetti();
    changeStep("closed");
  };

  const handleResetPassword = async () => {
    setIsSendingPasswordReset(true);
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
    if (error) {
      console.error(error);
      setError(error.message);
      setIsSendingPasswordReset(false);
      return;
    }

    setIsSendingPasswordReset(false);
    window.history.pushState({}, "", window.location.pathname);
    changeStep("reset-password");
  };

  return (
    <AuthFormLayout
      title="Welcome Back!"
      description={
        <span>
          Logging in as: <strong>{email}</strong>
        </span>
      }
      onBack={changeStep}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-sm">
          <Label>Password:</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              ref={inputRef}
            />
            <PasswordToggleButton
              show={showPassword}
              toggle={() => setShowPassword((prev) => !prev)}
            />
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <div className="flex items-baseline gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="font-semibold font-sans-header"
            >
              {isSubmitting ? "Submitting..." : "Login"}
            </Button>
            {error && (
              <span
                id="email-error"
                className={`text-sm ${shake && "animate-shake"} text-red-500`}
              >
                {error}
              </span>
            )}
          </div>
          <div className="flex flex-col items-end">
            <button
              className="text-xs text-primary-text underline cursor-pointer hover:text-primary-muted"
              type="button"
              onClick={handleResetPassword}
            >
              {isSendingPasswordReset ? "Sending Email..." : "Forgot Password"}
            </button>
            <button
              type="button"
              onClick={() => changeStep("signup")}
              className="text-xs"
            >
              or{" "}
              <span className="text-primary-text underline cursor-pointer hover:text-primary-muted">
                Create Account
              </span>
            </button>
          </div>
        </div>
      </form>
    </AuthFormLayout>
  );
}
