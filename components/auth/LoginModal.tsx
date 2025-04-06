import React, { useState } from "react";
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
import { FiArrowLeft } from "react-icons/fi";
import { ToggleGroup, ToggleGroupItem } from "../ui/ToggleGroup";
import { fireConfettiFromClick } from "@/lib/utils";

type Step = "email" | "login" | "signup";
type StepProps = {
  setStep: (step: Step) => void;
};

function AuthBackFooterButton({ setStep }: StepProps) {
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

function EmailStep({ setStep }: StepProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Enter Email to Continue</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4 mt-4">
        <Input placeholder="Enter Email" className="w-full" />
        <div className="flex items-baseline gap-4">
          <Button
            onClick={() => setStep("login")}
            className="font-semibold font-sans-header"
          >
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
      </div>
    </>
  );
}

function LoginStep({ setStep }: StepProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Welcome Back!</DialogTitle>
        {/* <DialogDescription>Welcome Back!</DialogDescription> */}
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-sm mt-4">
          <p>Password:</p>
          <Input placeholder="Enter Email" className="w-full" />
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

function SignupStep({ setStep }: StepProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Welcome!</DialogTitle>
        <DialogDescription>Help us get to know you a bit.</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-sm mt-4 w-full">
          <p>Username:</p>
          <Input placeholder="Pick a Unique Handle" />
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p>Password:</p>
          <Input placeholder="Pick a Strong Password" />
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
  const [step, setStep] = useState<Step>("email");

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
        {step === "email" && <EmailStep setStep={setStep} />}
        {step === "login" && <LoginStep setStep={setStep} />}
        {step === "signup" && <SignupStep setStep={setStep} />}
      </DialogContent>
    </Dialog>
  );
}
