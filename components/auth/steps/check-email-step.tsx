import React from "react";
import { AuthFormLayout } from "../extras";

export default function CheckEmailStep() {
  return (
    <AuthFormLayout title="Signup Successful!">
      <p className="text-sm">
        <strong>Check your email</strong> to log in. We’re excited to have you!
      </p>
    </AuthFormLayout>
  );
}
