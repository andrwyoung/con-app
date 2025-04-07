// login-modal is the modal itself. logic for each step is in ./steps
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";
import SignupStep from "./steps/signup-step";
import LoginStep from "./steps/login-step";
import EmailStep from "./steps/email-step";
import { AnimatePresence, motion } from "framer-motion";
import ResetPasswordStep from "./steps/reset-password-step";
import CheckEmailStep from "./steps/check-email-step";

export type authStep =
  | "email"
  | "login"
  | "signup"
  | "check-email"
  | "reset-password"
  | "closed";

export default function LoginModal() {
  const [step, setStep] = useState<authStep>("closed"); // which step to show?
  const [email, setEmail] = useState<string>(""); // keep track of email throughout flow
  const isOpen = step !== "closed";

  // function to push browser history when changing steps
  const changeStep = (newStep: authStep) => {
    window.history.pushState({ step: newStep }, "");
    setStep(newStep);
  };

  // listen for when the back button is pressed
  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const newStep = event.state?.step;

      // disallow going backwards if on these 2 steps
      if (step === "check-email" || step === "reset-password") {
        console.log("here!");
        window.history.pushState({ step }, "");
        return;
      }
      // if there's no more steps to go back to, then just close the modal
      if (!newStep) {
        setStep("closed");
        return;
      }

      setStep(newStep);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        console.log(open);
        if (!open) {
          setStep("closed"); // reset when closed
          window.history.replaceState({}, "", window.location.pathname); // reset history when closed
        }
      }}
    >
      <DialogTrigger
        onClick={() => {
          setStep("email");
          window.history.pushState({ step: "email" }, ""); // initial history state
        }}
      >
        <h1 className="text-white font-bold text-lg cursor-pointer transform-all duration-200 hover:scale-105 hover:text-primary">
          Login/Signup
        </h1>
      </DialogTrigger>
      <DialogContent>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
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
            {step === "reset-password" && <ResetPasswordStep email={email} />}
            {step === "check-email" && <CheckEmailStep />}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
