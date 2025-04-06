"use client";
import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { fireConfettiFromClick } from "@/lib/utils";
import { AuthFormLayout, PasswordToggleButton } from "./Extras";
import { Label } from "../ui/label";
import { createClient } from "@/lib/supabase/client";

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
            onClick={() => setStep("signup")}
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

function LoginStep({ setStep, email }: { setStep: SetStepFn; email: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  // focus on (in this case it's the password form) on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <AuthFormLayout
      title="Welcome Back!"
      description={
        <span>
          Logging in as: <strong>{email}</strong>
        </span>
      }
      onBack={setStep}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="flex flex-col gap-4"
      >
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
      </form>
    </AuthFormLayout>
  );
}

function SignupStep({ setStep, email }: { setStep: SetStepFn; email: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ATTENDEE" | "ARTIST" | "ORGAINZER" | null>(
    null
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role,
        },
      },
    });

    if (error) {
      console.error("Signup error:", error.message);
      return;
    }

    // if (!isValidEmail(email)) {
    //   setError("Please Enter a valid Email.");

    //   setShake(true);
    //   setTimeout(() => setShake(false), 400);
    //   return;
    // }

    // setError("");
    // setStep("login");
  };

  return (
    <AuthFormLayout
      title="Welcome!"
      description={
        <>
          Help us get to know you a bit.
          <br />
          Signing up as: <strong>{email}</strong>
        </>
      }
      onBack={setStep}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 py-8">
          <div className="flex flex-col gap-2 text-sm">
            <Label>Choose a Username:</Label>
            <Input
              ref={inputRef}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Pick a Unique Handle"
              required
            />
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Label>Choose a Password:</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Pick a Strong Password"
              />
              <PasswordToggleButton
                show={showPassword}
                toggle={() => setShowPassword((prev) => !prev)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="self-center text-sm">I am a:</p>
            <ToggleGroup
              type="single"
              // onChange={(val: string | null) => setRole(val as typeof role)}
            >
              <ToggleGroupItem value="ATTENDEE">Attendee</ToggleGroupItem>
              <ToggleGroupItem value="ARTIST">Artist/Vendor</ToggleGroupItem>
              <ToggleGroupItem value="ORGANIZER">Organizer</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className="flex items-baseline gap-4">
          <Button
            onClick={(e) => {
              // setStep("signup");
              fireConfettiFromClick(e);
            }}
            className="font-semibold font-sans-header"
          >
            Signup!
          </Button>
        </div>
      </form>
    </AuthFormLayout>
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
