"use client";
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useUserStore } from "@/stores/user-store";
import { Button } from "../ui/button";
import { FiMapPin } from "react-icons/fi";
import { motion } from "framer-motion";
import { miniConfetti } from "@/lib/utils";
import { supabaseAnon } from "@/lib/supabase/client";
import { useModalUIStore } from "@/stores/ui-store";

export default function WelcomeModal() {
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);

  const { setOnboardingOpen, onboardingOpen } = useModalUIStore();

  useEffect(() => {
    if (!profile || profile.has_never_logged_in === false) return;

    // delay so login isn't so jarring
    const timeout = setTimeout(async () => {
      miniConfetti();
      setOnboardingOpen(true);

      // set local store to not show the welcome message again
      setProfile({
        ...profile,
        has_never_logged_in: false,
      });

      // sync to actual database
      const { error } = await supabaseAnon
        .from("user_profiles")
        .update({ has_never_logged_in: false })
        .eq("user_id", profile.user_id);

      if (error) {
        console.error(error.message);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [profile, setProfile, setOnboardingOpen]);

  return (
    <Dialog open={onboardingOpen} onOpenChange={setOnboardingOpen}>
      <DialogContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <DialogHeader>
            <DialogTitle />
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <h1 className="text-3xl font-semibold">Welcome to ConCaly!</h1>
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <video
                src="/welcome-vid.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full max-w-md rounded-xl shadow-md"
              />
            </motion.div>

            <p className="leading-loose">
              Start building your plan on the Explore page! <br />
              Drag and drop cons you&apos;re interested in to build your
              schedule.
            </p>

            <Button className="" onClick={() => setOnboardingOpen(false)}>
              <FiMapPin /> Get Started
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
