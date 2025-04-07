import React from "react";
import { AuthFormLayout } from "../extras";

export default function CheckEmailStep() {
  return (
    <AuthFormLayout
      title="Signup Successful!"
      description={<>So excited to have you.</>}
    >
      <p className="text-sm">
        Check your email for a confirmation. And then Login.
      </p>
    </AuthFormLayout>
  );
}
