import { AuthFormLayout } from "../../extras";

export default function ResetPasswordStep({ email }: { email: string }) {
  return (
    <AuthFormLayout title="Password Reset">
      <p>
        We just sent an email to <strong>{email}</strong>
        <br /> Check your inbox and follow the steps to create a new password.
      </p>
    </AuthFormLayout>
  );
}
