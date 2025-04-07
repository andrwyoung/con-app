"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";
import SignupStep from "./steps/signup-step";
import LoginStep from "./steps/login-step";
import EmailStep from "./steps/email-step";

export type authStep = "email" | "login" | "signup";

export default function LoginModal() {
  const [step, setStep] = useState<authStep>("email");
  const [email, setEmail] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  // create another browser history item when switching screens
  const changeStep = (newStep: authStep) => {
    window.history.pushState({ step: newStep }, "");
    setStep(newStep);
  };

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const step = event.state?.step;
      if (!step) {
        setIsOpen(false);
      } else {
        setStep(step);
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        console.log(open);
        setIsOpen(open);
        if (!open) {
          setStep("email"); // reset when closed
          window.history.replaceState({}, "", window.location.pathname);
        }
      }}
    >
      <DialogTrigger
        onClick={() => {
          setIsOpen(true);
          window.history.pushState({ modalOpen: true, step: "email" }, "");
        }}
      >
        <h1 className="text-white font-bold text-lg cursor-pointer transform-all duration-200 hover:scale-105 hover:text-primary">
          Login/Signup
        </h1>
      </DialogTrigger>
      <DialogContent>
        {step === "email" && (
          <EmailStep
            changeStep={changeStep}
            email={email}
            setEmail={setEmail}
          />
        )}
        {step === "login" && (
          <LoginStep changeStep={changeStep} email={email} />
        )}
        {step === "signup" && (
          <SignupStep changeStep={changeStep} email={email} />
        )}
      </DialogContent>
    </Dialog>
  );
}
