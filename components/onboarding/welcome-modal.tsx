"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useUserStore } from "@/stores/user-store";
import { Button } from "../ui/button";
import { FiMapPin } from "react-icons/fi";
import { motion } from "framer-motion";
import { miniConfetti } from "@/lib/utils";
import { supabaseAnon } from "@/lib/supabase/client";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);

  useEffect(() => {
    if (!profile || profile.has_never_logged_in === false) return;

    // delay so login isn't so jarring
    const timeout = setTimeout(async () => {
      miniConfetti();
      setOpen(true);

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
        console.log(error.message);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [profile, setProfile]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <p>
              Start looking for conventions...or something lol.
              <br />
              <br /> This is just a placeholder for onboarding.... so let me
              know if popup shows up more than once haha.
            </p>

            <Button className="max-w-24" onClick={() => setOpen(false)}>
              <FiMapPin /> Done
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
