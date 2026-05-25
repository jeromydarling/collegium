import { useState } from "react";
import { Link } from "react-router-dom";
import { useCollegiumAuth } from "../../lib/auth/CollegiumAuthContext";
import {
  AuthLayout,
  FormField,
  SubmitButton,
  ErrorBanner,
  SuccessBanner,
} from "./AuthLayout";

export function ForgotPassword() {
  const { resetPassword } = useCollegiumAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await resetPassword(email);
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll send you a link to set a new one."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/auth/sign-in" className="collegium-link">
            Back to sign in
          </Link>
        </>
      }
    >
      <ErrorBanner message={error} />
      {sent ? (
        <SuccessBanner
          message={`If an account exists for ${email}, a reset link is on its way. Check your inbox — the link expires in one hour.`}
        />
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <FormField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />
          <SubmitButton busy={busy} disabled={!email}>
            Send reset link
          </SubmitButton>
        </form>
      )}
    </AuthLayout>
  );
}
