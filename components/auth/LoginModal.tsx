import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "../ui/Dialog";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { ToggleGroup, ToggleGroupItem } from "../ui/ToggleGroup";
import { fireConfettiFromClick } from "@/lib/utils";
import { AuthBackFooterButton } from "./Extras";

export type authStep = "email" | "login" | "signup";
type SetStepFn = (step: authStep) => void;
type SetEmailFn = (email: string) => void;

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function EmailStep({
  setStep,
  email,
  setEmail,
}: {
  setStep: SetStepFn;
  email: string;
  setEmail: SetEmailFn;
}) {
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError("Please Enter a valid Email.");

      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    setError("");
    setStep("login");
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Enter Email to Continue</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
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
            onClick={() => setStep("signup")}
            type="button"
            className="underline cursor-pointer text-sm font-semibold text-primary-text hover:text-primary-muted"
          >
            Create Account
          </button>
        </div>
      </form>
    </>
  );
}

function LoginStep({ setStep, email }: { setStep: SetStepFn; email: string }) {
  const inputRef = useRef<HTMLInputElement>(null);

  // focus on (in this case it's the password form) on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Welcome Back!</DialogTitle>
        <DialogDescription>Logging in as: {email}</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-sm mt-4">
          <p>Password:</p>
          <Input
            placeholder="Enter Password"
            ref={inputRef}
            className="w-full"
            required
          />
        </div>
        <div className="flex justify-between gap-4">
          <Button
            onClick={() => setStep("login")}
            className="font-semibold font-sans-header"
          >
            Login
          </Button>
          <button
            className="text-xs text-primary-text underline self-start cursor-pointer hover:text-primary-muted"
            type="button"
          >
            Forgot Password?
          </button>
        </div>
      </div>
      <DialogFooter>
        <AuthBackFooterButton setStep={() => setStep("email")} />
      </DialogFooter>
    </>
  );
}

function SignupStep({ setStep, email }: { setStep: SetStepFn; email: string }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Welcome!</DialogTitle>
        <DialogDescription></DialogDescription>
        <DialogDescription>
          Help us get to know you a bit. <br />
          Signing up as: {email}
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-sm mt-4 w-full">
          <p>Username:</p>
          <Input ref={inputRef} placeholder="Pick a Unique Handle" required />
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p>Password:</p>
          <Input placeholder="Pick a Strong Password" required />
        </div>
        <p className="self-center text-sm">I am a:</p>
        <ToggleGroup type="single">
          <ToggleGroupItem value="a">Attendee</ToggleGroupItem>
          <ToggleGroupItem value="b">Artist/Vendor</ToggleGroupItem>
          <ToggleGroupItem value="c">Organizer</ToggleGroupItem>
        </ToggleGroup>
        <div className="flex items-baseline gap-4">
          <Button
            onClick={(e) => {
              setStep("signup");
              fireConfettiFromClick(e);
            }}
            className="font-semibold font-sans-header"
          >
            Signup!
          </Button>
        </div>

        <DialogFooter>
          <AuthBackFooterButton setStep={() => setStep("email")} />
        </DialogFooter>
      </div>
    </>
  );
}

export default function LoginModal() {
  const [step, setStep] = useState<authStep>("email");
  const [email, setEmail] = useState<string>("");

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) setStep("email"); // Reset when closed
      }}
    >
      <DialogTrigger>
        <h1 className="text-white font-bold text-lg cursor-pointer transform-all duration-200 hover:scale-105 hover:text-primary">
          Login/Signup
        </h1>
      </DialogTrigger>
      <DialogContent>
        {step === "email" && (
          <EmailStep setStep={setStep} email={email} setEmail={setEmail} />
        )}
        {step === "login" && <LoginStep setStep={setStep} email={email} />}
        {step === "signup" && <SignupStep setStep={setStep} email={email} />}
      </DialogContent>
    </Dialog>
  );
}
