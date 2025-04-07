import { AuthFormLayout } from "../extras";

export default function ResetPasswordStep({ email }: { email: string }) {
  return (
    <AuthFormLayout title="Password Reset">
      <p>
        We've sent an email to <strong>{email}</strong>
        <br /> Follow for instructions.
      </p>
    </AuthFormLayout>
  );
}
