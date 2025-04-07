import { AuthFormLayout } from "../extras";

export default function ResetPasswordStep({ email }: { email: string }) {
  return (
    <AuthFormLayout title="Password Reset">
      <p>
        We just sent an email to <strong>{email}</strong>
        <br /> Follow it for instructions!
      </p>
    </AuthFormLayout>
  );
}
