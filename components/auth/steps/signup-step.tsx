import { useEffect, useRef, useState } from "react";
import { AuthFormLayout, PasswordToggleButton } from "../extras";
import { supabaseClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/Button";
import { fireConfettiFromClick } from "@/lib/utils";
import { authStep } from "../login-modal";
import React from "react";
import useShakeError from "@/hooks/useShakeError";
import { useUser } from "@/hooks/useUser";
import { signupUser } from "@/lib/actions/signup";

export const PERSONA = ["ATTENDEE", "ARTIST", "ORGANIZER"] as const;
export type Persona = (typeof PERSONA)[number];

export default function SignupStep({
  changeStep,
  email,
}: {
  changeStep: (step: authStep) => void;
  email: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error, setError, shake, triggerError } = useShakeError();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [persona, setPersona] = useState<Persona | null>(null);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isStrongPassword =
    hasMinLength && hasLowercase && hasUppercase && hasNumber;

  const user = useUser();

  // focus on Username field intially
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // checking username
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!username || username.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      setCheckingUsername(true);

      const { data, error } = await supabaseClient
        .from("user_profiles")
        .select("user_id")
        .eq("username", username)
        .single();

      if (error && error.code === "PGRST116") {
        // Not found = available
        setUsernameAvailable(true);
      } else {
        setUsernameAvailable(false);
      }
      setCheckingUsername(false);
    }, 400); // debounce

    return () => clearTimeout(delay);
  }, [username]);

  // what happens when the form is submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // validate the fields
    if (!usernameAvailable) {
      triggerError("That username is already taken.");
      setIsSubmitting(false);
      return;
    }
    if (!isStrongPassword) {
      triggerError("Please choose a stronger password.");
      setIsSubmitting(false);
      return;
    }
    if (!persona) {
      triggerError("Please choose a role.");
      setIsSubmitting(false);
      return;
    }
    const res = await signupUser({ email, password, username, persona });

    if (res.error) {
      triggerError(res.error);
      setIsSubmitting(false);
      return;
    }
    // const { data, error } = await supabaseClient.auth.signUp({
    //   email,
    //   password,
    // });

    // if (error) {
    //   if (/Email address\s+"[^"]+"\s+is invalid/i.test(error.message)) {
    //     triggerError("Please enter a valid email address.");
    //   } else if (error.message.includes("already registered")) {
    //     triggerError("This email is already in use.");
    //   } else {
    //     console.log(error);
    //     triggerError(error.message);
    //   }
    //   setIsSubmitting(false);
    //   return;
    // }

    // if (!error && data?.user) {
    //   const userId = data.user.id;
    //   console.log(user);

    //   const { error: profileError } = await supabaseClient
    //     .from("user_profiles")
    //     .insert({
    //       user_id: userId,
    //       username: username,
    //       persona: persona,
    //       role: "FREE",
    //     });

    //   if (profileError) {
    //     triggerError("Error saving user profile. Please try again.");
    //     console.log(profileError);
    //     setIsSubmitting(false);
    //     return;
    //   }
    // }

    fireConfettiFromClick();
    setIsSubmitting(false);
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
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 py-8">
          <div className="flex flex-col gap-2 text-sm">
            <Label>Choose a Username:</Label>
            <div className="relative">
              <Input
                ref={inputRef}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Pick a Unique Handle"
              />
              {username && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {checkingUsername ? (
                    <span className="text-primary-text animate-pulse">
                      Checking...
                    </span>
                  ) : usernameAvailable === true ? (
                    <span className="text-green-600 transition-opacity duration-300">
                      ✓ Available
                    </span>
                  ) : usernameAvailable === false ? (
                    <span className="text-red-500 transition-opacity duration-300">
                      ✖ Taken
                    </span>
                  ) : null}
                </div>
              )}
            </div>
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
            <p className="text-xs">
              At least{" "}
              <span
                className={hasMinLength ? "text-green-600" : "text-red-500"}
              >
                8 characters
              </span>{" "}
              and one{" "}
              <span
                className={hasUppercase ? "text-green-600" : "text-red-500"}
              >
                uppercase letter,{" "}
              </span>
              <span
                className={hasLowercase ? "text-green-600" : "text-red-500"}
              >
                lowercase letter,{" "}
              </span>
              <span className={hasNumber ? "text-green-600" : "text-red-500"}>
                and number.
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <p className="self-center text-sm">Choose your Role:</p>
            <ToggleGroup
              type="single"
              className="shadow-sm"
              onValueChange={(val: string | null) =>
                setPersona(val as typeof persona)
              }
            >
              {PERSONA.map((r) => (
                <ToggleGroupItem key={r} value={r}>
                  {r.charAt(0) + r.slice(1).toLowerCase()}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="font-semibold font-sans-header"
          >
            {isSubmitting ? "Submitting..." : "Signup!"}
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
      </form>
    </AuthFormLayout>
  );
}
