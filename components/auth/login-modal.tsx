// login-modal is the modal itself. logic for each step is in ./steps
"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";
import SignupStep from "./steps/signup-step";
import LoginStep from "./steps/login-step";
import EmailStep from "./steps/email-step";
import { AnimatePresence, motion } from "framer-motion";

export type authStep =
  | "email"
  | "login"
  | "signup"
  | "check-email"
  | "reset-password"
  | "closed";

export default function LoginModal() {
  const [direction, setDirection] = useState<1 | 0>(1); // animate forward or backwards
  const [step, setStep] = useState<authStep>("email"); // which step to show?
  const [email, setEmail] = useState<string>(""); // keep track of email throughout flow
  const [isOpen, setIsOpen] = useState(false); // is the modal open?

  // push browser history when changing steps
  const changeStep = (newStep: authStep) => {
    setDirection(1);
    window.history.pushState({ step: newStep }, "");
    setStep(newStep);
  };

  // listen for when the back button is pressed
  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const step = event.state?.step;
      setDirection(0); // change animation type before switching screens

      // disallow going backwards if on these 2 steps
      if (step === "check-email" || step === "reset-password") {
        setIsOpen(false);
        return;
      }
      // if there's no more steps to go back to, then just close the modal
      if (!step) {
        setIsOpen(false);
        return;
      }

      setStep(step);
      setDirection(1);
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
          window.history.replaceState({}, "", window.location.pathname); // reset history when closed
        }
      }}
    >
      <DialogTrigger
        onClick={() => {
          setIsOpen(true);
          window.history.pushState({ modalOpen: true, step: "email" }, ""); // initial history state
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
            initial={{ x: direction * 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -50, opacity: 0 }}
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
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
