"use client";
import React, { useState } from "react";
import { AuthFormLayout } from "../auth-helpers";
import { toast } from "sonner"; // or your toast lib
import { supabaseAnon } from "@/lib/supabase/client";

export default function CheckEmailStep({ email }: { email: string }) {
  const [cooldown, setCooldown] = useState(false);

  async function resendVerificationEmail() {
    if (cooldown) return;

    const { error } = await supabaseAnon.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false }, // prevents re-signup
    });

    if (error) {
      toast.error("Failed to resend email");
      console.error(error);
    } else {
      toast.success("Verification email sent!");
      setCooldown(true);
      setTimeout(() => setCooldown(false), 30000); // 30s cooldown
    }
  }

  return (
    <AuthFormLayout title="Signup Successful!">
      <p className="text-sm mb-4">
        <strong>Check your email</strong> to log in. We’re excited to have you!
      </p>

      <div className="flex flex-row text-xs text-primary-text gap-2">
        <p className="">Didn&apos;t receive anything?</p>
        <button
          type="button"
          disabled={cooldown}
          onClick={resendVerificationEmail}
          className="hover:underline font-semibold hover:text-primary-muted cursor-pointer"
        >
          {cooldown ? "Please wait..." : "Resend Email"}
        </button>
      </div>
    </AuthFormLayout>
  );
}
